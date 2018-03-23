from tracrpc.api import *
from tracrpc.ticket import TicketRPC
from trac.core import *
from trac.ticket.report import Report, ReportModule


class TracMobileRPC(Component):
    implements(IXMLRPCHandler)

    def xmlrpc_namespace(self):
        return 'tracmobile'

    def xmlrpc_methods(self):
        yield 'REPORT_VIEW', ((list,),), self.getReports
        yield 'REPORT_VIEW', ((dict, int),), self.getReport
        yield None, ((list, list),), self.getTickets

    def getReports(self, req):
        """
        Get a list of available reports
        """
        reports = list(Report.select(self.env))
        return [{"id": r.id, "title": r.title, "description": r.description} for r in reports]

    def getReport(self, req, rid):
        """
        Get report detail and matching tickets
        """
        rid = int(rid)
        rm = ReportModule(self.env)
        r = Report(self.env, rid)
        title, description, sql = r.title, r.description, r.query
        cols, rows, do_, not_, care = rm.execute_paginated_report(req, rid, sql, {}, 0, 0)
        tickets = []
        if 'ticket' in cols:
            for i in rows:
                tickets.append(i[cols.index('ticket')])
        return {"report": {"id": r.id, "title": r.title, "description": r.description},
                "tickets": tickets}

    def getTickets(self, req, tids):
        """
        Get multi ticket as ticket.get(tid)
        """
        tr = TicketRPC(self.env)
        return [tr.get(req, tid) for tid in tids]

