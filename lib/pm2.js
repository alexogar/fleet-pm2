#!/usr/bin/env node
var propagit = require('propagit');
var git = require('fleet/lib/git');
var argv = require('fleet/lib/argv');

if (!argv.hub) return console.error('Specify a --hub or set a remote.');

var EventEmitter = require('events').EventEmitter;

var p = propagit(argv);
p.on('error', function (err) {
    console.dir(err);
});
argv._.unshift("pm2")

p.hub(function (hub) {
    var opts = {
        drone : argv.drone,
        drones : argv.drones,
        repo : argv.repo || git.repoName(),
        commit : argv.commit,
        command : argv._,
        env : argv.env || {},        
        once : true
    };
    if (!opts.repo) {
        console.error('specify --repo or navigate to a git repo');
        return;
    }
    if (!opts.commit) git.commit(function (err, commit) {
        if (err) {
            console.error(err);
            p.hub.close();
        }
        else {
            opts.commit = commit;
            execPM2(hub, opts);
        }
    })
    else execPM2(hub, opts);
});

function execPM2 (hub, opts) {
    var em = new EventEmitter;
    hub.subscribe(em.emit.bind(em));
    console.log(opts)
    em.on('ready', function () {
    		console.log(opts)
        hub.spawn(opts, function (err, procs) {
        		
            if (err) {
                console.error(err)
                p.hub.close();
                return;
            }
            
            em.on('stdout', function (buf, proc) {
                if (procs[proc.drone] !== proc.id) return;
                console.log(
                    '[' + proc.drone + '#' + proc.id + '] \n'
                    + buf
                );
            });
            em.on('stderr', function (buf, proc) {
                if (procs[proc.drone] !== proc.id) return;
                console.log(
                    '[' + proc.drone + '#' + proc.id + '] \n'
                    + buf
                );
            });
            
            var pending = Object.keys(procs).length;
            em.on('exit', function (code, sig, proc) {
                if (procs[proc.drone] !== proc.id) return;
                console.log('(' + proc.drone + '#' + proc.id + ' exited)');
                
                if (--pending === 0) p.hub.close();
            });
        });
    });
}