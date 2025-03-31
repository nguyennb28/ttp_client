import os
import pandas as pd
from django.core.management.base import BaseCommand
from api.models import ContainerSize
from django.conf import settings


class Command(BaseCommand):
    help = "Seed container sizes from data/container_size.csv"

    def handle(self, *args, **kwargs):
        csv_path = os.path.join(settings.BASE_DIR, "data", "container_size.csv")
        data = pd.read_csv(
            csv_path, header=None, names=["name", "size", "abbreviation"]
        )

        container_sizes_create = []

        for index, row in data.iterrows():
            containerSize = ContainerSize(
                name=row["name"], size=row["size"], abbreviation=row["abbreviation"]
            )
            container_sizes_create.append(containerSize)

        print(container_sizes_create)

        if ContainerSize.objects.bulk_create(container_sizes_create):
            self.stdout.write(
                self.style.SUCCESS(f"Successfully seed: {len(container_sizes_create)}")
            )
