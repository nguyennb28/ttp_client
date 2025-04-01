# import os
# import pandas as pd
# from django.core.management.base import BaseCommand
# from api.models import VAT_INFO
# from django.conf import settings


# class Command(BaseCommand):
#     help = "Seed VAT Info from data/vat_info.csv"

#     def handle(self, *args, **kwargs):
#         csv_path = os.path.join(settings.BASE_DIR, "data", "vat_info.csv")
#         data = pd.read_csv(
#             csv_path,
#         )

#         vat_info_create = []

#         for index, row in data.iterrows():
#             company_tax_code = (
#                 None if pd.isnull(row["company_tax_code"]) else row["company_tax_code"]
#             )
#             if company_tax_code is not None:
#                 exist_company_tax_code = VAT_INFO.objects.filter(
#                     company_tax_code=company_tax_code
#                 ).exists()
#                 if exist_company_tax_code:
#                     continue

#             vatInfo = VAT_INFO(
#                 company_name=row["company_name"],
#                 address=row["address"],
#                 company_tax_code=row["company_tax_code"],
#                 ward_or_commune=row["ward_or_commune"],
#                 district=row["district"],
#                 province_or_city=row["province_or_city"],
#                 country=row["country"],
#                 einvoice_contact_name=row["einvoice_contact_name"],
#                 einvoice_contact_email=row["einvoice_contact_email"],
#             )
#             vat_info_create.append(vatInfo)

#         if VAT_INFO.objects.bulk_create(vat_info_create):
#             self.stdout.write(
#                 self.style.SUCCESS(f"Successfully seed: {len(vat_info_create)}")
#             )

import os
import pandas as pd
from django.core.management.base import BaseCommand
from api.models import VAT_INFO
from django.conf import settings


class Command(BaseCommand):
    help = "Seed VAT Info from data/vat_info.csv"

    def handle(self, *args, **kwargs):
        csv_path = os.path.join(settings.BASE_DIR, "data", "vat_info.csv")
        data = pd.read_csv(csv_path)

        vat_info_create = []
        seen_tax_codes = set()  # Track tax codes in the current run

        for index, row in data.iterrows():
            # Clean and sanitize company_tax_code
            tax_code = (
                None
                if pd.isnull(row["company_tax_code"])
                else row["company_tax_code"].strip()
            )

            if tax_code:
                if (
                    VAT_INFO.objects.filter(company_tax_code=tax_code).exists()
                    or tax_code in seen_tax_codes
                ):
                    continue
                seen_tax_codes.add(tax_code)

            vat_info = VAT_INFO(
                company_name=(row["company_name"]),
                address=(row["address"]),
                company_tax_code=tax_code,
                ward_or_commune=(row["ward_or_commune"]),
                district=(row["district"]),
                province_or_city=(row["province_or_city"]),
                country=(row["country"]),
                einvoice_contact_name=(row["einvoice_contact_name"]),
                einvoice_contact_email=(row["einvoice_contact_email"]),
            )
            vat_info_create.append(vat_info)

        if vat_info_create:
            VAT_INFO.objects.bulk_create(vat_info_create)
            self.stdout.write(
                self.style.SUCCESS(
                    f"Successfully seeded: {len(vat_info_create)} records"
                )
            )
        else:
            self.stdout.write(self.style.WARNING("No new records to import."))
