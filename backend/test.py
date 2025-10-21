# monitor_mi_listener_with_order.py
import argparse, datetime as dt, time, pyodbc
from typing import Optional, Tuple

STATE_MAP = {0:"Unknown",1:"Running",2:"ShortStop",3:"Stopped",4:"PlannedStop",5:"Setup"}

SQL_CURRENT = r'''
SELECT
  mi.machine_id,
  mi.work_center_number,
  mi.state,
  mi.is_setup,
  mi.indirect_code,
  mi.last_reporting_time
FROM "mi_001.1".public.machine_information mi
WHERE mi.work_center_number = ?
'''

# fallback för stopkod, senaste i loggen
SQL_FALLBACK_STOP = r'''
SELECT
  wli.indirect_code,
  wli.report_time
FROM "mi_001.1".public.work_log_item wli
WHERE wli.work_center_number = ?
  AND wli.indirect_code IS NOT NULL AND wli.indirect_code <> ''
ORDER BY wli.report_time DESC
LIMIT 1
'''

# aktiv tillverkningsorder (end_time IS NULL => aktiv)
SQL_ACTIVE_ORDER = r'''
SELECT
  cw.order_number,
  cw.part_number,
  cw.report_number,
  cw.start_time,
  cw.end_time
FROM "mi_001.1".public.current_work cw
WHERE cw.work_center_number = ?
ORDER BY (cw.end_time IS NULL) DESC, cw.start_time DESC
LIMIT 1
'''

def fetch_current(cur, wc:str):
    """Status + stopkod från machine_information (+ ev. fallback i work_log_item)."""
    cur.execute(SQL_CURRENT, wc)
    row = cur.fetchone()
    if not row: return None
    wcnum = str(row.work_center_number)
    state = int(row.state) if row.state is not None else 0
    stop = (row.indirect_code or '').strip() or None
    t = row.last_reporting_time
    is_setup = bool(row.is_setup)

    if not stop and STATE_MAP.get(state) != "Running":
        try:
            cur.execute(SQL_FALLBACK_STOP, wc)
            r2 = cur.fetchone()
            if r2 and r2.indirect_code:
                stop = str(r2.indirect_code).strip()
        except Exception:
            pass
    return wcnum, state, stop, t, is_setup

def fetch_active_order(cur, wc:str):
    """Returnerar (order_number, part_number, report_number, start_time) om aktiv, annars None."""
    cur.execute(SQL_ACTIVE_ORDER, wc)
    row = cur.fetchone()
    if not row:
        return None
    # aktiv om end_time är NULL
    if getattr(row, "end_time", None) is None:
        return (
            (row.order_number or "").strip() or None,
            (row.part_number or "").strip() or None,
            row.report_number,
            row.start_time,
        )
    return None

def main():
    ap = argparse.ArgumentParser(description="Lyssna på Monitor MI (ODBC) och skriv ut status, stopkod samt aktiv MO.")
    ap.add_argument("work_center_number")
    ap.add_argument("--dsn", default="monitormi")
    ap.add_argument("--uid"); ap.add_argument("--pwd")
    ap.add_argument("--poll", type=float, default=2.0)
    ap.add_argument("--timeout", type=int, default=5)
    a = ap.parse_args()

    cs = f"DSN={a.dsn};" + (f"UID={a.uid};" if a.uid else "") + (f"PWD={a.pwd};" if a.pwd else "") + f"Timeout={a.timeout};"
    print(f"Ansluter till ODBC DSN '{a.dsn}' ...")
    conn = pyodbc.connect(cs); cur = conn.cursor()
    print("Lyssnar. Avsluta med Ctrl+C.\n")

    last_key: Optional[Tuple[str, Optional[str], Optional[str], Optional[str]]] = None

    try:
        while True:
            try:
                rec = fetch_current(cur, a.work_center_number)
                if not rec:
                    time.sleep(a.poll); continue
                wc, state_i, stop, ts, is_setup = rec
                status = STATE_MAP.get(state_i, f"State({state_i})")
                if is_setup and status == "Running":
                    status = "Setup (Running)"

                # hämta aktiv order (om finns)
                ao = fetch_active_order(cur, a.work_center_number)
                if ao:
                    order_no, part_no, report_no, start_time = ao
                else:
                    order_no = part_no = None
                    report_no = None
                    start_time = None

                key = (status, stop, order_no, part_no)
                if key != last_key:
                    stamp = ts.strftime("%Y-%m-%d %H:%M:%S") if isinstance(ts, dt.datetime) else dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    ord_txt = f" | Order: {order_no}  Part: {part_no}" if order_no or part_no else ""
                    print(f"[{stamp}] WC {wc} → Status: {status} | StopCode: {stop or '-'}{ord_txt}")
                    last_key = key

            except pyodbc.OperationalError as e:
                print(f"ODBC-fel: {e}. Återansluter om 3s ..."); time.sleep(3)
                conn = pyodbc.connect(cs); cur = conn.cursor()
            except Exception as e:
                print(f"Fel: {e}"); time.sleep(a.poll)

            time.sleep(a.poll)
    except KeyboardInterrupt:
        print("\nStoppat.")
    finally:
        try: cur.close(); conn.close()
        except: pass

if __name__ == "__main__":
    main()
