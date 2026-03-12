from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
import uuid

app = FastAPI(title="Student Performance Tracker API")

# Setup CORS to allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes (mounted at /api for production, and at root for local dev)
api = APIRouter(tags=["api"])

# Models
class StudentBase(BaseModel):
    name: str
    courses: List[str]

class Student(StudentBase):
    id: str

class Grade(BaseModel):
    student_id: str
    course: str
    score: float

class WeakSubject(BaseModel):
    course: str
    score: float

class Insight(BaseModel):
    student_id: str
    student_name: str
    weak_subjects: List[WeakSubject]
    recommendations: List[str]

# In-memory storage
students_db: Dict[str, Student] = {}
grades_db: List[Grade] = []

# Dummy initial data
def initialize_data():
    s1_id = str(uuid.uuid4())
    s2_id = str(uuid.uuid4())
    
    students_db[s1_id] = Student(id=s1_id, name="Alice Brown", courses=["Math", "Science", "History"])
    students_db[s2_id] = Student(id=s2_id, name="Bob Smith", courses=["Math", "Science", "English"])
    
    initial_grades = [
        Grade(student_id=s1_id, course="Math", score=65.0),
        Grade(student_id=s1_id, course="Science", score=88.0),
        Grade(student_id=s1_id, course="History", score=72.0),
        Grade(student_id=s2_id, course="Math", score=90.0),
        Grade(student_id=s2_id, course="Science", score=60.0),
        Grade(student_id=s2_id, course="English", score=85.0),
    ]
    grades_db.extend(initial_grades)

initialize_data()

# API routes (under /api)
@api.get("/")
def read_root():
    return {"message": "Welcome to Student Performance Tracker API"}

@api.post("/students", response_model=Student)
def create_student(student: StudentBase):
    new_id = str(uuid.uuid4())
    new_student = Student(id=new_id, **student.model_dump())
    students_db[new_id] = new_student
    return new_student

@api.get("/students", response_model=List[Student])
def get_students():
    return list(students_db.values())

@api.post("/grades", response_model=Grade)
def add_grade(grade: Grade):
    if grade.student_id not in students_db:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Check if a grade for this course already exists and update it, otherwise add new
    for idx, existing_grade in enumerate(grades_db):
        if existing_grade.student_id == grade.student_id and existing_grade.course == grade.course:
            grades_db[idx] = grade
            return grade
            
    grades_db.append(grade)
    return grade

@api.get("/grades/{student_id}", response_model=List[Grade])
def get_student_grades(student_id: str):
    if student_id not in students_db:
        raise HTTPException(status_code=404, detail="Student not found")
    return [g for g in grades_db if g.student_id == student_id]

@api.get("/insights", response_model=List[Insight])
def get_insights():
    insights = []
    
    for student_id, student in students_db.items():
        student_grades = [g for g in grades_db if g.student_id == student_id]
        
        weak_subjects = []
        recommendations = []
        
        for grade in student_grades:
            if grade.score < 70.0:
                weak_subjects.append(WeakSubject(course=grade.course, score=grade.score))
                recommendations.append(f"Student {student.name} is struggling in {grade.course} (Avg: {grade.score}%) – suggest reviewing recent chapters and offering extra help.")
                
        if weak_subjects:
            insights.append(Insight(
                student_id=student_id,
                student_name=student.name,
                weak_subjects=weak_subjects,
                recommendations=recommendations
            ))
            
    return insights

app.include_router(api, prefix="/api")  # production: same-origin /api/students
app.include_router(api, prefix="", include_in_schema=False)   # local dev: http://localhost:8000/students

# Serve built frontend from same origin (so live link opens the app)
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
if os.path.isdir(STATIC_DIR):
    assets_dir = os.path.join(STATIC_DIR, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        # Don't serve SPA for API or OpenAPI routes
        if full_path.startswith("api/") or full_path in ("docs", "openapi.json") or full_path.startswith("docs/") or full_path.startswith("redoc"):
            raise HTTPException(status_code=404, detail="Not found")
        index_path = os.path.join(STATIC_DIR, "index.html")
        if os.path.isfile(index_path):
            return FileResponse(index_path)
        raise HTTPException(status_code=404, detail="Not found")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
