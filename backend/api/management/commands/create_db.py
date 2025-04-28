import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Create a new PostgreSQL database"

    def add_arguments(self, parser):
        parser.add_argument("dbname", type=str, help="Name of the database to create")
        parser.add_argument(
            "--user", type=str, help="PostgreSQL user", default="postgres"
        )
        parser.add_argument(
            "--password", type=str, help="PostgreSQL password", default="password"
        )
        parser.add_argument(
            "--host", type=str, help="PostgreSQL host", default="localhost"
        )
        parser.add_argument("--port", type=str, help="PostgreSQL port", default="5432")

    def handle(self, *args, **options):
        base_dbname = options["dbname"]
        user = options["user"]
        password = options["password"]
        host = options["host"]
        port = options["port"]

        try:
            conn = psycopg2.connect(
                dbname="postgres",  # Kết nối tới db mặc định
                user=user,
                password=password,
                host=host,
                port=port,
            )
            conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
            cur = conn.cursor()

            cur.execute("SELECT datname FROM pg_database;")
            existing_dbs = [row[0] for row in cur.fetchall()]

            counter = 1
            # dbname = base_dbname
            dbname = f"{base_dbname}_{counter}"
            while dbname in existing_dbs:
                dbname = f"{base_dbname}_{counter}"
                counter += 1

            # Create database
            cur.execute(f"CREATE DATABASE {dbname};")

            cur.close()
            conn.close()

            self.stdout.write(
                self.style.SUCCESS(f'Database "{dbname}" created successfully.')
            )

        except psycopg2.errors.DuplicateDatabase:
            raise CommandError(f'Database "{dbname}" already exists.')

        except Exception as e:
            raise CommandError(f"Error creating database: {e}")
