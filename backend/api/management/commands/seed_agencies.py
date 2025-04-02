import os
import pandas as pd
from django.core.management.base import BaseCommand
from api.models import Agency
from django.conf import settings


class Command(BaseCommand):
    help = "Seed agency from data/agency.csv"

    def handle(self, *args, **kwargs):
        csv_path = os.path.join(settings.BASE_DIR, "data", "agency.csv")
        data = pd.read_csv(csv_path, dtype={"phone": str})

        agency_create = []
        for index, row in data.iterrows():
            agency = Agency(
                name=row["name"].strip(),
                address=row["address"].strip(),
                phone=None if pd.isnull(row["phone"]) else row["phone"].strip(),
                abbreviation=(
                    None
                    if pd.isnull(row["abbreviation"].strip())
                    else row["abbreviation"].strip()
                ),
            )

            agency_create.append(agency)
        if agency_create:
            Agency.objects.bulk_create(agency_create)
            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully seed Agency: {len(agency_create)} records"
                )
            )
        else:
            self.stdout.write(self.style.WARNING("No new records to import."))
