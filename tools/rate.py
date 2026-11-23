"""Курс долара ПриватБанку для калькулятора: пише rate.json поруч зі сторінкою.
Безготівковий курс продажу (coursid=11) — основний; готівковий (coursid=5) — для довідки.
Запускається щоранку з .github/workflows/rate.yml; оновлює файл раз на день, після 9:00 за Києвом."""
import json, sys, urllib.request, datetime, zoneinfo, pathlib

URL = 'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid={}'
OUT = pathlib.Path(__file__).resolve().parent.parent / 'rate.json'

def usd(course):
    with urllib.request.urlopen(URL.format(course), timeout=20) as r:
        rows = json.load(r)
    row = next(x for x in rows if x['ccy'] == 'USD')
    return round(float(row['sale']), 4)

now = datetime.datetime.now(zoneinfo.ZoneInfo('Europe/Kyiv'))
force = '--force' in sys.argv
old = json.loads(OUT.read_text()) if OUT.exists() else {}
if not force and (now.hour < 9 or old.get('date') == now.date().isoformat()):
    print('пропуск: ще немає 9:00 або курс на сьогодні вже є'); sys.exit(0)

data = {
    'usd_sale': usd(11),
    'usd_sale_cash': usd(5),
    'date': now.date().isoformat(),
    'time': now.strftime('%H:%M'),
    'source': 'ПриватБанк, безготівковий курс, продаж',
}
OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + '\n')
print(data)
