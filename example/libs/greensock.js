/* !
 * VERSION: 0.2.1
 * DATE: 2017-01-17
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2017, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 *
 * @author: Jack Doyle, jack@greensock.com
 **/
const _gsScope = typeof module !== 'undefined' && module.exports && typeof global !== 'undefined' ? global : this || window;

(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function ()
{
    _gsScope._gsDefine('easing.CustomEase', ['easing.Ease'], function (a)
{
        var b = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
            c = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
            d = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/gi,
            e = /[cLlsS]/g,
            f = 'CustomEase only accepts Cubic Bezier data.',
            g = function (a, b, c, d, e, f, h, i, j, k, l)
{
                let m,
                    n = (a + c) / 2,
                    o = (b + d) / 2,
                    p = (c + e) / 2,
                    q = (d + f) / 2,
                    r = (e + h) / 2,
                    s = (f + i) / 2,
                    t = (n + p) / 2,
                    u = (o + q) / 2,
                    v = (p + r) / 2,
                    w = (q + s) / 2,
                    x = (t + v) / 2,
                    y = (u + w) / 2,
                    z = h - a,
                    A = i - b,
                    B = Math.abs((c - h) * A - (d - i) * z),
                    C = Math.abs((e - h) * A - (f - i) * z);

                return k || (k = [{ x: a, y: b }, { x: h, y: i }], l = 1), k.splice(l || k.length - 1, 0, { x, y }), (B + C) * (B + C) > j * (z * z + A * A) && (m = k.length, g(a, b, n, o, t, u, x, y, j, k, l), g(x, y, v, w, r, s, h, i, j, k, l + 1 + (k.length - m))), k;
            },
            h = function (a)
{
                let b,
                    e,
                    g,
                    h,
                    i,
                    j,
                    k,
                    l,
                    m,
                    n,
                    o,
                    p = (`${a}`).replace(d, function (a)
{
                        const b = Number(a);

                        return b < 1e-4 && b > -1e-4 ? 0 : b;
                    }).match(c) || [],
                    q = [],
                    r = 0,
                    s = 0,
                    t = p.length,
                    u = 2;

                for (b = 0; t > b; b++) if (m = h, isNaN(p[b]) ? (h = p[b].toUpperCase(), i = h !== p[b]) : b--, e = Number(p[b + 1]), g = Number(p[b + 2]), i && (e += r, g += s), b || (k = e, l = g), h === 'M')j && j.length < 8 && (q.length -= 1, u = 0), r = k = e, s = l = g, j = [e, g], u = 2, q.push(j), b += 2, h = 'L'; else if (h === 'C')j || (j = [0, 0]), j[u++] = e, j[u++] = g, i || (r = s = 0), j[u++] = r + Number(p[b + 3]), j[u++] = s + Number(p[b + 4]), j[u++] = r += Number(p[b + 5]), j[u++] = s += Number(p[b + 6]), b += 6; else if (h === 'S')m === 'C' || m === 'S' ? (n = r - j[u - 4], o = s - j[u - 3], j[u++] = r + n, j[u++] = s + o) : (j[u++] = r, j[u++] = s), j[u++] = e, j[u++] = g, i || (r = s = 0), j[u++] = r += Number(p[b + 3]), j[u++] = s += Number(p[b + 4]), b += 4; else { if (h !== 'L' && h !== 'Z') throw f; h === 'Z' && (e = k, g = l, j.closed = !0), (h === 'L' || Math.abs(r - e) > 0.5 || Math.abs(s - g) > 0.5) && (j[u++] = r + (e - r) / 3, j[u++] = s + (g - s) / 3, j[u++] = r + 2 * (e - r) / 3, j[u++] = s + 2 * (g - s) / 3, j[u++] = e, j[u++] = g, h === 'L' && (b += 2)), r = e, s = g; }

                return q[0];
            },
            i = function (a)
{
                let b,
                    c = a.length,
                    d = 999999999999;

                for (b = 1; c > b; b += 6)Number(a[b]) < d && (d = Number(a[b]));

                return d;
            },
            j = function (a, b, c)
{
                c || c === 0 || (c = Math.max(Number(a[a.length - 1]), Number(a[1]))); let d,
                    e = -1 * Number(a[0]),
                    f = -c,
                    g = a.length,
                    h = 1 / (Number(a[g - 2]) + e),
                    j = -b || (Math.abs(Number(a[g - 1]) - Number(a[1])) < 0.01 * (Number(a[g - 2]) - Number(a[0])) ? i(a) + f : Number(a[g - 1]) + f);

                for (j = j ? 1 / j : -h, d = 0; g > d; d += 2)a[d] = (Number(a[d]) + e) * h, a[d + 1] = (Number(a[d + 1]) + f) * j;
            },
            k = function (a)
{
                let b = this.lookup[a * this.l | 0] || this.lookup[this.l - 1];

                return b.nx < a && (b = b.n), b.y + (a - b.x) / b.cx * b.cy;
            },
            l = function (b, c, d) { this._calcEnd = !0, this.id = b, b && (a.map[b] = this), this.getRatio = k, this.setData(c, d); },
            m = l.prototype = new a();

        return m.constructor = l, m.setData = function (a, c)
{
            a = a || '0,0,1,1'; let d,
                i,
                k,
                l,
                m,
                n,
                o,
                p,
                q,
                r,
                s = a.match(b),
                t = 1,
                u = [];

            if (c = c || {}, r = c.precision || 1, this.data = a, this.lookup = [], this.points = u, this.fast = r <= 1, (e.test(a) || a.indexOf('M') !== -1 && a.indexOf('C') === -1) && (s = h(a)), d = s.length, d === 4)s.unshift(0, 0), s.push(1, 1), d = 8; else if ((d - 2) % 6) throw f; for ((Number(s[0]) !== 0 || Number(s[d - 2]) !== 1) && j(s, c.height, c.originY), this.rawBezier = s, l = 2; d > l; l += 6)i = { x: Number(s[l - 2]), y: Number(s[l - 1]) }, k = { x: Number(s[l + 4]), y: Number(s[l + 5]) }, u.push(i, k), g(i.x, i.y, Number(s[l]), Number(s[l + 1]), Number(s[l + 2]), Number(s[l + 3]), k.x, k.y, 1 / (2e5 * r), u, u.length - 1); for (d = u.length, l = 0; d > l; l++)o = u[l], p = u[l - 1] || o, o.x > p.x || p.y !== o.y && p.x === o.x || o === p ? (p.cx = o.x - p.x, p.cy = o.y - p.y, p.n = o, p.nx = o.x, this.fast && l > 1 && Math.abs(p.cy / p.cx - u[l - 2].cy / u[l - 2].cx) > 2 && (this.fast = !1), p.cx < t && (p.cx ? t = p.cx : (p.cx = 0.001, l === d - 1 && (p.x -= 0.001, t = Math.min(t, 0.001), this.fast = !1)))) : (u.splice(l--, 1), d--); if (d = 1 / t + 1 | 0, this.l = d, m = 1 / d, n = 0, o = u[0], this.fast) { for (l = 0; d > l; l++)q = l * m, o.nx < q && (o = u[++n]), i = o.y + (q - o.x) / o.cx * o.cy, this.lookup[l] = { x: q, cx: m, y: i, cy: 0, nx: 9 }, l && (this.lookup[l - 1].cy = i - this.lookup[l - 1].y); this.lookup[d - 1].cy = u[u.length - 1].y - i; }
            else { for (l = 0; d > l; l++)o.nx < l * m && (o = u[++n]), this.lookup[l] = o; n < u.length - 1 && (this.lookup[l - 1] = u[u.length - 2]); }

            return this._calcEnd = u[u.length - 1].y !== 1 || u[0].y !== 0, this;
        }, m.getRatio = k, m.getSVGData = function (a) { return l.getSVGData(this, a); }, l.create = function (a, b, c) { return new l(a, b, c); }, l.version = '0.2.1', l.bezierToPoints = g, l.get = function (b) { return a.map[b]; }, l.getSVGData = function (b, c)
{
            c = c || {}; let d,
                e,
                f,
                g,
                h,
                i,
                j,
                k,
                l,
                m,
                n = 1e3,
                o = c.width || 100,
                p = c.height || 100,
                q = c.x || 0,
                r = (c.y || 0) + p,
                s = c.path;

            if (c.invert && (p = -p, r = 0), b = b.getRatio ? b : a.map[b] || console.log('No ease found: ', b), b.rawBezier) { for (d = [], j = b.rawBezier.length, f = 0; j > f; f += 2)d.push(`${((q + b.rawBezier[f] * o) * n | 0) / n},${((r + b.rawBezier[f + 1] * -p) * n | 0) / n}`); d[0] = `M${d[0]}`, d[1] = `C${d[1]}`; }
            else for (d = [`M${q},${r}`], j = Math.max(5, 200 * (c.precision || 1)), g = 1 / j, j += 2, k = 5 / j, l = ((q + g * o) * n | 0) / n, m = ((r + b.getRatio(g) * -p) * n | 0) / n, e = (m - r) / (l - q), f = 2; j > f; f++)h = ((q + f * g * o) * n | 0) / n, i = ((r + b.getRatio(f * g) * -p) * n | 0) / n, (Math.abs((i - m) / (h - l) - e) > k || f === j - 1) && (d.push(`${l},${m}`), e = (i - m) / (h - l)), l = h, m = i;

            return s && (typeof s === 'string' ? document.querySelector(s) : s).setAttribute('d', d.join(' ')), d.join(' ');
        }, l;
    }, !0);
}), _gsScope._gsDefine && _gsScope._gsQueue.pop()(), (function (a)
{
    const b = function () { return (_gsScope.GreenSockGlobals || _gsScope)[a]; };

    typeof define === 'function' && define.amd ? define(['TweenLite'], b) : typeof module !== 'undefined' && module.exports && (require('../TweenLite.js'), module.exports = b());
})('CustomEase');
