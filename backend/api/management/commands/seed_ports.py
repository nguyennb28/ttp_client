import os
import pandas as pd
from django.core.management.base import BaseCommand
from api.models import Port
from django.conf import settings
import ast
import csv


class Command(BaseCommand):
    help = "Seed port from data/port.csv"

    def handle(self, *args, **kwargs):
        csv_path = os.path.join(settings.BASE_DIR, "data", "port.csv")

        ports_create = []
        with open(csv_path, newline="", encoding="utf-8") as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                data_list = ast.literal_eval(row[0])
                port = Port(country=data_list[0], name=data_list[1], code=data_list[2])
                ports_create.append(port)
        
        if ports_create:
            if Port.objects.bulk_create(ports_create):
                self.stdout.write(self.style.SUCCESS(f"Successfully seed: {len(ports_create)} records"))
            
