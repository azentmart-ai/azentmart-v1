from datetime import date,timedelta
from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..dependencies import current_user,is_hr
from ..models import Attendance,Employee,Leave,Onboarding,Payroll,Ticket,Document
router=APIRouter(prefix='/reports',tags=['Reports'])
def scoped_employees(db,user):
 q=db.query(Employee)
 if not is_hr(user):q=q.filter(Employee.user_id==user.id)
 return q
@router.get('/dashboard')
def dashboard(db:Session=Depends(get_db),user=Depends(current_user)):
 eq=scoped_employees(db,user); employees=eq.count();active=eq.filter(Employee.status=='Active').count();month_start=date.today().replace(day=1);new_joiners=eq.filter(Employee.join_date>=month_start).count()
 aq=db.query(Attendance).filter(Attendance.work_date==date.today());lq=db.query(Leave).filter(Leave.status=='Pending');oq=db.query(Onboarding).filter(Onboarding.status!='Completed');pq=db.query(Payroll).filter(Payroll.month==date.today().strftime('%Y-%m'));tq=db.query(Ticket).filter(Ticket.status.notin_(['Closed','Resolved']))
 if not is_hr(user):
  eid=db.query(Employee.id).filter(Employee.user_id==user.id).scalar() or -1;aq=aq.filter(Attendance.employee_id==eid);lq=lq.filter(Leave.employee_id==eid);oq=oq.filter(Onboarding.employee_id==eid);pq=pq.filter(Payroll.employee_id==eid);tq=tq.filter(Ticket.user_id==user.id)
 present=aq.filter(Attendance.status=='Present').count(); total_att=aq.count(); rate=round((present/total_att)*100,1) if total_att else 0
 payroll_total=sum(float(x.net_pay or 0) for x in pq.all())
 return {'employees':employees,'active_employees':active,'new_joiners':new_joiners,'present_today':present,'attendance_rate':rate,'pending_leave':lq.count(),'onboarding':oq.count(),'payroll_total':payroll_total,'support_open':tq.count(),'documents_pending':db.query(Document).filter(Document.status.in_(['Pending','Under Review'])).count() if is_hr(user) else 0,'recent_activity':[],'birthdays':[],'anniversaries':[]}
@router.get('/summary')
def summary(db:Session=Depends(get_db),user=Depends(current_user)):
 d=dashboard(db,user);return {'employees':d['employees'],'attendance':d['present_today'],'pending_leave':d['pending_leave'],'onboarding':d['onboarding']}

from io import BytesIO
from fastapi.responses import StreamingResponse
from openpyxl import Workbook
import csv

@router.get("/export.csv")
def export_csv(db:Session=Depends(get_db), user=Depends(current_user)):
    rows = scoped_employees(db,user).order_by(Employee.id).all()
    buffer = BytesIO()
    text = __import__("io").StringIO()
    writer = csv.writer(text)
    writer.writerow(["Employee ID","Name","Email","Phone","Department","Designation","Location","Joining Date","Status"])
    for e in rows:
        writer.writerow([e.id,e.name,e.email,e.phone,e.department,e.designation,e.location,e.join_date,e.status])
    return StreamingResponse(iter([text.getvalue().encode("utf-8-sig")]), media_type="text/csv", headers={"Content-Disposition":"attachment; filename=hr-report.csv"})

@router.get("/export.xlsx")
def export_xlsx(db:Session=Depends(get_db), user=Depends(current_user)):
    rows = scoped_employees(db,user).order_by(Employee.id).all()
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Employees"
    sheet.append(["Employee ID","Name","Email","Phone","Department","Designation","Location","Joining Date","Status"])
    for e in rows:
        sheet.append([e.id,e.name,e.email,e.phone,e.department,e.designation,e.location,str(e.join_date),e.status])
    buffer = BytesIO()
    workbook.save(buffer)
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers={"Content-Disposition":"attachment; filename=hr-report.xlsx"})
