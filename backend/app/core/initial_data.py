from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.security import get_password_hash

def create_admin_user(db: Session):
    """Crear usuario admin si no existe"""
    admin_username = "admin"
    admin_email = "admin@example.com"
    admin_password = "admin123"
    admin_full_name = "Administrator"

    # Verificar si el admin ya existe
    existing_admin = db.query(User).filter(User.username == admin_username).first()
    if existing_admin:
        print(f"Admin user '{admin_username}' already exists")
        return False

    # Crear usuario admin
    admin_user = User(
        username=admin_username,
        email=admin_email,
        password_hash=get_password_hash(admin_password),
        full_name=admin_full_name
    )
    
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    
    print(f"   Username: {admin_username}")
    print(f"   Password: {admin_password}")
    print(f"   Email: {admin_email}")
    
    return True
