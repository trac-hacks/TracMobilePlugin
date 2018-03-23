
class Ticket {

    constructor(init = null) {
        if (!init) {
            init = [null, null, null, {}];
        }

        this.id = init[0];
        this.createTime = init[1];
        this.modifyTime = init[2];
        this.attributes = init[3];

        this._history = [];
        this._attachments = [];
        this._actions = [];

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
}

function parseTime (obj) {
    if (obj && obj.__jsonclass__ && obj.__jsonclass__[1])
        return obj.__jsonclass__[1].replace('T', ' ');
    else
        return null;
}

export default Ticket;