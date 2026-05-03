import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder

def load_data(file_path):
    """
    Load dataset from a file (e.g., CSV).
    """
    return pd.read_csv(file_path)

def clean_data(df):
    """
    Handle missing values, outliers, etc.
    """
    # Example: drop rows with missing values
    df = df.dropna()
    return df

def preprocess_features(df, categorical_cols=None, numerical_cols=None):
    """
    Preprocess categorical and numerical features.
    """
    if categorical_cols:
        le = LabelEncoder()
        for col in categorical_cols:
            df[col] = le.fit_transform(df[col])
            
    if numerical_cols:
        scaler = StandardScaler()
        df[numerical_cols] = scaler.fit_transform(df[numerical_cols])
        
    return df

def split_data(df, target_col):
    """
    Split data into features (X) and target (y).
    """
    X = df.drop(columns=[target_col])
    y = df[target_col]
    return X, y
