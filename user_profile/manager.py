import json
import os
from typing import Dict, List
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class UserProfileManager:
    """Manage user profiles and preferences"""

    def __init__(self, profiles_dir: str = "data/user_profiles"):
        self.profiles_dir = profiles_dir
        os.makedirs(profiles_dir, exist_ok=True)

    def create_default_profile(self) -> Dict:
        """Create default user profile"""
        return {
            "user_name": "User",
            "email": "",
            "skills": [],
            "experience_level": "mid",  # junior, mid, senior
            "preferred_locations": ["Remote"],
            "preferred_job_types": ["Full-time"],
            "min_salary": 0,
            "max_salary": 0,
            "industries": [],
            "company_size_preference": ["Any"],
            "work_authorization": "Any",
            "start_date": "ASAP",
            "remote_preference": True,
            "created_at": "",
            "updated_at": ""
        }

    def save_profile(self, profile: Dict, profile_id: str = "default") -> bool:
        """Save user profile to JSON file"""
        try:
            filename = os.path.join(self.profiles_dir, f"{profile_id}.json")
            with open(filename, 'w') as f:
                json.dump(profile, f, indent=2)
            logger.info(f"Profile '{profile_id}' saved successfully")
            return True
        except Exception as e:
            logger.error(f"Error saving profile: {str(e)}")
            return False

    def load_profile(self, profile_id: str = "default") -> Dict:
        """Load user profile from JSON file"""
        try:
            filename = os.path.join(self.profiles_dir, f"{profile_id}.json")
            if os.path.exists(filename):
                with open(filename, 'r') as f:
                    return json.load(f)
            else:
                logger.warning(f"Profile '{profile_id}' not found, returning default")
                return self.create_default_profile()
        except Exception as e:
            logger.error(f"Error loading profile: {str(e)}")
            return self.create_default_profile()

    def update_profile(self, profile_id: str, updates: Dict) -> bool:
        """Update user profile with new data"""
        try:
            profile = self.load_profile(profile_id)
            profile.update(updates)
            return self.save_profile(profile, profile_id)
        except Exception as e:
            logger.error(f"Error updating profile: {str(e)}")
            return False

    def list_profiles(self) -> List[str]:
        """List all available profiles"""
        try:
            files = os.listdir(self.profiles_dir)
            profiles = [f.replace('.json', '') for f in files if f.endswith('.json')]
            return profiles
        except Exception as e:
            logger.error(f"Error listing profiles: {str(e)}")
            return []

    def delete_profile(self, profile_id: str) -> bool:
        """Delete a user profile"""
        try:
            filename = os.path.join(self.profiles_dir, f"{profile_id}.json")
            if os.path.exists(filename):
                os.remove(filename)
                logger.info(f"Profile '{profile_id}' deleted")
                return True
            return False
        except Exception as e:
            logger.error(f"Error deleting profile: {str(e)}")
            return False

    def add_skill(self, profile_id: str, skill: str) -> bool:
        """Add a skill to user profile"""
        try:
            profile = self.load_profile(profile_id)
            if skill not in profile['skills']:
                profile['skills'].append(skill)
                return self.save_profile(profile, profile_id)
            return True
        except Exception as e:
            logger.error(f"Error adding skill: {str(e)}")
            return False

    def remove_skill(self, profile_id: str, skill: str) -> bool:
        """Remove a skill from user profile"""
        try:
            profile = self.load_profile(profile_id)
            if skill in profile['skills']:
                profile['skills'].remove(skill)
                return self.save_profile(profile, profile_id)
            return True
        except Exception as e:
            logger.error(f"Error removing skill: {str(e)}")
            return False

    def get_profile_summary(self, profile_id: str = "default") -> str:
        """Get a human-readable summary of user profile"""
        profile = self.load_profile(profile_id)
        summary = f"""
        User Profile: {profile.get('user_name', 'N/A')}
        Experience Level: {profile.get('experience_level', 'N/A')}
        Skills: {', '.join(profile.get('skills', []))}
        Preferred Locations: {', '.join(profile.get('preferred_locations', []))}
        Job Types: {', '.join(profile.get('preferred_job_types', []))}
        Salary Range: ${profile.get('min_salary', 0):,.0f} - ${profile.get('max_salary', 0):,.0f}
        Remote Work: {'Yes' if profile.get('remote_preference') else 'No'}
        """
        return summary


if __name__ == "__main__":
    manager = UserProfileManager()
    profile = manager.create_default_profile()
    profile['user_name'] = 'John Doe'
    profile['skills'] = ['Python', 'JavaScript', 'React', 'PostgreSQL']
    profile['experience_level'] = 'mid'
    manager.save_profile(profile)
    print(manager.get_profile_summary())
