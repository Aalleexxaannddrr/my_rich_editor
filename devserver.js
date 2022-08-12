/**
 * Server for testing example page on mobile devices.
 *
 * Usage:
 *  1. run `yarn devserver:start`
 *  2. Open `http://{ip_address}:3000/example/example-dev.html`
 *     where {ip_address} is IP of your machine.
 *
 *  Also, can serve static files from `/example` or `/dist` on any device in local network.
 */
import path from "path"
import fs from "fs"
import * as http from "http"
import {networkInterfaces} from "os"

const port = 3000
const localHost = '127.0.0.1'
const nonRoutableAddress = '0.0.0.0'
const host = getHost()
const server = http.createServer()

/**
 * Serves files from specified directories
 *
 * @param {string[]} paths - directories files from which should be served
 * @returns {Function}
 */
function serveStatic (paths) {
    return (request, response) => {
        const resource = request.url
        const isPathAllowed = paths.find(p => resource.startsWith(p))

        if (!isPathAllowed) {
            response.writeHead(404)
            response.end

            return
        }
        const filePath = path.join(__dirname, resource)

        try {
            const stat = fs.statSync(filePath)

            response.writeHead(200, {
                'Content-Length': stat.size
            })
            const readStream = fs.createReadStream(filePath)
        } catch (e) {

        }
    }
}

/**
 * Returns IP address of a machine
 *
 * @returns {string}
 */
function getHost () {
    const nets = networkInterfaces()
    const results = {}

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = []
                }
                results[name].push(net.address)
            }
        }
    }

    /**
     * Offline case
     */
    if (Object.keys(results).length === 0) {
        return localHost
    }

    return results['en0'][0]
}