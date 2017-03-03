const units = function iife () {
    const seconds = ["seconds", "second", "s"];
    const minutes = ["minutes", "minute", "mins", "min", "m"];
    const hours = ["hours", "hour", "h"];
    const days = ["days", "day", "d"];

    const units = new Map();

    seconds.forEach(function (unit) {
        units.set(unit, 1e3);
    });

    minutes.forEach(function (unit) {
        units.set(unit, 60e3);
    });

    hours.forEach(function (unit) {
        units.set(unit, 3600e3);
    });

    days.forEach(function (unit) {
        units.set(unit, 86400e3);
    });

    return units;
}();

module.exports = {
    init: function (client, _deps) {
        return {
            handlers: {
                "!remindme": function (command) {
                    const scalar = Number(command.args[0]);
                    const unit = command.args[1];
                    const message = command.args.slice(2).join(" ");

                    if (Number.isNaN(scalar)) {
                        return "Syntax: !remindme <time> <unit> <messag> | Note: <time> must be a number.";
                    }

                    if (scalar <= 0) {
                        return "Syntax: !remindme <time> <unit> <messag> | Note: <time> must be positive.";
                    }

                    const unitMultiplier = units.get(unit);

                    if (unitMultiplier === undefined) {
                        return `Unknown unit. Use one of ${Object.keys(units).join(", ")}.`;
                    }

                    if (message.length === 0) {
                        return "Syntax: !remindme <time> <unit> <messag> | Note: <message> cannot be empty.";
                    }

                    if (scalar * unitMultiplier > 86400e3 * 30) {
                        return "Can only remind you in less than 30 days."
                    }

                    setTimeout(function () {
                        client.say(command.nickname, "You wanted me to remind you that:");
                        client.say(command.nickname, message);
                    }, Math.floor(scalar * unitMultiplier));

                    return {
                        query: true,
                        message: `Set to remind you in ${command.args[0]} ${command.args[1]}.`
                    };
                }
            },

            "help": {
                "remindme": "!remindme <time> <unit> <message>"
            },

            "commands": ["remindme"]
        };
    }
};