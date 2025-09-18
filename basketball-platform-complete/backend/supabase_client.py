from supabase import create_client, Client
import os
from typing import Optional

class SupabaseClient:
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL", "https://qijavtpkszgpaqeohrwt.supabase.co")
        self.key = os.getenv("SUPABASE_KEY", "sbp_539599b21db43f4644894d6d7d7906f422e00a30")
        self.client: Client = create_client(self.url, self.key)
    
    def get_client(self) -> Client:
        return self.client

# Global instance
supabase_client = SupabaseClient()
