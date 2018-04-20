from trac.util import to_datetime
from trac.web.chrome import web_context
from tracrpc.api import *
from tracrpc.ticket import TicketRPC
from trac.core import *
from trac.ticket.report import Report, ReportModule
from trac.timeline import ITimelineEventProvider


class TracMobileRPC(Component):
    implements(IXMLRPCHandler)

    event_providers = ExtensionPoint(ITimelineEventProvider)

    def xmlrpc_namespace(self):
        return 'tracmobile'

    def xmlrpc_methods(self):
        yield 'REPORT_VIEW', ((list,),), self.getReports
        yield 'REPORT_VIEW', ((dict, int),), self.getReport
        yield None, ((list, list),), self.getTickets
        yield 'TIMELINE_VIEW', ((list, int, int, list), ), self.getTimelineEvents

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

    def getTimelineEvents(self, req, start, end=None, filters=None):
        """
        Get timeline events
        """
        from datetime import datetime

        html_context = web_context(req)
        html_context.set_hints(wiki_flavor='html',
                               shorten_lines=True)

        start_date = to_datetime(start, req.tz)
        end_date = to_datetime(end, req.tz) if end is not None else to_datetime(None, req.tz)

        results = []

        for event_provider in self.event_providers:
            available_filters = [item[0] for item in event_provider.get_timeline_filters(req)] or []
            available_filters = filter(lambda i: i in filters, available_filters)
            events = list(event_provider.get_timeline_events(req, start_date, end_date, available_filters))
            results.extend([{'title': unicode(event_provider.render_timeline_event(html_context, 'title', e)),
                        'description': unicode(event_provider.render_timeline_event(html_context, 'description', e)),
                        'url': event_provider.render_timeline_event(html_context, 'url', e),
                        'kind': e[0], 'date': str(e[1]), 'author': e[2]} for e in events])

        return results