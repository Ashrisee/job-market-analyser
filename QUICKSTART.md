# Quick Start Guide

Get started with Smart Job Analyzer in 5 minutes!

## 1. Install & Setup (2 minutes)

```bash
# Navigate to project directory
cd job_intelligence

# Install dependencies
pip install -r requirements.txt

# Run the app
streamlit run main.py
```

The app will open at `http://localhost:8501`

## 2. Create Your Profile (2 minutes)

1. Go to **👤 User Profile** section
2. Enter your personal information
3. Select your main skills (at least 3-5)
4. Choose experience level (junior/mid/senior)
5. Set salary expectations
6. Enable/disable remote work preference
7. Click **💾 Save Profile**

## 3. Scrape Jobs (1 minute)

1. Go to **🔍 Scrape Jobs** section
2. Enter a job title keyword (e.g., "Python Developer", "Data Scientist")
3. Choose number of jobs (10-100)
4. Click **🚀 Start Scraping**
5. Wait for results - typically 30-60 seconds

## 4. View Recommendations

1. Go to **💡 Recommendations** section
2. See top matching jobs with scores
3. Check how well each job matches your profile
4. Download recommendations as CSV if needed

## 5. Analyze Dashboard

1. Go to **📈 Dashboard** section
2. View interactive charts showing:
   - Top required skills
   - Salary ranges
   - Match quality
   - Job distribution by location and source
   - Your strengths visualization

## Tips for Best Results

### Profile Setup
- ✅ Add as many relevant skills as possible
- ✅ Be honest about experience level
- ✅ Set realistic salary expectations
- ✅ Update profile as skills grow

### Job Scraping
- ✅ Use specific job titles (not too generic)
- ✅ Search for roles related to your skills
- ✅ Higher job limit = more data = better insights
- ✅ Scrape multiple keywords for comparison

### Analysis
- ✅ Check "Top Required Skills" to find gaps
- ✅ Use match scores to focus on best opportunities
- ✅ Compare salary ranges with market rates
- ✅ Look for emerging skills in demand

## Common Workflows

### Workflow 1: Career Gap Analysis
```
1. Set up profile with current skills
2. Scrape jobs for your target role
3. View "Top Required Skills" section
4. Identify missing skills (skills you need to learn)
5. Plan skill development
```

### Workflow 2: Market Salary Research
```
1. Scrape jobs for your target role in top cities
2. Go to Job Analysis → Salary Analysis
3. Compare salary ranges
4. Update your salary expectations
5. Get better matching jobs
```

### Workflow 3: Job Opportunity Tracking
```
1. Create multiple profiles for different job targets
2. Scrape jobs for each target
3. Get personalized recommendations for each
4. Download job lists
5. Track applications
```

### Workflow 4: Skill Demand Analysis
```
1. Scrape jobs for your industry
2. View top required skills chart
3. Identify trending technologies
4. Plan learning path
5. Upskill accordingly
```

## Understanding Match Scores

Each job gets a match score (0-100%) based on:

| Factor | Weight | Description |
|--------|--------|-------------|
| Skill Match | 40% | How many of your skills does the job require? |
| Experience | 25% | Does job level match your experience? |
| Location | 15% | Is it in your preferred location? |
| Salary | 12% | Does it fit your salary expectations? |
| Job Type | 8% | Full-time/Part-time preference match? |

**✅ 80+** = Excellent match, apply immediately
**⭐ 60-80** = Good match, worth exploring
**⚠️ 40-60** = Possible fit, review carefully
**❌ <40** = Not a good match

## Skill Categories Recognized

The app recognizes these skill areas automatically:

- 🐍 **Programming**: Python, Java, JavaScript, C++, Go, Rust, PHP, Ruby, TypeScript
- 🌐 **Web**: Django, Flask, FastAPI, React, Angular, Vue, Express, Rails, Spring
- 💾 **Databases**: PostgreSQL, MongoDB, MySQL, Redis, Elasticsearch, DynamoDB
- ☁️ **Cloud**: AWS, Azure, GCP, Kubernetes, Docker, Terraform
- 🤖 **AI/ML**: TensorFlow, PyTorch, Machine Learning, NLP, Computer Vision
- 🔧 **DevOps**: CI/CD, Jenkins, Linux, Monitoring, Ansible
- 💬 **Soft Skills**: Leadership, Communication, Teamwork, Agile, Scrum

## Data Location

Your data is stored locally:
- **Job data**: `data/jobs_raw.csv` and `data/jobs_raw.json`
- **Profiles**: `data/user_profiles/[profile_name].json`
- **Logs**: Console output

## Keyboard Shortcuts (on Dashboard)

- 📊 Charts are interactive - hover to see values
- 🔍 Click legend items to show/hide data
- 📥 Click camera icon to download chart as image
- 📱 Charts are responsive and mobile-friendly

## Export & Share

From the Recommendations page:
1. Click **📥 Export Top 20 Jobs**
2. CSV file downloads automatically
3. Share with mentors, recruiters, or team members
4. Open in Excel for further analysis

## Troubleshooting

**Q: No jobs appear after scraping?**
A: Try a different keyword or check your internet connection. Some APIs might have rate limits.

**Q: Charts not loading?**
A: Refresh the page (F5) or clear browser cache. Ensure JavaScript is enabled.

**Q: Profile won't save?**
A: Check that `data/user_profiles/` directory exists and has write permissions.

**Q: App runs slow?**
A: Large datasets (1000+ jobs) may slow down analysis. Try scraping fewer jobs.

## Next Steps

After exploring:
1. Set up profiles for different job targets
2. Track your skill development
3. Monitor salary trends
4. Identify industry growth areas
5. Plan your career path data-driven

## Support

For issues or suggestions:
1. Check the console for error messages
2. Review job titles - use industry-standard names
3. Try with fewer jobs initially
4. Check your internet connection

---

Ready to analyze? Go back to the app and start exploring! 🚀
