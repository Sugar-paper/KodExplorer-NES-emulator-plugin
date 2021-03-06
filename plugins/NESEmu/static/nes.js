(function() {
    var a = null;
    window.addEventListener("message", function(b) {
        "fi" === b.data && (b.stopPropagation(), a())
    }, !1, !1);
    window.setFastTimeout = function(b) {
        a = b
    };
    window.invokeFastTimeout = function() {
        window.postMessage("fi", "*")
    }
})();
this.Gui = this.Gui || {};
(function() {
    var a = null,
        b = function(b, d) {
            a = this;
            var e = this;
            this._strArray = [];
            this._dataArray = [];
            this._element = document.createElement("textarea");
            this._element.rows = 15;
            this._element.cols = 80;
            d.appendChild(this._element);
            this._mainboard = b;
            setInterval(function() {
                e._onTextRefresh()
            }, 1E3)
        };
    b.prototype._onLog = function(a) {};
    b.prototype._addData = function(a) {
        this._dataArray.push(a);
        80 < this._dataArray.length && this._dataArray.shift()
    };
    b.prototype._onTextRefresh = function(a) {
        for (var b = "", e = 0; e < this._dataArray.length; ++e) b +=
            this._dataArray[e] + "\r\n";
        this._element.innerHTML = b;
        a && console.log(b)
    };
    Gui.LogWindow = b;
    Gui.log = function(b, d) {
        a && a._onLog(b + " " + d)
    }
})();
this.Nes = this.Nes || {};
var Test = {};
(function() {
    var a = [],
        b = function() {
            this._callbacks = []
        };
    b.prototype.connect = function(a) {
        this._callbacks.push(a)
    };
    b.prototype.invoke = function() {
        a = Array.prototype.slice.call(arguments, 0);
        for (var b = 0; b < this._callbacks.length; ++b) this._callbacks[b].apply(this, a)
    };
    var c = function() {
        this._map = {}
    };
    c.prototype._get = function(a) {
        this._map[a] || (this._map[a] = new b);
        return this._map[a]
    };
    c.prototype.connect = function(a, b) {
        this._get(a).connect(b)
    };
    c.prototype.invoke = function(b) {
        var c = this._map[b];
        c && (1 < arguments.length ?
            a = Array.prototype.slice.call(arguments, 1) : a.length = 0, c.invoke.apply(c, a))
    };
    Nes.Event = b;
    Nes.EventBus = c
})();
this.Nes = this.Nes || {};
(function() {
    Nes.decompressIfNecessary = function(a, b, c) {
        if (a.match(/\.zip$/i)) {
            b = (new JSZip(b)).file(/\.nes$/i);
            if (0 === b.length) throw Error("Could not find .nes file in zip file " + a);
            c(null, b[0].asUint8Array())
        } else if (a.match(/\.7z$/i)) Nes.decompress7z(a, b, c);
        else if (a.match(/\.gz$/i)) a = jz.gz.decompress(b), c(null, a);
        else if (a.match(/\.nes$/i)) c(null, b);
        else throw Error("Unsupported file extension for file " + a);
    };
    Nes.loadRomFromUrl = function(a, b) {
        var c = new XMLHttpRequest;
        c.open("GET", a, !0);
        c.responseType =
            "arraybuffer";
        c.overrideMimeType("application/octet-stream");
        c.onerror = function(a) {
            b(a)
        };
        c.onload = function(d) {
            if (200 === c.status) {
                d = new Uint8Array(this.response);
                var e;
                e = a.lastIndexOf("/");
                e = 0 <= e ? a.slice(e + 1) : a;
                b(null, e, d)
            } else b("Error loading rom file from URL: '" + a + "' HTTP code: " + c.status)
        };
        c.send()
    }
})();
this.Nes = this.Nes || {};
(function() {
    Nes.decompress7z = function(a, b, c) {
        (new LZMA).decompress(b, function(a) {
            c(null, a)
        }, function(a) {
            0 > a && c("Error decompressing 7z")
        })
    }
})();
this.Nes = this.Nes || {};
(function() {
    Nes.uintArrayToString = function(a) {
        if (!(a instanceof Int32Array)) throw Error("Nes.uintArrayToString: Only accepts Int32Array parameter");
        for (var b = "", c = 0, d = a.length; c < d; c++) {
            var e = a[c];
            if (65535 < e) throw Error("Invalid value attempted to be serialised");
            b += String.fromCharCode(e)
        }
        return b
    };
    Nes.stringToUintArray = function(a) {
        for (var b = new Int32Array(a.length), c = 0, d = a.length; c < d; c++) b[c] = a.charCodeAt(c) | 0;
        return b
    };
    Nes.blobToString = function(a) {
        return (window.webkitURL || window.URL).createObjectURL(a)
    }
})();
this.WebGl = this.WebGl || {};
(function() {
    var a = function(a) {
            return a.getContext("webgl") || a.getContext("experimental-webgl")
        },
        b = function(a) {
            this._glContext = a;
            this._itemCount = this._itemSize = 0;
            this._buffer = this._glContext.createBuffer()
        };
    b.prototype.setData = function(a, b, c) {
        this._itemSize = b;
        this._itemCount = c;
        this._glContext.bindBuffer(this._glContext.ARRAY_BUFFER, this._buffer);
        this._glContext.bufferData(this._glContext.ARRAY_BUFFER, a, this._glContext.STATIC_DRAW)
    };
    b.prototype.bind = function(a) {
        this._glContext.bindBuffer(this._glContext.ARRAY_BUFFER, this._buffer);
        this._glContext.vertexAttribPointer(a, this._itemSize, this._glContext.FLOAT, !1, 0, 0)
    };
    var c = function(a) {
        this._glContext = a;
        this._itemCount = 0;
        this._buffer = this._glContext.createBuffer()
    };
    c.prototype.setData = function(a, b) {
        this._itemCount = b;
        this._glContext.bindBuffer(this._glContext.ELEMENT_ARRAY_BUFFER, this._buffer);
        this._glContext.bufferData(this._glContext.ELEMENT_ARRAY_BUFFER, a, this._glContext.STATIC_DRAW)
    };
    c.prototype.bind = function() {
        this._glContext.bindBuffer(this._glContext.ELEMENT_ARRAY_BUFFER,
            this._buffer)
    };
    c.prototype.draw = function() {
        this._glContext.drawElements(this._glContext.TRIANGLES, this._itemCount, this._glContext.UNSIGNED_SHORT, 0)
    };
    var d = function(a) {
        this._vertex = this._fragment = null;
        this._glContext = a;
        this._glContext.getExtension("OES_standard_derivatives");
        this._uniformLocationCache = {};
        this._attribCache = {};
        this._shaderProgram = this._glContext.createProgram()
    };
    d.prototype._compileShader = function(a, b) {
        var c = this._glContext.createShader(a),
            d = "";
        if (0 === b.indexOf("#version")) {
            var e = b.substr(0,
                b.indexOf("\n"));
            b = b.substring(e.length);
            d += e
        }
        d += "precision mediump float;\n#extension GL_OES_standard_derivatives : enable\n";
        a === this._glContext.VERTEX_SHADER && (d += "uniform mat4 aModelViewProjectionMatrix;\n", d += "attribute vec4 aVertexPosition;\n", d += "attribute vec4 aTextureCoord;\n");
        d += "varying vec4 vTextureCoord[8];\n";
        b = d + b;
        this._glContext.shaderSource(c, b);
        this._glContext.compileShader(c);
        if (!this._glContext.getShaderParameter(c, this._glContext.COMPILE_STATUS)) throw Error("Error compiling shader script " +
            this._glContext.getShaderInfoLog(c));
        return c
    };
    d.prototype._shaderLoadSuccess = function(a, b) {
        var c, d;
        a && (d = $(a), c = d.find("fragment")[0], d = d.find("vertex")[0]);
        c = c && c.textContent ? c.textContent : "uniform sampler2D rubyTexture;void main(void) {gl_FragColor = texture2D(rubyTexture, vec2(vTextureCoord[0].s, vTextureCoord[0].t));}";
        d = d && d.textContent ? d.textContent : "void main(void) {gl_Position = aModelViewProjectionMatrix * aVertexPosition;vTextureCoord[0] = aTextureCoord;}";
        this._fragment && this._glContext.detachShader(this._shaderProgram,
            this._fragment);
        this._vertex && this._glContext.detachShader(this._shaderProgram, this._vertex);
        this._fragment = this._compileShader(this._glContext.FRAGMENT_SHADER, c);
        this._vertex = this._compileShader(this._glContext.VERTEX_SHADER, d);
        this._glContext.attachShader(this._shaderProgram, this._fragment);
        this._glContext.attachShader(this._shaderProgram, this._vertex);
        this._glContext.linkProgram(this._shaderProgram);
        if (!this._glContext.getProgramParameter(this._shaderProgram, this._glContext.LINK_STATUS)) throw Error(this._glContext.getProgramInfoLog(this._shaderProgram));
        b(null)
    };
    d.prototype.loadAndLink = function(a, b) {
        this._uniformLocationCache = {};
        this._attribCache = {};
        if (a && 0 < a.length) {
            var c = this;
            $.ajax({
                url: "shaders/" + a,
                success: function(a) {
                    c._shaderLoadSuccess(a, b)
                },
                dataType: "xml"
            })
        } else this._shaderLoadSuccess(null, b)
    };
    d.prototype.use = function() {
        this._glContext.useProgram(this._shaderProgram)
    };
    d.prototype.getUniformLocation = function(a) {
        this._uniformLocationCache.hasOwnProperty(a) || (this._uniformLocationCache[a] = this._glContext.getUniformLocation(this._shaderProgram,
            a));
        return this._uniformLocationCache[a]
    };
    d.prototype.getAttrib = function(a) {
        this._attribCache.hasOwnProperty(a) || (this._attribCache[a] = this._glContext.getAttribLocation(this._shaderProgram, a), this._glContext.enableVertexAttribArray(this._attribCache[a]));
        return this._attribCache[a]
    };
    var e = function(a, b, c) {
        this._glContext = a;
        this._texture = this._glContext.createTexture();
        this._glContext.bindTexture(this._glContext.TEXTURE_2D, this._texture);
        this._glContext.pixelStorei(this._glContext.UNPACK_FLIP_Y_WEBGL, !0);
        this._glContext.texImage2D(this._glContext.TEXTURE_2D, 0, this._glContext.RGBA, b, c, 0, this._glContext.RGBA, this._glContext.UNSIGNED_BYTE, null)
    };
    e.prototype.bind = function() {
        this._glContext.activeTexture(this._glContext.TEXTURE0);
        this._glContext.bindTexture(this._glContext.TEXTURE_2D, this._texture);
        var a = this._glContext.LINEAR;
        this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_MAG_FILTER, a);
        this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_MIN_FILTER,
            a);
        this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_WRAP_S, this._glContext.CLAMP_TO_EDGE);
        this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_WRAP_T, this._glContext.CLAMP_TO_EDGE)
    };
    e.prototype.fill = function(a, b, c, d, e) {
        this._glContext.texSubImage2D(this._glContext.TEXTURE_2D, 0, a, b, c, d, this._glContext.RGBA, this._glContext.UNSIGNED_BYTE, e)
    };
    var f = function(a) {
        this._glContext = a;
        this._mvMatrix = mat4.create();
        this._pMatrix = mat4.create()
    };
    f.prototype.setup =
        function(a, b) {
            mat4.ortho(this._pMatrix, 0, a, 0, b, .1, 100);
            mat4.identity(this._mvMatrix);
            mat4.translate(this._mvMatrix, this._mvMatrix, [0, 0, -.1])
        };
    f.prototype.getMVPMatrix = function() {
        var a = mat4.create();
        mat4.multiply(a, this._pMatrix, this._mvMatrix);
        return a
    };
    WebGl.OrthoCamera = f;
    WebGl.FillableTexture = e;
    WebGl.ShaderProgram = d;
    WebGl.VertexBuffer = b;
    WebGl.IndexBuffer = c;
    WebGl.webGlSupported = function() {
        try {
            var b = document.createElement("canvas");
            return null !== a(b)
        } catch (c) {
            return !1
        }
    };
    WebGl.getGlContext = a
})();
this.Gui = this.Gui || {};
(function() {
    var a = function(a) {
        this._clearArray = new Uint32Array(SCREEN_WIDTH * SCREEN_HEIGHT);
        this._clearArrayColour = this._clearArray[0];
        this._bufferIndexArray = new Int32Array(SCREEN_WIDTH * SCREEN_HEIGHT);
        this._offscreenElement = document.createElement("canvas");
        this._offscreenElement.width = SCREEN_WIDTH;
        this._offscreenElement.height = SCREEN_HEIGHT;
        this._offscreenCanvas = this._offscreenElement.getContext("2d");
        this._offscreenData = this._offscreenCanvas.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        if (!this._offscreenData.data.buffer) throw Error("Browser does not support canvas image buffers. Cannot run emulator");
        this._offscreen32BitView = new Uint32Array(this._offscreenData.data.buffer);
        if (this._offscreen32BitView.length !== this._clearArray.length) throw Error("Unexpected canvas buffer size (actual=" + this._offscreen32BitView.length + ")");
        this._element = a.getCanvasElement();
        this._canvas = this._element.getContext("2d")
    };
    a.prototype.writeToBuffer = function(a, c, d) {
        this._bufferIndexArray[c] <= a && (this._offscreen32BitView[c] = 4278190080 | d, this._bufferIndexArray[c] = a)
    };
    a.prototype.getRenderBufferHash = function() {
        return (new Rusha).digestFromArrayBuffer(this._offscreen32BitView).toUpperCase()
    };
    a.prototype.clearBuffers = function(a) {
        var c = 0;
        if (a !== this._clearArrayColour) {
            for (c = 0; c < this._clearArray.length; ++c) this._clearArray[c] = 4278190080 | a;
            this._clearArrayColour = a
        }
        this._offscreen32BitView.set(this._clearArray);
        this._bufferIndexArray.set(g_ClearScreenArray)
    };
    a.prototype.render = function(a) {
        this._offscreenCanvas.putImageData(this._offscreenData, 0, 0);
        this._canvas.drawImage(this._offscreenElement, 0, 0, this._element.clientWidth, this._element.clientHeight)
    };
    a.prototype.screenshotToFile = function() {
        this._offscreenElement.toBlob(function(a) {
            saveAs(a,
                "screenshot.png")
        })
    };
    a.prototype.screenshotToString = function() {
        return this._offscreenElement.toDataURL("image/png")
    };
    Gui.CanvasRenderSurface = a
})();
this.Gui = this.Gui || {};
this.WebGl = this.WebGl || {};
(function() {
    var a = function(a) {
        var c = this;
        this._ready = !1;
        this._clearArray = new Uint32Array(SCREEN_WIDTH * SCREEN_HEIGHT);
        this._clearArrayColour = this._clearArray[0];
        this._bufferIndexArray = new Int32Array(SCREEN_WIDTH * SCREEN_HEIGHT);
        this._offscreen32BitView = new Uint32Array(65536);
        this._offscreen8BitView = new Uint8Array(this._offscreen32BitView.buffer);
        this._element = a.getCanvasElement();
        this._glContext = WebGl.getGlContext(this._element);
        this._camera = new WebGl.OrthoCamera(this._glContext);
        this._camera.setup(SCREEN_WIDTH,
            SCREEN_HEIGHT);
        this._initBuffers();
        this._texture = new WebGl.FillableTexture(this._glContext, 256, 256);
        a.connect("resize", function() {
            c._onResize()
        });
        this._inputSizeShaderArray = new Float32Array([SCREEN_WIDTH, SCREEN_HEIGHT]);
        this._outputSizeShaderArray = new Float32Array([SCREEN_WIDTH, SCREEN_HEIGHT]);
        this._textureSizeShaderArray = new Float32Array([256, 256]);
        this._shader = new WebGl.ShaderProgram(this._glContext);
        this.loadShader(null, function() {
            c._ready = !0
        })
    };
    a.prototype.loadShader = function(a, c) {
        var d = this;
        this._shader.loadAndLink(a, function() {
            d._shader.use();
            d._glContext.uniform2fv(d._shader.getUniformLocation("rubyInputSize"), d._inputSizeShaderArray);
            d._glContext.uniform2fv(d._shader.getUniformLocation("rubyOutputSize"), d._outputSizeShaderArray);
            d._glContext.uniform2fv(d._shader.getUniformLocation("rubyTextureSize"), d._textureSizeShaderArray);
            d._glContext.uniformMatrix4fv(d._shader.getUniformLocation("aModelViewProjectionMatrix"), !1, d._camera.getMVPMatrix());
            d._vertexBuffer.bind(d._shader.getAttrib("aVertexPosition"));
            d._textureCoordBuffer.bind(d._shader.getAttrib("aTextureCoord"));
            d._indexBuffer.bind();
            d._texture.bind();
            d._glContext.uniform1i(d._shader.getUniformLocation("rubyTexture"), 0);
            c()
        })
    };
    a.prototype._initBuffers = function() {
        var a = SCREEN_WIDTH / 256,
            c = SCREEN_HEIGHT / 256,
            d = new Float32Array([0, 0, 0, 1, SCREEN_WIDTH, 0, 0, 1, SCREEN_WIDTH, SCREEN_HEIGHT, 0, 1, 0, SCREEN_HEIGHT, 0, 1]),
            a = new Float32Array([0, 0, a, 0, a, c, 0, c]),
            c = new Uint16Array([0, 1, 2, 0, 2, 3]);
        this._vertexBuffer = new WebGl.VertexBuffer(this._glContext);
        this._vertexBuffer.setData(d,
            4, 4);
        this._textureCoordBuffer = new WebGl.VertexBuffer(this._glContext);
        this._textureCoordBuffer.setData(a, 2, 4);
        this._indexBuffer = new WebGl.IndexBuffer(this._glContext);
        this._indexBuffer.setData(c, 6)
    };
    a.prototype._onResize = function() {
        this._glContext.viewport(0, 0, this._element.width, this._element.height);
        this._glContext.clearColor(0, 0, 0, 1)
    };
    a.prototype.writeToBuffer = function(a, c, d) {
        this._bufferIndexArray[c] <= a && (this._offscreen32BitView[c] = 4278190080 | d, this._bufferIndexArray[c] = a)
    };
    a.prototype.getRenderBufferHash =
        function() {
            return (new Rusha).digestFromArrayBuffer(this._offscreen32BitView).toUpperCase()
        };
    a.prototype.clearBuffers = function(a) {
        if (a !== this._clearArrayColour) {
            for (var c = 0; c < this._clearArray.length; ++c) this._clearArray[c] = 4278190080 | a;
            this._clearArrayColour = a
        }
        this._offscreen32BitView.set(this._clearArray);
        this._bufferIndexArray.set(g_ClearScreenArray)
    };
    a.prototype.render = function(a) {
        this._ready && (this._glContext.clear(this._glContext.COLOR_BUFFER_BIT), this._texture.fill(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT,
            this._offscreen8BitView), this._glContext.uniform1i(this._shader.getUniformLocation("rubyFrameCount"), a.ppu.frameCounter), this._indexBuffer.draw())
    };
    a.prototype._createCanvasWithScreenshotOn = function() {
        var a = document.createElement("canvas");
        a.width = SCREEN_WIDTH;
        a.height = SCREEN_HEIGHT;
        var c = a.getContext("2d"),
            d = c.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        d.data.set(this._offscreen8BitView.subarray(0, SCREEN_WIDTH * SCREEN_HEIGHT * 4));
        c.putImageData(d, 0, 0);
        return a
    };
    a.prototype.screenshotToFile = function() {
        this._createCanvasWithScreenshotOn().toBlob(function(a) {
            saveAs(a,
                "screenshot.png")
        })
    };
    a.prototype.screenshotToString = function() {
        return this._createCanvasWithScreenshotOn().toDataURL("image/png")
    };
    a.prototype.loadShaderFromUrl = function(a) {
        this.loadShader(a, function() {})
    };
    Gui.WebGlRenderSurface = a
})();
this.Gui = this.Gui || {};
(function() {
    Gui.hookDragDropEvents = function(a) {
        function b(b) {
            b.stopPropagation();
            b.preventDefault();
            var c = b.dataTransfer.files;
            if (0 < c.length) {
                var d = new FileReader;
                d.onload = function() {
                    a && a(c[0].name, new Uint8Array(d.result))
                };
                d.readAsArrayBuffer(c[0])
            }
        }

        function c(a) {
            a.stopPropagation();
            a.preventDefault();
            a.dataTransfer.dropEffect = "copy"
        }
        if ("function" === typeof window.FileReader) {
            var d = document.getElementById("body");
            d.addEventListener("dragover", c, !1);
            d.addEventListener("drop", b, !1)
        }
    }
})();
this.Gui = this.Gui || {};
(function() {
    var a = function(a) {
        this._axisThreshold = .5;
        this._buttonStates = new Int32Array(a.buttons.length);
        this._axesStates = new Int32Array(a.axes.length)
    };
    a.prototype.getButtonCount = function() {
        return this._buttonStates.length
    };
    a.prototype.getButtonState = function(a, b) {
        var e = a.buttons[b].pressed,
            f = e ? 1 : 0;
        return this._buttonStates[b] !== f ? (this._buttonStates[b] = f, e ? 1 : 2) : 0
    };
    a.prototype.getAxisCount = function() {
        return this._axesStates.length
    };
    a.prototype.getAxisState = function(a, b) {
        var e = a.axes[b] >= this._axisThreshold ||
            a.axes[b] <= -this._axisThreshold,
            f = e ? 1 : 0;
        return this._axesStates[b] !== f ? (this._axesStates[b] = f, e ? 1 : 2) : 0
    };
    var b = function(a) {
        this._mainboard = a;
        this._pads = [];
        this._loadKeyBindingsFromLocalStorage();
        this._gamepadButtonMap = {
            UP: [12],
            DOWN: [13],
            LEFT: [14],
            RIGHT: [15],
            A: [0, 1, 4],
            B: [2, 3, 5],
            SELECT: [8],
            START: [9]
        };
        this._gamepadAxisMap = {
            UP: [{
                axis: 1,
                type: "positive"
            }, {
                axis: 3,
                type: "positive"
            }],
            DOWN: [{
                axis: 1,
                type: "negative"
            }, {
                axis: 3,
                type: "negative"
            }],
            LEFT: [{
                axis: 0,
                type: "negative"
            }, {
                axis: 2,
                type: "negative"
            }],
            RIGHT: [{
                axis: 0,
                type: "positive"
            }, {
                axis: 2,
                type: "positive"
            }],
            A: [{
                axis: 6,
                type: "positive"
            }],
            B: [{
                axis: 7,
                type: "positive"
            }]
        };
        var b = this;
        window.addEventListener("keydown", function(a) {
            b._doKeyboardButtonPress(Number(a.keyCode), !0) && a.preventDefault()
        }, !1);
        window.addEventListener("keyup", function(a) {
            b._doKeyboardButtonPress(Number(a.keyCode), !1) && a.preventDefault()
        }, !1);
        if (this._gamepadsSupported = void 0 !== navigator.getGamepads) this._populateGamepads(), $(window).on("gamepadconnected", function() {
            b._populateGamepads()
        }), $(window).on("gamepaddisconnected",
            function() {
                b._populateGamepads()
            })
    };
    b.prototype._populateGamepads = function() {
        this._pads.length = 0;
        if (this._gamepadsSupported)
            for (var b = navigator.getGamepads(), d = 0; d < b.length; ++d) b[d] && this._pads.push(new a(b[d]))
    };
    b.prototype.poll = function() {
        this._gamepadsSupported && this._pollGamepads()
    };
    b.prototype._pollGamepads = function() {
        for (var a = navigator.getGamepads(), b = 0; b < this._pads.length; ++b) {
            for (var e = this._pads[b], f = 0; f < e.getButtonCount(); ++f) {
                var g = e.getButtonState(a[b], f);
                0 < g && this._doGamepadButton(b,
                    f, 1 === g)
            }
            for (f = 0; f < e.getAxisCount(); ++f) e.getAxisState(a[b], f)
        }
    };
    b.prototype._doGamepadAxis = function(a, b, e, f) {
        if (a = this._mainboard.inputdevicebus.getJoypad(a))
            for (var g in this._gamepadButtonMap)
                if (this._gamepadButtonMap.hasOwnProperty(g))
                    for (var h = this._gamepadButtonMap[g], k = 0; k < h.length; ++k) {
                        var l = h[k];
                        l.axis === b && l.type === f && a.pressButton(Number(JOYPAD_NAME_TO_ID(g)), e)
                    }
    };
    b.prototype._doGamepadButton = function(a, b, e) {
        if (a = this._mainboard.inputdevicebus.getJoypad(a))
            for (var f in this._gamepadButtonMap)
                if (this._gamepadButtonMap.hasOwnProperty(f))
                    for (var g =
                            this._gamepadButtonMap[f], h = 0; h < g.length; ++h) b === g[h] && a.pressButton(Number(JOYPAD_NAME_TO_ID(f)), e)
    };
    b.prototype._doKeyboardButtonPress = function(a, b) {
        for (var e = Math.min(2, this._playerKeyboardMaps.length), f = !1, g = 0; g < e; ++g) {
            var h = this._mainboard.inputdevicebus.getJoypad(g),
                k = this._playerKeyboardMaps[g];
            if (k && h)
                for (var l = 0; l < k.length; ++l)
                    for (var m = k[l], n = 0; n < m.length; ++n) m[n] === a && (h.pressButton(l, b), f = !0)
        }
        return f
    };
    b.prototype.saveKeyBindings = function(a, b, e) {
        this._playerKeyboardMaps[a][b] = e.slice(0);
        this._saveKeyBindingsToLocalStorage()
    };
    b.prototype.getKeyBindings = function(a, b) {
        return this._playerKeyboardMaps[a][b].slice(0)
    };
    b.prototype._loadKeyBindingsFromLocalStorage = function() {
        this._playerKeyboardMaps = Gui.loadFromLocalStorage("webnes_keybindings");
        this._playerKeyboardMaps || (this._playerKeyboardMaps = [
            [
                [90],
                [88],
                [16, 160, 161, 67],
                [13, 32, 86],
                [38, 87, 104],
                [40, 83, 101, 98],
                [37, 65, 100],
                [39, 68, 102]
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ],
            [
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ]
        ])
    };
    b.prototype._saveKeyBindingsToLocalStorage =
        function() {
            Gui.saveToLocalStorage("webnes_keybindings", this._playerKeyboardMaps)
        };
    Gui.Input = b
})();
this.Gui = this.Gui || {};
(function() {
    var a = function(a) {
            a = Nes.stringToUintArray(a);
            return Nes.uintArrayToString(new Int32Array(jz.algos.deflate(new Uint8Array(a))))
        },
        b = function(a) {
            a = Nes.stringToUintArray(a);
            return Nes.uintArrayToString(new Int32Array(jz.algos.inflate(new Uint8Array(a))))
        },
        c = function(a) {
            (a = f("meta:" + a)) || (a = {
                slots: {}
            });
            return a
        },
        d = function(a, b, c, d) {
            var e = b + ":" + d,
                f = localStorage.getItem(e);
            f && (localStorage.removeItem(e), c && localStorage.setItem(c + ":" + d, f), c && (a.slots[c] = a.slots[b]), delete a.slots[b])
        },
        e = function(b,
            c) {
            if (localStorage) {
                var d = JSON.stringify(c),
                    d = a(d);
                localStorage.setItem(b, d)
            }
        },
        f = function(a) {
            return localStorage && (a = localStorage.getItem(a)) ? (a = b(a), JSON.parse(a)) : null
        };
    Gui.saveState = function(b, d, f, l) {
        if (localStorage) {
            e(b + ":" + d, f);
            f = c(d);
            var m = {};
            l && (m.screen = a(l), console.log("Saved screenshot size: " + m.screen.length + " (uncompressed: " + l.length + ")"));
            m.date = Date.now();
            f.slots[b] = m;
            e("meta:" + d, f)
        }
    };
    Gui.loadState = function(a, c) {
        if (localStorage) {
            var d = localStorage.getItem(a + ":" + c);
            if (d) {
                var e = d.length,
                    d = b(d),
                    f = JSON.parse(d);
                console.log("Loaded data size: " + e + " (uncompressed: " + d.length + ")");
                return f
            }
        }
        return null
    };
    Gui.getStateMetaData = function(a, d) {
        var e = c(a);
        if (d)
            for (var f = Object.keys(e.slots), m = 0; m < f.length; ++m) {
                var n = e.slots[f[m]];
                n.screen && (n.screen = b(n.screen))
            }
        return e
    };
    Gui.renameQuickSaveStates = function(a, b, f) {
        var l = c(b);
        d(l, a + ZERO_PAD(f - 1, 2, 0), null, b);
        for (f -= 2; 0 < f; --f) d(l, a + ZERO_PAD(f, 2, 0), a + ZERO_PAD(f + 1, 2, 0), b);
        d(l, a, a + ZERO_PAD(1, 2, 0), b);
        e("meta:" + b, l)
    };
    Gui.saveStateSupported = function() {
        return !!localStorage
    };
    Gui.saveToLocalStorage = e;
    Gui.loadFromLocalStorage = f
})();
this.Nes = this.Nes || {};
(function() {
    Nes.trace_cpu = 0;
    Nes.trace_cpuInstructions = 1;
    Nes.trace_ppu = 2;
    Nes.trace_mapper = 3;
    Nes.trace_apu = 4;
    Nes.trace_all = 5;
    var a = function() {
        this._lines = [];
        this._running = !1;
        this._enabledTypes = Array(Nes.trace_all + 1);
        for (var a = 0; a < this._enabledTypes.length; ++a) this._enabledTypes[a] = 0
    };
    a.prototype.enabled = function() {
        return this._running
    };
    a.prototype.enableType = function(a, c) {
        this._enabledTypes[a] = c ? 1 : 0
    };
    a.prototype.writeLine = function(a, c) {
        this._running && 1 === this._enabledTypes[a] && this._lines.push(c + "\r\n")
    };
    a.prototype.start = function() {
        this._running = !0
    };
    a.prototype.stop = function() {
        this._running = !1;
        if (0 < this._lines.length) {
            var a = new Blob(this._lines, {
                type: "text/plain;charset=utf-8"
            });
            saveAs(a, "trace.txt");
            this._lines.length = 0
        }
    };
    Nes.Trace = new a
})();
this.Gui = this.Gui || {};
"use strict";
var WebAudioBuffer = function(a, b, c) {
    this._locked = !1;
    this.audioContext = a;
    this.audioNode = null;
    this._gainNode = this.audioContext.createGain();
    this._gainNode.connect(b);
    this.audioBuffer = this.audioContext.createBuffer(1, c, this.audioContext.sampleRate)
};
WebAudioBuffer.prototype.lockBuffer = function() {
    this._locked = !0;
    return this.audioBuffer.getChannelData(0)
};
WebAudioBuffer.prototype.unlockBuffer = function() {
    this._locked = !1;
    this.audioNode && (this.audioNode.disconnect(), this.audioNode = null);
    this.audioNode = this.audioContext.createBufferSource();
    this.audioNode.buffer = this.audioBuffer;
    this.audioNode.connect(this._gainNode);
    this.audioNode.start(0)
};
var WebAudioRenderer = function(a, b) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    if (void 0 === window.AudioContext) throw Error("WebAudio not supported in this browser");
    this.audioContext = new window.AudioContext;
    this._gainNode = this.audioContext.createGain();
    this._gainNode.connect(this.audioContext.destination)
};
WebAudioRenderer.prototype.setVolume = function(a) {
    this._gainNode && (this._gainNode.gain.value = a / 100)
};
WebAudioRenderer.prototype.getSampleRate = function() {
    return this.audioContext.sampleRate
};
WebAudioRenderer.prototype.createBuffer = function(a) {
    return new WebAudioBuffer(this.audioContext, this._gainNode, a)
};
Gui.WebAudioRenderer = WebAudioRenderer;
this.Gui = this.Gui || {};
(function() {
    var a = function(a) {
        var c = this;
        this._eventBus = new Nes.EventBus;
        this._parent = $("#content");
        this._element = $("#canvasWrapper");
        this._canvasElement = document.createElement("canvas");
        this._element[0].appendChild(this._canvasElement);
        this._setSize();
        $(window).resize(function() {
            c._setSize();
            c._setPosition()
        });
        this._setPosition()
    };
    a.prototype.connect = function(a, c) {
        this._eventBus.connect(a, c)
    };
    a.prototype.getCanvasElement = function() {
        return this._canvasElement
    };
    a.prototype._setSize = function() {
        this._parent.width();
        var a = this._parent.height();
        this._canvasElement.width = Math.floor(SCREEN_WIDTH / SCREEN_HEIGHT * a);
        this._canvasElement.height = a;
        this._eventBus.invoke("resize")
    };
    a.prototype._setPosition = function() {
        this._element.position({
            of: this._parent,
            my: "center center",
            at: "center center"
        })
    };
    Gui.CanvasParent = a
})();
this.Gui = this.Gui || {};
(function() {
    var a = function(a, b, c) {
            var d = a.offset(),
                e = a.width();
            a = a.height();
            return d.left - 40 <= b && d.left + e + 40 >= b && d.top - 40 <= c && d.top + a + 40 >= c
        },
        b = function(a, b, c) {
            var d = this;
            this._options = c;
            this._toggleState = !1;
            this._button = $("#" + b).button({
                text: !1,
                label: this._options.primary.label,
                icons: {
                    primary: this._options.primary.icon
                }
            });
            (this._options.toggleIcon || this._options.click) && this._button.click(function() {
                var a = d._onClick();
                return void 0 === a ? !0 : a
            });
            this._options.enabledWhenRomIsLoaded && (this.enable(!1),
                a.connect("romLoaded", function(a) {
                    d._onRomLoaded(a)
                }))
        };
    b.prototype._onClick = function() {
        return this._options.click ? this._options.click() : !0
    };
    b.prototype._onRomLoaded = function(a) {
        this._options.enabledWhenRomIsLoaded && this.enable(!0)
    };
    b.prototype.toggleIcon = function(a) {
        this._toggleState = void 0 === a ? !this._toggleState : a;
        this._options.toggle && this._button.button("option", this._toggleState ? {
            label: this._options.toggle.label || this._options.primary.label,
            icons: {
                primary: this._options.toggle.icon || this._options.primary.icon
            }
        } : {
            label: this._options.primary.label,
            icons: {
                primary: this._options.primary.icon
            }
        })
    };
    b.prototype.highlight = function(a) {
        !0 === a || void 0 === a ? this._button.addClass("ui-state-highlight") : this._button.removeClass("ui-state-highlight")
    };
    b.prototype.alert = function(a) {
        !0 === a || void 0 === a ? this._button.addClass("ui-state-error") : this._button.removeClass("ui-state-error")
    };
    b.prototype.enable = function(a) {
        this._button.button(void 0 === a || a ? "enable" : "disable")
    };
    var c = function(a, b, c) {
        var d = this;
        this._buttonObject = b;
        this._options =
            c || {};
        this._menu = $("#" + a).menu();
        this._menu.hide();
        $(document).on("click", function(a) {
            d._onDocClick(a)
        });
        if (this._options.checkBoxes && Array.isArray(this._options.checkBoxes))
            for (a = 0; a < this._options.checkBoxes.length; ++a) b = this._options.checkBoxes[a], b.change && b.checkBoxSelector.change(b.change)
    };
    c.prototype._onDocClick = function(b) {
        if ((0 !== b.clientX || 0 !== b.clientY) && this.isVisible())
            if (!a(this._menu, b.clientX, b.clientY)) this.hide();
            else if (this._options.checkBoxes && Array.isArray(this._options.checkBoxes))
            for (var c =
                    0; c < this._options.checkBoxes.length; ++c) {
                var d = this._options.checkBoxes[c];
                b.target.id === d.parentId && d.checkBoxSelector.click()
            }
    };
    c.prototype.toggleShow = function() {
        this.isVisible() ? this.hide() : this.show()
    };
    c.prototype.show = function() {
        this._menu.show().position({
            my: "left bottom",
            at: "left top",
            of: this._buttonObject._button
        })
    };
    c.prototype.hide = function() {
        this._menu.is(":visible") && this._menu.hide()
    };
    c.prototype.isVisible = function() {
        return this._menu.is(":visible")
    };
    var d = function(a, b, c) {
        var d = this;
        this._buttonObject =
            b;
        this._options = c;
        this._options.defaultValueIndex = void 0 === this._options.defaultValueIndex ? 0 : this._options.defaultValueIndex;
        this._currentIndex = this._options.defaultValueIndex;
        this._tooltipCreated = !1;
        this._dialog = $("#" + a).dialog({
            dialogClass: "no-close controlBarSlider",
            draggable: !1,
            autoOpen: !1,
            height: 130,
            minHeight: 130,
            width: 40,
            minWidth: 40,
            modal: !1,
            resizable: !1,
            buttons: {},
            close: function() {}
        });
        a = document.createElement("div");
        this._dialog[0].appendChild(a);
        this._slider = void 0 === this._options.values ?
            $(a).slider({
                value: this._options.defaultValueIndex,
                min: this._options.minValue,
                max: this._options.maxValue,
                orientation: "vertical",
                change: function(a, b) {
                    d._updateTooltip(b.handle, b.value)
                }
            }) : $(a).slider({
                value: this._options.defaultValueIndex,
                min: 0,
                max: this._options.values.length - 1,
                step: 1,
                orientation: "vertical",
                slide: function(a, b) {
                    d._updateTooltip(b.handle, b.value)
                },
                change: function(a, b) {
                    d._updateTooltip(b.handle, b.value)
                }
            });
        this._slider.addClass("controlBarSliderContents");
        this._createTooltip();
        $(document).on("click",
            function(a) {
                d._onDocClick(a)
            })
    };
    d.prototype._getTooltipText = function(a) {
        return this._options.values && 0 <= a && a < this._options.values.length ? this._options.values[a].text : a.toString()
    };
    d.prototype._createTooltip = function() {
        $(".ui-slider-handle", this._slider).qtip({
            content: this._getTooltipText(this._options.defaultValueIndex),
            position: {
                corner: {
                    target: "leftMiddle",
                    tooltip: "rightMiddle"
                },
                adjust: {
                    screen: !0,
                    resize: !0
                }
            },
            hide: {
                delay: 100
            }
        })
    };
    d.prototype._updateTooltip = function(a, b) {
        this._currentIndex !== b && (this._currentIndex =
            b, $(a).qtip("option", "content.text", this._getTooltipText(b)), this._options.change && this._options.change(this._options.values ? this._options.values[this._currentIndex].value : b))
    };
    d.prototype._onDocClick = function(b) {
        0 === b.clientX && 0 === b.clientY || !this.isVisible() || !a(this._dialog, b.clientX, b.clientY) && this.hide()
    };
    d.prototype.show = function() {
        this._dialog.dialog("option", "position", {
            my: "left bottom",
            at: "left top",
            of: this._buttonObject._button
        });
        this._dialog.dialog("open")
    };
    d.prototype.hide = function() {
        this._dialog.is(":visible") &&
            this._dialog.dialog("close")
    };
    d.prototype.isVisible = function() {
        return this._dialog.is(":visible")
    };
    var e = function(a, b, c) {
        var d = this;
        this._buttonObject = b;
        this._options = c;
        this._allowAutoHide = !1;
        this._dialog = $("#" + a).dialog({
            dialogClass: "no-close controlBarSlider",
            draggable: !1,
            autoOpen: !1,
            height: "auto",
            minHeight: 50,
            width: "auto",
            minWidth: 100,
            modal: !1,
            resizable: !1,
            buttons: {},
            close: function() {}
        });
        this._textElement = document.createElement("div");
        this._dialog[0].appendChild(this._textElement);
        $(document).on("click",
            function(a) {
                d._onDocClick(a)
            })
    };
    e.prototype.setText = function(a) {
        this._textElement.innerHTML = "<p>" + a + "</p>"
    };
    e.prototype._onDocClick = function(b) {
        (0 !== b.clientX || 0 !== b.clientY) && this.isVisible() && (a(this._dialog, b.clientX, b.clientY) || this._allowAutoHide && this.hide())
    };
    e.prototype.show = function() {
        var a = this;
        this._dialog.dialog("option", "position", {
            my: "right top",
            at: "right bottom",
            of: this._buttonObject._button
        });
        this._dialog.dialog("open");
        this._buttonObject.alert(!0);
        this._allowAutoHide = !1;
        setTimeout(function() {
            a._allowAutoHide = !0
        }, 300)
    };
    e.prototype.hide = function() {
        this._dialog.is(":visible") && this._dialog.dialog("close");
        this._buttonObject.alert(!1)
    };
    e.prototype.isVisible = function() {
        return this._dialog.is(":visible")
    };
    Gui.ControlBarButton = b;
    Gui.ControlBarMenu = c;
    Gui.ControlBarSlider = d;
    Gui.ControlBarMessage = e
})();
this.Gui = this.Gui || {};
(function() {
    var a = function(a) {
        var c = this;
        this._debugEnabled = !1;
        this._isLimitOn = !0;
        this._encodingIgnoreNextClick = this._isPaused = this._traceRunning = !1;
        this._app = a;
        this._eventBus = new Nes.EventBus;
        this._app.connect("cartLoaded", function(a) {
            c._onCartLoaded(a)
        });
        this._app._mainboard.connect("soundEnabled", function(a, b) {
            c._onSoundEnabled(a, b)
        });
        this._app.connect("traceRunning", function(a) {
            c._onTraceRunning(a)
        });
        this._app.connect("frameLimit", function(a) {
            c._onFrameLimitSet(a)
        });
        this._app.connect("isPausedChange",
            function(a) {
                c._onPauseChange(a)
            });
        this._app.connect("romLoadFailure", function(a) {
            c._onRomLoadFailure(a)
        });
        this._element = $("#controlBar");
        this._debugBar = $("#debugBar");
        this._debugBar.hide();
        this._buttons = [];
        this._addButton("controlBar_loadRomButton", {
            primary: {
                label: "Open ROM",
                icon: "ui-icon-folder-open"
            },
            click: function() {
                c._loadRomButtonClick()
            }
        });
        this._addButton("controlBar_resetButton", {
            enabledWhenRomIsLoaded: !0,
            primary: {
                label: "Reset",
                icon: "ui-icon-refresh"
            },
            click: function() {
                c._onResetButtonClick()
            }
        });
        this._playButton = this._addButton("controlBar_playButton", {
            primary: {
                label: "Pause",
                icon: "ui-icon-pause"
            },
            toggle: {
                label: "Play",
                icon: "ui-icon-play"
            },
            click: function() {
                c._onPlayButtonClick()
            }
        });
        this._gameGenieButton = this._addButton("controlBar_gameGenieButton", {
            enabledWhenRomIsLoaded: !0,
            primary: {
                label: "Game Genie",
                icon: "ui-icon-star"
            },
            click: function() {
                c._onGameGenieButtonClick()
            }
        });
        this._addButton("controlBar_quickSaveButton", {
            enabledWhenRomIsLoaded: !0,
            primary: {
                label: "Quick save",
                icon: "ui-icon-disk"
            },
            click: function() {
                c._onSaveButtonClick()
            }
        });
        this._addButton("controlBar_quickLoadButton", {
            enabledWhenRomIsLoaded: !0,
            primary: {
                label: "Quick load",
                icon: "ui-icon-folder-collapsed"
            },
            click: function() {
                c._onLoadButtonClick()
            }
        });
        this._addButton("controlBar_screenshotButton", {
            enabledWhenRomIsLoaded: !0,
            primary: {
                label: "Screenshot",
                icon: "ui-icon-image"
            },
            click: function() {
                c._onScreenshotButtonClick()
            }
        });
        this._debugButton = this._addButton("controlBar_debugButton", {
            primary: {
                label: "Debug panel",
                icon: "ui-icon-wrench"
            },
            click: function() {
                c._onDebugButtonClick()
            }
        });
        this._keyboardRemapperButton = this._addButton("controlBar_keyboardRemap", {
            primary: {
                label: "Remap controls",
                icon: "ui-icon-calculator"
            },
            click: function() {
                c._onKeyboardRemapButtonClick()
            }
        });
        this._soundButton = this._addButton("controlBar_soundButton", {
            primary: {
                label: "Volume",
                icon: "ui-icon-volume-on"
            },
            toggle: {
                label: "Volume",
                icon: "ui-icon-volume-off"
            },
            click: function() {
                c._onSoundButtonClick();
                return !1
            }
        });
        this._soundSlider = new Gui.ControlBarSlider("controlBar_volumeSlider", this._soundButton, {
            minValue: 0,
            maxValue: 100,
            defaultValueIndex: 100,
            change: function(a) {
                c._onVolumeSliderChange(a)
            }
        });
        this._errorDisplayButton = this._addButton("controlBar_errorDisplay", {
            primary: {
                label: "Alerts",
                icon: "ui-icon-alert"
            },
            click: function() {
                c._errorDisplayButtonClick()
            }
        });
        this._errorDisplayMessage = new Gui.ControlBarMessage("controlBar_alertMessage", this._errorDisplayButton);
        this._addButton("debugControlBar_playOneFrameButton", {
            primary: {
                label: "Play one frame",
                icon: "ui-icon-seek-next"
            },
            click: function() {
                c._onPlayOneFrameButtonClick()
            }
        });
        this._gameSpeedButton = this._addButton("debugControlBar_gameSpeedButton", {
            primary: {
                label: "Game Speed",
                icon: "ui-icon-transferthick-e-w"
            },
            click: function() {
                c._onGameSpeedClick();
                return !1
            }
        });
        this._addButton("debugControlBar_getFrameHashButton", {
            primary: {
                label: "Display frame information",
                icon: "ui-icon-locked"
            },
            click: function() {
                c._getFrameHashButtonClick()
            }
        });
        this._traceButton = this._addButton("debugControlBar_traceButton", {
            primary: {
                label: "Start Trace",
                icon: "ui-icon-arrowthickstop-1-s"
            },
            toggle: {
                label: "Stop Trace",
                icon: "ui-icon-stop"
            },
            click: function() {
                c._startTrace()
            }
        });
        this._encodingSelection = $("#debugControlBar_encoding").buttonset();
        this._encodingNTSC = $("#debugControlBar_encodingNTSC").click(function() {
            return c._encodingClick("NTSC")
        });
        this._encodingPAL = $("#debugControlBar_encodingPAL").click(function() {
            return c._encodingClick("PAL")
        });
        this._selectTraceButton = this._addButton("debugControlBar_selectTraceButton", {
            primary: {
                label: "Trace Options..",
                icon: "ui-icon-triangle-1-n"
            },
            click: function() {
                c._traceMenu.toggleShow();
                return !1
            }
        });
        this._traceMenu = new Gui.ControlBarMenu("debugControlBar_traceMenu", this._selectTraceButton, {
            checkBoxes: [{
                parentId: "controlBar_cpuTraceParent",
                checkBoxSelector: $("#controlBar_cpuTraceButton"),
                change: function(a) {
                    c._onTraceOption(Nes.trace_cpu, a)
                }
            }, {
                parentId: "controlBar_cpuInstructionsTraceParent",
                checkBoxSelector: $("#controlBar_cpuInstructionsTraceButton"),
                change: function(a) {
                    c._onTraceOption(Nes.trace_cpuInstructions, a)
                }
            }, {
                parentId: "controlBar_ppuTraceParent",
                checkBoxSelector: $("#controlBar_ppuTraceButton"),
                change: function(a) {
                    c._onTraceOption(Nes.trace_ppu, a)
                }
            }, {
                parentId: "controlBar_mapperTraceParent",
                checkBoxSelector: $("#controlBar_mapperTraceButton"),
                change: function(a) {
                    c._onTraceOption(Nes.trace_mapper, a)
                }
            }, {
                parentId: "controlBar_allTraceParent",
                checkBoxSelector: $("#controlBar_allTraceButton"),
                change: function(a) {
                    c._onTraceOption(Nes.trace_all, a)
                }
            }]
        });
        this._gameSpeedSlider = new Gui.ControlBarSlider("debugControlBar_gameSpeedSlider", this._gameSpeedButton, {
            values: [{
                text: "25% Speed",
                value: 25
            }, {
                text: "50% Speed",
                value: 50
            }, {
                text: "75% Speed",
                value: 75
            }, {
                text: "100% Speed",
                value: 100
            }, {
                text: "125% Speed",
                value: 125
            }, {
                text: "150% Speed",
                value: 150
            }, {
                text: "175% Speed",
                value: 175
            }, {
                text: "200% Speed",
                value: 200
            }, {
                text: "Unlimited",
                value: -1
            }],
            defaultValueIndex: 3,
            change: function(a) {
                c._onGameSpeedSliderChange(a)
            }
        });
        this._element.css("visibility", "visible");
        $(window).resize(function() {
            c._setPosition()
        });
        this._setPosition()
    };
    a.prototype._onKeyboardRemapButtonClick = function() {
        this._app._keyboardRemapDialog.show()
    };
    a.prototype._errorDisplayButtonClick =
        function() {
            this._errorDisplayButton.alert(!1)
        };
    a.prototype._onRomLoadFailure = function(a) {
        this._errorDisplayMessage.setText(a);
        this._errorDisplayMessage.show()
    };
    a.prototype._onTraceOption = function(a, c) {
        this._app.setTraceOption(a, c.currentTarget.checked)
    };
    a.prototype._onGameSpeedSliderChange = function(a) {
        this._app.setGameSpeed(a)
    };
    a.prototype._onVolumeSliderChange = function(a) {
        var c = 0 === a;
        this._app.soundSupported() && (this._soundButton.toggleIcon(c), this._app.enableSound(!c), this._app.setVolume(a))
    };
    a.prototype._addButton =
        function(a, c) {
            var d = new Gui.ControlBarButton(this._app._mainboard, a, c);
            this._buttons.push(d);
            return d
        };
    a.prototype.connect = function(a, c) {
        this._eventBus.connect(a, c)
    };
    a.prototype._encodingClick = function(a) {
        if (this._encodingIgnoreNextClick) return this._encodingIgnoreNextClick = !1, !0;
        this._app.setColourEncodingType(a);
        return !0
    };
    a.prototype._onEncodingChanged = function(a) {
        this._encodingIgnoreNextClick = !0;
        "PAL" === a ? this._encodingPAL.click() : this._encodingNTSC.click()
    };
    a.prototype._onPauseChange = function(a) {
        this._playButton.toggleIcon(a)
    };
    a.prototype._onTraceRunning = function(a) {
        this._traceRunning = a;
        this._traceButton.highlight(this._traceRunning);
        this._traceButton.toggleIcon(this._traceRunning)
    };
    a.prototype._startTrace = function() {
        this._traceRunning ? this._app.stopTrace() : this._app.startTrace()
    };
    a.prototype._onScreenshotButtonClick = function() {
        this._app.screenshot()
    };
    a.prototype._onCartLoaded = function(a) {
        this._gameGenieButton.highlight(a.areGameGenieCodesAvailable());
        this._onEncodingChanged(a._colourEncodingType)
    };
    a.prototype._onSoundEnabled =
        function(a, c) {
            c ? (this._soundButton.enable(!0), this._soundButton.toggleIcon(!a)) : (this._soundButton.enable(!1), this._soundButton.toggleIcon(!0))
        };
    a.prototype._onSaveButtonClick = function() {
        this._app._saveStateManager.quickSaveState()
    };
    a.prototype._onLoadButtonClick = function() {
        this._app._saveStateManager.showLoadStateDialog()
    };
    a.prototype._getFrameHashButtonClick = function() {
        console.log("{ frame: " + this._app._mainboard.ppu.frameCounter + ', expectedHash: "' + this._app._renderSurface.getRenderBufferHash() +
            '" }')
    };
    a.prototype._onDebugButtonClick = function() {
        this._debugEnabled = !this._debugEnabled;
        this._debugButton.highlight(this._debugEnabled);
        this._debugEnabled ? (this._debugBar.show(), this._app.showFpsMeter(!0)) : (this._debugBar.hide(), this._app.showFpsMeter(!1))
    };
    a.prototype._onPlayOneFrameButtonClick = function() {
        this._app.playOneFrame()
    };
    a.prototype._onResetButtonClick = function() {
        this._app.reset()
    };
    a.prototype._loadRomButtonClick = function() {
        var a = this,
            c = $(document.createElement("input"));
        c.attr("type",
            "file");
        c.on("change", function(c) {
            var e = c.target.files[0];
            c = new FileReader;
            c.onloadend = function(c) {
                c.target.readyState === FileReader.DONE && a._eventBus.invoke("romLoaded", e.name, c.target.result)
            };
            c.readAsArrayBuffer(e)
        });
        c.trigger("click")
    };
    a.prototype._onGameSpeedClick = function() {
        this._gameSpeedSlider.isVisible() ? this._gameSpeedSlider.hide() : this._gameSpeedSlider.show()
    };
    a.prototype._onFrameLimitSet = function(a) {
        this._isLimitOn = a
    };
    a.prototype._onPlayButtonClick = function() {
        this._isPaused = !this._isPaused;
        this._app.pause(this._isPaused)
    };
    a.prototype._onSoundButtonClick = function() {
        this._soundSlider.isVisible() ? this._soundSlider.hide() : this._soundSlider.show()
    };
    a.prototype._onGameGenieButtonClick = function() {
        this._app._mainboard.cart && this._app._ggDialog.show()
    };
    a.prototype._setPosition = function() {
        this._element.position({
            of: $(window),
            my: "bottom",
            at: "bottom"
        })
    };
    Gui.ControlBar = a
})();
this.Gui = this.Gui || {};
(function() {
    var a = null,
        b = function(a) {
            var b = this;
            this._app = a;
            this._contentsDiv = $("#loadStateDialog_contents");
            this._dialog = $("#loadStateDialog").dialog({
                autoOpen: !1,
                height: 400,
                width: 900,
                modal: !0,
                buttons: {
                    Close: function() {
                        b._dialog.dialog("close")
                    }
                },
                close: function() {
                    b._onClose()
                }
            })
        };
    b.prototype._onClose = function() {
        this._app.pause(!1)
    };
    b.prototype.show = function(b, d) {
        a = this;
        for (var e = "", f = Object.keys(d.slots), f = f.sort(function(a, b) {
                return d.slots[b].date - d.slots[a].date
            }), g = 0; g < f.length; ++g) {
            var h = f[g],
                k = d.slots[h],
                e = e + "<div class='loadSaveDiv'>",
                e = e + ("<button type='button' onclick='Gui.loadSaveDialog_onclick( \"" + h + "\" );'>");
            k.screen && (e += "<img src='" + k.screen + "' width='" + SCREEN_WIDTH + "' height='" + SCREEN_HEIGHT + "'/><br/>");
            e += "<span>" + h + "</span><br/>";
            e += "<span>" + (new Date(k.date)).toLocaleString() + "</span>";
            e += "</button>";
            e += "</div>"
        }
        this._contentsDiv[0].innerHTML = e;
        this._app.pause(!0);
        this._dialog.dialog("open")
    };
    Gui.LoadStateDialog = b;
    Gui.loadSaveDialog_onclick = function(b) {
        a && (a._app._saveStateManager.loadState(b),
            a._dialog.dialog("close"))
    }
})();
this.Gui = this.Gui || {};
(function() {
    var a = null,
        b = function(a) {
            var b = this;
            this._app = a;
            this._contentsDiv = $("#gameGenieDialog_contents");
            this._app.connect("cartLoaded", function(a) {
                b._onCartLoaded(a)
            });
            this._dialog = $("#gameGenieDialog").dialog({
                autoOpen: !1,
                title: "Game Genie Codes",
                height: 400,
                width: 900,
                modal: !0,
                buttons: {
                    Close: function() {
                        b._dialog.dialog("close")
                    }
                },
                close: function() {
                    b._onClose()
                }
            })
        };
    b.prototype.show = function() {
        a = this;
        this._app.pause(!0);
        this._dialog.dialog("open")
    };
    b.prototype._onClose = function() {
        this._app.pause(!1)
    };
    b.prototype._onCartLoaded = function(a) {
        var b = "";
        if (a && a._dbData && a._dbData.gameGenieCodes) {
            a = a._dbData.gameGenieCodes;
            for (var e = 0; e < a.length; ++e) var f = a[e],
                g = "gg_cb_" + e,
                b = b + ('<div id="gg_' + e + '">'),
                b = b + ("<input type='checkbox' id='" + g + "' value='" + e + "' onclick='Gui.gameGenieDialog_onclick( " + e + " );'><span>" + f.name + "</span>"),
                b = b + "</div>"
        }
        this._contentsDiv[0].innerHTML = b
    };
    Gui.GameGenieDialog = b;
    Gui.gameGenieDialog_onclick = function(b) {
        if (a) {
            var d = a._app._mainboard.cart._dbData.gameGenieCodes,
                e = $("#gg_cb_" +
                    b)[0].checked;
            b = d[b];
            for (d = 0; d < b.codes[0].length; ++d) Nes.processGameGenieCode(a._app._mainboard, b.codes[0][d], e)
        }
    }
})();
this.Gui = this.Gui || {};
(function() {
    var a = function(a, c) {
        this._mainboard = a;
        this._offscreenElement = document.createElement("canvas");
        this._offscreenElement.width = 64;
        this._offscreenElement.height = 64;
        this._offscreenCanvas = this._offscreenElement.getContext("2d");
        this._offscreenCanvas.imageSmoothingEnabled = !1;
        this._offscreenData = this._offscreenCanvas.getImageData(0, 0, 64, 64);
        this._offscreen32BitView = new Uint32Array(this._offscreenData.data.buffer);
        this._element = document.createElement("canvas");
        this._element.width = 256;
        this._element.height =
            256;
        this._canvas = this._element.getContext("2d");
        this._canvas.imageSmoothingEnabled = !1;
        c.appendChild(this._element);
        this._infoElement = document.createElement("p");
        c.appendChild(this._infoElement);
        this._loadSpriteData()
    };
    a.prototype._loadSpriteData = function() {
        if (this._mainboard.cart) {
            for (var a = this._mainboard.ppu.spriteMemory, c = 0; 64 > c; ++c)
                for (var d = 4 * c, e = a[d + 1], d = a[d + 2], f = 0 < (d & 64), g = 0 < (d & 128), h = 0; 8 > h; ++h)
                    for (var k = 0, k = 0 === (this._mainboard.ppu.control1 & 32) ? 16 * e + ((g ? 7 - h : h) & 7) + (0 < (this._mainboard.ppu.control1 &
                            8) ? 4096 : 0) : 16 * (e & 254) + 4096 * (e & 1), l = this._mainboard.ppu.read8(k), k = this._mainboard.ppu.read8(k + 8), m = (d & 3) << 2, n = 0; 8 > n; ++n) {
                        var p = 128 >> (f ? 7 - n : n),
                            q = 0 < (l & p) ? 1 : 0,
                            q = q | (0 < (k & p) ? 2 : 0);
                        0 < q ? (q |= m, p = this._mainboard.ppu.paletteTables[1][q], p = this._mainboard.renderBuffer.defaultPalette32BitVals[p || 0] || 0) : (p = this._mainboard.ppu.paletteTables[1][0], p = this._mainboard.renderBuffer.defaultPalette32BitVals[p]);
                        this._offscreen32BitView[64 * (c % 8 * 8 + h) + 8 * Math.floor(c / 8) + n] = p
                    }
            this._infoElement.innerHTML = ""
        }
        this._updateCanvas();
        var u = this;
        setTimeout(function() {
            u._loadSpriteData()
        }, 1E3)
    };
    a.prototype._updateCanvas = function() {
        this._offscreenCanvas.putImageData(this._offscreenData, 0, 0);
        this._canvas.drawImage(this._offscreenElement, 0, 0, this._element.clientWidth, this._element.clientHeight)
    };
    Gui.SpriteDisplayWindow = a
})();
this.Gui = this.Gui || {};
(function() {
    var a = function(a, c) {
        this._mainboard = a;
        this._offscreenElement = document.createElement("canvas");
        this._offscreenElement.width = 16;
        this._offscreenElement.height = 2;
        this._offscreenCanvas = this._offscreenElement.getContext("2d");
        this._offscreenCanvas.imageSmoothingEnabled = !1;
        this._offscreenData = this._offscreenCanvas.getImageData(0, 0, 16, 2);
        this._offscreen32BitView = new Uint32Array(this._offscreenData.data.buffer);
        this._element = document.createElement("canvas");
        this._element.width = 480;
        this._element.height =
            60;
        this._canvas = this._element.getContext("2d");
        this._canvas.imageSmoothingEnabled = !1;
        c.appendChild(this._element);
        this._infoElement = document.createElement("p");
        c.appendChild(this._infoElement);
        this._loadPaletteData()
    };
    a.prototype._loadPaletteData = function() {
        if (this._mainboard.cart) {
            for (var a = 0; 32 > a; ++a) this._offscreen32BitView[a] = this._mainboard.renderBuffer.defaultPalette32BitVals[this._mainboard.ppu.paletteTables[Math.floor(a / 16)][a % 16] || 0] || 0;
            this._infoElement.innerHTML = ""
        }
        this._updateCanvas();
        var c = this;
        setTimeout(function() {
            c._loadPaletteData()
        }, 1E3)
    };
    a.prototype._updateCanvas = function() {
        this._offscreenCanvas.putImageData(this._offscreenData, 0, 0);
        this._canvas.drawImage(this._offscreenElement, 0, 0, this._element.clientWidth, this._element.clientHeight)
    };
    Gui.PaletteDisplayWindow = a
})();
this.Nes = this.Nes || {};
(function() {})();
this.Gui = this.Gui || {};
(function() {
    var a = "   CANCEL   HELP  BACK_SPACE TAB   CLEAR ENTER RETURN  SHIFT CONTROL ALT PAUSE CAPS_LOCK KANA EISU JUNJA FINAL HANJA  ESCAPE CONVERT NONCONVERT ACCEPT MODECHANGE SPACE PAGE_UP PAGE_DOWN END HOME LEFT UP RIGHT DOWN SELECT PRINT EXECUTE PRINTSCREEN INSERT DELETE  0 1 2 3 4 5 6 7 8 9 COLON SEMICOLON LESS_THAN EQUALS GREATER_THAN QUESTION_MARK AT A B C D E F G H I J K L M N O P Q R S T U V W X Y Z WIN  CONTEXT_MENU  SLEEP NUMPAD0 NUMPAD1 NUMPAD2 NUMPAD3 NUMPAD4 NUMPAD5 NUMPAD6 NUMPAD7 NUMPAD8 NUMPAD9 MULTIPLY ADD SEPARATOR SUBTRACT DECIMAL DIVIDE F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12 F13 F14 F15 F16 F17 F18 F19 F20 F21 F22 F23 F24         NUM_LOCK SCROLL_LOCK WIN_OEM_FJ_JISHO WIN_OEM_FJ_MASSHOU WIN_OEM_FJ_TOUROKU WIN_OEM_FJ_LOYA WIN_OEM_FJ_ROYA          CIRCUMFLEX EXCLAMATION DOUBLE_QUOTE HASH DOLLAR PERCENT AMPERSAND UNDERSCORE OPEN_PAREN CLOSE_PAREN ASTERISK PLUS PIPE HYPHEN_MINUS OPEN_CURLY_BRACKET CLOSE_CURLY_BRACKET TILDE     VOLUME_MUTE VOLUME_DOWN VOLUME_UP   SEMICOLON EQUALS COMMA MINUS PERIOD SLASH BACK_QUOTE                           OPEN_BRACKET BACK_SLASH CLOSE_BRACKET QUOTE  META ALTGR  WIN_ICO_HELP WIN_ICO_00  WIN_ICO_CLEAR   WIN_OEM_RESET WIN_OEM_JUMP WIN_OEM_PA1 WIN_OEM_PA2 WIN_OEM_PA3 WIN_OEM_WSCTRL WIN_OEM_CUSEL WIN_OEM_ATTN WIN_OEM_FINISH WIN_OEM_COPY WIN_OEM_AUTO WIN_OEM_ENLW WIN_OEM_BACKTAB ATTN CRSEL EXSEL EREOF PLAY ZOOM  PA1 WIN_OEM_CLEAR ".split(" "),
        b =
        null,
        c = function(a) {
            var b = this;
            this._app = a;
            this._keysAssigned = [];
            this._waitingPress = !1;
            this._waitingPlayerId = 0;
            this._waitingPressKey = "";
            this._contentsDiv = $("#keyboardRemapperDialog_contents");
            this._existingKeysContents = $("#keyboardRemapperSetKeyDialog_existingKeysContents");
            this._dialog = $("#keyboardRemapperDialog").dialog({
                autoOpen: !1,
                title: "Control mapping",
                height: 450,
                width: 325,
                modal: !0,
                buttons: {
                    Close: function() {
                        b._dialog.dialog("close")
                    }
                },
                close: function() {
                    b._onClose()
                }
            });
            this._setKeyDialog = $("#keyboardRemapperSetKeyDialog").dialog({
                dialogClass: "no-close",
                draggable: !1,
                autoOpen: !1,
                height: 200,
                minHeight: 200,
                width: 400,
                minWidth: 400,
                modal: !0,
                resizable: !1,
                buttons: {
                    OK: function() {
                        b._onKeySetApplyClick()
                    },
                    Close: function() {
                        b._setKeyDialog.dialog("close")
                    }
                },
                close: function() {
                    b._waitingPress = !1
                }
            });
            this._setKeyDialogContents = $("#keyboardRemapperSetKeyDialog_contents");
            $(".keyboardMap").maphilight();
            window.addEventListener("keydown", function(a) {
                b._onDocumentKeypress(a, !0)
            }, !1);
            window.addEventListener("keyup", function(a) {
                b._onDocumentKeypress(a, !1)
            }, !1)
        };
    c.prototype._keyArrayToHtml =
        function(b) {
            b = b.map(function(b) {
                b = b < a.length ? a[b] : "";
                return b
            }).join(" ");
            0 === b.length && (b = "&lt;NONE&gt;");
            return b
        };
    c.prototype._onDocumentKeypress = function(a, b) {
        if (this._waitingPress && b) {
            var c = Number(a.keyCode);
            0 > this._keysAssigned.indexOf(c) && (this._keysAssigned.push(c), this._setKeyDialogContents[0].innerHTML = "<p>New keys: " + this._keyArrayToHtml(this._keysAssigned) + "</p>")
        }
    };
    c.prototype._keyCodeToString = function(a) {
        return a.toString()
    };
    c.prototype.show = function() {
        b = this;
        this._app.pause(!0);
        this._dialog.dialog("open")
    };
    c.prototype._onClose = function() {
        this._app.pause(!1)
    };
    c.prototype._onSetKeyClick = function(a, b) {
        var c = JOYPAD_NAME_TO_ID(b);
        this._waitingPressKey = c;
        this._waitingPress = !0;
        this._waitingPlayerId = a;
        this._keysAssigned.length = 0;
        this._setKeyDialogContents[0].innerHTML = "<p>New keys:</p>";
        c = this._app._input.getKeyBindings(a, c);
        this._existingKeysContents[0].innerHTML = "<p>Current keys: " + this._keyArrayToHtml(c) + "</p>";
        this._setKeyDialog.dialog("option", "title", "Player " + (a + 1) + ": Press keys to assign to " + b);
        this._setKeyDialog.dialog("open")
    };
    c.prototype._onKeySetApplyClick = function() {
        this._app._input.saveKeyBindings(this._waitingPlayerId, this._waitingPressKey, this._keysAssigned);
        this._setKeyDialog.dialog("close")
    };
    Gui.KeyboardRemapper = c;
    Gui.keyboardRemapperDialog_onsetkeyclick = function(a, c) {
        b._onSetKeyClick(a, c)
    }
})();
this.Nes = this.Nes || {};
"use strict";
var PPU_TICKS_PER_SCANLINE = 341,
    MASTER_CYCLES_PER_PPU = 5,
    MASTER_CYCLES_PER_SCANLINE = PPU_TICKS_PER_SCANLINE * MASTER_CYCLES_PER_PPU,
    CPU_RESET_ADDRESS = 65532,
    CPU_IRQ_ADDRESS = 65534,
    CPU_NMI_ADDRESS = 65530,
    SCREEN_WIDTH = 256,
    SCREEN_HEIGHT = 240,
    IS_INT_BETWEEN = function(a, b, c) {
        return b <= a && a < c
    },
    ZERO_PAD = function(a, b, c) {
        a += "";
        return a.length >= b ? a : Array(b - a.length + 1).join(c || "0") + a
    },
    ZERO_PAD_HEX = function(a, b, c) {
        return ZERO_PAD(a.toString(16), b, c)
    },
    g_DefaultColourEncoding = "NTSC",
    COLOUR_ENCODING_NAME = "",
    COLOUR_ENCODING_REFRESHRATE =
    0,
    COLOUR_ENCODING_MTC_PER_CPU = 0,
    COLOUR_ENCODING_VBLANK_SCANLINES = 0,
    COLOUR_ENCODING_FRAME_SCANLINES = 0,
    COLOUR_ENCODING_VBLANK_MTC = 0,
    COLOUR_ENCODING_FRAME_MTC = 0,
    setColourEncodingType = function(a) {
        "PAL" === a ? (COLOUR_ENCODING_NAME = "PAL", COLOUR_ENCODING_REFRESHRATE = 50, COLOUR_ENCODING_MTC_PER_CPU = 16, COLOUR_ENCODING_VBLANK_SCANLINES = 70, COLOUR_ENCODING_FRAME_SCANLINES = 312) : (COLOUR_ENCODING_NAME = "NTSC", COLOUR_ENCODING_REFRESHRATE = 60.1, COLOUR_ENCODING_MTC_PER_CPU = 15, COLOUR_ENCODING_VBLANK_SCANLINES = 20, COLOUR_ENCODING_FRAME_SCANLINES =
            262);
        COLOUR_ENCODING_VBLANK_MTC = COLOUR_ENCODING_VBLANK_SCANLINES * MASTER_CYCLES_PER_SCANLINE;
        COLOUR_ENCODING_FRAME_MTC = COLOUR_ENCODING_FRAME_SCANLINES * MASTER_CYCLES_PER_SCANLINE
    };
setColourEncodingType(g_DefaultColourEncoding);
var PPU_MIRRORING_HORIZONTAL = 0,
    PPU_MIRRORING_VERTICAL = 1,
    PPU_MIRRORING_FOURSCREEN = 2,
    PPU_MIRRORING_SINGLESCREEN_NT0 = 3,
    PPU_MIRRORING_SINGLESCREEN_NT1 = 4;
Nes.mirroringMethodToString = function(a) {
    switch (a) {
        case PPU_MIRRORING_HORIZONTAL:
            return "horizontal";
        case PPU_MIRRORING_VERTICAL:
            return "vertical";
        case PPU_MIRRORING_FOURSCREEN:
            return "fourscreen";
        case PPU_MIRRORING_SINGLESCREEN_NT0:
            return "singlescreen 0";
        case PPU_MIRRORING_SINGLESCREEN_NT1:
            return "singlescreen 1"
    }
    return ""
};
var JOYPAD_A = 0,
    JOYPAD_B = 1,
    JOYPAD_SELECT = 2,
    JOYPAD_START = 3,
    JOYPAD_UP = 4,
    JOYPAD_DOWN = 5,
    JOYPAD_LEFT = 6,
    JOYPAD_RIGHT = 7,
    JOYPAD_NAME_TO_ID = function(a) {
        if ("UP" === a) return JOYPAD_UP;
        if ("DOWN" === a) return JOYPAD_DOWN;
        if ("LEFT" === a) return JOYPAD_LEFT;
        if ("RIGHT" === a) return JOYPAD_RIGHT;
        if ("A" === a) return JOYPAD_A;
        if ("B" === a) return JOYPAD_B;
        if ("SELECT" === a) return JOYPAD_SELECT;
        if ("START" === a) return JOYPAD_START;
        throw Error("JOYPAD_NAME_TO_ID: Invalid parameter");
    },
    JOYPAD_ID_TO_NAME = function(a) {
        if (a === JOYPAD_UP) return "UP";
        if (a === JOYPAD_DOWN) return "DOWN";
        if (a === JOYPAD_LEFT) return "LEFT";
        if (a === JOYPAD_RIGHT) return "RIGHT";
        if (a === JOYPAD_A) return "A";
        if (a === JOYPAD_B) return "B";
        if (a === JOYPAD_SELECT) return "SELECT";
        if (a === JOYPAD_START) return "START";
        throw Error("JOYPAD_ID_TO_NAME: Invalid parameter " + a);
    };
this.Nes = this.Nes || {};
"use strict";
var syncEvent = function(a, b, c) {
        this.name = a;
        this.tickCount = b;
        this.callback = c
    },
    synchroniser = function(a) {
        var b = this;
        this.mainboard = a;
        this.mainboard.connect("reset", function(a) {
            b.reset(a)
        });
        this.cpu = a.cpu;
        this._lastSynchronisedMtc = this.cpuMtc = 0;
        this._newEventInserted = this._isSynchronising = !1;
        this._eventBus = new Nes.EventBus;
        this._cpuMTCatEndOfInstruction = new Int32Array(8);
        this._cpuMTCatEndOfInstructionIndex = 0;
        this._events = [];
        this._objects = []
    };
synchroniser.prototype.reset = function(a) {
    this._cpuMTCatEndOfInstructionIndex = this._lastSynchronisedMtc = this.cpuMtc = 0;
    this._newEventInserted = this._isSynchronising = !1
};
synchroniser.prototype.connect = function(a, b) {
    this._eventBus.connect(a, b)
};
synchroniser.prototype.changeEventTime = function(a, b) {
    var c = this._getEvent(a);
    c.tickCount = b;
    this._executeCallbackIfSynchronising(c);
    this._newEventInserted = !0
};
synchroniser.prototype._removeEvent = function(a) {
    for (var b = 0; b < this._events.length; ++b)
        if (this._events[b].name === a) return this._events.splice(b, 1)[0];
    return null
};
synchroniser.prototype._getEvent = function(a) {
    return this._events[a]
};
synchroniser.prototype.addEvent = function(a, b, c) {
    this._removeEvent(a);
    a = new syncEvent(a, b, c);
    this._executeCallbackIfSynchronising(a);
    this._events.push(a);
    this._newEventInserted = !0;
    return this._events.length - 1
};
synchroniser.prototype._executeCallbackIfSynchronising = function(a) {
    this._isSynchronising && 0 <= a.tickCount && this._lastSynchronisedMtc < a.tickCount && this._currentSyncValue >= a.tickCount && a.callback(a.tickCount)
};
synchroniser.prototype.addObject = function(a, b) {
    this._objects.push({
        name: a,
        object: b,
        lastSynchronisedTickCount: 0
    })
};
synchroniser.prototype.synchronise = function() {
    var a = COLOUR_ENCODING_FRAME_MTC;
    if (this._isSynchronising) throw Error("Cannot call synchroniser.prototype.synchronise when in synchronisation phase");
    for (var b = this.getCpuMTC(), c = 0, d = !0; d;) {
        c = this.getNextEventTime();
        c <= b && c < a ? b = c : (d = !1, b = Math.min(b, a));
        if (this._lastSynchronisedMtc >= b) break;
        this._isSynchronising = !0;
        this._currentSyncValue = b;
        for (c = 0; c < this._objects.length; ++c) {
            var e = this._objects[c];
            e.lastSynchronisedTickCount < b && (e.object.synchronise(e.lastSynchronisedTickCount,
                b), e.lastSynchronisedTickCount = b)
        }
        this._isSynchronising = !1;
        this._executeEvents(this._lastSynchronisedMtc, b);
        this._lastSynchronisedMtc = b;
        if (b >= a) {
            for (c = 0; c < this._objects.length; ++c) this._objects[c].object.onEndFrame(b), this._objects[c].lastSynchronisedTickCount = 0;
            this.cpuMtc -= a;
            this._lastSynchronisedMtc = 0;
            this._eventBus.invoke("frameEnd")
        }
    }
};
synchroniser.prototype.getNextEventTime = function(a) {
    var b = COLOUR_ENCODING_FRAME_MTC;
    a = a || this._lastSynchronisedMtc;
    for (var c = null, d = 0; d < this._events.length; ++d) {
        var e = this._events[d];
        0 <= e.tickCount && e.tickCount > a && (null === c || e.tickCount < c.tickCount) && (c = e)
    }
    return null !== c ? c.tickCount : b
};
synchroniser.prototype._executeEvents = function(a, b) {
    for (var c = 0; c < this._events.length; ++c) {
        var d = this._events[c];
        0 <= d.tickCount && d.tickCount > a && d.tickCount <= b && d.callback(d.tickCount)
    }
};
synchroniser.prototype.runCycle = function() {
    for (var a = this.getNextEventTime(); this.cpuMtc < a;) {
        var b = this.cpu.handlePendingInterrupts();
        0 === b && (b = this.cpu.execute());
        this.mainboard.ppu.handleSpriteTransfer();
        this.cpuMtc += b * COLOUR_ENCODING_MTC_PER_CPU;
        this._cpuMTCatEndOfInstruction[this._cpuMTCatEndOfInstructionIndex] = this.cpuMtc;
        this._cpuMTCatEndOfInstructionIndex = this._cpuMTCatEndOfInstructionIndex + 1 & 7;
        this._newEventInserted && (this._newEventInserted = !1, a = this.getNextEventTime())
    }
    this.synchronise(this.cpuMtc)
};
synchroniser.prototype.isPpuTickOnLastCycleOfCpuInstruction = function(a) {
    for (var b = 0; b < this._cpuMTCatEndOfInstruction.length; ++b) {
        var c = this._cpuMTCatEndOfInstruction[b];
        if (c - COLOUR_ENCODING_MTC_PER_CPU <= a && c + MASTER_CYCLES_PER_PPU >= a) return !0
    }
    return !1
};
synchroniser.prototype.advanceCpuMTC = function(a) {
    this.cpuMtc += a
};
synchroniser.prototype.getCpuMTC = function() {
    return this.cpuMtc + this.cpu.getSubCycle() * COLOUR_ENCODING_MTC_PER_CPU | 0
};
synchroniser.prototype.saveState = function() {
    var a = {};
    a.cpuMtc = this.cpuMtc;
    a._lastSynchronisedMtc = this._lastSynchronisedMtc;
    return a
};
synchroniser.prototype.loadState = function(a) {
    this.cpuMtc = a.cpuMtc;
    this._lastSynchronisedMtc = a._lastSynchronisedMtc
};
Nes.synchroniser = synchroniser;
this.Nes = this.Nes || {};
"use strict";
var joypad = function() {
    this._readCount = this._strobeByte = this._strobedState = this._currentState = 0
};
joypad.prototype.writeToRegister = function(a, b) {
    var c = b & 1;
    if (1 === this._strobeByte || 1 === c) this._strobeByte = c | 0, this._strobedState = this._currentState, this._readCount = 0
};
joypad.prototype.readFromRegister = function(a) {
    a = 0;
    1 === this._strobeByte ? (this._strobedState = this._currentState, this._readCount = 0, a = this._strobedState & 1 | 0) : (a = this._strobedState >> this._readCount & 1 | 0, this._readCount++, a |= 64);
    return a | 0
};
joypad.prototype._getDuplicateMask = function(a) {
    switch (a) {
        case 4:
            return 223;
        case 5:
            return 239;
        case 6:
            return 127;
        case 7:
            return 191
    }
    return 255
};
joypad.prototype.pressButton = function(a, b) {
    b ? (this._currentState |= 1 << a, this._currentState &= this._getDuplicateMask(a)) : this._currentState &= 255 ^ 1 << a
};
joypad.prototype.saveState = function() {
    var a = {};
    a._currentState = this._currentState;
    a._strobedState = this._strobedState;
    a._strobeByte = this._strobeByte;
    a._readCount = this._readCount;
    return a
};
joypad.prototype.loadState = function(a) {
    this._currentState = a._currentState;
    this._strobedState = a._strobedState;
    this._readCount = a._readCount;
    this._strobeByte = a._strobeByte
};
Nes.joypad = joypad;
var inputdevicebus = function() {
    this.j1 = new Nes.joypad;
    this.j2 = new Nes.joypad
};
inputdevicebus.prototype.getJoypad = function(a) {
    switch (a) {
        case 0:
            return this.j1;
        case 1:
            return this.j2;
        default:
            return null
    }
};
inputdevicebus.prototype.writeToRegister = function(a, b) {
    switch (a) {
        case 16406:
            this.j1.writeToRegister(a, b);
            break;
        case 16407:
            this.j2.writeToRegister(a, b)
    }
};
inputdevicebus.prototype.readFromRegister = function(a) {
    var b = 0;
    switch (a) {
        case 16406:
            b = this.j1.readFromRegister(a) | 0;
            break;
        case 16407:
            b = this.j2.readFromRegister(a) | 0
    }
    return b
};
Nes.inputdevicebus = inputdevicebus;
this.Nes = this.Nes || {};
"use strict";
var gppu, gmapper, ginput, gapu, memory = function(a) {
    var b = this;
    this.mainboard = a;
    this.mainboard.connect("reset", function(a) {
        b.reset(a)
    });
    this.ramPage = new Int32Array(2048)
};
memory.prototype.reset = function(a) {
    if (a) {
        for (a = 0; a < this.ramPage.length; ++a) this.ramPage[a] = 255;
        this.ramPage[8] = 247;
        this.ramPage[9] = 239;
        this.ramPage[10] = 223;
        this.ramPage[15] = 191
    }
    gppu = window.ppu;
    gmapper = this.mainboard.cart.memoryMapper;
    ginput = this.mainboard.inputdevicebus;
    gapu = this.mainboard.apu
};
memory.prototype.read8 = function(a) {
    return this._properRead8(a & 65535) & 255
};
memory.prototype._readRegister4000 = function(a) {
    return 0 === (a & 8160) ? 16406 === a || 16407 === a ? ginput.readFromRegister(a) : 0 : gmapper.read8EXRam(a)
};
memory.prototype._properRead8 = function(a) {
    var b = a & 7,
        c = a & 2047;
    switch (a & 57344) {
        case 0:
            return this.ramPage[c];
        case 8192:
            return gppu.readFromRegister(b);
        case 16384:
            return this._readRegister4000(a);
        case 24576:
            return gmapper.read8SRam(a);
        default:
            return gmapper.read8PrgRom(a)
    }
};
memory.prototype.read16NoZeroPageWrap = function(a) {
    return this.read8(a) | this.read8(a + 1) << 8
};
memory.prototype.write8 = function(a, b) {
    switch (a & 57344) {
        case 0:
            this.ramPage[a & 2047] = b;
            break;
        case 8192:
            this.mainboard.ppu.writeToRegister(a & 7, b);
            break;
        case 16384:
            if (0 === (a & 8160)) {
                switch (a) {
                    case 16404:
                        this.mainboard.ppu.writeToSpriteDMARegister(b);
                        break;
                    case 16406:
                    case 16407:
                        this.mainboard.inputdevicebus.writeToRegister(a, b)
                }
                this.mainboard.apu.writeToRegister(a, b)
            } else this.mainboard.cart.memoryMapper.write8EXRam(a, b);
            break;
        case 24576:
            this.mainboard.cart.memoryMapper.write8SRam(a, b);
            break;
        default:
        case 32768:
            this.mainboard.cart.memoryMapper.write8PrgRom(a,
                b)
    }
};
memory.prototype.saveState = function() {
    return {
        ramPage: Nes.uintArrayToString(this.ramPage)
    }
};
memory.prototype.loadState = function(a) {
    this.ramPage = Nes.stringToUintArray(a.ramPage)
};
Nes.memory = memory;
this.Nes = this.Nes || {};
"use strict";
var instructions = [];

function BRK_NONE_0(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.read8(a.getPC());
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.write8(256 + a.regS, a.getPC() >> 8 & 255);
    0 === a.regS ? a.regS = 255 : a.regS--;
    a.incrementSubcycle();
    b.write8(256 + a.regS, a.programCounter & 255);
    0 === a.regS ? a.regS = 255 : a.regS--;
    a.incrementSubcycle();
    b.write8(256 + a.regS, (a.statusRegToByte() | 48) & 255);
    0 === a.regS ? a.regS = 255 : a.regS--;
    a.setPC(a.read16FromMemNoWrap(CPU_IRQ_ADDRESS));
    a.setInterrupt(!0);
    return 7
}
instructions[0] = BRK_NONE_0;

function ORA_INDIRECTX_1(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regA |= c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 6
}
instructions[1] = ORA_INDIRECTX_1;

function HLT_NONE_2(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions[2] = HLT_NONE_2;

function ASO_INDIRECTX_3(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    a.setCarry(0 < (d & 128));
    d = d << 1 & 255;
    a.regA |= d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 8
}
instructions[3] = ASO_INDIRECTX_3;

function SKB_ZEROPAGE_4(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    b.read8(c);
    return 3
}
instructions[4] = SKB_ZEROPAGE_4;

function ORA_ZEROPAGE_5(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regA |= c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 3
}
instructions[5] = ORA_ZEROPAGE_5;

function ASL_ZEROPAGE_6(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    a.setCarry(0 < (d & 128));
    d = (d & 255) << 1 & 255;
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions[6] = ASL_ZEROPAGE_6;

function ASO_ZEROPAGE_7(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    a.setCarry(0 < (d & 128));
    d = d << 1 & 255;
    a.regA |= d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions[7] = ASO_ZEROPAGE_7;

function PHP_NONE_8(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.write8(256 + a.regS, (a.statusRegToByte() | 16) & 255);
    0 === a.regS ? a.regS = 255 : a.regS--;
    return 3
}
instructions[8] = PHP_NONE_8;

function ORA_IMMEDIATE_9(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.regA |= c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 2
}
instructions[9] = ORA_IMMEDIATE_9;

function ASL_ACCUMULATOR_10(a, b) {
    var c = a.regA;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.setCarry(0 < (c & 128));
    c = (c & 255) << 1 & 255;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.regA = c & 255;
    return 2
}
instructions[10] = ASL_ACCUMULATOR_10;

function ANC_IMMEDIATE_11(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.regA &= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.setCarry(a.getSign());
    return 2
}
instructions[11] = ANC_IMMEDIATE_11;

function SKW_ABSOLUTE_12(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    b.read8(c);
    return 4
}
instructions[12] = SKW_ABSOLUTE_12;

function ORA_ABSOLUTE_13(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regA |= c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions[13] = ORA_ABSOLUTE_13;

function ASL_ABSOLUTE_14(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    a.setCarry(0 < (d & 128));
    d = (d & 255) << 1 & 255;
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions[14] = ASL_ABSOLUTE_14;

function ASO_ABSOLUTE_15(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    a.setCarry(0 < (d & 128));
    d = d << 1 & 255;
    a.regA |= d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions[15] = ASO_ABSOLUTE_15;

function BPL_RELATIVE_16(a, b) {
    var c = 2,
        d = b.read8(a.getPC() + 1 & 65535),
        d = a.calculateRelativeDifference(a.getPC() | 0, d | 0);
    a.getSign() ? (a.incrementSubcycle(), b.read8(a.getPC() + 1 & 65535), a.setPC(a.getPC() + 2 & 65535)) : (a.incrementSubcycle(), (a.getPC() + 2 & 65280) !== (d + 2 & 65280) && (c += 1, a.incrementSubcycle()), c += 1, a.incrementSubcycle(), a.setPC(d + 2 & 65535));
    return c
}
instructions[16] = BPL_RELATIVE_16;

function ORA_INDIRECTY_17(a, b) {
    var c = 5;
    a.incrementSubcycle();
    var d = b.read8(a.getPC() + 1 & 65535),
        d = a.read16FromMemWithWrap(d),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    a.regA |= d & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions[17] = ORA_INDIRECTY_17;

function HLT_NONE_18(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions[18] = HLT_NONE_18;

function ASO_INDIRECTY_19(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        c = a.read16FromMemWithWrap(c),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    a.setCarry(0 < (c & 128));
    c = c << 1 & 255;
    a.regA |= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 8
}
instructions[19] = ASO_INDIRECTY_19;

function SKB_ZEROPAGEX_20(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    b.read8(d);
    return 4
}
instructions[20] = SKB_ZEROPAGEX_20;

function ORA_ZEROPAGEX_21(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.regA |= c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions[21] = ORA_ZEROPAGEX_21;

function ASL_ZEROPAGEX_22(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    a.setCarry(0 < (c & 128));
    c = (c & 255) << 1 & 255;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions[22] = ASL_ZEROPAGEX_22;

function ASO_ZEROPAGEX_23(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    a.setCarry(0 < (c & 128));
    c = c << 1 & 255;
    a.regA |= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions[23] = ASO_ZEROPAGEX_23;

function CLC_NONE_24(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.setCarry(!1);
    return 2
}
instructions[24] = CLC_NONE_24;

function ORA_ABSOLUTEY_25(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    a.regA |= d & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions[25] = ORA_ABSOLUTEY_25;

function NOP_NONE_26(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    return 2
}
instructions[26] = NOP_NONE_26;

function ASO_ABSOLUTEY_27(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    a.setCarry(0 < (c & 128));
    c = c << 1 & 255;
    a.regA |= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions[27] = ASO_ABSOLUTEY_27;

function SKW_ABSOLUTEX_28(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    b.read8(e);
    return c
}
instructions[28] = SKW_ABSOLUTEX_28;

function ORA_ABSOLUTEX_29(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    a.regA |= d & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions[29] = ORA_ABSOLUTEX_29;

function ASL_ABSOLUTEX_30(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    a.setCarry(0 < (c & 128));
    c = (c & 255) << 1 & 255;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions[30] = ASL_ABSOLUTEX_30;

function ASO_ABSOLUTEX_31(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    a.setCarry(0 < (c & 128));
    c = c << 1 & 255;
    a.regA |= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions[31] = ASO_ABSOLUTEX_31;

function JSR_IMMEDIATE16_32(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    var d = a.getPC() - 1;
    0 > d && (d = 65535);
    a.incrementSubcycle();
    b.write8(256 + a.regS, d >> 8 & 255);
    0 === a.regS ? a.regS = 255 : a.regS--;
    a.incrementSubcycle();
    b.write8(256 + a.regS, d & 255);
    0 === a.regS ? a.regS = 255 : a.regS--;
    a.incrementSubcycle();
    a.setPC(c & 65535);
    return 6
}
instructions[32] = JSR_IMMEDIATE16_32;

function AND_INDIRECTX_33(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regA = a.regA & c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 6
}
instructions[33] = AND_INDIRECTX_33;

function HLT_NONE_34(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions[34] = HLT_NONE_34;

function RLA_INDIRECTX_35(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    d = d << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    d &= 255;
    a.regA &= d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 8
}
instructions[35] = RLA_INDIRECTX_35;

function BIT_ZEROPAGE_36(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    8194 === (c & 57351) && a.mainboard.ppu.bitOperationHappening();
    a.incrementSubcycle();
    c = b.read8(c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (a.regA & c & 255));
    a.setOverflow(0 < (c & 64));
    return 3
}
instructions[36] = BIT_ZEROPAGE_36;

function AND_ZEROPAGE_37(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regA = a.regA & c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 3
}
instructions[37] = AND_ZEROPAGE_37;

function ROL_ZEROPAGE_38(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    d = (d & 255) << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    d &= 255;
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions[38] = ROL_ZEROPAGE_38;

function RLA_ZEROPAGE_39(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    d = d << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    d &= 255;
    a.regA &= d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions[39] = RLA_ZEROPAGE_39;

function PLP_NONE_40(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.waitOneInstructionAfterCli = !0 === a.getInterrupt();
    a.incrementSubcycle();
    b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    255 === a.regS ? a.regS = 0 : a.regS++;
    a.incrementSubcycle();
    var c = b.read8(256 + a.regS);
    a.statusRegFromByte(c);
    a.setBreak(!0);
    a.setUnused(!0);
    a.waitOneInstructionAfterCli && (a.waitOneInstructionAfterCli = !1 === a.getInterrupt());
    return 4
}
instructions[40] = PLP_NONE_40;

function AND_IMMEDIATE_41(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.regA = a.regA & c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 2
}
instructions[41] = AND_IMMEDIATE_41;

function ROL_ACCUMULATOR_42(a, b) {
    var c = a.regA;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    c = (c & 255) << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < c);
    c &= 255;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.regA = c & 255;
    return 2
}
instructions[42] = ROL_ACCUMULATOR_42;

function ANC_IMMEDIATE_43(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.regA &= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.setCarry(a.getSign());
    return 2
}
instructions[43] = ANC_IMMEDIATE_43;

function BIT_ABSOLUTE_44(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    8194 === (c & 57351) && a.mainboard.ppu.bitOperationHappening();
    a.incrementSubcycle();
    c = b.read8(c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (a.regA & c & 255));
    a.setOverflow(0 < (c & 64));
    return 4
}
instructions[44] = BIT_ABSOLUTE_44;

function AND_ABSOLUTE_45(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regA = a.regA & c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions[45] = AND_ABSOLUTE_45;

function ROL_ABSOLUTE_46(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    d = (d & 255) << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    d &= 255;
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions[46] = ROL_ABSOLUTE_46;

function RLA_ABSOLUTE_47(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    d = d << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    d &= 255;
    a.regA &= d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions[47] = RLA_ABSOLUTE_47;

function BMI_RELATIVE_48(a, b) {
    var c = 2,
        d = b.read8(a.getPC() + 1 & 65535),
        d = a.calculateRelativeDifference(a.getPC() | 0, d | 0);
    a.getSign() ? (a.incrementSubcycle(), (a.getPC() + 2 & 65280) !== (d + 2 & 65280) && (c += 1, a.incrementSubcycle()), c += 1, a.incrementSubcycle(), a.setPC(d + 2 & 65535)) : (a.incrementSubcycle(), b.read8(a.getPC() + 1 & 65535), a.setPC(a.getPC() + 2 & 65535));
    return c
}
instructions[48] = BMI_RELATIVE_48;

function AND_INDIRECTY_49(a, b) {
    var c = 5;
    a.incrementSubcycle();
    var d = b.read8(a.getPC() + 1 & 65535),
        d = a.read16FromMemWithWrap(d),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    a.regA = a.regA & d & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions[49] = AND_INDIRECTY_49;

function HLT_NONE_50(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions[50] = HLT_NONE_50;

function RLA_INDIRECTY_51(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        c = a.read16FromMemWithWrap(c),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c = c << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < c);
    c &= 255;
    a.regA &= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 8
}
instructions[51] = RLA_INDIRECTY_51;

function SKB_ZEROPAGEX_52(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    b.read8(d);
    return 4
}
instructions[52] = SKB_ZEROPAGEX_52;

function AND_ZEROPAGEX_53(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.regA = a.regA & c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions[53] = AND_ZEROPAGEX_53;

function ROL_ZEROPAGEX_54(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c = (c & 255) << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < c);
    c &= 255;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions[54] = ROL_ZEROPAGEX_54;

function RLA_ZEROPAGEX_55(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c = c << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < c);
    c &= 255;
    a.regA &= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions[55] = RLA_ZEROPAGEX_55;

function SEC_NONE_56(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.setCarry(!0);
    return 2
}
instructions[56] = SEC_NONE_56;

function AND_ABSOLUTEY_57(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    a.regA = a.regA & d & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions[57] = AND_ABSOLUTEY_57;

function NOP_NONE_58(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    return 2
}
instructions[58] = NOP_NONE_58;

function RLA_ABSOLUTEY_59(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c = c << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < c);
    c &= 255;
    a.regA &= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions[59] = RLA_ABSOLUTEY_59;

function SKW_ABSOLUTEX_60(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    b.read8(e);
    return c
}
instructions[60] = SKW_ABSOLUTEX_60;

function AND_ABSOLUTEX_61(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    a.regA = a.regA & d & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions[61] = AND_ABSOLUTEX_61;

function ROL_ABSOLUTEX_62(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c = (c & 255) << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < c);
    c &= 255;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions[62] = ROL_ABSOLUTEX_62;

function RLA_ABSOLUTEX_63(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c = c << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < c);
    c &= 255;
    a.regA &= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions[63] = RLA_ABSOLUTEX_63;

function RTI_NONE_64(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.read8(a.getPC());
    a.incrementSubcycle();
    255 === a.regS ? a.regS = 0 : a.regS++;
    a.incrementSubcycle();
    var c = b.read8(256 + a.regS);
    a.statusRegFromByte(c);
    255 === a.regS ? a.regS = 0 : a.regS++;
    a.incrementSubcycle();
    a.programCounter = b.read8(256 + a.regS);
    255 === a.regS ? a.regS = 0 : a.regS++;
    a.incrementSubcycle();
    c = b.read8(256 + a.regS);
    a.programCounter |= (c & 255) << 8;
    a.setBreak(!0);
    a.setUnused(!0);
    return 6
}
instructions[64] = RTI_NONE_64;

function EOR_INDIRECTX_65(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regA = (a.regA ^ c & 255) & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 6
}
instructions[65] = EOR_INDIRECTX_65;

function HLT_NONE_66(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions[66] = HLT_NONE_66;

function LSE_INDIRECTX_67(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    a.setCarry(0 < (d & 1));
    d = d >> 1 & 255;
    a.regA ^= d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 8
}
instructions[67] = LSE_INDIRECTX_67;

function SKB_ZEROPAGE_68(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    b.read8(c);
    return 3
}
instructions[68] = SKB_ZEROPAGE_68;

function EOR_ZEROPAGE_69(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regA = (a.regA ^ c & 255) & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 3
}
instructions[69] = EOR_ZEROPAGE_69;

function LSR_ZEROPAGE_70(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    a.setCarry(0 < (d & 1));
    d = (d & 255) >> 1;
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions[70] = LSR_ZEROPAGE_70;

function LSE_ZEROPAGE_71(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    a.setCarry(0 < (d & 1));
    d = d >> 1 & 255;
    a.regA ^= d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions[71] = LSE_ZEROPAGE_71;

function PHA_NONE_72(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.write8(256 + a.regS, a.regA & 255);
    0 === a.regS ? a.regS = 255 : a.regS--;
    return 3
}
instructions[72] = PHA_NONE_72;

function EOR_IMMEDIATE_73(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.regA = (a.regA ^ c & 255) & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 2
}
instructions[73] = EOR_IMMEDIATE_73;

function LSR_ACCUMULATOR_74(a, b) {
    var c = a.regA;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.setCarry(0 < (c & 1));
    c = (c & 255) >> 1;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.regA = c & 255;
    return 2
}
instructions[74] = LSR_ACCUMULATOR_74;

function ALR_IMMEDIATE_75(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.regA &= c;
    a.setCarry(0 < (a.regA & 1));
    a.regA = a.regA >> 1 & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 2
}
instructions[75] = ALR_IMMEDIATE_75;

function JMP_IMMEDIATE16_76(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.setPC(c & 65535);
    return 3
}
instructions[76] = JMP_IMMEDIATE16_76;

function EOR_ABSOLUTE_77(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regA = (a.regA ^ c & 255) & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions[77] = EOR_ABSOLUTE_77;

function LSR_ABSOLUTE_78(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    a.setCarry(0 < (d & 1));
    d = (d & 255) >> 1;
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions[78] = LSR_ABSOLUTE_78;

function LSE_ABSOLUTE_79(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    a.setCarry(0 < (d & 1));
    d = d >> 1 & 255;
    a.regA ^= d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions[79] = LSE_ABSOLUTE_79;

function BVC_RELATIVE_80(a, b) {
    var c = 2,
        d = b.read8(a.getPC() + 1 & 65535),
        d = a.calculateRelativeDifference(a.getPC() | 0, d | 0);
    a.getOverflow() ? (a.incrementSubcycle(), b.read8(a.getPC() + 1 & 65535), a.setPC(a.getPC() + 2 & 65535)) : (a.incrementSubcycle(), (a.getPC() + 2 & 65280) !== (d + 2 & 65280) && (c += 1, a.incrementSubcycle()), c += 1, a.incrementSubcycle(), a.setPC(d + 2 & 65535));
    return c
}
instructions[80] = BVC_RELATIVE_80;

function EOR_INDIRECTY_81(a, b) {
    var c = 5;
    a.incrementSubcycle();
    var d = b.read8(a.getPC() + 1 & 65535),
        d = a.read16FromMemWithWrap(d),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    a.regA = (a.regA ^ d & 255) & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions[81] = EOR_INDIRECTY_81;

function HLT_NONE_82(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions[82] = HLT_NONE_82;

function LSE_INDIRECTY_83(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        c = a.read16FromMemWithWrap(c),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    a.setCarry(0 < (c & 1));
    c = c >> 1 & 255;
    a.regA ^= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 8
}
instructions[83] = LSE_INDIRECTY_83;

function SKB_ZEROPAGEX_84(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    b.read8(d);
    return 4
}
instructions[84] = SKB_ZEROPAGEX_84;

function EOR_ZEROPAGEX_85(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.regA = (a.regA ^ c & 255) & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions[85] = EOR_ZEROPAGEX_85;

function LSR_ZEROPAGEX_86(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    a.setCarry(0 < (c & 1));
    c = (c & 255) >> 1;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions[86] = LSR_ZEROPAGEX_86;

function LSE_ZEROPAGEX_87(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    a.setCarry(0 < (c & 1));
    c = c >> 1 & 255;
    a.regA ^= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions[87] = LSE_ZEROPAGEX_87;

function CLI_NONE_88(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.waitOneInstructionAfterCli = !0 === a.getInterrupt();
    a.setInterrupt(!1);
    return 2
}
instructions[88] = CLI_NONE_88;

function EOR_ABSOLUTEY_89(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    a.regA = (a.regA ^ d & 255) & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions[89] = EOR_ABSOLUTEY_89;

function NOP_NONE_90(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    return 2
}
instructions[90] = NOP_NONE_90;

function LSE_ABSOLUTEY_91(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    a.setCarry(0 < (c & 1));
    c = c >> 1 & 255;
    a.regA ^= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions[91] = LSE_ABSOLUTEY_91;

function SKW_ABSOLUTEX_92(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    b.read8(e);
    return c
}
instructions[92] = SKW_ABSOLUTEX_92;

function EOR_ABSOLUTEX_93(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    a.regA = (a.regA ^ d & 255) & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions[93] = EOR_ABSOLUTEX_93;

function LSR_ABSOLUTEX_94(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    a.setCarry(0 < (c & 1));
    c = (c & 255) >> 1;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions[94] = LSR_ABSOLUTEX_94;

function LSE_ABSOLUTEX_95(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    a.setCarry(0 < (c & 1));
    c = c >> 1 & 255;
    a.regA ^= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions[95] = LSE_ABSOLUTEX_95;

function RTS_NONE_96(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.read8(a.getPC());
    a.incrementSubcycle();
    255 === a.regS ? a.regS = 0 : a.regS++;
    a.incrementSubcycle();
    a.programCounter = b.read8(256 + a.regS);
    255 === a.regS ? a.regS = 0 : a.regS++;
    a.incrementSubcycle();
    var c = b.read8(256 + a.regS);
    a.programCounter |= (c & 255) << 8;
    a.incrementSubcycle();
    a.programCounter = a.getPC() + 1 & 65535;
    return 6
}
instructions[96] = RTS_NONE_96;

function ADC_INDIRECTX_97(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var c = b.read8(c),
        d = (c & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c ^ 255) & 128);
    a.regA = d & 255;
    return 6
}
instructions[97] = ADC_INDIRECTX_97;

function HLT_NONE_98(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions[98] = HLT_NONE_98;

function RRA_INDIRECTX_99(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    var e = d >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(0 < (d & 1));
    d = (e & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ e ^ 255) & 128);
    a.regA = d & 255;
    e &= 255;
    a.incrementSubcycle();
    b.write8(c,
        e & 255);
    return 8
}
instructions[99] = RRA_INDIRECTX_99;

function SKB_ZEROPAGE_100(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    b.read8(c);
    return 3
}
instructions[100] = SKB_ZEROPAGE_100;

function ADC_ZEROPAGE_101(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var c = b.read8(c),
        d = (c & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c ^ 255) & 128);
    a.regA = d & 255;
    return 3
}
instructions[101] = ADC_ZEROPAGE_101;

function ROR_ZEROPAGE_102(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    var e = (d & 255) >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(d & 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(c, e & 255);
    return 5
}
instructions[102] = ROR_ZEROPAGE_102;

function RRA_ZEROPAGE_103(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    var e = d >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(0 < (d & 1));
    d = (e & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ e ^ 255) & 128);
    a.regA = d & 255;
    e &= 255;
    a.incrementSubcycle();
    b.write8(c, e & 255);
    return 5
}
instructions[103] = RRA_ZEROPAGE_103;

function PLA_NONE_104(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    255 === a.regS ? a.regS = 0 : a.regS++;
    a.incrementSubcycle();
    a.regA = b.read8(256 + a.regS);
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions[104] = PLA_NONE_104;

function ADC_IMMEDIATE_105(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    var d = (c & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c ^ 255) & 128);
    a.regA = d & 255;
    return 2
}
instructions[105] = ADC_IMMEDIATE_105;

function ROR_ACCUMULATOR_106(a, b) {
    var c = a.regA;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    var d = (c & 255) >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(c & 1);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.regA = d & 255;
    return 2
}
instructions[106] = ROR_ACCUMULATOR_106;

function ARR_IMMEDIATE_107(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.regA = a.regA & c & 255;
    a.regA = a.regA >> 1 & 255 | (a.getCarry() ? 128 : 0);
    a.setCarry(0 < (a.regA & 1));
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.setOverflow(!1);
    a.setCarry(!1);
    switch (a.regA & 96) {
        case 32:
            a.setOverflow(!0);
            break;
        case 64:
            a.setOverflow(!0);
            a.setCarry(!0);
            break;
        case 96:
            a.setCarry(!0)
    }
    return 2
}
instructions[107] = ARR_IMMEDIATE_107;

function JMP_INDIRECT_108(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 3 & 65535);
    a.setPC(c & 65535);
    return 5
}
instructions[108] = JMP_INDIRECT_108;

function ADC_ABSOLUTE_109(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var c = b.read8(c),
        d = (c & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c ^ 255) & 128);
    a.regA = d & 255;
    return 4
}
instructions[109] = ADC_ABSOLUTE_109;

function ROR_ABSOLUTE_110(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    var e = (d & 255) >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(d & 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(c, e & 255);
    return 6
}
instructions[110] = ROR_ABSOLUTE_110;

function RRA_ABSOLUTE_111(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    var e = d >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(0 < (d & 1));
    d = (e & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ e ^ 255) & 128);
    a.regA = d & 255;
    e &= 255;
    a.incrementSubcycle();
    b.write8(c, e & 255);
    return 6
}
instructions[111] = RRA_ABSOLUTE_111;

function BVS_RELATIVE_112(a, b) {
    var c = 2,
        d = b.read8(a.getPC() + 1 & 65535),
        d = a.calculateRelativeDifference(a.getPC() | 0, d | 0);
    a.getOverflow() ? (a.incrementSubcycle(), (a.getPC() + 2 & 65280) !== (d + 2 & 65280) && (c += 1, a.incrementSubcycle()), c += 1, a.incrementSubcycle(), a.setPC(d + 2 & 65535)) : (a.incrementSubcycle(), b.read8(a.getPC() + 1 & 65535), a.setPC(a.getPC() + 2 & 65535));
    return c
}
instructions[112] = BVS_RELATIVE_112;

function ADC_INDIRECTY_113(a, b) {
    var c = 5;
    a.incrementSubcycle();
    var d = b.read8(a.getPC() + 1 & 65535),
        d = a.read16FromMemWithWrap(d),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    e = (d & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ d ^ 255) & 128);
    a.regA = e & 255;
    return c
}
instructions[113] = ADC_INDIRECTY_113;

function HLT_NONE_114(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions[114] = HLT_NONE_114;

function RRA_INDIRECTY_115(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        c = a.read16FromMemWithWrap(c),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var e = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, e);
    c = e >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(0 < (e & 1));
    e = (c & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ c ^ 255) & 128);
    a.regA = e & 255;
    c &= 255;
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 8
}
instructions[115] = RRA_INDIRECTY_115;

function SKB_ZEROPAGEX_116(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    b.read8(d);
    return 4
}
instructions[116] = SKB_ZEROPAGEX_116;

function ADC_ZEROPAGEX_117(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    d = (c & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c ^ 255) & 128);
    a.regA = d & 255;
    return 4
}
instructions[117] = ADC_ZEROPAGEX_117;

function ROR_ZEROPAGEX_118(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    var e = (c & 255) >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(c & 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(d, e & 255);
    return 6
}
instructions[118] = ROR_ZEROPAGEX_118;

function RRA_ZEROPAGEX_119(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var e = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, e);
    c = e >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(0 < (e & 1));
    e = (c & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ c ^ 255) & 128);
    a.regA = e & 255;
    c &= 255;
    a.incrementSubcycle();
    b.write8(d,
        c & 255);
    return 6
}
instructions[119] = RRA_ZEROPAGEX_119;

function SEI_NONE_120(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.setInterrupt(!0);
    return 2
}
instructions[120] = SEI_NONE_120;

function ADC_ABSOLUTEY_121(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    e = (d & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ d ^ 255) & 128);
    a.regA = e & 255;
    return c
}
instructions[121] = ADC_ABSOLUTEY_121;

function NOP_NONE_122(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    return 2
}
instructions[122] = NOP_NONE_122;

function RRA_ABSOLUTEY_123(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var e = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, e);
    c = e >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(0 < (e & 1));
    e = (c & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ c ^ 255) & 128);
    a.regA = e & 255;
    c &= 255;
    a.incrementSubcycle();
    b.write8(d, c &
        255);
    return 7
}
instructions[123] = RRA_ABSOLUTEY_123;

function SKW_ABSOLUTEX_124(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    b.read8(e);
    return c
}
instructions[124] = SKW_ABSOLUTEX_124;

function ADC_ABSOLUTEX_125(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    e = (d & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ d ^ 255) & 128);
    a.regA = e & 255;
    return c
}
instructions[125] = ADC_ABSOLUTEX_125;

function ROR_ABSOLUTEX_126(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    var e = (c & 255) >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(c & 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(d, e & 255);
    return 7
}
instructions[126] = ROR_ABSOLUTEX_126;

function RRA_ABSOLUTEX_127(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var e = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, e);
    c = e >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(0 < (e & 1));
    e = (c & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ c ^ 255) & 128);
    a.regA = e & 255;
    c &= 255;
    a.incrementSubcycle();
    b.write8(d, c &
        255);
    return 7
}
instructions[127] = RRA_ABSOLUTEX_127;

function SKB_IMMEDIATE_128(a, b) {
    a.incrementSubcycle();
    b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    return 2
}
instructions[128] = SKB_IMMEDIATE_128;

function STA_INDIRECTX_129(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    var d = a.regA;
    a.incrementSubcycle();
    b.write8(c, d);
    return 6
}
instructions[129] = STA_INDIRECTX_129;

function SKB_IMMEDIATE_130(a, b) {
    a.incrementSubcycle();
    b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    return 2
}
instructions[130] = SKB_IMMEDIATE_130;

function AXS_INDIRECTX_131(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    var d = a.regA & a.regX;
    a.incrementSubcycle();
    b.write8(c, d);
    return 6
}
instructions[131] = AXS_INDIRECTX_131;

function STY_ZEROPAGE_132(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    var d = a.regY;
    a.incrementSubcycle();
    b.write8(c, d);
    return 3
}
instructions[132] = STY_ZEROPAGE_132;

function STA_ZEROPAGE_133(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    var d = a.regA;
    a.incrementSubcycle();
    b.write8(c, d);
    return 3
}
instructions[133] = STA_ZEROPAGE_133;

function STX_ZEROPAGE_134(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    var d = a.regX;
    a.incrementSubcycle();
    b.write8(c, d);
    return 3
}
instructions[134] = STX_ZEROPAGE_134;

function AXS_ZEROPAGE_135(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    var d = a.regA & a.regX;
    a.incrementSubcycle();
    b.write8(c, d);
    return 3
}
instructions[135] = AXS_ZEROPAGE_135;

function DEY_NONE_136(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regY--;
    0 > a.regY && (a.regY = 255);
    a.setSign(0 < (a.regY & 128));
    a.setZero(0 === (a.regY & 255));
    return 2
}
instructions[136] = DEY_NONE_136;

function SKB_IMMEDIATE_137(a, b) {
    a.incrementSubcycle();
    b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    return 2
}
instructions[137] = SKB_IMMEDIATE_137;

function TXA_NONE_138(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regA = a.regX;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 2
}
instructions[138] = TXA_NONE_138;

function XAA_IMMEDIATE_139(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.regA = a.regX & c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 2
}
instructions[139] = XAA_IMMEDIATE_139;

function STY_ABSOLUTE_140(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    var d = a.regY;
    a.incrementSubcycle();
    b.write8(c, d);
    return 4
}
instructions[140] = STY_ABSOLUTE_140;

function STA_ABSOLUTE_141(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    var d = a.regA;
    a.incrementSubcycle();
    b.write8(c, d);
    return 4
}
instructions[141] = STA_ABSOLUTE_141;

function STX_ABSOLUTE_142(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    var d = a.regX;
    a.incrementSubcycle();
    b.write8(c, d);
    return 4
}
instructions[142] = STX_ABSOLUTE_142;

function AXS_ABSOLUTE_143(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    var d = a.regA & a.regX;
    a.incrementSubcycle();
    b.write8(c, d);
    return 4
}
instructions[143] = AXS_ABSOLUTE_143;

function BCC_RELATIVE_144(a, b) {
    var c = 2,
        d = b.read8(a.getPC() + 1 & 65535),
        d = a.calculateRelativeDifference(a.getPC() | 0, d | 0);
    a.getCarry() ? (a.incrementSubcycle(), b.read8(a.getPC() + 1 & 65535), a.setPC(a.getPC() + 2 & 65535)) : (a.incrementSubcycle(), (a.getPC() + 2 & 65280) !== (d + 2 & 65280) && (c += 1, a.incrementSubcycle()), c += 1, a.incrementSubcycle(), a.setPC(d + 2 & 65535));
    return c
}
instructions[144] = BCC_RELATIVE_144;

function STA_INDIRECTY_145(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        c = a.read16FromMemWithWrap(c),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    c = a.regA;
    a.incrementSubcycle();
    b.write8(d, c);
    return 6
}
instructions[145] = STA_INDIRECTY_145;

function HLT_NONE_146(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions[146] = HLT_NONE_146;

function AXA_INDIRECTY_147(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        c = a.read16FromMemWithWrap(c),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    c = a.regX & a.regA & 7;
    a.incrementSubcycle();
    b.write8(d, c);
    return 6
}
instructions[147] = AXA_INDIRECTY_147;

function STY_ZEROPAGEX_148(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    c = a.regY;
    a.incrementSubcycle();
    b.write8(d, c);
    return 4
}
instructions[148] = STY_ZEROPAGEX_148;

function STA_ZEROPAGEX_149(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    c = a.regA;
    a.incrementSubcycle();
    b.write8(d, c);
    return 4
}
instructions[149] = STA_ZEROPAGEX_149;

function STX_ZEROPAGEY_150(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regY & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    c = a.regX;
    a.incrementSubcycle();
    b.write8(d, c);
    return 4
}
instructions[150] = STX_ZEROPAGEY_150;

function AXS_ZEROPAGEY_151(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regY & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    c = a.regA & a.regX;
    a.incrementSubcycle();
    b.write8(d, c);
    return 4
}
instructions[151] = AXS_ZEROPAGEY_151;

function TYA_NONE_152(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regA = a.regY;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 2
}
instructions[152] = TYA_NONE_152;

function STA_ABSOLUTEY_153(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    c = a.regA;
    a.incrementSubcycle();
    b.write8(d, c);
    return 5
}
instructions[153] = STA_ABSOLUTEY_153;

function TXS_NONE_154(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regS = a.regX;
    return 2
}
instructions[154] = TXS_NONE_154;

function TAS_ABSOLUTEY_155(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.regS = a.regX & a.regA;
    return 5
}
instructions[155] = TAS_ABSOLUTEY_155;

function SAY_SAY_156(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.SAYHighByte = b.read8(a.getPC() + 2 & 65535);
    c |= a.SAYHighByte << 8;
    c = c + a.regX & 65535;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    d = a.regY & a.SAYHighByte + 1 & 255;
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions[156] = SAY_SAY_156;

function STA_ABSOLUTEX_157(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    c = a.regA;
    a.incrementSubcycle();
    b.write8(d, c);
    return 5
}
instructions[157] = STA_ABSOLUTEX_157;

function XAS_ABSOLUTEY_158(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    console.log("illegal instruction XAS not implemented");
    a.incrementSubcycle();
    b.write8(d, 0);
    return 5
}
instructions[158] = XAS_ABSOLUTEY_158;

function AXA_ABSOLUTEY_159(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c = a.regX & a.regA & 7;
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 5
}
instructions[159] = AXA_ABSOLUTEY_159;

function LDY_IMMEDIATE_160(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.regY = c & 255;
    a.setSign(0 < (a.regY & 128));
    a.setZero(0 === (a.regY & 255));
    return 2
}
instructions[160] = LDY_IMMEDIATE_160;

function LDA_INDIRECTX_161(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regA = c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 6
}
instructions[161] = LDA_INDIRECTX_161;

function LDX_IMMEDIATE_162(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.regX = c & 255;
    a.setSign(0 < (a.regX & 128));
    a.setZero(0 === (a.regX & 255));
    return 2
}
instructions[162] = LDX_IMMEDIATE_162;

function LAX_INDIRECTX_163(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regA = c;
    a.regX = c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 6
}
instructions[163] = LAX_INDIRECTX_163;

function LDY_ZEROPAGE_164(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regY = c & 255;
    a.setSign(0 < (a.regY & 128));
    a.setZero(0 === (a.regY & 255));
    return 3
}
instructions[164] = LDY_ZEROPAGE_164;

function LDA_ZEROPAGE_165(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regA = c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 3
}
instructions[165] = LDA_ZEROPAGE_165;

function LDX_ZEROPAGE_166(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regX = c & 255;
    a.setSign(0 < (a.regX & 128));
    a.setZero(0 === (a.regX & 255));
    return 3
}
instructions[166] = LDX_ZEROPAGE_166;

function LAX_ZEROPAGE_167(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regA = c;
    a.regX = c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 3
}
instructions[167] = LAX_ZEROPAGE_167;

function TAY_NONE_168(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regY = a.regA;
    a.setSign(0 < (a.regY & 128));
    a.setZero(0 === (a.regY & 255));
    return 2
}
instructions[168] = TAY_NONE_168;

function LDA_IMMEDIATE_169(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.regA = c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 2
}
instructions[169] = LDA_IMMEDIATE_169;

function TAX_NONE_170(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regX = a.regA;
    a.setSign(0 < (a.regX & 128));
    a.setZero(0 === (a.regX & 255));
    return 2
}
instructions[170] = TAX_NONE_170;

function OAL_IMMEDIATE_171(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.regX = a.regA = c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 2
}
instructions[171] = OAL_IMMEDIATE_171;

function LDY_ABSOLUTE_172(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regY = c & 255;
    a.setSign(0 < (a.regY & 128));
    a.setZero(0 === (a.regY & 255));
    return 4
}
instructions[172] = LDY_ABSOLUTE_172;

function LDA_ABSOLUTE_173(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regA = c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions[173] = LDA_ABSOLUTE_173;

function LDX_ABSOLUTE_174(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regX = c & 255;
    a.setSign(0 < (a.regX & 128));
    a.setZero(0 === (a.regX & 255));
    return 4
}
instructions[174] = LDX_ABSOLUTE_174;

function LAX_ABSOLUTE_175(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    a.regA = c;
    a.regX = c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions[175] = LAX_ABSOLUTE_175;

function BCS_RELATIVE_176(a, b) {
    var c = 2,
        d = b.read8(a.getPC() + 1 & 65535),
        d = a.calculateRelativeDifference(a.getPC() | 0, d | 0);
    a.getCarry() ? (a.incrementSubcycle(), (a.getPC() + 2 & 65280) !== (d + 2 & 65280) && (c += 1, a.incrementSubcycle()), c += 1, a.incrementSubcycle(), a.setPC(d + 2 & 65535)) : (a.incrementSubcycle(), b.read8(a.getPC() + 1 & 65535), a.setPC(a.getPC() + 2 & 65535));
    return c
}
instructions[176] = BCS_RELATIVE_176;

function LDA_INDIRECTY_177(a, b) {
    var c = 5;
    a.incrementSubcycle();
    var d = b.read8(a.getPC() + 1 & 65535),
        d = a.read16FromMemWithWrap(d),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    a.regA = d & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions[177] = LDA_INDIRECTY_177;

function HLT_NONE_178(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions[178] = HLT_NONE_178;

function LAX_INDIRECTY_179(a, b) {
    var c = 5;
    a.incrementSubcycle();
    var d = b.read8(a.getPC() + 1 & 65535),
        d = a.read16FromMemWithWrap(d),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    a.regA = d;
    a.regX = d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions[179] = LAX_INDIRECTY_179;

function LDY_ZEROPAGEX_180(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.regY = c & 255;
    a.setSign(0 < (a.regY & 128));
    a.setZero(0 === (a.regY & 255));
    return 4
}
instructions[180] = LDY_ZEROPAGEX_180;

function LDA_ZEROPAGEX_181(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.regA = c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions[181] = LDA_ZEROPAGEX_181;

function LDX_ZEROPAGEY_182(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regY & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.regX = c & 255;
    a.setSign(0 < (a.regX & 128));
    a.setZero(0 === (a.regX & 255));
    return 4
}
instructions[182] = LDX_ZEROPAGEY_182;

function LAX_ZEROPAGEY_183(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regY & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.regA = c;
    a.regX = c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions[183] = LAX_ZEROPAGEY_183;

function CLV_NONE_184(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.setOverflow(!1);
    return 2
}
instructions[184] = CLV_NONE_184;

function LDA_ABSOLUTEY_185(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    a.regA = d & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions[185] = LDA_ABSOLUTEY_185;

function TSX_NONE_186(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regX = a.regS & 255;
    a.setSign(0 < (a.regX & 128));
    a.setZero(0 === (a.regX & 255));
    return 2
}
instructions[186] = TSX_NONE_186;

function LAS_ABSOLUTEY_187(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    b.read8(e);
    console.log("illegal instruction LAS not implemented");
    return c
}
instructions[187] = LAS_ABSOLUTEY_187;

function LDY_ABSOLUTEX_188(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    a.regY = d & 255;
    a.setSign(0 < (a.regY & 128));
    a.setZero(0 === (a.regY & 255));
    return c
}
instructions[188] = LDY_ABSOLUTEX_188;

function LDA_ABSOLUTEX_189(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    a.regA = d & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions[189] = LDA_ABSOLUTEX_189;

function LDX_ABSOLUTEY_190(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    a.regX = d & 255;
    a.setSign(0 < (a.regX & 128));
    a.setZero(0 === (a.regX & 255));
    return c
}
instructions[190] = LDX_ABSOLUTEY_190;

function LAX_ABSOLUTEY_191(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    a.regA = d;
    a.regX = d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions[191] = LAX_ABSOLUTEY_191;

function CPY_IMMEDIATE_192(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    c = a.regY - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 2
}
instructions[192] = CPY_IMMEDIATE_192;

function CMP_INDIRECTX_193(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    c = a.regA - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 6
}
instructions[193] = CMP_INDIRECTX_193;

function SKB_IMMEDIATE_194(a, b) {
    a.incrementSubcycle();
    b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    return 2
}
instructions[194] = SKB_IMMEDIATE_194;

function DCM_INDIRECTX_195(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    d -= 1;
    0 > d && (d = 255);
    var e = a.regA - d;
    a.setCarry(0 <= e && 256 > e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 8
}
instructions[195] = DCM_INDIRECTX_195;

function CPY_ZEROPAGE_196(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    c = a.regY - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 3
}
instructions[196] = CPY_ZEROPAGE_196;

function CMP_ZEROPAGE_197(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    c = a.regA - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 3
}
instructions[197] = CMP_ZEROPAGE_197;

function DEC_ZEROPAGE_198(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    d -= 1;
    0 > d && (d = 255);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions[198] = DEC_ZEROPAGE_198;

function DCM_ZEROPAGE_199(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    d -= 1;
    0 > d && (d = 255);
    var e = a.regA - d;
    a.setCarry(0 <= e && 256 > e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions[199] = DCM_ZEROPAGE_199;

function INY_NONE_200(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regY++;
    255 < a.regY && (a.regY = 0);
    a.setSign(0 < (a.regY & 128));
    a.setZero(0 === (a.regY & 255));
    return 2
}
instructions[200] = INY_NONE_200;

function CMP_IMMEDIATE_201(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    c = a.regA - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 2
}
instructions[201] = CMP_IMMEDIATE_201;

function DEX_NONE_202(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regX--;
    0 > a.regX && (a.regX = 255);
    a.setSign(0 < (a.regX & 128));
    a.setZero(0 === (a.regX & 255));
    return 2
}
instructions[202] = DEX_NONE_202;

function SAX_IMMEDIATE_203(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    c = (a.regA & a.regX) - c;
    a.regX = c & 255;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 2
}
instructions[203] = SAX_IMMEDIATE_203;

function CPY_ABSOLUTE_204(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    c = a.regY - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 4
}
instructions[204] = CPY_ABSOLUTE_204;

function CMP_ABSOLUTE_205(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    c = a.regA - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 4
}
instructions[205] = CMP_ABSOLUTE_205;

function DEC_ABSOLUTE_206(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    d -= 1;
    0 > d && (d = 255);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions[206] = DEC_ABSOLUTE_206;

function DCM_ABSOLUTE_207(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    d -= 1;
    0 > d && (d = 255);
    var e = a.regA - d;
    a.setCarry(0 <= e && 256 > e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions[207] = DCM_ABSOLUTE_207;

function BNE_RELATIVE_208(a, b) {
    var c = 2,
        d = b.read8(a.getPC() + 1 & 65535),
        d = a.calculateRelativeDifference(a.getPC() | 0, d | 0);
    a.getZero() ? (a.incrementSubcycle(), b.read8(a.getPC() + 1 & 65535), a.setPC(a.getPC() + 2 & 65535)) : (a.incrementSubcycle(), (a.getPC() + 2 & 65280) !== (d + 2 & 65280) && (c += 1, a.incrementSubcycle()), c += 1, a.incrementSubcycle(), a.setPC(d + 2 & 65535));
    return c
}
instructions[208] = BNE_RELATIVE_208;

function CMP_INDIRECTY_209(a, b) {
    var c = 5;
    a.incrementSubcycle();
    var d = b.read8(a.getPC() + 1 & 65535),
        d = a.read16FromMemWithWrap(d),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    d = a.regA - d;
    a.setCarry(0 <= d && 256 > d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    return c
}
instructions[209] = CMP_INDIRECTY_209;

function HLT_NONE_210(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions[210] = HLT_NONE_210;

function DCM_INDIRECTY_211(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        c = a.read16FromMemWithWrap(c),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c -= 1;
    0 > c && (c = 255);
    var e = a.regA - c;
    a.setCarry(0 <= e && 256 > e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 8
}
instructions[211] = DCM_INDIRECTY_211;

function SKB_ZEROPAGEX_212(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    b.read8(d);
    return 4
}
instructions[212] = SKB_ZEROPAGEX_212;

function CMP_ZEROPAGEX_213(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    c = a.regA - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 4
}
instructions[213] = CMP_ZEROPAGEX_213;

function DEC_ZEROPAGEX_214(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c -= 1;
    0 > c && (c = 255);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions[214] = DEC_ZEROPAGEX_214;

function DCM_ZEROPAGEX_215(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c -= 1;
    0 > c && (c = 255);
    var e = a.regA - c;
    a.setCarry(0 <= e && 256 > e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions[215] = DCM_ZEROPAGEX_215;

function CLD_NONE_216(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.setDecimal(!1);
    return 2
}
instructions[216] = CLD_NONE_216;

function CMP_ABSOLUTEY_217(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    d = a.regA - d;
    a.setCarry(0 <= d && 256 > d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    return c
}
instructions[217] = CMP_ABSOLUTEY_217;

function NOP_NONE_218(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    return 2
}
instructions[218] = NOP_NONE_218;

function DCM_ABSOLUTEY_219(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c -= 1;
    0 > c && (c = 255);
    var e = a.regA - c;
    a.setCarry(0 <= e && 256 > e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions[219] = DCM_ABSOLUTEY_219;

function SKW_ABSOLUTEX_220(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    b.read8(e);
    return c
}
instructions[220] = SKW_ABSOLUTEX_220;

function CMP_ABSOLUTEX_221(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    d = a.regA - d;
    a.setCarry(0 <= d && 256 > d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    return c
}
instructions[221] = CMP_ABSOLUTEX_221;

function DEC_ABSOLUTEX_222(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c -= 1;
    0 > c && (c = 255);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions[222] = DEC_ABSOLUTEX_222;

function DCM_ABSOLUTEX_223(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c -= 1;
    0 > c && (c = 255);
    var e = a.regA - c;
    a.setCarry(0 <= e && 256 > e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions[223] = DCM_ABSOLUTEX_223;

function CPX_IMMEDIATE_224(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    c = a.regX - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 2
}
instructions[224] = CPX_IMMEDIATE_224;

function SBC_INDIRECTX_225(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var c = b.read8(c),
        d = a.regA - c - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= d && 256 > d);
    a.regA = d & 255;
    return 6
}
instructions[225] = SBC_INDIRECTX_225;

function SKB_IMMEDIATE_226(a, b) {
    a.incrementSubcycle();
    b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    return 2
}
instructions[226] = SKB_IMMEDIATE_226;

function INS_INDIRECTX_227(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    d += 1;
    255 < d && (d = 0);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    var e = a.regA - d - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ d) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    a.incrementSubcycle();
    b.write8(c,
        d & 255);
    return 8
}
instructions[227] = INS_INDIRECTX_227;

function CPX_ZEROPAGE_228(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    c = a.regX - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 3
}
instructions[228] = CPX_ZEROPAGE_228;

function SBC_ZEROPAGE_229(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var c = b.read8(c),
        d = a.regA - c - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= d && 256 > d);
    a.regA = d & 255;
    return 3
}
instructions[229] = SBC_ZEROPAGE_229;

function INC_ZEROPAGE_230(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    d += 1;
    255 < d && (d = 0);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions[230] = INC_ZEROPAGE_230;

function INS_ZEROPAGE_231(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    d += 1;
    255 < d && (d = 0);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    var e = a.regA - d - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ d) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions[231] = INS_ZEROPAGE_231;

function INX_NONE_232(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regX++;
    255 < a.regX && (a.regX = 0);
    a.setSign(0 < (a.regX & 128));
    a.setZero(0 === (a.regX & 255));
    return 2
}
instructions[232] = INX_NONE_232;

function SBC_IMMEDIATE_233(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    var d = a.regA - c - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= d && 256 > d);
    a.regA = d & 255;
    return 2
}
instructions[233] = SBC_IMMEDIATE_233;

function NOP_NONE_234(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    return 2
}
instructions[234] = NOP_NONE_234;

function SBC_IMMEDIATE_235(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 2 & 65535);
    var d = a.regA - c - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= d && 256 > d);
    a.regA = d & 255;
    return 2
}
instructions[235] = SBC_IMMEDIATE_235;

function CPX_ABSOLUTE_236(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    c = a.regX - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 4
}
instructions[236] = CPX_ABSOLUTE_236;

function SBC_ABSOLUTE_237(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var c = b.read8(c),
        d = a.regA - c - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= d && 256 > d);
    a.regA = d & 255;
    return 4
}
instructions[237] = SBC_ABSOLUTE_237;

function INC_ABSOLUTE_238(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    d += 1;
    255 < d && (d = 0);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions[238] = INC_ABSOLUTE_238;

function INS_ABSOLUTE_239(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    a.incrementSubcycle();
    b.write8(c, d);
    d += 1;
    255 < d && (d = 0);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    var e = a.regA - d - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ d) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions[239] = INS_ABSOLUTE_239;

function BEQ_RELATIVE_240(a, b) {
    var c = 2,
        d = b.read8(a.getPC() + 1 & 65535),
        d = a.calculateRelativeDifference(a.getPC() | 0, d | 0);
    a.getZero() ? (a.incrementSubcycle(), (a.getPC() + 2 & 65280) !== (d + 2 & 65280) && (c += 1, a.incrementSubcycle()), c += 1, a.incrementSubcycle(), a.setPC(d + 2 & 65535)) : (a.incrementSubcycle(), b.read8(a.getPC() + 1 & 65535), a.setPC(a.getPC() + 2 & 65535));
    return c
}
instructions[240] = BEQ_RELATIVE_240;

function SBC_INDIRECTY_241(a, b) {
    var c = 5;
    a.incrementSubcycle();
    var d = b.read8(a.getPC() + 1 & 65535),
        d = a.read16FromMemWithWrap(d),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    e = a.regA - d - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ d) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    return c
}
instructions[241] = SBC_INDIRECTY_241;

function HLT_NONE_242(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions[242] = HLT_NONE_242;

function INS_INDIRECTY_243(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        c = a.read16FromMemWithWrap(c),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c += 1;
    255 < c && (c = 0);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    var e = a.regA - c - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e &
        255;
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 8
}
instructions[243] = INS_INDIRECTY_243;

function SKB_ZEROPAGEX_244(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    b.read8(d);
    return 4
}
instructions[244] = SKB_ZEROPAGEX_244;

function SBC_ZEROPAGEX_245(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    d = a.regA - c - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= d && 256 > d);
    a.regA = d & 255;
    return 4
}
instructions[245] = SBC_ZEROPAGEX_245;

function INC_ZEROPAGEX_246(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c += 1;
    255 < c && (c = 0);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions[246] = INC_ZEROPAGEX_246;

function INS_ZEROPAGEX_247(a, b) {
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535),
        d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c += 1;
    255 < c && (c = 0);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    var e = a.regA - c - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    a.incrementSubcycle();
    b.write8(d,
        c & 255);
    return 6
}
instructions[247] = INS_ZEROPAGEX_247;

function SED_NONE_248(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.setDecimal(!0);
    return 2
}
instructions[248] = SED_NONE_248;

function SBC_ABSOLUTEY_249(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    e = a.regA - d - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ d) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    return c
}
instructions[249] = SBC_ABSOLUTEY_249;

function NOP_NONE_250(a, b) {
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    return 2
}
instructions[250] = NOP_NONE_250;

function INS_ABSOLUTEY_251(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c += 1;
    255 < c && (c = 0);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    var e = a.regA - c - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    a.incrementSubcycle();
    b.write8(d,
        c & 255);
    return 7
}
instructions[251] = INS_ABSOLUTEY_251;

function SKW_ABSOLUTEX_252(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    b.read8(e);
    return c
}
instructions[252] = SKW_ABSOLUTEX_252;

function SBC_ABSOLUTEX_253(a, b) {
    var c = 4,
        d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    e = a.regA - d - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ d) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    return c
}
instructions[253] = SBC_ABSOLUTEX_253;

function INC_ABSOLUTEX_254(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c += 1;
    255 < c && (c = 0);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions[254] = INC_ABSOLUTEX_254;

function INS_ABSOLUTEX_255(a, b) {
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535),
        d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    a.incrementSubcycle();
    b.write8(d, c);
    c += 1;
    255 < c && (c = 0);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    var e = a.regA - c - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    a.incrementSubcycle();
    b.write8(d,
        c & 255);
    return 7
}
instructions[255] = INS_ABSOLUTEX_255;
Nes.cpuInstructions = instructions;
this.Nes = this.Nes || {};
"use strict";
var executeCpuInstructionSwitch = function(a, b, c) {
    switch (a) {
        case 0:
            return a = 7, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), c.read8(b.getPC()), b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), c.write8(256 + b.regS, b.getPC() >> 8 & 255), 0 === b.regS ? b.regS = 255 : b.regS--, b.incrementSubcycle(), c.write8(256 + b.regS, b.programCounter & 255), 0 === b.regS ? b.regS = 255 : b.regS--, b.incrementSubcycle(), c.write8(256 + b.regS, (b.statusRegToByte() | 48) & 255), 0 === b.regS ? b.regS = 255 : b.regS--, b.setPC(b.read16FromMemNoWrap(CPU_IRQ_ADDRESS)),
                b.setInterrupt(!0), a;
        case 1:
            a = 6;
            b.incrementSubcycle();
            var d = c.read8(b.getPC() + 1 & 65535);
            b.incrementSubcycle();
            var d = d + b.regX & 255,
                e = b.read16FromMemWithWrap(d);
            b.setPC(b.getPC() + 2 & 65535);
            b.incrementSubcycle();
            d = c.read8(e);
            b.regA |= d & 255;
            b.setSign(0 < (b.regA & 128));
            b.setZero(0 === (b.regA & 255));
            return a;
        case 2:
            a = 2;
            b.setPC(b.getPC() + 1 & 65535);
            var f = 0;
            console.log("illegal instruction HLT not implemented");
            return a;
        case 3:
            return a = 8, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), b.incrementSubcycle(), d = d +
                b.regX & 255, e = b.read16FromMemWithWrap(d), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 128)), f = d << 1 & 255, b.regA |= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 4:
            return a = 3, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), c.read8(e), a;
        case 5:
            return a = 3, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535),
                b.incrementSubcycle(), d = c.read8(e), b.regA |= d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 6:
            return a = 5, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 128)), f = (d & 255) << 1 & 255, b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 7:
            return a = 5, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(),
                d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 128)), f = d << 1 & 255, b.regA |= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 8:
            return a = 3, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), c.read8(b.getPC() + 1 & 65535), b.incrementSubcycle(), c.write8(256 + b.regS, (b.statusRegToByte() | 16) & 255), 0 === b.regS ? b.regS = 255 : b.regS--, a;
        case 9:
            return a = 2, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.regA |= e & 255, b.setSign(0 <
                (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 10:
            return a = 2, e = b.regA, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), b.setCarry(0 < (e & 128)), f = (e & 255) << 1 & 255, b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.regA = f & 255, a;
        case 11:
            return a = 2, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.regA &= e, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.setCarry(b.getSign()), a;
        case 12:
            return a = 4, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(),
                c.read8(e), a;
        case 13:
            return a = 4, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA |= d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 14:
            return a = 6, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 128)), f = (d & 255) << 1 & 255, b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 15:
            return a =
                6, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 128)), f = d << 1 & 255, b.regA |= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 16:
            return a = 2, d = c.read8(b.getPC() + 1 & 65535), e = b.calculateRelativeDifference(b.getPC() | 0, d | 0), (d = !b.getSign()) ? (b.incrementSubcycle(), (b.getPC() + 2 & 65280) !== (e + 2 & 65280) && (a += 1, b.incrementSubcycle()), a += 1, b.incrementSubcycle(),
                b.setPC(e + 2 & 65535)) : (b.incrementSubcycle(), c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535)), a;
        case 17:
            return a = 5, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), d = b.read16FromMemWithWrap(d), e = d + b.regY & 65535, (d + b.regY & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255)), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA |= d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 18:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), console.log("illegal instruction HLT not implemented"),
                a;
        case 19:
            return a = 8, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), d = b.read16FromMemWithWrap(d), e = d + b.regY & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 128)), f = d << 1 & 255, b.regA |= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 20:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(),
                c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), c.read8(e), a;
        case 21:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA |= d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 22:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() +
                2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 128)), f = (d & 255) << 1 & 255, b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 23:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 128)), f = d << 1 & 255, b.regA |= f, b.setSign(0 < (b.regA &
                128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 24:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), b.setCarry(!1), a;
        case 25:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regY & 65535, (d + b.regY & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA |= d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 26:
            return a = 2, b.setPC(b.getPC() + 1 & 65535),
                b.incrementSubcycle(), a;
        case 27:
            return a = 7, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regY & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 128)), f = d << 1 & 255, b.regA |= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 28:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, (d + b.regX & 65280) !== (d & 65280) &&
                (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), c.read8(e), a;
        case 29:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, (d + b.regX & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA |= d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 30:
            return a = 7, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, b.incrementSubcycle(),
                c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 128)), f = (d & 255) << 1 & 255, b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 31:
            return a = 7, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 128)),
                f = d << 1 & 255, b.regA |= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 32:
            return a = 6, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), f = b.getPC() - 1, 0 > f && (f = 65535), b.incrementSubcycle(), c.write8(256 + b.regS, f >> 8 & 255), 0 === b.regS ? b.regS = 255 : b.regS--, b.incrementSubcycle(), c.write8(256 + b.regS, f & 255), 0 === b.regS ? b.regS = 255 : b.regS--, b.incrementSubcycle(), b.setPC(e & 65535), a;
        case 33:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 &
                65535), b.incrementSubcycle(), d = d + b.regX & 255, e = b.read16FromMemWithWrap(d), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = b.regA & d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 34:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), console.log("illegal instruction HLT not implemented"), a;
        case 35:
            return a = 8, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), b.incrementSubcycle(), d = d + b.regX & 255, e = b.read16FromMemWithWrap(d), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d =
                c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d << 1 | (b.getCarry() ? 1 : 0), b.setCarry(255 < f), f &= 255, b.regA &= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 36:
            return a = 3, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), 8194 === (e & 57351) && b.mainboard.ppu.bitOperationHappening(), b.incrementSubcycle(), d = c.read8(e), b.setSign(0 < (d & 128)), b.setZero(0 === (b.regA & d & 255)), b.setOverflow(0 < (d & 64)), a;
        case 37:
            return a = 3, b.incrementSubcycle(),
                e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = b.regA & d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 38:
            return a = 5, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = (d & 255) << 1 | (b.getCarry() ? 1 : 0), b.setCarry(255 < f), f &= 255, b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 39:
            return a = 5, b.incrementSubcycle(),
                e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d << 1 | (b.getCarry() ? 1 : 0), b.setCarry(255 < f), f &= 255, b.regA &= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 40:
            a = 4;
            b.setPC(b.getPC() + 1 & 65535);
            b.waitOneInstructionAfterCli = !0 === b.getInterrupt();
            b.incrementSubcycle();
            c.read8(b.getPC() + 1 & 65535);
            b.incrementSubcycle();
            255 === b.regS ? b.regS = 0 : b.regS++;
            b.incrementSubcycle();
            var g =
                c.read8(256 + b.regS);
            b.statusRegFromByte(g);
            b.setBreak(!0);
            b.setUnused(!0);
            b.waitOneInstructionAfterCli && (b.waitOneInstructionAfterCli = !1 === b.getInterrupt());
            return a;
        case 41:
            return a = 2, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.regA = b.regA & e & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 42:
            return a = 2, e = b.regA, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), f = (e & 255) << 1 | (b.getCarry() ? 1 : 0), b.setCarry(255 < f), f &= 255, b.setSign(0 < (f & 128)), b.setZero(0 ===
                (f & 255)), b.regA = f & 255, a;
        case 43:
            return a = 2, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.regA &= e, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.setCarry(b.getSign()), a;
        case 44:
            return a = 4, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), 8194 === (e & 57351) && b.mainboard.ppu.bitOperationHappening(), b.incrementSubcycle(), d = c.read8(e), b.setSign(0 < (d & 128)), b.setZero(0 === (b.regA & d & 255)), b.setOverflow(0 < (d & 64)), a;
        case 45:
            return a = 4, e = b.read16FromMemNoWrap(b.getPC() +
                1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = b.regA & d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 46:
            return a = 6, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = (d & 255) << 1 | (b.getCarry() ? 1 : 0), b.setCarry(255 < f), f &= 255, b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 47:
            return a = 6, e = b.read16FromMemNoWrap(b.getPC() +
                1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d << 1 | (b.getCarry() ? 1 : 0), b.setCarry(255 < f), f &= 255, b.regA &= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 48:
            return a = 2, d = c.read8(b.getPC() + 1 & 65535), e = b.calculateRelativeDifference(b.getPC() | 0, d | 0), (d = b.getSign()) ? (b.incrementSubcycle(), (b.getPC() + 2 & 65280) !== (e + 2 & 65280) && (a += 1, b.incrementSubcycle()), a += 1, b.incrementSubcycle(), b.setPC(e +
                2 & 65535)) : (b.incrementSubcycle(), c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535)), a;
        case 49:
            return a = 5, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), d = b.read16FromMemWithWrap(d), e = d + b.regY & 65535, (d + b.regY & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255)), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = b.regA & d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 50:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), console.log("illegal instruction HLT not implemented"),
                a;
        case 51:
            return a = 8, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), d = b.read16FromMemWithWrap(d), e = d + b.regY & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d << 1 | (b.getCarry() ? 1 : 0), b.setCarry(255 < f), f &= 255, b.regA &= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 52:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX &
                255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), c.read8(e), a;
        case 53:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = b.regA & d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 54:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d &
                65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = (d & 255) << 1 | (b.getCarry() ? 1 : 0), b.setCarry(255 < f), f &= 255, b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 55:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d <<
                1 | (b.getCarry() ? 1 : 0), b.setCarry(255 < f), f &= 255, b.regA &= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 56:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), b.setCarry(!0), a;
        case 57:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regY & 65535, (d + b.regY & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = b.regA & d & 255, b.setSign(0 < (b.regA &
                128)), b.setZero(0 === (b.regA & 255)), a;
        case 58:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), a;
        case 59:
            return a = 7, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regY & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d << 1 | (b.getCarry() ? 1 : 0), b.setCarry(255 < f), f &= 255, b.regA &= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 60:
            return a =
                4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, (d + b.regX & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), c.read8(e), a;
        case 61:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, (d + b.regX & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = b.regA & d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 ===
                (b.regA & 255)), a;
        case 62:
            return a = 7, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = (d & 255) << 1 | (b.getCarry() ? 1 : 0), b.setCarry(255 < f), f &= 255, b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 63:
            return a = 7, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, b.incrementSubcycle(), c.read8(d & 65280 |
                d + b.regX & 255), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d << 1 | (b.getCarry() ? 1 : 0), b.setCarry(255 < f), f &= 255, b.regA &= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 64:
            return a = 6, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), c.read8(b.getPC()), b.incrementSubcycle(), 255 === b.regS ? b.regS = 0 : b.regS++, b.incrementSubcycle(), g = c.read8(256 + b.regS), b.statusRegFromByte(g), 255 === b.regS ? b.regS = 0 : b.regS++,
                b.incrementSubcycle(), b.programCounter = c.read8(256 + b.regS), 255 === b.regS ? b.regS = 0 : b.regS++, b.incrementSubcycle(), g = c.read8(256 + b.regS), b.programCounter |= (g & 255) << 8, b.setBreak(!0), b.setUnused(!0), a;
        case 65:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), b.incrementSubcycle(), d = d + b.regX & 255, e = b.read16FromMemWithWrap(d), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = (b.regA ^ d & 255) & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 66:
            return a = 2, b.setPC(b.getPC() +
                1 & 65535), console.log("illegal instruction HLT not implemented"), a;
        case 67:
            return a = 8, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), b.incrementSubcycle(), d = d + b.regX & 255, e = b.read16FromMemWithWrap(d), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 1)), f = d >> 1 & 255, b.regA ^= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 68:
            return a = 3, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535),
                b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), c.read8(e), a;
        case 69:
            return a = 3, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = (b.regA ^ d & 255) & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 70:
            return a = 5, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 1)), f = (d & 255) >> 1, b.setSign(0 < (f & 128)), b.setZero(0 ===
                (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 71:
            return a = 5, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 1)), f = d >> 1 & 255, b.regA ^= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 72:
            return a = 3, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), c.read8(b.getPC() + 1 & 65535), b.incrementSubcycle(), c.write8(256 + b.regS, b.regA & 255),
                0 === b.regS ? b.regS = 255 : b.regS--, a;
        case 73:
            return a = 2, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.regA = (b.regA ^ e & 255) & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 74:
            return a = 2, e = b.regA, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), b.setCarry(0 < (e & 1)), f = (e & 255) >> 1, b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.regA = f & 255, a;
        case 75:
            return a = 2, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.regA &= e, b.setCarry(0 <
                (b.regA & 1)), b.regA = b.regA >> 1 & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 76:
            return a = 3, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.setPC(e & 65535), a;
        case 77:
            return a = 4, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = (b.regA ^ d & 255) & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 78:
            return a = 6, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(),
                d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 1)), f = (d & 255) >> 1, b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 79:
            return a = 6, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 1)), f = d >> 1 & 255, b.regA ^= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 80:
            return a = 2, d = c.read8(b.getPC() +
                1 & 65535), e = b.calculateRelativeDifference(b.getPC() | 0, d | 0), (d = !b.getOverflow()) ? (b.incrementSubcycle(), (b.getPC() + 2 & 65280) !== (e + 2 & 65280) && (a += 1, b.incrementSubcycle()), a += 1, b.incrementSubcycle(), b.setPC(e + 2 & 65535)) : (b.incrementSubcycle(), c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535)), a;
        case 81:
            return a = 5, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), d = b.read16FromMemWithWrap(d), e = d + b.regY & 65535, (d + b.regY & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255)), b.setPC(b.getPC() +
                2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = (b.regA ^ d & 255) & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 82:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), console.log("illegal instruction HLT not implemented"), a;
        case 83:
            return a = 8, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), d = b.read16FromMemWithWrap(d), e = d + b.regY & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 <
                (d & 1)), f = d >> 1 & 255, b.regA ^= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 84:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), c.read8(e), a;
        case 85:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(),
                d = c.read8(e), b.regA = (b.regA ^ d & 255) & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 86:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 1)), f = (d & 255) >> 1, b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 87:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() +
                1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 1)), f = d >> 1 & 255, b.regA ^= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 88:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), b.waitOneInstructionAfterCli = !0 === b.getInterrupt(), b.setInterrupt(!1), a;
        case 89:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() +
                1 & 65535), e = d + b.regY & 65535, (d + b.regY & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = (b.regA ^ d & 255) & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 90:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), a;
        case 91:
            return a = 7, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regY & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(),
                d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 1)), f = d >> 1 & 255, b.regA ^= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 92:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, (d + b.regX & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), c.read8(e), a;
        case 93:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, (d + b.regX &
                65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = (b.regA ^ d & 255) & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 94:
            return a = 7, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 1)), f = (d & 255) >> 1, b.setSign(0 < (f & 128)),
                b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 95:
            return a = 7, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), b.setCarry(0 < (d & 1)), f = d >> 1 & 255, b.regA ^= f, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 96:
            return a = 6, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), c.read8(b.getPC()),
                b.incrementSubcycle(), 255 === b.regS ? b.regS = 0 : b.regS++, b.incrementSubcycle(), b.programCounter = c.read8(256 + b.regS), 255 === b.regS ? b.regS = 0 : b.regS++, b.incrementSubcycle(), g = c.read8(256 + b.regS), b.programCounter |= (g & 255) << 8, b.incrementSubcycle(), b.programCounter = b.getPC() + 1 & 65535, a;
        case 97:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), b.incrementSubcycle(), d = d + b.regX & 255, e = b.read16FromMemWithWrap(d), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), g = (d & 255) + b.regA + (b.getCarry() ?
                1 : 0), b.setCarry(255 < g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ d ^ 255) & 128), b.regA = g & 255, a;
        case 98:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), console.log("illegal instruction HLT not implemented"), a;
        case 99:
            return a = 8, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), b.incrementSubcycle(), d = d + b.regX & 255, e = b.read16FromMemWithWrap(d), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d >> 1 | (b.getCarry() ? 128 : 0), b.setCarry(0 <
                (d & 1)), g = (f & 255) + b.regA + (b.getCarry() ? 1 : 0), b.setCarry(255 < g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ f ^ 255) & 128), b.regA = g & 255, f &= 255, b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 100:
            return a = 3, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), c.read8(e), a;
        case 101:
            return a = 3, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), g = (d & 255) + b.regA + (b.getCarry() ?
                1 : 0), b.setCarry(255 < g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ d ^ 255) & 128), b.regA = g & 255, a;
        case 102:
            return a = 5, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = (d & 255) >> 1 | (b.getCarry() ? 128 : 0), b.setCarry(d & 1), b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 103:
            return a = 5, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 &
                65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d >> 1 | (b.getCarry() ? 128 : 0), b.setCarry(0 < (d & 1)), g = (f & 255) + b.regA + (b.getCarry() ? 1 : 0), b.setCarry(255 < g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ f ^ 255) & 128), b.regA = g & 255, f &= 255, b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 104:
            return a = 4, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), c.read8(b.getPC() + 1 & 65535), b.incrementSubcycle(), 255 === b.regS ? b.regS =
                0 : b.regS++, b.incrementSubcycle(), b.regA = c.read8(256 + b.regS), b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 105:
            return a = 2, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), g = (e & 255) + b.regA + (b.getCarry() ? 1 : 0), b.setCarry(255 < g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ e ^ 255) & 128), b.regA = g & 255, a;
        case 106:
            return a = 2, e = b.regA, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), f = (e & 255) >> 1 | (b.getCarry() ? 128 : 0), b.setCarry(e &
                1), b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.regA = f & 255, a;
        case 107:
            a = 2;
            b.incrementSubcycle();
            e = c.read8(b.getPC() + 1 & 65535);
            b.setPC(b.getPC() + 2 & 65535);
            b.regA = b.regA & e & 255;
            b.regA = b.regA >> 1 & 255 | (b.getCarry() ? 128 : 0);
            b.setCarry(0 < (b.regA & 1));
            b.setSign(0 < (b.regA & 128));
            b.setZero(0 === (b.regA & 255));
            b.setOverflow(!1);
            b.setCarry(!1);
            switch (b.regA & 96) {
                case 32:
                    b.setOverflow(!0);
                    break;
                case 64:
                    b.setOverflow(!0);
                    b.setCarry(!0);
                    break;
                case 96:
                    b.setCarry(!0)
            }
            return a;
        case 108:
            return a = 5, d = b.read16FromMemNoWrap(b.getPC() +
                1 & 65535), e = b.read16FromMemWithWrap(d), b.setPC(b.getPC() + 3 & 65535), b.setPC(e & 65535), a;
        case 109:
            return a = 4, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), g = (d & 255) + b.regA + (b.getCarry() ? 1 : 0), b.setCarry(255 < g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ d ^ 255) & 128), b.regA = g & 255, a;
        case 110:
            return a = 6, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(),
                c.write8(e, d), f = (d & 255) >> 1 | (b.getCarry() ? 128 : 0), b.setCarry(d & 1), b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 111:
            return a = 6, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d >> 1 | (b.getCarry() ? 128 : 0), b.setCarry(0 < (d & 1)), g = (f & 255) + b.regA + (b.getCarry() ? 1 : 0), b.setCarry(255 < g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ f ^ 255) &
                128), b.regA = g & 255, f &= 255, b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 112:
            return a = 2, d = c.read8(b.getPC() + 1 & 65535), e = b.calculateRelativeDifference(b.getPC() | 0, d | 0), (d = b.getOverflow()) ? (b.incrementSubcycle(), (b.getPC() + 2 & 65280) !== (e + 2 & 65280) && (a += 1, b.incrementSubcycle()), a += 1, b.incrementSubcycle(), b.setPC(e + 2 & 65535)) : (b.incrementSubcycle(), c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535)), a;
        case 113:
            return a = 5, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), d = b.read16FromMemWithWrap(d), e =
                d + b.regY & 65535, (d + b.regY & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255)), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), g = (d & 255) + b.regA + (b.getCarry() ? 1 : 0), b.setCarry(255 < g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ d ^ 255) & 128), b.regA = g & 255, a;
        case 114:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), console.log("illegal instruction HLT not implemented"), a;
        case 115:
            return a = 8, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535),
                d = b.read16FromMemWithWrap(d), e = d + b.regY & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d >> 1 | (b.getCarry() ? 128 : 0), b.setCarry(0 < (d & 1)), g = (f & 255) + b.regA + (b.getCarry() ? 1 : 0), b.setCarry(255 < g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ f ^ 255) & 128), b.regA = g & 255, f &= 255, b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 116:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() +
                1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), c.read8(e), a;
        case 117:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), g = (d & 255) + b.regA + (b.getCarry() ? 1 : 0), b.setCarry(255 < g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ d ^ 255) & 128), b.regA = g & 255, a;
        case 118:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = (d & 255) >> 1 | (b.getCarry() ? 128 : 0), b.setCarry(d & 1), b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 119:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX &
                255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d >> 1 | (b.getCarry() ? 128 : 0), b.setCarry(0 < (d & 1)), g = (f & 255) + b.regA + (b.getCarry() ? 1 : 0), b.setCarry(255 < g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ f ^ 255) & 128), b.regA = g & 255, f &= 255, b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 120:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), b.setInterrupt(!0), a;
        case 121:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() +
                1 & 65535), e = d + b.regY & 65535, (d + b.regY & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), g = (d & 255) + b.regA + (b.getCarry() ? 1 : 0), b.setCarry(255 < g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ d ^ 255) & 128), b.regA = g & 255, a;
        case 122:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), a;
        case 123:
            return a = 7, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regY & 65535, b.incrementSubcycle(),
                c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d >> 1 | (b.getCarry() ? 128 : 0), b.setCarry(0 < (d & 1)), g = (f & 255) + b.regA + (b.getCarry() ? 1 : 0), b.setCarry(255 < g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ f ^ 255) & 128), b.regA = g & 255, f &= 255, b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 124:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, (d + b.regX & 65280) !== (d & 65280) && (a++,
                b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), c.read8(e), a;
        case 125:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, (d + b.regX & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), g = (d & 255) + b.regA + (b.getCarry() ? 1 : 0), b.setCarry(255 < g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ d ^ 255) & 128), b.regA = g &
                255, a;
        case 126:
            return a = 7, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = (d & 255) >> 1 | (b.getCarry() ? 128 : 0), b.setCarry(d & 1), b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 127:
            return a = 7, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255),
                b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d >> 1 | (b.getCarry() ? 128 : 0), b.setCarry(0 < (d & 1)), g = (f & 255) + b.regA + (b.getCarry() ? 1 : 0), b.setCarry(255 < g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ f ^ 255) & 128), b.regA = g & 255, f &= 255, b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 128:
            return a = 2, b.incrementSubcycle(), c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), a;
        case 129:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() +
                1 & 65535), b.incrementSubcycle(), d = d + b.regX & 255, e = b.read16FromMemWithWrap(d), b.setPC(b.getPC() + 2 & 65535), f = b.regA, b.incrementSubcycle(), c.write8(e, f), a;
        case 130:
            return a = 2, b.incrementSubcycle(), c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), a;
        case 131:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), b.incrementSubcycle(), d = d + b.regX & 255, e = b.read16FromMemWithWrap(d), b.setPC(b.getPC() + 2 & 65535), f = b.regA & b.regX, b.incrementSubcycle(), c.write8(e, f), a;
        case 132:
            return a = 3, b.incrementSubcycle(),
                e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), f = b.regY, b.incrementSubcycle(), c.write8(e, f), a;
        case 133:
            return a = 3, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), f = b.regA, b.incrementSubcycle(), c.write8(e, f), a;
        case 134:
            return a = 3, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), f = b.regX, b.incrementSubcycle(), c.write8(e, f), a;
        case 135:
            return a = 3, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), f = b.regA & b.regX,
                b.incrementSubcycle(), c.write8(e, f), a;
        case 136:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), b.regY--, 0 > b.regY && (b.regY = 255), b.setSign(0 < (b.regY & 128)), b.setZero(0 === (b.regY & 255)), a;
        case 137:
            return a = 2, b.incrementSubcycle(), c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), a;
        case 138:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), b.regA = b.regX, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 139:
            return a = 2, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535),
                b.setPC(b.getPC() + 2 & 65535), b.regA = b.regX & e, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 140:
            return a = 4, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), f = b.regY, b.incrementSubcycle(), c.write8(e, f), a;
        case 141:
            return a = 4, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), f = b.regA, b.incrementSubcycle(), c.write8(e, f), a;
        case 142:
            return a = 4, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), f = b.regX, b.incrementSubcycle(), c.write8(e,
                f), a;
        case 143:
            return a = 4, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), f = b.regA & b.regX, b.incrementSubcycle(), c.write8(e, f), a;
        case 144:
            return a = 2, d = c.read8(b.getPC() + 1 & 65535), e = b.calculateRelativeDifference(b.getPC() | 0, d | 0), (d = !b.getCarry()) ? (b.incrementSubcycle(), (b.getPC() + 2 & 65280) !== (e + 2 & 65280) && (a += 1, b.incrementSubcycle()), a += 1, b.incrementSubcycle(), b.setPC(e + 2 & 65535)) : (b.incrementSubcycle(), c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535)), a;
        case 145:
            return a = 6, b.incrementSubcycle(),
                d = c.read8(b.getPC() + 1 & 65535), d = b.read16FromMemWithWrap(d), e = d + b.regY & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 2 & 65535), f = b.regA, b.incrementSubcycle(), c.write8(e, f), a;
        case 146:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), console.log("illegal instruction HLT not implemented"), a;
        case 147:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), d = b.read16FromMemWithWrap(d), e = d + b.regY & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 2 & 65535),
                f = b.regX & b.regA & 7, b.incrementSubcycle(), c.write8(e, f), a;
        case 148:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), f = b.regY, b.incrementSubcycle(), c.write8(e, f), a;
        case 149:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), f = b.regA, b.incrementSubcycle(), c.write8(e, f), a;
        case 150:
            return a = 4, b.incrementSubcycle(),
                d = c.read8(b.getPC() + 1 & 65535), e = d + b.regY & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 2 & 65535), f = b.regX, b.incrementSubcycle(), c.write8(e, f), a;
        case 151:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regY & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 2 & 65535), f = b.regA & b.regX, b.incrementSubcycle(), c.write8(e, f), a;
        case 152:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), b.regA = b.regY, b.setSign(0 < (b.regA & 128)), b.setZero(0 ===
                (b.regA & 255)), a;
        case 153:
            return a = 5, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regY & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 3 & 65535), f = b.regA, b.incrementSubcycle(), c.write8(e, f), a;
        case 154:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), b.regS = b.regX, a;
        case 155:
            return a = 5, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 3 & 65535), b.regS = b.regX & b.regA, a;
        case 156:
            return a = 5, b.incrementSubcycle(),
                d = c.read8(b.getPC() + 1 & 65535), b.SAYHighByte = c.read8(b.getPC() + 2 & 65535), d |= b.SAYHighByte << 8, e = d + b.regX & 65535, b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = b.regY & b.SAYHighByte + 1 & 255, b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 157:
            return a = 5, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 3 & 65535), f = b.regA, b.incrementSubcycle(), c.write8(e, f), a;
        case 158:
            return a = 5,
                d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regY & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 3 & 65535), f = 0, console.log("illegal instruction XAS not implemented"), b.incrementSubcycle(), c.write8(e, f), a;
        case 159:
            return a = 5, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regY & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = b.regX & b.regA & 7, b.incrementSubcycle(),
                c.write8(e, f & 255), a;
        case 160:
            return a = 2, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.regY = e & 255, b.setSign(0 < (b.regY & 128)), b.setZero(0 === (b.regY & 255)), a;
        case 161:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), b.incrementSubcycle(), d = d + b.regX & 255, e = b.read16FromMemWithWrap(d), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 162:
            return a = 2, b.incrementSubcycle(), e = c.read8(b.getPC() +
                1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.regX = e & 255, b.setSign(0 < (b.regX & 128)), b.setZero(0 === (b.regX & 255)), a;
        case 163:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), b.incrementSubcycle(), d = d + b.regX & 255, e = b.read16FromMemWithWrap(d), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = d, b.regX = d, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 164:
            return a = 3, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e),
                b.regY = d & 255, b.setSign(0 < (b.regY & 128)), b.setZero(0 === (b.regY & 255)), a;
        case 165:
            return a = 3, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 166:
            return a = 3, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regX = d & 255, b.setSign(0 < (b.regX & 128)), b.setZero(0 === (b.regX & 255)), a;
        case 167:
            return a = 3, b.incrementSubcycle(),
                e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = d, b.regX = d, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 168:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), b.regY = b.regA, b.setSign(0 < (b.regY & 128)), b.setZero(0 === (b.regY & 255)), a;
        case 169:
            return a = 2, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.regA = e & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 170:
            return a = 2, b.setPC(b.getPC() +
                1 & 65535), b.incrementSubcycle(), b.regX = b.regA, b.setSign(0 < (b.regX & 128)), b.setZero(0 === (b.regX & 255)), a;
        case 171:
            return a = 2, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.regX = b.regA = e & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 172:
            return a = 4, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regY = d & 255, b.setSign(0 < (b.regY & 128)), b.setZero(0 === (b.regY & 255)), a;
        case 173:
            return a = 4, e = b.read16FromMemNoWrap(b.getPC() +
                1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 174:
            return a = 4, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regX = d & 255, b.setSign(0 < (b.regX & 128)), b.setZero(0 === (b.regX & 255)), a;
        case 175:
            return a = 4, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = d, b.regX = d, b.setSign(0 < (b.regA & 128)),
                b.setZero(0 === (b.regA & 255)), a;
        case 176:
            return a = 2, d = c.read8(b.getPC() + 1 & 65535), e = b.calculateRelativeDifference(b.getPC() | 0, d | 0), (d = b.getCarry()) ? (b.incrementSubcycle(), (b.getPC() + 2 & 65280) !== (e + 2 & 65280) && (a += 1, b.incrementSubcycle()), a += 1, b.incrementSubcycle(), b.setPC(e + 2 & 65535)) : (b.incrementSubcycle(), c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535)), a;
        case 177:
            return a = 5, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), d = b.read16FromMemWithWrap(d), e = d + b.regY & 65535, (d + b.regY & 65280) !== (d & 65280) &&
                (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255)), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 178:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), console.log("illegal instruction HLT not implemented"), a;
        case 179:
            return a = 5, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), d = b.read16FromMemWithWrap(d), e = d + b.regY & 65535, (d + b.regY & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255)), b.setPC(b.getPC() +
                2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = d, b.regX = d, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 180:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regY = d & 255, b.setSign(0 < (b.regY & 128)), b.setZero(0 === (b.regY & 255)), a;
        case 181:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d &
                65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 182:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regY & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regX = d & 255, b.setSign(0 < (b.regX & 128)), b.setZero(0 === (b.regX & 255)), a;
        case 183:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regY &
                255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = d, b.regX = d, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 184:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), b.setOverflow(!1), a;
        case 185:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regY & 65535, (d + b.regY & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e),
                b.regA = d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 186:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), b.regX = b.regS & 255, b.setSign(0 < (b.regX & 128)), b.setZero(0 === (b.regX & 255)), a;
        case 187:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regY & 65535, (d + b.regY & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), c.read8(e), console.log("illegal instruction LAS not implemented"), a;
        case 188:
            return a =
                4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, (d + b.regX & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regY = d & 255, b.setSign(0 < (b.regY & 128)), b.setZero(0 === (b.regY & 255)), a;
        case 189:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, (d + b.regX & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e),
                b.regA = d & 255, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 190:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regY & 65535, (d + b.regY & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regX = d & 255, b.setSign(0 < (b.regX & 128)), b.setZero(0 === (b.regX & 255)), a;
        case 191:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regY & 65535, (d + b.regY & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(),
                c.read8(d & 65280 | d + b.regY & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.regA = d, b.regX = d, b.setSign(0 < (b.regA & 128)), b.setZero(0 === (b.regA & 255)), a;
        case 192:
            return a = 2, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), g = b.regY - e, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), a;
        case 193:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), b.incrementSubcycle(), d = d + b.regX & 255, e = b.read16FromMemWithWrap(d), b.setPC(b.getPC() +
                2 & 65535), b.incrementSubcycle(), d = c.read8(e), g = b.regA - d, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), a;
        case 194:
            return a = 2, b.incrementSubcycle(), c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), a;
        case 195:
            return a = 8, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), b.incrementSubcycle(), d = d + b.regX & 255, e = b.read16FromMemWithWrap(d), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d - 1, 0 > f && (f = 255), g = b.regA - f, b.setCarry(0 <=
                g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 196:
            return a = 3, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), g = b.regY - d, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), a;
        case 197:
            return a = 3, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), g = b.regA - d, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 ===
                (g & 255)), a;
        case 198:
            return a = 5, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d - 1, 0 > f && (f = 255), b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 199:
            return a = 5, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d - 1, 0 > f && (f = 255), g = b.regA - f, b.setCarry(0 <= g &&
                256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 200:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), b.regY++, 255 < b.regY && (b.regY = 0), b.setSign(0 < (b.regY & 128)), b.setZero(0 === (b.regY & 255)), a;
        case 201:
            return a = 2, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), g = b.regA - e, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), a;
        case 202:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), b.regX--,
                0 > b.regX && (b.regX = 255), b.setSign(0 < (b.regX & 128)), b.setZero(0 === (b.regX & 255)), a;
        case 203:
            return a = 2, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), g = (b.regA & b.regX) - e, b.regX = g & 255, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), a;
        case 204:
            return a = 4, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), g = b.regY - d, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), a;
        case 205:
            return a =
                4, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), g = b.regA - d, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), a;
        case 206:
            return a = 6, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d - 1, 0 > f && (f = 255), b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 207:
            return a = 6, e = b.read16FromMemNoWrap(b.getPC() +
                1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d - 1, 0 > f && (f = 255), g = b.regA - f, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 208:
            return a = 2, d = c.read8(b.getPC() + 1 & 65535), e = b.calculateRelativeDifference(b.getPC() | 0, d | 0), (d = !b.getZero()) ? (b.incrementSubcycle(), (b.getPC() + 2 & 65280) !== (e + 2 & 65280) && (a += 1, b.incrementSubcycle()), a += 1, b.incrementSubcycle(), b.setPC(e + 2 & 65535)) : (b.incrementSubcycle(),
                c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535)), a;
        case 209:
            return a = 5, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), d = b.read16FromMemWithWrap(d), e = d + b.regY & 65535, (d + b.regY & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255)), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), g = b.regA - d, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), a;
        case 210:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), console.log("illegal instruction HLT not implemented"),
                a;
        case 211:
            return a = 8, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), d = b.read16FromMemWithWrap(d), e = d + b.regY & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d - 1, 0 > f && (f = 255), g = b.regA - f, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 212:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(),
                c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), c.read8(e), a;
        case 213:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), g = b.regA - d, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), a;
        case 214:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX &
                255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d - 1, 0 > f && (f = 255), b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 215:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d - 1, 0 > f && (f = 255), g = b.regA - f, b.setCarry(0 <= g && 256 > g), b.setSign(0 <
                (g & 128)), b.setZero(0 === (g & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 216:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), b.setDecimal(!1), a;
        case 217:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regY & 65535, (d + b.regY & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), g = b.regA - d, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), a;
        case 218:
            return a = 2, b.setPC(b.getPC() +
                1 & 65535), b.incrementSubcycle(), a;
        case 219:
            return a = 7, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regY & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d - 1, 0 > f && (f = 255), g = b.regA - f, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 220:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, (d + b.regX & 65280) !==
                (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), c.read8(e), a;
        case 221:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, (d + b.regX & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), g = b.regA - d, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), a;
        case 222:
            return a = 7, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535),
                e = d + b.regX & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d - 1, 0 > f && (f = 255), b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 223:
            return a = 7, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d),
                f = d - 1, 0 > f && (f = 255), g = b.regA - f, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 224:
            return a = 2, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), g = b.regX - e, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), a;
        case 225:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), b.incrementSubcycle(), d = d + b.regX & 255, e = b.read16FromMemWithWrap(d), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(),
                d = c.read8(e), g = b.regA - d - (b.getCarry() ? 0 : 1), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ d) & 128), b.setCarry(0 <= g && 256 > g), b.regA = g & 255, a;
        case 226:
            return a = 2, b.incrementSubcycle(), c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), a;
        case 227:
            return a = 8, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), b.incrementSubcycle(), d = d + b.regX & 255, e = b.read16FromMemWithWrap(d), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e,
                d), f = d + 1, 255 < f && (f = 0), b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), g = b.regA - f - (b.getCarry() ? 0 : 1), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ f) & 128), b.setCarry(0 <= g && 256 > g), b.regA = g & 255, b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 228:
            return a = 3, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), g = b.regX - d, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), a;
        case 229:
            return a = 3, b.incrementSubcycle(),
                e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), g = b.regA - d - (b.getCarry() ? 0 : 1), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ d) & 128), b.setCarry(0 <= g && 256 > g), b.regA = g & 255, a;
        case 230:
            return a = 5, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d + 1, 255 < f && (f = 0), b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(),
                c.write8(e, f & 255), a;
        case 231:
            return a = 5, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d + 1, 255 < f && (f = 0), b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), g = b.regA - f - (b.getCarry() ? 0 : 1), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ f) & 128), b.setCarry(0 <= g && 256 > g), b.regA = g & 255, b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 232:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(),
                b.regX++, 255 < b.regX && (b.regX = 0), b.setSign(0 < (b.regX & 128)), b.setZero(0 === (b.regX & 255)), a;
        case 233:
            return a = 2, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535), g = b.regA - e - (b.getCarry() ? 0 : 1), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ e) & 128), b.setCarry(0 <= g && 256 > g), b.regA = g & 255, a;
        case 234:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), a;
        case 235:
            return a = 2, b.incrementSubcycle(), e = c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() +
                2 & 65535), g = b.regA - e - (b.getCarry() ? 0 : 1), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ e) & 128), b.setCarry(0 <= g && 256 > g), b.regA = g & 255, a;
        case 236:
            return a = 4, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), g = b.regX - d, b.setCarry(0 <= g && 256 > g), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), a;
        case 237:
            return a = 4, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), g =
                b.regA - d - (b.getCarry() ? 0 : 1), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ d) & 128), b.setCarry(0 <= g && 256 > g), b.regA = g & 255, a;
        case 238:
            return a = 6, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d + 1, 255 < f && (f = 0), b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 239:
            return a = 6, e = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), b.setPC(b.getPC() +
                3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d + 1, 255 < f && (f = 0), b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), g = b.regA - f - (b.getCarry() ? 0 : 1), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ f) & 128), b.setCarry(0 <= g && 256 > g), b.regA = g & 255, b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 240:
            return a = 2, d = c.read8(b.getPC() + 1 & 65535), e = b.calculateRelativeDifference(b.getPC() | 0, d | 0), (d = b.getZero()) ? (b.incrementSubcycle(), (b.getPC() + 2 & 65280) !==
                (e + 2 & 65280) && (a += 1, b.incrementSubcycle()), a += 1, b.incrementSubcycle(), b.setPC(e + 2 & 65535)) : (b.incrementSubcycle(), c.read8(b.getPC() + 1 & 65535), b.setPC(b.getPC() + 2 & 65535)), a;
        case 241:
            return a = 5, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), d = b.read16FromMemWithWrap(d), e = d + b.regY & 65535, (d + b.regY & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255)), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), g = b.regA - d - (b.getCarry() ? 0 : 1), b.setSign(0 < (g & 128)), b.setZero(0 ===
                (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ d) & 128), b.setCarry(0 <= g && 256 > g), b.regA = g & 255, a;
        case 242:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), console.log("illegal instruction HLT not implemented"), a;
        case 243:
            return a = 8, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), d = b.read16FromMemWithWrap(d), e = d + b.regY & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d + 1, 255 < f && (f = 0), b.setSign(0 < (f & 128)),
                b.setZero(0 === (f & 255)), g = b.regA - f - (b.getCarry() ? 0 : 1), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ f) & 128), b.setCarry(0 <= g && 256 > g), b.regA = g & 255, b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 244:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), c.read8(e), a;
        case 245:
            return a = 4, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX &
                255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), g = b.regA - d - (b.getCarry() ? 0 : 1), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ d) & 128), b.setCarry(0 <= g && 256 > g), b.regA = g & 255, a;
        case 246:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e,
                d), f = d + 1, 255 < f && (f = 0), b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 247:
            return a = 6, b.incrementSubcycle(), d = c.read8(b.getPC() + 1 & 65535), e = d + b.regX & 255, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 2 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d + 1, 255 < f && (f = 0), b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), g = b.regA - f - (b.getCarry() ? 0 : 1), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^
                g) & 128 && (b.regA ^ f) & 128), b.setCarry(0 <= g && 256 > g), b.regA = g & 255, b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 248:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), b.setDecimal(!0), a;
        case 249:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regY & 65535, (d + b.regY & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), g = b.regA - d - (b.getCarry() ? 0 : 1), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^
                g) & 128 && (b.regA ^ d) & 128), b.setCarry(0 <= g && 256 > g), b.regA = g & 255, a;
        case 250:
            return a = 2, b.setPC(b.getPC() + 1 & 65535), b.incrementSubcycle(), a;
        case 251:
            return a = 7, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regY & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regY & 255), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d + 1, 255 < f && (f = 0), b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), g = b.regA - f - (b.getCarry() ? 0 : 1), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)),
                b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ f) & 128), b.setCarry(0 <= g && 256 > g), b.regA = g & 255, b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 252:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, (d + b.regX & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), c.read8(e), a;
        case 253:
            return a = 4, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, (d + b.regX & 65280) !== (d & 65280) && (a++, b.incrementSubcycle(), c.read8(d &
                65280 | d + b.regX & 255)), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), g = b.regA - d - (b.getCarry() ? 0 : 1), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ d) & 128), b.setCarry(0 <= g && 256 > g), b.regA = g & 255, a;
        case 254:
            return a = 7, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d + 1, 255 < f && (f = 0), b.setSign(0 <
                (f & 128)), b.setZero(0 === (f & 255)), b.incrementSubcycle(), c.write8(e, f & 255), a;
        case 255:
            return a = 7, d = b.read16FromMemNoWrap(b.getPC() + 1 & 65535), e = d + b.regX & 65535, b.incrementSubcycle(), c.read8(d & 65280 | d + b.regX & 255), b.setPC(b.getPC() + 3 & 65535), b.incrementSubcycle(), d = c.read8(e), b.incrementSubcycle(), c.write8(e, d), f = d + 1, 255 < f && (f = 0), b.setSign(0 < (f & 128)), b.setZero(0 === (f & 255)), g = b.regA - f - (b.getCarry() ? 0 : 1), b.setSign(0 < (g & 128)), b.setZero(0 === (g & 255)), b.setOverflow((b.regA ^ g) & 128 && (b.regA ^ f) & 128), b.setCarry(0 <=
                g && 256 > g), b.regA = g & 255, b.incrementSubcycle(), c.write8(e, f & 255), a
    }
};
Nes.cpuInstructionsSwitch = executeCpuInstructionSwitch;
this.Nes = this.Nes || {};
"use strict";
var instructions_TRACE = [],
    formatData = {
        programCounter: 0,
        opcode: 0,
        opcodeParam: 0,
        operationParam: 0,
        regs: {}
    };

function BRK_NONE_0_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 0;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.read8(a.getPC());
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.write8(256 + a.regS, a.getPC() >> 8 & 255);
    0 === a.regS ? a.regS = 255 : a.regS--;
    a.incrementSubcycle();
    b.write8(256 + a.regS, a.programCounter & 255);
    0 === a.regS ? a.regS = 255 : a.regS--;
    a.incrementSubcycle();
    b.write8(256 + a.regS, (a.statusRegToByte() | 48) & 255);
    0 === a.regS ? a.regS = 255 : a.regS--;
    a.setPC(a.read16FromMemNoWrap(CPU_IRQ_ADDRESS));
    a.setInterrupt(!0);
    return 7
}
instructions_TRACE[0] = BRK_NONE_0_TRACE;

function ORA_INDIRECTX_1_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 1;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regA |= c & 255;
    a.setSign(0 < (a.regA &
        128));
    a.setZero(0 === (a.regA & 255));
    return 6
}
instructions_TRACE[1] = ORA_INDIRECTX_1_TRACE;

function HLT_NONE_2_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 2;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions_TRACE[2] = HLT_NONE_2_TRACE;

function ASO_INDIRECTX_3_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 3;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c,
        d);
    a.setCarry(0 < (d & 128));
    d = d << 1 & 255;
    a.regA |= d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 8
}
instructions_TRACE[3] = ASO_INDIRECTX_3_TRACE;

function SKB_ZEROPAGE_4_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 4;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    return 3
}
instructions_TRACE[4] = SKB_ZEROPAGE_4_TRACE;

function ORA_ZEROPAGE_5_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 5;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regA |= c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 3
}
instructions_TRACE[5] = ORA_ZEROPAGE_5_TRACE;

function ASL_ZEROPAGE_6_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 6;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    a.setCarry(0 < (d & 128));
    d = (d & 255) << 1 & 255;
    a.setSign(0 < (d & 128));
    a.setZero(0 ===
        (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions_TRACE[6] = ASL_ZEROPAGE_6_TRACE;

function ASO_ZEROPAGE_7_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 7;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    a.setCarry(0 < (d & 128));
    d = d << 1 & 255;
    a.regA |= d;
    a.setSign(0 < (a.regA &
        128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions_TRACE[7] = ASO_ZEROPAGE_7_TRACE;

function PHP_NONE_8_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 8;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.write8(256 + a.regS, (a.statusRegToByte() | 16) & 255);
    0 === a.regS ? a.regS = 255 : a.regS--;
    return 3
}
instructions_TRACE[8] = PHP_NONE_8_TRACE;

function ORA_IMMEDIATE_9_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 9;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.regA |= c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 2
}
instructions_TRACE[9] = ORA_IMMEDIATE_9_TRACE;

function ASL_ACCUMULATOR_10_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 10;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.regA;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.setCarry(0 < (c & 128));
    c = (c & 255) << 1 & 255;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.regA = c & 255;
    return 2
}
instructions_TRACE[10] = ASL_ACCUMULATOR_10_TRACE;

function ANC_IMMEDIATE_11_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 11;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.regA &= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.setCarry(a.getSign());
    return 2
}
instructions_TRACE[11] = ANC_IMMEDIATE_11_TRACE;

function SKW_ABSOLUTE_12_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 12;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    return 4
}
instructions_TRACE[12] = SKW_ABSOLUTE_12_TRACE;

function ORA_ABSOLUTE_13_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 13;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regA |= c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions_TRACE[13] = ORA_ABSOLUTE_13_TRACE;

function ASL_ABSOLUTE_14_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 14;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    a.setCarry(0 < (d & 128));
    d = (d & 255) << 1 & 255;
    a.setSign(0 < (d & 128));
    a.setZero(0 ===
        (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions_TRACE[14] = ASL_ABSOLUTE_14_TRACE;

function ASO_ABSOLUTE_15_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 15;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    a.setCarry(0 < (d & 128));
    d = d << 1 & 255;
    a.regA |= d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions_TRACE[15] = ASO_ABSOLUTE_15_TRACE;

function BPL_RELATIVE_16_TRACE(a, b) {
    var c = 2;
    formatData.programCounter = a.getPC();
    formatData.opcode = 16;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = b.read8(a.getPC() + 1 & 65535),
        e = a.calculateRelativeDifference(a.getPC() | 0, d | 0);
    formatData.opcodeParam = d;
    formatData.operationParam = e + 2 & 65535;
    a.getSign() ? (a.incrementSubcycle(), b.read8(a.getPC() + 1 & 65535), a.setPC(a.getPC() + 2 & 65535)) : (a.incrementSubcycle(), (a.getPC() +
        2 & 65280) !== (e + 2 & 65280) && (c += 1, a.incrementSubcycle()), c += 1, a.incrementSubcycle(), a.setPC(e + 2 & 65535));
    return c
}
instructions_TRACE[16] = BPL_RELATIVE_16_TRACE;

function ORA_INDIRECTY_17_TRACE(a, b) {
    var c = 5;
    formatData.programCounter = a.getPC();
    formatData.opcode = 17;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var d = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var d = a.read16FromMemWithWrap(d),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam = d;
    a.regA |= d & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions_TRACE[17] = ORA_INDIRECTY_17_TRACE;

function HLT_NONE_18_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 18;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions_TRACE[18] = HLT_NONE_18_TRACE;

function ASO_INDIRECTY_19_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 19;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var c = a.read16FromMemWithWrap(c),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam =
        c;
    a.incrementSubcycle();
    b.write8(d, c);
    a.setCarry(0 < (c & 128));
    c = c << 1 & 255;
    a.regA |= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 8
}
instructions_TRACE[19] = ASO_INDIRECTY_19_TRACE;

function SKB_ZEROPAGEX_20_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 20;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    return 4
}
instructions_TRACE[20] = SKB_ZEROPAGEX_20_TRACE;

function ORA_ZEROPAGEX_21_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 21;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.regA |= c & 255;
    a.setSign(0 < (a.regA &
        128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions_TRACE[21] = ORA_ZEROPAGEX_21_TRACE;

function ASL_ZEROPAGEX_22_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 22;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    a.setCarry(0 < (c & 128));
    c = (c & 255) << 1 & 255;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions_TRACE[22] = ASL_ZEROPAGEX_22_TRACE;

function ASO_ZEROPAGEX_23_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 23;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    a.setCarry(0 < (c & 128));
    c = c << 1 & 255;
    a.regA |= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions_TRACE[23] = ASO_ZEROPAGEX_23_TRACE;

function CLC_NONE_24_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 24;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.setCarry(!1);
    return 2
}
instructions_TRACE[24] = CLC_NONE_24_TRACE;

function ORA_ABSOLUTEY_25_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 25;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    a.regA |= d & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions_TRACE[25] = ORA_ABSOLUTEY_25_TRACE;

function NOP_NONE_26_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 26;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    return 2
}
instructions_TRACE[26] = NOP_NONE_26_TRACE;

function ASO_ABSOLUTEY_27_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 27;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    a.setCarry(0 < (c & 128));
    c = c << 1 & 255;
    a.regA |= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions_TRACE[27] = ASO_ABSOLUTEY_27_TRACE;

function SKW_ABSOLUTEX_28_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 28;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    return c
}
instructions_TRACE[28] = SKW_ABSOLUTEX_28_TRACE;

function ORA_ABSOLUTEX_29_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 29;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    a.regA |= d & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions_TRACE[29] = ORA_ABSOLUTEX_29_TRACE;

function ASL_ABSOLUTEX_30_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 30;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    a.setCarry(0 < (c & 128));
    c = (c & 255) << 1 & 255;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions_TRACE[30] = ASL_ABSOLUTEX_30_TRACE;

function ASO_ABSOLUTEX_31_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 31;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    a.setCarry(0 < (c & 128));
    c = c << 1 & 255;
    a.regA |= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions_TRACE[31] = ASO_ABSOLUTEX_31_TRACE;

function JSR_IMMEDIATE16_32_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 32;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    var d = a.getPC() - 1;
    0 > d && (d = 65535);
    a.incrementSubcycle();
    b.write8(256 + a.regS, d >> 8 & 255);
    0 === a.regS ? a.regS = 255 : a.regS--;
    a.incrementSubcycle();
    b.write8(256 + a.regS, d & 255);
    0 ===
        a.regS ? a.regS = 255 : a.regS--;
    a.incrementSubcycle();
    a.setPC(c & 65535);
    return 6
}
instructions_TRACE[32] = JSR_IMMEDIATE16_32_TRACE;

function AND_INDIRECTX_33_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 33;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regA = a.regA & c & 255;
    a.setSign(0 <
        (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 6
}
instructions_TRACE[33] = AND_INDIRECTX_33_TRACE;

function HLT_NONE_34_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 34;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions_TRACE[34] = HLT_NONE_34_TRACE;

function RLA_INDIRECTX_35_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 35;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c,
        d);
    d = d << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    d &= 255;
    a.regA &= d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 8
}
instructions_TRACE[35] = RLA_INDIRECTX_35_TRACE;

function BIT_ZEROPAGE_36_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 36;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    8194 === (c & 57351) && a.mainboard.ppu.bitOperationHappening();
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (a.regA &
        c & 255));
    a.setOverflow(0 < (c & 64));
    return 3
}
instructions_TRACE[36] = BIT_ZEROPAGE_36_TRACE;

function AND_ZEROPAGE_37_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 37;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regA = a.regA & c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 3
}
instructions_TRACE[37] = AND_ZEROPAGE_37_TRACE;

function ROL_ZEROPAGE_38_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 38;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    d = (d & 255) << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    d &= 255;
    a.setSign(0 <
        (d & 128));
    a.setZero(0 === (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions_TRACE[38] = ROL_ZEROPAGE_38_TRACE;

function RLA_ZEROPAGE_39_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 39;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    d = d << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    d &= 255;
    a.regA &=
        d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions_TRACE[39] = RLA_ZEROPAGE_39_TRACE;

function PLP_NONE_40_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 40;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.waitOneInstructionAfterCli = !0 === a.getInterrupt();
    a.incrementSubcycle();
    b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    255 === a.regS ? a.regS = 0 : a.regS++;
    a.incrementSubcycle();
    var c = b.read8(256 + a.regS);
    a.statusRegFromByte(c);
    a.setBreak(!0);
    a.setUnused(!0);
    a.waitOneInstructionAfterCli && (a.waitOneInstructionAfterCli = !1 === a.getInterrupt());
    return 4
}
instructions_TRACE[40] = PLP_NONE_40_TRACE;

function AND_IMMEDIATE_41_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 41;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.regA = a.regA & c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 2
}
instructions_TRACE[41] = AND_IMMEDIATE_41_TRACE;

function ROL_ACCUMULATOR_42_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 42;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.regA;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    c = (c & 255) << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < c);
    c &= 255;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.regA = c & 255;
    return 2
}
instructions_TRACE[42] = ROL_ACCUMULATOR_42_TRACE;

function ANC_IMMEDIATE_43_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 43;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.regA &= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.setCarry(a.getSign());
    return 2
}
instructions_TRACE[43] = ANC_IMMEDIATE_43_TRACE;

function BIT_ABSOLUTE_44_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 44;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    8194 === (c & 57351) && a.mainboard.ppu.bitOperationHappening();
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (a.regA & c & 255));
    a.setOverflow(0 < (c & 64));
    return 4
}
instructions_TRACE[44] = BIT_ABSOLUTE_44_TRACE;

function AND_ABSOLUTE_45_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 45;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regA = a.regA & c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions_TRACE[45] = AND_ABSOLUTE_45_TRACE;

function ROL_ABSOLUTE_46_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 46;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    d = (d & 255) << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    d &= 255;
    a.setSign(0 <
        (d & 128));
    a.setZero(0 === (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions_TRACE[46] = ROL_ABSOLUTE_46_TRACE;

function RLA_ABSOLUTE_47_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 47;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    d = d << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    d &= 255;
    a.regA &= d;
    a.setSign(0 <
        (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions_TRACE[47] = RLA_ABSOLUTE_47_TRACE;

function BMI_RELATIVE_48_TRACE(a, b) {
    var c = 2;
    formatData.programCounter = a.getPC();
    formatData.opcode = 48;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = b.read8(a.getPC() + 1 & 65535),
        e = a.calculateRelativeDifference(a.getPC() | 0, d | 0);
    formatData.opcodeParam = d;
    formatData.operationParam = e + 2 & 65535;
    a.getSign() ? (a.incrementSubcycle(), (a.getPC() + 2 & 65280) !== (e + 2 & 65280) && (c += 1, a.incrementSubcycle()), c += 1, a.incrementSubcycle(),
        a.setPC(e + 2 & 65535)) : (a.incrementSubcycle(), b.read8(a.getPC() + 1 & 65535), a.setPC(a.getPC() + 2 & 65535));
    return c
}
instructions_TRACE[48] = BMI_RELATIVE_48_TRACE;

function AND_INDIRECTY_49_TRACE(a, b) {
    var c = 5;
    formatData.programCounter = a.getPC();
    formatData.opcode = 49;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var d = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var d = a.read16FromMemWithWrap(d),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam = d;
    a.regA = a.regA & d & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions_TRACE[49] = AND_INDIRECTY_49_TRACE;

function HLT_NONE_50_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 50;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions_TRACE[50] = HLT_NONE_50_TRACE;

function RLA_INDIRECTY_51_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 51;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var c = a.read16FromMemWithWrap(c),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam =
        c;
    a.incrementSubcycle();
    b.write8(d, c);
    c = c << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < c);
    c &= 255;
    a.regA &= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 8
}
instructions_TRACE[51] = RLA_INDIRECTY_51_TRACE;

function SKB_ZEROPAGEX_52_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 52;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    return 4
}
instructions_TRACE[52] = SKB_ZEROPAGEX_52_TRACE;

function AND_ZEROPAGEX_53_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 53;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.regA = a.regA & c & 255;
    a.setSign(0 <
        (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions_TRACE[53] = AND_ZEROPAGEX_53_TRACE;

function ROL_ZEROPAGEX_54_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 54;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    c = (c & 255) << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < c);
    c &= 255;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions_TRACE[54] = ROL_ZEROPAGEX_54_TRACE;

function RLA_ZEROPAGEX_55_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 55;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    c = c << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < c);
    c &= 255;
    a.regA &= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions_TRACE[55] = RLA_ZEROPAGEX_55_TRACE;

function SEC_NONE_56_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 56;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.setCarry(!0);
    return 2
}
instructions_TRACE[56] = SEC_NONE_56_TRACE;

function AND_ABSOLUTEY_57_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 57;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    a.regA = a.regA & d & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions_TRACE[57] = AND_ABSOLUTEY_57_TRACE;

function NOP_NONE_58_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 58;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    return 2
}
instructions_TRACE[58] = NOP_NONE_58_TRACE;

function RLA_ABSOLUTEY_59_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 59;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    c = c << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < c);
    c &= 255;
    a.regA &= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions_TRACE[59] = RLA_ABSOLUTEY_59_TRACE;

function SKW_ABSOLUTEX_60_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 60;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    return c
}
instructions_TRACE[60] = SKW_ABSOLUTEX_60_TRACE;

function AND_ABSOLUTEX_61_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 61;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    a.regA = a.regA & d & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions_TRACE[61] = AND_ABSOLUTEX_61_TRACE;

function ROL_ABSOLUTEX_62_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 62;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    c = (c & 255) << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < c);
    c &= 255;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions_TRACE[62] = ROL_ABSOLUTEX_62_TRACE;

function RLA_ABSOLUTEX_63_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 63;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    c = c << 1 | (a.getCarry() ? 1 : 0);
    a.setCarry(255 < c);
    c &= 255;
    a.regA &= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions_TRACE[63] = RLA_ABSOLUTEX_63_TRACE;

function RTI_NONE_64_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 64;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.read8(a.getPC());
    a.incrementSubcycle();
    255 === a.regS ? a.regS = 0 : a.regS++;
    a.incrementSubcycle();
    var c = b.read8(256 + a.regS);
    a.statusRegFromByte(c);
    255 === a.regS ? a.regS = 0 : a.regS++;
    a.incrementSubcycle();
    a.programCounter = b.read8(256 +
        a.regS);
    255 === a.regS ? a.regS = 0 : a.regS++;
    a.incrementSubcycle();
    c = b.read8(256 + a.regS);
    a.programCounter |= (c & 255) << 8;
    a.setBreak(!0);
    a.setUnused(!0);
    return 6
}
instructions_TRACE[64] = RTI_NONE_64_TRACE;

function EOR_INDIRECTX_65_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 65;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regA = (a.regA ^ c & 255) & 255;
    a.setSign(0 <
        (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 6
}
instructions_TRACE[65] = EOR_INDIRECTX_65_TRACE;

function HLT_NONE_66_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 66;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions_TRACE[66] = HLT_NONE_66_TRACE;

function LSE_INDIRECTX_67_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 67;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c,
        d);
    a.setCarry(0 < (d & 1));
    d = d >> 1 & 255;
    a.regA ^= d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 8
}
instructions_TRACE[67] = LSE_INDIRECTX_67_TRACE;

function SKB_ZEROPAGE_68_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 68;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    return 3
}
instructions_TRACE[68] = SKB_ZEROPAGE_68_TRACE;

function EOR_ZEROPAGE_69_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 69;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regA = (a.regA ^ c & 255) & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 3
}
instructions_TRACE[69] = EOR_ZEROPAGE_69_TRACE;

function LSR_ZEROPAGE_70_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 70;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    a.setCarry(0 < (d & 1));
    d = (d & 255) >> 1;
    a.setSign(0 < (d & 128));
    a.setZero(0 ===
        (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions_TRACE[70] = LSR_ZEROPAGE_70_TRACE;

function LSE_ZEROPAGE_71_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 71;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    a.setCarry(0 < (d & 1));
    d = d >> 1 & 255;
    a.regA ^= d;
    a.setSign(0 < (a.regA &
        128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions_TRACE[71] = LSE_ZEROPAGE_71_TRACE;

function PHA_NONE_72_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 72;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.write8(256 + a.regS, a.regA & 255);
    0 === a.regS ? a.regS = 255 : a.regS--;
    return 3
}
instructions_TRACE[72] = PHA_NONE_72_TRACE;

function EOR_IMMEDIATE_73_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 73;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.regA = (a.regA ^ c & 255) & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 2
}
instructions_TRACE[73] = EOR_IMMEDIATE_73_TRACE;

function LSR_ACCUMULATOR_74_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 74;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.regA;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.setCarry(0 < (c & 1));
    c = (c & 255) >> 1;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.regA = c & 255;
    return 2
}
instructions_TRACE[74] = LSR_ACCUMULATOR_74_TRACE;

function ALR_IMMEDIATE_75_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 75;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.regA &= c;
    a.setCarry(0 < (a.regA & 1));
    a.regA = a.regA >> 1 & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 2
}
instructions_TRACE[75] = ALR_IMMEDIATE_75_TRACE;

function JMP_IMMEDIATE16_76_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 76;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.setPC(c & 65535);
    return 3
}
instructions_TRACE[76] = JMP_IMMEDIATE16_76_TRACE;

function EOR_ABSOLUTE_77_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 77;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regA = (a.regA ^ c & 255) & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions_TRACE[77] = EOR_ABSOLUTE_77_TRACE;

function LSR_ABSOLUTE_78_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 78;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    a.setCarry(0 < (d & 1));
    d = (d & 255) >> 1;
    a.setSign(0 < (d & 128));
    a.setZero(0 ===
        (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions_TRACE[78] = LSR_ABSOLUTE_78_TRACE;

function LSE_ABSOLUTE_79_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 79;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    a.setCarry(0 < (d & 1));
    d = d >> 1 & 255;
    a.regA ^= d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions_TRACE[79] = LSE_ABSOLUTE_79_TRACE;

function BVC_RELATIVE_80_TRACE(a, b) {
    var c = 2;
    formatData.programCounter = a.getPC();
    formatData.opcode = 80;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = b.read8(a.getPC() + 1 & 65535),
        e = a.calculateRelativeDifference(a.getPC() | 0, d | 0);
    formatData.opcodeParam = d;
    formatData.operationParam = e + 2 & 65535;
    a.getOverflow() ? (a.incrementSubcycle(), b.read8(a.getPC() + 1 & 65535), a.setPC(a.getPC() + 2 & 65535)) : (a.incrementSubcycle(), (a.getPC() +
        2 & 65280) !== (e + 2 & 65280) && (c += 1, a.incrementSubcycle()), c += 1, a.incrementSubcycle(), a.setPC(e + 2 & 65535));
    return c
}
instructions_TRACE[80] = BVC_RELATIVE_80_TRACE;

function EOR_INDIRECTY_81_TRACE(a, b) {
    var c = 5;
    formatData.programCounter = a.getPC();
    formatData.opcode = 81;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var d = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var d = a.read16FromMemWithWrap(d),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam = d;
    a.regA = (a.regA ^ d & 255) & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions_TRACE[81] = EOR_INDIRECTY_81_TRACE;

function HLT_NONE_82_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 82;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions_TRACE[82] = HLT_NONE_82_TRACE;

function LSE_INDIRECTY_83_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 83;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var c = a.read16FromMemWithWrap(c),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam =
        c;
    a.incrementSubcycle();
    b.write8(d, c);
    a.setCarry(0 < (c & 1));
    c = c >> 1 & 255;
    a.regA ^= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 8
}
instructions_TRACE[83] = LSE_INDIRECTY_83_TRACE;

function SKB_ZEROPAGEX_84_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 84;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    return 4
}
instructions_TRACE[84] = SKB_ZEROPAGEX_84_TRACE;

function EOR_ZEROPAGEX_85_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 85;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.regA = (a.regA ^ c & 255) & 255;
    a.setSign(0 <
        (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions_TRACE[85] = EOR_ZEROPAGEX_85_TRACE;

function LSR_ZEROPAGEX_86_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 86;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    a.setCarry(0 < (c & 1));
    c = (c & 255) >> 1;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions_TRACE[86] = LSR_ZEROPAGEX_86_TRACE;

function LSE_ZEROPAGEX_87_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 87;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    a.setCarry(0 < (c & 1));
    c = c >> 1 & 255;
    a.regA ^= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions_TRACE[87] = LSE_ZEROPAGEX_87_TRACE;

function CLI_NONE_88_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 88;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.waitOneInstructionAfterCli = !0 === a.getInterrupt();
    a.setInterrupt(!1);
    return 2
}
instructions_TRACE[88] = CLI_NONE_88_TRACE;

function EOR_ABSOLUTEY_89_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 89;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    a.regA = (a.regA ^ d & 255) & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions_TRACE[89] = EOR_ABSOLUTEY_89_TRACE;

function NOP_NONE_90_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 90;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    return 2
}
instructions_TRACE[90] = NOP_NONE_90_TRACE;

function LSE_ABSOLUTEY_91_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 91;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    a.setCarry(0 < (c & 1));
    c = c >> 1 & 255;
    a.regA ^= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions_TRACE[91] = LSE_ABSOLUTEY_91_TRACE;

function SKW_ABSOLUTEX_92_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 92;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    return c
}
instructions_TRACE[92] = SKW_ABSOLUTEX_92_TRACE;

function EOR_ABSOLUTEX_93_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 93;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    a.regA = (a.regA ^ d & 255) & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions_TRACE[93] = EOR_ABSOLUTEX_93_TRACE;

function LSR_ABSOLUTEX_94_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 94;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    a.setCarry(0 < (c & 1));
    c = (c & 255) >> 1;
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions_TRACE[94] = LSR_ABSOLUTEX_94_TRACE;

function LSE_ABSOLUTEX_95_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 95;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    a.setCarry(0 < (c & 1));
    c = c >> 1 & 255;
    a.regA ^= c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions_TRACE[95] = LSE_ABSOLUTEX_95_TRACE;

function RTS_NONE_96_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 96;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.read8(a.getPC());
    a.incrementSubcycle();
    255 === a.regS ? a.regS = 0 : a.regS++;
    a.incrementSubcycle();
    a.programCounter = b.read8(256 + a.regS);
    255 === a.regS ? a.regS = 0 : a.regS++;
    a.incrementSubcycle();
    var c = b.read8(256 + a.regS);
    a.programCounter |=
        (c & 255) << 8;
    a.incrementSubcycle();
    a.programCounter = a.getPC() + 1 & 65535;
    return 6
}
instructions_TRACE[96] = RTS_NONE_96_TRACE;

function ADC_INDIRECTX_97_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 97;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    var d = (c & 255) + a.regA + (a.getCarry() ?
        1 : 0);
    a.setCarry(255 < d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c ^ 255) & 128);
    a.regA = d & 255;
    return 6
}
instructions_TRACE[97] = ADC_INDIRECTX_97_TRACE;

function HLT_NONE_98_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 98;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions_TRACE[98] = HLT_NONE_98_TRACE;

function RRA_INDIRECTX_99_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 99;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c,
        d);
    var e = d >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(0 < (d & 1));
    d = (e & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ e ^ 255) & 128);
    a.regA = d & 255;
    e &= 255;
    a.incrementSubcycle();
    b.write8(c, e & 255);
    return 8
}
instructions_TRACE[99] = RRA_INDIRECTX_99_TRACE;

function SKB_ZEROPAGE_100_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 100;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    return 3
}
instructions_TRACE[100] = SKB_ZEROPAGE_100_TRACE;

function ADC_ZEROPAGE_101_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 101;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    var d = (c & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c ^ 255) & 128);
    a.regA = d & 255;
    return 3
}
instructions_TRACE[101] = ADC_ZEROPAGE_101_TRACE;

function ROR_ZEROPAGE_102_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 102;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    var e = (d & 255) >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(d & 1);
    a.setSign(0 <
        (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(c, e & 255);
    return 5
}
instructions_TRACE[102] = ROR_ZEROPAGE_102_TRACE;

function RRA_ZEROPAGE_103_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 103;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    var e = d >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(0 < (d & 1));
    d = (e &
        255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ e ^ 255) & 128);
    a.regA = d & 255;
    e &= 255;
    a.incrementSubcycle();
    b.write8(c, e & 255);
    return 5
}
instructions_TRACE[103] = RRA_ZEROPAGE_103_TRACE;

function PLA_NONE_104_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 104;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    b.read8(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    255 === a.regS ? a.regS = 0 : a.regS++;
    a.incrementSubcycle();
    a.regA = b.read8(256 + a.regS);
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions_TRACE[104] = PLA_NONE_104_TRACE;

function ADC_IMMEDIATE_105_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 105;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    var d = (c & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c ^ 255) & 128);
    a.regA =
        d & 255;
    return 2
}
instructions_TRACE[105] = ADC_IMMEDIATE_105_TRACE;

function ROR_ACCUMULATOR_106_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 106;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.regA;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    var d = (c & 255) >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(c & 1);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.regA = d & 255;
    return 2
}
instructions_TRACE[106] = ROR_ACCUMULATOR_106_TRACE;

function ARR_IMMEDIATE_107_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 107;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.regA = a.regA & c & 255;
    a.regA = a.regA >> 1 & 255 | (a.getCarry() ? 128 : 0);
    a.setCarry(0 < (a.regA & 1));
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    a.setOverflow(!1);
    a.setCarry(!1);
    switch (a.regA & 96) {
        case 32:
            a.setOverflow(!0);
            break;
        case 64:
            a.setOverflow(!0);
            a.setCarry(!0);
            break;
        case 96:
            a.setCarry(!0)
    }
    return 2
}
instructions_TRACE[107] = ARR_IMMEDIATE_107_TRACE;

function JMP_INDIRECT_108_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 108;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 3 & 65535);
    a.setPC(c & 65535);
    return 5
}
instructions_TRACE[108] = JMP_INDIRECT_108_TRACE;

function ADC_ABSOLUTE_109_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 109;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    var d = (c & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^
        d) & 128 && (a.regA ^ c ^ 255) & 128);
    a.regA = d & 255;
    return 4
}
instructions_TRACE[109] = ADC_ABSOLUTE_109_TRACE;

function ROR_ABSOLUTE_110_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 110;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    var e = (d & 255) >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(d & 1);
    a.setSign(0 <
        (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(c, e & 255);
    return 6
}
instructions_TRACE[110] = ROR_ABSOLUTE_110_TRACE;

function RRA_ABSOLUTE_111_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 111;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    var e = d >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(0 < (d & 1));
    d = (e & 255) + a.regA +
        (a.getCarry() ? 1 : 0);
    a.setCarry(255 < d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ e ^ 255) & 128);
    a.regA = d & 255;
    e &= 255;
    a.incrementSubcycle();
    b.write8(c, e & 255);
    return 6
}
instructions_TRACE[111] = RRA_ABSOLUTE_111_TRACE;

function BVS_RELATIVE_112_TRACE(a, b) {
    var c = 2;
    formatData.programCounter = a.getPC();
    formatData.opcode = 112;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = b.read8(a.getPC() + 1 & 65535),
        e = a.calculateRelativeDifference(a.getPC() | 0, d | 0);
    formatData.opcodeParam = d;
    formatData.operationParam = e + 2 & 65535;
    a.getOverflow() ? (a.incrementSubcycle(), (a.getPC() + 2 & 65280) !== (e + 2 & 65280) && (c += 1, a.incrementSubcycle()), c += 1, a.incrementSubcycle(),
        a.setPC(e + 2 & 65535)) : (a.incrementSubcycle(), b.read8(a.getPC() + 1 & 65535), a.setPC(a.getPC() + 2 & 65535));
    return c
}
instructions_TRACE[112] = BVS_RELATIVE_112_TRACE;

function ADC_INDIRECTY_113_TRACE(a, b) {
    var c = 5;
    formatData.programCounter = a.getPC();
    formatData.opcode = 113;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var d = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var d = a.read16FromMemWithWrap(d),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam = d;
    e = (d & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ d ^ 255) & 128);
    a.regA = e & 255;
    return c
}
instructions_TRACE[113] = ADC_INDIRECTY_113_TRACE;

function HLT_NONE_114_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 114;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions_TRACE[114] = HLT_NONE_114_TRACE;

function RRA_INDIRECTY_115_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 115;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var c = a.read16FromMemWithWrap(c),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var e = b.read8(d);
    formatData.operationParam =
        e;
    a.incrementSubcycle();
    b.write8(d, e);
    c = e >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(0 < (e & 1));
    e = (c & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ c ^ 255) & 128);
    a.regA = e & 255;
    c &= 255;
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 8
}
instructions_TRACE[115] = RRA_INDIRECTY_115_TRACE;

function SKB_ZEROPAGEX_116_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 116;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    return 4
}
instructions_TRACE[116] = SKB_ZEROPAGEX_116_TRACE;

function ADC_ZEROPAGEX_117_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 117;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    d = (c & 255) + a.regA + (a.getCarry() ?
        1 : 0);
    a.setCarry(255 < d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c ^ 255) & 128);
    a.regA = d & 255;
    return 4
}
instructions_TRACE[117] = ADC_ZEROPAGEX_117_TRACE;

function ROR_ZEROPAGEX_118_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 118;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    var e = (c & 255) >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(c & 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(d, e & 255);
    return 6
}
instructions_TRACE[118] = ROR_ZEROPAGEX_118_TRACE;

function RRA_ZEROPAGEX_119_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 119;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var e = b.read8(d);
    formatData.operationParam = e;
    a.incrementSubcycle();
    b.write8(d, e);
    c = e >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(0 < (e & 1));
    e = (c & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ c ^ 255) & 128);
    a.regA = e & 255;
    c &= 255;
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions_TRACE[119] = RRA_ZEROPAGEX_119_TRACE;

function SEI_NONE_120_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 120;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.setInterrupt(!0);
    return 2
}
instructions_TRACE[120] = SEI_NONE_120_TRACE;

function ADC_ABSOLUTEY_121_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 121;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    e = (d & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ d ^ 255) & 128);
    a.regA = e & 255;
    return c
}
instructions_TRACE[121] = ADC_ABSOLUTEY_121_TRACE;

function NOP_NONE_122_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 122;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    return 2
}
instructions_TRACE[122] = NOP_NONE_122_TRACE;

function RRA_ABSOLUTEY_123_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 123;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var e = b.read8(d);
    formatData.operationParam = e;
    a.incrementSubcycle();
    b.write8(d,
        e);
    c = e >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(0 < (e & 1));
    e = (c & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ c ^ 255) & 128);
    a.regA = e & 255;
    c &= 255;
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions_TRACE[123] = RRA_ABSOLUTEY_123_TRACE;

function SKW_ABSOLUTEX_124_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 124;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    return c
}
instructions_TRACE[124] = SKW_ABSOLUTEX_124_TRACE;

function ADC_ABSOLUTEX_125_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 125;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    e = (d & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ d ^ 255) & 128);
    a.regA = e & 255;
    return c
}
instructions_TRACE[125] = ADC_ABSOLUTEX_125_TRACE;

function ROR_ABSOLUTEX_126_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 126;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    var e = (c & 255) >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(c & 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(d, e & 255);
    return 7
}
instructions_TRACE[126] = ROR_ABSOLUTEX_126_TRACE;

function RRA_ABSOLUTEX_127_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 127;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var e = b.read8(d);
    formatData.operationParam = e;
    a.incrementSubcycle();
    b.write8(d,
        e);
    c = e >> 1 | (a.getCarry() ? 128 : 0);
    a.setCarry(0 < (e & 1));
    e = (c & 255) + a.regA + (a.getCarry() ? 1 : 0);
    a.setCarry(255 < e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ c ^ 255) & 128);
    a.regA = e & 255;
    c &= 255;
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions_TRACE[127] = RRA_ABSOLUTEX_127_TRACE;

function SKB_IMMEDIATE_128_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 128;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    return 2
}
instructions_TRACE[128] = SKB_IMMEDIATE_128_TRACE;

function STA_INDIRECTX_129_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 129;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    var d = a.regA;
    a.incrementSubcycle();
    b.write8(c, d);
    return 6
}
instructions_TRACE[129] = STA_INDIRECTX_129_TRACE;

function SKB_IMMEDIATE_130_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 130;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    return 2
}
instructions_TRACE[130] = SKB_IMMEDIATE_130_TRACE;

function AXS_INDIRECTX_131_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 131;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    var d = a.regA & a.regX;
    a.incrementSubcycle();
    b.write8(c, d);
    return 6
}
instructions_TRACE[131] = AXS_INDIRECTX_131_TRACE;

function STY_ZEROPAGE_132_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 132;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    var d = a.regY;
    a.incrementSubcycle();
    b.write8(c, d);
    return 3
}
instructions_TRACE[132] = STY_ZEROPAGE_132_TRACE;

function STA_ZEROPAGE_133_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 133;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    var d = a.regA;
    a.incrementSubcycle();
    b.write8(c, d);
    return 3
}
instructions_TRACE[133] = STA_ZEROPAGE_133_TRACE;

function STX_ZEROPAGE_134_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 134;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    var d = a.regX;
    a.incrementSubcycle();
    b.write8(c, d);
    return 3
}
instructions_TRACE[134] = STX_ZEROPAGE_134_TRACE;

function AXS_ZEROPAGE_135_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 135;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    var d = a.regA & a.regX;
    a.incrementSubcycle();
    b.write8(c, d);
    return 3
}
instructions_TRACE[135] = AXS_ZEROPAGE_135_TRACE;

function DEY_NONE_136_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 136;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regY--;
    0 > a.regY && (a.regY = 255);
    a.setSign(0 < (a.regY & 128));
    a.setZero(0 === (a.regY & 255));
    return 2
}
instructions_TRACE[136] = DEY_NONE_136_TRACE;

function SKB_IMMEDIATE_137_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 137;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    return 2
}
instructions_TRACE[137] = SKB_IMMEDIATE_137_TRACE;

function TXA_NONE_138_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 138;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regA = a.regX;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 2
}
instructions_TRACE[138] = TXA_NONE_138_TRACE;

function XAA_IMMEDIATE_139_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 139;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.regA = a.regX & c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 2
}
instructions_TRACE[139] = XAA_IMMEDIATE_139_TRACE;

function STY_ABSOLUTE_140_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 140;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    var d = a.regY;
    a.incrementSubcycle();
    b.write8(c, d);
    return 4
}
instructions_TRACE[140] = STY_ABSOLUTE_140_TRACE;

function STA_ABSOLUTE_141_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 141;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    var d = a.regA;
    a.incrementSubcycle();
    b.write8(c, d);
    return 4
}
instructions_TRACE[141] = STA_ABSOLUTE_141_TRACE;

function STX_ABSOLUTE_142_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 142;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    var d = a.regX;
    a.incrementSubcycle();
    b.write8(c, d);
    return 4
}
instructions_TRACE[142] = STX_ABSOLUTE_142_TRACE;

function AXS_ABSOLUTE_143_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 143;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    var d = a.regA & a.regX;
    a.incrementSubcycle();
    b.write8(c, d);
    return 4
}
instructions_TRACE[143] = AXS_ABSOLUTE_143_TRACE;

function BCC_RELATIVE_144_TRACE(a, b) {
    var c = 2;
    formatData.programCounter = a.getPC();
    formatData.opcode = 144;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = b.read8(a.getPC() + 1 & 65535),
        e = a.calculateRelativeDifference(a.getPC() | 0, d | 0);
    formatData.opcodeParam = d;
    formatData.operationParam = e + 2 & 65535;
    a.getCarry() ? (a.incrementSubcycle(), b.read8(a.getPC() + 1 & 65535), a.setPC(a.getPC() + 2 & 65535)) : (a.incrementSubcycle(), (a.getPC() +
        2 & 65280) !== (e + 2 & 65280) && (c += 1, a.incrementSubcycle()), c += 1, a.incrementSubcycle(), a.setPC(e + 2 & 65535));
    return c
}
instructions_TRACE[144] = BCC_RELATIVE_144_TRACE;

function STA_INDIRECTY_145_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 145;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var c = a.read16FromMemWithWrap(c),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    c = a.regA;
    a.incrementSubcycle();
    b.write8(d, c);
    return 6
}
instructions_TRACE[145] = STA_INDIRECTY_145_TRACE;

function HLT_NONE_146_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 146;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions_TRACE[146] = HLT_NONE_146_TRACE;

function AXA_INDIRECTY_147_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 147;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var c = a.read16FromMemWithWrap(c),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    c = a.regX & a.regA & 7;
    a.incrementSubcycle();
    b.write8(d, c);
    return 6
}
instructions_TRACE[147] = AXA_INDIRECTY_147_TRACE;

function STY_ZEROPAGEX_148_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 148;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    c = a.regY;
    a.incrementSubcycle();
    b.write8(d, c);
    return 4
}
instructions_TRACE[148] = STY_ZEROPAGEX_148_TRACE;

function STA_ZEROPAGEX_149_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 149;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    c = a.regA;
    a.incrementSubcycle();
    b.write8(d, c);
    return 4
}
instructions_TRACE[149] = STA_ZEROPAGEX_149_TRACE;

function STX_ZEROPAGEY_150_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 150;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regY & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    c = a.regX;
    a.incrementSubcycle();
    b.write8(d, c);
    return 4
}
instructions_TRACE[150] = STX_ZEROPAGEY_150_TRACE;

function AXS_ZEROPAGEY_151_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 151;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regY & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    c = a.regA & a.regX;
    a.incrementSubcycle();
    b.write8(d, c);
    return 4
}
instructions_TRACE[151] = AXS_ZEROPAGEY_151_TRACE;

function TYA_NONE_152_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 152;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regA = a.regY;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 2
}
instructions_TRACE[152] = TYA_NONE_152_TRACE;

function STA_ABSOLUTEY_153_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 153;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    c = a.regA;
    a.incrementSubcycle();
    b.write8(d, c);
    return 5
}
instructions_TRACE[153] = STA_ABSOLUTEY_153_TRACE;

function TXS_NONE_154_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 154;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regS = a.regX;
    return 2
}
instructions_TRACE[154] = TXS_NONE_154_TRACE;

function TAS_ABSOLUTEY_155_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 155;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.regS = a.regX & a.regA;
    return 5
}
instructions_TRACE[155] = TAS_ABSOLUTEY_155_TRACE;

function SAY_SAY_156_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 156;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.SAYHighByte = b.read8(a.getPC() + 2 & 65535);
    c |= a.SAYHighByte << 8;
    c = c + a.regX & 65535;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    d = a.regY & a.SAYHighByte + 1 & 255;
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions_TRACE[156] = SAY_SAY_156_TRACE;

function STA_ABSOLUTEX_157_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 157;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    c = a.regA;
    a.incrementSubcycle();
    b.write8(d, c);
    return 5
}
instructions_TRACE[157] = STA_ABSOLUTEX_157_TRACE;

function XAS_ABSOLUTEY_158_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 158;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    console.log("illegal instruction XAS not implemented");
    a.incrementSubcycle();
    b.write8(d, 0);
    return 5
}
instructions_TRACE[158] = XAS_ABSOLUTEY_158_TRACE;

function AXA_ABSOLUTEY_159_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 159;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    c = a.regX & a.regA & 7;
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 5
}
instructions_TRACE[159] = AXA_ABSOLUTEY_159_TRACE;

function LDY_IMMEDIATE_160_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 160;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.regY = c & 255;
    a.setSign(0 < (a.regY & 128));
    a.setZero(0 === (a.regY & 255));
    return 2
}
instructions_TRACE[160] = LDY_IMMEDIATE_160_TRACE;

function LDA_INDIRECTX_161_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 161;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regA = c & 255;
    a.setSign(0 < (a.regA &
        128));
    a.setZero(0 === (a.regA & 255));
    return 6
}
instructions_TRACE[161] = LDA_INDIRECTX_161_TRACE;

function LDX_IMMEDIATE_162_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 162;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.regX = c & 255;
    a.setSign(0 < (a.regX & 128));
    a.setZero(0 === (a.regX & 255));
    return 2
}
instructions_TRACE[162] = LDX_IMMEDIATE_162_TRACE;

function LAX_INDIRECTX_163_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 163;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regA = c;
    a.regX = c;
    a.setSign(0 <
        (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 6
}
instructions_TRACE[163] = LAX_INDIRECTX_163_TRACE;

function LDY_ZEROPAGE_164_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 164;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regY = c & 255;
    a.setSign(0 < (a.regY & 128));
    a.setZero(0 === (a.regY & 255));
    return 3
}
instructions_TRACE[164] = LDY_ZEROPAGE_164_TRACE;

function LDA_ZEROPAGE_165_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 165;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regA = c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 3
}
instructions_TRACE[165] = LDA_ZEROPAGE_165_TRACE;

function LDX_ZEROPAGE_166_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 166;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regX = c & 255;
    a.setSign(0 < (a.regX & 128));
    a.setZero(0 === (a.regX & 255));
    return 3
}
instructions_TRACE[166] = LDX_ZEROPAGE_166_TRACE;

function LAX_ZEROPAGE_167_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 167;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regA = c;
    a.regX = c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 3
}
instructions_TRACE[167] = LAX_ZEROPAGE_167_TRACE;

function TAY_NONE_168_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 168;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regY = a.regA;
    a.setSign(0 < (a.regY & 128));
    a.setZero(0 === (a.regY & 255));
    return 2
}
instructions_TRACE[168] = TAY_NONE_168_TRACE;

function LDA_IMMEDIATE_169_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 169;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.regA = c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 2
}
instructions_TRACE[169] = LDA_IMMEDIATE_169_TRACE;

function TAX_NONE_170_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 170;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regX = a.regA;
    a.setSign(0 < (a.regX & 128));
    a.setZero(0 === (a.regX & 255));
    return 2
}
instructions_TRACE[170] = TAX_NONE_170_TRACE;

function OAL_IMMEDIATE_171_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 171;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.regX = a.regA = c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 2
}
instructions_TRACE[171] = OAL_IMMEDIATE_171_TRACE;

function LDY_ABSOLUTE_172_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 172;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regY = c & 255;
    a.setSign(0 < (a.regY & 128));
    a.setZero(0 === (a.regY & 255));
    return 4
}
instructions_TRACE[172] = LDY_ABSOLUTE_172_TRACE;

function LDA_ABSOLUTE_173_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 173;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regA = c & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions_TRACE[173] = LDA_ABSOLUTE_173_TRACE;

function LDX_ABSOLUTE_174_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 174;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regX = c & 255;
    a.setSign(0 < (a.regX & 128));
    a.setZero(0 === (a.regX & 255));
    return 4
}
instructions_TRACE[174] = LDX_ABSOLUTE_174_TRACE;

function LAX_ABSOLUTE_175_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 175;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    a.regA = c;
    a.regX = c;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions_TRACE[175] = LAX_ABSOLUTE_175_TRACE;

function BCS_RELATIVE_176_TRACE(a, b) {
    var c = 2;
    formatData.programCounter = a.getPC();
    formatData.opcode = 176;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = b.read8(a.getPC() + 1 & 65535),
        e = a.calculateRelativeDifference(a.getPC() | 0, d | 0);
    formatData.opcodeParam = d;
    formatData.operationParam = e + 2 & 65535;
    a.getCarry() ? (a.incrementSubcycle(), (a.getPC() + 2 & 65280) !== (e + 2 & 65280) && (c += 1, a.incrementSubcycle()), c += 1, a.incrementSubcycle(),
        a.setPC(e + 2 & 65535)) : (a.incrementSubcycle(), b.read8(a.getPC() + 1 & 65535), a.setPC(a.getPC() + 2 & 65535));
    return c
}
instructions_TRACE[176] = BCS_RELATIVE_176_TRACE;

function LDA_INDIRECTY_177_TRACE(a, b) {
    var c = 5;
    formatData.programCounter = a.getPC();
    formatData.opcode = 177;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var d = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var d = a.read16FromMemWithWrap(d),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam = d;
    a.regA = d & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions_TRACE[177] = LDA_INDIRECTY_177_TRACE;

function HLT_NONE_178_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 178;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions_TRACE[178] = HLT_NONE_178_TRACE;

function LAX_INDIRECTY_179_TRACE(a, b) {
    var c = 5;
    formatData.programCounter = a.getPC();
    formatData.opcode = 179;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var d = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var d = a.read16FromMemWithWrap(d),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam = d;
    a.regA = d;
    a.regX = d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions_TRACE[179] = LAX_INDIRECTY_179_TRACE;

function LDY_ZEROPAGEX_180_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 180;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.regY = c & 255;
    a.setSign(0 <
        (a.regY & 128));
    a.setZero(0 === (a.regY & 255));
    return 4
}
instructions_TRACE[180] = LDY_ZEROPAGEX_180_TRACE;

function LDA_ZEROPAGEX_181_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 181;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.regA = c & 255;
    a.setSign(0 <
        (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions_TRACE[181] = LDA_ZEROPAGEX_181_TRACE;

function LDX_ZEROPAGEY_182_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 182;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regY & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.regX = c & 255;
    a.setSign(0 <
        (a.regX & 128));
    a.setZero(0 === (a.regX & 255));
    return 4
}
instructions_TRACE[182] = LDX_ZEROPAGEY_182_TRACE;

function LAX_ZEROPAGEY_183_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 183;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regY & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.regA = c;
    a.regX = c;
    a.setSign(0 <
        (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return 4
}
instructions_TRACE[183] = LAX_ZEROPAGEY_183_TRACE;

function CLV_NONE_184_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 184;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.setOverflow(!1);
    return 2
}
instructions_TRACE[184] = CLV_NONE_184_TRACE;

function LDA_ABSOLUTEY_185_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 185;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    a.regA = d & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions_TRACE[185] = LDA_ABSOLUTEY_185_TRACE;

function TSX_NONE_186_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 186;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regX = a.regS & 255;
    a.setSign(0 < (a.regX & 128));
    a.setZero(0 === (a.regX & 255));
    return 2
}
instructions_TRACE[186] = TSX_NONE_186_TRACE;

function LAS_ABSOLUTEY_187_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 187;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    console.log("illegal instruction LAS not implemented");
    return c
}
instructions_TRACE[187] = LAS_ABSOLUTEY_187_TRACE;

function LDY_ABSOLUTEX_188_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 188;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    a.regY = d & 255;
    a.setSign(0 < (a.regY & 128));
    a.setZero(0 === (a.regY & 255));
    return c
}
instructions_TRACE[188] = LDY_ABSOLUTEX_188_TRACE;

function LDA_ABSOLUTEX_189_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 189;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    a.regA = d & 255;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions_TRACE[189] = LDA_ABSOLUTEX_189_TRACE;

function LDX_ABSOLUTEY_190_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 190;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    a.regX = d & 255;
    a.setSign(0 < (a.regX & 128));
    a.setZero(0 === (a.regX & 255));
    return c
}
instructions_TRACE[190] = LDX_ABSOLUTEY_190_TRACE;

function LAX_ABSOLUTEY_191_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 191;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    a.regA = d;
    a.regX = d;
    a.setSign(0 < (a.regA & 128));
    a.setZero(0 === (a.regA & 255));
    return c
}
instructions_TRACE[191] = LAX_ABSOLUTEY_191_TRACE;

function CPY_IMMEDIATE_192_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 192;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    c = a.regY - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 2
}
instructions_TRACE[192] = CPY_IMMEDIATE_192_TRACE;

function CMP_INDIRECTX_193_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 193;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    c = a.regA - c;
    a.setCarry(0 <= c && 256 >
        c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 6
}
instructions_TRACE[193] = CMP_INDIRECTX_193_TRACE;

function SKB_IMMEDIATE_194_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 194;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    return 2
}
instructions_TRACE[194] = SKB_IMMEDIATE_194_TRACE;

function DCM_INDIRECTX_195_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 195;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c,
        d);
    d -= 1;
    0 > d && (d = 255);
    var e = a.regA - d;
    a.setCarry(0 <= e && 256 > e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 8
}
instructions_TRACE[195] = DCM_INDIRECTX_195_TRACE;

function CPY_ZEROPAGE_196_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 196;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    c = a.regY - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 3
}
instructions_TRACE[196] = CPY_ZEROPAGE_196_TRACE;

function CMP_ZEROPAGE_197_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 197;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    c = a.regA - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 3
}
instructions_TRACE[197] = CMP_ZEROPAGE_197_TRACE;

function DEC_ZEROPAGE_198_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 198;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    d -= 1;
    0 > d && (d = 255);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions_TRACE[198] = DEC_ZEROPAGE_198_TRACE;

function DCM_ZEROPAGE_199_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 199;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    d -= 1;
    0 > d && (d = 255);
    var e = a.regA - d;
    a.setCarry(0 <= e && 256 > e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions_TRACE[199] = DCM_ZEROPAGE_199_TRACE;

function INY_NONE_200_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 200;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regY++;
    255 < a.regY && (a.regY = 0);
    a.setSign(0 < (a.regY & 128));
    a.setZero(0 === (a.regY & 255));
    return 2
}
instructions_TRACE[200] = INY_NONE_200_TRACE;

function CMP_IMMEDIATE_201_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 201;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    c = a.regA - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 2
}
instructions_TRACE[201] = CMP_IMMEDIATE_201_TRACE;

function DEX_NONE_202_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 202;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regX--;
    0 > a.regX && (a.regX = 255);
    a.setSign(0 < (a.regX & 128));
    a.setZero(0 === (a.regX & 255));
    return 2
}
instructions_TRACE[202] = DEX_NONE_202_TRACE;

function SAX_IMMEDIATE_203_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 203;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    c = (a.regA & a.regX) - c;
    a.regX = c & 255;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 2
}
instructions_TRACE[203] = SAX_IMMEDIATE_203_TRACE;

function CPY_ABSOLUTE_204_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 204;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    c = a.regY - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 4
}
instructions_TRACE[204] = CPY_ABSOLUTE_204_TRACE;

function CMP_ABSOLUTE_205_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 205;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    c = a.regA - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 4
}
instructions_TRACE[205] = CMP_ABSOLUTE_205_TRACE;

function DEC_ABSOLUTE_206_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 206;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    d -= 1;
    0 > d && (d = 255);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions_TRACE[206] = DEC_ABSOLUTE_206_TRACE;

function DCM_ABSOLUTE_207_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 207;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    d -= 1;
    0 > d && (d = 255);
    var e = a.regA - d;
    a.setCarry(0 <= e && 256 > e);
    a.setSign(0 <
        (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions_TRACE[207] = DCM_ABSOLUTE_207_TRACE;

function BNE_RELATIVE_208_TRACE(a, b) {
    var c = 2;
    formatData.programCounter = a.getPC();
    formatData.opcode = 208;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = b.read8(a.getPC() + 1 & 65535),
        e = a.calculateRelativeDifference(a.getPC() | 0, d | 0);
    formatData.opcodeParam = d;
    formatData.operationParam = e + 2 & 65535;
    a.getZero() ? (a.incrementSubcycle(), b.read8(a.getPC() + 1 & 65535), a.setPC(a.getPC() + 2 & 65535)) : (a.incrementSubcycle(), (a.getPC() +
        2 & 65280) !== (e + 2 & 65280) && (c += 1, a.incrementSubcycle()), c += 1, a.incrementSubcycle(), a.setPC(e + 2 & 65535));
    return c
}
instructions_TRACE[208] = BNE_RELATIVE_208_TRACE;

function CMP_INDIRECTY_209_TRACE(a, b) {
    var c = 5;
    formatData.programCounter = a.getPC();
    formatData.opcode = 209;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var d = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var d = a.read16FromMemWithWrap(d),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam = d;
    d = a.regA - d;
    a.setCarry(0 <= d && 256 > d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    return c
}
instructions_TRACE[209] = CMP_INDIRECTY_209_TRACE;

function HLT_NONE_210_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 210;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions_TRACE[210] = HLT_NONE_210_TRACE;

function DCM_INDIRECTY_211_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 211;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var c = a.read16FromMemWithWrap(c),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam =
        c;
    a.incrementSubcycle();
    b.write8(d, c);
    c -= 1;
    0 > c && (c = 255);
    var e = a.regA - c;
    a.setCarry(0 <= e && 256 > e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 8
}
instructions_TRACE[211] = DCM_INDIRECTY_211_TRACE;

function SKB_ZEROPAGEX_212_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 212;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    return 4
}
instructions_TRACE[212] = SKB_ZEROPAGEX_212_TRACE;

function CMP_ZEROPAGEX_213_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 213;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    c = a.regA - c;
    a.setCarry(0 <=
        c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 4
}
instructions_TRACE[213] = CMP_ZEROPAGEX_213_TRACE;

function DEC_ZEROPAGEX_214_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 214;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    c -= 1;
    0 > c && (c = 255);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions_TRACE[214] = DEC_ZEROPAGEX_214_TRACE;

function DCM_ZEROPAGEX_215_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 215;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    c -= 1;
    0 > c && (c = 255);
    var e = a.regA - c;
    a.setCarry(0 <= e && 256 > e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions_TRACE[215] = DCM_ZEROPAGEX_215_TRACE;

function CLD_NONE_216_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 216;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.setDecimal(!1);
    return 2
}
instructions_TRACE[216] = CLD_NONE_216_TRACE;

function CMP_ABSOLUTEY_217_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 217;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    d = a.regA - d;
    a.setCarry(0 <= d && 256 > d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    return c
}
instructions_TRACE[217] = CMP_ABSOLUTEY_217_TRACE;

function NOP_NONE_218_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 218;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    return 2
}
instructions_TRACE[218] = NOP_NONE_218_TRACE;

function DCM_ABSOLUTEY_219_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 219;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    c -= 1;
    0 > c && (c = 255);
    var e = a.regA - c;
    a.setCarry(0 <= e && 256 > e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions_TRACE[219] = DCM_ABSOLUTEY_219_TRACE;

function SKW_ABSOLUTEX_220_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 220;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    return c
}
instructions_TRACE[220] = SKW_ABSOLUTEX_220_TRACE;

function CMP_ABSOLUTEX_221_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 221;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    d = a.regA - d;
    a.setCarry(0 <= d && 256 > d);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    return c
}
instructions_TRACE[221] = CMP_ABSOLUTEX_221_TRACE;

function DEC_ABSOLUTEX_222_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 222;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    c -= 1;
    0 > c && (c = 255);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions_TRACE[222] = DEC_ABSOLUTEX_222_TRACE;

function DCM_ABSOLUTEX_223_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 223;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    c -= 1;
    0 > c && (c = 255);
    var e = a.regA - c;
    a.setCarry(0 <= e && 256 > e);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions_TRACE[223] = DCM_ABSOLUTEX_223_TRACE;

function CPX_IMMEDIATE_224_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 224;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    c = a.regX - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 2
}
instructions_TRACE[224] = CPX_IMMEDIATE_224_TRACE;

function SBC_INDIRECTX_225_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 225;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    var d = a.regA - c - (a.getCarry() ? 0 :
        1);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= d && 256 > d);
    a.regA = d & 255;
    return 6
}
instructions_TRACE[225] = SBC_INDIRECTX_225_TRACE;

function SKB_IMMEDIATE_226_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 226;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    return 2
}
instructions_TRACE[226] = SKB_IMMEDIATE_226_TRACE;

function INS_INDIRECTX_227_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 227;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.incrementSubcycle();
    c = c + a.regX & 255;
    c = a.read16FromMemWithWrap(c);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c,
        d);
    d += 1;
    255 < d && (d = 0);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    var e = a.regA - d - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ d) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 8
}
instructions_TRACE[227] = INS_INDIRECTX_227_TRACE;

function CPX_ZEROPAGE_228_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 228;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    c = a.regX - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 3
}
instructions_TRACE[228] = CPX_ZEROPAGE_228_TRACE;

function SBC_ZEROPAGE_229_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 229;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    var d = a.regA - c - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^
        d) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= d && 256 > d);
    a.regA = d & 255;
    return 3
}
instructions_TRACE[229] = SBC_ZEROPAGE_229_TRACE;

function INC_ZEROPAGE_230_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 230;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    d += 1;
    255 < d && (d = 0);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions_TRACE[230] = INC_ZEROPAGE_230_TRACE;

function INS_ZEROPAGE_231_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 231;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    d += 1;
    255 < d && (d = 0);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    var e = a.regA - d - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ d) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 5
}
instructions_TRACE[231] = INS_ZEROPAGE_231_TRACE;

function INX_NONE_232_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 232;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.regX++;
    255 < a.regX && (a.regX = 0);
    a.setSign(0 < (a.regX & 128));
    a.setZero(0 === (a.regX & 255));
    return 2
}
instructions_TRACE[232] = INX_NONE_232_TRACE;

function SBC_IMMEDIATE_233_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 233;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    var d = a.regA - c - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= d && 256 > d);
    a.regA = d & 255;
    return 2
}
instructions_TRACE[233] = SBC_IMMEDIATE_233_TRACE;

function NOP_NONE_234_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 234;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    return 2
}
instructions_TRACE[234] = NOP_NONE_234_TRACE;

function SBC_IMMEDIATE_235_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 235;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 2 & 65535);
    var d = a.regA - c - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= d && 256 > d);
    a.regA = d & 255;
    return 2
}
instructions_TRACE[235] = SBC_IMMEDIATE_235_TRACE;

function CPX_ABSOLUTE_236_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 236;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    c = a.regX - c;
    a.setCarry(0 <= c && 256 > c);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    return 4
}
instructions_TRACE[236] = CPX_ABSOLUTE_236_TRACE;

function SBC_ABSOLUTE_237_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 237;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(c);
    formatData.operationParam = c;
    var d = a.regA - c - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 &&
        (a.regA ^ c) & 128);
    a.setCarry(0 <= d && 256 > d);
    a.regA = d & 255;
    return 4
}
instructions_TRACE[237] = SBC_ABSOLUTE_237_TRACE;

function INC_ABSOLUTE_238_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 238;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    d += 1;
    255 < d && (d = 0);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions_TRACE[238] = INC_ABSOLUTE_238_TRACE;

function INS_ABSOLUTE_239_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 239;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    var d = b.read8(c);
    formatData.operationParam = d;
    a.incrementSubcycle();
    b.write8(c, d);
    d += 1;
    255 < d && (d = 0);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    var e =
        a.regA - d - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ d) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    a.incrementSubcycle();
    b.write8(c, d & 255);
    return 6
}
instructions_TRACE[239] = INS_ABSOLUTE_239_TRACE;

function BEQ_RELATIVE_240_TRACE(a, b) {
    var c = 2;
    formatData.programCounter = a.getPC();
    formatData.opcode = 240;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = b.read8(a.getPC() + 1 & 65535),
        e = a.calculateRelativeDifference(a.getPC() | 0, d | 0);
    formatData.opcodeParam = d;
    formatData.operationParam = e + 2 & 65535;
    a.getZero() ? (a.incrementSubcycle(), (a.getPC() + 2 & 65280) !== (e + 2 & 65280) && (c += 1, a.incrementSubcycle()), c += 1, a.incrementSubcycle(),
        a.setPC(e + 2 & 65535)) : (a.incrementSubcycle(), b.read8(a.getPC() + 1 & 65535), a.setPC(a.getPC() + 2 & 65535));
    return c
}
instructions_TRACE[240] = BEQ_RELATIVE_240_TRACE;

function SBC_INDIRECTY_241_TRACE(a, b) {
    var c = 5;
    formatData.programCounter = a.getPC();
    formatData.opcode = 241;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var d = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var d = a.read16FromMemWithWrap(d),
        e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam = d;
    e = a.regA - d - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ d) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    return c
}
instructions_TRACE[241] = SBC_INDIRECTY_241_TRACE;

function HLT_NONE_242_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 242;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    console.log("illegal instruction HLT not implemented");
    return 2
}
instructions_TRACE[242] = HLT_NONE_242_TRACE;

function INS_INDIRECTY_243_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 243;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var c = a.read16FromMemWithWrap(c),
        d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam =
        c;
    a.incrementSubcycle();
    b.write8(d, c);
    c += 1;
    255 < c && (c = 0);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    var e = a.regA - c - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 8
}
instructions_TRACE[243] = INS_INDIRECTY_243_TRACE;

function SKB_ZEROPAGEX_244_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 244;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    return 4
}
instructions_TRACE[244] = SKB_ZEROPAGEX_244_TRACE;

function SBC_ZEROPAGEX_245_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 245;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    d = a.regA - c - (a.getCarry() ?
        0 : 1);
    a.setSign(0 < (d & 128));
    a.setZero(0 === (d & 255));
    a.setOverflow((a.regA ^ d) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= d && 256 > d);
    a.regA = d & 255;
    return 4
}
instructions_TRACE[245] = SBC_ZEROPAGEX_245_TRACE;

function INC_ZEROPAGEX_246_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 246;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    c += 1;
    255 < c && (c = 0);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions_TRACE[246] = INC_ZEROPAGEX_246_TRACE;

function INS_ZEROPAGEX_247_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 247;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.incrementSubcycle();
    var c = b.read8(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 255;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 2 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    c += 1;
    255 < c && (c = 0);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    var e = a.regA - c - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 6
}
instructions_TRACE[247] = INS_ZEROPAGEX_247_TRACE;

function SED_NONE_248_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 248;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    a.setDecimal(!0);
    return 2
}
instructions_TRACE[248] = SED_NONE_248_TRACE;

function SBC_ABSOLUTEY_249_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 249;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regY & 65535;
    (d + a.regY & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regY & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    e = a.regA - d - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ d) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    return c
}
instructions_TRACE[249] = SBC_ABSOLUTEY_249_TRACE;

function NOP_NONE_250_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 250;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    a.setPC(a.getPC() + 1 & 65535);
    a.incrementSubcycle();
    return 2
}
instructions_TRACE[250] = NOP_NONE_250_TRACE;

function INS_ABSOLUTEY_251_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 251;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regY & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regY & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    c += 1;
    255 < c && (c = 0);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    var e = a.regA - c - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions_TRACE[251] = INS_ABSOLUTEY_251_TRACE;

function SKW_ABSOLUTEX_252_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 252;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    return c
}
instructions_TRACE[252] = SKW_ABSOLUTEX_252_TRACE;

function SBC_ABSOLUTEX_253_TRACE(a, b) {
    var c = 4;
    formatData.programCounter = a.getPC();
    formatData.opcode = 253;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var d = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = d;
    var e = d + a.regX & 65535;
    (d + a.regX & 65280) !== (d & 65280) && (c++, a.incrementSubcycle(), b.read8(d & 65280 | d + a.regX & 255));
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    d = b.read8(e);
    formatData.operationParam =
        d;
    e = a.regA - d - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ d) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    return c
}
instructions_TRACE[253] = SBC_ABSOLUTEX_253_TRACE;

function INC_ABSOLUTEX_254_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 254;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    c += 1;
    255 < c && (c = 0);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions_TRACE[254] = INC_ABSOLUTEX_254_TRACE;

function INS_ABSOLUTEX_255_TRACE(a, b) {
    formatData.programCounter = a.getPC();
    formatData.opcode = 255;
    formatData.regs.a = a.regA;
    formatData.regs.x = a.regX;
    formatData.regs.y = a.regY;
    formatData.regs.p = a.statusRegToByte();
    formatData.regs.sp = a.regS;
    var c = a.read16FromMemNoWrap(a.getPC() + 1 & 65535);
    formatData.opcodeParam = c;
    var d = c + a.regX & 65535;
    a.incrementSubcycle();
    b.read8(c & 65280 | c + a.regX & 255);
    a.setPC(a.getPC() + 3 & 65535);
    a.incrementSubcycle();
    c = b.read8(d);
    formatData.operationParam = c;
    a.incrementSubcycle();
    b.write8(d,
        c);
    c += 1;
    255 < c && (c = 0);
    a.setSign(0 < (c & 128));
    a.setZero(0 === (c & 255));
    var e = a.regA - c - (a.getCarry() ? 0 : 1);
    a.setSign(0 < (e & 128));
    a.setZero(0 === (e & 255));
    a.setOverflow((a.regA ^ e) & 128 && (a.regA ^ c) & 128);
    a.setCarry(0 <= e && 256 > e);
    a.regA = e & 255;
    a.incrementSubcycle();
    b.write8(d, c & 255);
    return 7
}
instructions_TRACE[255] = INS_ABSOLUTEX_255_TRACE;
Nes.cpuInstructionsTrace = instructions_TRACE;
Nes.cpuTrace = formatData;
this.Nes = this.Nes || {};
(function() {
    var a = [],
        b;
    a[0] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " BRK "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[1] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ORA ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x,
            2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[2] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " HLT "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[3] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ASO ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(a.operationParam,
                2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[4] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SKB ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b +=
            " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[5] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ORA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[6] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ASL ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam,
                2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[7] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ASO ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b +=
            " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[8] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " PHP "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[9] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ORA ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y,
            2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[10] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " ASL "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[11] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ANC ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[12] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SKW ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[13] = function(a) {
        b =
            ZERO_PAD_HEX(a.programCounter, 4) + " ORA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[14] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ASL ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a,
            2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[15] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ASO ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[16] = function(a) {
        b =
            ZERO_PAD_HEX(a.programCounter, 4) + " BPL ";
        for (b += "$" + ZERO_PAD_HEX(a.operationParam, 4); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[17] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ORA ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x,
            2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[18] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " HLT "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[19] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ASO ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(a.operationParam,
                2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[20] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SKB ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[21] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ORA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[22] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ASL ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam,
                2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[23] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ASO ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[24] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " CLC "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[25] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ORA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a,
            2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[26] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " NOP "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[27] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ASO ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam,
                4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[28] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SKW ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y,
            2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[29] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ORA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[30] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ASL ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam,
                4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[31] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ASO ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y,
            2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[32] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " JSR ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[33] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " AND ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(a.operationParam,
                2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[34] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " HLT "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[35] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter,
            4) + " RLA ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[36] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " BIT ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x,
            2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[37] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " AND ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[38] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter,
            4) + " ROL ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[39] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " RLA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x,
            2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[40] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " PLP "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[41] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " AND ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[42] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " ROL "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[43] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ANC ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[44] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " BIT ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y,
            2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[45] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " AND ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[46] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ROL ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam,
                4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[47] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " RLA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y,
            2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[48] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " BMI ";
        for (b += "$" + ZERO_PAD_HEX(a.operationParam, 4); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[49] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " AND ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(a.operationParam,
                2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[50] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " HLT "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[51] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter,
            4) + " RLA ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[52] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SKB ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" +
            ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[53] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " AND ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[54] = function(a) {
        b =
            ZERO_PAD_HEX(a.programCounter, 4) + " ROL ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[55] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " RLA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a,
            2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[56] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " SEC "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[57] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " AND ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam,
                4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[58] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " NOP "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp,
            2)
    };
    a[59] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " RLA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[60] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SKW ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b +=
            " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[61] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " AND ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" +
            ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[62] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ROL ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[63] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " RLA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam,
                2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[64] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " RTI "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[65] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter,
            4) + " EOR ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[66] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " HLT "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p,
            2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[67] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LSE ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[68] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SKB ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " +
            ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[69] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " EOR ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" +
            ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[70] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LSR ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[71] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LSE ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam,
                2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[72] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " PHA "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp,
            2)
    };
    a[73] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " EOR ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[74] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " LSR "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" +
            ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[75] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ALR ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[76] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " JMP ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4); 47 > b.length;) b += " ";
        b += " A:" +
            ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[77] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " EOR ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp,
            2)
    };
    a[78] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LSR ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[79] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LSE ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b +=
            " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[80] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " BVC ";
        for (b += "$" + ZERO_PAD_HEX(a.operationParam, 4); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[81] = function(a) {
        b =
            ZERO_PAD_HEX(a.programCounter, 4) + " EOR ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[82] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " HLT "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y,
            2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[83] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LSE ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[84] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SKB ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam,
                2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[85] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " EOR ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y,
            2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[86] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LSR ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[87] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LSE ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam,
                2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[88] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " CLI "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp,
            2)
    };
    a[89] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " EOR ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[90] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " NOP "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[91] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LSE ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[92] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter,
            4) + " SKW ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[93] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " EOR ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" +
            ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[94] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LSR ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[95] = function(a) {
        b =
            ZERO_PAD_HEX(a.programCounter, 4) + " LSE ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[96] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " RTS "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y,
            2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[97] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ADC ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[98] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " HLT "; 47 > b.length;) b +=
            " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[99] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " RRA ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" +
            ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[100] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SKB ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[101] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ADC ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam,
                2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[102] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ROR ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[103] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " RRA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[104] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " PLA "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a,
            2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[105] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ADC ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[106] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter,
                4) + " ROR "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[107] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ARR ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp,
            2)
    };
    a[108] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " JMP ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + ") = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[109] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ADC ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b +=
            " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[110] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ROR ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp,
            2)
    };
    a[111] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " RRA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[112] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " BVS ";
        for (b += "$" + ZERO_PAD_HEX(a.operationParam, 4); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a,
            2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[113] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ADC ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[114] =
        function(a) {
            for (b = ZERO_PAD_HEX(a.programCounter, 4) + " HLT "; 47 > b.length;) b += " ";
            b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
            b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
            b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
            b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
            return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
        };
    a[115] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " RRA ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" +
            ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[116] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SKB ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[117] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) +
            " ADC ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[118] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ROR ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x,
            2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[119] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " RRA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[120] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter,
                4) + " SEI "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[121] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ADC ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p,
            2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[122] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " NOP "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[123] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " RRA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a,
            2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[124] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SKW ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[125] =
        function(a) {
            b = ZERO_PAD_HEX(a.programCounter, 4) + " ADC ";
            for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
            b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
            b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
            b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
            b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
            return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
        };
    a[126] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " ROR ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[127] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " RRA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp,
            2)
    };
    a[128] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SKB ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[129] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " STA ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a,
            2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[130] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SKB ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[131] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter,
            4) + " AXS ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[132] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " STY ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" +
            ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[133] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " STA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[134] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter,
            4) + " STX ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[135] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " AXS ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x,
            2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[136] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " DEY "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[137] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SKB ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b +=
            " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[138] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " TXA "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[139] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter,
            4) + " XAA ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[140] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " STY ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y,
            2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[141] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " STA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[142] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " STX ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam,
                4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[143] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " AXS ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y,
            2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[144] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " BCC ";
        for (b += "$" + ZERO_PAD_HEX(a.operationParam, 4); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[145] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " STA ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + "), Y = " +
            ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[146] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " HLT "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[147] =
        function(a) {
            b = ZERO_PAD_HEX(a.programCounter, 4) + " AXA ";
            for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
            b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
            b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
            b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
            b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
            return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
        };
    a[148] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " STY ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b +=
            " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[149] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " STA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" +
            ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[150] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " STX ";
        b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2);
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[151] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) +
            " AXS ";
        b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2);
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[152] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " TYA "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x,
            2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[153] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " STA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[154] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter,
                4) + " TXS "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[155] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " TAS ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p,
            2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[156] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SAY ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[157] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " STA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " +
            ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[158] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " XAS ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b +=
            " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[159] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " AXA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[160] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LDY ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam,
                2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[161] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LDA ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p,
            2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[162] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LDX ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[163] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LAX ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(a.operationParam, 2); 47 >
            b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[164] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LDY ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b +=
            " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[165] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LDA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[166] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LDX ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam,
                2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[167] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LAX ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[168] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " TAY "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[169] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LDA ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[170] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " TAX "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[171] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " OAL ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[172] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LDY ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp,
            2)
    };
    a[173] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LDA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[174] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LDX ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b +=
            " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[175] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LAX ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp,
            2)
    };
    a[176] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " BCS ";
        for (b += "$" + ZERO_PAD_HEX(a.operationParam, 4); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[177] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LDA ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a,
            2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[178] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " HLT "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[179] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LAX ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam,
                4) + "), Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[180] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LDY ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y,
            2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[181] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LDA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[182] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LDX ";
        b += "$" + ZERO_PAD_HEX(a.opcodeParam,
            2) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2);
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[183] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LAX ";
        b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2);
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam,
                4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[184] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " CLV "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp,
            2)
    };
    a[185] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LDA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[186] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " TSX "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[187] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LAS ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[188] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter,
            4) + " LDY ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[189] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LDA ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" +
            ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[190] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " LDX ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[191] = function(a) {
        b =
            ZERO_PAD_HEX(a.programCounter, 4) + " LAX ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[192] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " CPY ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x,
            2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[193] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " CMP ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[194] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter,
            4) + " SKB ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[195] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " DCM ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y,
            2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[196] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " CPY ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[197] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " CMP ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam,
                2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[198] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " DEC ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y,
            2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[199] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " DCM ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[200] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " INY "; 47 > b.length;) b +=
            " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[201] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " CMP ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[202] = function(a) {
        for (b =
            ZERO_PAD_HEX(a.programCounter, 4) + " DEX "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[203] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SAX ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[204] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " CPY ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[205] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " CMP ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam,
                2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[206] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " DEC ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[207] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " DCM ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[208] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " BNE ";
        for (b += "$" + ZERO_PAD_HEX(a.operationParam, 4); 47 > b.length;) b +=
            " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[209] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " CMP ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" +
            ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[210] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " HLT "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[211] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " DCM ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" +
            ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[212] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SKB ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[213] = function(a) {
        b =
            ZERO_PAD_HEX(a.programCounter, 4) + " CMP ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[214] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " DEC ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a,
            2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[215] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " DCM ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[216] =
        function(a) {
            for (b = ZERO_PAD_HEX(a.programCounter, 4) + " CLD "; 47 > b.length;) b += " ";
            b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
            b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
            b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
            b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
            return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
        };
    a[217] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " CMP ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" +
            ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[218] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " NOP "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[219] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " DCM ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(a.operationParam,
                2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[220] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SKW ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p,
            2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[221] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " CMP ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[222] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " DEC ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " +
            ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[223] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " DCM ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b +=
            " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[224] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " CPX ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[225] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SBC ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(a.operationParam,
                2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[226] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SKB ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp,
            2)
    };
    a[227] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " INS ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[228] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " CPX ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b +=
            " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[229] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SBC ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp,
            2)
    };
    a[230] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " INC ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[231] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " INS ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b +=
            " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[232] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " INX "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[233] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter,
            4) + " SBC ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[234] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " NOP "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp,
            2)
    };
    a[235] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SBC ";
        for (b += "#$" + ZERO_PAD_HEX(a.opcodeParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[236] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " CPX ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a,
            2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[237] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SBC ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[238] = function(a) {
        b =
            ZERO_PAD_HEX(a.programCounter, 4) + " INC ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[239] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " INS ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + " = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a,
            2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[240] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " BEQ ";
        for (b += "$" + ZERO_PAD_HEX(a.operationParam, 4); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[241] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter,
            4) + " SBC ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[242] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " HLT "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p,
            2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[243] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " INS ";
        for (b += "($" + ZERO_PAD_HEX(a.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[244] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SKB ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " +
            ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[245] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SBC ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b +=
            " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[246] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " INC ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[247] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " INS ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam,
                2) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[248] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " SED "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp,
            2)
    };
    a[249] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SBC ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[250] = function(a) {
        for (b = ZERO_PAD_HEX(a.programCounter, 4) + " NOP "; 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[251] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " INS ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[252] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter,
            4) + " SKW ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[253] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " SBC ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" +
            ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[254] = function(a) {
        b = ZERO_PAD_HEX(a.programCounter, 4) + " INC ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    a[255] = function(a) {
        b =
            ZERO_PAD_HEX(a.programCounter, 4) + " INS ";
        for (b += "$" + ZERO_PAD_HEX(a.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(a.operationParam, 2); 47 > b.length;) b += " ";
        b += " A:" + ZERO_PAD_HEX(a.regs.a, 2);
        b += " X:" + ZERO_PAD_HEX(a.regs.x, 2);
        b += " Y:" + ZERO_PAD_HEX(a.regs.y, 2);
        b += " P:" + ZERO_PAD_HEX(a.regs.p, 2);
        return b += " SP:" + ZERO_PAD_HEX(a.regs.sp, 2)
    };
    Nes.formatCpuTraceString = a
})();
this.Nes = this.Nes || {};
"use strict";
var maximumTracesToStoreForLoopDetection = 32,
    cpu6502 = function(a) {
        var b = this;
        this.mainboard = a;
        this.mainboard.connect("reset", function(a) {
            b.reset(a)
        });
        this.executeCallback = null;
        this.cmosVersion = !1;
        this.isRunning = !0;
        this._traceEnabled = !1;
        this._previousTraceProgramCounters = new Uint16Array(maximumTracesToStoreForLoopDetection);
        this._previousTraceProgramCountersIndex = 0;
        this._inTraceLoop = !1;
        this._traceLoopCount = 0;
        this._useSwitchStatement = !1;
        this._instructionSet = Nes.cpuInstructions;
        this._instructionSwitch =
            Nes.cpuInstructionsSwitch;
        this.resetVariables()
    };
cpu6502.prototype.breakPoint = function(a) {
    this.isRunning = a
};
cpu6502.prototype.enableTrace = function(a) {
    this._instructionSet = (this._traceEnabled = void 0 === a ? !0 : a) ? Nes.cpuInstructionsTrace : Nes.cpuInstructions
};
cpu6502.prototype.resetVariables = function() {
    this.subcycle = this.programCounter = 0;
    this.nmiPending = this.resetPending = this.waitOneInstructionAfterCli = !1;
    this.irqLineLow = 0;
    this._flagDecimal = this._flagInterrupt = this._flagZero = this._flagCarry = this.triggerNmiAfterNextInstruction = !1;
    this._flagUnused = this._flagBreak = !0;
    this._flagSign = this._flagOverflow = !1;
    this.SAYHighByte = this.regA = this.regY = this.regX = this.regS = 0
};
cpu6502.prototype.incrementSubcycle = function() {
    this.subcycle++
};
cpu6502.prototype.getPC = function() {
    return this.programCounter
};
cpu6502.prototype.setPC = function(a) {
    this.programCounter = a
};
cpu6502.prototype.getZero = function() {
    return this._flagZero
};
cpu6502.prototype.setZero = function(a) {
    this._flagZero = a
};
cpu6502.prototype.getOverflow = function() {
    return this._flagOverflow
};
cpu6502.prototype.setOverflow = function(a) {
    this._flagOverflow = a
};
cpu6502.prototype.getInterrupt = function() {
    return this._flagInterrupt
};
cpu6502.prototype.setInterrupt = function(a) {
    this._flagInterrupt = a
};
cpu6502.prototype.getBreak = function() {
    return this._flagBreak
};
cpu6502.prototype.setBreak = function(a) {
    this._flagBreak = a
};
cpu6502.prototype.getDecimal = function() {
    return this._flagDecimal
};
cpu6502.prototype.setDecimal = function(a) {
    this._flagDecimal = a
};
cpu6502.prototype.getUnused = function() {
    return this._flagUnused
};
cpu6502.prototype.setUnused = function(a) {
    this._flagUnused = a
};
cpu6502.prototype.getCarry = function() {
    return this._flagCarry
};
cpu6502.prototype.setCarry = function(a) {
    this._flagCarry = a
};
cpu6502.prototype.getSign = function() {
    return this._flagSign
};
cpu6502.prototype.setSign = function(a) {
    this._flagSign = a
};
cpu6502.prototype.getRegA = function() {
    return this.regA
};
cpu6502.prototype.setRegA = function(a) {
    this.regA = a
};
cpu6502.prototype.getRegX = function() {
    return this.regX
};
cpu6502.prototype.setRegX = function(a) {
    this.regX = a
};
cpu6502.prototype.getRegY = function() {
    return this.regY
};
cpu6502.prototype.setRegY = function(a) {
    this.regY = a
};
cpu6502.prototype.setExecuteCallback = function(a) {
    this.executeCallback = a
};
cpu6502.prototype.getSubCycle = function() {
    return this.subcycle
};
cpu6502.prototype.handlePendingInterrupts = function() {
    if (this.resetPending) {
        for (var a = 0; 3 > a; ++a) this.incrementStackReg();
        this.setBreak(!1);
        this.setInterrupt(!0);
        this.cmosVersion && (this._flagDecimal = !1);
        this.programCounter = this.mainboard.memory.read16NoZeroPageWrap(CPU_RESET_ADDRESS);
        this.resetPending = !1;
        return 0
    }
    if (this.nmiPending) {
        if (this.triggerNmiAfterNextInstruction) return this.triggerNmiAfterNextInstruction = !1, 0;
        this.pushStack(this.programCounter >> 8 & 255);
        this.incrementStackReg();
        this.pushStack(this.programCounter &
            255);
        this.incrementStackReg();
        this._flagBreak = !1;
        this.pushStack(this.statusRegToByte());
        this.incrementStackReg();
        this._flagInterrupt = !0;
        this.cmosVersion && (this._flagDecimal = !1);
        this.programCounter = this.mainboard.memory.read16NoZeroPageWrap(CPU_NMI_ADDRESS);
        this.nmiPending = !1;
        return 7
    }
    return 0 < this.irqLineLow && !this.waitOneInstructionAfterCli && !this._flagInterrupt ? (this.pushStack(this.programCounter >> 8 & 255), this.incrementStackReg(), this.pushStack(this.programCounter & 255), this.incrementStackReg(), this._flagBreak = !1, this.pushStack(this.statusRegToByte()), this.incrementStackReg(), this._flagInterrupt = !0, this.cmosVersion && (this._flagDecimal = !1), this.programCounter = this.mainboard.memory.read16NoZeroPageWrap(CPU_IRQ_ADDRESS), 7) : 0
};
cpu6502.prototype.nonMaskableInterrupt = function(a) {
    this.nmiPending = !0;
    this.mainboard.synchroniser.isPpuTickOnLastCycleOfCpuInstruction(a) && (this.triggerNmiAfterNextInstruction = !0)
};
cpu6502.prototype.reset = function() {
    this.resetVariables();
    this.resetPending = !0
};
cpu6502.prototype.holdIrqLineLow = function(a) {
    a ? this.irqLineLow++ : 0 < this.irqLineLow && this.irqLineLow--
};
cpu6502.prototype.statusRegToByte = function() {
    var a;
    a = 0 | (this._flagCarry ? 1 : 0);
    a |= this._flagZero ? 2 : 0;
    a |= this._flagInterrupt ? 4 : 0;
    a |= this._flagDecimal ? 8 : 0;
    a |= this._flagBreak ? 16 : 0;
    a |= this._flagUnused ? 32 : 0;
    a |= this._flagOverflow ? 64 : 0;
    return a |= this._flagSign ? 128 : 0
};
cpu6502.prototype.statusRegFromByte = function(a) {
    this._flagCarry = 0 < (a & 1);
    this._flagZero = 0 < (a & 2);
    this._flagInterrupt = 0 < (a & 4);
    this._flagDecimal = 0 < (a & 8);
    this._flagBreak = 0 < (a & 16);
    this._flagUnused = 0 < (a & 32);
    this._flagOverflow = 0 < (a & 64);
    this._flagSign = 0 < (a & 128)
};
cpu6502.prototype.incrementStackReg = function() {
    this.regS--;
    0 > this.regS && (this.regS = 255)
};
cpu6502.prototype.decrementStackReg = function() {
    this.regS++;
    255 < this.regS && (this.regS = 0)
};
cpu6502.prototype.pushStack = function(a) {
    this.mainboard.memory.write8(256 + this.regS, a & 255)
};
cpu6502.prototype.popStack = function(a) {
    return this.mainboard.memory.read8(256 + this.regS)
};
cpu6502.prototype.read16FromMemNoWrap = function(a) {
    this.incrementSubcycle();
    var b = this.mainboard.memory.read8(a) & 255;
    this.incrementSubcycle();
    a = this.mainboard.memory.read8(a + 1 & 65535);
    return (b | (a & 255) << 8) & 65535
};
cpu6502.prototype.read16FromMemWithWrap = function(a) {
    this.incrementSubcycle();
    var b = this.mainboard.memory.read8(a);
    a = 255 === (a & 255) ? a & 65280 : a + 1;
    this.incrementSubcycle();
    a = this.mainboard.memory.read8(a & 65535);
    return (b | (a & 255) << 8) & 65535
};
cpu6502.prototype.calculateRelativeDifference = function(a, b) {
    return 0 < (b & 128) ? a - ((b ^ 255) + 1 & 255) : a + b
};
cpu6502.prototype.execute = function() {
    this.subcycle = 0;
    this.waitOneInstructionAfterCli && (this.waitOneInstructionAfterCli = !1);
    var a = this.mainboard.memory.read8(this.programCounter),
        b = 0,
        b = this._useSwitchStatement ? this._instructionSwitch(a, this, this.mainboard.memory) : this._instructionSet[a](this, this.mainboard.memory);
    this._traceEnabled && this._doTrace();
    this.subcycle = 0;
    return b
};
cpu6502.prototype._hasProgramCounterBeenSeenBefore = function(a) {
    for (var b = 0; b < this._previousTraceProgramCounters.length; ++b)
        if (this._previousTraceProgramCounters[b] === a) return b;
    return -1
};
cpu6502.prototype._doTrace = function() {
    var a = Nes.cpuTrace;
    0 <= this._hasProgramCounterBeenSeenBefore(a.programCounter) ? (this._inTraceLoop || (this._inTraceLoop = !0, this._traceLoopCount = 0), this._traceLoopCount++) : this._inTraceLoop && (this._inTraceLoop = !1, this._traceLoopCount = 0);
    this._inTraceLoop || (this._previousTraceProgramCounters[this._previousTraceProgramCountersIndex] = a.programCounter, this._previousTraceProgramCountersIndex = this._previousTraceProgramCountersIndex + 1 & 31)
};
cpu6502.prototype.saveState = function() {
    var a = {};
    a.programCounter = this.programCounter;
    a.subcycle = this.subcycle;
    a.waitOneInstructionAfterCli = this.waitOneInstructionAfterCli;
    a.resetPending = this.resetPending;
    a.nmiPending = this.nmiPending;
    a.irqLineLow = this.irqLineLow;
    a.triggerNmiAfterNextInstruction = this.triggerNmiAfterNextInstruction;
    a._flagCarry = this._flagCarry;
    a._flagZero = this._flagZero;
    a._flagInterrupt = this._flagInterrupt;
    a._flagDecimal = this._flagDecimal;
    a._flagBreak = this._flagBreak;
    a._flagUnused = this._flagUnused;
    a._flagOverflow = this._flagOverflow;
    a._flagSign = this._flagSign;
    a.regS = this.regS;
    a.regX = this.regX;
    a.regY = this.regY;
    a.regA = this.regA;
    a.SAYHighByte = this.SAYHighByte;
    return a
};
cpu6502.prototype.loadState = function(a) {
    this.programCounter = a.programCounter;
    this.subcycle = a.subcycle;
    this.waitOneInstructionAfterCli = a.waitOneInstructionAfterCli;
    this.resetPending = a.resetPending;
    this.nmiPending = a.nmiPending;
    this.irqLineLow = a.irqLineLow;
    this.triggerNmiAfterNextInstruction = a.triggerNmiAfterNextInstruction;
    this._flagCarry = a._flagCarry;
    this._flagZero = a._flagZero;
    this._flagInterrupt = a._flagInterrupt;
    this._flagDecimal = a._flagDecimal;
    this._flagBreak = a._flagBreak;
    this._flagUnused = a._flagUnused;
    this._flagOverflow = a._flagOverflow;
    this._flagSign = a._flagSign;
    this.regS = a.regS;
    this.regX = a.regX;
    this.regY = a.regY;
    this.regA = a.regA;
    this.SAYHighByte = a.SAYHighByte
};
Nes.cpu6502 = cpu6502;
this.Nes = this.Nes || {};
(function() {
    var a = function(a) {
        this._buffer = new Int16Array(6553600);
        this._sampleCount = 0;
        this._active = !1;
        this._sample_rate = a || 44100;
        this._chan_count = 1;
        this._header = new Uint8Array(44)
    };
    a.prototype.activate = function() {
        this._active = !0
    };
    a.prototype.write = function(a, c) {
        if (this._active) {
            for (var d = Math.min(c, 6553600 - this._sampleCount), e = 0; e < d; ++e) {
                var f = a[e];
                this._buffer[this._sampleCount++] = f
            }
            6553600 <= this._sampleCount && (this._createFile(), this._sampleCount = 0, this._active = !1)
        }
    };
    a.prototype._buildHeader = function(a) {
        a *=
            2;
        var c = 36 + a,
            d = 2 * this._chan_count,
            e = this._sample_rate * d,
            f = 0,
            g = function(a, b) {
                for (var c = 0; c < b.length; ++c) a[f++] = b[c]
            };
        g(this._header, [82, 73, 70, 70]);
        g(this._header, [c, c >> 8, c >> 16, c >> 24]);
        g(this._header, [87, 65, 86, 69, 102, 109, 116, 32]);
        g(this._header, [16, 0, 0, 0]);
        g(this._header, [1, 0]);
        g(this._header, [this._chan_count, 0]);
        g(this._header, [this._sample_rate, this._sample_rate >> 8, this._sample_rate >> 16, this._sample_rate >> 24]);
        g(this._header, [e, e >> 8, e >> 16, e >> 24]);
        g(this._header, [d, 0]);
        g(this._header, [16, 0]);
        g(this._header, [100, 97, 116, 97]);
        g(this._header, [a, a >> 8, a >> 16, a >> 24])
    };
    a.prototype._createFile = function() {
        console.log("Saving sound.wav...");
        this._buildHeader(this._sampleCount);
        var a = new Blob([this._header, this._buffer], {
            type: "application/octet-stream"
        });
        saveAs(a, "sound.wav")
    };
    Nes.Wave_Writer = a
})();
this.Nes = this.Nes || {};
(function() {
    var a = function(a, b, c) {
            this.treble = a || 0;
            this.cutoff = b || 0;
            this.sample_rate = c || 44100
        },
        b = function() {
            this.samples_per_sec = 44100;
            this.bass_shift = this.reader_accum = 0;
            this.eq = new a;
            this.clocks_per_sec = 0;
            this.buffer_ = null;
            this.factor_ = -1;
            this.length_ = this.buffer_size_ = this.offset_ = 0;
            this.bass_freq_ = 16
        };
    b.prototype.sample_rate = function(a, b) {
        if (void 0 === a) return this.samples_per_sec;
        b = b || 0;
        var c = 65448;
        if (0 !== b) {
            var g = Math.floor((a * (b + 1) + 999) / 1E3);
            g < c && (c = g)
        }
        this.buffer_size_ !== c && (this.buffer_ = null,
            this.offset_ = this.buffer_size_ = 0, this.buffer_ = new Uint16Array(c + 24));
        this.buffer_size_ = c;
        this.length_ = Math.floor(1E3 * c / a) - 1;
        this.samples_per_sec = a;
        this.clocks_per_sec && this.clock_rate(this.clocks_per_sec);
        this.bass_freq(this.bass_freq_);
        this.clear()
    };
    b.prototype.length = function() {
        return this.length_
    };
    b.prototype.clock_rate = function(a) {
        if (void 0 === a) return this.clocks_per_sec;
        this.clocks_per_sec = a;
        this.factor_ = Math.floor(this.samples_per_sec / a * 65536 + .5)
    };
    b.prototype.bass_freq = function(a) {
        this.bass_freq_ =
            a;
        0 === a ? this.bass_shift = 31 : (this.bass_shift = 1 + Math.floor(1.442695041 * Math.log(.124 * this.samples_per_sec / a)), 0 > this.bass_shift && (this.bass_shift = 0), 24 < this.bass_shift && (this.bass_shift = 24))
    };
    b.prototype.clear = function(a) {
        var b = void 0 === a || a ? this.buffer_size_ : this.samples_avail();
        this.reader_accum = this.offset_ = 0;
        a = this.buffer_;
        for (var b = b + 24, c, g = c = 0; g < b; ++g) a[c + g] = 32639
    };
    b.prototype.end_frame = function(a) {
        this.offset_ += a * this.factor_
    };
    b.prototype.samples_avail = function() {
        return this.offset_ >> 16
    };
    b.prototype.read_samples =
        function(a, b, c) {
            var g = this.samples_avail();
            g > b && (g = b);
            if (!g) return 0;
            b = a instanceof Float32Array;
            var h = 0,
                k = 0;
            c = c ? 2 : 1;
            for (var l = g; l--;) {
                var m = this.reader_accum >> 15;
                this.reader_accum -= this.reader_accum >> this.bass_shift;
                this.reader_accum += this.buffer_[h] - 32639 << 15;
                h += 1;
                if (-32767 > m || 32767 < m) m = 32767 - (m >> 24);
                a[k] = b ? m / 32768 : m;
                k += c
            }
            this.remove_samples(g);
            return g
        };
    b.prototype.remove_samples = function(a) {
        if (a) {
            this.remove_silence(a);
            var b = this.samples_avail() + 24 + 1;
            if (a >= b) {
                var c = this.buffer_,
                    g = null;
                if (!g ||
                    g.length < b) g = new Uint16Array(b);
                g.set(c.subarray(a, a + b), 0);
                c.set(g.subarray(0, b), 0)
            } else c = this.buffer_, c.set(c.subarray(a, a + b), 0);
            c = this.buffer_;
            b = b || 0;
            for (g = 0; g < a; ++g) c[b + g] = 32639
        }
    };
    b.prototype.output_latency = function() {
        return Math.floor(12)
    };
    b.prototype.remove_silence = function(a) {
        this.offset_ -= a << 16
    };
    b.prototype.resampled_time = function(a) {
        return a * this.factor_ + this.offset_
    };
    b.prototype.resampled_duration = function(a) {
        return a * this.factor_
    };
    Nes.Blip_Buffer = b;
    var c = Math.floor(16384),
        b = function() {
            this.impulse =
                this.impulses = null
        };
    b.prototype.init = function(a, b, c, g) {
        this.fine_bits = g || 0;
        this.width = b;
        this.impulses = new Uint16Array(a.buffer);
        this.generate = !0;
        this.volume_unit_ = -1;
        this.res = c;
        this.buf = null;
        this.impulse = new Uint16Array(this.impulses.buffer, this.width * this.res * 2 * (this.fine_bits ? 2 : 1) * 2);
        this.offset = 0
    };
    b.prototype.scale_impulse = function(a, b) {
        for (var f = (a << 15) - c * a + 16384, g = 0, h = 0, k = Math.floor(this.res / 2) + 1; k--;) {
            for (var l = a, m = this.width; m--;) {
                var n = this.impulse[h++] * a + f >> 15,
                    l = l - (n - a);
                b[g++] = n
            }
            b[g - Math.floor(this.width /
                2) - 1] += l
        }
        if (2 < this.res) {
            f = g - this.width - 1;
            for (h = (Math.floor(this.res / 2) - 1) * this.width - 1; h--;) b[g++] = b[--f];
            b[g++] = a
        }
        b[g++] = a;
        b.set(b.subarray(0, 0 + (this.res * this.width - 1)), g)
    };
    b.prototype.fine_volume_unit = function() {
        var a = new Uint16Array(1536);
        this.scale_impulse((this.offset & 65535) << this.fine_bits, a);
        var b = this.impulse.subarray(2 * this.res * this.width);
        this.scale_impulse(this.offset & 65535, b);
        for (var c = 0, g = 0, h = 0, k = 2 * Math.floor(this.res / 2) * this.width; k--;) this.impulses[c++] = b[g++], this.impulses[c++] = b[g++],
            this.impulses[c++] = a[h++], this.impulses[c++] = a[h++]
    };
    b.prototype.volume_unit = function(b) {
        b !== this.volume_unit_ && (this.generate && this.treble_eq(new a(-8.87, 8800, 44100)), this.volume_unit_ = b, this.offset = 65537 * Math.floor(65536 * this.volume_unit_ + .5), this.fine_bits ? this.fine_volume_unit() : this.scale_impulse(this.offset & 65535, this.impulses))
    };
    b.prototype.treble_eq = function(a) {
        if (this.generate || a.treble !== this.eq.treble || a.cutoff !== this.eq.cutoff || a.sample_rate !== this.eq.sample_rate) {
            this.generate = !1;
            this.eq =
                a;
            a = Math.pow(10, .05 * this.eq.treble);
            5E-6 > a && (a = 5E-6);
            var b = this.eq.sample_rate,
                f = 44100 / b,
                b = 2 * this.eq.cutoff / b;
            if (b >= .95 * f || .95 <= b) b = .5, a = 1;
            var g = Math.pow(a, 1 / (4096 * f - 4096 * b));
            a = 1 / Math.pow(g, 4096 * b);
            var h = a * Math.pow(g, 4096),
                k = a * Math.pow(g, 4096 * b),
                l = 0;
            a = [];
            a.length = Math.floor(352);
            for (var m = f = Math.floor(32 * (this.width - 2) / 2); m--;) {
                var n = 1.1984224905356572E-5 * (2 * m + 1),
                    p = Math.cos(n),
                    q = Math.cos(4096 * b * n),
                    u = Math.cos((4096 * b - 1) * n),
                    r = 2 - 2 * p,
                    s = 1 - p - q + u,
                    p = 1 + g * (g - 2 * p),
                    q = h * g * Math.cos(4095 * n) - h * Math.cos(4096 * n) - k *
                    g * u + k * q,
                    r = (s * p + q * r) / (r * p);
                12 < this.width && (n = Math.cos(3276.8 / 24 * n), r = r * n * n);
                l += r;
                a[m] = r
            }
            b = 16384 / l;
            g = 0;
            h = Math.floor(32 / this.res);
            k = 1 < this.res ? 32 : Math.floor(16);
            for (l = Math.floor(this.res / 2) + 1; l--; k -= h)
                for (m = -Math.floor(this.width / 2); m < Math.floor(this.width / 2); m++) {
                    n = 0;
                    for (r = 32; r--;) s = 32 * m + k + r, 0 > s && (s = -s - 1), s < f && (n += a[s]);
                    this.impulse[g++] = Math.floor(n * b + (c + .5))
                }
            a = this.volume_unit_;
            0 <= a && (this.volume_unit_ = -1, this.volume_unit(a))
        }
    };
    Nes.Blip_Impulse_ = b
})();
this.Nes = this.Nes || {};
(function() {
    var a = function(a, c) {
        this.abs_range = 0 > c ? -c : c;
        this.fine_mode = 512 < c || 0 > c;
        this.width = 5 > a ? 4 * a : 24;
        this.res = 32;
        this.impulse_size = Math.floor(this.width / 2) * (this.fine_mode + 1);
        this.base_impulses_size = Math.floor(this.width / 2) * (Math.floor(this.res / 2) + 1);
        var d;
        this.fine_mode ? (d = this.abs_range, d = 64 >= d ? 2 : 128 >= d ? 3 : 256 >= d ? 4 : 512 >= d ? 5 : 1024 >= d ? 6 : 2048 >= d ? 7 : 8) : d = 0;
        this.fine_bits = d;
        this.impulses = new Uint32Array(this.impulse_size * this.res * 2 + this.base_impulses_size);
        this.impulse = new Nes.Blip_Impulse_;
        this.impulse.init(this.impulses,
            this.width, this.res, this.fine_bits)
    };
    a.blip_low_quality = 1;
    a.blip_med_quality = 2;
    a.blip_good_quality = 3;
    a.blip_high_quality = 4;
    a.prototype.volume = function(a) {
        this.impulse.volume_unit(1 / this.abs_range * a)
    };
    a.prototype.volume_unit = function(a) {
        this.impulse.volume_unit(a)
    };
    a.prototype.output = function(a) {
        if (void 0 === a) return this.impulse.buf;
        this.impulse.buf = a
    };
    a.prototype.offset = function(a, c, d) {
        d = d || this.impulse.buf;
        this.offset_resampled(a * d.factor_ + d.offset_, c, d)
    };
    a.prototype.offset_resampled = function(a,
        c, d) {
        d = d || this.impulse.buf;
        d = new Uint32Array(d.buffer_.buffer, 2 * (Math.floor(12) - Math.floor(this.width / 2) + (a >> 16 & -2)));
        a = this.impulses.subarray((a >> 11 & 2 * this.res - 1) * this.impulse_size);
        var e = this.impulse.offset * c,
            f = 0,
            g = 0;
        if (this.fine_bits) {
            var h = 1 << this.fine_bits;
            c += Math.floor(h / 2);
            h = (c & h - 1) - Math.floor(h / 2);
            c >>= this.fine_bits;
            for (var k = Math.floor(this.width / 4); 0 < k; --k) {
                var l = d[f + 0] - e,
                    m = d[f + 1] - e,
                    l = l + a[g + 0] * h,
                    l = l + a[g + 1] * c,
                    m = m + a[g + 2] * h,
                    m = m + a[g + 3] * c,
                    g = g + 4;
                d[f + 0] = l;
                d[f + 1] = m;
                f += 2
            }
        } else
            for (h = Math.floor(this.width /
                    4); 0 < h; --h) k = d[f + 0] - e, l = d[f + 1] - e, k += a[g + 0] * c, l += a[g + 1] * c, g += 2, d[f + 0] = k, d[f + 1] = l, f += 2
    };
    a.prototype.offset_inline = function(a, c, d) {
        d = d || this.impulse.buf;
        this.offset_resampled(a * d.factor_ + d.offset_, c, d)
    };
    Nes.Blip_Synth = a
})();
this.Nes = this.Nes || {};
(function() {
    var a = function() {
        this.regs = new Uint8Array(4);
        this.reg_written = [!1, !1, !1, !1];
        this.output = null;
        this.last_amp = this.delay = this.length_counter = 0
    };
    a.prototype.clock_length = function(a) {
        0 < this.length_counter && 0 === (this.regs[0] & a) && this.length_counter--
    };
    a.prototype.period = function(a) {
        return 256 * (this.regs[3] & 7) + (this.regs[2] & 255)
    };
    a.prototype.reset = function() {
        this.last_amp = this.delay = 0
    };
    a.prototype.update_amp = function(a) {
        var b = a - this.last_amp;
        this.last_amp = a;
        return b
    };
    var b = function() {
        a.call(this);
        this.env_delay = this.envelope = 0
    };
    b.prototype = Object.create(a.prototype);
    b.prototype.clock_envelope = function() {
        var a = this.regs[0] & 15;
        this.reg_written[3] ? (this.reg_written[3] = !1, this.env_delay = a, this.envelope = 15) : 0 > --this.env_delay && (this.env_delay = a, this.envelope | this.regs[0] & 32 && (this.envelope = this.envelope - 1 & 15))
    };
    b.prototype.volume = function() {
        return 0 === this.length_counter ? 0 : this.regs[0] & 16 ? this.regs[0] & 15 : this.envelope
    };
    b.prototype.reset = function() {
        this.env_delay = this.envelope = 0;
        a.prototype.reset.call(this)
    };
    var c = function() {
        b.call(this);
        this.sweep_delay = this.phase = 0;
        this.synth = null
    };
    c.prototype = Object.create(b.prototype);
    c.negate_flag = 8;
    c.shift_mask = 7;
    c.phase_range = 8;
    c.prototype.clock_sweep = function(a) {
        var b = this.regs[1];
        if (0 > --this.sweep_delay) {
            this.reg_written[1] = !0;
            var d = this.period(),
                e = b & c.shift_mask;
            e && b & 128 && 8 <= d && (e = d >> e, b & c.negate_flag && (e = a - e), 2048 > d + e && (d += e, this.regs[2] = d & 255, this.regs[3] = this.regs[3] & 248 | d >> 8 & 7))
        }
        this.reg_written[1] && (this.reg_written[1] = !1, this.sweep_delay = b >> 4 & 7)
    };
    c.prototype.run =
        function(a, b) {
            if (this.output) {
                var d = this.volume(),
                    e = this.period(),
                    f = e >> (this.regs[1] & c.shift_mask);
                this.regs[1] & c.negate_flag && (f = 0);
                var g = 2 * (e + 1);
                if (0 === d || 8 > e || 2048 <= e + f) this.last_amp && (this.synth.offset(a, -this.last_amp, this.output), this.last_amp = 0), a += this.delay, a < b && (d = Math.floor((b - a + g - 1) / g), this.phase = this.phase + d & c.phase_range - 1, a += d * g);
                else {
                    var h = this.regs[0] >> 6 & 3,
                        e = 1 << h,
                        f = 0;
                    3 === h && (e = 2, f = d);
                    this.phase < e && (f ^= d);
                    (h = this.update_amp(f)) && this.synth.offset(a, h, this.output);
                    a += this.delay;
                    if (a <
                        b) {
                        h = 2 * f - d;
                        do {
                            this.phase = this.phase + 1 & c.phase_range - 1;
                            if (0 === this.phase || this.phase === e) h = -h, this.synth.offset_inline(a, h, this.output);
                            a += g
                        } while (a < b);
                        this.last_amp = h + d >> 1
                    }
                }
                this.delay = a - b
            }
        };
    c.prototype.reset = function() {
        this.sweep_delay = 0;
        b.prototype.reset.call(this)
    };
    var d = function() {
        a.call(this);
        this.phase = d.phase_range;
        this.linear_counter = 0;
        this.synth = new Nes.Blip_Synth(Nes.Blip_Synth.blip_good_quality, 15)
    };
    d.prototype = Object.create(a.prototype);
    d.phase_range = 16;
    d.prototype.reset = function() {
        this.phase =
            d.phase_range;
        this.linear_counter = 0;
        a.prototype.reset.call(this)
    };
    d.prototype.run = function(a, b) {
        if (this.output) {
            var c = this.update_amp(this.calc_amp());
            c && this.synth.offset(a, c, this.output);
            a += this.delay;
            c = this.period() + 1;
            if (0 === this.length_counter || 0 === this.linear_counter || 3 > c) a = b;
            else if (a < b) {
                var e = 1;
                this.phase > d.phase_range && (this.phase -= d.phase_range, e = -e);
                do 0 === --this.phase ? (this.phase = d.phase_range, e = -e) : this.synth.offset_inline(a, e, this.output), a += c; while (a < b);
                0 > e && (this.phase += d.phase_range);
                this.last_amp = this.calc_amp()
            }
            this.delay = a - b
        }
    };
    d.prototype.clock_linear_counter = function() {
        this.reg_written[3] ? this.linear_counter = this.regs[0] & 127 : this.linear_counter && this.linear_counter--;
        this.regs[0] & 128 || (this.reg_written[3] = !1)
    };
    d.prototype.calc_amp = function() {
        var a = d.phase_range - this.phase;
        0 > a && (a = this.phase - (d.phase_range + 1));
        return a
    };
    var e = [4, 8, 16, 32, 64, 96, 128, 160, 202, 254, 380, 508, 762, 1016, 2034, 4068],
        f = function() {
            b.call(this);
            this.noise = 16384;
            this.synth = new Nes.Blip_Synth(Nes.Blip_Synth.blip_med_quality,
                15)
        };
    f.prototype = Object.create(b.prototype);
    f.prototype.run = function(a, b) {
        if (this.output) {
            var c = this.volume(),
                d = this.noise & 1 ? c : 0,
                f = this.update_amp(d);
            f && this.synth.offset(a, f, this.output);
            a += this.delay;
            if (a < b) {
                var g = e[this.regs[2] & 15];
                if (c) {
                    var h = this.output.resampled_duration(g),
                        k = this.output.resampled_time(a),
                        f = 2 * d - c,
                        d = this.regs[2] & 128 ? 8 : 13;
                    do {
                        var t = this.noise << d ^ this.noise << 14;
                        a += g;
                        this.noise + 1 & 2 && (f = -f, this.synth.offset_resampled(k, f, this.output));
                        k += h;
                        this.noise = t & 16384 | this.noise >> 1
                    } while (a <
                        b);
                    this.last_amp = f + c >> 1
                } else a += Math.floor((b - a + g - 1) / g) * g, this.regs[2] & 128 || (this.noise = (this.noise << 13 ^ this.noise << 14) & 16384 | this.noise >> 1)
            }
            this.delay = a - b
        }
    };
    f.prototype.reset = function() {
        this.noise = 16384;
        b.prototype.reset.call(this)
    };
    var g = [
            [428, 380, 340, 320, 286, 254, 226, 214, 190, 160, 142, 128, 106, 84, 72, 54],
            [398, 353, 316, 297, 266, 236, 210, 199, 177, 149, 132, 119, 98, 78, 67, 50]
        ],
        h = [0, 0, 1, 2, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8, 8, 9, 10, 10, 11, 11, 12, 13, 13, 14, 14, 15, 15, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27,
            27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32, 32, 33, 33, 34, 34, 35, 35, 35, 36, 36, 37, 37, 38, 38, 38, 39, 39, 40, 40, 40, 41, 41, 42, 42, 42, 43, 43, 44, 44, 44, 45, 45, 45, 46, 46, 47, 47, 47, 48, 48, 48, 49, 49, 49, 50, 50, 50, 51, 51, 51, 52, 52, 52, 53, 53, 53, 54, 54, 54, 55, 55, 55, 56, 56, 56, 57, 57, 57
        ],
        k = function(b) {
            a.call(this);
            this.apu = b;
            this.buf = this.dac = this.address = 0;
            this.bits_remain = 1;
            this.bits = 0;
            this.silence = this.buf_empty = !0;
            this.next_irq = 1073741824;
            this.irq_enabled = this.irq_flag = !1;
            this.pal_mode = this.periodValue = 0;
            this.nonlinear = !1;
            this.rom_reader = null;
            this.synth = new Nes.Blip_Synth(Nes.Blip_Synth.blip_med_quality, 127)
        };
    k.prototype = Object.create(a.prototype);
    k.prototype.run = function(a, b) {
        if (this.output) {
            var c = this.update_amp(this.dac);
            c && this.synth.offset(a, c, this.output);
            a += this.delay;
            if (a < b) {
                c = this.bits_remain;
                if (this.silence && this.buf_empty) {
                    var d = Math.floor((b - a + this.periodValue - 1) / this.periodValue),
                        c = (c - 1 + 8 - d % 8) % 8 + 1;
                    a += d * this.periodValue
                } else {
                    var d = this.bits,
                        e = this.dac;
                    do {
                        if (!this.silence) {
                            var f = 4 * (d & 1) - 2,
                                d = d >> 1;
                            127 >= e + f >>> 0 && (e += f, this.synth.offset_inline(a,
                                f, this.output))
                        }
                        a += this.periodValue;
                        0 === --c && (c = 8, this.buf_empty ? this.silence = !0 : (this.silence = !1, d = this.buf, this.buf_empty = !0, this.fill_buffer()))
                    } while (a < b);
                    this.dac = this.last_amp = e;
                    this.bits = d
                }
                this.bits_remain = c
            }
            this.delay = a - b
        }
    };
    k.prototype.reset = function() {
        this.buf = this.dac = this.address = 0;
        this.bits_remain = 1;
        this.bits = 0;
        this.silence = this.buf_empty = !0;
        this.next_irq = 1073741824;
        this.irq_enabled = this.irq_flag = !1;
        a.prototype.reset.call(this);
        this.periodValue = 54
    };
    k.prototype.start = function() {
        this.reload_sample();
        this.fill_buffer();
        this.recalc_irq()
    };
    k.prototype.write_register = function(a, b) {
        if (0 === a) this.periodValue = g[this.pal_mode][b & 15], this.irq_enabled = 128 === (b & 192), this.irq_flag = this.irq_flag && this.irq_enabled, this.recalc_irq();
        else if (1 === a) {
            if (!this.nonlinear) {
                var c = h[this.dac];
                this.dac = b & 127;
                this.last_amp = this.dac - (h[this.dac] - c)
            }
            this.dac = b & 127
        }
    };
    k.prototype.recalc_irq = function() {
        var a = 1073741824;
        this.irq_enabled && this.length_counter && (a = this.apu.last_time + this.delay + (8 * (this.length_counter - 1) + this.bits_remain -
            1) * this.periodValue + 1);
        a !== this.next_irq && (this.next_irq = a, this.apu.irq_changed())
    };
    k.prototype.fill_buffer = function() {
        this.buf_empty && this.length_counter && (this.buf = this.rom_reader(32768 + this.address), this.address = this.address + 1 & 32767, this.buf_empty = !1, 0 === --this.length_counter && (0 < (this.regs[0] & 64) ? this.reload_sample() : (this.apu.osc_enables &= 239, this.irq_flag = this.irq_enabled, this.next_irq = 1073741824, this.apu.irq_changed())))
    };
    k.prototype.reload_sample = function() {
        this.address = 16384 + 64 * this.regs[2];
        this.length_counter = 16 * this.regs[3] + 1
    };
    Nes.Nes_Square = c;
    Nes.Nes_Triangle = d;
    Nes.Nes_Noise = f;
    Nes.Nes_Dmc = k
})();
this.Nes = this.Nes || {};
(function() {
    var a = [10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30],
        b = function() {
            this.start_addr = 16384;
            this.end_addr = 16407;
            this.status_addr = 16405;
            this._square1 = new Nes.Nes_Square;
            this._square2 = new Nes.Nes_Square;
            this._triangle = new Nes.Nes_Triangle;
            this._noise = new Nes.Nes_Noise;
            this._dmc = new Nes.Nes_Dmc;
            this.osc = [this._square1, this._square2, this._triangle, this._noise, this._dmc];
            this.next_irq = this.earliest_irq_ = this.last_time = 0;
            this._square_synth = new Nes.Blip_Synth(Nes.Blip_Synth.blip_good_quality,
                15);
            this._irqCallback = null;
            this.frame = this.frame_mode = 0;
            this._dmc.apu = this;
            this._dmc.rom_reader = null;
            this._square1.synth = this._square_synth;
            this._square2.synth = this._square_synth;
            this.output(null);
            this.volume(1);
            this.reset(!1)
        };
    b.no_irq = 1073741824;
    b.irq_waiting = 0;
    b.prototype.reset = function(a, b) {
        a = a || !1;
        b = b || 0;
        this.frame_period = a ? 8314 : 7458;
        this._dmc.pal_mode = a ? 1 : 0;
        this._square1.reset();
        this._square2.reset();
        this._triangle.reset();
        this._noise.reset();
        this._dmc.reset();
        this.osc_enables = this.last_time =
            0;
        this.irq_flag = !1;
        this.earliest_irq_ = 1073741824;
        this.frame_delay = 1;
        this.write_register(0, 16407, 0);
        this.write_register(0, 16405, 0);
        for (var e = 16384; 16403 >= e; e++) this.write_register(0, e, e & 3 ? 0 : 16);
        this._dmc.dac = b;
        this._dmc.nonlinear || (this._dmc.last_amp = b)
    };
    b.prototype.output = function(a) {
        for (var b = 0; 5 > b; b++) this.osc_output(b, a)
    };
    b.prototype.dmc_reader = function(a) {
        this._dmc.rom_reader = a
    };
    b.prototype.write_register = function(b, d, e) {
        if (!(16384 > d || 16407 < d))
            if (this.run_until(b), 16404 > d) {
                b = d - 16384 >> 2;
                var f =
                    this.osc[b];
                d &= 3;
                f.regs[d] = e;
                f.reg_written[d] = !0;
                4 === b ? this._dmc.write_register(d, e) : 3 === d && (this.osc_enables >> b & 1 && (f.length_counter = a[e >> 3 & 31]), 2 > b && (f.phase = Nes.Nes_Square.phase_range - 1))
            } else if (16405 === d) {
            for (d = 0; 5 > d; ++d) 0 === (e >> d & 1) && (this.osc[d].length_counter = 0);
            d = this._dmc.irq_flag;
            this._dmc.irq_flag = !1;
            b = this.osc_enables;
            this.osc_enables = e;
            e & 16 ? b & 16 || this._dmc.start() : (this._dmc.next_irq = 1073741824, d = !0);
            d && this.irq_changed()
        } else 16407 === d && (this.frame_mode = e, d = !(e & 64), this.irq_flag &= d,
            this.next_irq = 1073741824, this.frame_delay &= 1, this.frame = 0, e & 128 || (this.frame = 1, this.frame_delay += this.frame_period, d && (this.next_irq = b + this.frame_delay + 3 * this.frame_period)), this.irq_changed())
    };
    b.prototype.read_status = function(a) {
        this.run_until(a - 1);
        for (var b = (this._dmc.irq_flag ? 128 : 0) | (this.irq_flag ? 64 : 0), e = 0; 5 > e; e++) 0 < this.osc[e].length_counter && (b |= 1 << e);
        this.run_until(a);
        this.irq_flag && (this.irq_flag = !1, this.irq_changed());
        return b
    };
    b.prototype.end_frame = function(a) {
        a > this.last_time && this.run_until(a);
        this.last_time -= a;
        1073741824 !== this.next_irq && (this.next_irq -= a);
        1073741824 !== this._dmc.next_irq && (this._dmc.next_irq -= a);
        1073741824 !== this.earliest_irq_ && (this.earliest_irq_ -= a, 0 > this.earliest_irq_ && (this.earliest_irq_ = 0))
    };
    b.prototype.save_snapshot = function(a) {};
    b.prototype.load_snapshot = function(a) {};
    b.prototype.volume = function(a) {
        a = a || 1;
        this._dmc.nonlinear = !1;
        this._square_synth.volume(.1128 * a);
        this._triangle.synth.volume(.12765 * a);
        this._noise.synth.volume(.0741 * a);
        this._dmc.synth.volume(.42545 *
            a)
    };
    b.prototype.irq_notifier = function(a) {
        this._irqCallback = a
    };
    b.prototype.earliest_irq = function() {
        return this.earliest_irq_
    };
    b.prototype.run_until = function(a) {
        if (a !== this.last_time)
            for (;;) {
                var b = this.last_time + this.frame_delay;
                b > a && (b = a);
                this.frame_delay -= b - this.last_time;
                this._square1.run(this.last_time, b);
                this._square2.run(this.last_time, b);
                this._triangle.run(this.last_time, b);
                this._noise.run(this.last_time, b);
                this._dmc.run(this.last_time, b);
                this.last_time = b;
                if (b === a) break;
                this.frame_delay = this.frame_period;
                switch (this.frame++) {
                    case 0:
                        this.frame_mode & 192 || (this.next_irq = b + 4 * this.frame_period + 1, this.irq_flag = !0);
                    case 2:
                        this._square1.clock_length(32);
                        this._square2.clock_length(32);
                        this._noise.clock_length(32);
                        this._triangle.clock_length(128);
                        this._square1.clock_sweep(-1);
                        this._square2.clock_sweep(0);
                        break;
                    case 1:
                        this.frame_delay -= 2;
                        break;
                    case 3:
                        this.frame = 0, this.frame_mode & 128 && (this.frame_delay += this.frame_period - 6)
                }
                this._triangle.clock_linear_counter();
                this._square1.clock_envelope();
                this._square2.clock_envelope();
                this._noise.clock_envelope()
            }
    };
    b.prototype.irq_changed = function() {
        var a = this._dmc.next_irq;
        this._dmc.irq_flag || this.irq_flag ? a = 0 : a > this.next_irq && (a = this.next_irq);
        a !== this.earliest_irq_ && (this.earliest_irq_ = a, this._irqCallback && this._irqCallback())
    };
    b.prototype.osc_output = function(a, b) {
        this.osc[a].output = b
    };
    b.prototype.save_snapshot = function() {
        return {}
    };
    b.prototype.load_snapshot = function() {};
    Nes.Nes_Apu = b
})();
this.Nes = this.Nes || {};
this.Gui = this.Gui || {};
var APUOutBufferSize = 4096,
    APUBaseRate = 1789773,
    ApuLegacy = function(a) {
        var b = this;
        this._outBufferSize = 4096;
        this._soundRate = 44100;
        this.mainboard = a;
        this.mainboard.connect("reset", function(a) {
            b._onReset(a)
        });
        this.nextIrq = -1;
        this._irqActive = !1;
        this.mLastCalculatedNextIrqTime = -1;
        this._enabled = !0;
        this._justRenabled = 0;
        var c = 44100;
        this.apu = new Nes.Nes_Apu;
        try {
            this._renderer = new Gui.WebAudioRenderer(APUOutBufferSize), this._outBuffer = this._renderer.createBuffer(this._outBufferSize), c = this._renderer.getSampleRate(),
                this.buf = new Nes.Blip_Buffer, this.buf.clock_rate(APUBaseRate), this.apu.output(this.buf), this.buf.sample_rate(c)
        } catch (d) {
            this._renderer = null, this._enabled = !1, console.log("WebAudio unsupported in this browser. Sound will be disabled...")
        }
        this.apu.dmc_reader(function(b) {
            return a.memory.read8(b)
        });
        this.apu.irq_notifier(function() {
            b.CalculateWhenIrqDue()
        })
    };
ApuLegacy.prototype.enableSound = function(a) {
    a = void 0 === a ? !0 : a;
    a !== this._enabled && (a && (this._justRenabled = 2), this._enabled = a)
};
ApuLegacy.prototype.soundEnabled = function() {
    return this._enabled && this.soundSupported()
};
ApuLegacy.prototype.soundSupported = function() {
    return !!this._renderer
};
ApuLegacy.prototype.setVolume = function(a) {
    this._renderer && this._renderer.setVolume(a)
};
ApuLegacy.prototype._onReset = function(a) {
    this.nextIrq = -1;
    this.apu.reset("NTSC" !== COLOUR_ENCODING_NAME)
};
ApuLegacy.prototype.readFromRegister = function(a) {
    var b = 0;
    a === this.apu.status_addr && (this.mainboard.synchroniser.synchronise(), b = Math.floor(this.mainboard.synchroniser.getCpuMTC() / COLOUR_ENCODING_MTC_PER_CPU), 16405 === a && this._irqActive && (this._irqActive = !1), b = this.apu.read_status(b));
    return b
};
ApuLegacy.prototype.writeToRegister = function(a, b) {
    if (a >= this.apu.start_addr && a <= this.apu.end_addr) {
        this.mainboard.synchroniser.synchronise();
        var c = Math.floor(this.mainboard.synchroniser.getCpuMTC() / COLOUR_ENCODING_MTC_PER_CPU);
        this.apu.write_register(c, a, b)
    }
};
ApuLegacy.prototype.synchronise = function(a, b) {
    var c = Math.floor(a / COLOUR_ENCODING_MTC_PER_CPU) - 1;
    this.apu.run_until(0 <= c ? c : 0);
    this.apu.earliest_irq() === Nes.Nes_Apu.irq_waiting && (this._irqActive = !0)
};
ApuLegacy.prototype.onEndFrame = function(a) {
    a = Math.floor(this.mainboard.synchroniser.getCpuMTC() / COLOUR_ENCODING_MTC_PER_CPU);
    this.apu.end_frame(a);
    this._renderer && this._enabled && (this.buf.end_frame(a), this.buf.samples_avail() >= APUOutBufferSize && (a = this._outBuffer.lockBuffer(), this.buf.read_samples(a, APUOutBufferSize), this._outBuffer.unlockBuffer()));
    this.CalculateWhenIrqDue()
};
ApuLegacy.prototype._eventIrqTrigger = function(a) {};
ApuLegacy.prototype.CalculateWhenIrqDue = function() {
    var a = this.apu.earliest_irq();
    this.nextIrq = a !== this.apu.no_irq ? a * COLOUR_ENCODING_MTC_PER_CPU : -1
};
ApuLegacy.prototype.saveState = function() {
    var a = {};
    a.apu = this.apu.save_snapshot();
    a.nextIrq = this.nextIrq;
    a.mLastCalculatedNextIrqTime = this.mLastCalculatedNextIrqTime;
    return a
};
ApuLegacy.prototype.loadState = function(a) {
    this.apu.load_snapshot(a.apu);
    this.nextIrq = a.nextIrq;
    this.mLastCalculatedNextIrqTime = a.mLastCalculatedNextIrqTime
};
Nes.ApuLegacy = ApuLegacy;
this.Nes = this.Nes || {};
var APU_BASE_UNIT = 15,
    APU_FRAME_COUNTER_INTERVAL = 7456 * APU_BASE_UNIT,
    APU_IRQ_FRAME_EVENT = 29828 * APU_BASE_UNIT,
    APU_FRAME_MODE0_TOTAL = 29830 * APU_BASE_UNIT,
    APU_FRAME_MODE1_TOTAL = 37282 * APU_BASE_UNIT,
    ApuFrameCounter = function(a) {
        this._mainboard = a;
        this._sequenceStage = this._lastFrameStartMtc = this._mode = 0;
        this._irqEventId = -1;
        this._interruptInProgress = !1
    };
ApuFrameCounter.prototype.getNextFrameClock = function(a) {
    a = this._lastFrameStartMtc + (this._sequenceStage + 1) * APU_FRAME_COUNTER_INTERVAL;
    a >= COLOUR_ENCODING_FRAME_MTC && (a -= COLOUR_ENCODING_FRAME_MTC);
    return a
};
ApuFrameCounter.prototype._getNextIrqClock = function(a) {
    a = this._lastFrameStartMtc + APU_IRQ_FRAME_EVENT;
    a >= COLOUR_ENCODING_FRAME_MTC && (a -= COLOUR_ENCODING_FRAME_MTC);
    return a
};
ApuFrameCounter.prototype.acknowledgeClock = function(a) {
    this._sequenceStage++;
    a = !1;
    var b = 0;
    switch (this._mode) {
        case 0:
            a = 4 <= this._sequenceStage;
            b = APU_FRAME_MODE0_TOTAL;
            break;
        case 1:
            a = 5 <= this._sequenceStage, b = APU_FRAME_MODE1_TOTAL
    }
    a && (this._sequenceStage = 0, this._lastFrameStartMtc += b, this._lastFrameStartMtc >= COLOUR_ENCODING_FRAME_MTC && (this._lastFrameStartMtc -= COLOUR_ENCODING_FRAME_MTC), this._mainboard.synchroniser.changeEventTime(this._irqEventId, this._getNextIrqClock()))
};
ApuFrameCounter.prototype.onEndFrame = function() {};
ApuFrameCounter.prototype.reset = function() {
    var a = this;
    this._irqEventId = this._mainboard.synchroniser.addEvent("apu irq", -1, function(b) {
        a._eventApuIrq(b)
    })
};
ApuFrameCounter.prototype._eventApuIrq = function(a) {
    this._interruptInProgress || (this._interruptInProgress = !0, this.mainboard.cpu.holdIrqLineLow(!0))
};
ApuFrameCounter.prototype.acknowledgeIrq = function() {
    this._interruptInProgress && (this._mainboard.cpu.holdIrqLineLow(!1), this._interruptInProgress = !1)
};
Nes.ApuFrameCounter = ApuFrameCounter;
this.Nes = this.Nes || {};
var ApuOutputBuffer = function(a, b, c) {
    this._buffer = a;
    this._array = new Float32Array(b);
    this._sampleRate = c;
    this._framesWorthOfDataSize = Math.floor(this._sampleRate / COLOUR_ENCODING_REFRESHRATE);
    if (this._array.length < this._framesWorthOfDataSize) throw Error("Could not contain a frames worth of audio data in the provided audio buffer!");
    this.clear()
};
ApuOutputBuffer.prototype._ticksToBufferPosition = function(a) {
    return Math.floor(a / COLOUR_ENCODING_FRAME_MTC * this._framesWorthOfDataSize)
};
ApuOutputBuffer.prototype.clear = function() {
    for (var a = 0; a < this._array.length; ++a) this._array[a] = 0
};
ApuOutputBuffer.prototype.write = function(a, b, c) {
    var d = this._ticksToBufferPosition(a);
    for (a = Math.min(this._array.length, this._ticksToBufferPosition(a + b)); d < a; ++d) this._array[d] = c
};
ApuOutputBuffer.prototype.commit = function() {
    for (var a = this._buffer.lockBuffer(), b = 0; b < this._array.length; ++b) a[b] = this._array[b];
    this._buffer.unlockBuffer()
};
Nes.ApuOutputBuffer = ApuOutputBuffer;
this.Nes = this.Nes || {};
var ApuEnvelope = function() {
    this._envelopeVolume = this._envelopeCounter = 0;
    this._doEnvelopeReloadOnNextClock = !1
};
ApuEnvelope.prototype.reset = function() {
    this._envelopeVolume = this._envelopeCounter = 0;
    this._doEnvelopeReloadOnNextClock = !1
};
ApuEnvelope.prototype.reloadOnNextClock = function() {
    this._doEnvelopeReloadOnNextClock = !0
};
ApuEnvelope.prototype.decrementCounter = function(a) {
    if (this._doEnvelopeReloadOnNextClock) this._doEnvelopeReloadOnNextClock = !1, this._envelopeCounter = this._volumeValue, this._envelopeVolume = 15;
    else if (this._envelopeCounter--, 0 > this._envelopeCounter && (this._envelopeCounter = this._volumeValue, 0 < this._envelopeVolume || !a)) this._envelopeVolume--, 0 > this._envelopeVolume && (this._envelopeVolume = 15)
};
ApuEnvelope.prototype.getEnvelopeVolume = function() {
    return this._envelopeVolume
};
Nes.ApuEnvelope = ApuEnvelope;
this.Nes = this.Nes || {};
var lengthCounterTable = [10, 254, 20, 2, 40, 4, 80, 6, 160, 8, 60, 10, 14, 12, 26, 14, 12, 16, 24, 18, 48, 20, 96, 22, 192, 24, 72, 26, 16, 28, 32, 30],
    ApuSquareWaveOscillator = function(a) {
        this._buffer = a;
        this._enabled = !1;
        this._lengthCounter = this._timer = 0;
        this._lengthCounterEnabled = !0;
        this._useConstantVolume = !1;
        this._volumeValue = 0;
        this._envelope = new Nes.ApuEnvelope;
        this._delay = 0
    };
ApuSquareWaveOscillator.prototype.decrementLengthCounter = function() {
    0 < this._lengthCounter && this._lengthCounterEnabled && this._lengthCounter--
};
ApuSquareWaveOscillator.prototype._getVolume = function() {
    return 0 < this._lengthCounter && 8 <= this._timer ? this._useConstantVolume ? this._volumeValue : this._envelope.getEnvelopeVolume() : 0
};
ApuSquareWaveOscillator.prototype.enable = function(a) {
    this._enabled = a;
    this._lengthCounter = 0
};
ApuSquareWaveOscillator.prototype.writeEnvelope = function(a) {
    this._lengthCounterEnabled = 0 === (a & 32);
    this._useConstantVolume = 16 === (a & 16);
    this._volumeValue = a & 15
};
ApuSquareWaveOscillator.prototype.writeSweep = function(a) {};
ApuSquareWaveOscillator.prototype.writeTimer = function(a) {
    this._timer = this._timer & 1792 | a
};
ApuSquareWaveOscillator.prototype.writeLengthCounter = function(a) {
    this._timer = this._timer & 255 | (a & 7) << 8;
    this._lengthCounter = lengthCounterTable[a >> 3 & 31];
    this._envelope.reloadOnNextClock()
};
ApuSquareWaveOscillator.prototype._4bitVolumeToBufferValue = function(a) {
    return a / 16
};
ApuSquareWaveOscillator.prototype.synchronise = function(a, b) {
    if (this._enabled) {
        for (var c = this._getVolume(), d = this._timer, e = 16 * (d + 1) * COLOUR_ENCODING_MTC_PER_CPU, f = Math.floor(e / 2), g = e - f, h = a + this._delay, k = this._4bitVolumeToBufferValue(c); h < b; h += e) 0 === this._lengthCounter || 0 === c || 2048 <= d + 0 || (this._buffer.write(h, f, k), this._buffer.write(h + f, g, -k));
        this._delay = h - b
    }
};
Nes.ApuSquareWaveOscillator = ApuSquareWaveOscillator;
this.Nes = this.Nes || {};
var Apu = function(a) {
    var b = this;
    this.mainboard = a;
    this.mainboard.connect("reset", function(a) {
        b._onReset(a)
    });
    this._enabled = !0;
    this._soundRate = 44100;
    this._outBufferSize = 4096;
    try {
        this._renderer = new Gui.WebAudioRenderer(this._outBufferSize), this._soundRate = this._renderer.getSampleRate()
    } catch (c) {
        this._renderer = null, this._enabled = !1, console.log("WebAudio unsupported in this browser. Sound will be disabled...")
    }
    this._frameCounter = new Nes.ApuFrameCounter(this.mainboard);
    this._buffers = [];
    this._square1 = new ApuSquareWaveOscillator(this._addBuffer());
    this._square2 = new ApuSquareWaveOscillator(this._addBuffer())
};
Apu.prototype._addBuffer = function() {
    var a = new ApuOutputBuffer(this._renderer.createBuffer(this._outBufferSize), this._outBufferSize, this._soundRate);
    this._buffers.push(a);
    return a
};
Apu.prototype.enableSound = function(a) {
    this._enabled = a
};
Apu.prototype.soundEnabled = function() {
    return this._enabled && this.soundSupported()
};
Apu.prototype.soundSupported = function() {
    return !!this._renderer
};
Apu.prototype.setVolume = function(a) {
    this._renderer && this._renderer.setVolume(a)
};
Apu.prototype._onReset = function(a) {
    this._frameCounter.reset()
};
Apu.prototype.readFromRegister = function(a) {
    return 0
};
Apu.prototype.writeToRegister = function(a, b) {
    switch (a) {
        case 16384:
            this._square1.writeEnvelope(b);
            break;
        case 16385:
            this._square1.writeSweep(b);
            break;
        case 16386:
            this._square1.writeTimer(b);
            break;
        case 16387:
            this._square1.writeLengthCounter(b);
            break;
        case 16388:
            this._square2.writeEnvelope(b);
            break;
        case 16389:
            this._square2.writeSweep(b);
            break;
        case 16390:
            this._square2.writeTimer(b);
            break;
        case 16391:
            this._square2.writeLengthCounter(b);
            break;
        case 16405:
            this._square1.enable(0 < (b & 1)), this._square2.enable(0 < (b &
                2))
    }
};
Apu.prototype.synchronise = function(a, b) {
    if (this._enabled)
        for (; a < b;) {
            var c = this._frameCounter.getNextFrameClock(a),
                d = Math.min(b, c);
            this._square1.synchronise(a, d);
            this._square2.synchronise(a, d);
            d === c && (this._square1.decrementLengthCounter(), this._square2.decrementLengthCounter(), this._frameCounter.acknowledgeClock(c));
            a = d
        }
};
Apu.prototype.onEndFrame = function(a) {
    this._frameCounter.onEndFrame();
    if (this._renderer && this._enabled)
        for (a = 0; a < this._buffers.length; ++a) {
            var b = this._buffers[a];
            b.commit();
            b.clear()
        }
};
Apu.prototype.saveState = function() {
    return {}
};
Apu.prototype.loadState = function(a) {};
Nes.Apu = Apu;
this.Nes = this.Nes || {};
var SquareWaveTester = function(a) {
    this._enabled = !0;
    this._soundRate = 44100;
    this._outBufferSize = 4096;
    try {
        this._renderer = new Gui.WebAudioRenderer(this._outBufferSize), this._soundRate = this._renderer.getSampleRate()
    } catch (b) {
        this._renderer = null, this._enabled = !1, console.log("WebAudio unsupported in this browser. Sound will be disabled...")
    }
    this._buffers = [];
    this._square1 = new ApuSquareWaveOscillator(this._addBuffer());
    this._square1.enable(!0);
    this._square1.writeTimer(128);
    this._square1.writeLengthCounter(32);
    this._square1.writeEnvelope(31)
};
SquareWaveTester.prototype._addBuffer = function() {
    var a = new ApuOutputBuffer(this._renderer.createBuffer(this._outBufferSize), this._outBufferSize, this._soundRate);
    this._buffers.push(a);
    return a
};
SquareWaveTester.prototype.synchronise = function(a, b) {
    this._enabled && this._square1.synchronise(a, b)
};
SquareWaveTester.prototype.onEndFrame = function(a) {
    if (this._renderer && this._enabled)
        for (this.synchronise(0, COLOUR_ENCODING_FRAME_MTC), a = 0; a < this._buffers.length; ++a) {
            var b = this._buffers[a];
            b.commit();
            b.clear()
        }
};
Nes.SquareWaveTester = SquareWaveTester;
this.Nes = this.Nes || {};
"use strict";
var ScrollReloadTime = 304,
    XReloadTime = 257,
    SecondLastTileReloadTime = 324,
    LastTileReloadTime = 332,
    ticksPerTile = 8,
    ticksFirstTile = 3,
    ticksLastTile = ticksFirstTile + 31 * ticksPerTile,
    YIncrementTime = 251,
    YIncrementTimeRendering = (YIncrementTime + 17) * MASTER_CYCLES_PER_PPU,
    XReloadTimeRendering = (XReloadTime + 17) * MASTER_CYCLES_PER_PPU,
    backgroundRenderingStart = 0,
    backgroundRenderingEnd = 0,
    backgroundScrollReloadTime = 0,
    PpuRenderBg = function(a) {
        this.ppu = a;
        this._useMMC2Latch = this._spriteZeroHit = !1
    };
PpuRenderBg.prototype.reset = function() {
    backgroundRenderingStart = this.ppu.screenCoordinatesToTicks(ScrollReloadTime - 1, -1);
    backgroundRenderingEnd = this.ppu.screenCoordinatesToTicks(SecondLastTileReloadTime - 1, 239);
    backgroundScrollReloadTime = this.ppu.screenCoordinatesToTicks(ScrollReloadTime, -1);
    this._bgTableAddress = 0;
    this._spriteZeroHit = !1;
    this._renderBuffer = this.ppu.mainboard.renderBuffer;
    this._useMMC2Latch = void 0 !== this.ppu.mainboard.cart.memoryMapper.MMC2Latch
};
PpuRenderBg.prototype.onControl1Change = function(a) {
    this._bgTableAddress = 0 < (a & 16) ? 4096 : 0
};
PpuRenderBg.prototype.onEndFrame = function() {
    this._spriteZeroHit = !1
};
PpuRenderBg.prototype.saveState = function(a) {
    a._spriteZeroHit = this._spriteZeroHit
};
PpuRenderBg.prototype.loadState = function(a) {
    this._spriteZeroHit = a._spriteZeroHit
};
PpuRenderBg.prototype._renderTile = function(a, b, c, d) {
    var e = 0;
    c |= 0;
    d = d ? 8 : 0;
    e = 8 * (b | 0);
    b = a & 31;
    var f = (a & 992) >> 5,
        g = this.ppu.readNameTable(8192 + (a & 4095) & 65535, 0),
        g = this._bgTableAddress + 16 * g + ((a & 28672) >> 12),
        h = this.ppu.readNameTable(9152 | a & 3072 | (f & 28) << 1 | b >> 2 & 7, 1);
    a = 0;
    a = 0 === (b & 2) ? 0 === (f & 2) ? (h & 3) << 2 : (h & 48) >> 2 : 0 === (f & 2) ? h & 12 : (h & 192) >> 4;
    b = this.ppu.read8(g, !1, 2);
    f = this.ppu.read8(g + 8, !1, 3);
    this._useMMC2Latch && this.ppu.mainboard.cart.memoryMapper.MMC2Latch(g + 8);
    for (var h = e - this.ppu.fineX, g = h + 7, k = Math.max(h, 0), e =
            0, h = 128 >> k - h; k <= g; ++k) e = 0 < (b & h) ? 1 : 0, e |= 0 < (f & h) ? 2 : 0, h >>= 1, k >= d && k < SCREEN_WIDTH && 0 < e && (e |= a, 0 === (e & 3) && (e = 0), this._renderBuffer.renderPixel(k, c, this.ppu.paletteTables[0][e & 15] | 0) && !this._spriteZeroHit && (e = this.ppu.screenCoordinatesToTicks(k, c), this._spriteZeroHit = !0, this.ppu.mainboard.synchroniser.changeEventTime(this.ppu._spriteZeroEventId, e)))
};
var backgroundTileCount = 34;
PpuRenderBg.prototype._incrementY = function(a) {
    28672 === (a & 28672) ? (a &= 36863, a = 928 === (a & 992) ? (a ^ 2048) & 64543 : 992 === (a & 992) ? a & 64543 : a + 32) : a += 4096;
    return a
};
PpuRenderBg.prototype._incrementX = function(a) {
    return 31 === (a & 31) ? (a ^ 1024) & 65504 : a + 1 & 65535
};
PpuRenderBg.prototype.renderTo = function(a, b, c, d) {
    var e = 0,
        f = 0,
        g = 0,
        e = e = f = 0,
        h = 0 === (this.ppu.control2 & 2),
        k = 0 < (this.ppu.control2 & 8),
        l = 0,
        m = 0,
        n = 0;
    a < backgroundRenderingStart && (a = backgroundRenderingStart);
    b > backgroundRenderingEnd && (b = backgroundRenderingEnd);
    if (b <= a) return c;
    e = a % MASTER_CYCLES_PER_SCANLINE;
    f = a - e - MASTER_CYCLES_PER_SCANLINE + SecondLastTileReloadTime * MASTER_CYCLES_PER_PPU;
    for (e = f + MASTER_CYCLES_PER_SCANLINE; e < a || f < backgroundRenderingStart;) f += MASTER_CYCLES_PER_SCANLINE, e += MASTER_CYCLES_PER_SCANLINE;
    backgroundScrollReloadTime > a && backgroundScrollReloadTime <= b && (c = c & 1055 | d & 31712);
    e = f;
    for (n = Math.floor((f - backgroundRenderingStart) / MASTER_CYCLES_PER_SCANLINE) | 0; e <= b;) {
        m = e + YIncrementTimeRendering;
        l = e + XReloadTimeRendering;
        for (g = 0; g < backgroundTileCount; ++g) {
            f = e + 8 * g * MASTER_CYCLES_PER_PPU;
            if (f > b || f > backgroundRenderingEnd) break;
            f <= a || (k && this._renderTile(c, g, n, h), c = this._incrementX(c))
        }
        m < backgroundRenderingEnd && m > a && m <= b && (c = this._incrementY(c));
        l < backgroundRenderingEnd && l > a && l <= b && (c = c & 64480 | d & 1055);
        e +=
            MASTER_CYCLES_PER_SCANLINE;
        n++
    }
    return c
};
Nes.PpuRenderBg = PpuRenderBg;
this.Nes = this.Nes || {};
"use strict";
var PpuRenderSprites = function(a) {
    this.ppu = a;
    this._useMMC2Latch = this._overflowSet = !1
};
PpuRenderSprites.prototype.reset = function() {
    this._overflowSet = !1;
    this._useMMC2Latch = void 0 !== this.ppu.mainboard.cart.memoryMapper.MMC2Latch
};
PpuRenderSprites.prototype.onEndFrame = function() {
    this._overflowSet = !1
};
PpuRenderSprites.prototype.saveState = function(a) {
    a._overflowSet = this._overflowSet
};
PpuRenderSprites.prototype.loadState = function(a) {
    this._overflowSet = a._overflowSet
};
var spriteEvaluationStart = 64,
    isRangeOverlapping = function(a, b, c, d) {
        return b >= c && a <= d
    };
PpuRenderSprites.prototype._renderSprite = function(a, b, c, d, e) {
    var f = 4 * b,
        g = this.ppu.spriteMemory[f + 1],
        h = this.ppu.spriteMemory[f + 2],
        f = this.ppu.spriteMemory[f + 3],
        k = 0 < (h & 32),
        l = 0 < (h & 64),
        m = 0 < (h & 128);
    c = Math.max(e, c);
    d = Math.min(e + a - 1, d);
    for (var n = 0, p = 0, n = 0, q = !1, u = q = p = 0, r = 0, s = 0; c <= d; ++c)
        for (p = c - e, 8 === a ? n = 16 * g + ((m ? 7 - p : p) & 7) + (0 < (this.ppu.control1 & 8) ? 4096 : 0) : (n = 16 * (g & 254) + 4096 * (g & 1), n = (q = IS_INT_BETWEEN(c, e, e + 8)) ? m ? n + (23 - c + e) : n + p : m ? n + (15 - c + e) : n + (8 + p)), p = this.ppu.read8(n, !0, 0), q = this.ppu.read8(n + 8, !0, 0), u = (h & 3) <<
            2, this._useMMC2Latch && this.ppu.mainboard.cart.memoryMapper.MMC2Latch(n + 8), s = 0; 8 > s; ++s)
            if (r = s + f, !(0 === (this.ppu.control2 & 4) && 8 > r)) {
                if (255 < r) break;
                var n = 128 >> (l ? 7 - s : s),
                    t = 0 < (p & n) ? 1 : 0,
                    t = t | (0 < (q & n) ? 2 : 0);
                0 < t && (t |= u, this.ppu.mainboard.renderBuffer.renderSpritePixel(b, k, r, c, this.ppu.paletteTables[1][t & 15] | 0))
            }
};
PpuRenderSprites.prototype.renderTo = function(a, b) {
    var c = this.ppu.screenCoordinatesToTicks(spriteEvaluationStart - 1, -1),
        d = this.ppu.screenCoordinatesToTicks(spriteEvaluationStart, 238),
        e = a - a % MASTER_CYCLES_PER_SCANLINE + spriteEvaluationStart * MASTER_CYCLES_PER_PPU,
        f = 0,
        g = 0,
        h = 0 < (this.ppu.control1 & 32) ? 16 : 8,
        k = 0,
        l = 0;
    if (0 < (this.ppu.control2 & 16) && (a < c && (a = c), b > d && (b = d), !(b <= a))) {
        for (; e <= a;) e += MASTER_CYCLES_PER_SCANLINE;
        if (!(e > b)) {
            for (g = f = this.ppu.ticksToScreenCoordinates(e).y + 1; e <= b;) e += MASTER_CYCLES_PER_SCANLINE,
                g++;
            g = Math.min(g, 239);
            for (k = 0; 64 > k; ++k) l = this.ppu.spriteMemory[4 * k] + 1, 0 < l && l < SCREEN_HEIGHT && isRangeOverlapping(f, g, l, l + h) && this._renderSprite(h, k, f, g, l)
        }
    }
};
Nes.PpuRenderSprites = PpuRenderSprites;
this.Nes = this.Nes || {};
"use strict";
var ppu = function(a) {
    var b = this;
    this.mainboard = a;
    this.mainboard.connect("reset", function(a) {
        b.reset(a)
    });
    this.lastTransferredValue = 0;
    this.mirroringMethod = null;
    this.spriteMemory = new Int32Array(256);
    this._bitOperationOn2002 = this._invokeA12Latch = !1;
    this.nameTablesMap = new Int32Array(4);
    this.nameTables = [];
    for (a = 0; 4 > a; ++a) this.nameTables.push(new Int32Array(1024));
    this.paletteTables = [new Int32Array(16), new Int32Array(16)];
    this.frameCounter = 0;
    this._ppuRenderBg = new Nes.PpuRenderBg(this);
    this._ppuRenderSprites =
        new Nes.PpuRenderSprites(this);
    this.resetVariables()
};
ppu.prototype.reset = function(a) {
    this._useMapperNameTableRead = void 0 !== this.mainboard.cart.memoryMapper.nameTableRead;
    this._sync = this.mainboard.synchroniser;
    this.resetVariables(a);
    this._invokeA12Latch = void 0 !== this.mainboard.cart.memoryMapper.ppuA12Latch;
    this._ppuRenderBg.reset();
    this._ppuRenderSprites.reset()
};
ppu.prototype.bitOperationHappening = function() {
    this._bitOperationOn2002 = !0
};
ppu.prototype.resetVariables = function(a) {
    this.control1 = a ? this.control2 = this.status = 0 : this.control1 & 127;
    this.status |= 128;
    this.doSpriteTransferAfterNextCpuInstruction = this.forceNmi = this.suppressNmi = this.suppressVblank = this.isOddFrame = !1;
    this.bufferedppuread = this.fineX = this.spriteTransferArgument = 0;
    this.ppuSecondAddressWrite = !1;
    this.frameCounter = this.spriteaddress = this.ppuLatchAddress = this.ppuReadAddress = 0
};
ppu.prototype.hookSyncEvents = function(a) {
    var b = this;
    this._clockSkipEventId = a.addEvent("ppu clockskip", this.getMasterTicksTillClockSkip(), function() {
        b._eventClockskip()
    });
    this._vblankClearEventId = a.addEvent("ppu vblank clear", COLOUR_ENCODING_VBLANK_MTC, function(a) {
        b._eventVblankClear(a)
    });
    this._ppuNmiEventId = a.addEvent("ppu NMI", -1, function(a) {
        b._eventNmiTrigger(a)
    });
    this._spriteZeroEventId = a.addEvent("ppu sprite zero hit", -1, function(a) {
        b._eventSpriteZeroHit(a)
    })
};
ppu.prototype._eventClockskip = function() {
    this.isOddFrame && 0 < (this.control2 & 8) && "NTSC" === COLOUR_ENCODING_NAME && this._sync.advanceCpuMTC(MASTER_CYCLES_PER_PPU)
};
ppu.prototype._eventVblankClear = function(a) {
    this.status &= 31
};
ppu.prototype._eventNmiTrigger = function(a) {
    0 < (this.control1 & 128) && 0 < (this.status & 128) && this.mainboard.cpu.nonMaskableInterrupt(a);
    this._sync.changeEventTime(this._ppuNmiEventId, -1)
};
ppu.prototype._eventSpriteZeroHit = function(a) {
    this.status |= 64;
    this._sync.changeEventTime(this._spriteZeroEventId, -1)
};
ppu.prototype._eventSpriteOverflow = function(a) {
    this.status |= 32
};
ppu.prototype.getMasterTicksTillVBlankClearDue = function(a) {
    return COLOUR_ENCODING_VBLANK_MTC - (a || 0)
};
ppu.prototype.getMasterTicksTillClockSkip = function(a) {
    return COLOUR_ENCODING_VBLANK_MTC + 337 * MASTER_CYCLES_PER_PPU - (a || 0)
};
var screenPos = {
    x: 0,
    y: 0
};
ppu.prototype.ticksToScreenCoordinates = function(a) {
    a = a || this._sync.getCpuMTC();
    a = Math.floor(a / MASTER_CYCLES_PER_PPU) | 0;
    screenPos.x = a % PPU_TICKS_PER_SCANLINE;
    screenPos.y = Math.floor(a / PPU_TICKS_PER_SCANLINE) - COLOUR_ENCODING_VBLANK_SCANLINES - 1 | 0;
    return screenPos
};
ppu.prototype.screenCoordinatesToTicks = function(a, b) {
    return a * MASTER_CYCLES_PER_PPU + (b + COLOUR_ENCODING_VBLANK_SCANLINES + 1) * MASTER_CYCLES_PER_SCANLINE
};
ppu.prototype.isRenderingEnabled = function() {
    return 0 < (this.control2 & 24)
};
ppu.prototype.isRendering = function(a, b) {
    if (this.isRenderingEnabled()) {
        var c = this.ticksToScreenCoordinates(a);
        return (b ? IS_INT_BETWEEN(c.x, 0, 256) : !0) && IS_INT_BETWEEN(c.y, -1, 241)
    }
    return !1
};
ppu.prototype.updatePPUReadAddress = function(a, b) {
    b && this._invokeA12Latch && 0 < (a & 4096) && this.mainboard.cart.memoryMapper.ppuA12Latch();
    this.ppuReadAddress = a
};
ppu.prototype.changeMirroringMethod = function(a) {
    if (a !== this.mirroringMethod) switch (this.mirroringMethod = a, this.mirroringMethod) {
        default:
            case PPU_MIRRORING_HORIZONTAL:
            this.nameTablesMap[0] = 0;this.nameTablesMap[1] = 0;this.nameTablesMap[2] = 1;this.nameTablesMap[3] = 1;
        break;
        case PPU_MIRRORING_VERTICAL:
                this.nameTablesMap[0] = 0;this.nameTablesMap[1] = 1;this.nameTablesMap[2] = 0;this.nameTablesMap[3] = 1;
            break;
        case PPU_MIRRORING_FOURSCREEN:
                for (a = 0; 4 > a; ++a) this.nameTablesMap[a] = a;
            break;
        case PPU_MIRRORING_SINGLESCREEN_NT0:
                for (a =
                0; 4 > a; ++a) this.nameTablesMap[a] = 0;
            break;
        case PPU_MIRRORING_SINGLESCREEN_NT1:
                for (a = 0; 4 > a; ++a) this.nameTablesMap[a] = 1
    }
};
ppu.prototype.getMirroringMethod = function() {
    return this.mirroringMethod
};
ppu.prototype.handleSpriteTransfer = function() {
    var a = 256 * this.spriteTransferArgument;
    if (this.doSpriteTransferAfterNextCpuInstruction) {
        this.doSpriteTransferAfterNextCpuInstruction = !1;
        this._sync.synchronise();
        this._sync.advanceCpuMTC(1 * COLOUR_ENCODING_MTC_PER_CPU);
        this.spriteaddress &= 255;
        for (var b = 0; 256 > b; ++b) {
            var c = this.mainboard.memory.read8(a + b);
            this._sync.advanceCpuMTC(1 * COLOUR_ENCODING_MTC_PER_CPU);
            this.spriteMemory[this.spriteaddress] = c;
            this.spriteaddress = this.spriteaddress + 1 & 255;
            this._sync.advanceCpuMTC(1 *
                COLOUR_ENCODING_MTC_PER_CPU)
        }
        this.isOddFrame && this._sync.advanceCpuMTC(1 * COLOUR_ENCODING_MTC_PER_CPU)
    }
};
ppu.prototype._writeTo2000 = function(a, b) {
    var c = this._sync.getCpuMTC(),
        c = COLOUR_ENCODING_FRAME_MTC - c;
    0 === (b & 128) ? c <= 2 * -MASTER_CYCLES_PER_PPU && c >= 4 * -MASTER_CYCLES_PER_PPU ? this.forceNmi = !0 : c >= 1 * -MASTER_CYCLES_PER_PPU && c <= 1 * MASTER_CYCLES_PER_PPU && (this.suppressNmi = !0) : 0 < (this.status & 128) && 0 === (this.control1 & 128) && (c = this._sync.getCpuMTC() + 1 * MASTER_CYCLES_PER_PPU, this._sync.changeEventTime(this._ppuNmiEventId, c));
    this._sync.synchronise();
    this.ppuLatchAddress &= 62463;
    this.ppuLatchAddress |= (b & 3) << 10;
    var c =
        (this.control1 & 24) !== (b & 24),
        d = (this.control1 & 32) !== (b & 32);
    this.control1 = b;
    c && (this.mainboard.cart.memoryMapper.spriteScreenEnabledUpdate(0 < (this.control1 & 8), 0 < (this.control1 & 16)), this._ppuRenderBg.onControl1Change(this.control1));
    d && this.mainboard.cart.memoryMapper.spriteSizeChanged && this.mainboard.cart.memoryMapper.spriteSizeChanged(0 < (this.control1 & 32))
};
ppu.prototype._writeTo2001 = function(a, b) {
    this._sync.synchronise();
    var c = 0 < (this.control2 & 24) !== 0 < (b & 24);
    this.control2 = b;
    c && this.mainboard.cart.memoryMapper.renderingEnabledChanged(0 < (this.control2 & 24))
};
ppu.prototype._writeTo2005 = function(a, b) {
    this._sync.synchronise();
    this.ppuSecondAddressWrite ? (this.ppuLatchAddress &= 64543, this.ppuLatchAddress |= (b & 248) << 2, this.ppuLatchAddress &= 36863, this.ppuLatchAddress |= (b & 7) << 12) : (this.ppuLatchAddress &= 65504, this.ppuLatchAddress |= (b & 248) >> 3, this.fineX = b & 7 | 0);
    this.ppuSecondAddressWrite = !this.ppuSecondAddressWrite
};
ppu.prototype._writeTo2006 = function(a, b) {
    this._sync.synchronise();
    this.ppuSecondAddressWrite ? (this.ppuLatchAddress &= 65280, this.ppuLatchAddress |= b, this.updatePPUReadAddress(this.ppuLatchAddress, !0)) : (this.control1 &= 252, this.control1 |= (b & 12) >> 2, this.ppuLatchAddress &= 255, this.ppuLatchAddress |= (b & 63) << 8);
    this.ppuSecondAddressWrite = !this.ppuSecondAddressWrite
};
ppu.prototype._writeTo2007 = function(a, b) {
    this._sync.synchronise();
    var c = 0,
        d = 0;
    this.isRendering(this._sync.getCpuMTC(), !1) || (c = this.ppuReadAddress, d = this.ppuReadAddress + (0 < (this.control1 & 4) ? 32 : 1), this.updatePPUReadAddress(d, !0), this.write8(c, b));
    this.mainboard.cart.memoryMapper.MMC2Latch && this.mainboard.cart.memoryMapper.MMC2Latch(this.ppuReadAddress)
};
ppu.prototype.writeToRegister = function(a, b) {
    this.lastTransferredValue = b;
    switch (a) {
        case 0:
            this._writeTo2000(a, b);
            break;
        case 1:
            this._writeTo2001(a, b);
            break;
        case 3:
            this.spriteaddress = b & 255;
            break;
        case 4:
            this._sync.synchronise();
            this.spriteMemory[this.spriteaddress & 255] = b;
            this.spriteaddress = this.spriteaddress + 1 & 255;
            break;
        case 5:
            this._writeTo2005(a, b);
            break;
        case 6:
            this._writeTo2006(a, b);
            break;
        case 7:
            this._writeTo2007(a, b)
    }
};
ppu.prototype.writeToSpriteDMARegister = function(a) {
    this.doSpriteTransferAfterNextCpuInstruction = !0;
    this.spriteTransferArgument = a
};
ppu.prototype._readFromRegister2002 = function() {
    var a = this._sync.getCpuMTC(),
        b = COLOUR_ENCODING_FRAME_MTC - a,
        a = !1;
    b === MASTER_CYCLES_PER_PPU ? a = this.suppressNmi = this.suppressVblank = !0 : 0 >= b && b >= 1 * -MASTER_CYCLES_PER_PPU && (this.suppressNmi = !0);
    this._sync.synchronise();
    b = this.status;
    this.ppuSecondAddressWrite = !1;
    a ? b &= 127 : this.status &= 127;
    return b
};
ppu.prototype._readFromRegister2007 = function() {
    var a = 0,
        b = this.ppuReadAddress,
        a = 0;
    this.isRendering(this._sync.getCpuMTC(), !0) ? (a = this.bufferedppuread, this.bufferedppuread = 0) : (a = this.ppuReadAddress + (0 < (this.control1 & 4) ? 32 : 1) & 65535, this.updatePPUReadAddress(a, !0), 16128 === (b & 65280) ? (a = this.read8(b, !1, 0), this.bufferedppuread = this.read8(b - 4096, !1, 0)) : (a = this.bufferedppuread, this.bufferedppuread = this.read8(b, !1, 0)));
    return a
};
ppu.prototype.readFromRegister = function(a) {
    var b = 0;
    switch (a) {
        case 2:
            b = this._readFromRegister2002();
            break;
        case 4:
            b = this.spriteMemory[this.spriteaddress & 255] | 0;
            break;
        case 7:
            b = this._readFromRegister2007();
            break;
        default:
            b = this.lastTransferredValue
    }
    return this.lastTransferredValue = b
};
ppu.prototype.write8 = function(a, b) {
    if (0 === (a & 8192)) this.mainboard.cart.memoryMapper.write8ChrRom(a & 8191, b);
    else if (16128 === (a & 16128)) {
        var c = a & 15,
            d = (a & 16) >> 4,
            e = b & 63;
        this.paletteTables[d][c] = e;
        0 === (c & 3) && (this.paletteTables[1 === d ? 0 : 1][c] = e)
    } else c = (a & 3072) >> 10, this.mainboard.cart.memoryMapper.nameTableWrite ? this.mainboard.cart.memoryMapper.nameTableWrite(this.nameTables, c, a & 1023, b) : this.nameTables[this.nameTablesMap[c]][a & 1023] = b
};
ppu.prototype.read8 = function(a, b, c) {
    var d = 0,
        d = 0;
    if (0 === (a & 8192)) return this.mainboard.cart.memoryMapper.read8ChrRom(a & 8191, b, c) | 0;
    if (16128 === (a & 16128)) return this.paletteTables[(a & 16) >> 4][a & 15] | 0;
    d = (a & 3072) >> 10;
    if (this._useMapperNameTableRead) return this.mainboard.cart.memoryMapper.nameTableRead(this.nameTables, d, a & 1023) | 0;
    d = this.nameTablesMap[d];
    return this.nameTables[d][a & 1023] | 0
};
ppu.prototype.synchronise = function(a, b) {
    this.isRenderingEnabled() && (this._ppuRenderSprites.renderTo(a, b), this.ppuReadAddress = this._ppuRenderBg.renderTo(a, b, this.ppuReadAddress, this.ppuLatchAddress))
};
ppu.prototype.onEndFrame = function() {
    this.suppressVblank || (this.status |= 128);
    (this.forceNmi || !this.suppressNmi && 0 < (this.control1 & 128)) && this.mainboard.cpu.nonMaskableInterrupt(COLOUR_ENCODING_FRAME_MTC + MASTER_CYCLES_PER_PPU);
    this.forceNmi = this.suppressVblank = this.suppressNmi = !1;
    this.isOddFrame = !this.isOddFrame;
    this.frameCounter++;
    this._ppuRenderBg.onEndFrame();
    this._ppuRenderSprites.onEndFrame();
    Nes.Trace.enabled()
};
ppu.prototype.getBackgroundPaletteIndex = function() {
    return this.paletteTables[0][0] | 0
};
ppu.prototype.readNameTable = function(a, b) {
    var c = a >> 10 & 3;
    return this._useMapperNameTableRead ? this.mainboard.cart.memoryMapper.nameTableRead(this.nameTables, c, a & 1023, b) | 0 : this.nameTables[this.nameTablesMap[c]][a & 1023] | 0
};
ppu.prototype.formatStatusString = function() {
    var a = this.ticksToScreenCoordinates(),
        a = "" + ("CYC:" + ZERO_PAD(a.x, 3, " ") + " SL:" + a.y + " F:" + this.frameCounter);
    return a += " S:" + ZERO_PAD_HEX(this.status, 2) + " C1:" + ZERO_PAD_HEX(this.control1, 2) + " C2:" + ZERO_PAD_HEX(this.control2, 2)
};
ppu.prototype.saveState = function() {
    var a = {};
    a.mirroringMethod = this.mirroringMethod;
    a.isOddFrame = this.isOddFrame;
    a.suppressNmi = this.suppressNmi;
    a.suppressVblank = this.suppressVblank;
    a.forceNmi = this.forceNmi;
    a.control1 = this.control1;
    a.control2 = this.control2;
    a.status = this.status;
    a.bufferedppuread = this.bufferedppuread;
    a.ppuReadAddress = this.ppuReadAddress;
    a.ppuLatchAddress = this.ppuLatchAddress;
    a.spriteaddress = this.spriteaddress;
    a.ppuSecondAddressWrite = this.ppuSecondAddressWrite;
    a.fineX = this.fineX;
    a.lastTransferredValue =
        this.lastTransferredValue;
    a.frameCounter = this.frameCounter;
    a._invokeA12Latch = this._invokeA12Latch;
    a.doSpriteTransferAfterNextCpuInstruction = this.doSpriteTransferAfterNextCpuInstruction;
    a.spriteTransferArgument = this.spriteTransferArgument;
    a.spriteMemory = Nes.uintArrayToString(this.spriteMemory);
    a.nameTables = [];
    for (var b = 0; b < this.nameTables.length; ++b) a.nameTables.push(Nes.uintArrayToString(this.nameTables[b]));
    a.paletteTables = [];
    for (b = 0; b < this.paletteTables.length; ++b) a.paletteTables.push(Nes.uintArrayToString(this.paletteTables[b]));
    a.nameTablesMap = Nes.uintArrayToString(this.nameTablesMap);
    this._ppuRenderBg.saveState(a);
    this._ppuRenderSprites.saveState(a);
    return a
};
ppu.prototype.loadState = function(a) {
    this.mirroringMethod = a.mirroringMethod;
    this.isOddFrame = a.isOddFrame;
    this.suppressNmi = a.suppressNmi;
    this.suppressVblank = a.suppressVblank;
    this.forceNmi = a.forceNmi;
    this.control1 = a.control1;
    this.control2 = a.control2;
    this.status = a.status;
    this.bufferedppuread = a.bufferedppuread;
    this.ppuReadAddress = a.ppuReadAddress;
    this.ppuLatchAddress = a.ppuLatchAddress;
    this.spriteaddress = a.spriteaddress;
    this.ppuSecondAddressWrite = a.ppuSecondAddressWrite;
    this.fineX = a.fineX;
    this.lastTransferredValue =
        a.lastTransferredValue;
    this.frameCounter = a.frameCounter;
    this.doSpriteTransferAfterNextCpuInstruction = a.doSpriteTransferAfterNextCpuInstruction;
    this.spriteTransferArgument = a.spriteTransferArgument;
    this._invokeA12Latch = a._invokeA12Latch;
    this.spriteMemory = Nes.stringToUintArray(a.spriteMemory);
    this.nameTables = [];
    for (var b = 0; b < a.nameTables.length; ++b) this.nameTables.push(Nes.stringToUintArray(a.nameTables[b]));
    this.paletteTables = [];
    for (b = 0; b < a.paletteTables.length; ++b) this.paletteTables.push(Nes.stringToUintArray(a.paletteTables[b]));
    this.nameTablesMap = Nes.stringToUintArray(a.nameTablesMap);
    this._ppuRenderBg.loadState(a);
    this._ppuRenderSprites.loadState(a)
};
Nes.ppu = ppu;
this.Nes = this.Nes || {};
Nes.mappers = {};
"use strict";
var basemapper = function() {};
basemapper.prototype.construct = function(a, b) {
    this.mainboard = a;
    this.mirroringMethod = b;
    this.prgPagesMap = new Int32Array(4);
    this._prgData = null;
    this._prgPageCount = 0;
    this.chrPages = [];
    this.chrPagesMap = new Int32Array(8);
    this._chrData = null;
    this._chrPageCount = 0;
    this._gameGenieActive = this._usingChrVram = !1;
    this._gameGeniePokes = {};
    this.sram = new Int32Array(8192);
    this.expansionRam = new Int32Array(8160)
};
basemapper.prototype.onEndFrame = function() {};
basemapper.prototype.getNextEvent = function() {
    return -1
};
basemapper.prototype.synchronise = function(a, b) {};
basemapper.prototype.spriteScreenEnabledUpdate = function(a, b) {};
basemapper.prototype.renderingEnabledChanged = function(a) {};
basemapper.prototype.setPrgData = function(a, b) {
    this._prgData = a;
    this._prgPageCount = b
};
basemapper.prototype.setChrData = function(a, b) {
    this._chrData = a;
    this._chrPageCount = b
};
basemapper.prototype.get1kChrBankCount = function() {
    return this._chrPageCount
};
basemapper.prototype.get2kChrBankCount = function() {
    return this._chrPageCount >> 1
};
basemapper.prototype.get4kChrBankCount = function() {
    return this._chrPageCount >> 2
};
basemapper.prototype.get8kChrBankCount = function() {
    return this._chrPageCount >> 3
};
basemapper.prototype.get8kPrgBankCount = function() {
    return this._prgPageCount
};
basemapper.prototype.get16kPrgBankCount = function() {
    return this._prgPageCount >> 1
};
basemapper.prototype.get32kPrgBankCount = function() {
    return this._prgPageCount >> 2
};
basemapper.prototype.switch8kPrgBank = function(a, b) {
    this.setPrgPage(a % this._prgPageCount, b)
};
basemapper.prototype.switch16kPrgBank = function(a, b) {
    if (0 < this.get16kPrgBankCount())
        for (var c = 2 * a % this._prgPageCount, d = 0; 2 > d; ++d) this.setPrgPage(c + d, d + (b ? 0 : 2))
};
basemapper.prototype.switch32kPrgBank = function(a) {
    if (0 < this.get32kPrgBankCount()) {
        a = 4 * a % this._prgPageCount;
        for (var b = 0; 4 > b; ++b) this.setPrgPage(a + b, b)
    }
};
basemapper.prototype.setPrgPage = function(a, b) {
    this.prgPagesMap[b] !== a && (this.prgPagesMap[b] = 8192 * a)
};
basemapper.prototype.setChrPage = function(a, b) {
    this.chrPagesMap[b] = 1024 * a
};
basemapper.prototype.switch1kChrBank = function(a, b) {
    this.setChrPage(a % this._chrPageCount, b)
};
basemapper.prototype.switch2kChrBank = function(a, b) {
    if (0 < this.get2kChrBankCount())
        for (var c = 2 * a % this._chrPageCount, d = 0; 2 > d; ++d) this.setChrPage(c + d, 2 * b + d)
};
basemapper.prototype.switch4kChrBank = function(a, b) {
    if (0 < this.get4kChrBankCount())
        for (var c = 4 * a % this._chrPageCount, d = 0; 4 > d; ++d) this.setChrPage(c + d, d + (b ? 0 : 4))
};
basemapper.prototype.switch8kChrBank = function(a) {
    if (0 < this.get8kChrBankCount()) {
        a = 8 * a % this._chrPageCount;
        for (var b = 0; 8 > b; ++b) this.setChrPage(a + b, b)
    }
};
basemapper.prototype.useVRAM = function(a) {
    a = a || 8;
    this._usingChrVram = !0;
    this._chrData = new Int32Array(1024 * a);
    this._chrPageCount = a;
    for (var b = 0; b < Math.min(8, a); ++b) this.setChrPage(b, b)
};
basemapper.prototype.write8PrgRom = function(a, b) {};
basemapper.prototype.read8PrgRom = function(a) {
    var b = this._prgData[this.prgPagesMap[(a & 24576) >> 13] + (a & 8191)];
    return this._gameGenieActive && this._gameGeniePokes.hasOwnProperty(a) ? this._checkGameGenieCode(b, a) : b
};
basemapper.prototype._checkGameGenieCode = function(a, b) {
    var c = this._gameGeniePokes[b];
    return -1 === c.compare || c.compare === a ? c.value : a | 0
};
basemapper.prototype.write8ChrRom = function(a, b) {
    this._usingChrVram && (this._chrData[this.chrPagesMap[(a & 7168) >> 10] + (a & 1023)] = b)
};
basemapper.prototype.read8ChrRom = function(a, b, c) {
    return this._chrData[this.chrPagesMap[(a & 7168) >> 10] + (a & 1023)] | 0
};
basemapper.prototype.write8SRam = function(a, b) {
    this.sram[a & 8191] = b
};
basemapper.prototype.read8SRam = function(a) {
    return this.sram[a & 8191] | 0
};
basemapper.prototype.write8EXRam = function(a, b) {
    this.expansionRam[a - 16416] = b
};
basemapper.prototype.read8EXRam = function(a) {
    return this.expansionRam[a - 16416] | 0
};
basemapper.prototype.reset = function() {};
basemapper.prototype.gameGeniePoke = function(a, b, c, d) {
    this._gameGenieActive = !0;
    this._gameGeniePokes[b] = {
        name: a,
        value: c,
        compare: d
    }
};
basemapper.prototype.removeGameGeniePoke = function(a) {
    for (var b = Object.keys(this._gameGeniePokes), c = 0; c < b.length; ++c) {
        var d = b[c];
        if (this._gameGeniePokes.hasOwnProperty(d)) {
            var e = this._gameGeniePokes[d];
            e && e.name === a && delete this._gameGeniePokes[d]
        }
    }
    this._gameGenieActive = 0 < Object.keys(this._gameGeniePokes).length
};
basemapper.prototype.saveState = function() {
    var a = {};
    a.mirroringMethod = this.mirroringMethod;
    a._usingChrVram = this._usingChrVram;
    a.sram = Nes.uintArrayToString(this.sram);
    a.expansionRam = Nes.uintArrayToString(this.expansionRam);
    a._gameGeniePokes = $.extend({}, this._gameGeniePokes);
    this._usingChrVram && (a._chrData = Nes.uintArrayToString(this._chrData));
    this.mapperSaveState && this.mapperSaveState(a);
    return a
};
basemapper.prototype.loadState = function(a) {
    this.mirroringMethod = a.mirroringMethod;
    this._usingChrVram = a._usingChrVram;
    this.sram = Nes.stringToUintArray(a.sram);
    this.expansionRam = Nes.stringToUintArray(a.expansionRam);
    this._gameGeniePokes = $.extend({}, a._gameGeniePokes);
    this._usingChrVram && (this._chrData = Nes.stringToUintArray(a._chrData));
    this.mapperLoadState && this.mapperLoadState(a)
};
Nes.basemapper = basemapper;
Nes.createMapper = function(a, b, c) {
    var d = Nes.mappers[a];
    if (void 0 === d) throw Error("Mapper id " + a + " is not supported");
    a = new d;
    a.construct(b, c);
    return a
};
this.Nes = this.Nes || {};
"use strict";
var mapper0 = function() {};
mapper0.prototype = Object.create(Nes.basemapper.prototype);
mapper0.prototype.reset = function() {
    1 <= this.get32kPrgBankCount() ? this.switch32kPrgBank(0) : 1 == this.get16kPrgBankCount() && (this.switch16kPrgBank(0, !0), this.switch16kPrgBank(0, !1));
    0 === this.get1kChrBankCount() ? this.useVRAM() : this.switch8kChrBank(0);
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
Nes.mappers[0] = mapper0;
this.Nes = this.Nes || {};
"use strict";
var mapper1 = function() {
    this.count = this.val = 0;
    this.lastWriteMTC = -1;
    this.registers = new Int32Array(4);
    this.registers[0] = 12;
    this.registers[1] = this.registers[2] = this.registers[3] = 0;
    this.wRamEnabled = !0;
    this.soromlatch = !1
};
mapper1.prototype = Object.create(Nes.basemapper.prototype);
mapper1.prototype.mapperSaveState = function(a) {
    a.val = this.val;
    a.count = this.count;
    a.lastWriteMTC = this.lastWriteMTC;
    a.registers = Nes.uintArrayToString(this.registers);
    a.wRamEnabled = this.wRamEnabled;
    a.soromlatch = this.soromlatch
};
mapper1.prototype.mapperLoadState = function(a) {
    this.val = a.val;
    this.count = a.count;
    this.lastWriteMTC = a.lastWriteMTC;
    this.registers = Nes.stringToUintArray(a.registers);
    this.wRamEnabled = a.wRamEnabled;
    this.soromlatch = a.soromlatch
};
mapper1.prototype.onEndFrame = function() {
    this.lastWriteMTC = -1
};
mapper1.prototype.reset = function() {
    this.switch16kPrgBank(0, !0);
    this.switch16kPrgBank(this.get16kPrgBankCount() - 1, !1);
    0 === this.get8kChrBankCount() ? this.useVRAM() : this.switch8kChrBank(0);
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
mapper1.prototype.syncChrMirrors = function() {
    0 < (this.registers[0] & 16) ? (this.switch4kChrBank(this.registers[1] & 31, !0), this.switch4kChrBank(this.registers[2] & 31, !1)) : this.switch8kChrBank((this.registers[1] & 31) >> 1)
};
mapper1.prototype.syncPrgMirrors = function() {
    var a = this.soromlatch ? 16 : 0,
        b = this.registers[3];
    if (0 < (this.registers[0] & 8))
        if (0 < (this.registers[0] & 4)) {
            var c = Math.min(this.get16kPrgBankCount() - 1, 15);
            this.switch16kPrgBank(b + a, !0);
            this.switch16kPrgBank(c + a, !1)
        } else this.switch16kPrgBank(0 + a, !0), this.switch16kPrgBank(b + a, !1);
    else this.switch32kPrgBank((b >> 1) + (this.soromlatch ? 8 : 0))
};
mapper1.prototype.write8PrgRom = function(a, b) {
    var c = this.mainboard.synchroniser.getCpuMTC(),
        d = this.lastWriteMTC + 2 * COLOUR_ENCODING_MTC_PER_CPU,
        e = 0 <= this.lastWriteMTC;
    this.lastWriteMTC = c;
    if (!(e && d >= c))
        if (0 < (b & 128)) this.count = this.val = 0, this.registers[0] |= 12;
        else if (this.val |= (b & 1) << this.count, this.count += 1, 5 <= this.count) {
        this.mainboard.synchroniser.synchronise();
        switch (a & 57344) {
            case 32768:
                this.registers[0] = this.val & 31;
                var f;
                switch (this.val & 3) {
                    case 0:
                        f = PPU_MIRRORING_SINGLESCREEN_NT0;
                        break;
                    case 1:
                        f = PPU_MIRRORING_SINGLESCREEN_NT1;
                        break;
                    case 2:
                        f = PPU_MIRRORING_VERTICAL;
                        break;
                    case 3:
                        f = PPU_MIRRORING_HORIZONTAL
                }
                this.mainboard.ppu.changeMirroringMethod(f);
                break;
            case 40960:
                this.registers[1] = this.val & 31;
                16 < this.get16kPrgBankCount() && (this.soromlatch = 0 < (this.val & 16), this.syncPrgMirrors());
                break;
            case 49152:
                this.registers[2] = this.val & 31;
                16 < this.get16kPrgBankCount() && (this.registers[2] &= 15);
                break;
            case 57344:
                this.registers[3] = this.val & 15, this.wRamEnabled = 0 === (this.val & 16)
        }
        this.syncChrMirrors();
        this.syncPrgMirrors();
        this.val = this.count =
            0
    }
};
mapper1.prototype.write8SRam = function(a, b) {
    this.wRamEnabled && Nes.basemapper.prototype.write8SRam.call(this, a, b)
};
mapper1.prototype.read8SRam = function(a) {
    return this.wRamEnabled ? Nes.basemapper.prototype.read8SRam.call(this, a) : 0
};
Nes.mappers[1] = mapper1;
this.Nes = this.Nes || {};
"use strict";
var mapper2 = function() {};
mapper2.prototype = Object.create(Nes.basemapper.prototype);
mapper2.prototype.reset = function() {
    this.switch16kPrgBank(0, !0);
    this.switch16kPrgBank(this.get16kPrgBankCount() - 1, !1);
    this.useVRAM();
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
mapper2.prototype.write8PrgRom = function(a, b) {
    this.switch16kPrgBank(b, !0)
};
Nes.mappers[2] = mapper2;
this.Nes = this.Nes || {};
"use strict";
var mapper3 = function() {};
mapper3.prototype = Object.create(Nes.basemapper.prototype);
mapper3.prototype.reset = function() {
    1 === this.get16kPrgBankCount() ? (this.switch16kPrgBank(0, !0), this.switch16kPrgBank(0, !1)) : this.switch32kPrgBank(0);
    this.switch8kChrBank(0);
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
mapper3.prototype.write8PrgRom = function(a, b) {
    this.mainboard.synchroniser.synchronise();
    this.switch8kChrBank(b)
};
mapper3.prototype.write8ChrRom = function(a, b) {};
Nes.mappers[3] = mapper3;
this.Nes = this.Nes || {};
"use strict";
var mapper4 = function() {
    this.bankSwapByte = 0;
    this.prgRamDisableWrite = !1;
    this.chipEnable = this.interruptsEnabled = !0;
    this.irqCounter = this.irqLatch = 0;
    this._isMMC6 = this.mReloadFlag = !1;
    this.lastA12Raise = this._mmc6PrgRamWriteByte = 0;
    this.mRenderingEnabled = this.mSpriteAddress = this.mScreenAddress = !1;
    this.banks = new Int32Array(8);
    this.banks[0] = 0;
    this.banks[1] = 2;
    this.banks[2] = 4;
    this.banks[3] = 5;
    this.banks[4] = 6;
    this.banks[5] = 7;
    this.banks[6] = 0;
    this.banks[7] = 1
};
mapper4.prototype = Object.create(Nes.basemapper.prototype);
mapper4.prototype._eventIrq = function() {
    this.mainboard.synchroniser.changeEventTime(this._irqEventId, -1)
};
mapper4.prototype.mapperSaveState = function(a) {
    a.bankSwapByte = this.bankSwapByte;
    a.prgRamDisableWrite = this.prgRamDisableWrite;
    a.chipEnable = this.chipEnable;
    a.interruptsEnabled = this.interruptsEnabled;
    a.irqCounter = this.irqCounter;
    a.irqLatch = this.irqLatch;
    a.mReloadFlag = this.mReloadFlag;
    a._isMMC6 = this._isMMC6;
    a._mmc6PrgRamWriteByte = this._mmc6PrgRamWriteByte;
    a.lastA12Raise = this.lastA12Raise;
    a.mSpriteAddress = this.mSpriteAddress;
    a.mScreenAddress = this.mScreenAddress;
    a.mRenderingEnabled = this.mRenderingEnabled;
    a.banks = Nes.uintArrayToString(this.banks);
    a._interruptInProgress = this._interruptInProgress
};
mapper4.prototype.mapperLoadState = function(a) {
    this.bankSwapByte = a.bankSwapByte;
    this.prgRamDisableWrite = a.prgRamDisableWrite;
    this.chipEnable = a.chipEnable;
    this.interruptsEnabled = a.interruptsEnabled;
    this.irqCounter = a.irqCounter;
    this.irqLatch = a.irqLatch;
    this.mReloadFlag = a.mReloadFlag;
    this._isMMC6 = a._isMMC6;
    this._mmc6PrgRamWriteByte = a._mmc6PrgRamWriteByte;
    this.lastA12Raise = a.lastA12Raise;
    this.mSpriteAddress = a.mSpriteAddress;
    this.mScreenAddress = a.mScreenAddress;
    this.mRenderingEnabled = a.mRenderingEnabled;
    this.banks = Nes.stringToUintArray(a.banks);
    this._interruptInProgress = a._interruptInProgress
};
mapper4.prototype.syncBanks = function(a, b) {
    a && (this.switch8kPrgBank(this.banks[7], 1), this.switch8kPrgBank(this.get8kPrgBankCount() - 1, 3), 0 < (this.bankSwapByte & 64) ? (this.switch8kPrgBank(this.get8kPrgBankCount() - 2, 0), this.switch8kPrgBank(this.banks[6], 2)) : (this.switch8kPrgBank(this.banks[6], 0), this.switch8kPrgBank(this.get8kPrgBankCount() - 2, 2)));
    if (b) {
        this.mainboard.synchroniser.synchronise();
        var c = this.banks[0] & 254,
            d = this.banks[1] & 254;
        0 < (this.bankSwapByte & 128) ? (this.switch1kChrBank(this.banks[2], 0), this.switch1kChrBank(this.banks[3],
            1), this.switch1kChrBank(this.banks[4], 2), this.switch1kChrBank(this.banks[5], 3), this.switch1kChrBank(c, 4), this.switch1kChrBank(c + 1, 5), this.switch1kChrBank(d, 6), this.switch1kChrBank(d + 1, 7)) : (this.switch1kChrBank(c, 0), this.switch1kChrBank(c + 1, 1), this.switch1kChrBank(d, 2), this.switch1kChrBank(d + 1, 3), this.switch1kChrBank(this.banks[2], 4), this.switch1kChrBank(this.banks[3], 5), this.switch1kChrBank(this.banks[4], 6), this.switch1kChrBank(this.banks[5], 7))
    }
};
mapper4.prototype._lookInDbForMMC6 = function() {
    if (this.mainboard.cart && this.mainboard.cart._dbData) {
        var a = this.mainboard.cart._dbData;
        if (a.cartridge && a.cartridge[0].board && a.cartridge[0].board[0] && (a = a.cartridge[0].board[0], a.chip && a.chip[0] && (a = a.chip[0], a.$ && a.$.type))) return "MMC6B" === a.$.type
    }
    return !1
};
mapper4.prototype.reset = function() {
    this.prgRamDisableWrite = !1;
    this.chipEnable = this.interruptsEnabled = !0;
    this._interruptInProgress = !1;
    this._A12LowerLimit = COLOUR_ENCODING_VBLANK_SCANLINES * MASTER_CYCLES_PER_SCANLINE;
    this._A12UpperLimit = (COLOUR_ENCODING_FRAME_SCANLINES - 1) * MASTER_CYCLES_PER_SCANLINE;
    this.lastA12Raise = 0;
    this.mRenderingEnabled = this.mSpriteAddress = this.mScreenAddress = !1;
    this.irqLatch = this.irqCounter = 255;
    this.mReloadFlag = !1;
    this.lastA12Raise = 0;
    this._isMMC6 = this._lookInDbForMMC6();
    this.bankSwapByte =
        this._mmc6PrgRamWriteByte = 0;
    this.banks[0] = 0;
    this.banks[1] = 2;
    this.banks[2] = 4;
    this.banks[3] = 5;
    this.banks[4] = 6;
    this.banks[5] = 7;
    this.banks[6] = 0;
    this.banks[7] = 1;
    0 === this.get1kChrBankCount() && this.useVRAM(8);
    var a = this;
    this._irqEventId = this.mainboard.synchroniser.addEvent("mmc3 irq", -1, function() {
        a._eventIrq()
    });
    this.syncBanks(!0, !0);
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
mapper4.prototype.write8PrgRom = function(a, b) {
    switch (a & 57344) {
        case 32768:
            if (0 === (a & 1)) {
                if (this.bankSwapByte !== b & 255) {
                    this.bankSwapByte = b & 255;
                    if (this._isMMC6) {
                        var c = 0 < (this.bankSwapByte & 32);
                        c || (this._mmc6PrgRamWriteByte = 0)
                    }
                    this.syncBanks(!0, !0)
                }
            } else c = this.bankSwapByte & 7, this.banks[c] !== b & 255 && (this.banks[c] = b & 255, this.syncBanks(6 <= c, 5 >= c));
            break;
        case 40960:
            if (0 === (a & 1)) c = 0 < (b & 1) ? PPU_MIRRORING_HORIZONTAL : PPU_MIRRORING_VERTICAL, c !== this.mainboard.ppu.getMirroringMethod() && (this.mainboard.synchroniser.synchronise(),
                this.mainboard.ppu.changeMirroringMethod(c));
            else if (this._isMMC6) {
                if (c = 0 < (this.bankSwapByte & 32)) this._mmc6PrgRamWriteByte = b
            } else this.prgRamDisableWrite = 0 < (b & 64), this.chipEnable = 0 < (b & 128);
            break;
        case 49152:
            0 === (a & 1) ? (this.irqLatch !== b && this.mainboard.synchroniser.synchronise(), this.irqLatch = b) : (this.mReloadFlag || this.mainboard.synchroniser.synchronise(), this.mReloadFlag = !0);
            this.updateIRQTime(this.mainboard.synchroniser.getCpuMTC(), !0);
            break;
        case 57344:
            0 === (a & 1) ? (this.interruptsEnabled = !1, this._interruptInProgress &&
                (this.mainboard.cpu.holdIrqLineLow(!1), this._interruptInProgress = !1)) : (this.interruptsEnabled || this.mainboard.synchroniser.synchronise(), this.interruptsEnabled = !0), this.updateIRQTime(this.mainboard.synchroniser.getCpuMTC(), !0)
    }
};
mapper4.prototype.decrementIrqCounter = function(a) {
    this.lastA12Raise = a;
    a = !1;
    this.mReloadFlag ? (a = 0 === this.irqLatch, this.irqCounter = this.irqLatch, this.mReloadFlag = !1) : 0 === this.irqCounter ? (this.irqCounter = this.irqLatch, this._isMMC6 ? a = !1 : 0 === this.irqCounter && (a = !0)) : (0 < this.irqCounter && this.irqCounter--, a = 0 === this.irqCounter);
    a && this.interruptsEnabled && !this._interruptInProgress && (this._interruptInProgress = !0, this.mainboard.cpu.holdIrqLineLow(!0))
};
mapper4.prototype.ppuA12Latch = function() {
    this.mainboard.synchroniser.synchronise();
    var a = this.mainboard.synchroniser.getCpuMTC();
    0 < this.lastA12Raise && a - this.lastA12Raise <= 16 * MASTER_CYCLES_PER_PPU || (this.decrementIrqCounter(a), this.updateIRQTime(a, !0))
};
mapper4.prototype.calculateNextA12Raise = function(a) {
    var b = -1;
    this.mRenderingEnabled && (b = this.mSpriteAddress && !this.mScreenAddress ? 265 : 9);
    if (a >= this._A12UpperLimit || 0 > b) return -1;
    var b = MASTER_CYCLES_PER_PPU * b,
        c = a - a % MASTER_CYCLES_PER_SCANLINE + b;
    c <= a && (c += MASTER_CYCLES_PER_SCANLINE);
    if (this._A12UpperLimit <= c) return -1;
    c < this._A12LowerLimit && (c = this._A12LowerLimit + b);
    return c
};
mapper4.prototype.updateIRQTime = function(a, b) {
    b && this.mainboard.synchroniser.synchronise();
    var c = -1,
        d = 0,
        e = 0;
    this.interruptsEnabled && (d = this.calculateNextA12Raise(a), -1 === d ? c = -1 : (e = this.mReloadFlag ? 0 : Math.max(this.irqCounter - 1, 0), c = d + e * MASTER_CYCLES_PER_SCANLINE, c > this._A12UpperLimit && (c = -1)));
    this.mainboard.synchroniser.changeEventTime(this._irqEventId, c)
};
mapper4.prototype.spriteScreenEnabledUpdate = function(a, b) {
    this.mSpriteAddress = a;
    this.mScreenAddress = b;
    this.updateIRQTime(this.mainboard.synchroniser.getCpuMTC(), !0)
};
mapper4.prototype.renderingEnabledChanged = function(a) {
    this.mRenderingEnabled = a;
    this.updateIRQTime(this.mainboard.synchroniser.getCpuMTC(), !0)
};
mapper4.prototype.synchronise = function(a, b) {
    var c = this.calculateNextA12Raise(a + 1);
    if (0 <= c)
        for (; c <= Math.min(this._A12UpperLimit, b); c += MASTER_CYCLES_PER_SCANLINE) this.decrementIrqCounter(c);
    this.updateIRQTime(b, !1)
};
mapper4.prototype.onEndFrame = function() {
    this.lastA12Raise = 0
};
mapper4.prototype.write8SRam = function(a, b) {
    if (this._isMMC6) {
        if (28672 <= a) {
            var c = a & 1023,
                d = 0 === (c & 512) ? 48 : 192;
            (this._mmc6PrgRamWriteByte & d) === d && Nes.basemapper.prototype.write8SRam.call(this, c, b)
        }
    } else this.chipEnable && !this.prgRamDisableWrite && Nes.basemapper.prototype.write8SRam.call(this, a, b)
};
mapper4.prototype.read8SRam = function(a) {
    if (this._isMMC6 && 28672 <= a) {
        if (28672 <= a && (a &= 1023, 0 < (this._mmc6PrgRamWriteByte & (0 === (a & 512) ? 32 : 128)))) return Nes.basemapper.prototype.read8SRam.call(this, a)
    } else if (this.chipEnable) return Nes.basemapper.prototype.read8SRam.call(this, a);
    return 0
};
Nes.mappers[4] = mapper4;
this.Nes = this.Nes || {};
"use strict";
var mapper5 = function() {
    this.mRenderingEnabled = !1;
    this._exRamMode = this._prgMode = this._chrMode = 0;
    this._prgRegisters = new Int32Array(4);
    this._nameTableFill = new Int32Array(1024);
    this._internalExRam = new Int32Array(1024);
    this._prgRam = new Int32Array(65536);
    this._prgRamPage = 0;
    this._writeProtectB = this._writeProtectA = this._bigSpritesEnabled = !1;
    this._currentScanline = 0;
    this._irqActive = this._irqEnabled = !1;
    this._irqScanlineTrigger = 0;
    this._triggerMtc = -1;
    this._multiplier2 = this._multiplier1 = 0;
    this._prgRamMap = new Int32Array(4);
    this._prgRamIsActive = new Int32Array(4);
    this._nameTableMap = new Int32Array(4);
    this._chrRegsA = new Int32Array(8);
    this._chrRegsB = new Int32Array(4);
    this._chrUseBMap = !1;
    this._chrMapA = new Int32Array(8);
    this._chrMapB = new Int32Array(4);
    this._chrHighBits = 0
};
mapper5.prototype = Object.create(Nes.basemapper.prototype);
mapper5.prototype.mapperSaveState = function(a) {
    a.mRenderingEnabled = this.mRenderingEnabled;
    a._chrMode = this._chrMode;
    a._prgMode = this._prgMode;
    a._exRamMode = this._exRamMode;
    a._prgRegisters = Nes.uintArrayToString(this._prgRegisters);
    a._nameTableFill = Nes.uintArrayToString(this._nameTableFill);
    a._internalExRam = Nes.uintArrayToString(this._internalExRam);
    a._prgRam = Nes.uintArrayToString(this._prgRam);
    a._prgRamPage = this._prgRamPage;
    a._bigSpritesEnabled = this._bigSpritesEnabled;
    a._writeProtectA = this._writeProtectA;
    a._writeProtectB = this._writeProtectB;
    a._currentScanline = this._currentScanline;
    a._irqEnabled = this._irqEnabled;
    a._irqActive = this._irqActive;
    a._irqScanlineTrigger = this._irqScanlineTrigger;
    a._triggerMtc = this._triggerMtc;
    a._multiplier1 = this._multiplier1;
    a._multiplier2 = this._multiplier2;
    a._prgRamMap = Nes.uintArrayToString(this._prgRamMap);
    a._prgRamIsActive = Nes.uintArrayToString(this._prgRamIsActive);
    a._nameTableMap = Nes.uintArrayToString(this._nameTableMap);
    a._chrRegsA = Nes.uintArrayToString(this._chrRegsA);
    a._chrRegsB = Nes.uintArrayToString(this._chrRegsB);
    a._chrUseBMap = this._chrUseBMap;
    a._chrMapA = Nes.uintArrayToString(this._chrMapA);
    a._chrMapB = Nes.uintArrayToString(this._chrMapB);
    a._chrHighBits = this._chrHighBits
};
mapper5.prototype.mapperLoadState = function(a) {
    this.mRenderingEnabled = a.mRenderingEnabled;
    this._chrMode = a._chrMode;
    this._prgMode = a._prgMode;
    this._exRamMode = a._exRamMode;
    this._prgRegisters = Nes.stringToUintArray(a._prgRegisters);
    this._nameTableFill = Nes.stringToUintArray(a._nameTableFill);
    this._internalExRam = Nes.stringToUintArray(a._internalExRam);
    this._prgRam = Nes.stringToUintArray(a._prgRam);
    this._prgRamPage = a._prgRamPage;
    this._bigSpritesEnabled = a._bigSpritesEnabled;
    this._writeProtectA = a._writeProtectA;
    this._writeProtectB = a._writeProtectB;
    this._currentScanline = a._currentScanline;
    this._irqEnabled = a._irqEnabled;
    this._irqActive = a._irqActive;
    this._irqScanlineTrigger = a._irqScanlineTrigger;
    this._triggerMtc = a._triggerMtc;
    this._multiplier1 = a._multiplier1;
    this._multiplier2 = a._multiplier2;
    this._prgRamMap = Nes.stringToUintArray(a._prgRamMap);
    this._prgRamIsActive = Nes.stringToUintArray(a._prgRamIsActive);
    this._nameTableMap = Nes.stringToUintArray(a._nameTableMap);
    this._chrRegsA = Nes.stringToUintArray(a._chrRegsA);
    this._chrRegsB = Nes.stringToUintArray(a._chrRegsB);
    this._chrUseBMap = a._chrUseBMap;
    this._chrMapA = Nes.stringToUintArray(a._chrMapA);
    this._chrMapB = Nes.stringToUintArray(a._chrMapB);
    this._chrHighBits = a._chrHighBits
};
mapper5.prototype.reset = function() {
    this.mRenderingEnabled = !1;
    this._chrMode = 0;
    this._prgMode = 3;
    this._prgRamPage = this._chrHighBits = this._exRamMode = 0;
    this._irqEnabled = this._writeProtectB = this._writeProtectA = !1;
    this._irqScanlineTrigger = 0;
    this._irqActive = !1;
    this._currentScanline = this._multiplier2 = this._multiplier1 = 0;
    this._triggerMtc = -1;
    this._bigSpritesEnabled = this._chrUseBMap = !1;
    for (var a = 0; a < this._prgRamMap.length; ++a) this._prgRamMap[a] = 0, this._prgRamIsActive[a] = 0;
    for (a = 0; a < this._nameTableMap.length; ++a) this._nameTableMap[a] =
        0;
    for (a = 0; a < this._prgRegisters.length; ++a) this._prgRegisters[a] = this.get8kPrgBankCount() - 4 + a;
    for (a = 0; a < this._chrRegsA.length; ++a) this._chrRegsA[a] = 0;
    for (a = 0; a < this._chrRegsB.length; ++a) this._chrRegsB[a] = 0;
    for (a = 0; a < this._chrMapA.length; ++a) this._chrMapA[a] = 0;
    for (a = 0; a < this._chrMapB.length; ++a) this._chrMapB[a] = 0;
    this._syncPrg();
    this._syncChr();
    this.switch8kChrBank(0);
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod);
    var b = this;
    this._irqEventId = this.mainboard.synchroniser.addEvent("mmc5 irq", -1, function(a) {
        b._irqEvent(a)
    })
};
mapper5.prototype.renderingEnabledChanged = function(a) {
    this.mRenderingEnabled = a;
    this._predictIrq(this.mainboard.synchroniser.getCpuMTC())
};
mapper5.prototype._irqEvent = function(a) {
    this.mRenderingEnabled && !this._irqActive && this._irqEnabled && 0 < this._irqScanlineTrigger && (this._irqActive = !0, this.mainboard.cpu.holdIrqLineLow(!0));
    this._predictIrq(a)
};
mapper5.prototype._syncPrg = function() {
    this.mainboard.synchroniser.synchronise();
    for (var a = 0; a < this._prgRamMap.length; ++a) this._prgRamMap[a] = 0, this._prgRamIsActive[a] = 0;
    switch (this._prgMode) {
        default:
            case 0:
            this.switch32kPrgBank((this._prgRegisters[3] & 127) >> 2);
        break;
        case 1:
                0 === (this._prgRegisters[1] & 128) ? (this._prgRamIsActive[0] = 1, this._prgRamIsActive[1] = 1, this._prgRamMap[0] = 2 * ((this._prgRegisters[1] & 14) >> 1), this._prgRamMap[1] = this._prgRamMap[0] + 1) : this.switch16kPrgBank((this._prgRegisters[1] & 127) >>
                1, !0);this.switch16kPrgBank((this._prgRegisters[3] & 127) >> 1, !1);
            break;
        case 2:
                this.switch8kPrgBank(this._prgRegisters[3] & 127, 3);0 === (this._prgRegisters[2] & 128) ? (this._prgRamIsActive[2] = 1, this._prgRamMap[2] = this._prgRegisters[2] & 7) : this.switch8kPrgBank(this._prgRegisters[2] & 127, 2);0 === (this._prgRegisters[1] & 128) ? (this._prgRamIsActive[0] = 1, this._prgRamIsActive[1] = 1, this._prgRamMap[0] = 2 * ((this._prgRegisters[1] & 14) >> 1), this._prgRamMap[1] = this._prgRamMap[0] + 1) : this.switch16kPrgBank((this._prgRegisters[1] &
                127) >> 1, !0);
            break;
        case 3:
                this.switch8kPrgBank(this._prgRegisters[3] & 127, 3),
            0 === (this._prgRegisters[2] & 128) ? (this._prgRamIsActive[2] = 1, this._prgRamMap[2] = this._prgRegisters[2] & 7) : this.switch8kPrgBank(this._prgRegisters[2] & 127, 2),
            0 === (this._prgRegisters[1] & 128) ? (this._prgRamIsActive[1] = 1, this._prgRamMap[1] = this._prgRegisters[1] & 7) : this.switch8kPrgBank(this._prgRegisters[1] & 127, 1),
            0 === (this._prgRegisters[0] & 128) ? (this._prgRamIsActive[0] = 1, this._prgRamMap[0] = this._prgRegisters[0] & 7) : this.switch8kPrgBank(this._prgRegisters[0] &
                127, 0)
    }
};
mapper5.prototype._chrBank = function(a, b, c, d) {
    for (var e = 0; e < b; ++e) a[e + c] = (d + e) % this.get1kChrBankCount()
};
mapper5.prototype._syncChr = function() {
    this.mainboard.synchroniser.synchronise();
    switch (this._chrMode) {
        default:
            case 0:
            this._chrBank(this._chrMapA, 8, 0, this._chrRegsA[7]);this._chrBank(this._chrMapB, 4, 0, this._chrRegsB[3]);
        break;
        case 1:
                this._chrBank(this._chrMapA, 4, 0, this._chrRegsA[3]);this._chrBank(this._chrMapA, 4, 4, this._chrRegsA[7]);this._chrBank(this._chrMapB, 4, 0, this._chrRegsB[3]);
            break;
        case 2:
                this._chrBank(this._chrMapA, 2, 0, this._chrRegsA[1]);this._chrBank(this._chrMapA, 2, 2, this._chrRegsA[3]);this._chrBank(this._chrMapA,
                2, 4, this._chrRegsA[5]);this._chrBank(this._chrMapA, 2, 6, this._chrRegsA[7]);this._chrBank(this._chrMapB, 2, 0, this._chrRegsB[1]);this._chrBank(this._chrMapB, 2, 2, this._chrRegsB[3]);
            break;
        case 3:
                for (var a = 0; 8 > a; ++a) this._chrBank(this._chrMapA, 1, a, this._chrRegsA[a]);
            for (a = 0; 4 > a; ++a) this._chrBank(this._chrMapB, 1, a, this._chrRegsB[a])
    }
};
mapper5.prototype.write8PrgRom = function(a, b) {
    if (this._writeProtectA && this._writeProtectB) {
        var c = (a & 57344) >> 13;
        1 === this._prgRamIsActive[c] ? this._prgRam[this._prgRamMap[c] << 13 | a & 8191] = b : Nes.basemapper.prototype.write8PrgRom.call(this, a, b)
    }
};
mapper5.prototype.read8PrgRom = function(a) {
    var b = (a & 57344) >> 13;
    return 1 === this._prgRamIsActive[b] ? this._prgRam[this._prgRamMap[b] << 13 | a & 8191] : Nes.basemapper.prototype.read8PrgRom.call(this, a)
};
mapper5.prototype.onEndFrame = function() {
    this._predictIrq(0)
};
mapper5.prototype._predictIrq = function(a) {
    if (this.mRenderingEnabled && !this._irqActive && this._irqEnabled && 0 < this._irqScanlineTrigger) {
        var b = this.mainboard.ppu.screenCoordinatesToTicks(0, this._irqScanlineTrigger);
        b > a && this._triggerMtc !== b && (this.mainboard.synchroniser.changeEventTime(this._irqEventId, b), this._triggerMtc = b)
    } else -1 !== this._triggerMtc && (this._triggerMtc = -1, this.mainboard.synchroniser.changeEventTime(this._irqEventId, -1))
};
mapper5.prototype.write8EXRam = function(a, b) {
    switch (a) {
        case 20736:
            this._prgMode = b & 3;
            this._syncPrg();
            break;
        case 20737:
            this._chrMode = b & 3;
            this._syncChr();
            break;
        case 20738:
            this._writeProtectA = 2 === (b & 3);
            break;
        case 20739:
            this._writeProtectB = 1 === (b & 3);
            break;
        case 20740:
            this.mainboard.synchroniser.synchronise();
            this._exRamMode = b & 3;
            break;
        case 20741:
            this.mainboard.synchroniser.synchronise();
            this._setNametableMirroring(b);
            break;
        case 20742:
            this.mainboard.synchroniser.synchronise();
            for (var c = 0; 960 > c; ++c) this._nameTableFill[c] =
                b;
            break;
        case 20743:
            this.mainboard.synchroniser.synchronise();
            for (var d = b & 3 + (b & 3) << 2 + (b & 3) << 4 + (b & 3) << 6, c = 960; c < this._nameTableFill.length; ++c) this._nameTableFill[c] = d;
            break;
        case 20755:
            this._prgRamPage = b & 7;
            break;
        case 20756:
            this._prgRegisters[0] = b;
            this._syncPrg();
            break;
        case 20757:
            this._prgRegisters[1] = b;
            this._syncPrg();
            break;
        case 20758:
            this._prgRegisters[2] = b;
            this._syncPrg();
            break;
        case 20759:
            this._prgRegisters[3] = b;
            this._syncPrg();
            break;
        case 20768:
            this._chrRegsA[0] = b | this._chrHighBits;
            this._chrUseBMap = !1;
            this._syncChr();
            break;
        case 20769:
            this._chrRegsA[1] = b | this._chrHighBits;
            this._chrUseBMap = !1;
            this._syncChr();
            break;
        case 20770:
            this._chrRegsA[2] = b | this._chrHighBits;
            this._chrUseBMap = !1;
            this._syncChr();
            break;
        case 20771:
            this._chrRegsA[3] = b | this._chrHighBits;
            this._chrUseBMap = !1;
            this._syncChr();
            break;
        case 20772:
            this._chrRegsA[4] = b | this._chrHighBits;
            this._chrUseBMap = !1;
            this._syncChr();
            break;
        case 20773:
            this._chrRegsA[5] = b | this._chrHighBits;
            this._chrUseBMap = !1;
            this._syncChr();
            break;
        case 20774:
            this._chrRegsA[6] =
                b | this._chrHighBits;
            this._chrUseBMap = !1;
            this._syncChr();
            break;
        case 20775:
            this._chrRegsA[7] = b | this._chrHighBits;
            this._chrUseBMap = !1;
            this._syncChr();
            break;
        case 20776:
            this._chrRegsB[0] = b | this._chrHighBits;
            this._chrUseBMap = !0;
            this._syncChr();
            break;
        case 20777:
            this._chrRegsB[1] = b | this._chrHighBits;
            this._chrUseBMap = !0;
            this._syncChr();
            break;
        case 20778:
            this._chrRegsB[2] = b | this._chrHighBits;
            this._chrUseBMap = !0;
            this._syncChr();
            break;
        case 20779:
            this._chrRegsB[3] = b | this._chrHighBits;
            this._chrUseBMap = !0;
            this._syncChr();
            break;
        case 20784:
            this.mainboard.synchroniser.synchronise();
            this._chrHighBits = (b & 3) << 8;
            break;
        case 20995:
            this.mainboard.synchroniser.synchronise();
            this._irqScanlineTrigger = b;
            this._predictIrq(this.mainboard.synchroniser.getCpuMTC());
            break;
        case 20996:
            this.mainboard.synchroniser.synchronise();
            this._irqEnabled = 0 < (b & 128);
            this._predictIrq(this.mainboard.synchroniser.getCpuMTC());
            break;
        case 20997:
            this._multiplier1 = b;
            break;
        case 20998:
            this._multiplier2 = b
    }
    23552 <= a && (this.mainboard.synchroniser.synchronise(),
        0 === this._exRamMode || 1 === this._exRamMode ? this.mainboard.ppu.isRendering(this.mainboard.synchroniser.getCpuMTC(), !1) ? this._internalExRam[a - 23552] = b : this._internalExRam[a - 23552] = 0 : 2 === this._exRamMode && (this._internalExRam[a - 23552] = b))
};
mapper5.prototype.read8EXRam = function(a) {
    switch (a) {
        case 20996:
            return this.mainboard.synchroniser.synchronise(), a = this.mainboard.ppu.ticksToScreenCoordinates(this.mainboard.synchroniser.getCpuMTC()), a = (this._irqActive ? 128 : 0) + (0 <= a.y && 240 > a.y ? 64 : 0), this._irqActive && (this._irqActive = !1, this.mainboard.cpu.holdIrqLineLow(!1)), this._predictIrq(this.mainboard.synchroniser.getCpuMTC()), a;
        case 20997:
            return this._multiplier1 * this._multiplier2 & 255;
        case 20998:
            return this._multiplier1 * this._multiplier2 >> 8 & 255
    }
    return 23552 <=
        a && (2 === this._exRamMode || 3 === this._exRamMode) ? this._internalExRam[a - 23552] : 0
};
mapper5.prototype.write8SRam = function(a, b) {
    this._prgRam[this._prgRamPage << 13 | a & 8191] = b
};
mapper5.prototype.read8SRam = function(a) {
    return this._prgRam[this._prgRamPage << 13 | a & 8191]
};
mapper5.prototype._setNametableMirroring = function(a) {
    for (var b = 0; 4 > b; ++b) this._nameTableMap[b] = a & 3, a >>= 2
};
mapper5.prototype.read8ChrRom = function(a, b, c) {
    if (b) return b = this._chrMapA[(a & 7168) >> 10 & 7], this._chrData[1024 * b + (a & 1023)];
    c = !1;
    c = this._bigSpritesEnabled ? !b : this._chrUseBMap;
    b = (a & 7168) >> 10;
    b = c ? this._chrMapB[b & 3] : this._chrMapA[b & 7];
    return this._chrData[1024 * b + (a & 1023)]
};
mapper5.prototype.nameTableRead = function(a, b, c) {
    switch (this._nameTableMap[b]) {
        default:
            case 0:
            return a[0][c];
        case 1:
                return a[1][c];
        case 2:
                return 0 === this._exRamMode || 1 === this._exRamMode ? this._internalExRam[c] : 0;
        case 3:
                return this._nameTableFill[c]
    }
};
mapper5.prototype.nameTableWrite = function(a, b, c, d) {
    switch (this._nameTableMap[b]) {
        default:
            case 0:
            a[0][c] = d;
        break;
        case 1:
                a[1][c] = d;
            break;
        case 2:
                if (0 === this._exRamMode || 1 === this._exRamMode) this._internalExRam[c] = d;break;
        case 3:
                this._nameTableFill[c] = d
    }
};
mapper5.prototype.spriteSizeChanged = function(a) {
    this._bigSpritesEnabled = a
};
Nes.mappers[5] = mapper5;
this.Nes = this.Nes || {};
"use strict";
var mapper6 = function() {};
mapper6.prototype = Object.create(Nes.basemapper.prototype);
mapper6.prototype.reset = function() {
    this.switch16kPrgBank(0, !0);
    this.switch16kPrgBank(7, !1);
    this.switch8kChrBank(0);
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
mapper6.prototype.write8PrgRom = function(a, b) {
    this.mainboard.synchroniser.synchronise();
    this.switch8kChrBank(b & 3);
    this.switch16kPrgBank((b & 60) >> 2, !0)
};
Nes.mappers[6] = mapper6;
this.Nes = this.Nes || {};
"use strict";
var mapper7 = function() {};
mapper7.prototype = Object.create(Nes.basemapper.prototype);
mapper7.prototype.reset = function() {
    this.switch32kPrgBank(0);
    0 === this.get8kChrBankCount() ? this.useVRAM() : this.switch8kChrBank(0);
    this.mirroringMethod = PPU_MIRRORING_SINGLESCREEN_NT0;
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
mapper7.prototype.write8PrgRom = function(a, b) {
    this.mainboard.synchroniser.synchronise();
    this.switch32kPrgBank(b & 255);
    this.mainboard.ppu.changeMirroringMethod(0 < (b & 16) ? PPU_MIRRORING_SINGLESCREEN_NT1 : PPU_MIRRORING_SINGLESCREEN_NT0)
};
Nes.mappers[7] = mapper7;
this.Nes = this.Nes || {};
"use strict";
var mapper8 = function() {};
mapper8.prototype = Object.create(Nes.basemapper.prototype);
mapper8.prototype.reset = function() {
    this.switch16kPrgBank(0, !0);
    this.switch16kPrgBank(1, !1);
    this.switch8kChrBank(0);
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
mapper8.prototype.write8PrgRom = function(a, b) {
    this.mainboard.synchroniser.synchronise();
    this.switch8kChrBank(b & 7);
    this.switch16kPrgBank((b & 248) >> 3, !0)
};
Nes.mappers[8] = mapper8;
this.Nes = this.Nes || {};
"use strict";
var mapper9 = function() {
    this._banks = new Int32Array(4)
};
mapper9.prototype = Object.create(Nes.basemapper.prototype);
mapper9.prototype.mapperSaveState = function(a) {
    a._banks = Nes.uintArrayToString(this._banks);
    a._latches = this._latches.slice(0)
};
mapper9.prototype.mapperLoadState = function(a) {
    this._banks = Nes.stringToUintArray(a._banks);
    this._latches = a._latches.slice(0)
};
mapper9.prototype.reset = function() {
    this._latches = [!0, !1];
    for (var a = 0; a < this._banks.length; ++a) this._banks[a] = 0;
    this.switch32kPrgBank(this.get32kPrgBankCount() - 1);
    for (a = 0; 8 > a; ++a) this.switch1kChrBank(0, a);
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
mapper9.prototype._syncChrBanks = function(a) {
    (void 0 === a || a) && this.mainboard.synchroniser.synchronise();
    this.switch4kChrBank(this._banks[this._latches[0] ? 1 : 0], !0);
    this.switch4kChrBank(this._banks[this._latches[1] ? 3 : 2], !1)
};
mapper9.prototype.MMC2Latch = function(a) {
    4056 === a ? (this._latches[0] = !1, this._syncChrBanks(!1)) : 4072 === a ? (this._latches[0] = !0, this._syncChrBanks(!1)) : 8152 <= a && 8159 >= a ? (this._latches[1] = !1, this._syncChrBanks(!1)) : 8168 <= a && 8175 >= a && (this._latches[1] = !0, this._syncChrBanks(!1))
};
mapper9.prototype.write8PrgRom = function(a, b) {
    switch (a & 61440) {
        case 40960:
            this.mainboard.synchroniser.synchronise();
            this.switch8kPrgBank(b & 15, 0);
            break;
        case 45056:
            this._banks[0] = b & 31;
            this._syncChrBanks();
            break;
        case 49152:
            this._banks[1] = b & 31;
            this._syncChrBanks();
            break;
        case 53248:
            this._banks[2] = b & 31;
            this._syncChrBanks();
            break;
        case 57344:
            this._banks[3] = b & 31;
            this._syncChrBanks();
            break;
        case 61440:
            this.mainboard.synchroniser.synchronise();
            this.mainboard.ppu.changeMirroringMethod(0 < (b & 1) ? PPU_MIRRORING_HORIZONTAL :
                PPU_MIRRORING_VERTICAL);
            break;
        default:
            Nes.basemapper.prototype.write8PrgRom.call(this, a, b)
    }
};
Nes.mappers[9] = mapper9;
this.Nes = this.Nes || {};
"use strict";
var mapper11 = function() {};
mapper11.prototype = Object.create(Nes.basemapper.prototype);
mapper11.prototype.reset = function() {
    this.switch32kPrgBank(this.get32kPrgBankCount() - 1);
    this.switch8kChrBank(0);
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
mapper11.prototype.write8PrgRom = function(a, b) {
    this.mainboard.synchroniser.synchronise();
    this.switch32kPrgBank(b & 3);
    this.switch8kChrBank((b & 240) >> 4)
};
Nes.mappers[11] = mapper11;
this.Nes = this.Nes || {};
"use strict";
var mapper13 = function() {};
mapper13.prototype = Object.create(Nes.basemapper.prototype);
mapper13.prototype.reset = function() {
    this.switch32kPrgBank(0);
    this.useVRAM(16);
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
mapper13.prototype.write8PrgRom = function(a, b) {
    this.mainboard.synchroniser.synchronise();
    this.switch4kChrBank(b, !1)
};
Nes.mappers[13] = mapper13;
this.Nes = this.Nes || {};
"use strict";
var mapper15 = function() {};
mapper15.prototype = Object.create(Nes.basemapper.prototype);
mapper15.prototype.reset = function() {
    this.switch32kPrgBank(0);
    this.useVRAM();
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
mapper15.prototype.write8PrgRom = function(a, b) {
    this.mainboard.synchroniser.synchronise();
    this.mainboard.ppu.changeMirroringMethod(0 < (b & 64) ? PPU_MIRRORING_HORIZONTAL : PPU_MIRRORING_VERTICAL);
    var c = 0 < (b & 128),
        d = b & 63;
    switch (a & 3) {
        case 2:
            for (var e = 0; 4 > e; ++e) this.switch8kPrgBank(2 * d + (c ? 1 : 0), e);
            break;
        case 3:
            this.switch16kPrgBank(d, !0);
            this.switch16kPrgBank(d, !1);
            break;
        case 0:
            this.switch16kPrgBank(d, !0);
            this.switch16kPrgBank(d | 1, !1);
            break;
        case 1:
            this.switch16kPrgBank(d, !0), this.switch16kPrgBank(this.get16kPrgBankCount() -
                1, !1)
    }
};
Nes.mappers[15] = mapper15;
this.Nes = this.Nes || {};
"use strict";
var mapper17 = function() {};
mapper17.prototype = Object.create(Nes.basemapper.prototype);
mapper17.prototype.reset = function() {
    this.switch32kPrgBank(0);
    this.switch8kChrBank(0);
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
mapper17.prototype.write8EXRom = function(a, b) {
    this.mainboard.synchroniser.synchronise();
    switch (a) {
        case 17668:
            this.switch8kPrgBank(b, 0);
            break;
        case 17669:
            this.switch8kPrgBank(b, 1);
            break;
        case 17670:
            this.switch8kPrgBank(b, 2);
            break;
        case 17671:
            this.switch8kPrgBank(b, 3);
            break;
        case 17680:
            this.switch1kChrBank(b, 0);
            break;
        case 17681:
            this.switch1kChrBank(b, 1);
            break;
        case 17682:
            this.switch1kChrBank(b, 2);
            break;
        case 17683:
            this.switch1kChrBank(b, 3);
            break;
        case 17684:
            this.switch1kChrBank(b, 4);
            break;
        case 17685:
            this.switch1kChrBank(b,
                5);
            break;
        case 17686:
            this.switch1kChrBank(b, 6);
            break;
        case 17687:
            this.switch1kChrBank(b, 7)
    }
};
Nes.mappers[17] = mapper17;
this.Nes = this.Nes || {};
"use strict";
var mapper34 = function() {};
mapper34.prototype = Object.create(Nes.basemapper.prototype);
mapper34.prototype.reset = function() {
    this._isNinaBoard = "68315AFB344108CB0D43E119BA0353D5A44BD489" === this.mainboard.cart.getHash();
    this.switch32kPrgBank(0);
    0 === this.get8kChrBankCount() ? this.useVRAM() : this.switch8kChrBank(0);
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
mapper34.prototype.write8SRam = function(a, b) {
    this._isNinaBoard ? (this.mainboard.synchroniser.synchronise(), 32766 === a ? this.switch4kChrBank(b & 15, !0) : 32767 === a ? this.switch4kChrBank(b & 15, !1) : 32765 === a ? this.switch32kPrgBank(b & 1) : Nes.basemapper.prototype.write8SRam.call(this, a, b)) : Nes.basemapper.prototype.write8SRam.call(this, a, b)
};
mapper34.prototype.write8PrgRom = function(a, b) {
    this._isNinaBoard ? Nes.basemapper.prototype.write8PrgRom.call(this, a, b) : (this.mainboard.synchroniser.synchronise(), this.switch32kPrgBank(b & 255))
};
Nes.mappers[34] = mapper34;
this.Nes = this.Nes || {};
"use strict";
var mapper41 = function() {};
mapper41.prototype = Object.create(Nes.basemapper.prototype);
mapper41.prototype.reset = function() {
    this._chrInner = this._chrOuter = this._prgBank = 0;
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod);
    this._sync()
};
mapper41.prototype.write8SRam = function(a, b) {
    24576 === (a & 63488) && (this.mainboard.synchroniser.synchronise(), this._prgBank = a & 7, this._chrOuter = (a & 24) >> 1, 0 === (a & 32) ? this.mainboard.ppu.changeMirroringMethod(PPU_MIRRORING_VERTICAL) : this.mainboard.ppu.changeMirroringMethod(PPU_MIRRORING_HORIZONTAL), this._sync())
};
mapper41.prototype.write8PrgRom = function(a, b) {
    this.mainboard.synchroniser.synchronise();
    0 < (this._prgBank & 4) && (this._chrInner = b & 3);
    this._sync()
};
mapper41.prototype._sync = function() {
    this.switch32kPrgBank(this._prgBank);
    this.switch8kChrBank(this._chrOuter | this._chrInner)
};
Nes.mappers[41] = mapper41;
this.Nes = this.Nes || {};
"use strict";
var mapper64 = function() {
    this.bankSwapByte = 0;
    this.prgRamDisableWrite = !1;
    this.chipEnable = this.interruptsEnabled = !0;
    this.irqCounter = this.irqLatch = 0;
    this.mReloadFlag = !1;
    this.lastA12Raise = 0;
    this._cpuCycleMode = this.mRenderingEnabled = this.mSpriteAddress = this.mScreenAddress = !1;
    this.banks = new Int32Array(16);
    this.banks[0] = 0;
    this.banks[1] = 2;
    this.banks[2] = 4;
    this.banks[3] = 5;
    this.banks[4] = 6;
    this.banks[5] = 7;
    this.banks[6] = 0;
    this.banks[7] = 1;
    this.banks[8] = 2;
    this.banks[9] = 3;
    this.banks[15] = 0
};
mapper64.prototype = Object.create(Nes.basemapper.prototype);
mapper64.prototype._eventIrq = function() {
    this.mainboard.synchroniser.changeEventTime(this._irqEventId, -1)
};
mapper64.prototype.mapperSaveState = function(a) {
    a.bankSwapByte = this.bankSwapByte;
    a.prgRamDisableWrite = this.prgRamDisableWrite;
    a.chipEnable = this.chipEnable;
    a._cpuCycleMode = this._cpuCycleMode;
    a.interruptsEnabled = this.interruptsEnabled;
    a.irqCounter = this.irqCounter;
    a.irqLatch = this.irqLatch;
    a.mReloadFlag = this.mReloadFlag;
    a.lastA12Raise = this.lastA12Raise;
    a.mSpriteAddress = this.mSpriteAddress;
    a.mScreenAddress = this.mScreenAddress;
    a.mRenderingEnabled = this.mRenderingEnabled;
    a.banks = Nes.uintArrayToString(this.banks);
    a._interruptInProgress = this._interruptInProgress
};
mapper64.prototype.mapperLoadState = function(a) {
    this.bankSwapByte = a.bankSwapByte;
    this.prgRamDisableWrite = a.prgRamDisableWrite;
    this._cpuCycleMode = a._cpuCycleMode;
    this.chipEnable = a.chipEnable;
    this.interruptsEnabled = a.interruptsEnabled;
    this.irqCounter = a.irqCounter;
    this.irqLatch = a.irqLatch;
    this.mReloadFlag = a.mReloadFlag;
    this.lastA12Raise = a.lastA12Raise;
    this.mSpriteAddress = a.mSpriteAddress;
    this.mScreenAddress = a.mScreenAddress;
    this.mRenderingEnabled = a.mRenderingEnabled;
    this.banks = Nes.stringToUintArray(a.banks);
    this._interruptInProgress = a._interruptInProgress
};
mapper64.prototype.syncBanks = function(a, b) {
    a && (this.switch8kPrgBank(this.get8kPrgBankCount() - 1, 3), 0 < (this.bankSwapByte & 64) ? (this.switch8kPrgBank(this.banks[15], 0), this.switch8kPrgBank(this.banks[6], 1), this.switch8kPrgBank(this.banks[7], 2)) : (this.switch8kPrgBank(this.banks[6], 0), this.switch8kPrgBank(this.banks[7], 1), this.switch8kPrgBank(this.banks[15], 2)));
    if (b) {
        this.mainboard.synchroniser.synchronise();
        var c = this.banks[0] & 254,
            d = this.banks[1] & 254;
        switch (this.bankSwapByte & 160) {
            case 0:
                this.switch1kChrBank(c,
                    0);
                this.switch1kChrBank(c + 1, 1);
                this.switch1kChrBank(d, 2);
                this.switch1kChrBank(d + 1, 3);
                this.switch1kChrBank(this.banks[2], 4);
                this.switch1kChrBank(this.banks[3], 5);
                this.switch1kChrBank(this.banks[4], 6);
                this.switch1kChrBank(this.banks[5], 7);
                break;
            case 32:
                this.switch1kChrBank(this.banks[0], 0);
                this.switch1kChrBank(this.banks[8], 1);
                this.switch1kChrBank(this.banks[1], 2);
                this.switch1kChrBank(this.banks[9], 3);
                this.switch1kChrBank(this.banks[2], 4);
                this.switch1kChrBank(this.banks[3], 5);
                this.switch1kChrBank(this.banks[4],
                    6);
                this.switch1kChrBank(this.banks[5], 7);
                break;
            case 128:
                this.switch1kChrBank(this.banks[2], 0);
                this.switch1kChrBank(this.banks[3], 1);
                this.switch1kChrBank(this.banks[4], 2);
                this.switch1kChrBank(this.banks[5], 3);
                this.switch1kChrBank(c, 4);
                this.switch1kChrBank(c + 1, 5);
                this.switch1kChrBank(d, 6);
                this.switch1kChrBank(d + 1, 7);
                break;
            case 160:
                this.switch1kChrBank(this.banks[2], 0), this.switch1kChrBank(this.banks[3], 1), this.switch1kChrBank(this.banks[4], 2), this.switch1kChrBank(this.banks[5], 3), this.switch1kChrBank(this.banks[0],
                    4), this.switch1kChrBank(this.banks[8], 5), this.switch1kChrBank(this.banks[1], 6), this.switch1kChrBank(this.banks[9], 7)
        }
    }
};
mapper64.prototype.reset = function() {
    this.prgRamDisableWrite = !1;
    this.chipEnable = this.interruptsEnabled = !0;
    this._interruptInProgress = !1;
    this._A12LowerLimit = COLOUR_ENCODING_VBLANK_SCANLINES * MASTER_CYCLES_PER_SCANLINE;
    this._A12UpperLimit = (COLOUR_ENCODING_FRAME_SCANLINES - 1) * MASTER_CYCLES_PER_SCANLINE;
    this.lastA12Raise = 0;
    this.mRenderingEnabled = this.mSpriteAddress = this.mScreenAddress = !1;
    this.irqLatch = this.irqCounter = 255;
    this.mReloadFlag = !1;
    this.lastA12Raise = 0;
    this._cpuCycleMode = !1;
    this.bankSwapByte = 0;
    this.banks[0] =
        0;
    this.banks[1] = 2;
    this.banks[2] = 4;
    this.banks[3] = 5;
    this.banks[4] = 6;
    this.banks[5] = 7;
    this.banks[6] = 0;
    this.banks[7] = 1;
    this.banks[8] = 2;
    this.banks[9] = 3;
    this.banks[15] = this.get8kPrgBankCount() - 2;
    0 === this.get1kChrBankCount() && this.useVRAM(8);
    var a = this;
    this._irqEventId = this.mainboard.synchroniser.addEvent("mapper64 irq", -1, function() {
        a._eventIrq()
    });
    this.syncBanks(!0, !0);
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
mapper64.prototype.write8PrgRom = function(a, b) {
    switch (a & 57344) {
        case 32768:
            if (0 === (a & 1)) this.bankSwapByte !== b & 255 && (this.bankSwapByte = b & 255, this.syncBanks(!0, !0));
            else {
                var c = this.bankSwapByte & 15;
                this.banks[c] !== b & 255 && (this.banks[c] = b & 255, this.syncBanks(6 === c || 7 === c || 15 === c, 5 >= c || 8 === c || 9 === c))
            }
            break;
        case 40960:
            0 === (a & 1) ? (c = 0 < (b & 1) ? PPU_MIRRORING_HORIZONTAL : PPU_MIRRORING_VERTICAL, c !== this.mainboard.ppu.getMirroringMethod() && (this.mainboard.synchroniser.synchronise(), this.mainboard.ppu.changeMirroringMethod(c))) :
                (this.prgRamDisableWrite = 0 < (b & 64), this.chipEnable = 0 < (b & 128));
            break;
        case 49152:
            0 === (a & 1) ? (this.irqLatch !== b && this.mainboard.synchroniser.synchronise(), this.irqLatch = b) : (this.mReloadFlag || this.mainboard.synchroniser.synchronise(), this.mReloadFlag = !0, this._cpuCycleMode = 0 < (b & 1));
            this.updateIRQTime(this.mainboard.synchroniser.getCpuMTC(), !0);
            break;
        case 57344:
            0 === (a & 1) ? (this.interruptsEnabled = !1, this._interruptInProgress && (this.mainboard.cpu.holdIrqLineLow(!1), this._interruptInProgress = !1)) : (this.interruptsEnabled ||
                this.mainboard.synchroniser.synchronise(), this.interruptsEnabled = !0), this.updateIRQTime(this.mainboard.synchroniser.getCpuMTC(), !0)
    }
};
mapper64.prototype.decrementIrqCounter = function(a) {
    this.lastA12Raise = a;
    a = !1;
    this.mReloadFlag ? (this.irqCounter = this.irqLatch + 1, this.mReloadFlag = !1) : 0 === this.irqCounter ? this.irqCounter = this.irqLatch : (0 < this.irqCounter && this.irqCounter--, a = 0 === this.irqCounter);
    a && this.interruptsEnabled && !this._interruptInProgress && (this._interruptInProgress = !0, this.mainboard.cpu.holdIrqLineLow(!0))
};
mapper64.prototype.ppuA12Latch = function() {
    this.mainboard.synchroniser.synchronise();
    this.decrementIrqCounter(this.mainboard.synchroniser.getCpuMTC());
    this.updateIRQTime(this.mainboard.synchroniser.getCpuMTC(), !0)
};
mapper64.prototype.calculateNextA12Raise = function(a) {
    var b = -1;
    this.mRenderingEnabled && (b = this.mSpriteAddress && !this.mScreenAddress ? 265 : 9);
    if (a >= this._A12UpperLimit || 0 > b) return -1;
    var b = MASTER_CYCLES_PER_PPU * b,
        c = a - a % MASTER_CYCLES_PER_SCANLINE + b;
    c <= a && (c += MASTER_CYCLES_PER_SCANLINE);
    if (this._A12UpperLimit <= c) return -1;
    c < this._A12LowerLimit && (c = this._A12LowerLimit + b);
    return c
};
mapper64.prototype.updateIRQTime = function(a, b) {
    b && this.mainboard.synchroniser.synchronise();
    var c = -1;
    if (this._cpuCycleMode) {
        var d = 0,
            e = 0;
        this.interruptsEnabled && (d = this.calculateNextCpuCycleDecrement(a), -1 === d ? c = -1 : (e = this.mReloadFlag ? 0 : Math.max(this.irqCounter - 1, 0), c = d + 4 * e * COLOUR_ENCODING_MTC_PER_CPU + COLOUR_ENCODING_MTC_PER_CPU))
    } else e = d = 0, this.interruptsEnabled && (d = this.calculateNextA12Raise(a), -1 === d ? c = -1 : (e = this.mReloadFlag ? 0 : Math.max(this.irqCounter - 1, 0), c = d + e * MASTER_CYCLES_PER_SCANLINE, c = c >
        this._A12UpperLimit ? -1 : c + COLOUR_ENCODING_MTC_PER_CPU));
    this.mainboard.synchroniser.changeEventTime(this._irqEventId, c)
};
mapper64.prototype.spriteScreenEnabledUpdate = function(a, b) {
    this.mSpriteAddress = a;
    this.mScreenAddress = b;
    this.updateIRQTime(this.mainboard.synchroniser.getCpuMTC(), !0)
};
mapper64.prototype.renderingEnabledChanged = function(a) {
    this.mRenderingEnabled = a;
    this.updateIRQTime(this.mainboard.synchroniser.getCpuMTC(), !0)
};
mapper64.prototype.calculateNextCpuCycleDecrement = function(a) {
    var b = 4 * COLOUR_ENCODING_MTC_PER_CPU;
    return a + (b - a % b)
};
mapper64.prototype.synchronise = function(a, b) {
    if (this._cpuCycleMode)
        for (c = this.calculateNextCpuCycleDecrement(a); c <= b; c += 4 * COLOUR_ENCODING_MTC_PER_CPU) this.decrementIrqCounter(c);
    else if (c = this.calculateNextA12Raise(a + 1), 0 <= c)
        for (var c = c; c <= Math.min(this._A12UpperLimit, b); c += MASTER_CYCLES_PER_SCANLINE) this.decrementIrqCounter(c);
    this.updateIRQTime(b, !1)
};
mapper64.prototype.onEndFrame = function() {
    this.lastA12Raise = 0
};
mapper64.prototype.write8SRam = function(a, b) {
    this.chipEnable && !this.prgRamDisableWrite && Nes.basemapper.prototype.write8SRam.call(this, a, b)
};
mapper64.prototype.read8SRam = function(a) {
    return this.chipEnable ? Nes.basemapper.prototype.read8SRam.call(this, a) : 0
};
Nes.mappers[64] = mapper64;
this.Nes = this.Nes || {};
"use strict";
var mapper65 = function() {};
mapper65.prototype = Object.create(Nes.basemapper.prototype);
mapper65.prototype.reset = function() {
    this._irqEnabled = !1;
    this._irqReload = this._irqCounter = 0;
    this._nextIrqRaise = -1;
    this.switch8kPrgBank(0, 0);
    this.switch8kPrgBank(1, 1);
    this.switch8kPrgBank(254, 2);
    this.switch8kPrgBank(this.get8kPrgBankCount() - 1, 3);
    this.switch8kChrBank(this.get8kChrBankCount() - 1);
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod);
    this._irqEventId = this.mainboard.synchroniser.addEvent("mapper65 irq", -1, function() {})
};
mapper65.prototype.write8PrgRom = function(a, b) {
    this.mainboard.synchroniser.synchronise();
    switch (a & 61440) {
        case 32768:
            this.switch8kPrgBank(b, 0);
            break;
        case 36864:
            switch (a) {
                case 36865:
                    0 === (b & 128) ? this.mainboard.ppu.changeMirroringMethod(PPU_MIRRORING_VERTICAL) : this.mainboard.ppu.changeMirroringMethod(PPU_MIRRORING_HORIZONTAL);
                    break;
                case 36867:
                    this._irqEnabled = 0 < (b & 128);
                    this.mainboard.cpu.holdIrqLineLow(!1);
                    break;
                case 36868:
                    this._irqCounter = this._irqReload * COLOUR_ENCODING_MTC_PER_CPU;
                    this.mainboard.cpu.holdIrqLineLow(!1);
                    var c = -1;
                    this._irqEnabled && (c = this.mainboard.synchroniser.getCpuMTC() + this._irqCounter);
                    c !== this._nextIrqRaise && (this.mainboard.synchroniser.changeEventTime(this._irqEventId, c), this._nextIrqRaise = c);
                    break;
                case 36869:
                    this._irqReload = this._irqReload & 255 | b << 8;
                    break;
                case 36870:
                    this._irqReload = this._irqReload & 65280 | b
            }
            break;
        case 40960:
            this.switch8kPrgBank(b, 1);
            break;
        case 45056:
            this.switch1kChrBank(b, a & 7);
            break;
        case 49152:
            this.switch8kPrgBank(b, 2)
    }
};
mapper65.prototype.synchronise = function(a, b) {
    this._irqEnabled && (this._irqCounter -= b - a, 0 >= this._irqCounter && (this.mainboard.synchroniser.changeEventTime(this._irqEventId, -1), this.mainboard.cpu.holdIrqLineLow(!0), this._irqCounter = 0, this._irqEnabled = !1))
};
Nes.mappers[65] = mapper65;
this.Nes = this.Nes || {};
"use strict";
var mapper66 = function() {};
mapper66.prototype = Object.create(Nes.basemapper.prototype);
mapper66.prototype.reset = function() {
    this.switch32kPrgBank(this.get32kPrgBankCount() - 1);
    this.switch8kChrBank(this.get8kChrBankCount() - 1);
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
mapper66.prototype.write8PrgRom = function(a, b) {
    this.mainboard.synchroniser.synchronise();
    this.switch8kChrBank(b & 3);
    this.switch32kPrgBank((b & 48) >> 4)
};
Nes.mappers[66] = mapper66;
this.Nes = this.Nes || {};
"use strict";
var mapper71 = function() {};
mapper71.prototype = Object.create(Nes.basemapper.prototype);
mapper71.prototype.reset = function() {
    this._isFireHawk = "334781C830F135CF30A33E392D8AAA4AFDC223F9" === this.mainboard.cart.getHash();
    this.useVRAM();
    this.switch32kPrgBank(this.get32kPrgBankCount() - 1);
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
mapper71.prototype.write8PrgRom = function(a, b) {
    if (32768 === (a & 49152)) {
        if (this._isFireHawk) {
            var c = 0 < (b & 16) ? PPU_MIRRORING_SINGLESCREEN_NT1 : PPU_MIRRORING_SINGLESCREEN_NT0;
            this.mainboard.synchroniser.synchronise();
            this.mainboard.ppu.changeMirroringMethod(c)
        }
    } else this.mainboard.synchroniser.synchronise(), this.switch16kPrgBank(b & 15, !0)
};
Nes.mappers[71] = mapper71;
this.Nes = this.Nes || {};
(function() {
    var a = function() {};
    a.prototype = Object.create(Nes.basemapper.prototype);
    a.prototype.reset = function() {
        this.switch16kPrgBank(0, !0);
        this.switch16kPrgBank(this.get16kPrgBankCount() - 1, !1);
        this.switch8kChrBank(0);
        this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
    };
    a.prototype.write8PrgRom = function(a, c) {
        this.mainboard.synchroniser.synchronise();
        this.switch16kPrgBank(c & 15, !0);
        this.switch8kChrBank((c & 240) >> 4)
    };
    Nes.mappers[78] = a
})();
this.Nes = this.Nes || {};
(function() {
    var a = function() {};
    a.prototype = Object.create(Nes.basemapper.prototype);
    a.prototype.reset = function() {
        this.switch32kPrgBank(this.get32kPrgBankCount() - 1);
        this.switch8kChrBank(this.get8kChrBankCount() - 1);
        this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
    };
    a.prototype.write8EXRam = function(a, c) {
        16640 === (a & 16640) && (this.mainboard.synchroniser.synchronise(), this.switch32kPrgBank((c & 8) >> 3), this.switch8kChrBank(c & 7))
    };
    Nes.mappers[79] = a
})();
this.Nes = this.Nes || {};
"use strict";
var mapper180 = function() {};
mapper180.prototype = Object.create(Nes.basemapper.prototype);
mapper180.prototype.reset = function() {
    this.switch16kPrgBank(0, !0);
    this.switch16kPrgBank(this.get16kPrgBankCount() - 1, !1);
    this.useVRAM();
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
mapper180.prototype.write8PrgRom = function(a, b) {
    this.switch16kPrgBank(b, !1)
};
Nes.mappers[180] = mapper180;
this.Nes = this.Nes || {};
"use strict";
var mapper206 = function() {
    this.bankSwapByte = 0;
    this.banks = new Int32Array(8);
    this.banks[0] = 0;
    this.banks[1] = 2;
    this.banks[2] = 4;
    this.banks[3] = 5;
    this.banks[4] = 6;
    this.banks[5] = 7;
    this.banks[6] = 0;
    this.banks[7] = 1
};
mapper206.prototype = Object.create(Nes.basemapper.prototype);
mapper206.prototype.mapperSaveState = function(a) {
    a.bankSwapByte = this.bankSwapByte;
    a.banks = Nes.uintArrayToString(this.banks)
};
mapper206.prototype.mapperLoadState = function(a) {
    this.bankSwapByte = a.bankSwapByte;
    this.banks = Nes.stringToUintArray(a.banks)
};
mapper206.prototype.syncBanks = function(a, b) {
    a && (this.switch8kPrgBank(this.banks[7] & 15, 1), this.switch8kPrgBank(this.get8kPrgBankCount() - 2, 2), this.switch8kPrgBank(this.get8kPrgBankCount() - 1, 3), this.switch8kPrgBank(this.banks[6] & 15, 0));
    if (b) {
        this.mainboard.synchroniser.synchronise();
        var c = this.banks[0] & 62,
            d = this.banks[1] & 62;
        this.switch1kChrBank(c, 0);
        this.switch1kChrBank(c + 1, 1);
        this.switch1kChrBank(d, 2);
        this.switch1kChrBank(d + 1, 3);
        this.switch1kChrBank(this.banks[2] & 63, 4);
        this.switch1kChrBank(this.banks[3] &
            63, 5);
        this.switch1kChrBank(this.banks[4] & 63, 6);
        this.switch1kChrBank(this.banks[5] & 63, 7)
    }
};
mapper206.prototype.reset = function() {
    this.bankSwapByte = 0;
    this.banks[0] = 0;
    this.banks[1] = 2;
    this.banks[2] = 4;
    this.banks[3] = 5;
    this.banks[4] = 6;
    this.banks[5] = 7;
    this.banks[6] = 0;
    this.banks[7] = 1;
    0 === this.get1kChrBankCount() && this.useVRAM(8);
    this.syncBanks(!0, !0);
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod)
};
mapper206.prototype.write8PrgRom = function(a, b) {
    if (0 === (a & 1)) this.bankSwapByte !== b & 255 && (this.bankSwapByte = b & 255, this.syncBanks(!0, !0));
    else {
        var c = this.bankSwapByte & 7;
        this.banks[c] !== b & 255 && (this.banks[c] = b & 255, this.syncBanks(6 <= c, 5 >= c))
    }
};
mapper206.prototype.synchronise = function(a, b) {};
mapper206.prototype.onEndFrame = function() {};
Nes.mappers[206] = mapper206;
this.Nes = this.Nes || {};
"use strict";
var calculateSha1 = function(a, b) {
    try {
        b = b || 0;
        for (var c = new Rusha(a.length - b), d = [], e = b; e < a.length; ++e) d.push(a[e]);
        for (var f = c.digestFromBuffer(d).toUpperCase(); 40 > f.length;) f = "0" + f;
        return f
    } catch (g) {
        console.error(g), console.log(g.stack)
    }
};
Nes.calculateSha1 = calculateSha1;
var dbLookup = function(a, b) {
    if (40 !== a.length) throw Error("dbLookup : SHA1 must be 40 characters long! [" + a + "]");
    $.getScript("js/db/" + a + ".js").always(function() {
        b(null, window.NesDb ? window.NesDb[a] : null)
    })
};
Nes.dbLookup = dbLookup;
this.Nes = this.Nes || {};
"use strict";
var codes = {
        A: 0,
        P: 1,
        Z: 2,
        L: 3,
        G: 4,
        I: 5,
        T: 6,
        Y: 7,
        E: 8,
        O: 9,
        X: 10,
        U: 11,
        K: 12,
        S: 13,
        V: 14,
        N: 15
    },
    ggcodeArray = new Int32Array(8),
    stringToCodeArray = function(a) {
        for (var b = 0; b < a.length; ++b) {
            var c = codes[a[b]];
            if (void 0 === c) throw Error("Invalid character in game genie code");
            ggcodeArray[b] = c
        }
        return ggcodeArray
    },
    processGameGenieCode = function(a, b, c) {
        if (6 !== b.length && 8 !== b.length) throw Error("Invalid game genie code entered '" + b + "'");
        if (c)
            if (c = stringToCodeArray(b), 6 === b.length) {
                var d = c[0] & 7,
                    d = d | c[5] & 8,
                    d = d | (c[1] & 7) << 4,
                    d = d |
                    (c[0] & 8) << 4,
                    e = c[4] & 7,
                    e = e | c[3] & 8,
                    e = e | (c[2] & 7) << 4,
                    e = e | (c[1] & 8) << 4,
                    e = e | (c[5] & 7) << 8,
                    e = e | (c[4] & 8) << 8,
                    e = e | (c[3] & 7) << 12;
                a.cart.memoryMapper.gameGeniePoke(b, e + 32768, d, -1)
            } else {
                if (8 === b.length) {
                    var d = c[0] & 7,
                        d = d | c[7] & 8,
                        d = d | (c[1] & 7) << 4,
                        d = d | (c[0] & 8) << 4,
                        e = c[4] & 7,
                        e = e | c[3] & 8,
                        e = e | (c[2] & 7) << 4,
                        e = e | (c[1] & 8) << 4,
                        e = e | (c[5] & 7) << 8,
                        e = e | (c[4] & 8) << 8,
                        e = e | (c[3] & 7) << 12,
                        f = c[6] & 7,
                        f = f | c[5] & 8,
                        f = f | (c[7] & 7) << 4,
                        f = f | (c[6] & 8) << 4;
                    a.cart.memoryMapper.gameGeniePoke(b, e + 32768, d, f)
                }
            } else a.cart.memoryMapper.removeGameGeniePoke(b)
    };
Nes.processGameGenieCode = processGameGenieCode;
this.Nes = this.Nes || {};
"use strict";
var cartridge = function(a) {
    this.mainboard = a;
    this.memoryMapper = null;
    this._name = this._sha1 = "";
    this._dbData = null;
    this._colourEncodingType = g_DefaultColourEncoding
};
cartridge.prototype.areGameGenieCodesAvailable = function() {
    return !!(this._dbData && this._dbData.gameGenieCodes && 0 < this._dbData.gameGenieCodes.length)
};
cartridge.prototype.loadRom = function(a, b, c) {
    var d = this;
    try {
        Nes.decompressIfNecessary(a, b, function(b, e) {
            b ? c(b) : d._loadData(a, e, c)
        })
    } catch (e) {
        c(e)
    }
};
var getHighestFrequencyElement = function(a) {
    var b = null,
        c = 0,
        d;
    for (d in a) a.hasOwnProperty(d) && a[d] > c && (c = a[d], b = d);
    return b
};
cartridge.prototype._getMapperFromDatabase = function(a) {
    var b = {};
    if (this._dbData && this._dbData.cartridge) {
        var c = !1;
        this._dbData.cartridge.forEach(function(d) {
            d.board && d.board.forEach(function(d) {
                d.$.mapper === a ? c = !0 : b[d.$.mapper] = b[d.$.mapper] + 1 || 1
            })
        });
        if (c) return a;
        var d = getHighestFrequencyElement(b);
        if (null !== d) return parseInt(d)
    }
    return null
};
cartridge.prototype._workOutColourEncodingFromFilename = function(a) {
    return a.match(/[\[\(][E][\]\)]/i) ? "PAL" : a.match(/[\[\(][JU][\]\)]/i) ? "NTSC" : g_DefaultColourEncoding
};
cartridge.prototype._determineColourEncodingType = function(a) {
    var b = {};
    if (this._dbData && this._dbData.cartridge) {
        this._dbData.cartridge.forEach(function(a) {
            a.$.system && ("nes-pal" === a.$.system.toLowerCase().slice(0, 7) ? (b.PAL = b.PAL || 0, b.PAL++) : (b.NTSC = b.NTSC || 0, b.NTSC++))
        });
        var c = getHighestFrequencyElement(b);
        if (null !== c) {
            this._colourEncodingType = c;
            return
        }
    }
    this._colourEncodingType = this._workOutColourEncodingFromFilename(a)
};
cartridge.prototype.getName = function() {
    return this._name
};
cartridge.prototype.getHash = function() {
    return this._sha1
};
var create32IntArray = function(a, b) {
    for (var c = new Int32Array(b), d = 0; d < b; ++d) c[d] = a[d] | 0;
    return c
};
cartridge.prototype._loadData = function(a, b, c) {
    var d = this;
    try {
        this._name = a;
        for (var e = 0, f = [78, 69, 83, 26], g = 0; g < f.length; ++g)
            if (f[g] !== b[e++]) throw Error("Invalid NES header for file!");
        var h = b[e++],
            k = b[e++],
            l = b[e++],
            m = b[e++];
        0 === h && (h = 1);
        var f = 0 < (l & 4),
            n = 0,
            n = 0 < (l & 8) ? PPU_MIRRORING_FOURSCREEN : 0 === (l & 1) ? PPU_MIRRORING_HORIZONTAL : PPU_MIRRORING_VERTICAL,
            p = (l & 240) >> 4 | m & 240,
            e = 16;
        f && (e += 512);
        this._sha1 = Nes.calculateSha1(b, e);
        console.log("SHA1: " + this._sha1);
        Nes.dbLookup(this._sha1, function(f, g) {
            if (f) c(f);
            else try {
                d._dbData =
                    g;
                d._dbData ? (d._name = d._dbData.$.name, console.log("Game found in database: " + d._name)) : console.log("Game not found in database");
                var l = d._getMapperFromDatabase(p);
                null !== l && l !== p && (console.log("Game has different mapper in database [" + l + "] from the iNes file [" + p + "]. Using value from database..."), p = l);
                d.memoryMapper = Nes.createMapper(p, d.mainboard, n);
                var l = 2 * h,
                    m = 8192 * l;
                d.memoryMapper.setPrgData(create32IntArray(b.subarray(e, e + m), m), l);
                e += m;
                var m = 8 * k,
                    q = 1024 * m;
                d.memoryMapper.setChrData(create32IntArray(b.subarray(e,
                    e + q), q), m);
                e += q;
                d._determineColourEncodingType(a);
                setColourEncodingType(d._colourEncodingType);
                l *= 8;
                console.log("Cartridge '" + a + "' loaded. Mapper " + p + ", " + Nes.mirroringMethodToString(n) + " mirroring, " + l + "kb PRG, " + m + "kb CHR");
                console.log("Encoding: " + d._colourEncodingType);
                c()
            } catch (v) {
                c(v)
            }
        })
    } catch (q) {
        c(q)
    }
};
cartridge.prototype.reset = function() {
    this.memoryMapper.reset()
};
Nes.cartridge = cartridge;
this.Nes = this.Nes || {};
"use strict";
for (var g_ClearScreenArray = new Int32Array(SCREEN_WIDTH * SCREEN_HEIGHT), ii = 0; ii < g_ClearScreenArray.length; ++ii) g_ClearScreenArray[ii] = 0;
var renderbuffer = function(a, b) {
    this._mainboard = a;
    this._renderSurface = b;
    var c = [8421504, 10894592, 11538944, 9830468, 6160545, 2621639, 1722, 6028, 12124, 17680, 18949, 3032832, 6701312, 0, 328965, 328965, 13092807, 16742144, 16733473, 16398210, 11874283, 5253631, 8959, 13014, 25284, 32821, 36613, 5605888, 13408512, 2171169, 592137, 592137, 16777215, 16766735, 16753257, 16744660, 15943167, 9134591, 3377407, 1219839, 2145530, 975775, 3534891, 10809356, 16775941, 6184542, 855309, 855309, 16777215, 16776358, 16772275, 15444954, 16361727, 11774975, 11588351,
        10940415, 10287103, 9824471, 11529638, 14348962, 16580505, 14540253, 1118481, 1118481, 0
    ];
    this.defaultPalette32BitVals = new Uint32Array(c.length);
    for (var d = 0; d < c.length; ++d) this.defaultPalette32BitVals[d] = c[d];
    var e = this;
    this._clipTopAndBottomY = !1;
    this._mainboard.connect("reset", function(a) {
        e._reset(a)
    });
    this.priorityBuffer = new Int32Array(SCREEN_WIDTH * SCREEN_HEIGHT);
    this.clearBuffer()
};
renderbuffer.prototype._reset = function(a) {
    this._clipTopAndBottomY = "NTSC" === COLOUR_ENCODING_NAME
};
renderbuffer.prototype.clearBuffer = function() {
    this.priorityBuffer.set(g_ClearScreenArray)
};
renderbuffer.prototype.pickColour = function(a) {
    return this.defaultPalette32BitVals[64 > a ? a : 64]
};
renderbuffer.prototype._renderPixel = function(a, b, c, d) {
    this._clipTopAndBottomY && (8 > c || 231 < c) || (c = this.pickColour(d | 0), this._renderSurface.writeToBuffer(a, b, c))
};
renderbuffer.prototype.renderSpritePixelDebug = function(a, b, c) {};
renderbuffer.prototype.renderSpritePixel = function(a, b, c, d, e) {
    c = d * SCREEN_WIDTH + c;
    0 === this.priorityBuffer[c] && (this.priorityBuffer[c] = a + 1, this._renderPixel(b ? 0 : 2, c, d, e))
};
renderbuffer.prototype.renderPixel = function(a, b, c) {
    var d = !1,
        e = b * SCREEN_WIDTH + a;
    1 === this.priorityBuffer[e] && a < SCREEN_WIDTH - 1 && (d = !0);
    this._renderPixel(1, e, b, c);
    return d
};
renderbuffer.prototype.saveState = function() {
    return {
        priorityBuffer: Nes.uintArrayToString(this.priorityBuffer)
    }
};
renderbuffer.prototype.loadState = function(a) {
    this.priorityBuffer = Nes.stringToUintArray(a.priorityBuffer)
};
Nes.renderbuffer = renderbuffer;
this.Nes = this.Nes || {};
"use strict";
var mainboard = function(a) {
    var b = this;
    this.running = !1;
    this.cart = null;
    this._eventBus = new Nes.EventBus;
    this.memory = new Nes.memory(this);
    window.ppu = new Nes.ppu(this);
    this.ppu = window.ppu;
    this.apu = new Nes.ApuLegacy(this);
    this.inputdevicebus = new Nes.inputdevicebus;
    this.cpu = new Nes.cpu6502(this);
    this.renderBuffer = new Nes.renderbuffer(this, a);
    this.synchroniser = new Nes.synchroniser(this);
    this.synchroniser.connect("frameEnd", function() {
        b._onFrameEnd()
    });
    this.synchroniser.addObject("ppu", this.ppu);
    this.synchroniser.addObject("apu",
        this.apu);
    this.ppu.hookSyncEvents(this.synchroniser);
    this.enableSound(!0)
};
mainboard.prototype.connect = function(a, b) {
    this._eventBus.connect(a, b)
};
mainboard.prototype.enableSound = function(a) {
    this.apu.enableSound(a);
    this._eventBus.invoke("soundEnabled", this.apu.soundEnabled(), this.apu.soundSupported())
};
mainboard.prototype.setVolume = function(a) {
    this.apu.setVolume(a)
};
mainboard.prototype.setTraceOption = function(a, b) {
    a !== Nes.trace_all && a !== Nes.trace_cpuInstructions || this.cpu.enableTrace(b);
    Nes.Trace.enableType(a, b)
};
mainboard.prototype._onFrameEnd = function() {
    this.running = !1;
    this._eventBus.invoke("frameEnd")
};
mainboard.prototype.doFrame = function() {
    if (this.cart)
        for (this.running = !0; this.running;) this.synchroniser.runCycle()
};
mainboard.prototype.loadCartridge = function(a) {
    this.cart = a;
    this.synchroniser.addObject("mapper", this.cart.memoryMapper);
    this.reset(!0);
    this._eventBus.invoke("romLoaded", this.cart)
};
mainboard.prototype.powerButton = function(a) {
    (a = a && this.cart) ? this.reset(): (this.running = !1, this.cart = null);
    this._eventBus.invoke("power", a)
};
mainboard.prototype.reset = function(a) {
    a = void 0 === a ? !0 : a;
    this.cart && this.cart.reset(a);
    this._eventBus.invoke("reset", a)
};
mainboard.prototype.saveState = function() {
    var a = {};
    a.memory = this.memory.saveState();
    a.ppu = this.ppu.saveState();
    a.apu = this.apu.saveState();
    a.cpu = this.cpu.saveState();
    a.synchroniser = this.synchroniser.saveState();
    a.renderBuffer = this.renderBuffer.saveState();
    this.cart && this.cart.memoryMapper && (a.memoryMapper = this.cart.memoryMapper.saveState());
    return a
};
mainboard.prototype.loadState = function(a) {
    this.memory.loadState(a.memory);
    this.ppu.loadState(a.ppu);
    this.apu.loadState(a.apu);
    this.cpu.loadState(a.cpu);
    this.renderBuffer.loadState(a.renderBuffer);
    this.synchroniser.loadState(a.synchroniser);
    this.cart && this.cart.memoryMapper && this.cart.memoryMapper.loadState(a.memoryMapper)
};
Nes.mainboard = mainboard;
this.Gui = this.Gui || {};
var animateFunction;
(function() {
    var a = function() {
        var a = this;
        this._cart = null;
        this._romLoaded = !1;
        this._input = this._cpuInstructionsWindow = this._logWindow = this._paletteDisplay = this._spriteDisplay = this._fpsMeter = this._renderSurface = this._mainboard = null;
        this._encodingTypeToSet = "";
        this._newRomWaiting = !1;
        this._newRomLoaded = {
            name: "",
            binaryString: null
        };
        this._eventBus = new Nes.EventBus;
        this._lastFrameTime = this._frameTimeTarget = 0;
        this._gameSpeed = 100;
        this._isPaused = 0;
        this._pauseNextFrame = !1;
        this._pauseOnFrame = -1;
        this._options = {};
        window.onerror = function(c) {
            a._showError(c)
        }
    };
    a.prototype.connect = function(a, c) {
        this._eventBus.connect(a, c)
    };
    a.prototype.setColourEncodingType = function(a) {
        this._encodingTypeToSet = a
    };
    a.prototype._loadRomCallback = function(a, c) {
        this._newRomWaiting = !0;
        this._newRomLoaded = {
            name: a,
            binaryString: c
        }
    };
    a.prototype.start = function(a) {
        this._options = a || {};
        this._options.triggerFrameRenderedEvent = void 0 === this._options.triggerFrameRenderedEvent ? !1 : this._options.triggerFrameRenderedEvent;
        this._options.createGuiComponents =
            void 0 === this._options.createGuiComponents ? !0 : this._options.createGuiComponents;
        var c = this;
        this._options.createGuiComponents ? (window.addEventListener("contextmenu", function(a) {
            a.preventDefault()
        }, !1), this._fpsMeter = new FPSMeter(null, {
            top: "10%",
            left: "80%"
        }), this._fpsMeter.hide(), Gui.hookDragDropEvents(function(a, b) {
            c._loadRomCallback(a, b)
        }), this._canvasParent = new Gui.CanvasParent, this._renderSurface = null, WebGl.webGlSupported() ? (console.log("Using WebGL for rendering..."), this._renderSurface = new Gui.WebGlRenderSurface(this._canvasParent),
            $("#postProcessingDiv").css("display", "block")) : (console.log("WebGL not supported. Using canvas for rendering..."), this._renderSurface = new Gui.CanvasRenderSurface(this._canvasParent))) : this._renderSurface = new Test.TestRenderSurface;
        this._mainboard = new Nes.mainboard(this._renderSurface);
        this._mainboard.connect("reset", function() {
            c._onReset()
        });
        this._options.createGuiComponents && (this._ggDialog = new Gui.GameGenieDialog(this), this._controlBar = new Gui.ControlBar(this), this._controlBar.connect("romLoaded",
            function(a, b) {
                c._loadRomCallback(a, b)
            }), this._input = new Gui.Input(this._mainboard), this._keyboardRemapDialog = new Gui.KeyboardRemapper(this));
        this._saveStateManager = new Gui.SaveStateManager(this, this._options.createGuiComponents);
        window.setFastTimeout(animateFunction);
        this._options.loadUrl && this.loadRomFromUrl(this._options.loadUrl);
        this._animate()
    };
    a.prototype.pause = function(a) {
        var c = !1;
        a ? (c = 0 === this._isPaused, this._isPaused = 1) : (c = 1 === this._isPaused, this._isPaused = 0);
        c && this._eventBus.invoke("isPausedChange",
            this.isPaused())
    };
    a.prototype.isPaused = function() {
        return 0 < this._isPaused
    };
    a.prototype._onReset = function() {
        this._calculateFrameTimeTarget()
    };
    a.prototype._calculateFrameTimeTarget = function() {
        0 < this._gameSpeed && (this._frameTimeTarget = 1E5 / this._gameSpeed / COLOUR_ENCODING_REFRESHRATE)
    };
    a.prototype.reset = function() {
        this._mainboard.reset()
    };
    a.prototype.playOneFrame = function() {
        this.pause(!1);
        this._pauseNextFrame = !0
    };
    a.prototype.playUntilFrame = function(a) {
        this.pause(!1);
        this._pauseOnFrame = a
    };
    a.prototype.enableSound =
        function(a) {
            this._mainboard.enableSound(a)
        };
    a.prototype.soundEnabled = function() {
        return this._mainboard.apu.soundEnabled()
    };
    a.prototype.soundSupported = function() {
        return this._mainboard.apu.soundSupported()
    };
    a.prototype.setVolume = function(a) {
        this._mainboard.setVolume(a)
    };
    a.prototype.setGameSpeed = function(a) {
        this._gameSpeed = a;
        this._calculateFrameTimeTarget()
    };
    a.prototype.setTraceOption = function(a, c) {
        this._mainboard.setTraceOption(a, c)
    };
    a.prototype._readyToRender = function() {
        if (0 >= this._gameSpeed) return !0;
        var a = performance ? performance.now() : Date.now();
        return a - this._lastFrameTime >= this._frameTimeTarget ? (this._lastFrameTime = a, !0) : !1
    };
    a.prototype.showFpsMeter = function(a) {
        a ? this._fpsMeter.show() : this._fpsMeter.hide()
    };
    a.prototype.startTrace = function() {
        this._eventBus.invoke("traceRunning", !0);
        this._mainboard.cpu.enableTrace(!0);
        Nes.Trace.start()
    };
    a.prototype.stopTrace = function() {
        Nes.Trace.stop();
        this._mainboard.cpu.enableTrace(!1);
        this._eventBus.invoke("traceRunning", !1)
    };
    a.prototype.screenshot = function() {
        this._renderSurface.screenshotToFile()
    };
    a.prototype._animate = function() {
        this._newRomWaiting && (this._doRomLoad(this._newRomLoaded.name, this._newRomLoaded.binaryString), this._newRomWaiting = !1);
        this._romLoaded && (this._romLoaded = !1, this._mainboard.loadCartridge(this._cart), this._eventBus.invoke("cartLoaded", this._cart));
        0 < this._encodingTypeToSet.length && (setColourEncodingType(this._encodingTypeToSet), this._encodingTypeToSet = "");
        if (0 >= this._isPaused) {
            if (this._readyToRender()) {
                this._input && this._input.poll();
                var a = this._mainboard.renderBuffer.pickColour(this._mainboard.ppu.getBackgroundPaletteIndex());
                this._renderSurface.clearBuffers(a);
                this._mainboard.renderBuffer.clearBuffer();
                this._mainboard.doFrame();
                this._renderSurface.render(this._mainboard);
                this._options.triggerFrameRenderedEvent && this._eventBus.invoke("frameRendered", this._renderSurface, this._mainboard.ppu.frameCounter);
                this._fpsMeter && this._fpsMeter.tick()
            }
            this._pauseNextFrame && (this._pauseNextFrame = !1, this.pause(!0));
            0 <= this._pauseOnFrame && this._pauseOnFrame === this._mainboard.ppu.frameCounter && (this._pauseOnFrame = -1, this.pause(!0));
            this._saveStateManager.onFrame();
            setImmediate(animateFunction)
        } else setTimeout(animateFunction, 300)
    };
    a.prototype._doRomLoad = function(a, c) {
        var d = this;
        this._cart = new Nes.cartridge(this._mainboard);
        this._cart.loadRom(a, c, function(a) {
            a ? d._showError(a) : d._romLoaded = !0
        })
    };
    a.prototype.loadRomFromUrl = function(a) {
        var c = this;
        Nes.loadRomFromUrl(a, function(a, b, f) {
            a ? c._showError(a) : c._loadRomCallback(b, f)
        })
    };
    a.prototype._showError = function(a) {
        console.log(a);
        var c = typeof a,
            d = "",
            d = "string" === c ? a : "object" === c ? a.message ? a.message : a.toString() : a.toString();
        this._eventBus.invoke("romLoadFailure", d)
    };
    a.prototype.gameGenieCode = function(a) {
        Nes.processGameGenieCode(this._mainboard, a, !0)
    };
    a.prototype.loadShaderFromUrl = function(a) {
        this._renderSurface.loadShaderFromUrl && this._renderSurface.loadShaderFromUrl(a)
    };
    Gui.App = new a
})();
animateFunction = function() {
    Gui.App._animate()
};
this.Gui = this.Gui || {};
(function() {
    var a = function(a, c) {
        this._app = a;
        this._mainboard = this._app._mainboard;
        this._renderSurface = this._app._renderSurface;
        this._loadPending = "";
        this._saveStatePending = this._loadStatePending = !1;
        c && (this._lsDialog = new Gui.LoadStateDialog(a))
    };
    a.prototype.quickSaveState = function() {
        this._saveStatePending = !0
    };
    a.prototype.quickLoadState = function() {
        this.loadState("quicksave")
    };
    a.prototype.loadState = function(a) {
        this._loadPending = a;
        this._loadStatePending = !0
    };
    a.prototype._doQuickSave = function() {
        var a = this._mainboard.cart.getHash();
        Gui.renameQuickSaveStates("quicksave", a, 3);
        var c = this._renderSurface.screenshotToString(),
            d = this._mainboard.saveState();
        Gui.saveState("quicksave", a, d, c)
    };
    a.prototype._doQuickLoad = function() {
        var a = Gui.loadState(this._loadPending, this._mainboard.cart.getHash());
        a && this._mainboard.loadState(a)
    };
    a.prototype.showLoadStateDialog = function() {
        var a = this._mainboard.cart.getHash(),
            c = Gui.getStateMetaData(a, !0);
        this._lsDialog.show(a, c)
    };
    a.prototype.onFrame = function() {
        this._mainboard.cart && (this._saveStatePending ?
            (this._saveStatePending = !1, this._doQuickSave()) : this._loadStatePending && (this._loadStatePending = !1, this._doQuickLoad()))
    };
    Gui.SaveStateManager = a
})();
this.Gui = this.Gui || {};

function getParameterByName(a) {
    a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    a = (new RegExp("[\\?&]" + a + "=([^&#]*)")).exec(location.search);
    return null == a ? "" : decodeURIComponent(a[1].replace(/\+/g, " "))
}
window.onload = function() {
    //load selected rom file
    Gui.App.loadRomFromUrl(window.parent.nesromurl);
    
    var a = $("#loadGameComboBox");
    a && a.change(function() {
        var a = $(this).val();
        0 < a.length && (console.log("Loading ROM " + a), Gui.App.loadRomFromUrl(a))
    });
    (a = $("#shaderListComboBox")) && a.change(function() {
        var a = $(this).val();
        0 < a.length ? (console.log("Loading shader " + a), Gui.App.loadShaderFromUrl(a)) : Gui.App.loadShaderFromUrl(null)
    });
    a = getParameterByName("gameUrl");
    Gui.App.start({
        createGuiComponents: !0,
        loadUrl: a
    })
};