import os
import pandas as pd
from django.core.management.base import BaseCommand
from api.models import CFS, Agency, ContainerSize, Port
from django.conf import settings


class Command(BaseCommand):
    help = "Seed CFS from data/cfs.csv"

    def handle(self, *args, **kwargs):
        csv_path = os.path.join(settings.BASE_DIR, "data", "cfs.csv")
        data = pd.read_csv(csv_path)

        cfs_create = []

        fields = [
            "ship_name",
            "mbl",
            "container_number",
            "cbm",
            "eta",
            "actual_date",
            "note",
            "delivery_order_fee",
            "cleaning",
            "agency_id",
            "container_size_id",
            "port_id",
            "created_at",
            "updated_at",
            "end_date",
        ]

        for index, row in data.iterrows():

            for item in fields:
                if pd.isna(row[item]):
                    row[item] = None

            cfs = CFS(
                ship_name=row["ship_name"],
                mbl=row["mbl"],
                container_number=row["container_number"],
                cbm=row["cbm"],
                eta=row["eta"],
                actual_date=row["actual_date"],
                note=row["note"],
                delivery_order_fee=row["delivery_order_fee"],
                cleaning=row["cleaning"],
                agency=Agency(row["agency_id"]),
                container_size=ContainerSize(row["container_size_id"]),
                port=Port(row["port_id"]),
                created_at=row["created_at"],
                updated_at=row["updated_at"],
                end_date=row["end_date"],
            )
            cfs_create.append(cfs)
        if CFS.objects.bulk_create(cfs_create):
            self.stdout.write(
                self.style.SUCCESS(f"CFS_CREATE: {len(cfs_create)} records")
            )
        else:
            self.stdout.write(self.style.ERROR(f"Fail to seed"))
