
class Ticket {

    constructor(init = null) {
        if (!init) {
            init = [null, null, null, {}];
        }

        this.id = init[0];
        this.createTime = init[1];
        this.modifyTime = init[2];
        this.attributes = init[3];

        this.history = null;
        this.attachments = null;
        this.actions = null;
        this.error = null;

        if (this.createTime) {
            this.createTime = parseTime(this.createTime);
        }
        if (this.modifyTime) {
            this.modifyTime = parseTime(this.createTime);
        }

        if (this.attributes) {
            Object.keys(this.attributes).forEach(i => {
                var v = this.attributes[i];
                if (v && v.__jsonclass__ && v.__jsonclass__[0] && v.__jsonclass__[0] == 'datetime') {
                    this.attributes[i] = parseTime(v);
                }
            })
        }
    }

    getAttachments(jayson) {
        if (this.attachments === null) {
            jayson.request( 'ticket.listAttachments', [this.id], (err, response) => {
                if (err)  this.error = err;
                else if (response.error) this.error = response.error;
                else {
                    this.attachments = response.result.map(function (i) {
                        return new TicketAttachment(i);
                    });
                }
            });
        }
    }

    getHistory(jayson) {
        if (this.history === null) {
            jayson.request( 'ticket.changeLog', [this.id], (err, response) => {
                if (err)  this.error = err;
                else if (response.error) this.error = response.error;
                else {
                    this.history = response.result.map(function (i) {
                        return new TicketHistory(i);
                    });
                }
            });
        }
    }

    getActions(jayson) {
        if (this.actions === null) {
            jayson.request( 'ticket.getActions', [this.id], (err, response) => {
                if (err)  this.error = err;
                else if (response.error) this.error = response.error;
                else {
                    this.actions = response.result.map(function (i) {
                        return new TicketAction(i);
                    });
                }
            });
        }
    }
}

class TicketAttachment {

    constructor(init = null) {
        if (!init) {
            init = [null, null, null, null, null];
        }

        this.name = init[0];
        this.description = init[1];
        this.size = init[2];
        this.time = parseTime(init[3]);
        this.author = init[4];
    }

}

class TicketAction {

    constructor(init = null) {
        if (!init) {
            init = [null, null, null, null, null];
        }

        this.name = init[0];
        this.displayName = init[1];
        this.description = init[2];
        this.index = init[4];
        if (init[3]) {
            this.options = init[3].map(function (i) {
                return new TicketOption(i);
            })
        }
        else {
            this.options = null;
        }
    }
}

class TicketOption {
    constructor(init = null) {
        if (!init) {
            init = [null, null, null];
        }

        var displayNameMap = {
            'reassign_owner': 'Assign to',
            'resolve_resolution': 'Resolution',
        }

        this.optionName = init[0];
        this.value = init[1];
        this.availableOptions = init[2];
        this.displayName = '';

        for (var i in displayNameMap) {
            if (this.optionName.endsWith(i)) {
                this.displayName = displayNameMap[i];
            }
        }
    }
}

class TicketHistory {

    constructor(init = null) {
        if (!init) {
            init = [null, null, null, null, null, null];
        }

        this.time = parseTime(init[0]);
        this.author = init[1];
        this.field = init[2];
        this.oldvalue = init[3];
        this.newvalue = init[4];
        this.permanent = init[5];
    }

}

function parseTime (obj) {
    if (obj && obj.__jsonclass__ && obj.__jsonclass__[1])
        return obj.__jsonclass__[1].replace('T', ' ');
    else
        return null;
}

export default Ticket;