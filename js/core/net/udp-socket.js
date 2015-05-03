// Copyright 2014-2015 runtime.js project authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var assertError = require('assert-error');
var IP4Address = require('./ip4-address');
var portUtils = require('./port-utils');
var PortPool = require('./port-pool');
var udpTransmit = require('./udp-transmit');
var netError = require('./net-error');
var EventController = require('event-controller');
var typeutils = require('typeutils');
var route = require('./route');

var ports = new PortPool();

function UDPSocket() {
  this._intf = null;
  this._port = 0;
  this.onReceive = new EventController();
}

UDPSocket.prototype.send = function(ip, port, u8) {
  assertError(ip instanceof IP4Address, netError.E_IPADDRESS_EXPECTED);
  assertError(portUtils.isPort(port), netError.E_INVALID_PORT);
  assertError(u8 instanceof Uint8Array, netError.E_TYPEDARRAY_EXPECTED);

  var intf = this._intf || null;

  var viaIP;
  if (ip.isBroadcast()) {
    viaIP = ip;
  } else {
    var routingEntry = route.lookup(ip);
    if (!routingEntry) {
      throw netError.E_NO_ROUTE_TO_HOST;
    }

    viaIP = routingEntry.gateway;
    if (!intf) {
      intf = routingEntry.intf;
    }
  }

  if (!this._port) {
    this._port = ports.getEphemeral(this);
    if (!this._port) {
      throw netError.E_NO_FREE_PORT;
    }
  }

  udpTransmit(intf, ip, viaIP, this._port, port, u8);
};

UDPSocket.prototype.bind = function(port) {
  assertError(portUtils.isPort(port), netError.E_INVALID_PORT);

  if (!ports.alloc(port, this)) {
    throw netError.E_ADDRESS_IN_USE;
  }

  this._port = port;
};

UDPSocket.prototype.bindToInterface = function(intf, port) {
  if (!intf) {
    throw netError.E_INTERFACE_EXPECTED;
  }

  this._intf = intf;
  if (port) {
    this.bind(port);
  }
};

UDPSocket.lookupReceive = function(destPort) {
  return ports.get(destPort) || null;
};

module.exports = UDPSocket;
