import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import logging
from typing import Dict, List

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class JobDashboard:
    """Create visualizations for job analysis"""

    @staticmethod
    def create_skill_distribution_chart(skill_stats: Dict) -> go.Figure:
        """Create bar chart of top skills required"""
        if not skill_stats:
            return go.Figure().add_annotation(text="No skill data available")

        skills = list(skill_stats.keys())[:15]
        counts = list(skill_stats.values())[:15]

        fig = go.Figure(data=[
            go.Bar(x=skills, y=counts, marker=dict(color='#1f77b4'))
        ])
        fig.update_layout(
            title='Top 15 Most Required Skills',
            xaxis_title='Skill',
            yaxis_title='Frequency',
            hovermode='x unified',
            height=500,
            template='plotly_white'
        )
        return fig

    @staticmethod
    def create_salary_distribution_chart(salary_stats: Dict) -> go.Figure:
        """Create salary range visualization"""
        if not salary_stats or salary_stats.get('count', 0) == 0:
            return go.Figure().add_annotation(text="No salary data available")

        fig = go.Figure()

        salary_ranges = [
            f"${salary_stats.get('min_salary', 0):,.0f}",
            f"${salary_stats.get('average_salary', 0):,.0f}",
            f"${salary_stats.get('median_salary', 0):,.0f}",
            f"${salary_stats.get('max_salary', 0):,.0f}"
        ]

        salary_values = [
            salary_stats.get('min_salary', 0),
            salary_stats.get('average_salary', 0),
            salary_stats.get('median_salary', 0),
            salary_stats.get('max_salary', 0)
        ]

        fig.add_trace(go.Bar(
            x=['Min Salary', 'Avg Salary', 'Median Salary', 'Max Salary'],
            y=salary_values,
            text=salary_ranges,
            textposition='outside',
            marker=dict(color=['#ff7f0e', '#2ca02c', '#d62728', '#9467bd'])
        ))

        fig.update_layout(
            title='Salary Statistics (USD)',
            xaxis_title='Salary Type',
            yaxis_title='Amount ($)',
            height=500,
            template='plotly_white',
            showlegend=False
        )
        return fig

    @staticmethod
    def create_match_score_distribution(matched_jobs_df: pd.DataFrame) -> go.Figure:
        """Create histogram of job match scores"""
        if matched_jobs_df.empty:
            return go.Figure().add_annotation(text="No match data available")

        fig = go.Figure(data=[
            go.Histogram(x=matched_jobs_df['overall_score'], nbinsx=20, marker=dict(color='#17becf'))
        ])

        fig.update_layout(
            title='Distribution of Job Match Scores',
            xaxis_title='Match Score (%)',
            yaxis_title='Number of Jobs',
            height=500,
            template='plotly_white'
        )
        return fig

    @staticmethod
    def create_match_components_radar(matched_jobs_df: pd.DataFrame) -> go.Figure:
        """Create radar chart showing different match components"""
        if matched_jobs_df.empty:
            return go.Figure().add_annotation(text="No match data available")

        avg_scores = {
            'Skill Match': matched_jobs_df['skill_match'].mean(),
            'Experience Match': matched_jobs_df['experience_match'].mean(),
            'Location Match': matched_jobs_df['location_match'].mean(),
            'Salary Match': matched_jobs_df['salary_match'].mean(),
            'Job Type Match': matched_jobs_df['job_type_match'].mean(),
        }

        fig = go.Figure(data=[
            go.Scatterpolar(
                r=list(avg_scores.values()),
                theta=list(avg_scores.keys()),
                fill='toself',
                marker=dict(color='#ff7f0e'),
                name='Average Match Score'
            )
        ])

        fig.update_layout(
            polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
            title='Average Match Score Components',
            height=500,
            template='plotly_white'
        )
        return fig

    @staticmethod
    def create_job_source_pie(matched_jobs_df: pd.DataFrame) -> go.Figure:
        """Create pie chart of job sources"""
        if matched_jobs_df.empty or 'source' not in matched_jobs_df.columns:
            return go.Figure().add_annotation(text="No source data available")

        source_counts = matched_jobs_df['source'].value_counts()

        fig = go.Figure(data=[
            go.Pie(labels=source_counts.index, values=source_counts.values,
                   marker=dict(colors=px.colors.qualitative.Set3))
        ])

        fig.update_layout(
            title='Job Distribution by Source',
            height=500,
            template='plotly_white'
        )
        return fig

    @staticmethod
    def create_location_chart(matched_jobs_df: pd.DataFrame) -> go.Figure:
        """Create chart of jobs by location"""
        if matched_jobs_df.empty or 'location' not in matched_jobs_df.columns:
            return go.Figure().add_annotation(text="No location data available")

        location_counts = matched_jobs_df['location'].value_counts().head(10)

        fig = go.Figure(data=[
            go.Bar(y=location_counts.index, x=location_counts.values,
                   orientation='h', marker=dict(color='#2ca02c'))
        ])

        fig.update_layout(
            title='Top 10 Job Locations',
            xaxis_title='Number of Jobs',
            yaxis_title='Location',
            height=500,
            template='plotly_white'
        )
        return fig

    @staticmethod
    def create_top_jobs_table(matched_jobs_df: pd.DataFrame, top_n: int = 10) -> go.Figure:
        """Create table of top matching jobs"""
        if matched_jobs_df.empty:
            return go.Figure().add_annotation(text="No jobs to display")

        df_display = matched_jobs_df.head(top_n)[
            ['title', 'company', 'location', 'overall_score', 'source']
        ].copy()

        df_display['overall_score'] = df_display['overall_score'].apply(lambda x: f"{x}%")

        fig = go.Figure(data=[go.Table(
            header=dict(
                values=['<b>' + col + '</b>' for col in df_display.columns],
                fill_color='#1f77b4',
                align='left',
                font=dict(color='white', size=12)
            ),
            cells=dict(
                values=[df_display[col] for col in df_display.columns],
                fill_color='lavender',
                align='left',
                font=dict(size=11)
            )
        )])

        fig.update_layout(
            title=f'Top {top_n} Matching Jobs',
            height=400,
            template='plotly_white'
        )
        return fig

    @staticmethod
    def create_match_quality_gauge(overall_avg_score: float) -> go.Figure:
        """Create gauge chart for overall match quality"""
        fig = go.Figure(data=[go.Indicator(
            mode="gauge+number+delta",
            value=overall_avg_score,
            title={"text": "Overall Match Quality"},
            delta={"reference": 70},
            gauge={
                "axis": {"range": [0, 100]},
                "bar": {"color": "darkblue"},
                "steps": [
                    {"range": [0, 40], "color": "#ffcccc"},
                    {"range": [40, 70], "color": "#ffffcc"},
                    {"range": [70, 100], "color": "#ccffcc"}
                ],
                "threshold": {
                    "line": {"color": "red", "width": 4},
                    "thickness": 0.75,
                    "value": 80
                }
            }
        )])

        fig.update_layout(height=400, template='plotly_white')
        return fig


if __name__ == "__main__":
    dashboard = JobDashboard()
    print("Dashboard initialized")
