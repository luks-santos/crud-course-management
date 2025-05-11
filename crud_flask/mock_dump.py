from crud_flask import app, db
from crud_flask.models.models import Category, Course, Lesson, Status

def quick_dump():
    courses = [
        # Backend
        "Python","Node.js","Java","Django","Rails","PHP","Go","Rust","MongoDB","MySQL",
        "Redis","GraphQL","REST","Docker","Kubernetes","AWS","PostgreSQL",
        # Frontend  
        "JavaScript","React","Vue","Angular","Svelte","TypeScript","CSS","Tailwind",
        "SASS","Bootstrap","Material","React Native","Flutter","Responsive","Performance","Webpack",
        # Fullstack
        "MERN","MEAN","Full Stack React","Django React","Laravel Vue","Rails Angular",
        "Next.js","GraphQL Full","Serverless","PWA","E-commerce","Social Media","Chat App",
        "Auth","DevOps","Cloud","Testing","Microservices"
    ]
    
    with app.app_context():
        Lesson.query.delete()  
        Course.query.delete()  
        cats = [Category.BACKEND]*17 + [Category.FRONTEND]*16 + [Category.FULLSTACK]*17
        
        for i, (name, cat) in enumerate(zip(courses, cats)):
            c = Course(
                name=name + " Complete",
                description=f"Learn {name}",
                category=cat,
                status=Status.ACTIVE if i % 4 != 0 else Status.INACTIVE,
                lessons=[]
            )
            db.session.add(c)
        
        db.session.commit()
        print(f"Created {Course.query.count()} courses")

if __name__ == "__main__":
    quick_dump()