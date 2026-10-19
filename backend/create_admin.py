import asyncio
import os
import sys
from dotenv import load_dotenv

load_dotenv()

from app.database import db, client
from app.core.security import hash_password

async def create_or_update_admin(email: str, password: str):
    try:
        await client.server_info()
    except Exception as e:
        print(f"[ERROR] Cannot connect to MongoDB: {e}")
        print("\nPlease ensure your MONGODB_URI in .env has your real password and MongoDB Atlas is reachable.")
        return False

    hashed = hash_password(password)
    existing = await db.admin.find_one({"email": email})

    if existing:
        await db.admin.update_one({"email": email}, {"$set": {"hashed_password": hashed}})
        print(f"[OK] Admin user '{email}' already exists. Password updated successfully!")
    else:
        await db.admin.insert_one({"email": email, "hashed_password": hashed})
        print(f"[OK] Admin user '{email}' created successfully!")
    
    print(f"\nAdmin Credentials:")
    print(f"  Email:    {email}")
    print(f"  Password: {password}\n")
    return True

if __name__ == "__main__":
    email = sys.argv[1] if len(sys.argv) > 1 else "admin@portfolio.com"
    password = sys.argv[2] if len(sys.argv) > 2 else "admin123"
    asyncio.run(create_or_update_admin(email, password))
