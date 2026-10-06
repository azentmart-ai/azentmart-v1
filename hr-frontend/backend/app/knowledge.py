import json,os,urllib.request
from sqlalchemy import text
from sqlalchemy.orm import Session
from .db.models.knowledge import KnowledgeChunk

def embed(text_value:str):
    key=os.getenv('OPENAI_API_KEY')
    if not key:return None
    body=json.dumps({'model':os.getenv('OPENAI_EMBEDDING_MODEL','text-embedding-3-small'),'input':text_value}).encode()
    req=urllib.request.Request('https://api.openai.com/v1/embeddings',data=body,headers={'Authorization':f'Bearer {key}','Content-Type':'application/json'},method='POST')
    with urllib.request.urlopen(req,timeout=30) as r:return json.loads(r.read())['data'][0]['embedding']

def chunks(text_value:str,size:int=1200,overlap:int=150):
    text_value=' '.join(text_value.split());out=[];start=0
    while start<len(text_value):
        end=min(len(text_value),start+size);out.append(text_value[start:end]);
        if end==len(text_value):break
        start=max(end-overlap,start+1)
    return out

def ingest(db:Session,source_type:str,title:str,content:str,source_id:int|None=None):
    db.query(KnowledgeChunk).filter(KnowledgeChunk.source_type==source_type,KnowledgeChunk.source_id==source_id).delete(synchronize_session=False)
    for part in chunks(content):
        db.add(KnowledgeChunk(source_type=source_type,source_id=source_id,title=title,content=part,embedding=embed(part)))
    db.commit()

def retrieve(db:Session,query:str,limit:int=5):
    vector=embed(query)
    if vector:
        try:
            rows=db.query(KnowledgeChunk).filter(KnowledgeChunk.embedding.isnot(None)).order_by(KnowledgeChunk.embedding.cosine_distance(vector)).limit(limit).all()
            return rows
        except Exception:
            db.rollback()
    term=f'%{query.strip()[:100]}%'
    return db.query(KnowledgeChunk).filter(KnowledgeChunk.content.ilike(term)|KnowledgeChunk.title.ilike(term)).limit(limit).all()
