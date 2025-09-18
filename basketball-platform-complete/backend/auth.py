from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase_client import supabase_client
from typing import Optional
import jwt
import os

security = HTTPBearer()

class AuthService:
    def __init__(self):
        self.client = supabase_client.get_client()
    
    async def get_current_user(self, credentials: HTTPAuthorizationCredentials = Depends(security)):
        """Get current user from JWT token"""
        try:
            token = credentials.credentials
            # Verify token with Supabase
            response = self.client.auth.get_user(token)
            if not response.user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication credentials",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            return response.user
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    async def get_user_profile(self, user_id: str):
        """Get user profile from database"""
        try:
            response = self.client.table('users').select('*').eq('id', user_id).single().execute()
            return response.data
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User profile not found"
            )

# Global auth service instance
auth_service = AuthService()

# Dependency for getting current user
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return await auth_service.get_current_user(credentials)

# Dependency for getting user profile
async def get_current_user_profile(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user = await auth_service.get_current_user(credentials)
    return await auth_service.get_user_profile(user.id)
