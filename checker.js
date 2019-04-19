/* Copyright 2015, All Rights Reserved. */
var checkTimeout = 5000,
    checkDelay = 100,
    showIPPort = true,
    showConnection = true,
    clickToRefresh = false,
    fixPing = true,
    selected = "Main",
    subSelection = "",
    processing = 0,
    hash = window.location.hash.split('-'),
    alreadyProcessed = [],
    rendered = 0,
    loadingTimers = [],
    loadingArr = [{
        loading: true,
        unknown: true
    }],
    clockTicking = false;

if (hash.length) {
    switch (hash[0]) {
        case "#EMS":
        case "#GMS":
            //case "#JMS":
        case "#KMS":
        case "#MSEA":
		case "#THMS":
        case "#MS2":
            selected = hash[0].replace('#', '');
            break;
        default:
            break;
    }
}

if (hash.length > 1) {
    subSelection = hash[1];
} else {
    subSelection = GetDefaultSubSelectionForVersion(selected);
}

function ping(ip, callback) {
    if (!this.inUse) {
        this.status = 'unchecked';
        this.inUse = true;
        this.callback = callback;
        this.ip = ip;
        this.start = 0;
        var _that = this;
        this.img = new Image();
        this.img.onload = function(e) {
            window.clearInterval(_that.timer);
            _that.inUse = false;
            _that.callback('responded', +(new Date()) - _that.start);
            if (--processing == 0)
                if (window.stop) {
                    window.stop();
                } else if (document.execCommand) {
                document.execCommand('Stop');
            };
        };
        this.img.onerror = function(e, error, errorThrown) {
            if (_that.inUse) {
                window.clearInterval(_that.timer);
                _that.inUse = false;
                _that.callback('responded', +(new Date()) - _that.start, e);
                if (--processing == 0)
                    if (window.stop) {
                        window.stop();
                    } else if (document.execCommand) {
                    document.execCommand('Stop');
                };
                return true;
            }
        };
        this.start = +(new Date());
        this.img.src = "http://" + ip + "/?cachebreaker=" + (+(new Date()));
        this.timer = setTimeout(function() {
            if (_that.inUse) {
                _that.inUse = false;
                _that.callback('timeout', false);
                if (--processing == 0)
                    if (window.stop) {
                        window.stop();
                    } else if (document.execCommand) {
                    document.execCommand('Stop');
                };
            }
        }, GetCheckTimeout());
    }
}

var PingModel = function(servers) {
    var addr = servers[0].address;

    // Hacky, for some reason the foreach binding fires twice.
    if (!(servers[0].name == 'Self') && alreadyProcessed.indexOf(addr) == -1) {
        alreadyProcessed.push(servers[0].address);
        return;
    }

    var serversArr = [];

    var x = servers;

    for (var i = 0; i < servers.length; i++)
        for (var j = 0; j < servers[i].length; j++)
            serversArr.push(servers[i][j]);

    var self = this;
    var myServers = [];
    var offset = 1;
    ko.utils.arrayForEach(serversArr, function(server) {
        if (!server.isMapleStoryGameServer || server.rel == subSelection || (server.rel == "Login" && (selected != 'GMS' && selected != 'MSEA'))) {
            myServers.push({
                icon: server.icon,
                name: server.name,
                sub: server.sub || false,
                interval: server.interval || false,
                address: server.address,
                port: server.port,
                unknown: server.unknown || false,
                status: ko.observable('unchecked'),
                time: ko.observable(""),
                values: ko.observableArray(),
                rel: server.rel
            });
        }
    });

    self.servers = ko.observableArray(myServers);
    processing += self.servers().length;
    ko.utils.arrayForEach(self.servers(), function(s) {
        s.status('checking');

        function doPing() {
            new ping(s.address + ":" + s.port, function(status, time, e) {
                s.status(status);
                s.time(time);
                s.values.push(time);
                if (s.name == "Self") {
                    SetPingOffset(time);
                }
                console.clear();
                /*if (s.interval) {
                	setTimeout(doPing, s.interval);
                }*/
            });
        }
        setTimeout(function() {
            doPing();
        }, checkDelay * offset++)
    });
};

var GameServer = function(version, timeOffset, icons, servers) {
    return {
        name: "Game Servers",
        description: "These are the MapleStory " + version + " game servers.",
        selectedServers: ko.observable(loadingArr),
        icons: icons,
        timeOffset: timeOffset,
        content: function() {
            return new PingModel(servers)
        }
    }
}

