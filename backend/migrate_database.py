#!/usr/bin/env python3
"""
Database migration script to add missing user_id column to verification_records table.
This script safely adds the user_id column if it doesn't exist.
"""

import os
import sys
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.exc import OperationalError
import logging

# Add the current directory to Python path
sys.path.append(os.path.dirname(__file__))

from database import DATABASE_URL, is_postgres

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_column_exists(engine, table_name, column_name):
    """Check if a column exists in a table"""
    inspector = inspect(engine)
    columns = inspector.get_columns(table_name)
    return any(col['name'] == column_name for col in columns)

def migrate_database(database_url=None):
    """Add missing user_id column to verification_records table"""
    try:
        # Use provided database URL or default to the one from database module
        db_url = database_url or DATABASE_URL
        logger.info(f"🔍 Starting migration with database URL: {db_url}")
        # Create engine
        engine = create_engine(db_url)
        
        with engine.connect() as conn:
            # Check if verification_records table exists
            inspector = inspect(engine)
            table_names = inspector.get_table_names()
            logger.info(f"📋 Found tables: {table_names}")
            
            if 'verification_records' not in table_names:
                logger.info("verification_records table doesn't exist. Skipping migration.")
                return
            
            # Check if user_id column already exists
            logger.info("🔍 Checking if user_id column exists...")
            if check_column_exists(engine, 'verification_records', 'user_id'):
                logger.info("user_id column already exists in verification_records table. No migration needed.")
                return
            
            logger.info("➕ Adding user_id column to verification_records table...")
            
            # Add the user_id column
            if is_postgres:
                # PostgreSQL syntax
                alter_sql = """
                ALTER TABLE verification_records 
                ADD COLUMN user_id INTEGER;
                """
                logger.info("🐘 Using PostgreSQL syntax")
            else:
                # SQLite syntax
                alter_sql = """
                ALTER TABLE verification_records 
                ADD COLUMN user_id INTEGER;
                """
                logger.info("🗃️ Using SQLite syntax")
            
            logger.info(f"🔧 Executing SQL: {alter_sql.strip()}")
            conn.execute(text(alter_sql))
            conn.commit()
            
            logger.info("✅ Successfully added user_id column to verification_records table")
            
            # Verify the column was added
            if check_column_exists(engine, 'verification_records', 'user_id'):
                logger.info("✅ Migration completed successfully")
            else:
                logger.error("❌ Migration failed - user_id column not found after adding")
                
    except OperationalError as e:
        if "already exists" in str(e) or "duplicate column" in str(e):
            logger.info("user_id column already exists. No migration needed.")
        else:
            logger.error(f"Database error during migration: {e}")
            # Don't raise the error to prevent app startup failure
            logger.warning("Continuing with application startup despite migration error")
    except Exception as e:
        logger.error(f"Unexpected error during migration: {e}")
        # Don't raise the error to prevent app startup failure
        logger.warning("Continuing with application startup despite migration error")

if __name__ == "__main__":
    logger.info("Starting database migration...")
    migrate_database()
    logger.info("Migration process completed.")
