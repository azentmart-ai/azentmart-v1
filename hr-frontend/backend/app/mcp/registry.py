from ..dependencies import is_hr
from ..models import Attendance,Document,Employee,Leave,Onboarding,Payroll,Policy,Ticket

def employee_lookup(db,user,employee_id=None,query=None):
    q=db.query(Employee)
    if not is_hr(user):q=q.filter(Employee.user_id==user.id)
    if employee_id:q=q.filter(Employee.id==employee_id)
    elif query:
        term=f'%{query}%';q=q.filter((Employee.name.ilike(term))|(Employee.email.ilike(term)))
    return [{"id":e.id,"name":e.name,"email":e.email,"department":e.department,"designation":e.designation,"status":e.status} for e in q.limit(10).all()]

def policy_search(db,user,query):
    term=f'%{query}%';return [{"id":p.id,"title":p.title,"version":p.version,"description":p.description} for p in db.query(Policy).filter((Policy.title.ilike(term))|(Policy.description.ilike(term))).limit(10).all()]

def employee_context(db,user,employee_id):
    employee=employee_lookup(db,user,employee_id=employee_id)
    if not employee:return None
    e=db.get(Employee,employee_id);return {"employee":employee[0],"attendance":[{"date":str(x.work_date),"status":x.status,"check_in":x.check_in,"check_out":x.check_out} for x in db.query(Attendance).filter(Attendance.employee_id==e.id).order_by(Attendance.id.desc()).limit(30)],"leave":[{"type":x.leave_type,"start":str(x.start_date),"end":str(x.end_date),"status":x.status} for x in db.query(Leave).filter(Leave.employee_id==e.id).order_by(Leave.id.desc()).limit(30)],"payroll":[{"month":x.month,"net_pay":x.net_pay,"status":x.status} for x in db.query(Payroll).filter(Payroll.employee_id==e.id).order_by(Payroll.id.desc()).limit(12)],"documents":[{"title":x.title,"status":x.status} for x in db.query(Document).filter(Document.employee_id==e.id).limit(30)],"onboarding":[{"progress":x.progress,"status":x.status} for x in db.query(Onboarding).filter(Onboarding.employee_id==e.id).all()]}

def tool_catalog():
    return [{"name":"employee_lookup","scope":"employee:self/hr"},{"name":"policy_search","scope":"all authenticated users"},{"name":"employee_context","scope":"employee:self/hr"},{"name":"create_support_ticket","scope":"all authenticated users"}]
