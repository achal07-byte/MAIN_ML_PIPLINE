"""
Chart generation service for the AutoML pipeline.
Generates matplotlib/seaborn visualizations and saves them as images.
"""
import os
import uuid
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")

# Set global style
sns.set_theme(style="darkgrid", palette="muted")
plt.rcParams.update({
    'figure.facecolor': '#f5f5f3',
    'axes.facecolor': '#ffffff',
    'axes.edgecolor': '#d1d1cf',
    'text.color': '#1a1a1a',
    'axes.labelcolor': '#1a1a1a',
    'xtick.color': '#666666',
    'ytick.color': '#666666',
    'font.family': 'sans-serif',
    'font.size': 10,
})


def _save_chart(fig, session_id: str, chart_name: str) -> str:
    """Save a matplotlib figure and return the relative path."""
    filename = f"{session_id}_{chart_name}_{uuid.uuid4().hex[:6]}.png"
    filepath = os.path.join(UPLOAD_DIR, filename)
    fig.savefig(filepath, dpi=150, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close(fig)
    return f"uploads/{filename}"


def generate_correlation_heatmap(df: pd.DataFrame, session_id: str) -> str:
    """Generate a correlation heatmap for numeric columns."""
    numeric_df = df.select_dtypes(include=[np.number])
    if numeric_df.shape[1] < 2:
        return None
    
    fig, ax = plt.subplots(figsize=(10, 8))
    corr = numeric_df.corr()
    mask = np.triu(np.ones_like(corr, dtype=bool))
    sns.heatmap(corr, mask=mask, annot=True, fmt=".2f", cmap="RdBu_r",
                center=0, square=True, linewidths=0.5, ax=ax,
                cbar_kws={"shrink": 0.8})
    ax.set_title("Feature Correlation Matrix", fontsize=14, fontweight='bold', pad=15)
    return _save_chart(fig, session_id, "correlation")


def generate_distribution_plot(df: pd.DataFrame, session_id: str, column: str = None) -> str:
    """Generate distribution plots for numeric columns."""
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    if not numeric_cols:
        return None
    
    if column and column in numeric_cols:
        cols_to_plot = [column]
    else:
        cols_to_plot = numeric_cols[:6]  # Max 6 columns
    
    n = len(cols_to_plot)
    ncols = min(3, n)
    nrows = (n + ncols - 1) // ncols
    
    fig, axes = plt.subplots(nrows, ncols, figsize=(5 * ncols, 4 * nrows))
    if n == 1:
        axes = [axes]
    else:
        axes = axes.flatten() if hasattr(axes, 'flatten') else [axes]
    
    for i, col in enumerate(cols_to_plot):
        sns.histplot(df[col].dropna(), kde=True, ax=axes[i], color="#4A90D9", edgecolor="white")
        axes[i].set_title(col, fontsize=11, fontweight='bold')
        axes[i].set_xlabel("")
    
    # Hide empty subplots
    for j in range(i + 1, len(axes)):
        axes[j].set_visible(False)
    
    fig.suptitle("Feature Distributions", fontsize=14, fontweight='bold', y=1.02)
    fig.tight_layout()
    return _save_chart(fig, session_id, "distribution")


def generate_missing_values_chart(df: pd.DataFrame, session_id: str) -> str:
    """Generate a bar chart of missing values per column."""
    missing = df.isnull().sum()
    missing = missing[missing > 0].sort_values(ascending=False)
    
    if missing.empty:
        return None
    
    fig, ax = plt.subplots(figsize=(10, max(4, len(missing) * 0.4)))
    colors = ["#E74C3C" if v > len(df) * 0.3 else "#F39C12" if v > len(df) * 0.1 else "#2ECC71" for v in missing.values]
    bars = ax.barh(missing.index, missing.values, color=colors, edgecolor="white", height=0.6)
    
    for bar, val in zip(bars, missing.values):
        pct = val / len(df) * 100
        ax.text(bar.get_width() + len(df) * 0.01, bar.get_y() + bar.get_height()/2,
                f'{val} ({pct:.1f}%)', va='center', fontsize=9, color='#666666')
    
    ax.set_title("Missing Values by Feature", fontsize=14, fontweight='bold', pad=15)
    ax.set_xlabel("Count")
    ax.invert_yaxis()
    fig.tight_layout()
    return _save_chart(fig, session_id, "missing_values")


def generate_target_distribution(df: pd.DataFrame, session_id: str, target_col: str) -> str:
    """Generate target variable distribution."""
    if target_col not in df.columns:
        return None
    
    fig, ax = plt.subplots(figsize=(8, 5))
    
    if df[target_col].dtype == 'object' or df[target_col].nunique() < 15:
        # Categorical target
        counts = df[target_col].value_counts()
        colors = sns.color_palette("muted", len(counts))
        ax.bar(counts.index.astype(str), counts.values, color=colors, edgecolor="white")
        ax.set_xlabel(target_col)
        ax.set_ylabel("Count")
        plt.xticks(rotation=45, ha='right')
    else:
        # Continuous target
        sns.histplot(df[target_col].dropna(), kde=True, ax=ax, color="#4A90D9", edgecolor="white")
        ax.set_xlabel(target_col)
    
    ax.set_title(f"Target Distribution: {target_col}", fontsize=14, fontweight='bold', pad=15)
    fig.tight_layout()
    return _save_chart(fig, session_id, "target_dist")


def generate_boxplot(df: pd.DataFrame, session_id: str) -> str:
    """Generate boxplots for numeric features to show outliers."""
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()[:8]
    if not numeric_cols:
        return None
    
    fig, ax = plt.subplots(figsize=(max(8, len(numeric_cols) * 1.2), 5))
    
    # Normalize data for comparable boxplots
    normalized = df[numeric_cols].apply(lambda x: (x - x.mean()) / x.std() if x.std() > 0 else x)
    sns.boxplot(data=normalized, palette="muted", ax=ax, linewidth=0.8)
    ax.set_title("Feature Outlier Analysis (Normalized)", fontsize=14, fontweight='bold', pad=15)
    plt.xticks(rotation=45, ha='right')
    fig.tight_layout()
    return _save_chart(fig, session_id, "boxplot")


# Map of chart type keywords to generator functions
CHART_GENERATORS = {
    "correlation": generate_correlation_heatmap,
    "distribution": generate_distribution_plot,
    "missing": generate_missing_values_chart,
    "target": None,  # Needs target_col argument
    "boxplot": generate_boxplot,
    "outlier": generate_boxplot,
}


def generate_chart(chart_type: str, df: pd.DataFrame, session_id: str, target_col: str = None) -> str:
    """Main dispatcher: generate a chart by type and return its URL path."""
    chart_type = chart_type.lower().strip()
    
    if chart_type in ("target", "target_distribution") and target_col:
        return generate_target_distribution(df, session_id, target_col)
    
    generator = CHART_GENERATORS.get(chart_type)
    if generator:
        return generator(df, session_id)
    
    # Default: try correlation
    return generate_correlation_heatmap(df, session_id)
