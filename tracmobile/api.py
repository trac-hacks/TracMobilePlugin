from trac.core import *
from trac.web import IRequestHandler
from trac.web.chrome import ITemplateProvider
from trac.ticket import TicketSystem
from mobiledetect import MobileDetect
import json

import pkg_resources

def custom_json(obj):
    return json.dumps(obj, cls=MagicEncoder)

class TracMobilePlugin(Component):

    implements(ITemplateProvider, IRequestHandler)

    # IRequestHandler
    def match_request(self, req):
        return (req.path_info == '/' and MobileDetect(useragent=req.get_header('user-agent')).is_mobile()) \
               or req.path_info == '/mobile'

    def process_request(self, req):
        if req.path_info == '/' and MobileDetect(useragent=req.get_header('user-agent')).is_mobile():
            req.redirect('/mobile')
        else:
            ts = TicketSystem(self.env)
            fields = ts.get_ticket_fields()
            return 'test.html', {"JSON": custom_json, "fields": fields}, None

    #ITemplateProvider methods
    def get_htdocs_dirs(self):
        return [('tracmobile', pkg_resources.resource_filename('tracmobile', 'htdocs'))]

    def get_templates_dirs(self):
        return [pkg_resources.resource_filename('tracmobile', 'htdocs')]


class MagicEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, "to_json"):
            return self.default(obj.to_json())
        elif hasattr(obj, "__dict__"):
            d = dict(
                (key, value)
                for key, value in inspect.getmembers(obj)
                if not key.startswith("__")
                and not inspect.isabstract(value)
                and not inspect.isbuiltin(value)
                and not inspect.isfunction(value)
                and not inspect.isgenerator(value)
                and not inspect.isgeneratorfunction(value)
                and not inspect.ismethod(value)
                and not inspect.ismethoddescriptor(value)
                and not inspect.isroutine(value)
            )
            return self.default(d)
        return obj