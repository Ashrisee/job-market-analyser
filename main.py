import streamlit as st
import pandas as pd
import os
import sys
from datetime import datetime

# Add paths
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'scraper'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'processing'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'matching'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'user_profile'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'dashboard'))

from scraper import JobScraper
from analyzer import JobAnalyzer
from matcher import JobMatcher
from manager import UserProfileManager
from visualizer import JobDashboard

# Page configuration
st.set_page_config(
    page_title="Smart Job Analyzer",
    page_icon="💼",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f77b4;
        margin-bottom: 1rem;
    }
    .section-header {
        font-size: 1.5rem;
        font-weight: bold;
        color: #2ca02c;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 0.5rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'scraper' not in st.session_state:
    st.session_state.scraper = JobScraper()
if 'analyzer' not in st.session_state:
    st.session_state.analyzer = JobAnalyzer()
if 'matcher' not in st.session_state:
    st.session_state.matcher = JobMatcher()
if 'profile_manager' not in st.session_state:
    st.session_state.profile_manager = UserProfileManager()
if 'dashboard' not in st.session_state:
    st.session_state.dashboard = JobDashboard()
if 'current_profile' not in st.session_state:
    st.session_state.current_profile = "default"
if 'jobs_data' not in st.session_state:
    st.session_state.jobs_data = pd.DataFrame()


# Sidebar for navigation
with st.sidebar:
    st.markdown("## 🔧 Navigation")
    app_section = st.radio("Select Section", [
        "🏠 Home",
        "👤 User Profile",
        "🔍 Scrape Jobs",
        "📊 Job Analysis",
        "💡 Recommendations",
        "📈 Dashboard"
    ], key="nav_radio")


def home_page():
    """Home page"""
    st.markdown('<div class="main-header">💼 Smart Job Analyzer</div>', unsafe_allow_html=True)
    st.markdown("""
    Welcome to the **Smart Job Analyzer** - Your intelligent job search companion!

    This application helps you:
    - 🔍 Scrape real job listings from **JSearch** & **Adzuna** APIs
    - 📊 Analyze job requirements and market trends
    - 👤 Create and manage your professional profile
    - 💡 Get personalized job recommendations
    - 📈 Visualize your strengths and match scores

    ### How to Get Started:
    1. **Set Up Your Profile** - Define your skills, experience level, and preferences
    2. **Scrape Jobs** - Search for real jobs by title/keyword
    3. **Analyze Results** - See what skills are in demand
    4. **Get Recommendations** - Get personalized job matches
    5. **View Dashboard** - Visualize your strengths and opportunities
    """)

    # Check API Status
    st.markdown("### 🔗 API Status")
    col1, col2 = st.columns(2)

    import os
    from dotenv import load_dotenv
    load_dotenv()

    jsearch_key = os.getenv('JSEARCH_API_KEY', '')
    adzuna_id = os.getenv('ADZUNA_APP_ID', '')

    with col1:
        if jsearch_key:
            st.success("✅ JSearch API: Configured")
        else:
            st.error("❌ JSearch API: Missing")

    with col2:
        if adzuna_id:
            st.success("✅ Adzuna API: Configured")
        else:
            st.error("❌ Adzuna API: Missing")

    # Stats
    st.markdown("### 📊 Quick Stats")
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Total Jobs Loaded", len(st.session_state.jobs_data) if not st.session_state.jobs_data.empty else 0)
    with col2:
        profiles = st.session_state.profile_manager.list_profiles()
        st.metric("Saved Profiles", len(profiles))
    with col3:
        st.metric("Status", "Ready" if (jsearch_key or adzuna_id) else "Setup Required")


def user_profile_page():
    """User profile management page"""
    st.markdown('<div class="section-header">👤 User Profile Management</div>', unsafe_allow_html=True)

    col1, col2 = st.columns([3, 1])
    with col1:
        profiles = st.session_state.profile_manager.list_profiles()
        selected_profile = st.selectbox("Select Profile", profiles if profiles else ["default"])
        st.session_state.current_profile = selected_profile

    with col2:
        if st.button("➕ New Profile"):
            new_profile_name = st.text_input("New Profile Name", key="new_profile_input")
            if new_profile_name:
                new_profile = st.session_state.profile_manager.create_default_profile()
                st.session_state.profile_manager.save_profile(new_profile, new_profile_name)
                st.success(f"Profile '{new_profile_name}' created!")

    # Load current profile
    profile = st.session_state.profile_manager.load_profile(st.session_state.current_profile)

    # Edit profile
    st.markdown("### Personal Information")
    profile['user_name'] = st.text_input("Name", value=profile.get('user_name', ''))
    profile['email'] = st.text_input("Email", value=profile.get('email', ''))

    st.markdown("### Professional Details")
    profile['experience_level'] = st.selectbox(
        "Experience Level",
        ["junior", "mid", "senior"],
        index=["junior", "mid", "senior"].index(profile.get('experience_level', 'mid'))
    )

    skills_input = st.multiselect(
        "Your Skills",
        ["Python", "JavaScript", "Java", "C++", "React", "Django", "FastAPI",
         "PostgreSQL", "MongoDB", "AWS", "Azure", "GCP", "Docker", "Kubernetes",
         "Machine Learning", "Data Science", "DevOps", "Testing", "Git"],
        default=profile.get('skills', [])
    )
    profile['skills'] = skills_input

    st.markdown("### Job Preferences")
    col1, col2 = st.columns(2)
    with col1:
        profile['preferred_job_types'] = st.multiselect(
            "Preferred Job Types",
            ["Full-time", "Part-time", "Contract", "Freelance", "Internship"],
            default=profile.get('preferred_job_types', ["Full-time"])
        )
        profile['remote_preference'] = st.checkbox(
            "Remote Work Preferred",
            value=profile.get('remote_preference', True)
        )

    with col2:
        profile['preferred_locations'] = st.multiselect(
            "Preferred Locations",
            ["Remote", "New York", "San Francisco", "Austin", "Seattle", "London", "Toronto", "Other"],
            default=profile.get('preferred_locations', ["Remote"])
        )

    st.markdown("### Salary Expectations")
    col1, col2 = st.columns(2)
    with col1:
        profile['min_salary'] = st.number_input("Minimum Salary ($)", min_value=0, value=int(profile.get('min_salary', 0)))
    with col2:
        profile['max_salary'] = st.number_input("Maximum Salary ($)", min_value=0, value=int(profile.get('max_salary', 0)))

    # Save changes
    if st.button("💾 Save Profile"):
        profile['updated_at'] = datetime.now().isoformat()
        if not profile.get('created_at'):
            profile['created_at'] = datetime.now().isoformat()
        st.session_state.profile_manager.save_profile(profile, st.session_state.current_profile)
        st.success(f"Profile '{st.session_state.current_profile}' saved successfully!")

    # Profile summary
    st.markdown("### Profile Summary")
    st.info(st.session_state.profile_manager.get_profile_summary(st.session_state.current_profile))

    # Delete profile
    if st.button("🗑️ Delete Profile"):
        st.session_state.profile_manager.delete_profile(st.session_state.current_profile)
        st.warning(f"Profile '{st.session_state.current_profile}' deleted!")


def scrape_jobs_page():
    """Job scraping page"""
    st.markdown('<div class="section-header">🔍 Scrape Jobs</div>', unsafe_allow_html=True)

    # Input section
    st.markdown("### Search Parameters")
    col1, col2 = st.columns([2, 1])
    with col1:
        keyword = st.text_input(
            "Job Title/Keyword",
            placeholder="e.g., Python Developer, Data Scientist, Machine Learning Engineer",
            key="search_keyword"
        )
    with col2:
        job_limit = st.number_input("No. of Jobs", min_value=10, max_value=100, value=30)

    # Search button
    col1, col2, col3 = st.columns(3)
    with col1:
        search_button = st.button("🚀 Start Scraping", key="scrape_btn", use_container_width=True)
    with col2:
        if os.path.exists("data/jobs_raw.csv"):
            load_button = st.button("📂 Load from CSV", key="load_csv_btn", use_container_width=True)
        else:
            load_button = False
    with col3:
        refresh_button = st.button("🔄 Refresh", key="refresh_btn", use_container_width=True)

    # Execute search
    if search_button:
        if not keyword or len(keyword.strip()) < 2:
            st.error("Please enter a job keyword (minimum 2 characters)")
            return

        with st.spinner(f"Scraping jobs for '{keyword}'..."):
            try:
                scraper = st.session_state.scraper
                jobs_df = scraper.scrape_all_sources(keyword, limit=int(job_limit))

                if not jobs_df.empty:
                    st.session_state.jobs_data = jobs_df
                    scraper.save_to_csv(jobs_df)
                    scraper.save_to_json(jobs_df)

                    st.success(f"✅ Successfully scraped {len(jobs_df)} jobs!")

                    # Display stats
                    col1, col2, col3, col4 = st.columns(4)
                    with col1:
                        st.metric("Total Jobs", len(jobs_df))
                    with col2:
                        st.metric("Avg Salary", jobs_df['salary'].apply(lambda x: 0 if 'Not' in str(x) else 1).sum())
                    with col3:
                        st.metric("Job Sources", jobs_df['source'].nunique())
                    with col4:
                        st.metric("Companies", jobs_df['company'].nunique())

                    # Display table
                    st.markdown("### Results")
                    display_cols = ['title', 'company', 'location', 'salary', 'job_type', 'source']
                    st.dataframe(
                        jobs_df[display_cols],
                        use_container_width=True,
                        height=400
                    )

                    # Export options
                    st.markdown("### Export Options")
                    col1, col2 = st.columns(2)
                    with col1:
                        csv = jobs_df.to_csv(index=False)
                        st.download_button(
                            "📥 Download CSV",
                            csv,
                            f"jobs_{keyword.replace(' ', '_')}.csv",
                            "text/csv",
                            use_container_width=True
                        )
                    with col2:
                        json_str = jobs_df.to_json(orient='records', indent=2)
                        st.download_button(
                            "📥 Download JSON",
                            json_str,
                            f"jobs_{keyword.replace(' ', '_')}.json",
                            "application/json",
                            use_container_width=True
                        )
                else:
                    st.warning(f"No jobs found for '{keyword}'. Try a different search term.")
            except Exception as e:
                st.error(f"Error during scraping: {str(e)}\n\nTip: Check your API keys in .env file")

    elif load_button and os.path.exists("data/jobs_raw.csv"):
        try:
            st.session_state.jobs_data = pd.read_csv("data/jobs_raw.csv")
            st.success(f"Loaded {len(st.session_state.jobs_data)} jobs from CSV")
            st.dataframe(st.session_state.jobs_data[['title', 'company', 'location', 'salary', 'source']], use_container_width=True)
        except Exception as e:
            st.error(f"Error loading CSV: {str(e)}")

    elif refresh_button and not st.session_state.jobs_data.empty:
        st.info(f"Refreshed: {len(st.session_state.jobs_data)} jobs currently loaded")

    # Info section
    st.markdown("---")
    st.info("💡 **Data Sources**: JSearch API + Adzuna API | Real-time job listings from India & Global")


def job_analysis_page():
    """Job analysis page"""
    st.markdown('<div class="section-header">📊 Job Analysis</div>', unsafe_allow_html=True)

    if st.session_state.jobs_data.empty:
        st.warning("No job data. Please scrape jobs first!")
        return

    with st.spinner("Analyzing jobs..."):
        analyzer = st.session_state.analyzer
        analyzed_df = analyzer.analyze_jobs(st.session_state.jobs_data)

        # Statistics
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("Total Jobs", len(analyzed_df))
        with col2:
            st.metric("Remote Jobs", analyzed_df.get('is_remote', pd.Series()).sum() if 'is_remote' in analyzed_df.columns else 0)
        with col3:
            st.metric("Avg Description Length", int(analyzed_df['description_length'].mean()) if 'description_length' in analyzed_df.columns else 0)
        with col4:
            st.metric("Unique Companies", analyzed_df['company'].nunique())

        # Skills statistics
        st.markdown("### Top Required Skills")
        skill_stats = analyzer.get_skill_statistics(analyzed_df)
        if skill_stats:
            skills_df = pd.DataFrame(list(skill_stats.items()), columns=['Skill', 'Frequency'])
            col1, col2 = st.columns([2, 1])
            with col1:
                st.plotly_chart(st.session_state.dashboard.create_skill_distribution_chart(skill_stats), use_container_width=True)
            with col2:
                st.dataframe(skills_df, use_container_width=True)

        # Salary statistics
        st.markdown("### Salary Analysis")
        salary_stats = analyzer.get_salary_statistics(analyzed_df)
        if salary_stats:
            col1, col2, col3, col4 = st.columns(4)
            with col1:
                st.metric("Avg Salary", f"${salary_stats.get('average_salary', 0):,.0f}")
            with col2:
                st.metric("Min Salary", f"${salary_stats.get('min_salary', 0):,.0f}")
            with col3:
                st.metric("Median Salary", f"${salary_stats.get('median_salary', 0):,.0f}")
            with col4:
                st.metric("Max Salary", f"${salary_stats.get('max_salary', 0):,.0f}")

            st.plotly_chart(st.session_state.dashboard.create_salary_distribution_chart(salary_stats), use_container_width=True)


def recommendations_page():
    """Job recommendations page"""
    st.markdown('<div class="section-header">💡 Personalized Recommendations</div>', unsafe_allow_html=True)

    if st.session_state.jobs_data.empty:
        st.warning("No job data. Please scrape jobs first!")
        return

    # Analyze jobs first
    analyzer = st.session_state.analyzer
    analyzed_df = analyzer.analyze_jobs(st.session_state.jobs_data)

    # Get user profile
    profile = st.session_state.profile_manager.load_profile(st.session_state.current_profile)

    if not profile.get('skills'):
        st.warning("Please add skills to your profile first!")
        return

    # Match jobs
    with st.spinner("Matching jobs with your profile..."):
        matcher = st.session_state.matcher
        matched_jobs = matcher.match_jobs(analyzed_df, profile)

        if not matched_jobs.empty:
            # Analysis
            match_analysis = matcher.get_match_analysis(matched_jobs)

            col1, col2, col3, col4 = st.columns(4)
            with col1:
                st.metric("Total Matches", match_analysis['total_matches'])
            with col2:
                st.metric("High Matches (80+)", match_analysis['high_matches'])
            with col3:
                st.metric("Medium Matches", match_analysis['medium_matches'])
            with col4:
                st.metric("Avg Score", f"{match_analysis['avg_overall_score']:.1f}%")

            # Top jobs
            st.markdown("### Top Matching Jobs")
            st.dataframe(
                matched_jobs[['title', 'company', 'location', 'salary', 'overall_score', 'skill_match', 'experience_match']].head(15),
                use_container_width=True
            )

            # Match visualization
            st.markdown("### Match Score Distribution")
            st.plotly_chart(st.session_state.dashboard.create_match_score_distribution(matched_jobs), use_container_width=True)

            # Export recommendations
            if st.button("📥 Export Top 20 Jobs"):
                export_df = matched_jobs.head(20)
                csv = export_df.to_csv(index=False)
                st.download_button("Download CSV", csv, "recommendations.csv", "text/csv")
        else:
            st.error("No matching jobs found")


def dashboard_page():
    """Analytics dashboard page"""
    st.markdown('<div class="section-header">📈 Analytics Dashboard</div>', unsafe_allow_html=True)

    if st.session_state.jobs_data.empty:
        st.warning("No job data. Please scrape jobs first!")
        return

    # Analyze jobs
    analyzer = st.session_state.analyzer
    analyzed_df = analyzer.analyze_jobs(st.session_state.jobs_data)

    # Get matched jobs if profile has skills
    profile = st.session_state.profile_manager.load_profile(st.session_state.current_profile)

    if profile.get('skills'):
        matcher = st.session_state.matcher
        matched_jobs = matcher.match_jobs(analyzed_df, profile)
        match_analysis = matcher.get_match_analysis(matched_jobs)

        # Quality gauge
        st.plotly_chart(
            st.session_state.dashboard.create_match_quality_gauge(match_analysis['avg_overall_score']),
            use_container_width=True
        )

        # Radar chart
        col1, col2 = st.columns(2)
        with col1:
            st.plotly_chart(st.session_state.dashboard.create_match_components_radar(matched_jobs), use_container_width=True)
        with col2:
            st.plotly_chart(st.session_state.dashboard.create_job_source_pie(matched_jobs), use_container_width=True)

        # Location chart
        st.plotly_chart(st.session_state.dashboard.create_location_chart(matched_jobs), use_container_width=True)

        # Top jobs table
        st.plotly_chart(st.session_state.dashboard.create_top_jobs_table(matched_jobs, top_n=10), use_container_width=True)
    else:
        st.info("Add skills to your profile to see personalized recommendations")


# Main routing
if app_section == "🏠 Home":
    home_page()
elif app_section == "👤 User Profile":
    user_profile_page()
elif app_section == "🔍 Scrape Jobs":
    scrape_jobs_page()
elif app_section == "📊 Job Analysis":
    job_analysis_page()
elif app_section == "💡 Recommendations":
    recommendations_page()
elif app_section == "📈 Dashboard":
    dashboard_page()

# Footer
st.markdown("---")
st.markdown("<p style='text-align: center; color: gray;'>Smart Job Analyzer v1.0 | Built with Python & Streamlit</p>", unsafe_allow_html=True)
