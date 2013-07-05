fleet-pm2
=========

Module adding simple wrapper command to invoke [PM2](https://github.com/Unitech/pm2) tool on drones.

# Installation

```bash
npm install -g fleet-pm2
```

# Usage/Features

```bash
$ npm install fleet-pm2 -g     # Install pm2 command line globally
$ fleet remote add default --hub=localhost:7000 --secret=beepboop
$ fleet-pm2 start app.js -i 4  # Daemonize pm2 and Start 4 clustered instances of app.js
                         # You can also pass the 'max' params to start 
                         # the right numbers of processes depending of CPUs
$ fleet-pm2 list               # Display all processes status
$ fleet-pm2 monit              # Monitor all processes
$ fleet-pm2 logs               # Display all processes logs in streaming
$ fleet-pm2 dump               # Dump the states of all processes
$ fleet-pm2 stop pm2_id        # Stop specific process id
$ fleet-pm2 stopAll            # Stop all processes
$ fleet-pm2 resurrect          # Put online previously dumped processes
$ fleet-pm2 restart pm2_id     # Restart specific process
$ fleet-pm2 restartAll         # Restart all proccesses
$ fleet-pm2 stopAll            # Stop all processes
$ fleet-pm2 generate app       # Generate a JSON process configuration
$ fleet-pm2 web                # Health computer API endpoint (http://localhost:9615)
```

# Next Features

- Plugin fleet monitor command and use pm2 monit instead
- Test that