var servers = {
    EMS: {
        Login: [{
            icon: "Mushroom.png",
            name: "Login",
            address: "18.196.14.103",
            port: "8484",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        }],
        Luna: [{
                icon: "Luna.png",
                name: "Channel 1",
                address: "109.234.74.70",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            },
            {
                icon: "Luna.png",
                name: "Channel 2",
                address: "109.234.74.71",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 3",
                address: "109.234.74.72",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 4",
                address: "109.234.74.73",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 5",
                address: "109.234.74.73",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 6",
                address: "109.234.74.73",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 7",
                address: "109.234.74.74",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 8",
                address: "109.234.74.74",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 9",
                address: "109.234.74.74",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 10",
                address: "109.234.74.75",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 11",
                address: "109.234.74.75",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 12",
                address: "109.234.74.75",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 13",
                address: "109.234.74.76",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 14",
                address: "109.234.74.76",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 15",
                address: "109.234.74.76",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 16",
                address: "109.234.74.77",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 17",
                address: "109.234.74.77",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 18",
                address: "109.234.74.77",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 19",
                address: "109.234.74.78",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }, {
                icon: "Luna.png",
                name: "Channel 20",
                address: "109.234.74.78",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Luna"
            }
        ],
        Reboot: [{
                icon: "Reboot.png",
                name: "Channel 1",
                address: "8.31.99.161",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 2",
                address: "8.31.99.135",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 3",
                address: "8.31.99.237",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 4",
                address: "8.31.99.136",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 5",
                address: "8.31.99.162",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 6",
                address: "8.31.99.137",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 7",
                address: "8.31.99.195",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 8",
                address: "8.31.99.138",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 9",
                address: "8.31.99.163",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 10",
                address: "8.31.99.144",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 11",
                address: "8.31.99.196",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 12",
                address: "8.31.99.145",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 13",
                address: "8.31.99.157",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 14",
                address: "8.31.99.146",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 15",
                address: "8.31.99.197",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 16",
                address: "8.31.99.158",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 17",
                address: "8.31.99.147",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 18",
                address: "8.31.99.148",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 19",
                address: "8.31.99.150",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Channel 20",
                address: "8.31.99.149",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            },
            {
                icon: "Reboot.png",
                name: "Cash Shop",
                address: "8.31.99.192",
                port: "8786",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            }
        ],
        InternalWebsites: [{
                icon: "Mushroom.png",
                name: "MapleStory",
                sub: "",
                address: "maplestory.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Forum",
                sub: "",
                address: "forum2.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Support",
                sub: "",
                address: "support.maplestory.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Download",
                sub: "",
                address: "download2.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Press",
                sub: "",
                address: "press.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "Avatars",
                sub: "NXA",
                address: "msavatar1.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "Images",
                sub: "NXA",
                address: "nxcache.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "API",
                sub: "NXA",
                address: "api.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "Guard",
                sub: "NXA",
                address: "guard.nexon.net",
                port: "80",
                rel: "nexon.net"
            }
        ],
        ExternalWebsites: [{
                icon: "fa-external-link",
                name: "Google",
                sub: "",
                address: "google.com",
                port: "80",
                interval: 60000,
                rel: "google.com"
            }
        ]
    },
    GMS: {
        Login: [{
                icon: "Mushroom.png",
                name: "Login 1",
                address: "34.215.62.60", // Verified as of Jan 28th 2017
                port: "8484",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            },
            {
                icon: "Mushroom.png",
                name: "Login 2",
                address: "35.167.153.201", // Verified as of Jan 28th 2017
                port: "8484",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            },
            {
                icon: "Mushroom.png",
                name: "Login 3",
                address: "52.37.193.138", // Verified as of Jan 28th 2017
                port: "8484",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            }
        ],
        CrossWorld: [{
            icon: "Generic.png",
            name: "Cross World",
            address: "54.149.241.32",
            port: "8586",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        }],
        Scania: [{
                icon: "Scania.png",
                name: "Channel 1",
                address: "8.31.99.164", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 2",
                address: "8.31.99.165", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 3",
                address: "8.31.99.231", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 4",
                address: "8.31.99.231", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 5",
                address: "8.31.99.165", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 6",
                address: "8.31.99.165", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 7",
                address: "8.31.99.198", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 8",
                address: "8.31.99.198", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 9",
                address: "8.31.99.166", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 10",
                address: "8.31.99.166", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 11",
                address: "8.31.99.211", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 12",
                address: "8.31.99.211", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 13",
                address: "8.31.99.167", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 14",
                address: "8.31.99.167", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 15",
                address: "8.31.99.212", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 16",
                address: "8.31.99.212", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 17",
                address: "8.31.99.168", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 18",
                address: "8.31.99.168", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 19",
                address: "8.31.99.213", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Channel 20",
                address: "8.31.99.213", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Cash Shop",
                address: "8.31.99.192", // Verified as of Jan 28th 2017
                port: "8785",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Monster Life",
                address: "8.31.99.205", // verified (no change)
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            },
            {
                icon: "Scania.png",
                name: "Evolution Lab",
                address: "8.31.99.197",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Scania"
            }
        ],
        Bera: [{
                icon: "Bera.png",
                name: "Channel 1",
                address: "54.186.151.49", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 2",
                address: "54.214.207.253", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 3",
                address: "34.214.214.251", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 4",
                address: "35.165.105.161", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 5",
                address: "35.167.16.143", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 6",
                address: "52.40.39.138", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 7",
                address: "54.68.47.217", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 8",
                address: "52.35.241.179", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 9",
                address: "34.218.68.31", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 10",
                address: "52.43.9.29", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 11",
                address: "54.213.64.154", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 12",
                address: "52.25.121.0", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 13",
                address: "54.148.5.57", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 14",
                address: "35.161.154.148", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 15",
                address: "54.203.140.45", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 16",
                address: "35.163.184.1", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 17",
                address: "34.218.100.191", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 18",
                address: "52.38.89.169", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 19",
                address: "52.88.17.178", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Channel 20", // Verified as of Jan 28th 2017
                address: "52.27.189.124",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
			{
                icon: "Bera.png",
                name: "CPQ/DIPQ/EvoLab 1",
                address: "54.70.148.148",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
			{
                icon: "Bera.png",
                name: "CPQ/DIPQ/EvoLab 2",
                address: "50.112.51.145",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
			{
                icon: "Bera.png",
                name: "CPQ/DIPQ/EvoLab 3",
                address: "35.164.186.245",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Cash Shop",
                address: "54.203.24.179", // Verified as of Jan 28th 2017
                port: "8785",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Monster Life",
                address: "34.217.198.173",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            },
            {
                icon: "Bera.png",
                name: "Auction House",
                address: "34.209.161.140",
                port: "8786",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bera"
            }
        ],
        BK: function(name) { // World alliance of Broa and Khaini
            return [{
                    icon: name + ".png",
                    name: "Channel 1",
                    address: "8.31.99.174", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 2",
                    address: "8.31.99.174", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 3",
                    address: "8.31.99.233", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 4",
                    address: "8.31.99.233", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 5",
                    address: "8.31.99.175", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 6",
                    address: "8.31.99.175", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 7",
                    address: "8.31.99.218", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 8",
                    address: "8.31.99.218", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 9",
                    address: "8.31.99.176", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 10",
                    address: "8.31.99.176", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 11",
                    address: "8.31.99.219", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 12",
                    address: "8.31.99.219", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 13",
                    address: "8.31.99.177", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 14",
                    address: "8.31.99.177", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 15",
                    address: "8.31.99.220", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 16",
                    address: "8.31.99.220", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 17",
                    address: "8.31.99.178", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 18",
                    address: "8.31.99.178", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 19",
                    address: "8.31.99.228", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 20",
                    address: "8.31.99.228", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Cash Shop",
                    address: "8.31.99.193", // Verified as of Jan 28th 2017
                    port: "8786",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Monster Life",
                    address: "8.31.99.205", // Verified (no change)
                    port: "8587",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Evolution Lab",
                    address: "8.31.99.197",
                    port: "8587",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                }
            ]
        },
        MYBCKN: function(name) { // World alliance of Mardia, Yellonde, Bellocan, Chaos, Kradia, Nova
            return [{
                    icon: name + ".png",
                    name: "Channel 1",
                    address: "8.31.99.184", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 2",
                    address: "8.31.99.184", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 3",
                    address: "8.31.99.235", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 4",
                    address: "8.31.99.235", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 5",
                    address: "8.31.99.185", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 6",
                    address: "8.31.99.185", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 7",
                    address: "8.31.99.240", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 8",
                    address: "8.31.99.240", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 9",
                    address: "8.31.99.186", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 10",
                    address: "8.31.99.186", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 11",
                    address: "8.31.99.244", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 12",
                    address: "8.31.99.244", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 13",
                    address: "8.31.99.151", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 14",
                    address: "8.31.99.151", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 15",
                    address: "8.31.99.151", // Verified as of Jan 28th 2017
                    port: "8587",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 16",
                    address: "8.31.99.152", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 17",
                    address: "8.31.99.152", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 18",
                    address: "8.31.99.152", // Verified as of Jan 28th 2017
                    port: "8587",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 19",
                    address: "8.31.99.153", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 20",
                    address: "8.31.99.153", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Cash Shop",
                    address: "8.31.99.194", // Verified as of Jan 28th 2017
                    port: "8786",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Monster Life",
                    address: "8.31.99.206", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Evolution Lab",
                    address: "8.31.99.197",
                    port: "8587",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                }
            ]
        },
        Windia: [{
                icon: "Windia.png",
                name: "Channel 1",
                address: "8.31.99.179", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 2",
                address: "8.31.99.179", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 3",
                address: "8.31.99.234", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 4",
                address: "8.31.99.234", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 5",
                address: "8.31.99.180", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 6",
                address: "8.31.99.180", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 7",
                address: "8.31.99.229", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 8",
                address: "8.31.99.229", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 9",
                address: "8.31.99.181", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 10",
                address: "8.31.99.181", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 11",
                address: "8.31.99.230", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 12",
                address: "8.31.99.230", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 13",
                address: "8.31.99.182", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 14",
                address: "8.31.99.182", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 15",
                address: "8.31.99.238", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 16",
                address: "8.31.99.238", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 17",
                address: "8.31.99.183", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 18",
                address: "8.31.99.183", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 19",
                address: "8.31.99.239", // Verified as of Jan 28th 2017
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Channel 20",
                address: "8.31.99.239", // Verified as of Jan 28th 2017
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Cash Shop",
                address: "8.31.99.194", // Verified as of Jan 28th 2017
                port: "8785",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Monster Life",
                address: "8.31.99.206", // Verified (no change)
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            },
            {
                icon: "Windia.png",
                name: "Evolution Lab",
                address: "8.31.99.198",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Windia"
            }
        ],
        GRAZED: function(name) {
            return [{
                    icon: name + ".png",
                    name: "Channel 1",
                    address: "8.31.99.187", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 2",
                    address: "8.31.99.187", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 3",
                    address: "8.31.99.236", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 4",
                    address: "8.31.99.236", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 5",
                    address: "8.31.99.159", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 6",
                    address: "8.31.99.159", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 7",
                    address: "8.31.99.245", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 8",
                    address: "8.31.99.245", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 9",
                    address: "8.31.99.160", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 10",
                    address: "8.31.99.160", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 11",
                    address: "8.31.99.246", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 12",
                    address: "8.31.99.246", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 13",
                    address: "8.31.99.154", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 14",
                    address: "8.31.99.154", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 15",
                    address: "8.31.99.154", // Verified as of Jan 28th 2017
                    port: "8587",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 16",
                    address: "8.31.99.155", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 17",
                    address: "8.31.99.155", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 18",
                    address: "8.31.99.155", // Verified as of Jan 28th 2017
                    port: "8587",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 19",
                    address: "8.31.99.156", // Verified as of Jan 28th 2017
                    port: "8585",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Channel 20",
                    address: "8.31.99.156", // Verified as of Jan 28th 2017
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Cash Shop",
                    address: "8.31.99.194", // Verified as of Jan 28th 2017
                    port: "8787",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Monster Life",
                    address: "8.31.99.206", // Verified as of Jan 28th 2017
                    port: "8587",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                },
                {
                    icon: name + ".png",
                    name: "Evolution Lab",
                    address: "8.31.99.199",
                    port: "8586",
                    interval: 5000,
                    values: [],
                    isMapleStoryGameServer: true,
                    rel: name
                }
            ]
        },
        Reboot: [{
				icon: "Reboot.png",
				name: "Channel 1",
				address: "35.155.204.207",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 2",
				address: "52.26.82.74",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 3",
				address: "34.217.205.66",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 4",
				address: "54.148.188.235",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 5",
				address: "54.218.157.183",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 6",
				address: "54.68.160.34",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 7",
				address: "52.25.78.39",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 8",
				address: "52.33.249.126",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 9",
				address: "34.218.141.142",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 10",
				address: "54.148.170.23",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 11",
				address: "54.191.142.56",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 12",
				address: "54.201.184.26",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 13",
				address: "52.13.185.207",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 14",
				address: "34.215.228.37",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 15",
				address: "54.187.177.143",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 16",
				address: "54.203.83.148",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 17",
				address: "35.161.183.101",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 18",
				address: "52.43.83.76",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 19",
				address: "54.69.114.137",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
			{
				icon: "Reboot.png",
				name: "Channel 20",
				address: "54.148.137.49",
				port: 8585,
				interval: 5000,
				values: [],
				isMapleStoryGameServer: true,
				rel: "Reboot"
			},
	        {
		        icon: "Reboot.png",
		        name: "CPQ/DIPQ/EvoLab 1",
				address: "52.35.234.148",
		        port: 8585,
		        interval: 5000,
		        values: [],
			    isMapleStoryGameServer: true,
			    rel: "Reboot"
			},
	        {
		        icon: "Reboot.png",
		        name: "CPQ/DIPQ/EvoLab 2",
				address: "52.35.234.148",
		        port: 8586,
		        interval: 5000,
		        values: [],
			    isMapleStoryGameServer: true,
			    rel: "Reboot"
			},
	        {
		        icon: "Reboot.png",
		        name: "CPQ/DIPQ/EvoLab 3",
				address: "52.35.234.148",
		        port: 8587,
		        interval: 5000,
		        values: [],
			    isMapleStoryGameServer: true,
			    rel: "Reboot"
			},
            {
                icon: "Reboot.png",
                name: "Cash Shop",
                address: "8.31.99.192",
                port: "8786",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Reboot"
            }
        ],
        Websites: [{
                icon: "Mushroom.png",
                name: "MapleStory",
                sub: "",
                address: "maplestory.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Forum",
                sub: "",
                address: "forum2.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Support",
                sub: "",
                address: "support.maplestory.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Download",
                sub: "",
                address: "download2.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "Nexon.png",
                name: "Press",
                sub: "",
                address: "press.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "Avatars",
                sub: "NXA",
                address: "msavatar1.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "Images",
                sub: "NXA",
                address: "nxcache.nexon.net",
                port: "80",
                rel: "nexon.net"
            },
            {
                icon: "fa-globe",
                name: "Guard",
                sub: "NXA",
                address: "guard.nexon.net",
                port: "80",
                rel: "nexon.net"
            }
        ]
    },
    KMS: {
        Login: [{
            icon: "Mushroom.png",
            name: "Login",
            address: "175.207.0.34",
            port: "8484",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        }],
        '스카니아': [{
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 1",
                address: "175.207.0.65",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Ch. 20세이상",
                address: "175.207.0.65",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 2",
                address: "175.207.0.240",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 3",
                address: "175.207.0.240",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 4",
                address: "175.207.0.241",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 5",
                address: "175.207.0.66",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 6",
                address: "175.207.0.66",
                port: "8588",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 7",
                address: "175.207.0.243",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 8",
                address: "175.207.0.67",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 9",
                address: "175.207.0.67",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 10",
                address: "175.207.0.67",
                port: "8588",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 11",
                address: "175.207.0.68",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 12",
                address: "175.207.0.68",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 13",
                address: "175.207.0.68",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 14",
                address: "175.207.0.243",
                port: "8588",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 15",
                address: "175.207.0.241",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 16",
                address: "175.207.0.250",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 17",
                address: "175.207.0.242",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 18",
                address: "175.207.0.242",
                port: "8588",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 19",
                address: "175.207.0.69",
                port: "8589",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Cash Shop",
                address: "175.207.0.10",
                port: "8780",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "스카니아"
            }
        ],
        // IE fails here, that's why the Korean text is wrapped in quotes.
        '베라': [{
                icon: "Bera.png",
                english: "Bera",
                name: "Channel 1",
                address: "175.207.0.70",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "베라"
            },
            {
                icon: "Bera.png",
                english: "Bera",
                name: "Ch. 20세이상",
                address: "175.207.0.70",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "베라"
            }
        ],
        '루나': [{
                icon: "Luna.png",
                english: "Luna",
                name: "Channel 1",
                address: "175.207.0.80",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "루나"
            },
            {
                icon: "Luna.png",
                english: "Luna",
                name: "Ch. 20세이상",
                address: "175.207.0.80",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "루나"
            }
        ],
        '제니스': [{
                icon: "Zenith.png",
                english: "Zenith",
                name: "Channel 1",
                address: "175.207.0.85",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "제니스"
            },
            {
                icon: "Zenith.png",
                english: "Zenith",
                name: "Ch. 20세이상",
                address: "175.207.0.85",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "제니스"
            }
        ],
        '크로아': [{
                icon: "Croa.png",
                english: "Croa",
                name: "Channel 1",
                address: "175.207.0.90",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "크로아"
            },
            {
                icon: "Croa.png",
                english: "Croa",
                name: "Ch. 20세이상",
                address: "175.207.0.90",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "크로아"
            }
        ],
        '유니온': [{
                icon: "Union.png",
                english: "Union",
                name: "Channel 1",
                address: "175.207.0.246",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "유니온"
            },
            {
                icon: "Union.png",
                english: "Union",
                name: "Ch. 20세이상",
                address: "175.207.0.115",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "유니온"
            }
        ],
        '엘리시움': [{
                icon: "Elysium.png",
                english: "Elysium",
                name: "Channel 1",
                address: "175.207.0.140",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "엘리시움"
            },
            {
                icon: "Elysium.png",
                english: "Elysium",
                name: "Ch. 20세이상",
                address: "175.207.0.140",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "엘리시움"
            }
        ],
        '이노시스': [{
                icon: "Enosis.png",
                english: "Enosis",
                name: "Channel 1",
                address: "175.207.0.165",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "이노시스"
            },
            {
                icon: "Enosis.png",
                english: "Enosis",
                name: "Ch. 20세이상",
                address: "175.207.0.165",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "이노시스"
            }
        ],
        '레드': [{
                icon: "Red.png",
                english: "Red",
                name: "Channel 1",
                address: "175.207.0.235",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "레드"
            },
            {
                icon: "Red.png",
                english: "Red",
                name: "Ch. 20세이상",
                address: "175.207.0.235",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "레드"
            }
        ],
        '오로라': [{
                icon: "Aurora.png",
                english: "Aurora",
                name: "Channel 1",
                address: "175.207.0.230",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "오로라"
            },
            {
                icon: "Aurora.png",
                english: "Aurora",
                name: "Ch. 20세이상",
                address: "175.207.0.230",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "오로라"
            }
        ]
    },
    MSEA: {
        Login: [{
                icon: "Mushroom.png",
                name: "Login 1",
                address: "121.52.202.7",
                port: "8484",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            },
            {
                icon: "Mushroom.png",
                name: "Login 2",
                address: "121.52.202.9",
                port: "8484",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            },
            {
                icon: "Generic.png",
                name: "Merge World",
                address: "121.52.202.81",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            }
        ],
        Aquila: [{
                icon: "Aquila.png",
                name: "Channel 1",
                address: "121.52.202.15",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 2",
                address: "121.52.202.16",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 3",
                address: "121.52.202.17",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 4",
                address: "121.52.202.18",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 5",
                address: "121.52.202.19",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 6",
                address: "121.52.202.20",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 7",
                address: "121.52.202.21",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 8",
                address: "121.52.202.22",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 9",
                address: "121.52.202.23",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 10",
                address: "121.52.202.24",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 11",
                address: "121.52.202.25",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 12",
                address: "121.52.202.26",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 13",
                address: "121.52.202.27",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 14",
                address: "121.52.202.28",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 15",
                address: "121.52.202.29",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 16",
                address: "121.52.202.30",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 17",
                address: "121.52.202.31",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 18",
                address: "121.52.202.32",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 19",
                address: "121.52.202.33",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Channel 20",
                address: "121.52.202.34",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
            {
                icon: "Aquila.png",
                name: "Cash Shop",
                address: "121.52.202.12",
                port: "8787",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            },
			{
                icon: "Aquila.png",
                name: "Auction",
                address: "121.52.202.85",
                port: "9000",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Aquila"
            }
        ],
        Bootes: [{
                icon: "Bootes.png",
                name: "Channel 1",
                address: "121.52.202.35",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 2",
                address: "121.52.202.36",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 3",
                address: "121.52.202.37",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 4",
                address: "121.52.202.38",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 5",
                address: "121.52.202.39",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 6",
                address: "121.52.202.40",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 7",
                address: "121.52.202.41",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 8",
                address: "121.52.202.42",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 9",
                address: "121.52.202.43",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 10",
                address: "121.52.202.44",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 11",
                address: "121.52.202.35",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 12",
                address: "121.52.202.36",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 13",
                address: "121.52.202.37",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 14",
                address: "121.52.202.38",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 15",
                address: "121.52.202.39",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 16",
                address: "121.52.202.40",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 17",
                address: "121.52.202.41",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 18",
                address: "121.52.202.42",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 19",
                address: "121.52.202.43",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Channel 20",
                address: "121.52.202.44",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
            {
                icon: "Bootes.png",
                name: "Cash Shop",
                address: "121.52.202.12",
                port: "8788",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            },
			{
                icon: "Bootes.png",
                name: "Auction",
                address: "121.52.202.86",
                port: "9000",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Bootes"
            }
        ],
        Cassiopeia: [{
                icon: "Cassiopeia.png",
                name: "Channel 1",
                address: "121.52.202.51",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 2",
                address: "121.52.202.52",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 3",
                address: "121.52.202.53",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 4",
                address: "121.52.202.54",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 5",
                address: "121.52.202.55",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 6",
                address: "121.52.202.56",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 7",
                address: "121.52.202.57",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 8",
                address: "121.52.202.58",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 9",
                address: "121.52.202.59",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 10",
                address: "121.52.202.60",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 11",
                address: "121.52.202.51",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 12",
                address: "121.52.202.52",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 13",
                address: "121.52.202.53",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 14",
                address: "121.52.202.54",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 15",
                address: "121.52.202.55",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 16",
                address: "121.52.202.56",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 17",
                address: "121.52.202.57",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 18",
                address: "121.52.202.58",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 19",
                address: "121.52.202.59",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Channel 20",
                address: "121.52.202.60",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
            {
                icon: "Cassiopeia.png",
                name: "Cash Shop",
                address: "121.52.202.12",
                port: "8789",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            },
			{
                icon: "Cassiopeia.png",
                name: "Auction",
                address: "121.52.202.87",
                port: "9000",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Cassiopeia"
            }
        ],
        D2J: [{
                icon: "D2J.png",
                name: "Channel 1",
                address: "121.52.202.61",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 2",
                address: "121.52.202.62",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 3",
                address: "121.52.202.63",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 4",
                address: "121.52.202.64",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 5",
                address: "121.52.202.65",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 6",
                address: "121.52.202.66",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 7",
                address: "121.52.202.67",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 8",
                address: "121.52.202.68",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 9",
                address: "121.52.202.69",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 10",
                address: "121.52.202.70",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 11",
                address: "121.52.202.61",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 12",
                address: "121.52.202.62",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 13",
                address: "121.52.202.63",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 14",
                address: "121.52.202.64",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Channel 15",
                address: "121.52.202.65",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
			{
                icon: "D2J.png",
                name: "Channel 16",
                address: "121.52.202.66",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
			{
                icon: "D2J.png",
                name: "Channel 17",
                address: "121.52.202.67",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
			{
                icon: "D2J.png",
                name: "Channel 18",
                address: "121.52.202.68",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
			{
                icon: "D2J.png",
                name: "Channel 19",
                address: "121.52.202.69",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
			{
                icon: "D2J.png",
                name: "Channel 20",
                address: "121.52.202.70",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
            {
                icon: "D2J.png",
                name: "Cash Shop",
                address: "121.52.202.12",
                port: "8790",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
			{
                icon: "D2J.png",
                name: "Auction",
                address: "121.52.202.88",
                port: "9000",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "D2J"
            },
        ]
    },
	THMS: {
        Login: [{
            icon: "Mushroom.png",
            name: "Login",
            address: "175.207.0.34",
            port: "8484",
            interval: 5000,
            values: [],
            isMapleStoryGameServer: true,
            rel: "Login"
        }],
        'สคาเนีย': [{
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 1",
                address: "13.228.80.96",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 2",
                address: "13.228.80.96",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 3",
                address: "13.228.76.20",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 4",
                address: "13.228.76.20",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 5",
                address: "13.228.42.166",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 6",
                address: "13.228.42.166",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 7",
                address: "13.228.52.228",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 8",
                address: "13.228.52.228",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 9",
                address: "13.228.80.94",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 10",
                address: "13.228.80.94",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 11",
                address: "13.228.80.27",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 12",
                address: "13.228.80.27",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 13",
                address: "13.228.45.25",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 14",
                address: "13.228.45.25",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 15",
                address: "13.228.80.54",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 16",
                address: "13.228.80.54",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 17",
                address: "13.228.45.138",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 18",
                address: "13.228.45.138",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 19",
                address: "13.228.58.55",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
			{
                icon: "Scania.png",
                english: "Scania",
                name: "Channel 20",
                address: "13.228.58.55",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
            {
                icon: "Scania.png",
                english: "Scania",
                name: "Cash Shop - ปิดใช้งาน",
                address: "ahri.in.th",
                port: "8780",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "สคาเนีย"
            },
        ],
        // IE fails here, that's why the Korean text is wrapped in quotes.
        'เบร่า': [{
                icon: "Bera.png",
                english: "Bera",
                name: "Channel 1",
                address: "175.207.0.70",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "เบร่า"
            },
            {
                icon: "Bera.png",
                english: "Bera",
                name: "Ch. 20세이상",
                address: "175.207.0.70",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "เบร่า"
            }
        ],
        'ลูน่า': [{
                icon: "Luna.png",
                english: "Luna",
                name: "Channel 1",
                address: "175.207.0.80",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "ลูน่า"
            },
            {
                icon: "Luna.png",
                english: "Luna",
                name: "Ch. 20세이상",
                address: "175.207.0.80",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "ลูน่า"
            }
        ],
        'เซนิท': [{
                icon: "Zenith.png",
                english: "Zenith",
                name: "Channel 1",
                address: "175.207.0.85",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "เซนิท"
            },
            {
                icon: "Zenith.png",
                english: "Zenith",
                name: "Ch. 20세이상",
                address: "175.207.0.85",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "เซนิท"
            }
        ],
        'โครอา': [{
                icon: "Croa.png",
                english: "Croa",
                name: "Channel 1",
                address: "175.207.0.90",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "โครอา"
            },
            {
                icon: "Croa.png",
                english: "Croa",
                name: "Ch. 20세이상",
                address: "175.207.0.90",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "โครอา"
            }
        ],
        'อิลิเซียม': [{
                icon: "Elysium.png",
                english: "Elysium",
                name: "Channel 1",
                address: "175.207.0.140",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "อิลิเซียม"
            },
            {
                icon: "Elysium.png",
                english: "Elysium",
                name: "Ch. 20세이상",
                address: "175.207.0.140",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "อิลิเซียม"
            }
        ],
        'อิโนซิส': [{
                icon: "Enosis.png",
                english: "Enosis",
                name: "Channel 1",
                address: "175.207.0.165",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "อิโนซิส"
            },
            {
                icon: "Enosis.png",
                english: "Enosis",
                name: "Ch. 20세이상",
                address: "175.207.0.165",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "อิโนซิส"
            }
        ],
        'เรด': [{
                icon: "Red.png",
                english: "Red",
                name: "Channel 1",
                address: "175.207.0.235",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "เรด"
            },
            {
                icon: "Red.png",
                english: "Red",
                name: "Ch. 20세이상",
                address: "175.207.0.235",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "เรด"
            }
        ],
        'ออโรรา': [{
                icon: "Aurora.png",
                english: "Aurora",
                name: "Channel 1",
                address: "175.207.0.230",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "ออโรรา"
            },
            {
                icon: "Aurora.png",
                english: "Aurora",
                name: "Ch. 20세이상",
                address: "175.207.0.230",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "ออโรรา"
            }
        ]
    },
    MS2:{
        Login: [{
                icon: "Generic.png",
                name: "Login 1",
                address: "121.52.202.8",
                port: "8484",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            },
            {
                icon: "Generic.png",
                name: "Login 2",
                address: "121.52.202.9",
                port: "8484",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            },
            {
                icon: "Generic.png",
                name: "Login 3",
                address: "121.52.202.122",
                port: "8484",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            },
            {
                icon: "Generic.png",
                name: "Login 4",
                address: "121.52.202.81",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Login"
            }
        ],
        NAWest: [{
                icon: "Aquil.png",
                name: "Channel 1",
                address: "121.52.202.15",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 2",
                address: "121.52.202.15",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 3",
                address: "121.52.202.16",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 4",
                address: "121.52.202.16",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 5",
                address: "121.52.202.17",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 6",
                address: "121.52.202.17",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 7",
                address: "121.52.202.18",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 8",
                address: "121.52.202.18",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 9",
                address: "121.52.202.19",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 10",
                address: "121.52.202.19",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 11",
                address: "121.52.202.20",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 12",
                address: "121.52.202.20",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 13",
                address: "121.52.202.21",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 14",
                address: "121.52.202.21",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 15",
                address: "121.52.202.22",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 16",
                address: "121.52.202.22",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 17",
                address: "121.52.202.23",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 18",
                address: "121.52.202.23",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 19",
                address: "121.52.202.24",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Channel 20",
                address: "121.52.202.24",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            },
            {
                icon: "Aquil.png",
                name: "Cash Shop",
                address: "121.52.202.12",
                port: "8787",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAWest"
            }
        ],
        NAEast: [{
                icon: "Boote.png",
                name: "Channel 1",
                address: "121.52.202.35",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 2",
                address: "121.52.202.35",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 3",
                address: "121.52.202.36",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 4",
                address: "121.52.202.36",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 5",
                address: "121.52.202.37",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 6",
                address: "121.52.202.37",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 7",
                address: "121.52.202.38",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 8",
                address: "121.52.202.38",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 9",
                address: "121.52.202.39",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 10",
                address: "121.52.202.39",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 11",
                address: "121.52.202.40",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 12",
                address: "121.52.202.40",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 13",
                address: "121.52.202.41",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 14",
                address: "121.52.202.41",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 15",
                address: "121.52.202.42",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 16",
                address: "121.52.202.42",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 17",
                address: "121.52.202.43",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 18",
                address: "121.52.202.43",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 19",
                address: "121.52.202.44",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Channel 20",
                address: "121.52.202.44",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Cash Shop",
                address: "121.52.202.12",
                port: "8788",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            },
            {
                icon: "Boote.png",
                name: "Monster Life",
                address: "121.52.202.12",
                port: "9501",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "NAEast"
            }
        ],
        Europe: [{
                icon: "Cassiopei.png",
                name: "Channel 1",
                address: "121.52.202.51",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 2",
                address: "121.52.202.51",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 3",
                address: "121.52.202.52",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 4",
                address: "121.52.202.52",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 5",
                address: "121.52.202.53",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 6",
                address: "121.52.202.53",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 7",
                address: "121.52.202.54",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 8",
                address: "121.52.202.54",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 9",
                address: "121.52.202.55",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 10",
                address: "121.52.202.55",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 11",
                address: "121.52.202.56",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 12",
                address: "121.52.202.56",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 13",
                address: "121.52.202.57",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 14",
                address: "121.52.202.57",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 15",
                address: "121.52.202.58",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 16",
                address: "121.52.202.58",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 17",
                address: "121.52.202.59",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 18",
                address: "121.52.202.59",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 19",
                address: "121.52.202.60",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Channel 20",
                address: "121.52.202.60",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            },
            {
                icon: "Cassiopei.png",
                name: "Cash Shop",
                address: "121.52.202.12",
                port: "8789",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Europe"
            }
        ],
        Oceania: [{
                icon: "fa-question",
                name: "Channel 1",
                address: "121.52.202.26",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Oceania"
            },
            {
                icon: "fa-question",
                name: "Channel 2",
                address: "121.52.202.26",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Oceania"
            },
            {
                icon: "fa-question",
                name: "Channel 3",
                address: "121.52.202.27",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Oceania"
            },
            {
                icon: "fa-question",
                name: "Channel 4",
                address: "121.52.202.27",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Oceania"
            },
            {
                icon: "fa-question",
                name: "Channel 5",
                address: "121.52.202.28",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Oceania"
            },
            {
                icon: "fa-question",
                name: "Channel 6",
                address: "121.52.202.28",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Oceania"
            },
            {
                icon: "fa-question",
                name: "Channel 7",
                address: "121.52.202.29",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Oceania"
            },
            {
                icon: "fa-question",
                name: "Channel 8",
                address: "121.52.202.29",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Oceania"
            },
            {
                icon: "fa-question",
                name: "Channel 9",
                address: "121.52.202.30",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Oceania"
            },
            {
                icon: "fa-question",
                name: "Channel 10",
                address: "121.52.202.30",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Oceania"
            },
            {
                icon: "fa-question",
                name: "Channel 11",
                address: "121.52.202.26",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Oceania"
            },
            {
                icon: "fa-question",
                name: "Channel 12",
                address: "121.52.202.27",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Oceania"
            },
            {
                icon: "fa-question",
                name: "Channel 13",
                address: "121.52.202.28",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Oceania"
            },
            {
                icon: "fa-question",
                name: "Channel 14",
                address: "121.52.202.29",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Oceania"
            },
            {
                icon: "fa-question",
                name: "Channel 15",
                address: "121.52.202.30",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Oceania"
            },
            {
                icon: "fa-question",
                name: "Cash Shop",
                address: "121.52.202.12",
                port: "8791",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "Oceania"
            }
        ],
		SouthAmerica: [{
                icon: "fa-question",
                name: "Channel 1",
                address: "121.52.202.26",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "SouthAmerica"
            },
            {
                icon: "fa-question",
                name: "Channel 2",
                address: "121.52.202.26",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "SouthAmerica"
            },
            {
                icon: "fa-question",
                name: "Channel 3",
                address: "121.52.202.27",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "SouthAmerica"
            },
            {
                icon: "fa-question",
                name: "Channel 4",
                address: "121.52.202.27",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "SouthAmerica"
            },
            {
                icon: "fa-question",
                name: "Channel 5",
                address: "121.52.202.28",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "SouthAmerica"
            },
            {
                icon: "fa-question",
                name: "Channel 6",
                address: "121.52.202.28",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "SouthAmerica"
            },
            {
                icon: "fa-question",
                name: "Channel 7",
                address: "121.52.202.29",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "SouthAmerica"
            },
            {
                icon: "fa-question",
                name: "Channel 8",
                address: "121.52.202.29",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "SouthAmerica"
            },
            {
                icon: "fa-question",
                name: "Channel 9",
                address: "121.52.202.30",
                port: "8585",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "SouthAmerica"
            },
            {
                icon: "fa-question",
                name: "Channel 10",
                address: "121.52.202.30",
                port: "8586",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "SouthAmerica"
            },
            {
                icon: "fa-question",
                name: "Channel 11",
                address: "121.52.202.26",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "SouthAmerica"
            },
            {
                icon: "fa-question",
                name: "Channel 12",
                address: "121.52.202.27",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "SouthAmerica"
            },
            {
                icon: "fa-question",
                name: "Channel 13",
                address: "121.52.202.28",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "SouthAmerica"
            },
            {
                icon: "fa-question",
                name: "Channel 14",
                address: "121.52.202.29",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "SouthAmerica"
            },
            {
                icon: "fa-question",
                name: "Channel 15",
                address: "121.52.202.30",
                port: "8587",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "SouthAmerica"
            },
            {
                icon: "fa-question",
                name: "Cash Shop",
                address: "121.52.202.12",
                port: "8791",
                interval: 5000,
                values: [],
                isMapleStoryGameServer: true,
                rel: "SouthAmerica"
            }
        ]
    }
}

var checker = {
    isMainPage: ko.observable(selected == "Main"),
    selected: ko.observable(selected),
    subSelection: ko.observable(subSelection),
    getDefaultSubSelectionForVersion: GetDefaultSubSelectionForVersion,
    modifySettings: ModifySettings,
    defaultSettings: DefaultSettings,
    getServersCountForApplication: GetServersCountForApplication,
    versions: [{
            abbr: "EMS",
            name: "MapleStory Europe",
            available: true,
            complete: true,
            icon: "Luna.png",
            short: "Europe",
            serverCount: [
                3,
                1,
                1
            ],
            applications: [
                GameServer("Europe", 0, [{
                        icon: "Mushroom.png",
                        name: "Login",
                        english: false,
                        sub: ""
                    },
                    {
                        icon: "Luna.png",
                        name: "Luna",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Reboot.png",
                        name: "Reboot",
                        english: false,
                        sub: "World"
                    }
                ], [
                    servers.EMS.Login,
                    servers.EMS.Luna,
                    servers.EMS.Reboot,
                ]),
                {
                    name: "Internal Sites",
                    description: "These are pages which are hosted on Nexon's servers.",
                    icons: [{
                            icon: "Nexon.png",
                            name: "nexon.net",
                            english: false,
                            sub: ""
                        }
                    ],
                    content: function() {
                        return new PingModel([
                            servers.EMS.InternalWebsites
                        ])
                    },
                    selectedServers: ko.observable(loadingArr)
                },
                {
                    name: "External Sites",
                    description: "These are pages which are hosted on external servers.",
                    selectedServers: ko.observable(loadingArr),
                    icons: [],
                    content: function() {
                        return new PingModel([
                            servers.EMS.ExternalWebsites
                        ])
                    }
                }
            ]
        },
        {
            abbr: "GMS",
            name: "MapleStory North America <small>(Global)</small>",
            available: true,
            complete: true,
            icon: "Scania.png",
            short: "North America (Global)",
            serverCount: [
                18
            ],
            applications: [
                GameServer("Global", 0, [{
                        icon: "Mushroom.png",
                        name: "Login",
                        english: false,
                        sub: ""
                    },
                    {
                        icon: "Scania.png",
                        name: "Scania",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Bera.png",
                        name: "Bera",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Broa.png",
                        name: "Broa",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Bellocan.png",
                        name: "Bellocan",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Khaini.png",
                        name: "Khaini",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Windia.png",
                        name: "Windia",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Mardia.png",
                        name: "Mardia",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Kradia.png",
                        name: "Kradia",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Yellonde.png",
                        name: "Yellonde",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Demethos.png",
                        name: "Demethos",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Galicia.png",
                        name: "Galicia",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "El Nido.png",
                        name: "El Nido",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Zenith.png",
                        name: "Zenith",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Arcania.png",
                        name: "Arcania",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Chaos.png",
                        name: "Chaos",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Nova.png",
                        name: "Nova",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Renegades.png",
                        name: "Renegades",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Reboot.png",
                        name: "Reboot",
                        english: false,
                        sub: "World"
                    }
                ], [
                    servers.GMS.Login,
                    servers.GMS.CrossWorld,
                    servers.GMS.Scania,
                    servers.GMS.Bera,
                    // World alliance between Broa and Khaini
                    servers.GMS.BK('Khaini'),
                    servers.GMS.BK('Broa'),
                    servers.GMS.Windia,
                    // World alliance between Mardia, Yellonde, Bellocan, Chaos, Kradia, Nova
                    servers.GMS.MYBCKN('Mardia'),
                    servers.GMS.MYBCKN('Yellonde'),
                    servers.GMS.MYBCKN('Bellocan'),
                    servers.GMS.MYBCKN('Chaos'),
                    servers.GMS.MYBCKN('Kradia'),
                    servers.GMS.MYBCKN('Nova'),
                    // World alliance between Galicia, Renegades, Arcania, Zenith, El Nido, Demethos
                    servers.GMS.GRAZED('Galicia'),
                    servers.GMS.GRAZED('Renegades'),
                    servers.GMS.GRAZED('Arcania'),
                    servers.GMS.GRAZED('Zenith'),
                    servers.GMS.GRAZED('El Nido'),
                    servers.GMS.GRAZED('Demethos'),

                    servers.GMS.Reboot
                ]),
                {
                    name: "Websites",
                    description: "These are pages related to Nexon America's internal and external servers.",
                    selectedServers: ko.observable(loadingArr),
                    icons: [{
                        icon: "Nexon.png",
                        name: "nexon.net",
                        english: false,
                        sub: "World"
                    }],
                    content: function() {
                        return new PingModel([
                            servers.GMS.Websites
                        ])
                    }
                }
            ]
        },
        {
            abbr: "JMS",
            name: "MapleStory Japan <small>日本</small>",
            available: false,
            complete: false,
            icon: "Galicia.png",
            short: "日本 | Japan",
            timezone: false,
            applications: []
        },
        {
            abbr: "KMS",
            name: "MapleStory Korea <small>(한국)</small>",
            available: true,
            complete: false,
            icon: "Mushroom.png",
            short: "한국 | Korea",
            serverCount: [
                11
            ],
            applications: [
                GameServer("Korea", 9, [{
                        icon: "Mushroom.png",
                        name: "Login",
                        english: false,
                        sub: ""
                    },
                    {
                        icon: "Scania.png",
                        name: "스카니아",
                        english: "Scania",
                        sub: "World"
                    },
                    {
                        icon: "Bera.png",
                        name: "베라",
                        english: "Bera",
                        sub: "World"
                    },
                    {
                        icon: "Luna.png",
                        name: "루나",
                        english: "Luna",
                        sub: "World"
                    },
                    {
                        icon: "Zenith.png",
                        name: "제니스",
                        english: "Zenith",
                        sub: "World"
                    },
                    {
                        icon: "Croa.png",
                        name: "크로아",
                        english: "Croa",
                        sub: "World"
                    },
                    {
                        icon: "Union.png",
                        name: "유니온",
                        english: "Union",
                        sub: "World"
                    },
                    {
                        icon: "Elysium.png",
                        name: "엘리시움",
                        english: "Elysium",
                        sub: "World"
                    },
                    {
                        icon: "Enosis.png",
                        name: "이노시스",
                        english: "Enosis",
                        sub: "World"
                    },
                    {
                        icon: "Red.png",
                        name: "레드",
                        english: "Red",
                        sub: "World"
                    },
                    {
                        icon: "Aurora.png",
                        name: "오로라",
                        english: "Aurora",
                        sub: "World"
                    }
                ], [
                    servers.KMS.Login,
                    // Not using dot notation because IE sucks.
                    servers.KMS['스카니아'],
                    servers.KMS['베라'],
                    servers.KMS['루나'],
                    servers.KMS['제니스'],
                    servers.KMS['크로아'],
                    servers.KMS['유니온'],
                    servers.KMS['엘리시움'],
                    servers.KMS['이노시스'],
                    servers.KMS['레드'],
                    servers.KMS['오로라']
                ])
            ]
        },
        {
            abbr: "MSEA",
            name: "MapleStory SEA <small>(SG / MY)</small>",
            available: true,
            complete: false,
            icon: "Aquila.png",
            short: "Maple SEA SG / MY",
            serverCount: [
                11
            ],
            applications: [
                GameServer("SEA", 8, [{
                        icon: "Mushroom.png",
                        name: "Login",
                        english: false,
                        sub: ""
                    },
                    {
                        icon: "Aquila.png",
                        name: "Aquila",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Bootes.png",
                        name: "Bootes",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Cassiopeia.png",
                        name: "Cassiopeia",
                        english: false,
                        sub: "World"
                    },
                    /*
                    	{
                    		icon: "Delphinus.png",
                    		name: "Delphinus",
                    		english: false,
                    		sub: "World"
                    	},
                    	{
                    		icon: "Eridanus.png",
                    		name: "Eridanus",
                    		english: false,
                    		sub: "World"
                    	},
                    	{
                    		icon: "Izar.png",
                    		name: "Izar",
                    		english: false,
                    		sub: "World"
                    	},*/
                    {
                        icon: "D2J.png",
                        name: "D2J",
                        english: false,
                        sub: "World"
                    }
                    /*,
                    	{
                    		icon: "Fornax.png",
                    		name: "Fornax",
                    		english: false,
                    		sub: "World"
                    	},
                    	{
                    		icon: "Gemini.png",
                    		name: "Gemini",
                    		english: false,
                    		sub: "World"
                    	},
                    	{
                    		icon: "Hercules.png",
                    		name: "Hercules",
                    		english: false,
                    		sub: "World"
                    	}*/
                ], [
                    servers.MSEA.Login,
                    servers.MSEA.Aquila,
                    servers.MSEA.Bootes,
                    servers.MSEA.Cassiopeia,
                    servers.MSEA.D2J
                ])
            ]
        },
        {
            abbr: "THMS",
            name: "MapleStory Thailand",
            available: true,
            complete: false,
            icon: "Mushroom.png",
            short: "ไทย | Thailand",
            serverCount: [
                11
            ],
            applications: [
                GameServer("Thailand", 7, [{
                        icon: "Mushroom.png",
                        name: "Login",
                        english: false,
                        sub: ""
                    },
                    {
                        icon: "Scania.png",
                        name: "สคาเนีย",
                        english: "Scania",
                        sub: "World"
                    },
					/*
                    {
                        icon: "Bera.png",
                        name: "เบร่า",
                        english: "Bera",
                        sub: "World"
                    },
                    {
                        icon: "Luna.png",
                        name: "ลูน่า",
                        english: "Luna",
                        sub: "World"
                    },
                    {
                        icon: "Zenith.png",
                        name: "เซนิท",
                        english: "Zenith",
                        sub: "World"
                    },
                    {
                        icon: "Croa.png",
                        name: "โครอา",
                        english: "Croa",
                        sub: "World"
                    },
                    {
                        icon: "Elysium.png",
                        name: "อิลิเซียม",
                        english: "Elysium",
                        sub: "World"
                    },
                    {
                        icon: "Enosis.png",
                        name: "อิโนซิส",
                        english: "Enosis",
                        sub: "World"
                    },
                    {
                        icon: "Red.png",
                        name: "เรด",
                        english: "Red",
                        sub: "World"
                    },
                    {
                        icon: "Aurora.png",
                        name: "ออโรรา",
                        english: "Aurora",
                        sub: "World"
                    }
					*/
                ], [
                    servers.THMS.Login,
                    // Not using dot notation because IE sucks.
                    servers.THMS['สคาเนีย'],
                    servers.THMS['เบร่า'],
                    servers.THMS['ลูน่า'],
                    servers.THMS['เซนิท'],
                    servers.THMS['โครอา'],
                    servers.THMS['อิลิเซียม'],
                    servers.THMS['อิโนซิส'],
                    servers.THMS['เรด'],
                    servers.THMS['ออโรรา']
                ])
            ]
        },
        {
            abbr: "MS2",
            name: "MapleStory 2 <small>(메이플스토리2)</small>",
            available: true,
            complete: false,
            icon: "MS2Scania.png",
            short: "MapleStory 2",
            serverCount: [
                6
            ],
            applications: [
                GameServer("MS2", 0, [{
                        icon: "Mushroom.png",
                        name: "Login",
                        english: false,
                        sub: ""
                    },
                    {
                        icon: "Mushroom.png",
                        name: "NAWest",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Mushroom.png",
                        name: "NAEast",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Mushroom.png",
                        name: "Europe",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Mushroom.png",
                        name: "Oceania",
                        english: false,
                        sub: "World"
                    },
                    {
                        icon: "Mushroom.png",
                        name: "SouthAmerica",
                        english: false,
                        sub: "World"
                    }
                ], [
                    servers.MS2.Login,
                    servers.MS2.NAWest,
                    servers.MS2.NAEast,
                    servers.MS2.Europe,
                    servers.MS2.Oceania,
                    servers.MS2.SouthAmerica
                ])
            ]
        }
    ],
    updateSelectedServers: UpdateSelectedServers,
    selectedIcon: ko.observable(GetEnglishIconNameForServer(this.subSelection)),
    settings: {
        pingOffset: ko.observable(0),
        delay: ko.observable(readCookie("Delay") ? readCookie("Delay") : 100),
        clickToRefresh: ko.observable(readCookie("ClickToRefresh") == "false" ? false : false),
        fixPing: ko.observable(readCookie("FixPing") == "false" ? false : true),
        showConnection: ko.observable(readCookie("ShowConnection") == "false" ? false : true),
        showIPPort: ko.observable(readCookie("ShowIPPort") == "false" ? false : true),
        timeout: ko.observable(readCookie("Timeout") ? readCookie("Timeout") : 5000),
        showControls: ko.observable(false)
    },
    currentTime: ko.observable('<span><i class="fa fa-cog fa-spin"></i> Checking server time...</span>')
};

checker.subSelection.subscribe(function(newValue) {
    checker.selectedIcon(GetEnglishIconNameForServer(newValue));
});

if (selected != 'Main') {
    GetPingOffset();
}

ko.applyBindings(checker);

function GetEnglishIconNameForServer(serverName) {
    switch (serverName) {
        case "스카니아":
            return "Scania";
        case "베라":
            return "Bera";
        case "루나":
            return "Luna";
        case "제니스":
            return "Zenith";
        case "크로아":
            return "Croa";
        case "유니온":
            return "Union";
        case "엘리시움":
            return "Elysium";
        case "이노시스":
            return "Enosis";
        case "레드":
            return "Red";
        case "오로라":
            return "Aurora";
        case "Login":
            return "Mushroom";
        case "สคาเนีย":
            return "Scania";
        case "เบร่า":
            return "Bera";
        case "ลูน่า":
            return "Luna";
        case "เซนิท":
            return "Zenith";
        case "โครอา":
            return "Croa";
        case "อิลิเซียม":
            return "Elysium";
        case "อิโนซิส":
            return "Enosis";
        case "เรด":
            return "Red";
        case "ออโรรา":
            return "Aurora";
        default:
            return serverName;
    }
}

function UpdateSelectedServers(parent, index, name) {
    var name = name || checker.subSelection();

    if (loadingTimers.length > index) {
        window.clearInterval(loadingTimers[index]);
    }

    if (parent.name == "Game Servers" && !clockTicking) {
        clockTicking = true;
        setInterval(function() {
            var d = new Date(),
                o = d.getTimezoneOffset() / 60;

            d.setHours(d.getHours() + o + parent.timeOffset);
            checker.currentTime('<span><i class="fa fa-clock-o"></i> Server Time</span> ' + moment(d).format('h:mm:ss') + ' <span>' + moment(d).format('A') + '</span>');
        }, 1000);
    }

    parent.selectedServers(loadingArr);
    window.location.hash = '#' + checker.selected() + '-' + name;
    subSelection = name;
    checker.subSelection(name);

    loadingTimers.push(setTimeout(function() {
        var content = parent.content();
        parent.selectedServers(parent.content().servers());
    }, 300));
}

function GetCheckTimeout() {
    return checker.settings.timeout();
}

function GetPingOffset() {
    return new PingModel([{
        icon: "Mushroom.png",
        name: "Self",
        address: "127.0.0.1",
        port: "80",
        interval: 5000,
        values: [],
        unknown: true,
        rel: "Self"
    }]);
}

function GetDefaultSubSelectionForVersion(version) {
    switch (version) {
        case 'EMS':
            return 'Luna';
        case 'GMS':
            return 'Login';
        case 'KMS':
            return '스카니아';
        case 'MSEA':
            return 'Login';
		case 'THMS':
		    return 'สคาเนีย';
		case 'MS2':
		    return 'Login';
        default:
            return;
    }
}

function SetPingOffset(offset) {
    checker.settings.pingOffset(offset);
}

function ModifySettings() {
    var delay = checker.settings.delay(),
        timeout = checker.settings.timeout();

    createCookie("Delay", delay > 10000 ? 10000 : (delay < 50 ? 50 : delay), 3650);
    createCookie("Timeout", timeout > 60000 ? 60000 : (timeout < 500 ? 500 : timeout), 3650);
    createCookie("ShowIPPort", checker.settings.showIPPort(), 3650);
    createCookie("ShowConnection", checker.settings.showConnection(), 3650);
    createCookie("ClickToRefresh", checker.settings.clickToRefresh(), 3650);
    createCookie("FixPing", checker.settings.fixPing(), 3650);

    window.location.reload();
}

function DefaultSettings() {
    checker.settings.delay(checkDelay);
    checker.settings.timeout(checkTimeout);
    checker.settings.showIPPort(showIPPort);
    checker.settings.showConnection(showConnection);
    checker.settings.clickToRefresh(clickToRefresh);
    checker.settings.fixPing(fixPing);
}

function GetServersCountForApplication(version, name) {
    var v = false;
    for (var i = 0; i < checker.versions.length; i++) {
        if (checker.versions[i].name == version) {
            v = checker.versions[i];
            break;
        }
    }

    if (v == false) {
        return 0;
    }

    for (var j = 0; j < v.applications.length; j++) {
        if (v.applications[j].name == name) {
            return v.serverCount[j];
        }
    }

    return 0;
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
