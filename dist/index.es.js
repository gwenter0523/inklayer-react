import { jsxs as T, Fragment as ve, jsx as c } from "react/jsx-runtime";
import Pt, { useRef as B, useState as Y, useCallback as X, useEffect as ne, createContext as nn, useContext as Gt, memo as So, useMemo as ke, forwardRef as on, useImperativeHandle as Dn, useLayoutEffect as Qe, useSyncExternalStore as vr, useId as yr, createElement as br } from "react";
import * as Sr from "pdfjs-dist/legacy/build/pdf.mjs";
import { AnnotationMode as wr, AnnotationEditorType as Cr, getDocument as un, PDFDataRangeTransport as xr } from "pdfjs-dist/legacy/build/pdf.mjs";
import { EventBus as Tr, PDFLinkService as Ar, DownloadManager as kr, PDFFindController as Er, PDFViewer as Rr } from "pdfjs-dist/legacy/web/pdf_viewer.mjs";
import "pdfjs-dist/legacy/web/pdf_viewer.css";
import { useThemeContext as rn, Flex as Q, Spinner as wo, Box as lt, Text as de, Progress as Pr, Callout as dt, Strong as Nr, IconButton as tt, TextField as kt, Tabs as At, Tooltip as Rt, Button as be, Popover as Ae, Card as Ir, Grid as $t, Separator as nt, Slider as Fn, HoverCard as hn, DropdownMenu as me, Dialog as ct, SegmentedControl as gt, Select as Re, CheckboxGroup as bt, TextArea as Mr, Badge as Dr, Checkbox as Xt, Theme as Co } from "@radix-ui/themes";
import { useTranslation as ye, initReactI18next as Lr } from "react-i18next";
import { AiOutlineWarning as _r, AiOutlineLeft as xo, AiOutlineRight as To, AiOutlineArrowLeft as Or, AiOutlineLine as Hr, AiOutlinePlus as Gr, AiOutlinePlusCircle as Ao, AiOutlineImport as ko, AiOutlineExclamationCircle as Ur, AiOutlineBold as zr, AiOutlineItalic as Fr, AiOutlineUnderline as jr, AiOutlineStrikethrough as Br, AiOutlineExclamation as Wr, AiOutlineEllipsis as jn, AiOutlineFilter as Vr, AiOutlineMinusSquare as $r, AiOutlineStop as Yr, AiOutlineCheckCircle as Kr, AiOutlineMinusCircle as Xr, AiOutlineDislike as qr, AiOutlineLike as Jr, AiOutlineSearch as Ln, AiFillCloseCircle as Zr, AiOutlineSave as Qr, AiOutlinePrinter as ei } from "react-icons/ai";
import { PDFDocument as _n, PDFName as z, PDFHexString as Eo, PDFArray as Ro, PDFDict as xn, PDFString as ie, PDFRef as ti, PDFNumber as ee, PDFRawStream as ni } from "pdf-lib";
import { GoSidebarExpand as oi, GoSidebarCollapse as ri } from "react-icons/go";
import M from "konva";
import { nanoid as ii } from "nanoid";
import Te, { t as Se } from "i18next";
import { computePosition as Yt, flip as Po } from "@floating-ui/dom";
import { create as si } from "zustand";
import ai from "web-highlighter";
import { HexColorPicker as ci } from "react-colorful";
import No from "dayjs";
import li from "dayjs/plugin/customParseFormat.js";
import { saveAs as Io } from "file-saver";
import { createPortal as di } from "react-dom";
const ui = new URL("pdf.worker.min.mjs", import.meta.url).href;
Sr.GlobalWorkerOptions.workerSrc = ui;
function hi(n) {
  if (!(n instanceof Error)) return !1;
  const e = n.message.toLowerCase();
  return e.includes("range") || e.includes("content-length") || e.includes("unexpected server response") || e.includes("cors");
}
function pi(n) {
  if (n === void 0 || typeof n == "string" || Array.isArray(n)) return n;
  if (n instanceof ArrayBuffer) return n.slice(0);
  if (ArrayBuffer.isView(n)) {
    const e = new Uint8Array(n.byteLength);
    return e.set(new Uint8Array(n.buffer, n.byteOffset, n.byteLength)), e;
  }
  return n;
}
function fi(n, e) {
  const {
    url: t,
    data: o,
    enableRange: r = "auto",
    onLoadSuccess: s,
    onLoadError: i,
    onLoadEnd: a,
    onViewerInit: l,
    eventBus: u,
    textLayerMode: d = 1,
    annotationMode: h = wr.DISABLE,
    externalLinkTarget: p = 2,
    pdfjsOptions: g
  } = e, f = B(s), S = B(i), m = B(a), v = B(l);
  f.current = s, S.current = i, m.current = a, v.current = l;
  const b = B(null), w = B(null), x = B(null), E = B(null), I = B(0), [P, W] = Y(!0), [F, D] = Y(0), [A, L] = Y(null), [$, j] = Y(null), [_, O] = Y(null), Z = X(() => {
    if (E.current && (E.current(), E.current = null), !n.current) throw new Error("PDF container not ready");
    const N = u || new Tr();
    x.current = N;
    const q = new Ar({ eventBus: N, externalLinkTarget: p }), te = new kr(), se = new Er({ linkService: q, eventBus: N }), G = new Rr({
      container: n.current,
      eventBus: N,
      textLayerMode: d,
      annotationMode: h,
      annotationEditorMode: Cr.DISABLE,
      linkService: q,
      downloadManager: te,
      findController: se
    });
    return q.setViewer(G), b.current = G, w.current = q, E.current = () => {
      b.current && (b.current.cleanup(), b.current = null), w.current && (w.current = null), !u && x.current && (x.current = null);
    }, v.current?.(G), { bus: N, linkService: q, viewer: G };
  }, [n, u, d, h, p]), K = X(async (N) => {
    const q = await fetch(N, { method: "HEAD" }), te = Number(q.headers.get("Content-Length"));
    if (isNaN(te)) throw new Error("Cannot get PDF length for range loading");
    class se extends xr {
      async requestDataRange(J, ce) {
        const xe = await (await fetch(N, { headers: { Range: `bytes=${J}-${ce - 1}` } })).arrayBuffer();
        this.onDataRange(J, new Uint8Array(xe));
      }
    }
    return new se(te, null);
  }, []), k = X(
    async (N) => {
      if (o)
        return un({
          ...g,
          // PDF.js transfers the input buffer to its worker. Keep
          // the caller-owned bytes reusable when a viewer reloads
          // (for example after a text-layer mode change).
          data: pi(o),
          disableRange: !0,
          disableStream: !0
        });
      if (t && N) {
        const q = await K(t);
        return un({ ...g, range: q });
      } else {
        if (t)
          return un({ ...g, url: t, disableRange: !0, disableStream: !0 });
        throw new Error("Either url or data must be provided");
      }
    },
    [t, K, o, g]
  ), H = B(null), oe = X(async () => {
    const N = I.current + 1;
    I.current = N;
    const q = () => I.current === N;
    if (!t && !o) {
      const J = new Error("Either url or data must be provided");
      q() && (O(J), W(!1), S.current?.(J), m.current?.());
      return;
    }
    W(!0), D(0), O(null), L(null);
    let te = !1, se = null, G = null;
    try {
      G = Z();
      const { linkService: J, viewer: ce } = G;
      if (r === !0 || r === "auto" ? (te = !0, se = await k(!0)) : se = await k(!1), !q()) {
        await se.destroy();
        return;
      }
      H.current = se, se.onProgress = ({ loaded: Ve, total: He }) => {
        q() && He > 0 && D(Math.min(100, Math.round(Ve / He * 100)));
      };
      const xe = await se.promise;
      if (!q()) {
        await xe.destroy();
        return;
      }
      L(xe), J.setDocument(xe), ce.setDocument(xe);
      const Je = await xe.getMetadata();
      if (!q()) return;
      j(Je), f.current?.(xe);
    } catch (J) {
      if (!q()) return;
      if (r === "auto" && te && hi(J)) {
        console.warn("[PDF] Range failed, fallback to full loading"), await se?.destroy(), H.current === se && (H.current = null);
        try {
          if (!G)
            throw new Error("PDF viewer was not initialized");
          const ce = await k(!1);
          if (se = ce, !q()) {
            await ce.destroy();
            return;
          }
          H.current = ce, ce.onProgress = ({ loaded: He, total: je }) => {
            q() && je > 0 && D(Math.min(100, Math.round(He / je * 100)));
          };
          const fe = await ce.promise;
          if (!q()) {
            await fe.destroy();
            return;
          }
          const { linkService: xe, viewer: Je } = G;
          L(fe), xe.setDocument(fe), Je.setDocument(fe);
          const Ve = await fe.getMetadata();
          if (!q()) return;
          j(Ve), f.current?.(fe);
          return;
        } catch (ce) {
          if (!q()) return;
          O(ce), S.current?.(ce);
          return;
        }
      }
      O(J), S.current?.(J);
    } finally {
      q() && (W(!1), m.current?.());
    }
  }, [t, o, r, Z, k]);
  return ne(() => (oe(), () => {
    I.current += 1, E.current && (E.current(), E.current = null), H.current && (H.current.destroy(), H.current = null);
  }), [oe]), {
    /** 是否加载中 */
    loading: P,
    /** 加载进度 */
    progress: F,
    /** PDF 文档对象 */
    pdfDocument: A,
    /** PDFViewer 实例 */
    pdfViewer: b.current,
    /** EventBus 引用 */
    eventBus: x.current,
    /** PDF 元数据 */
    metadata: $,
    /** 加载错误 */
    loadError: _
  };
}
const Mo = nn(null), Fe = () => {
  const n = Gt(Mo);
  if (!n)
    throw new Error("usePdfViewerContext must be used within a PdfViewerProvider");
  return n;
}, On = nn(null), Do = () => {
  const n = Gt(On);
  if (!n)
    throw new Error("useUserContext must be used within a UserProvider");
  return n;
}, gi = "_InkLayerViewer_1ief7_1", mi = "_viewerHeader_1ief7_91", vi = "_viewerBody_1ief7_130", yi = "_navigationSidebarTriggerIcon_1ief7_136", bi = "_viewerWrapper_1ief7_142", Si = "_viewerContainer_1ief7_150", wi = "_pdfjsViewerContainer_1ief7_167", Ci = "_viewerSidebar_1ief7_197", xi = "_sidebarOverlay_1ief7_225", Ie = {
  InkLayerViewer: gi,
  viewerHeader: mi,
  "viewerHeader-title": "_viewerHeader-title_1ief7_102",
  "viewerHeader-title-left": "_viewerHeader-title-left_1ief7_109",
  "viewerHeader-title-name": "_viewerHeader-title-name_1ief7_115",
  "viewerHeader-title-actions": "_viewerHeader-title-actions_1ief7_124",
  viewerBody: vi,
  navigationSidebarTriggerIcon: yi,
  viewerWrapper: bi,
  viewerContainer: Si,
  "viewerContainer-header": "_viewerContainer-header_1ief7_156",
  pdfjsViewerContainer: wi,
  viewerSidebar: Ci,
  "viewerSidebar--hidden": "_viewerSidebar--hidden_1ief7_209",
  "viewerSidebar-container": "_viewerSidebar-container_1ief7_215",
  sidebarOverlay: xi
};
function Ti(n, e) {
  const [t, o] = Y(!1), r = B(null);
  return ne(() => (n ? r.current = setTimeout(() => {
    o(!0);
  }, e) : (r.current && (clearTimeout(r.current), r.current = null), o(!1)), () => {
    r.current && (clearTimeout(r.current), r.current = null);
  }), [n, e]), t;
}
function Ai(n, e) {
  const [t, o] = Y(!1), [r, s] = Y(n), i = B(null), a = B(n);
  return ne(() => {
    n !== a.current && (a.current = n, s(n), t || o(!0), i.current && clearTimeout(i.current), i.current = setTimeout(() => {
      o(!1), i.current = null;
    }, e));
  }, [n, e, t]), {
    visible: t,
    value: r
  };
}
const ki = ({ loading: n, progress: e, loadingDelay: t = 500, progressHideDelay: o = 1500 }) => {
  const r = Ti(n, t), s = Ai(e, o), { t: i } = ye(["common"]), { appearance: a } = rn();
  return /* @__PURE__ */ T(ve, { children: [
    r && /* @__PURE__ */ T(
      Q,
      {
        position: "absolute",
        inset: "0",
        align: "center",
        justify: "center",
        direction: "column",
        style: {
          backgroundColor: a === "dark" ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(2px)",
          zIndex: 1e3
        },
        children: [
          /* @__PURE__ */ c(wo, { size: "3" }),
          /* @__PURE__ */ c(lt, { mt: "4", children: /* @__PURE__ */ T(de, { weight: "medium", style: { fontSize: "1.1em" }, children: [
            i("common:loading"),
            " ",
            e,
            "%"
          ] }) })
        ]
      }
    ),
    s.visible && /* @__PURE__ */ c(
      Pr,
      {
        value: Math.min(s.value, 100),
        size: "1",
        variant: a === "dark" ? "surface" : "soft",
        style: {
          position: "absolute",
          opacity: a === "dark" ? 1 : 0.5,
          height: a === "dark" ? "3px" : "2px",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1100
        }
      }
    )
  ] });
}, Ei = ({ error: n }) => {
  const { t: e } = ye(["common"]);
  return /* @__PURE__ */ c(
    Q,
    {
      position: "absolute",
      inset: "0",
      style: { backgroundColor: "rgba(255, 255, 255, 0.9)", zIndex: 1e3 },
      align: "center",
      justify: "center",
      direction: "column",
      p: "4",
      children: /* @__PURE__ */ T(dt.Root, { color: "red", size: "3", children: [
        /* @__PURE__ */ c(dt.Icon, { children: /* @__PURE__ */ c(_r, {}) }),
        /* @__PURE__ */ T(dt.Text, { children: [
          /* @__PURE__ */ c(de, { children: /* @__PURE__ */ T(Nr, { children: [
            e("common:error"),
            " ",
            n.name
          ] }) }),
          /* @__PURE__ */ c("br", {}),
          /* @__PURE__ */ c(de, { children: n.message })
        ] })
      ] })
    }
  );
}, Ri = 3e3, Lo = ({ persistent: n = !1 }) => {
  const { t: e } = ye(["viewer"], { useSuspense: !1 }), { pdfViewer: t, isReady: o } = Fe(), [r, s] = Y(1), [i, a] = Y(1), [l, u] = Y("1"), [d, h] = Y(!1), [p, g] = Y(!1), [f, S] = Y(!0), m = B(null), v = B({
    hovered: !1,
    inputFocused: !1
  }), b = X(() => {
    m.current && (window.clearTimeout(m.current), m.current = null);
  }, []), w = X(() => {
    b(), !(v.current.hovered || v.current.inputFocused) && (m.current = window.setTimeout(() => {
      m.current = null, S(!1);
    }, Ri));
  }, [b]), x = X(() => {
    S(!0), n || w();
  }, [n, w]), E = X(() => {
    v.current.hovered = !0, b(), S(!0);
  }, [b]), I = X(() => {
    v.current.hovered = !1, w();
  }, [w]), P = X(() => {
    v.current.inputFocused = !0, b(), S(!0);
  }, [b]), W = X((k) => {
    k.currentTarget.select(), x();
  }, [x]), F = X((k) => {
    s(k), u(k.toString());
  }, []), D = X(
    (k) => !isNaN(k) && k >= 1 && k <= i,
    [i]
  ), A = X(
    (k) => {
      if (!(!t || !D(k))) {
        x(), h(!0);
        try {
          t.currentPageNumber = k, s(k), u(k.toString());
        } catch (H) {
          console.error("Error changing page:", H);
        } finally {
          h(!1);
        }
      }
    },
    [t, D, x]
  ), L = (k) => {
    x();
    const H = k.target.value;
    (H === "" || /^\d+$/.test(H)) && u(H);
  }, $ = X(() => {
    x();
    const k = parseInt(l, 10);
    D(k) ? A(k) : u(r.toString());
  }, [l, r, A, D, x]), j = X(() => {
    x(), r > 1 && A(r - 1);
  }, [r, A, x]), _ = X(() => {
    x(), r < i && A(r + 1);
  }, [r, i, A, x]);
  ne(() => {
    if (!t) return;
    const k = ({ pageNumber: H }) => {
      F(H), h(!1), x();
    };
    if (o) {
      const H = t.currentPageNumber || 1, oe = t.pagesCount || 1;
      s(H), u(H.toString()), a(oe), g(!0), x();
    }
    return t.eventBus.on("pagechanging", k), () => {
      t.eventBus.off("pagechanging", k);
    };
  }, [t, o, F, x]), ne(() => {
    n && (b(), S(!0));
  }, [b, n]), ne(() => {
    if (!t?.container) return;
    const k = t.container, H = () => {
      x();
    };
    return k.addEventListener("scroll", H, { passive: !0 }), k.addEventListener("wheel", H, { passive: !0 }), () => {
      k.removeEventListener("scroll", H), k.removeEventListener("wheel", H);
    };
  }, [t, x]), ne(() => b, [b]);
  const O = (k) => {
    k.key === "Enter" ? $() : k.key === "Escape" && u(r.toString());
  }, Z = () => {
    v.current.inputFocused = !1, $(), w();
  }, K = l === "" || D(parseInt(l, 10));
  return /* @__PURE__ */ c(
    lt,
    {
      position: n ? "static" : "absolute",
      bottom: "20px",
      left: "50%",
      "data-inklayer-page-indicator": "true",
      style: {
        transform: n ? void 0 : "translateX(-50%)",
        zIndex: 1e3,
        background: "var(--inklayer-page-indicator-background, rgba(60, 60, 60, 0.85))",
        color: "var(--inklayer-page-indicator-color, #fff)",
        borderRadius: "var(--inklayer-page-indicator-border-radius, 4px)",
        opacity: p && (n || f) ? 1 : 0,
        pointerEvents: p && (n || f) ? "auto" : "none",
        transition: "var(--inklayer-page-indicator-transition, opacity 0.3s ease)"
      },
      onMouseEnter: E,
      onMouseLeave: I,
      children: /* @__PURE__ */ T(Q, { gap: "2", align: "center", pt: "1", pl: "1", pr: "2", pb: "1", children: [
        /* @__PURE__ */ c(
          tt,
          {
            style: {
              color: `var(--inklayer-page-indicator-button-color, ${r <= 1 || d ? "#aaa" : "#fff"})`,
              transition: "var(--inklayer-page-indicator-button-transition, background-color 0.2s ease)",
              cursor: "pointer"
            },
            color: "gray",
            variant: "soft",
            onClick: j,
            size: "1",
            disabled: r <= 1 || d,
            "aria-label": e("viewer:navigation.previousPage"),
            children: /* @__PURE__ */ c(xo, {})
          }
        ),
        /* @__PURE__ */ T(Q, { align: "center", gap: "1", pr: "2", children: [
          /* @__PURE__ */ c(
            kt.Root,
            {
              size: "1",
              value: l,
              onChange: L,
              onFocus: P,
              onBlur: Z,
              onDoubleClick: W,
              onKeyDown: O,
              disabled: d,
              "aria-label": e("viewer:navigation.pageInput"),
              style: {
                width: "var(--inklayer-page-control-input-width, 30px)",
                fontWeight: "bold",
                textAlign: "right",
                color: "var(--inklayer-page-control-input-color, #fff)",
                paddingRight: 5,
                "--text-field-border-width": 0,
                backgroundColor: "var(--inklayer-page-control-input-background, transparent)",
                border: "var(--inklayer-page-control-input-border, none)",
                borderColor: K ? void 0 : "red"
              }
            }
          ),
          /* @__PURE__ */ T(
            de,
            {
              style: {
                minWidth: 30
              },
              size: "1",
              weight: "medium",
              children: [
                "/ ",
                i
              ]
            }
          )
        ] }),
        /* @__PURE__ */ c(
          tt,
          {
            color: "gray",
            variant: "ghost",
            disabled: r >= i || d,
            onClick: _,
            size: "1",
            "aria-label": e("viewer:navigation.nextPage"),
            style: {
              color: `var(--inklayer-page-indicator-button-color, ${r >= i || d ? "#aaa" : "#fff"})`,
              transition: "var(--inklayer-page-indicator-button-transition, background-color 0.2s ease)",
              cursor: "pointer"
            },
            children: /* @__PURE__ */ c(To, {})
          }
        )
      ] })
    }
  );
};
function Pi(n) {
  for (const e of n.getPages()) {
    const t = z.of("Annots");
    e.node.has(t) && e.node.set(t, n.context.obj([]));
  }
}
async function Bn(n, e = !1) {
  const t = await n.getData(), o = await _n.load(t);
  return e && Pi(o), o.save();
}
function _o(n) {
  const e = new ArrayBuffer(n.byteLength);
  return new Uint8Array(e).set(n), e;
}
function Ni(n, e) {
  const t = new Blob([_o(n)], { type: "application/pdf" }), o = document.createElement("a");
  o.href = URL.createObjectURL(t), o.download = e, o.click(), URL.revokeObjectURL(o.href);
}
function Ii(n) {
  const e = new Blob([_o(n)], { type: "application/pdf" }), t = URL.createObjectURL(e), o = document.createElement("iframe");
  o.style.position = "fixed", o.style.width = "0", o.style.height = "0", o.style.border = "none", o.src = t, document.body.appendChild(o), o.onload = () => {
    o.contentWindow?.focus(), o.contentWindow?.print(), setTimeout(() => {
      document.body.removeChild(o), URL.revokeObjectURL(t);
    }, 1e3);
  };
}
function Oo(n) {
  const e = X(
    async (o) => {
      if (!n) return;
      const r = await Bn(n, !0), s = o || `file_${Date.now()}.pdf`;
      Ni(r, s);
    },
    [n]
  ), t = X(async () => {
    if (!n) return;
    const o = await Bn(n, !0);
    Ii(o);
  }, [n]);
  return {
    downloadClean: e,
    printClean: t
  };
}
const Mi = (n, e, t) => {
  if (e === 1) return 1;
  const o = t.current;
  (o > 1 && e < 1 || o < 1 && e > 1) && (t.current = 1);
  const r = Math.floor(n * e * t.current * 100) / (100 * n);
  return t.current = e / r, r;
};
function Di({
  pdfViewer: n,
  containerRef: e,
  minScale: t = 0.1,
  maxScale: o = 10
}) {
  const r = B(1), s = B(1), i = B(!1), a = B(null), l = X((d, h, p) => {
    const g = e.current;
    if (!g || !n) return;
    const S = n.currentScale / d - 1;
    if (S === 0) return;
    const { left: m, top: v } = g.getBoundingClientRect();
    g.scrollLeft += (h - m) * S, g.scrollTop += (p - v) * S;
  }, [e, n]), u = X((d, h, p, g, f) => {
    const S = Mi(d, h, f);
    if (S === 1) return;
    let m = Math.round(d * S * 100) / 100;
    m = Math.min(o, Math.max(t, m)), !(!n || !n.pdfDocument) && (n.currentScale = m, l(d, p, g));
  }, [l, o, t, n]);
  ne(() => {
    const d = e.current;
    if (!d || !n) return;
    const h = (f) => {
      if (!f.ctrlKey && !f.metaKey) return;
      f.preventDefault();
      const S = Math.exp(-f.deltaY / 100), m = n.currentScale;
      u(
        m,
        S,
        f.clientX,
        f.clientY,
        r
      );
    }, p = (f) => {
      (f.key === "Control" || f.key === "Meta") && (i.current = !0);
    }, g = (f) => {
      (f.key === "Control" || f.key === "Meta") && (i.current = !1);
    };
    return d.addEventListener("wheel", h, { passive: !1 }), window.addEventListener("keydown", p), window.addEventListener("keyup", g), () => {
      d.removeEventListener("wheel", h), window.removeEventListener("keydown", p), window.removeEventListener("keyup", g);
    };
  }, [n, e, u]), ne(() => {
    const d = e.current;
    if (!d || !n) return;
    const h = (f) => {
      if (f.touches.length !== 2) {
        a.current = null;
        return;
      }
      f.preventDefault();
      let [S, m] = [f.touches[0], f.touches[1]];
      S.identifier > m.identifier && ([S, m] = [m, S]), a.current = {
        touch0X: S.pageX,
        touch0Y: S.pageY,
        touch1X: m.pageX,
        touch1Y: m.pageY
      };
    }, p = (f) => {
      const S = a.current;
      if (!S || f.touches.length !== 2) return;
      let [m, v] = [f.touches[0], f.touches[1]];
      m.identifier > v.identifier && ([m, v] = [v, m]);
      const { pageX: b, pageY: w } = m, { pageX: x, pageY: E } = v, {
        touch0X: I,
        touch0Y: P,
        touch1X: W,
        touch1Y: F
      } = S;
      if (Math.abs(I - b) <= 1 && Math.abs(P - w) <= 1 && Math.abs(W - x) <= 1 && Math.abs(F - E) <= 1)
        return;
      if (S.touch0X = b, S.touch0Y = w, S.touch1X = x, S.touch1Y = E, I === b && P === w) {
        const _ = W - b, O = F - w, Z = x - b, K = E - w, k = _ * K - O * Z;
        if (Math.abs(k) > 0.02 * Math.hypot(_, O) * Math.hypot(Z, K))
          return;
      } else if (W === x && F === E) {
        const _ = I - x, O = P - E, Z = b - x, K = w - E, k = _ * K - O * Z;
        if (Math.abs(k) > 0.02 * Math.hypot(_, O) * Math.hypot(Z, K))
          return;
      } else {
        const _ = b - I, O = x - W, Z = w - P, K = E - F;
        if (_ * O + Z * K >= 0) return;
      }
      f.preventDefault();
      const D = Math.hypot(b - x, w - E) || 1, A = Math.hypot(I - W, P - F) || 1, L = n.currentScale, $ = (m.clientX + v.clientX) / 2, j = (m.clientY + v.clientY) / 2;
      u(
        L,
        D / A,
        $,
        j,
        s
      );
    }, g = (f) => {
      a.current && (f.preventDefault(), a.current = null, s.current = 1);
    };
    return d.addEventListener("touchstart", h, {
      passive: !1
    }), d.addEventListener("touchmove", p, {
      passive: !1
    }), d.addEventListener("touchend", g, {
      passive: !1
    }), d.addEventListener("touchcancel", g), () => {
      d.removeEventListener("touchstart", h), d.removeEventListener("touchmove", p), d.removeEventListener("touchend", g), d.removeEventListener("touchcancel", g);
    };
  }, [n, e, u]);
}
const Li = "_thumbnailList_vmgds_1", _i = "_thumbnail_vmgds_1", Oi = "_thumbnailCanvasWrapper_vmgds_19", Hi = "_thumbnailCanvas_vmgds_19", Gi = "_thumbnailPlaceholder_vmgds_51", Ui = "_thumbnailError_vmgds_58", zi = "_thumbnailPageNumber_vmgds_71", Fi = "_thumbnailMarker_vmgds_93", ft = {
  thumbnailList: Li,
  thumbnail: _i,
  thumbnailCanvasWrapper: Oi,
  "thumbnail--selected": "_thumbnail--selected_vmgds_27",
  thumbnailCanvas: Hi,
  thumbnailPlaceholder: Gi,
  thumbnailError: Ui,
  thumbnailPageNumber: zi,
  thumbnailMarker: Fi
}, ji = 132, Bi = "320px 0px", Ho = So(({
  pdfDocument: n,
  pageNumber: e,
  selected: t,
  markerCount: o,
  onSelect: r,
  onLayoutChange: s,
  registerElement: i
}) => {
  const { t: a } = ye(["viewer"], { useSuspense: !1 }), l = B(null), u = B(null), d = B(null), [h, p] = Y(!1), [g, f] = Y(!1), [S, m] = Y(!1), v = o > 0 ? a("viewer:navigation.pageWithMarkers", {
    value: e,
    count: o
  }) : a("viewer:navigation.page", { value: e }), b = X((w) => {
    l.current = w, i(e, w);
  }, [e, i]);
  return ne(() => {
    const w = l.current;
    if (!w || h) return;
    if (typeof IntersectionObserver > "u") {
      p(!0);
      return;
    }
    const x = new IntersectionObserver(
      ([E]) => {
        E.isIntersecting && (p(!0), x.disconnect());
      },
      { rootMargin: Bi }
    );
    return x.observe(w), () => x.disconnect();
  }, [h]), ne(() => {
    if (!h) return;
    let w = !1;
    return (async () => {
      let E = null;
      try {
        f(!1), m(!1);
        const I = await n.getPage(e);
        if (w) return;
        const P = u.current, W = P?.getContext("2d");
        if (!P || !W) return;
        const F = I.getViewport({ scale: 1 }), D = I.getViewport({ scale: ji / F.width }), A = Math.min(window.devicePixelRatio || 1, 2);
        P.width = Math.floor(D.width * A), P.height = Math.floor(D.height * A), P.style.width = `${Math.floor(D.width)}px`, P.style.height = `${Math.floor(D.height)}px`, s(), E = I.render({
          canvasContext: W,
          viewport: D,
          transform: A === 1 ? void 0 : [A, 0, 0, A, 0, 0]
        }), d.current = E, await E.promise, w || f(!0);
      } catch (I) {
        !w && I.name !== "RenderingCancelledException" && m(!0);
      } finally {
        d.current === E && (d.current = null);
      }
    })(), () => {
      w = !0, d.current?.cancel(), d.current = null;
    };
  }, [s, n, e, h]), /* @__PURE__ */ c(
    "button",
    {
      ref: b,
      type: "button",
      className: [
        ft.thumbnail,
        t ? ft["thumbnail--selected"] : ""
      ].join(" "),
      "aria-current": t ? "page" : void 0,
      "aria-label": v,
      onClick: () => r(e),
      children: /* @__PURE__ */ T("span", { className: ft.thumbnailCanvasWrapper, children: [
        /* @__PURE__ */ c("canvas", { ref: u, className: ft.thumbnailCanvas }),
        !g && !S && /* @__PURE__ */ c("span", { className: ft.thumbnailPlaceholder }),
        S && /* @__PURE__ */ c("span", { className: ft.thumbnailError, children: a("viewer:navigation.thumbnailError") }),
        o > 0 && /* @__PURE__ */ c("span", { className: ft.thumbnailMarker, "aria-hidden": "true", children: o > 99 ? "99+" : o }),
        /* @__PURE__ */ c("span", { className: ft.thumbnailPageNumber, children: e })
      ] })
    }
  );
});
Ho.displayName = "PdfThumbnail";
const Wi = ({ pageMarkerCounts: n }) => {
  const { pdfDocument: e, pdfViewer: t, eventBus: o } = Fe(), [r, s] = Y(() => t?.currentPageNumber || 1), i = B(r), a = B(/* @__PURE__ */ new Map()), l = B(null), u = B(!0), d = X((S, m) => {
    m ? a.current.set(S, m) : a.current.delete(S);
  }, []), h = X(() => {
    l.current !== null && (window.cancelAnimationFrame(l.current), l.current = null);
  }, []), p = X(() => {
    u.current && (h(), l.current = window.requestAnimationFrame(() => {
      l.current = null, a.current.get(i.current)?.scrollIntoView({
        block: "nearest"
      });
    }));
  }, [h]), g = X(() => {
    u.current = !1, h();
  }, [h]), f = X((S) => {
    t && (u.current = !0, i.current = S, s(S), t.currentPageNumber = S);
  }, [t]);
  return ne(() => {
    if (!t || !o) return;
    const S = t.currentPageNumber || 1;
    u.current = !0, i.current = S, s(S);
    const m = ({ pageNumber: v }) => {
      u.current = !0, i.current = v, s(v);
    };
    return o.on("pagechanging", m), () => o.off("pagechanging", m);
  }, [o, t]), ne(() => {
    u.current = !0, i.current = r, p();
  }, [r, p, e]), ne(() => h, [h]), e ? /* @__PURE__ */ c(
    "div",
    {
      className: ft.thumbnailList,
      onPointerDown: g,
      onTouchStart: g,
      onWheel: g,
      children: Array.from({ length: e.numPages }, (S, m) => {
        const v = m + 1;
        return /* @__PURE__ */ c(
          Ho,
          {
            pdfDocument: e,
            pageNumber: v,
            selected: v === r,
            markerCount: n.get(v) ?? 0,
            onSelect: f,
            onLayoutChange: p,
            registerElement: d
          },
          v
        );
      })
    }
  ) : null;
}, Vi = "_outline_fpevi_1", $i = "_outlineTree_fpevi_5", Yi = "_outlineItem_fpevi_11", Ki = "_outlineRow_fpevi_16", Xi = "_outlineTitle_fpevi_26", qi = "_outlineToggle_fpevi_33", Ji = "_outlineToggleSpacer_fpevi_60", Zi = "_outlineChevron_fpevi_64", Qi = "_outlineState_fpevi_100", ze = {
  outline: Vi,
  outlineTree: $i,
  outlineItem: Yi,
  outlineRow: Ki,
  "outlineRow--selected": "_outlineRow--selected_fpevi_26",
  outlineTitle: Xi,
  outlineToggle: qi,
  outlineToggleSpacer: Ji,
  outlineChevron: Zi,
  "outlineChevron--expanded": "_outlineChevron--expanded_fpevi_73",
  outlineState: Qi
}, es = (n) => {
  if (!n || typeof n != "object") return !1;
  const e = n;
  return Number.isInteger(e.num) && Number.isInteger(e.gen);
}, Hn = So(({
  depth: n,
  item: e,
  itemKey: t,
  selectedItemKey: o,
  onNavigate: r
}) => {
  const { t: s } = ye(["viewer"], { useSuspense: !1 }), i = e.items.length > 0, [a, l] = Y(() => e.count === void 0 || e.count >= 0), u = e.title.trim() || s("viewer:navigation.untitledOutlineItem"), d = e.dest !== null, h = o === t, p = () => {
    d ? r(e, t) : i && l((g) => !g);
  };
  return /* @__PURE__ */ T(
    "li",
    {
      role: "treeitem",
      "aria-expanded": i ? a : void 0,
      className: ze.outlineItem,
      children: [
        /* @__PURE__ */ T(
          "div",
          {
            className: [
              ze.outlineRow,
              h ? ze["outlineRow--selected"] : ""
            ].join(" "),
            style: { paddingLeft: `${8 + Math.min(n, 8) * 12}px` },
            children: [
              i ? /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: ze.outlineToggle,
                  "aria-label": s(a ? "viewer:navigation.collapseOutlineItem" : "viewer:navigation.expandOutlineItem", { title: u }),
                  "aria-controls": `${t}-children`,
                  "aria-expanded": a,
                  onClick: () => l((g) => !g),
                  children: /* @__PURE__ */ c(
                    "span",
                    {
                      className: [
                        ze.outlineChevron,
                        a ? ze["outlineChevron--expanded"] : ""
                      ].join(" ")
                    }
                  )
                }
              ) : /* @__PURE__ */ c("span", { className: ze.outlineToggleSpacer }),
              e.url ? /* @__PURE__ */ c(
                "a",
                {
                  className: ze.outlineTitle,
                  href: e.url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  style: {
                    fontStyle: e.italic ? "italic" : void 0,
                    fontWeight: e.bold ? 600 : void 0
                  },
                  onClick: () => r(e, t),
                  children: u
                }
              ) : /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: ze.outlineTitle,
                  disabled: !d && !i,
                  "aria-current": h ? "location" : void 0,
                  style: {
                    fontStyle: e.italic ? "italic" : void 0,
                    fontWeight: e.bold ? 600 : void 0
                  },
                  onClick: p,
                  children: u
                }
              )
            ]
          }
        ),
        i && a && /* @__PURE__ */ c("ul", { id: `${t}-children`, role: "group", className: ze.outlineTree, children: e.items.map((g, f) => /* @__PURE__ */ c(
          Hn,
          {
            itemKey: `${t}-${f}`,
            item: g,
            depth: n + 1,
            selectedItemKey: o,
            onNavigate: r
          },
          `${t}-${f}`
        )) })
      ]
    }
  );
});
Hn.displayName = "OutlineItem";
const ts = ({ onNavigate: n }) => {
  const { t: e } = ye(["viewer"], { useSuspense: !1 }), { pdfDocument: t, pdfViewer: o } = Fe(), r = B(0), [s, i] = Y(null), [a, l] = Y({
    document: null,
    status: "loading",
    items: []
  });
  ne(() => {
    if (!t) {
      l({ document: null, status: "loading", items: [] });
      return;
    }
    let d = !1;
    return r.current += 1, i(null), l({ document: t, status: "loading", items: [] }), t.getOutline().then(
      (h) => {
        d || l({
          document: t,
          status: "ready",
          items: h ?? []
        });
      },
      () => {
        d || l({
          document: t,
          status: "error",
          items: []
        });
      }
    ), () => {
      d = !0, r.current += 1;
    };
  }, [t]);
  const u = X(async (d, h) => {
    const p = r.current + 1;
    if (r.current = p, d.url) {
      n?.();
      return;
    }
    if (!(!t || !o || d.dest === null))
      try {
        const g = typeof d.dest == "string" ? await t.getDestination(d.dest) : d.dest;
        if (r.current !== p || o.pdfDocument !== t || !Array.isArray(g))
          return;
        const f = g[0];
        let S = null;
        if (es(f) ? (S = t.cachedPageNumber(f), S || (S = await t.getPageIndex(f) + 1)) : Number.isInteger(f) && (S = f + 1), r.current !== p || o.pdfDocument !== t || !S || S < 1 || S > t.numPages)
          return;
        o.scrollPageIntoView({
          pageNumber: S,
          destArray: g
        }), i(h), n?.();
      } catch {
      }
  }, [n, t, o]);
  return !t || a.document !== t || a.status === "loading" ? /* @__PURE__ */ c("div", { className: ze.outlineState, children: e("viewer:navigation.outlineLoading") }) : a.status === "error" ? /* @__PURE__ */ c("div", { className: ze.outlineState, children: e("viewer:navigation.outlineError") }) : a.items.length === 0 ? /* @__PURE__ */ c("div", { className: ze.outlineState, children: e("viewer:navigation.outlineEmpty") }) : /* @__PURE__ */ c("nav", { className: ze.outline, "aria-label": e("viewer:navigation.outline"), children: /* @__PURE__ */ c("ul", { role: "tree", className: ze.outlineTree, children: a.items.map((d, h) => /* @__PURE__ */ c(
    Hn,
    {
      itemKey: `outline-${h}`,
      item: d,
      depth: 0,
      selectedItemKey: s,
      onNavigate: u
    },
    `outline-${h}`
  )) }) });
}, qt = "inklayer:navigation-page-markers-changed", ns = "_navigationSidebar_13vi9_1", os = "_navigationSidebarContainer_13vi9_19", rs = "_navigationTabs_13vi9_29", is = "_navigationTabsList_13vi9_36", ss = "_navigationTabsTrigger_13vi9_47", as = "_navigationTabsContent_13vi9_56", cs = "_navigationSidebarOverlay_13vi9_63", st = {
  navigationSidebar: ns,
  "navigationSidebar--hidden": "_navigationSidebar--hidden_13vi9_14",
  navigationSidebarContainer: os,
  navigationTabs: rs,
  navigationTabsList: is,
  navigationTabsTrigger: ss,
  navigationTabsContent: as,
  navigationSidebarOverlay: cs
}, ls = ({
  open: n,
  onClose: e,
  onTransitionEnd: t
}) => {
  const { t: o } = ye(["viewer"], { useSuspense: !1 }), { eventBus: r } = Fe(), [s, i] = Y("thumbnails"), [a, l] = Y(() => /* @__PURE__ */ new Map()), u = X((p) => {
    (p === "thumbnails" || p === "outline") && i(p);
  }, []);
  ne(() => {
    if (l(/* @__PURE__ */ new Map()), !r) return;
    const p = ({
      source: g,
      markers: f
    }) => {
      l((S) => {
        const m = new Map(S);
        return f.size > 0 ? m.set(g, f) : m.delete(g), m;
      });
    };
    return r.on(qt, p), () => {
      r.off(qt, p);
    };
  }, [r]), ne(() => {
    if (!n) return;
    const p = (g) => {
      g.key === "Escape" && e();
    };
    return document.addEventListener("keydown", p), () => document.removeEventListener("keydown", p);
  }, [e, n]);
  const d = ke(() => {
    const p = /* @__PURE__ */ new Map();
    return a.forEach((g) => {
      g.forEach((f, S) => {
        p.set(S, (p.get(S) ?? 0) + f);
      });
    }), p;
  }, [a]), h = X(() => {
    window.matchMedia("(max-width: 840px)").matches && e();
  }, [e]);
  return /* @__PURE__ */ T(ve, { children: [
    /* @__PURE__ */ c(
      "aside",
      {
        id: "InkLayer-navigation-sidebar",
        className: [
          st.navigationSidebar,
          n ? "" : st["navigationSidebar--hidden"]
        ].join(" "),
        "aria-label": o("viewer:navigation.label"),
        "aria-hidden": !n,
        onTransitionEnd: t,
        children: /* @__PURE__ */ c("div", { className: st.navigationSidebarContainer, hidden: !n, children: /* @__PURE__ */ T(
          At.Root,
          {
            value: s,
            onValueChange: u,
            className: st.navigationTabs,
            children: [
              /* @__PURE__ */ T(At.List, { className: st.navigationTabsList, children: [
                /* @__PURE__ */ c(
                  At.Trigger,
                  {
                    value: "thumbnails",
                    className: st.navigationTabsTrigger,
                    children: /* @__PURE__ */ c("span", { children: o("viewer:navigation.thumbnails") })
                  }
                ),
                /* @__PURE__ */ c(
                  At.Trigger,
                  {
                    value: "outline",
                    className: st.navigationTabsTrigger,
                    children: /* @__PURE__ */ c("span", { children: o("viewer:navigation.outline") })
                  }
                )
              ] }),
              /* @__PURE__ */ c(
                At.Content,
                {
                  value: "thumbnails",
                  className: st.navigationTabsContent,
                  children: /* @__PURE__ */ c(Wi, { pageMarkerCounts: d })
                }
              ),
              /* @__PURE__ */ c(
                At.Content,
                {
                  value: "outline",
                  className: st.navigationTabsContent,
                  children: /* @__PURE__ */ c(ts, { onNavigate: h })
                }
              )
            ]
          }
        ) })
      }
    ),
    n && /* @__PURE__ */ c(
      "div",
      {
        className: st.navigationSidebarOverlay,
        onClick: e
      }
    )
  ] });
}, ds = /* @__PURE__ */ new Set(["auto", "page-fit", "page-width"]), Go = ({
  children: n,
  toolbar: e,
  sidebar: t,
  defaultActiveSidebarKey: o,
  title: r,
  actions: s,
  style: i = { width: "100vw", height: "100vh" },
  initialScale: a = "auto",
  user: l,
  hideHeader: u = !1,
  hidePageIndicator: d = !1,
  ...h
}) => {
  const { t: p } = ye(["viewer"], { useSuspense: !1 }), g = B(null), { loading: f, progress: S, pdfDocument: m, pdfViewer: v, eventBus: b, loadError: w } = fi(g, h), [x, E] = Y(!1), I = X(() => {
    E((N) => !N);
  }, []), [P, W] = Y(() => o || null), F = P === null;
  ne(() => {
    if (!v || !b) return;
    const N = () => {
      v.currentScaleValue = a;
    };
    return b.on("pagesloaded", N), () => {
      b.off("pagesloaded", N);
    };
  }, [v, b, a]);
  const D = X(() => {
    W((N) => N ? null : t?.[0]?.key ?? null);
  }, [t]), A = X((N) => {
    W(N);
  }, []), L = X(() => {
    W(null);
  }, []), $ = X(() => {
    if (!v) return;
    const N = v.currentScaleValue;
    ds.has(N) && (v.currentScaleValue = N, v.update());
  }, [v]), j = X(
    (N) => {
      N.target !== N.currentTarget || N.propertyName !== "width" || $();
    },
    [$]
  ), _ = !!(v && b && g.current && !f), { printClean: O, downloadClean: Z } = Oo(m);
  Di({
    pdfViewer: v ?? null,
    containerRef: g,
    minScale: 0.1,
    maxScale: 10
  });
  const K = ke(
    () => ({
      pdfDocument: m,
      pdfViewer: v,
      eventBus: b,
      viewerContainerRef: g,
      isReady: _,
      activeSidebarPanel: P,
      isNavigationSidebarOpen: x,
      toggleNavigationSidebar: I,
      toggleSidebar: D,
      openSidebar: A,
      closeSidebar: L,
      isSidebarCollapsed: F,
      print: O,
      download: Z
    }),
    [
      m,
      v,
      b,
      _,
      D,
      F,
      A,
      L,
      P,
      x,
      I,
      O,
      Z
    ]
  ), k = ke(
    () => ({
      user: l || null
    }),
    [l]
  );
  ne(() => {
    if (!v || !b)
      return;
    const N = () => {
      const q = v.currentScaleValue;
      (q === "auto" || q === "page-fit" || q === "page-width") && (v.currentScaleValue = q), v.update();
    };
    return window.addEventListener("resize", N), N(), () => {
      window.removeEventListener("resize", N);
    };
  }, [v, b]);
  const H = t && /* @__PURE__ */ c(Q, { gap: "2", children: t.map((N) => /* @__PURE__ */ c(Rt, { content: N.title, children: /* @__PURE__ */ c(
    be,
    {
      variant: P === N.key ? "soft" : "outline",
      size: "2",
      color: "gray",
      highContrast: !0,
      style: {
        boxShadow: "none"
      },
      onClick: () => W((q) => q === N.key ? null : N.key),
      children: N.icon
    }
  ) }, N.key)) }), oe = ke(() => !t || !P ? null : t.find((N) => N.key === P) || null, [t, P]);
  return ne(() => {
    if (!t || !P) return;
    t.some((q) => q.key === P) || W(null);
  }, [t, P]), /* @__PURE__ */ c(On.Provider, { value: k, children: /* @__PURE__ */ c(Mo.Provider, { value: K, children: /* @__PURE__ */ T(Q, { id: "InkLayer", className: Ie.InkLayerViewer, style: i, direction: "column", width: "100%", position: "relative", children: [
    /* @__PURE__ */ c(ki, { progress: S, loading: f }),
    w && /* @__PURE__ */ c(Ei, { error: w }),
    !u && /* @__PURE__ */ c(Q, { pl: "2", pr: "2", className: Ie.viewerHeader, children: /* @__PURE__ */ T("div", { className: Ie["viewerHeader-title"], children: [
      /* @__PURE__ */ T(Q, { align: "center", gap: "2", className: Ie["viewerHeader-title-left"], children: [
        /* @__PURE__ */ c(Rt, { content: p("viewer:navigation.toggle"), children: /* @__PURE__ */ c(
          be,
          {
            variant: "outline",
            size: "2",
            color: "gray",
            highContrast: !0,
            style: { boxShadow: "none" },
            "aria-controls": "InkLayer-navigation-sidebar",
            "aria-expanded": x,
            "aria-label": p("viewer:navigation.toggle"),
            onClick: () => E((N) => !N),
            children: x ? /* @__PURE__ */ c(oi, { className: Ie.navigationSidebarTriggerIcon }) : /* @__PURE__ */ c(ri, { className: Ie.navigationSidebarTriggerIcon })
          }
        ) }),
        /* @__PURE__ */ c("div", { className: Ie["viewerHeader-title-name"], children: r || "PDF Viewer" })
      ] }),
      /* @__PURE__ */ c("div", { className: Ie["viewerHeader-title-actions"], children: /* @__PURE__ */ T(Q, { direction: "row", gap: "3", justify: "between", align: "center", children: [
        H,
        s
      ] }) })
    ] }) }),
    /* @__PURE__ */ T(Q, { flexGrow: "1", minHeight: "0", className: Ie.viewerBody, children: [
      /* @__PURE__ */ c(
        ls,
        {
          open: x,
          onClose: () => E(!1),
          onTransitionEnd: j
        }
      ),
      /* @__PURE__ */ T(Q, { flexGrow: "1", minHeight: "0", className: Ie.viewerWrapper, children: [
        /* @__PURE__ */ T(Q, { className: Ie.viewerContainer, direction: "column", flexGrow: "1", children: [
          e && /* @__PURE__ */ c(Q, { align: "center", justify: "center", className: Ie["viewerContainer-header"], children: e }),
          /* @__PURE__ */ T(lt, { position: "relative", flexGrow: "1", className: Ie["viewerContainer-content"], children: [
            !d && /* @__PURE__ */ c(Lo, {}),
            /* @__PURE__ */ c("div", { ref: g, className: Ie.pdfjsViewerContainer, children: /* @__PURE__ */ c("div", { className: "pdfViewer" }) })
          ] })
        ] }),
        /* @__PURE__ */ c(
          lt,
          {
            id: "InkLayer-viewer-sidebar",
            className: [
              Ie.viewerSidebar,
              oe ? "" : Ie["viewerSidebar--hidden"]
            ].join(" "),
            pl: "1",
            pr: "1",
            onTransitionEnd: j,
            children: oe && /* @__PURE__ */ c("div", { className: Ie["viewerSidebar-container"], children: oe.render(K) })
          }
        ),
        oe && /* @__PURE__ */ c(
          "div",
          {
            className: Ie.sidebarOverlay,
            onClick: () => W(null)
          }
        )
      ] })
    ] }),
    n
  ] }) }) });
}, Ne = ({ children: n, style: e, ...t }) => /* @__PURE__ */ c("svg", { ...t, style: { width: "1em", height: "1em", ...e }, children: n }), us = ({ style: n }) => /* @__PURE__ */ c(Ne, { viewBox: "0 0 320 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M0 55.2V426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320H297.9c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"
  }
) }), Uo = ({ style: n }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 576 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M315 315l158.4-215L444.1 70.6 229 229 315 315zm-187 5l0 0V248.3c0-15.3 7.2-29.6 19.5-38.6L420.6 8.4C428 2.9 437 0 446.2 0c11.4 0 22.4 4.5 30.5 12.6l54.8 54.8c8.1 8.1 12.6 19 12.6 30.5c0 9.2-2.9 18.2-8.4 25.6L334.4 396.5c-9 12.3-23.4 19.5-38.6 19.5H224l-25.4 25.4c-12.5 12.5-32.8 12.5-45.3 0l-50.7-50.7c-12.5-12.5-12.5-32.8 0-45.3L128 320zM7 466.3l63-63 70.6 70.6-31 31c-4.5 4.5-10.6 7-17 7H24c-13.3 0-24-10.7-24-24v-4.7c0-6.4 2.5-12.5 7-17z"
  }
) }), zo = ({ style: n }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 512 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M161.3 144c3.2-17.2 14-30.1 33.7-38.6c21.1-9 51.8-12.3 88.6-6.5c11.9 1.9 48.8 9.1 60.1 12c17.1 4.5 34.6-5.6 39.2-22.7s-5.6-34.6-22.7-39.2c-14.3-3.8-53.6-11.4-66.6-13.4c-44.7-7-88.3-4.2-123.7 10.9c-36.5 15.6-64.4 44.8-71.8 87.3c-.1 .6-.2 1.1-.2 1.7c-2.8 23.9 .5 45.6 10.1 64.6c4.5 9 10.2 16.9 16.7 23.9H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H270.1c-.1 0-.3-.1-.4-.1l-1.1-.3c-36-10.8-65.2-19.6-85.2-33.1c-9.3-6.3-15-12.6-18.2-19.1c-3.1-6.1-5.2-14.6-3.8-27.4zM348.9 337.2c2.7 6.5 4.4 15.8 1.9 30.1c-3 17.6-13.8 30.8-33.9 39.4c-21.1 9-51.7 12.3-88.5 6.5c-18-2.9-49.1-13.5-74.4-22.1c-5.6-1.9-11-3.7-15.9-5.4c-16.8-5.6-34.9 3.5-40.5 20.3s3.5 34.9 20.3 40.5c3.6 1.2 7.9 2.7 12.7 4.3l0 0 0 0c24.9 8.5 63.6 21.7 87.6 25.6l0 0 .2 0c44.7 7 88.3 4.2 123.7-10.9c36.5-15.6 64.4-44.8 71.8-87.3c3.6-21 2.7-40.4-3.1-58.1H335.1c7 5.6 11.4 11.2 13.9 17.2z"
  }
) }), Fo = ({ style: n }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 448 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M16 64c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H128V224c0 53 43 96 96 96s96-43 96-96V96H304c-17.7 0-32-14.3-32-32s14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H384V224c0 88.4-71.6 160-160 160s-160-71.6-160-160V96H48C30.3 96 16 81.7 16 64zM0 448c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32z"
  }
) }), hs = ({ style: n }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 384 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M32 32C14.3 32 0 46.3 0 64S14.3 96 32 96H160V448c0 17.7 14.3 32 32 32s32-14.3 32-32V96H352c17.7 0 32-14.3 32-32s-14.3-32-32-32H192 32z"
  }
) }), ps = ({ style: n }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 512 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M384 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H384zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"
  }
) }), fs = ({ style: n }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 512 512", style: n, children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" }) }), gs = ({ style: n }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 512 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
  }
) }), ms = ({ style: n }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 576 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M315 315l158.4-215L444.1 70.6 229 229 315 315zm-187 5l0 0V248.3c0-15.3 7.2-29.6 19.5-38.6L420.6 8.4C428 2.9 437 0 446.2 0c11.4 0 22.4 4.5 30.5 12.6l54.8 54.8c8.1 8.1 12.6 19 12.6 30.5c0 9.2-2.9 18.2-8.4 25.6L334.4 396.5c-9 12.3-23.4 19.5-38.6 19.5H224l-25.4 25.4c-12.5 12.5-32.8 12.5-45.3 0l-50.7-50.7c-12.5-12.5-12.5-32.8 0-45.3L128 320zM7 466.3l63-63 70.6 70.6-31 31c-4.5 4.5-10.6 7-17 7H24c-13.3 0-24-10.7-24-24v-4.7c0-6.4 2.5-12.5 7-17z"
  }
) }), vs = ({ style: n }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 640 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M192 128c0-17.7 14.3-32 32-32s32 14.3 32 32v7.8c0 27.7-2.4 55.3-7.1 82.5l-84.4 25.3c-40.6 12.2-68.4 49.6-68.4 92v71.9c0 40 32.5 72.5 72.5 72.5c26 0 50-13.9 62.9-36.5l13.9-24.3c26.8-47 46.5-97.7 58.4-150.5l94.4-28.3-12.5 37.5c-3.3 9.8-1.6 20.5 4.4 28.8s15.7 13.3 26 13.3H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H460.4l18-53.9c3.8-11.3 .9-23.8-7.4-32.4s-20.7-11.8-32.2-8.4L316.4 198.1c2.4-20.7 3.6-41.4 3.6-62.3V128c0-53-43-96-96-96s-96 43-96 96v32c0 17.7 14.3 32 32 32s32-14.3 32-32V128zm-9.2 177l49-14.7c-10.4 33.8-24.5 66.4-42.1 97.2l-13.9 24.3c-1.5 2.6-4.3 4.3-7.4 4.3c-4.7 0-8.5-3.8-8.5-8.5V335.6c0-14.1 9.3-26.6 22.8-30.7zM24 368c-13.3 0-24 10.7-24 24s10.7 24 24 24H64.3c-.2-2.8-.3-5.6-.3-8.5V368H24zm592 48c13.3 0 24-10.7 24-24s-10.7-24-24-24H305.9c-6.7 16.3-14.2 32.3-22.3 48H616z"
  }
) }), ys = ({ style: n }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 512 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M312 201.8c0-17.4 9.2-33.2 19.9-47C344.5 138.5 352 118.1 352 96c0-53-43-96-96-96s-96 43-96 96c0 22.1 7.5 42.5 20.1 58.8c10.7 13.8 19.9 29.6 19.9 47c0 29.9-24.3 54.2-54.2 54.2H112C50.1 256 0 306.1 0 368c0 20.9 13.4 38.7 32 45.3V464c0 26.5 21.5 48 48 48H432c26.5 0 48-21.5 48-48V413.3c18.6-6.6 32-24.4 32-45.3c0-61.9-50.1-112-112-112H366.2c-29.9 0-54.2-24.3-54.2-54.2zM416 416v32H96V416H416z"
  }
) }), bs = ({ style: n }) => /* @__PURE__ */ T(Ne, { viewBox: "0 0 1024 1024", style: n, children: [
  /* @__PURE__ */ c("path", { d: "M96 837.68888888h832v160H96z", fill: "var(--palette-preview-color, currentColor)" }),
  /* @__PURE__ */ c("path", { d: "M429.30646525 163.315053m54.92260742 54.92260743l164.76782227 164.76782227q54.92260742 54.92260742 0 109.84521486l-164.76782227 164.76782228q-54.92260742 54.92260742-109.84521486 0l-164.76782228-164.76782228q-54.92260742-54.92260742 0-109.84521486l164.76782228-164.76782227q54.92260742-54.92260742 109.84521486 0Z", fill: "var(--palette-preview-color, currentColor)" }),
  /* @__PURE__ */ c("path", { d: "M364.65047577 163.33699097L262.12304466 60.85098508 320.69831237 2.23429214l153.14905568 153.10763046c2.94119095 2.27838736 5.79953147 4.76390083 8.5335963 7.45654045l234.34249608 234.34249608a82.85044939 82.85044939 0 0 1 0 117.15053543l-234.34249608 234.34249607a82.85044939 82.85044939 0 0 1-117.19196065 0L130.88793283 514.29149456a82.85044939 82.85044939 0 0 1 0-117.15053543l233.76254294-233.80396816z m220.2579197 219.13943862l-0.57995316 0.53852791-161.0612736-161.0612736-226.72025474 226.67882952h454.51756532L584.90839547 382.47642959zM822.68918518 783.3069037a103.56306173 103.56306173 0 0 1-103.56306171-103.56306173c0-57.16681008 87.61435022-161.39267539 103.56306171-161.3926754 15.9487115 0 103.56306173 104.1844401 103.56306173 161.3926754a103.56306173 103.56306173 0 0 1-103.56306173 103.56306173z", fill: "currentColor" })
] }), Ss = ({ style: n }) => /* @__PURE__ */ T(
  Ne,
  {
    viewBox: "0 0 1024 1024",
    style: n,
    children: [
      /* @__PURE__ */ c("path", { fill: "currentColor", stroke: "currentColor", strokeWidth: "16", strokeLinejoin: "round", d: "M542.04 141.43c-68.07-39.3-151.95-39.3-220.03 0-68.07 39.31-110.01 111.95-110 190.56C212.02 453.5 310.52 552 432.03 552s220.01-98.5 220.02-220.01c0.01-78.61-41.93-151.25-110.01-190.56zM432.03 472c-77.33 0-140.01-62.69-140.01-140.01s62.68-140.02 140.01-140.02c77.33 0 140.02 62.69 140.02 140.02S509.36 472 432.03 472zM325.06 612.02h186.98c22.09 0 40 17.91 40 40s-17.91 40-40 40H332.02c-58.73 0-79.21 0.4-94.81 5.2a120.03 120.03 0 0 0-80.01 80c-4.79 15.6-5.2 36.09-5.2 94.82 0 14.29-7.62 27.5-19.99 34.65a40.044 40.044 0 0 1-40.01 0 40.013 40.013 0 0 1-20-34.65v-6.97c0-49.08 0-82.61 8.6-111.09C99.99 690.04 150.03 640 213.98 620.62c28.48-8.65 62-8.65 111.08-8.6z" }),
      /* @__PURE__ */ c("path", { fill: "currentColor", stroke: "currentColor", strokeWidth: "24", strokeLinecap: "round", strokeLinejoin: "round", d: "M720.72 551.99c4.72 0 9.24 1.87 12.58 5.21 3.34 3.33 5.21 7.86 5.21 12.58v71.16h106.74v-71.16c0-6.36 3.39-12.23 8.9-15.41a17.78 17.78 0 0 1 17.79 0c5.5 3.18 8.89 9.05 8.89 15.41v71.16h53.37c6.36 0 12.23 3.39 15.41 8.89a17.78 17.78 0 0 1 0 17.79c-3.18 5.5-9.05 8.89-15.41 8.89h-53.37v106.74h53.37c6.36 0 12.23 3.39 15.41 8.9a17.78 17.78 0 0 1 0 17.79c-3.18 5.5-9.05 8.9-15.41 8.89h-53.37v71.16c0 6.36-3.39 12.23-8.89 15.41a17.78 17.78 0 0 1-17.79 0c-5.51-3.18-8.9-9.05-8.9-15.41v-71.16H738.51v71.16c0 6.36-3.39 12.23-8.9 15.41a17.78 17.78 0 0 1-17.79 0c-5.51-3.18-8.9-9.05-8.89-15.41v-71.16h-53.37c-6.36 0-12.23-3.39-15.41-8.89a17.78 17.78 0 0 1 0-17.79c3.18-5.51 9.05-8.9 15.41-8.9h53.37V676.53h-53.37c-9.82 0-17.79-7.96-17.79-17.79 0-9.82 7.96-17.79 17.79-17.79h53.37v-71.16c0-9.83 7.96-17.8 17.79-17.8z m17.79 124.54v106.74h106.74V676.53H738.51z m0 0" })
    ]
  }
), ws = ({ style: n }) => /* @__PURE__ */ c(Ne, { viewBox: "0 0 1024 1024", style: n, children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M766.4 744.3c43.7 0 79.4-36.2 79.4-80.5 0-53.5-79.4-140.8-79.4-140.8S687 610.3 687 663.8c0 44.3 35.7 80.5 79.4 80.5zm-377.1-44.1c7.1 7.1 18.6 7.1 25.6 0l256.1-256c7.1-7.1 7.1-18.6 0-25.6l-256-256c-.6-.6-1.3-1.2-2-1.7l-78.2-78.2a9.11 9.11 0 00-12.8 0l-48 48a9.11 9.11 0 000 12.8l67.2 67.2-207.8 207.9c-7.1 7.1-7.1 18.6 0 25.6l255.9 256zm12.9-448.6l178.9 178.9H223.4l178.8-178.9zM904 816H120c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8z" }) }), Cs = ({ style: n }) => /* @__PURE__ */ T(Ne, { viewBox: "0 0 1024 1024", style: n, children: [
  /* @__PURE__ */ c("path", { d: "M66.782609 772.541217h196.051478a58.835478 58.835478 0 0 1 58.768696 58.768696v117.359304l235.78713-165.442782c9.928348-6.989913 21.615304-10.685217 33.747478-10.685218H957.217391V89.043478H66.782609v683.475479zM313.61113 1022.886957a58.768696 58.768696 0 0 1-58.768695-58.768696v-124.794435H58.724174A58.813217 58.813217 0 0 1 0 780.55513V81.029565A58.835478 58.835478 0 0 1 58.768696 22.26087h906.462608A58.835478 58.835478 0 0 1 1024 81.029565v699.503305a58.835478 58.835478 0 0 1-58.768696 58.768695H593.697391L347.336348 1012.201739c-10.106435 7.101217-21.904696 10.685217-33.725218 10.685218z", fill: "currentColor" }),
  /* @__PURE__ */ c("path", { d: "M761.878261 326.032696h-499.756522a33.391304 33.391304 0 0 1 0-66.782609h499.756522a33.391304 33.391304 0 1 1 0 66.782609M761.878261 567.652174h-499.756522a33.391304 33.391304 0 0 1 0-66.782609h499.756522a33.391304 33.391304 0 1 1 0 66.782609", fill: "currentColor" })
] }), jo = ({ style: n }) => /* @__PURE__ */ c(Ne, { viewBox: "0 0 1024 1024", style: n, children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M464 512a48 48 0 1096 0 48 48 0 10-96 0zm200 0a48 48 0 1096 0 48 48 0 10-96 0zm-400 0a48 48 0 1096 0 48 48 0 10-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 00-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 00-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 00112 714v152a46 46 0 0046 46h152.1A449.4 449.4 0 00510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 00142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z" }) }), xs = ({ style: n }) => /* @__PURE__ */ c(Ne, { style: n, viewBox: "0 0 1024 1024", children: /* @__PURE__ */ c("path", { d: "M820.35259846 337.71374951V646.0663464h134.06634641V109.8009592h-536.2653872v134.06634641h308.35259689L109.8009592 860.57250255l93.84644234 93.84644232 616.70519692-616.70519536z", fill: "currentColor" }) }), Ts = ({ style: n }) => /* @__PURE__ */ c(Ne, { style: n, viewBox: "0 0 1365 1024", children: /* @__PURE__ */ c("path", { d: "M992 992H392v-2.71999969A319.75999969 319.75999969 0 0 1 193.92000031 393.99999969a400.00000031 400.00000031 0 0 1 790.11999938-41.47999969c2.68000031 0 5.28-0.52000031 8.00000062-0.52000031A319.99999969 319.99999969 0 0 1 992 992z m0-480h-7.99999969a247.99999969 247.99999969 0 0 1-77.28 0H831.99999969v-79.99999969a240 240 0 0 0-480 0v79.99999969a202.87999969 202.87999969 0 0 0-79.99999969 22.56L247.23999969 552.00000031a157.39999969 157.39999969 0 0 0-15.24 15.31999969 54.28000031 54.28000031 0 0 0-9.96 12.48A157.44 157.44 0 0 0 192.00000031 672.00000031a166.36000031 166.36000031 0 0 0 120 159.99999938h679.99999969a160.00000031 160.00000031 0 0 0 0-319.99999969z", fill: "currentColor" }) }), As = ({ style: n }) => /* @__PURE__ */ c(Ne, { style: n, viewBox: "0 0 1024 1024", children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" }) });
var re = /* @__PURE__ */ ((n) => (n[n.NONE = 0] = "NONE", n[n.TEXT = 1] = "TEXT", n[n.LINK = 2] = "LINK", n[n.FREETEXT = 3] = "FREETEXT", n[n.LINE = 4] = "LINE", n[n.SQUARE = 5] = "SQUARE", n[n.CIRCLE = 6] = "CIRCLE", n[n.POLYGON = 7] = "POLYGON", n[n.POLYLINE = 8] = "POLYLINE", n[n.HIGHLIGHT = 9] = "HIGHLIGHT", n[n.UNDERLINE = 10] = "UNDERLINE", n[n.SQUIGGLY = 11] = "SQUIGGLY", n[n.STRIKEOUT = 12] = "STRIKEOUT", n[n.STAMP = 13] = "STAMP", n[n.CARET = 14] = "CARET", n[n.INK = 15] = "INK", n[n.POPUP = 16] = "POPUP", n[n.FILEATTACHMENT = 17] = "FILEATTACHMENT", n[n.SOUND = 18] = "SOUND", n[n.MOVIE = 19] = "MOVIE", n[n.WIDGET = 20] = "WIDGET", n[n.SCREEN = 21] = "SCREEN", n[n.PRINTERMARK = 22] = "PRINTERMARK", n[n.TRAPNET = 23] = "TRAPNET", n[n.WATERMARK = 24] = "WATERMARK", n[n.THREED = 25] = "THREED", n[n.REDACT = 26] = "REDACT", n[n.NOTE = 27] = "NOTE", n))(re || {}), R = /* @__PURE__ */ ((n) => (n[n.NONE = -1] = "NONE", n[n.SELECT = 0] = "SELECT", n[n.HIGHLIGHT = 1] = "HIGHLIGHT", n[n.STRIKEOUT = 2] = "STRIKEOUT", n[n.UNDERLINE = 3] = "UNDERLINE", n[n.FREETEXT = 4] = "FREETEXT", n[n.RECTANGLE = 5] = "RECTANGLE", n[n.CIRCLE = 6] = "CIRCLE", n[n.FREEHAND = 7] = "FREEHAND", n[n.FREE_HIGHLIGHT = 8] = "FREE_HIGHLIGHT", n[n.SIGNATURE = 9] = "SIGNATURE", n[n.STAMP = 10] = "STAMP", n[n.NOTE = 11] = "NOTE", n[n.ARROW = 12] = "ARROW", n[n.CLOUD = 13] = "CLOUD", n))(R || {}), at = /* @__PURE__ */ ((n) => (n.Accepted = "Accepted", n.Rejected = "Rejected", n.Cancelled = "Cancelled", n.Completed = "Completed", n.None = "None", n.Closed = "Closed", n))(at || {});
const De = [
  {
    name: "select",
    // 批注名称
    type: 0,
    // 批注类型
    pdfjsAnnotationType: 0,
    subtype: "None",
    webSelectionDependencies: !1,
    resizable: !1,
    draggable: !1,
    icon: /* @__PURE__ */ c(us, {})
    // 图标
  },
  {
    name: "highlight",
    type: 1,
    pdfjsAnnotationType: 9,
    subtype: "Highlight",
    webSelectionDependencies: !0,
    resizable: !1,
    draggable: !1,
    icon: /* @__PURE__ */ c(Uo, {}),
    style: {
      color: "#b4fa56"
      // 默认高亮颜色
    },
    styleEditable: {
      color: !0,
      strokeWidth: !1,
      opacity: !1
    }
    // 是否可编辑样式
  },
  {
    name: "strikeout",
    type: 2,
    pdfjsAnnotationType: 12,
    subtype: "StrikeOut",
    webSelectionDependencies: !0,
    resizable: !1,
    draggable: !1,
    icon: /* @__PURE__ */ c(zo, {}),
    style: {
      color: "#ff6b6b"
      // 默认删除线颜色
    },
    styleEditable: {
      color: !0,
      opacity: !1,
      strokeWidth: !1
    }
    // 是否可编辑样式
  },
  {
    name: "underline",
    type: 3,
    pdfjsAnnotationType: 10,
    subtype: "Underline",
    webSelectionDependencies: !0,
    resizable: !1,
    draggable: !1,
    icon: /* @__PURE__ */ c(Fo, {}),
    style: {
      color: "#1272e8"
      // 默认下划线颜色
    },
    styleEditable: {
      color: !0,
      opacity: !1,
      strokeWidth: !1
    }
    // 是否可编辑样式
  },
  {
    name: "rectangle",
    type: 5,
    pdfjsAnnotationType: 5,
    subtype: "Square",
    webSelectionDependencies: !1,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(ps, {}),
    style: {
      color: "#ff6b6b",
      // 默认颜色
      strokeWidth: 2,
      // 默认线条宽度
      opacity: 1
      // 默认透明度
    },
    styleEditable: {
      color: !0,
      opacity: !0,
      strokeWidth: !0
    }
    // 是否可编辑样式
  },
  {
    name: "circle",
    type: 6,
    pdfjsAnnotationType: 6,
    subtype: "Circle",
    webSelectionDependencies: !1,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(fs, {}),
    style: {
      color: "#ff6b6b",
      // 默认颜色
      strokeWidth: 2,
      // 默认线条宽度
      opacity: 1
      // 默认透明度
    },
    styleEditable: {
      color: !0,
      opacity: !0,
      strokeWidth: !0
    }
    // 是否可编辑样式
  },
  {
    name: "note",
    type: 11,
    pdfjsAnnotationType: 1,
    subtype: "Text",
    webSelectionDependencies: !1,
    resizable: !1,
    draggable: !0,
    icon: /* @__PURE__ */ c(Cs, {})
  },
  {
    name: "arrow",
    type: 12,
    pdfjsAnnotationType: 4,
    subtype: "Arrow",
    webSelectionDependencies: !1,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(xs, {}),
    style: {
      color: "#ff6b6b",
      // 默认颜色
      strokeWidth: 2,
      // 默认线条宽度
      opacity: 1
      // 默认透明度
    },
    styleEditable: {
      color: !0,
      opacity: !0,
      strokeWidth: !0
    }
    // 是否可编辑样式
  },
  {
    name: "cloud",
    type: 13,
    pdfjsAnnotationType: 8,
    subtype: "PolyLine",
    webSelectionDependencies: !1,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(Ts, {}),
    style: {
      color: "#ff6b6b",
      // 默认颜色
      strokeWidth: 2,
      // 默认线条宽度
      opacity: 1
      // 默认透明度
    },
    styleEditable: {
      color: !0,
      opacity: !0,
      strokeWidth: !0
    }
    // 是否可编辑样式
  },
  {
    name: "freehand",
    type: 7,
    pdfjsAnnotationType: 15,
    subtype: "Ink",
    webSelectionDependencies: !1,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(gs, {}),
    style: {
      color: "#ff6b6b",
      // 默认颜色
      strokeWidth: 2,
      // 默认线条宽度
      opacity: 1
      // 默认透明度
    },
    styleEditable: {
      color: !0,
      opacity: !0,
      strokeWidth: !0
    }
    // 是否可编辑样式
  },
  {
    name: "freeHighlight",
    type: 8,
    pdfjsAnnotationType: 15,
    subtype: "Highlight",
    webSelectionDependencies: !1,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(ms, {}),
    style: {
      color: "#ff6b6b",
      // 默认自由高亮颜色
      strokeWidth: 10,
      // 默认线条宽度
      opacity: 0.5
      // 默认透明度
    },
    styleEditable: {
      color: !0,
      opacity: !0,
      strokeWidth: !1
    }
    // 是否可编辑样式
  },
  {
    name: "freeText",
    type: 4,
    pdfjsAnnotationType: 3,
    subtype: "FreeText",
    webSelectionDependencies: !1,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(hs, {}),
    style: {
      color: "#000",
      // 默认文字颜色
      fontSize: 14
      // 默认字体大小
    },
    styleEditable: {
      color: !0,
      opacity: !0,
      strokeWidth: !1
    }
    // 是否可编辑样式
  },
  {
    name: "signature",
    type: 9,
    pdfjsAnnotationType: 13,
    subtype: "Caret",
    webSelectionDependencies: !1,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(vs, {})
  },
  {
    name: "stamp",
    type: 10,
    pdfjsAnnotationType: 13,
    subtype: "Stamp",
    webSelectionDependencies: !1,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(ys, {})
  }
];
function Le(n) {
  if (!n) return [1, 1, 0];
  if (n.startsWith("rgb")) {
    const e = n.match(/\d+/g);
    return !e || e.length < 3 ? [1, 1, 0] : e.slice(0, 3).map((t) => parseInt(t) / 255);
  }
  if (n.startsWith("#")) {
    const e = n.replace("#", "");
    if (e.length !== 6) return [1, 1, 0];
    const t = parseInt(e.slice(0, 2), 16) / 255, o = parseInt(e.slice(2, 4), 16) / 255, r = parseInt(e.slice(4, 6), 16) / 255;
    return [t, o, r];
  }
  return [1, 1, 0];
}
function ks(n) {
  return document.body.contains(n);
}
function Bo() {
  return ii();
}
function Wo(n, e) {
  document.documentElement.style.setProperty(n, e);
}
function pn(n) {
  document.documentElement.style.removeProperty(n);
}
function Tn(n) {
  if (n < 1024) return `${n} B`;
  const e = ["KB", "MB", "GB", "TB"];
  let t = -1, o = n;
  do
    o /= 1024, t++;
  while (o >= 1024 && t < e.length - 1);
  return `${o.toFixed(2)} ${e[t]}`;
}
function Jt(n, e, t) {
  if (n <= t && e <= t)
    return { newWidth: n, newHeight: e };
  const o = t / n, r = t / e, s = Math.min(o, r), i = n * s, a = e * s;
  return { newWidth: i, newHeight: a };
}
function Ke(n, e = 0) {
  if (e < 0 || e * 3 + 2 >= n.length)
    throw new Error("Index out of bounds");
  const t = n[e * 3], o = n[e * 3 + 1], r = n[e * 3 + 2];
  return `rgb(${t}, ${o}, ${r})`;
}
function Kt(n) {
  const e = new Date(n), t = e.getFullYear(), o = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getDate()).padStart(2, "0"), s = String(e.getHours()).padStart(2, "0"), i = String(e.getMinutes()).padStart(2, "0"), a = String(e.getSeconds()).padStart(2, "0"), l = -e.getTimezoneOffset(), u = String(Math.floor(Math.abs(l) / 60)).padStart(2, "0"), d = String(Math.abs(l) % 60).padStart(2, "0"), h = l >= 0 ? "+" : "-";
  return `D:${t}${o}${r}${s}${i}${a}${h}${u}'${d}'`;
}
function An(n, e = !1) {
  if (!n || typeof n != "string" || !n.startsWith("D:"))
    return "";
  const t = n.slice(2, 16);
  if (t.length !== 14)
    return "";
  const o = t.slice(0, 4), r = t.slice(4, 6), s = t.slice(6, 8), i = t.slice(8, 10), a = t.slice(10, 12);
  if (e)
    return Te.t("common:dateFormat.full", { year: o, month: r, day: s, hour: i, minute: a });
  const l = /* @__PURE__ */ new Date(), u = l.getFullYear().toString(), d = (l.getMonth() + 1).toString().padStart(2, "0"), h = l.getDate().toString().padStart(2, "0");
  return o === u && r === d && s === h ? `${i}:${a}` : o === u ? Te.t("common:dateFormat.dayMonth", { day: s, month: r }) : Te.t("common:dateFormat.dayMonthYear", { day: s, month: r, year: o });
}
function Wn(n) {
  if (!n || typeof n != "string" || !n.startsWith("D:"))
    return "";
  const e = n.slice(2, 16);
  if (e.length !== 14)
    return "";
  const t = e.slice(0, 4), o = e.slice(4, 6), r = e.slice(6, 8), s = e.slice(8, 10), i = e.slice(10, 12), a = (/* @__PURE__ */ new Date()).getFullYear().toString(), l = t === a ? "common:dateFormat.compact" : "common:dateFormat.compactWithYear";
  return Te.t(l, {
    year: t,
    month: o,
    day: r,
    hour: s,
    minute: i
  });
}
function Vn(n) {
  const e = n.slice(2, 16), t = parseInt(e.slice(0, 4), 10), o = parseInt(e.slice(4, 6), 10) - 1, r = parseInt(e.slice(6, 8), 10), s = parseInt(e.slice(8, 10), 10), i = parseInt(e.slice(10, 12), 10), a = parseInt(e.slice(12, 14), 10) || 0, l = n.slice(16).match(/([+-])(\d{2})'?(\d{2})?'/);
  let u = 0;
  if (l) {
    const h = l[1] === "+" ? 1 : -1, p = parseInt(l[2], 10) || 0, g = parseInt(l[3] || "0", 10) || 0;
    u = h * (p * 60 + g);
  }
  return new Date(Date.UTC(t, o, r, s, i, a)).getTime() - u * 60 * 1e3;
}
function Pe(n, e) {
  const { viewport: t } = e, o = t.scale, r = n.x * o, s = n.y * o, i = n.width * o, a = n.height * o, [l, u] = t.convertToPdfPoint(r, s), [d, h] = t.convertToPdfPoint(r + i, s + a);
  return [Math.min(l, d), Math.min(u, h), Math.max(l, d), Math.max(u, h)];
}
function ae(n) {
  const t = [...[254, 255]];
  for (let r = 0; r < n.length; r++) {
    const s = n.charCodeAt(r);
    t.push(s >> 8 & 255, s & 255);
  }
  const o = t.map((r) => r.toString(16).padStart(2, "0")).join("").toUpperCase();
  return Eo.of(o);
}
function Vo(n = /* @__PURE__ */ new Date()) {
  const e = (l) => l.toString().padStart(2, "0"), t = n.getFullYear(), o = e(n.getMonth() + 1), r = e(n.getDate()), s = e(n.getHours()), i = e(n.getMinutes()), a = e(n.getSeconds());
  return `${t}${o}${r}_${s}${i}${a}`;
}
const ut = "InkLayer_Annotator", kn = `${ut}_painter_wrapper`, Es = `${ut}_annotation_author_labels_layer`, Rs = `${ut}_annotation_author_label`, sn = "annotationAuthorLabelBoundsChange", Ps = `${ut}_annotation_hover_preview`, $n = `${ut}_is_painting`, fn = `${ut}_painting_type`, _e = `${ut}_shape_group`, Ns = `${ut}_selector_hover`, Lt = `--${ut}-image-cursor`, $o = `${ut}_free_text_editor`;
class Ee {
  primaryColor;
  currentUser;
  defaultOptions;
  pdfViewerApplication;
  id;
  // 编辑器实例的唯一标识符
  onAdd;
  // 添加形状组的回调函数
  onChange;
  // 更改回调函数
  konvaStage;
  // Konva Stage对象
  pageNumber;
  // 页面编号
  currentAnnotation;
  // 当前注解对象，可以为 null
  isPainting;
  // 是否正在绘制标志位
  shapeGroupStore = /* @__PURE__ */ new Map();
  // 存储形状组的 Map
  currentShapeGroup;
  // 当前操作的形状组，可以为 null
  static MinSize = 8;
  // 最小尺寸常量
  /**
   * Editor 类的构造函数。
   * @param options 初始化编辑器的选项
   */
  constructor({
    primaryColor: e,
    defaultOptions: t,
    currentUser: o,
    konvaStage: r,
    pageNumber: s,
    annotation: i,
    onAdd: a,
    editorType: l,
    pdfViewerApplication: u,
    onChange: d
  }) {
    this.primaryColor = e, this.defaultOptions = t, this.currentUser = o, this.pdfViewerApplication = u, this.id = `${s}_${l}`, this.konvaStage = r, this.pageNumber = s, this.currentAnnotation = i, this.isPainting = !1, this.currentShapeGroup = null, this.onAdd = a, this.onChange = d || (() => {
    }), this.disableEditMode(), this.enableEditMode();
  }
  setCurrentUser(e) {
    this.currentUser = e;
  }
  /**
   * 发送添加事件的私有方法，调用 onAdd 回调函数。
   * @param pdfjsAnnotationStorage PDF.js 注解存储对象
   * @param annotationContent 注解内容，可选
   */
  dispatchAddEvent({
    shapeGroup: e,
    contentsObj: t,
    color: o
  }) {
    const { id: r, pageNumber: s, konvaGroup: i, annotation: a } = e;
    if (a) {
      const l = {
        id: r,
        pageNumber: s,
        konvaString: i.toJSON(),
        konvaClientRect: M.Node.create(i.toJSON()).getClientRect(),
        title: this.currentUser.name,
        type: a.type,
        pdfjsType: a.pdfjsAnnotationType,
        subtype: a.subtype,
        color: o,
        date: Kt(Date.now()),
        contentsObj: t,
        comments: [],
        user: this.currentUser,
        native: !1
      };
      this.onAdd(l);
    }
  }
  /**
   * @description 分发样式更改事件，输出样式更改的日志。
   */
  dispatchChangedEvent(e, t) {
    this.onChange(e, t);
  }
  /**
   * 启用编辑模式，监听 Konva Stage的鼠标事件。
   */
  enableEditMode() {
    this.konvaStage.on("mousedown", (e) => {
      e.evt.button === 0 && this.mouseDownHandler(e);
    }), this.konvaStage.on("mousemove", (e) => {
      this.mouseMoveHandler(e);
    }), this.konvaStage.on("mouseup", (e) => {
      e.evt.button === 0 && this.mouseUpHandler(e);
    }), this.konvaStage.on("touchstart", (e) => {
      e.evt.touches.length === 1 && this.mouseDownHandler(e);
    }), this.konvaStage.on("touchmove", (e) => {
      e.evt.touches.length === 1 && this.mouseMoveHandler(e);
    }), this.konvaStage.on("touchend", (e) => {
      this.mouseUpHandler(e);
    });
  }
  /**
   * 禁用编辑模式，取消 Konva Stage的鼠标事件监听。
   */
  disableEditMode() {
    this.isPainting = !1, this.konvaStage.off("click"), this.konvaStage.off("mousedown"), this.konvaStage.off("mousemove"), this.konvaStage.off("mouseup"), this.konvaStage.off("touchstart"), this.konvaStage.off("touchmove"), this.konvaStage.off("touchend");
  }
  /**
   * 获取背景图层，如果传入了 konvaStage 则使用传入的Stage，否则使用类中的Stage。
   * @param konvaStage 可选参数，传入的 Konva Stage对象
   * @returns 返回第一个图层作为背景图层
   * @protected
   */
  getBgLayer(e) {
    return e ? e.getLayers()[0] : this.konvaStage.getLayers()[0];
  }
  /**
   * 删除指定 ID 的形状组，并在Stage上销毁对应的 Konva.Group 对象。
   * @param id 要删除的形状组的 ID
   * @protected
   */
  delShapeGroup(e) {
    this.shapeGroupStore.delete(e);
    const t = this.konvaStage.findOne((o) => o.getType() === "Group" && o.id() === e);
    t && t.destroy();
  }
  /**
   * @description 获取指定 ID 的形状组。
   * @param id
   * @returns
   */
  getShapeGroupById(e) {
    return this.konvaStage.findOne((o) => o.getType() === "Group" && o.id() === e);
  }
  /**
   * 设置指定 ID 的形状组为已完成状态，并触发添加事件。
   * @protected
   */
  setShapeGroupDone({
    id: e,
    contentsObj: t,
    color: o
  }) {
    const r = this.shapeGroupStore.get(e);
    r && (r.isDone = !0, this.dispatchAddEvent({
      shapeGroup: r,
      contentsObj: t,
      color: o
    }));
  }
  /**
   * @description 设置指定 ID 的形状组的更改状态，并触发更改事件。
   */
  setChanged(e, t) {
    this.dispatchChangedEvent(e, t);
  }
  /**
   * 获取当前形状组中指定类型的子节点。
   * @param className Konva 形状的类名，例如 'Rect'
   * @returns 返回符合指定类名的节点数组
   * @protected
   */
  getNodesByClassName(e) {
    return this.currentShapeGroup?.konvaGroup.getChildren((o) => o.getClassName() === e);
  }
  /**
   * 获取指定 Konva.Group 中指定类型的子节点。
   * @param group 指定的 Konva.Group 对象
   * @param className Konva 形状的类名，例如 'Rect'
   * @returns 返回符合指定类名的节点数组
   * @protected
   */
  getGroupNodesByClassName(e, t) {
    return e.getChildren((r) => r.getClassName() === t);
  }
  /**
   * 更新 shapeGroupStore 中指定 ID 的 Konva.Group 对象。
   * @param id 需要更新的形状组的 ID
   * @param newKonvaGroup 用于更新的新 Konva.Group 对象
   * @returns 返回更新后的形状组对象，如果未找到对应 ID 的形状组则返回 null
   * @protected
   */
  updateKonvaGroup(e, t) {
    if (this.shapeGroupStore.has(e)) {
      const o = this.shapeGroupStore.get(e);
      if (o)
        return o.konvaGroup = t, this.shapeGroupStore.set(e, o), o;
    } else
      console.warn(`ShapeGroup with id ${e} not found.`);
    return null;
  }
  /**
   * 创建一个新的形状组，并添加到 shapeGroupStore 中。
   * @returns 返回新创建的形状组对象
   * @protected
   */
  createShapeGroup() {
    const e = Bo(), t = new M.Group({
      // 创建新的 Konva.Group 对象
      draggable: !1,
      name: _e,
      id: e
    }), o = {
      // 创建形状组对象
      id: e,
      konvaGroup: t,
      pageNumber: this.pageNumber,
      annotation: this.currentAnnotation,
      isDone: !1
    };
    return this.shapeGroupStore.set(e, o), o;
  }
  // 抽象方法，子类需实现具体样式更新逻辑
  /**
   * 激活编辑器，重新设置 Konva Stage和当前注解对象，并启用编辑模式。
   * @param konvaStage 新的 Konva Stage对象
   * @param annotation 新的注解对象
   */
  activate(e, t) {
    this.konvaStage = e, this.currentAnnotation = t, this.isPainting = !1, this.disableEditMode(), this.enableEditMode();
  }
  /**
   * 将序列化的 Konva.Group 添加到图层。
   * @param konvaStage Konva Stage对象
   * @param konvaString 序列化的 Konva.Group 字符串表示
   */
  addSerializedGroupToLayer(e, t) {
    const o = M.Node.create(t);
    this.registerSerializedGroup(e, o);
  }
  /**
   * 将反序列化的 Group 绑定到当前 Stage，并让 Store 始终指向当前页面上的节点。
   */
  registerSerializedGroup(e, t) {
    this.konvaStage = e;
    const o = t.id(), r = e.findOne(
      (s) => s.getType() === "Group" && s.id() === o
    );
    return r ? (t.destroy(), this.storeSerializedGroup(r), { konvaGroup: r, added: !1 }) : (t.draggable(!1), this.getBgLayer(e).add(t), this.storeSerializedGroup(t), { konvaGroup: t, added: !0 });
  }
  storeSerializedGroup(e) {
    const t = e.id(), o = this.shapeGroupStore.get(t);
    this.shapeGroupStore.set(t, {
      ...o,
      id: t,
      konvaGroup: e,
      pageNumber: this.pageNumber,
      isDone: !0
    });
  }
  /**
   * 删除指定 ID 的形状组。
   * @param id 要删除的形状组的 ID
   */
  deleteGroup(e, t) {
    this.konvaStage = t, this.delShapeGroup(e);
  }
  /**
   * @description 更新指定 ID 的形状组的样式。
   * @param annotationStore
   * @param style
   */
  updateStyle(e, t) {
    this.changeStyle(e, t);
  }
  /**
   * 静态属性，存储所有的 Timer 实例。
   */
  static Timer = {};
  /**
   * 静态方法，清除指定页面的定时器。
   * @param pageNumber 页面编号
   */
  static TimerClear(e) {
    const t = Ee.Timer[e];
    t && window.clearTimeout(t);
  }
  /**
   * 静态方法，启动指定页面的定时器。
   * @param pageNumber 页面编号
   * @param callback 定时器回调函数，接受页面编号作为参数
   */
  static TimerStart(e, t) {
    Ee.Timer[e] = window.setTimeout(() => {
      typeof t == "function" && t(e);
    }, 1e3);
  }
}
class Is extends Ee {
  ellipse;
  // 当前正在绘制的椭圆对象
  vertex;
  // 用于存储椭圆的起点（顶点）坐标
  /**
   * 构造函数，初始化椭圆编辑器。
   * @param EditorOptions 编辑器选项接口
   */
  constructor(e) {
    super({ ...e, editorType: R.CIRCLE }), this.ellipse = null, this.vertex = { x: 0, y: 0 };
  }
  /**
   * 处理鼠标或触摸指针按下事件，开始绘制椭圆。
   * @param e Konva 事件对象
   */
  mouseDownHandler(e) {
    if (e.currentTarget !== this.konvaStage)
      return;
    this.ellipse = null, this.isPainting = !0, this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup);
    const t = this.konvaStage.getRelativePointerPosition();
    t && (this.vertex = { x: t.x, y: t.y }, this.ellipse = new M.Ellipse({
      radiusX: 0,
      radiusY: 0,
      x: t.x,
      y: t.y,
      // do not scale strokes
      strokeScaleEnabled: !1,
      visible: !1,
      // 初始状态为不可见
      stroke: this.currentAnnotation.style.color,
      // 设置椭圆边框颜色
      strokeWidth: this.currentAnnotation.style.strokeWidth,
      // 设置椭圆边框宽度
      opacity: this.currentAnnotation.style.opacity
      // 设置椭圆透明度
    }), this.currentShapeGroup.konvaGroup.add(this.ellipse), window.addEventListener("mouseup", this.globalPointerUpHandler));
  }
  /**
   * 处理鼠标或触摸指针移动事件，绘制椭圆。
   * @param e Konva 事件对象
   */
  mouseMoveHandler(e) {
    if (!this.isPainting)
      return;
    e.evt.preventDefault(), this.ellipse?.show();
    const t = this.konvaStage.getRelativePointerPosition();
    if (!t)
      return;
    const o = Math.abs(t.x - this.vertex.x) / 2, r = Math.abs(t.y - this.vertex.y) / 2, s = {
      x: (t.x - this.vertex.x) / 2 + this.vertex.x,
      y: (t.y - this.vertex.y) / 2 + this.vertex.y,
      radiusX: o,
      radiusY: r
    };
    this.ellipse?.setAttrs(s);
  }
  /**
   * 处理鼠标或触摸指针释放事件，完成椭圆的绘制。
   */
  mouseUpHandler() {
    if (!this.isPainting || (this.isPainting = !1, !this.ellipse))
      return;
    const e = this.ellipse.getParent();
    if (!e) {
      this.ellipse = null;
      return;
    }
    if (!this.ellipse.isVisible() && e.getType() === "Group") {
      this.delShapeGroup(e.id()), this.ellipse = null;
      return;
    }
    if (this.isTooSmall()) {
      this.ellipse.destroy(), this.delShapeGroup(e.id()), this.ellipse = null;
      return;
    }
    this.setShapeGroupDone({
      id: e.id(),
      color: this.currentAnnotation.style.color,
      contentsObj: {
        text: ""
      }
    }), this.ellipse = null;
  }
  /**
   * 全局鼠标释放事件处理器，仅处理左键释放事件。
   * @param e MouseEvent 对象
   */
  globalPointerUpHandler = (e) => {
    e.button === 0 && (this.mouseUpHandler(), window.removeEventListener("mouseup", this.globalPointerUpHandler));
  };
  /**
   * 判断椭圆是否太小。
   * @returns 如果椭圆的宽度或高度小于最小尺寸，返回 true，否则返回 false。
   */
  isTooSmall() {
    if (!this.ellipse) return !0;
    const { width: e, height: t } = this.ellipse.size();
    return Math.max(e, t) < Ee.MinSize;
  }
  /**
   * @description 更改注释样式
   * @param annotationStore
   * @param styles
   */
  changeStyle(e, t) {
    const o = e.id, r = this.getShapeGroupById(o);
    if (r) {
      r.getChildren().forEach((i) => {
        i instanceof M.Ellipse && (t.color !== void 0 && i.stroke(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(o, s);
    }
  }
}
class Ms extends Ee {
  line;
  // 当前正在绘制的自由曲线
  /**
   * 构造函数，初始化自由手绘编辑器。
   * @param EditorOptions 编辑器选项接口
   */
  constructor(e) {
    super({ ...e, editorType: R.FREEHAND }), this.line = null;
  }
  /**
   * 处理鼠标或触摸指针按下事件，开始绘制自由曲线。
   * @param e Konva 事件对象
   */
  mouseDownHandler(e) {
    if (e.currentTarget !== this.konvaStage)
      return;
    Ee.TimerClear(this.pageNumber), this.line = null, this.isPainting = !0, this.currentShapeGroup || (this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup));
    const t = this.konvaStage.getRelativePointerPosition();
    t && (this.line = new M.Line({
      // do not scale strokes
      strokeScaleEnabled: !1,
      stroke: this.currentAnnotation.style.color,
      // 设置线条颜色
      strokeWidth: this.currentAnnotation.style.strokeWidth,
      // 设置线条宽度
      opacity: this.currentAnnotation.style.opacity,
      // 设置线条透明度
      lineCap: "round",
      // 设置线条端点为圆形
      lineJoin: "round",
      // 设置线条连接处为圆形
      hitStrokeWidth: 20,
      // 设置点击检测的宽度
      visible: !1,
      // 初始化为不可见
      globalCompositeOperation: "source-over",
      points: [t.x, t.y, t.x, t.y]
      // 初始化起始点
    }), this.currentShapeGroup.konvaGroup.add(this.line), window.addEventListener("mouseup", this.globalPointerUpHandler));
  }
  /**
   * 处理鼠标或触摸指针移动事件，绘制自由曲线。
   * @param e Konva 事件对象
   */
  mouseMoveHandler(e) {
    if (!this.isPainting || !this.line)
      return;
    e.evt.preventDefault(), this.line.show();
    const t = this.konvaStage.getRelativePointerPosition();
    if (!t) {
      this.line = null;
      return;
    }
    const o = this.line.points().concat([t.x, t.y]);
    this.line.points(o);
  }
  /**
   * 处理鼠标或触摸指针释放事件，完成自由曲线的绘制。
   */
  mouseUpHandler() {
    if (!this.isPainting || !this.line)
      return;
    this.isPainting = !1;
    const e = this.line.getParent();
    if (!e) {
      this.line = null;
      return;
    }
    if (this.isTooSmall()) {
      this.line.destroy(), Ee.TimerStart(this.pageNumber, () => {
        this.setShapeGroupDone({
          id: e.id(),
          color: this.currentAnnotation.style.color,
          contentsObj: {
            text: ""
          }
        }), this.currentShapeGroup = null;
      }), this.line = null;
      return;
    }
    Ee.TimerStart(this.pageNumber, () => {
      this.setShapeGroupDone({
        id: e.id(),
        color: this.currentAnnotation.style.color,
        contentsObj: {
          text: ""
        }
      }), this.currentShapeGroup = null;
    }), this.line = null;
  }
  /**
   * 全局鼠标释放事件处理器，仅处理左键释放事件。
   * @param e MouseEvent 对象
   */
  globalPointerUpHandler = (e) => {
    e.button === 0 && (this.mouseUpHandler(), window.removeEventListener("mouseup", this.globalPointerUpHandler));
  };
  /**
   * 判断当前绘制的曲线是否太小。
   * @returns 如果曲线点集长度小于 5 返回 true，否则返回 false
   */
  isTooSmall() {
    return this.line ? this.line.points().length < Ee.MinSize : !0;
  }
  /**
   * @description 更改注释样式
   * @param annotationStore
   * @param styles
   */
  changeStyle(e, t) {
    const o = e.id, r = this.getShapeGroupById(o);
    if (r) {
      r.getChildren().forEach((i) => {
        i instanceof M.Line && (t.color !== void 0 && i.stroke(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(o, s);
    }
  }
}
class Ds extends Ee {
  line;
  // 当前正在绘制的自由曲线
  constructor(e) {
    super({ ...e, editorType: R.FREE_HIGHLIGHT }), this.line = null;
  }
  /**
   * 处理鼠标或触摸指针按下事件，开始绘制自由曲线。
   * @param e Konva 事件对象
   */
  mouseDownHandler(e) {
    if (e.currentTarget !== this.konvaStage)
      return;
    this.line = null, this.isPainting = !0, this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup);
    const t = this.konvaStage.getRelativePointerPosition();
    t && (this.line = new M.Line({
      // do not scale strokes
      strokeScaleEnabled: !1,
      stroke: this.currentAnnotation.style.color,
      strokeWidth: this.currentAnnotation.style.strokeWidth,
      opacity: this.currentAnnotation.style.opacity,
      hitStrokeWidth: this.currentAnnotation.style.strokeWidth,
      lineCap: "round",
      lineJoin: "round",
      visible: !1,
      globalCompositeOperation: "source-over",
      points: [t.x, t.y]
      // 初始化起始点
    }), this.currentShapeGroup.konvaGroup.add(this.line), window.addEventListener("mouseup", this.globalPointerUpHandler));
  }
  /**
   * 处理鼠标或触摸指针移动事件，绘制自由曲线。
   * @param e Konva 事件对象
   */
  mouseMoveHandler(e) {
    if (!this.isPainting || !this.line)
      return;
    e.evt.preventDefault(), this.line.show();
    const t = this.konvaStage.getRelativePointerPosition();
    if (!t)
      return;
    const o = this.line.points().concat([t.x, t.y]);
    this.line.points(o);
  }
  /**
   * 处理鼠标或触摸指针释放事件，完成自由曲线的绘制。
   */
  mouseUpHandler() {
    if (!this.isPainting || !this.line)
      return;
    this.isPainting = !1;
    const e = this.line?.getParent();
    if (e && !this.line.isVisible() && e.getType() === "Group") {
      this.delShapeGroup(e.id());
      return;
    }
    if (this.isTooSmall()) {
      this.line?.destroy(), e && this.delShapeGroup(e.id()), this.line = null;
      return;
    }
    if (this.line && e) {
      const t = this.line.points(), o = this.correctLineIfStraight(t);
      this.line.points(o), this.setShapeGroupDone({
        id: e.id(),
        color: this.currentAnnotation.style.color,
        contentsObj: {
          text: ""
        }
      }), this.line = null;
    }
  }
  /**
   * 全局鼠标释放事件处理器，仅处理左键释放事件。
   * @param e MouseEvent 对象
   */
  globalPointerUpHandler = (e) => {
    e.button === 0 && (this.mouseUpHandler(), window.removeEventListener("mouseup", this.globalPointerUpHandler));
  };
  /**
   * 修正接近水平或垂直的线条，使其成为完全水平或垂直的直线。
   * @param points 曲线的点集
   * @returns 修正后的点集
   */
  correctLineIfStraight(e) {
    if (e.length < 4)
      return e;
    const t = 2, o = e[0], r = e[1], s = e[e.length - 2], i = e[e.length - 1], a = s - o, l = i - r;
    if (a === 0 && l !== 0)
      return e.map((g, f) => f % 2 === 0 ? o : g);
    if (l === 0 && a !== 0)
      return e.map((g, f) => f % 2 === 0 ? g : r);
    if (a === 0 && l === 0)
      return e;
    const u = Math.atan2(l, a), d = Math.abs(u * (180 / Math.PI)), h = d <= t || d >= 180 - t || d >= 90 - t && d <= 90 + t && Math.abs(a) > Math.abs(l), p = d >= 90 - t && d <= 90 + t && Math.abs(l) > Math.abs(a) || d >= 180 - t || d <= t;
    return h ? e.map((g, f) => f % 2 === 0 ? g : r) : p ? e.map((g, f) => f % 2 === 0 ? o : g) : e;
  }
  /**
   * 判断当前绘制的曲线是否太小。
   * @returns 如果曲线点集长度小于 5 返回 true，否则返回 false
   */
  isTooSmall() {
    return (this.line?.points().length || 0) < 5;
  }
  /**
   * @description 更改注释样式
   * @param annotationStore
   * @param styles
   */
  changeStyle(e, t) {
    const o = e.id, r = this.getShapeGroupById(o);
    if (r) {
      r.getChildren().forEach((i) => {
        i instanceof M.Line && (t.color !== void 0 && i.stroke(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(o, s);
    }
  }
}
const Ls = {
  placement: "bottom-start",
  middleware: [Po()]
}, En = 200;
class _s {
  resolveFunction = null;
  container = null;
  inputElement = null;
  isActive = !1;
  isCleaningUp = !1;
  show(e, t, o, r) {
    return this.isActive && this.handleConfirm(), this.isActive = !0, this.isCleaningUp = !1, new Promise((s) => {
      this.resolveFunction = s, this.container = document.createElement("div"), this.container.id = $o, Object.assign(this.container.style, {
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: "1000"
      }), document.body.appendChild(this.container), Yt({
        getBoundingClientRect: () => ({
          x: e.x,
          y: e.y,
          top: e.y,
          left: e.x,
          bottom: e.y,
          right: e.x,
          width: 0,
          height: 0,
          toJSON: () => {
          }
        })
      }, this.container, Ls).then(({ x: a, y: l }) => {
        Object.assign(this.container.style, {
          left: `${a}px`,
          top: `${l}px`
        }), this.renderInputComponent(t, o, r);
      });
    });
  }
  renderInputComponent(e, t, o) {
    if (!this.container) return;
    const r = document.createElement("div"), s = document.createElement("textarea");
    s.placeholder = Te.t("annotator:editor.text.startTyping"), Object.assign(s.style, {
      minHeight: "40px",
      width: `${En}px`,
      padding: "8px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      border: "none !important",
      borderRadius: "4px",
      resize: "vertical",
      fontFamily: "inherit",
      fontSize: `${e}px`,
      color: t
    }), s.addEventListener("focus", () => {
      Object.assign(s.style, {
        outline: t,
        boxShadow: `0 0 0 1px ${o}`
      });
    }), s.addEventListener("blur", () => {
      Object.assign(s.style, {
        boxShadow: "none"
      });
    }), s.addEventListener("keydown", (i) => {
      i.key === "Enter" && !i.shiftKey ? (i.preventDefault(), this.handleConfirm()) : i.key === "Escape" && (i.preventDefault(), this.handleCancel());
    }), s.addEventListener("blur", () => {
      this.isCleaningUp || (this.inputElement && this.inputElement.value.trim() !== "" ? this.handleConfirm() : this.handleCancel());
    }), this.inputElement = s, r.appendChild(s), this.container.appendChild(r), setTimeout(() => {
      s && s.focus();
    }, 100);
  }
  handleConfirm() {
    if (this.resolveFunction && this.inputElement) {
      const e = this.inputElement.value;
      this.resolveFunction(e), this.cleanup();
    }
  }
  handleCancel() {
    this.resolveFunction && (this.resolveFunction(""), this.cleanup());
  }
  cleanup() {
    if (!this.isCleaningUp) {
      if (this.isCleaningUp = !0, this.container && this.container.parentNode)
        try {
          this.container.parentNode.removeChild(this.container);
        } catch {
        }
      this.resolveFunction = null, this.container = null, this.inputElement = null, this.isActive = !1;
    }
  }
}
const Os = new _s();
async function Hs(n, e, t, o) {
  return Os.show(n, e, t, o);
}
class Gs extends Ee {
  /**
   * 创建一个 EditorFreeText 实例。
   * @param EditorOptions 初始化编辑器的选项
   */
  constructor(e) {
    super({ ...e, editorType: R.FREETEXT });
  }
  mouseDownHandler() {
  }
  mouseMoveHandler() {
  }
  /**
   * 处理鼠标抬起事件，创建输入区域。
   * @param e Konva 事件对象
   */
  async mouseUpHandler(e) {
    const t = this.konvaStage.getRelativePointerPosition();
    if (!t)
      return;
    const o = this.konvaStage.scale(), r = this.konvaStage.container();
    if (e.currentTarget !== this.konvaStage)
      return;
    this.isPainting = !0, this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup);
    const s = r.getBoundingClientRect(), i = s.left + t.x * o.x, a = s.top + t.y * o.y, l = await Hs(
      { x: i, y: a },
      this.currentAnnotation.style.fontSize,
      this.currentAnnotation.style.color,
      this.primaryColor
    );
    this.inputDoneHandler(l, o, t, this.currentAnnotation.style.color, this.currentAnnotation.style.fontSize);
  }
  /**
   * 处理输入完成后的操作。
   * @param inputValue string 输入值
   * @param scale 缩放比例
   * @param pos 相对位置坐标
   */
  async inputDoneHandler(e, t, o, r, s) {
    const i = e.trim();
    if (i === "") {
      this.delShapeGroup(this.currentShapeGroup.id), this.currentShapeGroup = null;
      return;
    }
    const l = new M.Text({
      text: i,
      fontSize: s,
      padding: 2
    }).width(), u = l > En ? En : l, d = new M.Text({
      x: o.x,
      y: o.y + 2,
      text: i,
      width: u,
      fontSize: s,
      fill: r,
      wrap: "word"
    });
    this.currentShapeGroup?.konvaGroup.add(d);
    const h = this.currentShapeGroup?.konvaGroup.id();
    h && this.setShapeGroupDone({
      id: h,
      contentsObj: {
        text: i
      },
      color: r
    });
  }
  /**
   * @description 更改注释样式
   * @param annotationStore
   * @param styles
   */
  changeStyle(e, t) {
    const o = e.id, r = this.getShapeGroupById(o);
    if (r) {
      r.getChildren().forEach((i) => {
        i instanceof M.Text && (t.color !== void 0 && i.fill(t.color), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(o, s);
    }
  }
}
class Yn extends Ee {
  /**
   * 创建一个 EditorHighLight 实例。
   * @param EditorOptions 初始化编辑器的选项
   * @param editorType 注释类型
   */
  constructor(e, t) {
    super({ ...e, editorType: t });
  }
  /**
   * 将网页上选中文字区域转换为图形并绘制在 Canvas 上。
   *
   * 采用「按行分组 → 行内合并去重叠」策略：
   * 1. 收集所有 span 的 canvas 坐标矩形
   * 2. 按 Y 坐标分组（同一行）
   * 3. 行内按 X 排序，合并相邻/重叠矩形
   * 4. 每个合并后的行段只画一个矩形
   *
   * 避免了逐 span 画矩形时因文字间距过近导致的重叠视觉瑕疵。
   *
   * @param elements HTMLSpanElement 数组，表示要绘制的元素
   * @param fixElement 用于修正计算的元素
   */
  convertTextSelection(e, t, o) {
    this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup);
    const r = t.getBoundingClientRect(), s = e.map((a) => {
      const l = a.getBoundingClientRect();
      return this.calculateRelativePosition(l, r);
    });
    this.mergeSpanRectsByRow(s).forEach((a) => {
      const l = this.createShape(a.x, a.y, a.width, a.height);
      this.currentShapeGroup.konvaGroup.add(l);
    }), this.setShapeGroupDone({
      id: this.currentShapeGroup.id,
      contentsObj: {
        text: "",
        selectedText: o ?? this.getSelectedText(e)
      },
      color: this.currentAnnotation.style.color
    });
  }
  /**
   * 将 span canvas 矩形按行分组 + 行内合并，消除重叠。
   *
   * 分组依据：Y 坐标差 < ROW_TOLERANCE 视为同一行。
   * 合并依据：相邻矩形水平间隙 ≤ MERGE_GAP 则合并。
   *
   * @param rects span 矩形数组
   * @returns 合并后的矩形数组（每行一个或多个不重叠的段）
   */
  mergeSpanRectsByRow(e) {
    if (e.length === 0) return [];
    const t = 2, o = 1, r = [...e].sort((u, d) => u.y - d.y), s = [];
    let i = [r[0]], a = r[0].y;
    for (let u = 1; u < r.length; u++)
      Math.abs(r[u].y - a) < t ? i.push(r[u]) : (s.push(i), i = [r[u]], a = r[u].y);
    s.push(i);
    const l = [];
    for (const u of s) {
      u.sort((h, p) => h.x - p.x);
      let d = { ...u[0] };
      for (let h = 1; h < u.length; h++) {
        const p = u[h], g = d.x + d.width;
        if (p.x - g <= o) {
          const S = p.x + p.width;
          d.width = Math.max(g, S) - d.x, d.height = Math.max(d.height, p.height), d.y = Math.min(d.y, p.y);
        } else
          l.push({ ...d }), d = { ...p };
      }
      l.push({ ...d });
    }
    return l;
  }
  /**
   * 获取所有 elements 内部文字。
   * @param elements HTMLSpanElement 数组
   * @returns 所有元素内部文字的字符串
   */
  getSelectedText(e) {
    return e.map((t) => t.textContent || "").join("").replace(/\s+/g, " ").trim();
  }
  /**
   * 计算元素的相对位置和尺寸，适配 Canvas 坐标系。
   * @param elementBounding 元素的边界矩形
   * @param fixBounding 基准元素的边界矩形
   * @returns 相对位置和尺寸的对象 { x, y, width, height }
   */
  calculateRelativePosition(e, t) {
    const o = this.konvaStage.scale(), r = (e.x - t.x) / o.x, s = (e.y - t.y) / o.y, i = e.width / o.x, a = e.height / o.y;
    return { x: r, y: s, width: i, height: a };
  }
  /**
   * 根据当前的注释类型创建对应的形状。
   * @param x 形状的 X 坐标
   * @param y 形状的 Y 坐标
   * @param width 形状的宽度
   * @param height 形状的高度
   * @returns Konva.Shape 具体类型的形状
   */
  createShape(e, t, o, r) {
    switch (this.currentAnnotation.type) {
      case R.HIGHLIGHT:
        return this.createHighlightShape(e, t, o, r);
      case R.UNDERLINE:
        return this.createUnderlineShape(e, t, o, r);
      case R.STRIKEOUT:
        return this.createStrikeoutShape(e, t, o, r);
      default:
        throw new Error(`Unsupported annotation type: ${this.currentAnnotation.type}`);
    }
  }
  /**
   * 创建高亮形状。
   * @param x 形状的 X 坐标
   * @param y 形状的 Y 坐标
   * @param width 形状的宽度
   * @param height 形状的高度
   * @returns Konva.Rect 高亮形状对象
   */
  createHighlightShape(e, t, o, r) {
    return new M.Rect({
      x: e,
      y: t,
      width: o,
      height: r,
      opacity: 0.5,
      fill: this.currentAnnotation.style.color
    });
  }
  /**
   * 创建下划线形状。
   * @param x 形状的 X 坐标
   * @param y 形状的 Y 坐标
   * @param width 形状的宽度
   * @param height 形状的高度
   * @returns Konva.Rect 下划线形状对象
   */
  createUnderlineShape(e, t, o, r) {
    return new M.Rect({
      x: e,
      y: r + t - 2,
      width: o,
      fill: this.currentAnnotation.style.color,
      opacity: 1,
      hitStrokeWidth: 10,
      height: 1.5
    });
  }
  /**
   * 创建删除线形状。
   * @param x 形状的 X 坐标
   * @param y 形状的 Y 坐标
   * @param width 形状的宽度
   * @param height 形状的高度
   * @returns Konva.Rect 删除线形状对象
   */
  createStrikeoutShape(e, t, o, r) {
    return new M.Rect({
      x: e,
      y: t + r / 2,
      width: o,
      fill: this.currentAnnotation.style.color,
      opacity: 1,
      hitStrokeWidth: 10,
      height: 2
    });
  }
  /**
   * 处理鼠标按下事件，目前未实现具体逻辑。
   */
  mouseDownHandler() {
  }
  /**
   * 处理鼠标移动事件，目前未实现具体逻辑。
   */
  mouseMoveHandler() {
  }
  /**
   * 处理鼠标抬起事件，目前未实现具体逻辑。
   */
  mouseUpHandler() {
  }
  /**
   * @description 更改注释样式
   * @param annotationStore
   * @param styles
   */
  changeStyle(e, t) {
    const o = e.id, r = this.getShapeGroupById(o);
    if (r) {
      r.getChildren().forEach((i) => {
        e.type === R.HIGHLIGHT && i instanceof M.Rect && (t.color !== void 0 && i.fill(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity)), e.type === R.UNDERLINE && i instanceof M.Rect && (t.color !== void 0 && i.fill(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity)), e.type === R.STRIKEOUT && i instanceof M.Rect && (t.color !== void 0 && i.stroke(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(o, s);
    }
  }
}
class Us extends Ee {
  rect;
  // 当前正在绘制的矩形对象
  vertex;
  // 矩形的起始顶点坐标
  /**
   * 创建一个 EditorRectangle 实例。
   * @param EditorOptions 初始化编辑器的选项
   */
  constructor(e) {
    super({ ...e, editorType: R.RECTANGLE }), this.rect = null, this.vertex = { x: 0, y: 0 };
  }
  /**
   * 处理鼠标按下事件的方法，创建新的矩形对象并添加到舞台。
   * @param e Konva 事件对象
   */
  mouseDownHandler(e) {
    if (e.currentTarget !== this.konvaStage)
      return;
    this.rect = null, this.isPainting = !0, this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup);
    const t = this.konvaStage.getRelativePointerPosition();
    t && (this.vertex = { x: t.x, y: t.y }, this.rect = new M.Rect({
      x: t.x,
      y: t.y,
      width: 0,
      height: 0,
      // do not scale strokes
      strokeScaleEnabled: !1,
      visible: !1,
      stroke: this.currentAnnotation.style.color,
      strokeWidth: this.currentAnnotation.style.strokeWidth || 2,
      opacity: this.currentAnnotation.style.opacity
    }), this.currentShapeGroup.konvaGroup.add(this.rect), window.addEventListener("mouseup", this.globalPointerUpHandler));
  }
  /**
   * 处理鼠标移动事件的方法，实时更新绘制的矩形对象的大小和位置。
   * @param e Konva 事件对象
   */
  mouseMoveHandler(e) {
    if (!this.isPainting)
      return;
    e.evt.preventDefault(), this.rect?.show();
    const t = this.konvaStage.getRelativePointerPosition();
    if (!t)
      return;
    const o = {
      x: Math.min(this.vertex.x, t.x),
      y: Math.min(this.vertex.y, t.y),
      width: Math.abs(t.x - this.vertex.x),
      height: Math.abs(t.y - this.vertex.y)
    };
    this.rect?.setAttrs(o);
  }
  /**
   * 处理鼠标抬起事件的方法，完成矩形的绘制并更新到 PDF.js 注解存储。
   */
  mouseUpHandler() {
    if (!this.isPainting || (this.isPainting = !1, !this.rect))
      return;
    const e = this.rect.getParent();
    if (!e) {
      this.rect = null;
      return;
    }
    if (!this.rect.isVisible() && e.getType() === "Group") {
      this.delShapeGroup(e.id());
      return;
    }
    if (this.isTooSmall()) {
      this.rect.destroy(), this.delShapeGroup(e.id()), this.rect = null;
      return;
    }
    this.setShapeGroupDone({
      id: e.id(),
      color: this.currentAnnotation.style.color,
      contentsObj: {
        text: ""
      }
    }), this.rect = null;
  }
  /**
   * 全局鼠标抬起事件处理器，仅处理左键释放事件。
   * @param e MouseEvent 对象
   */
  globalPointerUpHandler = (e) => {
    e.button === 0 && (this.mouseUpHandler(), window.removeEventListener("mouseup", this.globalPointerUpHandler));
  };
  /**
   * 判断矩形是否太小（小于最小允许大小）。
   * @returns 如果矩形太小返回 true，否则返回 false
   */
  isTooSmall() {
    if (!this.rect) return !0;
    const { width: e, height: t } = this.rect.size();
    return Math.max(e, t) < Ee.MinSize;
  }
  /**
   * @description 更改注释样式
   * @param annotationStore
   * @param styles
   */
  changeStyle(e, t) {
    const o = e.id, r = this.getShapeGroupById(o);
    if (r) {
      r.getChildren().forEach((i) => {
        i instanceof M.Rect && (t.color !== void 0 && i.stroke(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(o, s);
    }
  }
}
class Kn extends Ee {
  signatureUrl;
  // 签名图片的 URL
  signatureImage;
  // Konva.Image 对象用于显示签名图片
  /**
   * 创建一个 EditorSignature 实例。
   * @param EditorOptions 初始化编辑器的选项
   * @param defaultSignatureUrl 默认的签名图片 URL
   */
  constructor(e, t) {
    super({ ...e, editorType: R.SIGNATURE }), this.signatureUrl = t, this.signatureImage = null, t && this.createCursorImg();
  }
  /**
   * 创建光标图像，并设置 CSS 自定义属性。
   */
  createCursorImg() {
    const e = new M.Group({
      draggable: !1
    });
    this.signatureUrl && M.Image.fromURL(this.signatureUrl, (t) => {
      const { width: o, height: r } = t.getClientRect(), { newWidth: s, newHeight: i } = Jt(o, r, 96), a = { x: s / 2, y: i / 2 }, l = new M.Rect({
        x: 0,
        y: 0,
        width: s,
        height: i,
        stroke: this.primaryColor,
        strokeWidth: 2,
        cornerRadius: 2
      }), u = new M.Rect({
        x: 0,
        y: 0,
        width: s,
        height: i,
        cornerRadius: 6,
        shadowColor: "rgba(0,0,0,0.25)",
        shadowBlur: 12,
        shadowOffset: { x: 0, y: 2 },
        shadowOpacity: 0.35
      });
      t.setAttrs({
        x: 0,
        y: 0,
        width: s,
        height: i,
        opacity: 0.92
      });
      const d = new M.Circle({
        x: a.x,
        y: a.y,
        radius: 7,
        strokeWidth: 0,
        fill: "rgba(255,255,255,0.8)"
      }), h = new M.Circle({
        x: a.x,
        y: a.y,
        radius: 4,
        fill: this.primaryColor,
        opacity: 0.9
      });
      e.add(u), e.add(l), e.add(t), e.add(d), e.add(h);
      const p = e.toDataURL();
      e.destroy(), Wo(
        Lt,
        `url(${p}) ${a.x} ${a.y}, default`
      );
    });
  }
  /**
   * 处理鼠标按下事件的方法，创建新的形状组并添加签名图片。
   * @param e Konva 事件对象
   */
  mouseDownHandler(e) {
    if (e.currentTarget !== this.konvaStage)
      return;
    this.signatureImage = null, this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup);
    const t = this.konvaStage.getRelativePointerPosition();
    this.signatureUrl && t && M.Image.fromURL(this.signatureUrl, async (o) => {
      const { width: r, height: s } = o.getClientRect(), { newWidth: i, newHeight: a } = Jt(r, s, 120), l = { x: i / 2, y: a / 2 };
      this.signatureImage = o, this.signatureImage.setAttrs({
        x: t.x - l.x,
        y: t.y - l.y,
        width: i,
        height: a,
        base64: this.signatureUrl
      }), this.currentShapeGroup?.konvaGroup.add(this.signatureImage), this.konvaStage.draw();
      const u = this.currentShapeGroup?.konvaGroup.id();
      u && (this.setShapeGroupDone({
        id: u,
        contentsObj: {
          text: "",
          image: this.signatureUrl || void 0
        }
      }), this.signatureImage = null);
    });
  }
  /**
   * 激活编辑器并设置签名图片。
   * @param konvaStage Konva 舞台对象
   * @param annotation 新的注解对象
   * @param signatureUrl 签名图片的 URL
   */
  activateWithSignature(e, t, o) {
    super.activate(e, t), this.signatureUrl = o, o && this.createCursorImg();
  }
  /**
   * 将序列化的 Konva.Group 添加到图层，并恢复其中的签名图片。
   * @param konvaStage Konva 舞台对象
   * @param konvaString 序列化的 Konva.Group 字符串表示
   */
  addSerializedGroupToLayer(e, t) {
    const o = M.Node.create(t), { konvaGroup: r, added: s } = this.registerSerializedGroup(e, o);
    if (!s) return;
    const i = this.getGroupNodesByClassName(r, "Image")[0];
    if (!i) return;
    const a = i.getAttr("base64");
    a && M.Image.fromURL(a, (l) => {
      l.setAttrs(i.getAttrs()), i.destroy(), r.add(l), r.getLayer()?.batchDraw(), r.fire(sn);
    });
  }
  // 下面是未实现的抽象方法的空实现
  mouseMoveHandler() {
  }
  mouseUpHandler() {
  }
  changeStyle() {
  }
}
class Xn extends Ee {
  stampUrl;
  // 签章图片的 URL
  stampImage;
  // Konva.Image 对象用于显示签章图片
  /**
   * 创建一个 EditorStamp 实例。
   * @param EditorOptions 初始化编辑器的选项
   * @param defaultStampUrl 默认的签章图片 URL
   */
  constructor(e, t) {
    super({ ...e, editorType: R.STAMP }), this.stampUrl = t, this.stampImage = null, t && this.createCursorImg();
  }
  /**
   * 创建光标图像，并设置 CSS 自定义属性。
   */
  createCursorImg() {
    const e = new M.Group({
      draggable: !1
    });
    this.stampUrl && M.Image.fromURL(this.stampUrl, (t) => {
      const { width: o, height: r } = t.getClientRect(), { newWidth: s, newHeight: i } = Jt(o, r, 96), a = { x: s / 2, y: i / 2 }, l = new M.Rect({
        x: 0,
        y: 0,
        width: s,
        height: i,
        stroke: this.primaryColor,
        strokeWidth: 2,
        cornerRadius: 2
      }), u = new M.Rect({
        x: 0,
        y: 0,
        width: s,
        height: i,
        cornerRadius: 6,
        shadowColor: "rgba(0,0,0,0.25)",
        shadowBlur: 12,
        shadowOffset: { x: 0, y: 2 },
        shadowOpacity: 0.35
      });
      t.setAttrs({
        x: 0,
        y: 0,
        width: s,
        height: i,
        opacity: 0.92
      });
      const d = new M.Circle({
        x: a.x,
        y: a.y,
        radius: 7,
        strokeWidth: 0,
        fill: "rgba(255,255,255,0.8)"
      }), h = new M.Circle({
        x: a.x,
        y: a.y,
        radius: 4,
        fill: this.primaryColor,
        opacity: 0.9
      });
      e.add(u), e.add(l), e.add(t), e.add(d), e.add(h);
      const p = e.toDataURL();
      e.destroy(), Wo(
        Lt,
        `url(${p}) ${a.x} ${a.y}, default`
      );
    });
  }
  /**
   * 处理鼠标按下事件的方法，创建新的形状组并添加签章图片。
   * @param e Konva 事件对象
   */
  mouseDownHandler(e) {
    if (e.currentTarget !== this.konvaStage)
      return;
    this.stampImage = null, this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup);
    const t = this.konvaStage.getRelativePointerPosition();
    this.stampUrl && t && M.Image.fromURL(this.stampUrl, async (o) => {
      const { width: r, height: s } = o.getClientRect(), { newWidth: i, newHeight: a } = Jt(r, s, 120), l = { x: i / 2, y: a / 2 };
      this.stampImage = o, this.stampImage.setAttrs({
        x: t.x - l.x,
        y: t.y - l.y,
        width: i,
        height: a,
        base64: this.stampUrl
      }), this.currentShapeGroup?.konvaGroup.add(this.stampImage), this.konvaStage.draw();
      const u = this.currentShapeGroup?.konvaGroup.id();
      u && (this.setShapeGroupDone(
        {
          id: u,
          contentsObj: {
            text: "",
            image: this.stampUrl || void 0
          }
        }
      ), this.stampImage = null);
    });
  }
  /**
   * 激活编辑器并设置签章图片。
   * @param konvaStage Konva 舞台对象
   * @param annotation 新的注解对象
   * @param stampUrl 签章图片的 URL
   */
  activateWithStamp(e, t, o) {
    super.activate(e, t), this.stampUrl = o, o && this.createCursorImg();
  }
  /**
   * 将序列化的 Konva.Group 添加到图层，并恢复其中的签章图片。
   * @param konvaStage Konva 舞台对象
   * @param konvaString 序列化的 Konva.Group 字符串表示
   */
  addSerializedGroupToLayer(e, t) {
    const o = M.Node.create(t), { konvaGroup: r, added: s } = this.registerSerializedGroup(e, o);
    if (!s) return;
    const i = this.getGroupNodesByClassName(r, "Image")[0];
    if (!i) return;
    const a = i.getAttr("base64"), l = this.getGroupNodesByClassName(r, "Text")[0];
    a && M.Image.fromURL(a, (u) => {
      u.setAttrs(i.getAttrs()), i.destroy(), r.add(u), l && l.moveToTop(), r.getLayer()?.batchDraw(), r.fire(sn);
    });
  }
  // 以下是未实现的抽象方法的空实现
  mouseMoveHandler() {
  }
  mouseUpHandler() {
  }
  changeStyle() {
  }
}
function Yo({
  x: n,
  y: e,
  fill: t = "rgba(255, 221, 31, 1)",
  stroke: o = "#C0A042",
  strokeWidth: r = 0.8,
  cornerSize: s = 4
}) {
  const u = [], d = new M.Rect({
    x: n,
    y: e,
    width: 18,
    height: 20,
    cornerRadius: s,
    fillLinearGradientStartPoint: { x: 0, y: 0 },
    fillLinearGradientEndPoint: { x: 0, y: 20 },
    fillLinearGradientColorStops: [
      0,
      t,
      1,
      "#FFFFFF"
    ],
    shadowColor: "rgba(0,0,0,0.25)",
    shadowBlur: 4,
    shadowOffset: { x: 1, y: 2 },
    shadowOpacity: 0.5,
    stroke: o,
    strokeWidth: r
  });
  u.push(d);
  const h = new M.Line({
    points: [
      n + 18 - 5,
      e,
      n + 18,
      e + 5,
      n + 18 - 5,
      e + 5
    ],
    fill: "rgba(255,255,255,0.85)",
    closed: !0,
    stroke: "rgba(0,0,0,0.12)",
    strokeWidth: 0.6
  });
  u.push(h);
  const p = new M.Line({
    points: [
      n + 18 - 5,
      e + 5,
      n + 18,
      e + 5,
      n + 18 - 5,
      e
    ],
    stroke: "rgba(0,0,0,0.10)",
    strokeWidth: 0.4
  });
  u.push(p);
  const g = 4, f = 4, S = (20 - g * 2) / (f + 1);
  for (let m = 1; m <= f; m++) {
    const v = e + g + m * S, b = new M.Line({
      points: [
        n + 3,
        v,
        n + 18 - (m === 1 ? 7 : 4),
        v
      ],
      stroke: "rgba(0,0,0,0.45)",
      strokeWidth: 0.7,
      lineCap: "round"
    });
    u.push(b);
  }
  return u;
}
class zs extends Ee {
  constructor(e) {
    super({ ...e, editorType: R.NOTE });
  }
  mouseDownHandler() {
  }
  mouseMoveHandler() {
  }
  async mouseUpHandler(e) {
    const t = "rgb(255, 221, 31)", o = this.konvaStage.getRelativePointerPosition();
    if (e.currentTarget !== this.konvaStage || !o)
      return;
    const { x: r, y: s } = o;
    this.isPainting = !0, this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup);
    const i = Yo({ x: r, y: s, fill: t });
    this.currentShapeGroup.konvaGroup.add(...i);
    const a = this.currentShapeGroup.konvaGroup.id();
    this.setShapeGroupDone({
      id: a,
      contentsObj: {
        text: ""
      },
      color: t
    });
  }
  changeStyle() {
  }
}
function Ko(n) {
  return {
    borderStrokeWidth: 2,
    borderDash: n ? [] : [3, 3],
    opacity: 1,
    authorLabelOpacity: 0.9,
    anchorFill: n ? "#fff" : "transparent",
    anchorStrokeWidth: n ? 2 : 0,
    anchorSize: n ? 10 : 0
  };
}
class Fs {
  primaryColor;
  onSelected;
  onDeselected;
  onSelectionChanged;
  onHoverStart;
  onHoverEnd;
  onChanged;
  onDelete;
  onCancel;
  transformerStore = /* @__PURE__ */ new Map();
  // 存储变换器实例
  getAnnotationStore;
  // 获取注解存储的方法
  canTransform;
  konvaCanvasStore;
  // 存储各个页面的 Konva 画布实例
  _currentTransformerId = null;
  // 当前激活的变换器ID
  selectedId = null;
  hoveredGroupId = null;
  isSelectedByClick = !1;
  // 是否通过点击选中
  // 用于存储 Tween 动画实例，确保可以正确销毁
  tweenStore = /* @__PURE__ */ new Map();
  // 构造函数，初始化选择器类
  constructor({
    primaryColor: e,
    konvaCanvasStore: t,
    getAnnotationStore: o,
    canTransform: r,
    onDelete: s,
    onSelected: i,
    onDeselected: a,
    onSelectionChanged: l,
    onHoverStart: u,
    onHoverEnd: d,
    onCancel: h,
    onChanged: p
  }) {
    this.primaryColor = e, this.konvaCanvasStore = t, this.getAnnotationStore = o, this.canTransform = r, this.onDelete = s, this.onSelected = i, this.onDeselected = a, this.onSelectionChanged = l, this.onHoverStart = u, this.onHoverEnd = d, this.onCancel = h, this.onChanged = p;
  }
  // 获取当前激活的变换器ID
  get currentTransformerId() {
    return this._currentTransformerId;
  }
  // 设置当前激活的变换器ID，并处理变换器状态的更新
  set currentTransformerId(e) {
    this._currentTransformerId !== e && (this.selectedId = e, this.deactivateTransformer(this._currentTransformerId), this._currentTransformerId = e);
  }
  /**
   * 禁用给定 Konva Stage上的默认事件。
   * @param konvaStage - 要禁用事件的 Konva Stage。
   */
  disableStageEvents(e) {
    e.off("click mousedown mousemove mouseup touchstart touchmove touchend");
  }
  /**
   * 绑定 Konva Stage上的全局点击事件。
   * @param konvaStage - 要绑定事件的 Konva Stage。
   */
  bindStageEvents(e) {
    e.off("click tap"), e.on("click tap", (t) => {
      t.target === e && (this.clearTransformers(), this.onDeselected());
    });
  }
  /**
   * 获取 Konva Stage的背景图层。
   * @param konvaStage - 要获取背景图层的 Konva Stage。
   * @returns Konva Stage的背景图层。
   */
  getBackgroundLayer(e) {
    return e.getLayers()[0];
  }
  /**
   * 获取给定 Konva Stage上的所有形状组。
   * @param konvaStage - 要获取形状组的 Konva Stage。
   * @returns 形状组的数组。
   */
  getPageShapeGroups(e) {
    return this.getBackgroundLayer(e).getChildren((t) => t.name() === _e);
  }
  // 获取指定 id 的形状组
  getGroupById(e, t) {
    return this.getPageShapeGroups(e).find((r) => r.id() === t) || null;
  }
  getFirstShapeInGroup(e) {
    return e.getChildren().find((t) => t instanceof M.Shape) || null;
  }
  /**
   * 启用给定组中的所有形状的交互功能。
   * @param groups - 要启用的形状组。
   * @param konvaStage - 形状组所在的 Konva Stage。
   */
  enableShapeGroups(e, t) {
    e.forEach((o) => {
      this.removeGroupHoverEvents(o), this.bindGroupHoverEvents(o), o.getChildren().forEach((r) => {
        r instanceof M.Shape && (this.removeShapeEvents(r), this.bindShapeEvents(r, t));
      });
    });
  }
  /**
   * 禁用给定组中的所有形状的交互功能。
   * @param groups - 要禁用的形状组。
   */
  disableShapeGroups(e) {
    e.forEach((t) => {
      this.removeGroupHoverEvents(t), t.getChildren().forEach((o) => {
        o instanceof M.Shape && this.removeShapeEvents(o);
      });
    });
  }
  /**
   * 为给定形状绑定点击事件。
   * @param shape - 要绑定事件的形状。
   * @param konvaStage - 形状所在的 Konva Stage。
   */
  bindShapeEvents(e, t) {
    this.removeShapeEvents(e), e.on("pointerclick", (o) => {
      o.evt.button === 0 && this.handleShapeClick(e, t, !0);
    });
  }
  /**
   * 移除给定形状上的所有绑定事件。
   * @param shape - 要移除事件的形状。
   */
  removeShapeEvents(e) {
    e.off("pointerclick mouseover mouseout pointerdblclick");
  }
  bindGroupHoverEvents(e) {
    e.on("pointerenter.annotationSelectorHover", (t) => {
      this.isTouchPointer(t.evt) || this.handleGroupPointerEnter(e.id());
    }), e.on("pointerleave.annotationSelectorHover", (t) => {
      this.isTouchPointer(t.evt) || this.handleGroupPointerLeave(e.id());
    });
  }
  removeGroupHoverEvents(e) {
    e.off(".annotationSelectorHover"), this.hoveredGroupId === e.id() && this.clearCanvasHover();
  }
  isTouchPointer(e) {
    return "pointerType" in e && e.pointerType === "touch";
  }
  /**
   * 处理形状的点击事件。
   * @param shape - 被点击的形状。
   * @param konvaStage - 形状所在的 Konva Stage。
   */
  handleShapeClick(e, t, o = !1) {
    const r = e.findAncestor(`.${_e}`);
    if (!r) return;
    this.hoveredGroupId === r.id() && this.clearCanvasHover(), this.clearTransformers();
    const s = !o;
    if (this.createTransformer(r, t, s), !s) {
      const i = this.transformerStore.get(r.id());
      if (i) {
        const a = i.getClientRect();
        this.onSelected(r.id(), o, a);
      }
    }
  }
  /**
   * 创建变形区域
   * @param group
   * @param konvaStage
   */
  createTransformer(e, t, o) {
    const r = e.children[0], s = e.id();
    this.currentTransformerId = s;
    const i = this.getAnnotationStore(s);
    if (e.off("dragend"), !i) return;
    const a = De.find((p) => p.pdfjsAnnotationType === i.pdfjsType), l = this.canTransform(i), u = Ko(l), d = new M.Transformer({
      resizeEnabled: l && a?.resizable,
      rotateEnabled: !1,
      borderStrokeWidth: u.borderStrokeWidth,
      borderStroke: this.primaryColor,
      borderDash: u.borderDash,
      anchorFill: u.anchorFill,
      anchorStroke: this.primaryColor,
      opacity: u.opacity,
      anchorCornerRadius: 5,
      anchorStrokeWidth: u.anchorStrokeWidth,
      anchorSize: u.anchorSize,
      padding: 2,
      boundBoxFunc: (p, g) => (g.width = Math.max(30, g.width), g)
    });
    r.attrs.id && r.attrs.id === "note" && d.resizeEnabled(!1), e.draggable(!!(l && a?.draggable)), d.off("transformend"), d.off("transformstart"), l && d.on("transformend", () => {
      this.onChanged(e.id(), e.toJSON(), { ...i }, M.Node.create(e.toJSON()).getClientRect(), d.getClientRect());
    }), l && d.on("transformstart", () => {
      this.onCancel();
    }), l && d.on("dragstart", () => {
      this.onCancel();
    }), l && d.on("dragend", () => {
      this.onChanged(e.id(), e.toJSON(), { ...i }, M.Node.create(e.toJSON()).getClientRect(), d.getClientRect());
    });
    let h = null;
    l && d.on("dragmove", () => {
      h && cancelAnimationFrame(h), h = requestAnimationFrame(() => {
        h = null;
        const p = d.nodes().map((f) => f.getClientRect()), g = this.getTotalBox(p);
        d.nodes().forEach((f) => {
          const S = f.getAbsolutePosition(), m = g.x - S.x, v = g.y - S.y, b = g.width / 2, w = g.height / 2, x = { ...S };
          g.x + b < 0 && (x.x = -m - b), g.y + w < 0 && (x.y = -v - w), g.x + b > t.width() && (x.x = t.width() - b - m), g.y + w > t.height() && (x.y = t.height() - w - v), f.setAbsolutePosition(x);
        });
      });
    }), d.nodes([e]), this.getBackgroundLayer(t).add(d), this.transformerStore.set(s, d), this.onSelectionChanged(s), o && this.flashNodeWithTransformer(e, d, () => {
      this.onSelected(e.id(), !1, d.getClientRect());
    });
  }
  flashNodeWithTransformer(e, t, o) {
    let r = 0;
    const s = 1, i = 0.1, a = e.id();
    this.cleanupTween(a);
    const l = t.borderStrokeWidth(), u = () => {
      if (!e.getLayer()) {
        this.tweenStore.delete(a);
        return;
      }
      const h = new M.Tween({
        node: e,
        duration: i,
        opacity: 0,
        onFinish: () => {
          try {
            t.getLayer() && (t.borderStrokeWidth(l + 2), t.getLayer()?.batchDraw()), d();
          } catch {
            this.cleanupTween(a);
          }
        }
      }), p = this.tweenStore.get(a) || { fadeOut: null, fadeIn: null };
      p.fadeOut = h, this.tweenStore.set(a, p), h.play();
    }, d = () => {
      if (!e.getLayer()) {
        this.tweenStore.delete(a);
        return;
      }
      const h = new M.Tween({
        node: e,
        duration: i,
        opacity: 1,
        onFinish: () => {
          try {
            t.getLayer() && (t.borderStrokeWidth(l), t.getLayer()?.batchDraw()), r++, r < s ? setTimeout(u, 100) : (this.cleanupTween(a), o && o());
          } catch {
            this.cleanupTween(a);
          }
        }
      }), p = this.tweenStore.get(a) || { fadeOut: null, fadeIn: null };
      p.fadeIn = h, this.tweenStore.set(a, p), h.play();
    };
    u();
  }
  // 清理指定 groupId 的 Tween 动画
  cleanupTween(e) {
    const t = this.tweenStore.get(e);
    t && (t.fadeOut && t.fadeOut.destroy(), t.fadeIn && t.fadeIn.destroy(), this.tweenStore.delete(e));
  }
  /**
   * 获取所有形状的总包围盒。
   * @param boxes
   * @returns
   */
  getTotalBox(e) {
    let t = 1 / 0, o = 1 / 0, r = -1 / 0, s = -1 / 0;
    return e.forEach((i) => {
      t = Math.min(t, i.x), o = Math.min(o, i.y), r = Math.max(r, i.x + i.width), s = Math.max(s, i.y + i.height);
    }), {
      x: t,
      y: o,
      width: r - t,
      height: s - o
    };
  }
  /**
   * 根据悬停状态切换光标样式。
   * @param add - 是否添加悬停样式。
   */
  toggleCursorStyle(e) {
    document.body.classList.toggle(Ns, e);
  }
  handleGroupPointerEnter(e) {
    this.hoveredGroupId !== e && (this.hoveredGroupId = e, this.toggleCursorStyle(!0), this.onHoverStart(e));
  }
  handleGroupPointerLeave(e) {
    this.hoveredGroupId === e && this.clearCanvasHover();
  }
  clearCanvasHover() {
    const e = this.hoveredGroupId;
    e && (this.hoveredGroupId = null, this.toggleCursorStyle(!1), this.onHoverEnd(e));
  }
  /**
   * 清除所有变换器。
   */
  clearTransformers() {
    this.toggleCursorStyle(this.hoveredGroupId !== null);
    const e = this._currentTransformerId !== null;
    this.transformerStore.forEach((t, o) => {
      t && (t.nodes().forEach((r) => {
        r instanceof M.Group && (r.draggable(!1), r.off("dragend"));
      }), t.off("transformend transformstart dragstart dragend dragmove"), t.nodes([]), t.destroy()), this.cleanupTween(o);
    }), this.transformerStore.clear(), this.currentTransformerId = null, this.onSelectionChanged(null), e && this.onCancel();
  }
  /**
   * 停用指定变换器。
   * @param transformerId - 要停用的变换器ID。
   */
  deactivateTransformer(e) {
    if (e) {
      const t = this.transformerStore.get(e);
      t && t.nodes().forEach((o) => {
        o instanceof M.Group && o.draggable(!1);
      });
    }
  }
  selectedShape(e, t, o = !1) {
    const r = this.getGroupById(t, e);
    if (!r)
      return;
    const s = this.getFirstShapeInGroup(r);
    s && this.handleShapeClick(s, t, o);
  }
  /**
   * 清除选择器的所有状态和事件。
   */
  clear() {
    this.clearCanvasHover(), this.clearTransformers(), this.konvaCanvasStore.forEach((e) => {
      const { konvaStage: t } = e, o = this.getPageShapeGroups(t);
      this.disableStageEvents(t), this.disableShapeGroups(o);
    }), this.tweenStore.forEach((e, t) => {
      this.cleanupTween(t);
    }), this.tweenStore.clear();
  }
  /**
   * 在指定页面上激活选择器。
   * @param pageNumber - 要激活选择器的页面号。
   */
  activate(e) {
    const t = this.konvaCanvasStore.get(e);
    if (!t) return;
    const { konvaStage: o } = t, r = this.getPageShapeGroups(o);
    this.disableStageEvents(o), this.bindStageEvents(o), this.enableShapeGroups(r, o), this.selectedId && this.selectedShape(this.selectedId, o, this.isSelectedByClick);
  }
  /**
   * 选择指定的形状组。
   * @param id - 要选择的形状组的 ID。
   * @param isClick - 是否是点击操作，默认为 false
   */
  select(e, t = !1) {
    this.selectedId = e, this.isSelectedByClick = t;
  }
  refreshCurrentSelection() {
    const e = this._currentTransformerId;
    if (!e) return;
    const t = this.transformerStore.get(e), o = t?.nodes()[0], r = o?.getStage();
    !(o instanceof M.Group) || !r || (t?.off("transformend transformstart dragstart dragend dragmove"), t?.nodes([]), t?.destroy(), this.cleanupTween(e), this.transformerStore.delete(e), this._currentTransformerId = null, this.createTransformer(o, r, !1));
  }
  delete() {
    this.clearTransformers();
  }
}
var et = /* @__PURE__ */ ((n) => (n.CANVAS = "canvas", n.SIDEBAR = "sidebar", n))(et || {});
const le = si((n, e) => ({
  annotations: /* @__PURE__ */ new Map(),
  originalAnnotations: /* @__PURE__ */ new Map(),
  selectedAnnotation: null,
  selectionRevision: 0,
  currentAnnotationType: null,
  getAnnotation: (t) => e().annotations.get(t),
  getByPage: (t) => {
    const { annotations: o } = e();
    return Array.from(o.values()).filter((r) => r.pageNumber === t);
  },
  addAnnotation: (t, o = !1) => (n((r) => {
    const s = new Map(r.annotations);
    if (s.set(t.id, t), o) {
      const i = new Map(r.originalAnnotations);
      return i.set(t.id, t), {
        annotations: s,
        originalAnnotations: i
      };
    }
    return { annotations: s };
  }), t),
  restoreAnnotation: (t, o) => e().annotations.has(t.id) ? !1 : (n((r) => {
    const s = Array.from(r.annotations.entries()), i = Math.max(0, Math.min(o, s.length));
    return s.splice(i, 0, [t.id, t]), { annotations: new Map(s) };
  }), !0),
  updateAnnotation: (t, o) => {
    let r = null;
    return n((s) => {
      const i = s.annotations.get(t);
      if (!i)
        return console.warn(`Annotation with id ${t} not found.`), s;
      r = {
        ...i,
        ...o
      };
      const a = new Map(s.annotations);
      a.set(t, r);
      const l = s.selectedAnnotation?.store?.id === t ? {
        ...s.selectedAnnotation,
        store: r
      } : s.selectedAnnotation;
      return { annotations: a, selectedAnnotation: l };
    }), r;
  },
  setAnnotationReferenceNumbers: (t) => n((o) => {
    const r = (d) => {
      let h = !1;
      const p = new Map(d);
      return t.forEach((g, f) => {
        const S = p.get(f);
        !S || S.referenceNumber === g || (p.set(f, { ...S, referenceNumber: g }), h = !0);
      }), h ? p : d;
    }, s = r(o.annotations), i = r(o.originalAnnotations), a = o.selectedAnnotation?.store, l = a ? t.get(a.id) : void 0, u = a && l !== void 0 && a.referenceNumber !== l ? {
      store: { ...a, referenceNumber: l },
      source: o.selectedAnnotation?.source ?? null
    } : o.selectedAnnotation;
    return s === o.annotations && i === o.originalAnnotations && u === o.selectedAnnotation ? o : { annotations: s, originalAnnotations: i, selectedAnnotation: u };
  }),
  removeAnnotation: (t) => n((o) => {
    const r = new Map(o.annotations);
    if (r.has(t)) {
      r.delete(t);
      const s = o.selectedAnnotation?.store?.id === t;
      return {
        annotations: r,
        selectedAnnotation: s ? null : o.selectedAnnotation,
        selectionRevision: s ? o.selectionRevision + 1 : o.selectionRevision
      };
    }
    return console.warn(`Annotation with id ${t} not found.`), o;
  }),
  clearAnnotations: () => n((t) => ({
    annotations: /* @__PURE__ */ new Map(),
    originalAnnotations: /* @__PURE__ */ new Map(),
    selectedAnnotation: null,
    selectionRevision: t.selectedAnnotation ? t.selectionRevision + 1 : t.selectionRevision
  })),
  setSelectedAnnotation: (t, o) => n((r) => ({
    selectedAnnotation: t ? {
      store: t,
      source: o || null
    } : null,
    selectionRevision: r.selectionRevision + 1
  })),
  setCurrentAnnotationType: (t) => n({ currentAnnotationType: t }),
  clearSelectedAnnotation: () => n((t) => t.selectedAnnotation ? {
    selectedAnnotation: null,
    selectionRevision: t.selectionRevision + 1
  } : t)
})), Xo = "[data-inklayer-positioned-text-id]";
class qn {
  root;
  source;
  constructor(e, t) {
    this.root = e, this.source = t;
  }
  setSource(e) {
    this.source = e;
  }
  resolve(e) {
    const t = this.source.logicalText, o = this.source.sourceKey;
    if (!t || !o || !e) return null;
    const r = e instanceof Range ? e : e.rangeCount > 0 ? e.getRangeAt(0) : null;
    if (!r || r.collapsed || !this.root.contains(r.commonAncestorContainer)) return null;
    const s = this.positionedSpansInRange(r, o);
    if (s.length === 0) return null;
    const i = zt(r.startContainer, o), a = zt(r.endContainer, o);
    if (!i || !a) return null;
    const l = Ft(i), u = Ft(a);
    if (!l || !u) return null;
    const d = Jn(i, r.startContainer, r.startOffset), h = Jn(a, r.endContainer, r.endOffset);
    if (d === null || h === null) return null;
    const p = l.start + d, g = u.start + h, f = js({ start: p, end: g }, t.length);
    if (!f || f.start === f.end) return null;
    const S = s.flatMap((m) => {
      const v = Ft(m);
      if (!v) return [];
      const b = Math.max(f.start, v.start), w = Math.min(f.end, v.end);
      if (b >= w) return [];
      const x = Number(
        m.dataset.inklayerPositionedTextPage ?? m.closest("[data-inklayer-positioned-text-page]")?.getAttribute("data-inklayer-positioned-text-page")
      );
      return !Number.isSafeInteger(x) || x < 1 ? [] : [{
        id: m.dataset.inklayerPositionedTextId || "",
        pageNumber: x,
        range: { start: b, end: w },
        blockId: m.dataset.inklayerPositionedTextBlockId || void 0,
        spanId: m.dataset.inklayerPositionedTextSpanId || void 0
      }];
    });
    return {
      sourceKey: o,
      text: t.slice(f.start, f.end),
      range: f,
      segments: S
    };
  }
  positionedSpansInRange(e, t) {
    const o = Array.from(this.root.querySelectorAll(Xo)).filter((i) => {
      if (i.dataset.inklayerPositionedTextSourceKey !== t || !Ft(i)) return !1;
      try {
        return e.intersectsNode(i);
      } catch {
        return !1;
      }
    }), r = zt(e.startContainer, t), s = zt(e.endContainer, t);
    return r && !o.includes(r) && o.push(r), s && !o.includes(s) && o.push(s), o.sort(Bs);
  }
}
function zt(n, e) {
  let t = n instanceof Element ? n : n?.parentElement ?? null;
  for (; t; ) {
    if (t instanceof HTMLElement && t.matches(Xo) && t.dataset.inklayerPositionedTextSourceKey === e)
      return t;
    t = t.parentElement;
  }
  return null;
}
function Ft(n) {
  const e = Number(n.dataset.inklayerPositionedTextLogicalStart), t = Number(n.dataset.inklayerPositionedTextLogicalEnd);
  return !Number.isSafeInteger(e) || !Number.isSafeInteger(t) || e < 0 || t <= e ? null : { start: e, end: t };
}
function Jn(n, e, t) {
  if (!n.contains(e) && n !== e) return null;
  try {
    const o = document.createRange();
    return o.selectNodeContents(n), o.setEnd(e, t), o.toString().length;
  } catch {
    return null;
  }
}
function js(n, e) {
  const t = Math.max(0, Math.min(n.start, e)), o = Math.max(0, Math.min(n.end, e));
  return t === o ? null : t < o ? { start: t, end: o } : { start: o, end: t };
}
function Bs(n, e) {
  return n === e ? 0 : n.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
class Ws {
  isEditing;
  // 指示是否启用编辑模式
  onSelect;
  // 当选区被选中时调用的回调函数
  onHighlight;
  highlighterObj;
  root = null;
  isSelecting = !1;
  activeRange = null;
  positionedTextSource;
  positionedTextResolver = null;
  handleSelectionChange = () => {
    const e = window.getSelection();
    if (e?.type === "Caret" || e?.anchorNode === null) {
      this.isSelecting = !1, this.activeRange = null, this.onSelect(null);
      return;
    }
    if (e && e.toString()) {
      const o = e.getRangeAt(0).commonAncestorContainer;
      if (this.root?.contains(o)) {
        this.isSelecting = !0;
        return;
      }
    }
    this.isSelecting = !1, this.activeRange = null, this.onSelect(null);
  };
  handleSelectionEnd = () => {
    if (!this.isSelecting) return;
    this.isSelecting = !1;
    const e = window.getSelection(), t = e && e.rangeCount > 0 ? e.getRangeAt(0) : null;
    t && this.root?.contains(t.commonAncestorContainer) ? (this.activeRange = t, this.onSelect(t)) : (this.activeRange = null, this.onSelect(null));
  };
  handleCopy = (e) => {
    const t = this.positionedTextResolver, o = window.getSelection(), r = t?.resolve(o ?? null);
    !r || !e.clipboardData || (e.clipboardData.setData("text/plain", r.text), e.preventDefault());
  };
  handleHighlightCreated = (e) => {
    const t = this.highlighterObj;
    if (!t) return;
    const r = e.sources.flatMap((i) => t.getDoms(i.id)).reduce((i, a) => {
      const l = a.closest("[data-inklayer-positioned-text-page]")?.getAttribute("data-inklayer-positioned-text-page") ?? a.closest(".page")?.getAttribute("data-page-number") ?? "-1";
      return (i[l] ||= []).push(a), i;
    }, {}), s = this.activeRange ? this.positionedTextResolver?.resolve(this.activeRange) ?? void 0 : void 0;
    s ? this.onHighlight(r, s) : this.onHighlight(r), t.removeAll(), window.getSelection()?.removeAllRanges();
  };
  /**
   * 构造一个新的 WebSelection 实例。
   * @param onSelect 当选区被选中时调用的回调函数
   */
  constructor({
    onSelect: e,
    onHighlight: t,
    positionedTextSource: o
  }) {
    this.isEditing = !1, this.onSelect = e, this.onHighlight = t, this.positionedTextSource = o, this.highlighterObj = null;
  }
  /**
   * 在指定的根元素和页码上创建一个高亮器。
   * @param root 要应用高亮器的根元素
   */
  create(e) {
    this.destroy(), this.root = e, this.positionedTextResolver = this.positionedTextSource ? new qn(e, this.positionedTextSource) : null, this.highlighterObj = new ai({
      $root: e,
      wrapTag: "mark"
    }), this.highlighterObj.stop(), document.addEventListener("selectionchange", this.handleSelectionChange), document.addEventListener("mouseup", this.handleSelectionEnd), document.addEventListener("touchend", this.handleSelectionEnd), e.addEventListener("copy", this.handleCopy, !0), this.highlighterObj.on("selection:create", this.handleHighlightCreated);
  }
  setPositionedTextSource(e) {
    this.positionedTextSource = e, this.positionedTextResolver = this.root && e ? new qn(this.root, e) : null, this.activeRange = null, this.onSelect(null);
  }
  highlight(e) {
    this.activeRange = e, e && this.highlighterObj?.fromRange(e);
  }
  isRangeSelectionActive() {
    return this.isSelecting;
  }
  destroy() {
    document.removeEventListener("selectionchange", this.handleSelectionChange), document.removeEventListener("mouseup", this.handleSelectionEnd), document.removeEventListener("touchend", this.handleSelectionEnd), this.root?.removeEventListener("copy", this.handleCopy, !0), this.highlighterObj && (this.highlighterObj.off("selection:create", this.handleHighlightCreated), this.highlighterObj.dispose(), this.highlighterObj = null), this.root = null, this.isSelecting = !1, this.activeRange = null, this.positionedTextResolver = null;
  }
}
class Xe {
  pdfViewerApplication;
  id;
  inkLayerMetadata;
  constructor({ pdfViewerApplication: e, id: t, inkLayerMetadata: o }) {
    this.pdfViewerApplication = e, this.id = t, this.inkLayerMetadata = o;
  }
  /**
   * @description pdfjs annotation rect 转为 konva 的 rect
   * @param annotation
   * @returns
   */
  convertRect(e, t, o) {
    const r = o / t, [s, i, a, l] = e, u = s, d = r - l, h = a - s, p = l - i;
    return { x: u, y: d, width: h, height: p };
  }
  /**
   * @description pdfjs annotation quadPoint 转为 konva 的 rect
   * @param quadPoint  [左上，右上，左下，右下]
   * @param scale
   * @param height
   * @returns
   */
  convertQuadPoints(e, t, o) {
    const r = o / t, s = e[0].x, i = r - e[0].y, a = e[1].x - e[0].x, l = e[1].y - e[3].y;
    return { x: s, y: i, width: a, height: l };
  }
  convertPoint(e, t, o) {
    const r = o / t;
    return { x: e.x, y: r - e.y };
  }
  convertCoordinates(e, t, o) {
    const r = o / t, s = e[0], i = r - e[1], a = e[2], l = r - e[3];
    return { x: s, y: i, x1: a, y1: l };
  }
  getComments(e, t) {
    const o = [];
    return t.forEach((r) => {
      r.annotationType === re.TEXT && r.inReplyTo === e.id && o.push({
        id: r.id,
        title: r.titleObj.str,
        date: r.modificationDate,
        content: r.contentsObj.str
      });
    }), o;
  }
}
class Vs extends Xe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const o = Ke(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, { x: s, y: i, width: a, height: l } = this.convertRect(
      e.rect,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), u = new M.Group({
      draggable: !1,
      name: _e,
      id: e.id
    }), d = new M.Ellipse({
      radiusX: a / 2,
      radiusY: l / 2,
      x: s + a / 2,
      y: i + l / 2,
      strokeScaleEnabled: !1,
      strokeWidth: r,
      stroke: o,
      dash: e.borderStyle.style === 2 ? e.borderStyle.dashArray : []
    });
    u.add(d);
    const h = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: u.toJSON(),
      konvaClientRect: u.getClientRect(),
      title: e.titleObj.str,
      type: R.CIRCLE,
      color: o,
      pdfjsType: e.annotationType,
      subtype: e.subtype,
      date: e.modificationDate,
      contentsObj: {
        text: e.contentsObj.str
      },
      comments: this.getComments(e, t),
      user: {
        id: e.titleObj.str,
        name: e.titleObj.str
      },
      native: !0
    };
    return u.destroy(), h;
  }
}
class $s extends Xe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const o = Ke(e.defaultAppearanceData.fontColor), r = e.defaultAppearanceData.fontSize, s = e.contentsObj.str, { x: i, y: a } = this.convertRect(
      e.rect,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), l = new M.Group({
      draggable: !1,
      name: _e,
      id: e.id
    }), u = new M.Text({
      x: i,
      y: a + 2,
      text: s,
      fontSize: r,
      fill: o
    });
    return l.add(u), {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: l.toJSON(),
      konvaClientRect: l.getClientRect(),
      title: e.titleObj.str,
      type: R.FREETEXT,
      color: o,
      pdfjsType: e.annotationType,
      subtype: e.subtype,
      date: e.modificationDate,
      contentsObj: {
        text: s
      },
      comments: this.getComments(e, t),
      user: {
        id: e.titleObj.str,
        name: e.titleObj.str
      },
      native: !0
    };
  }
}
class gn extends Xe {
  constructor(e) {
    super(e);
  }
  /**
   * 创建高亮形状。
   * @param x 形状的 X 坐标
   * @param y 形状的 Y 坐标
   * @param width 形状的宽度
   * @param height 形状的高度
   * @returns Konva.Rect 高亮形状对象
   */
  createHighlightShape(e, t, o, r, s) {
    return new M.Rect({
      x: e,
      y: t,
      width: o,
      height: r,
      opacity: 0.5,
      fill: s
    });
  }
  /**
   * 创建下划线形状。
   * @param x 形状的 X 坐标
   * @param y 形状的 Y 坐标
   * @param width 形状的宽度
   * @param height 形状的高度
   * @returns Konva.Rect 下划线形状对象
   */
  createUnderlineShape(e, t, o, r, s) {
    return new M.Rect({
      x: e,
      y: r + t - 1.5,
      width: o,
      stroke: s,
      strokeWidth: 0.5,
      hitStrokeWidth: 10,
      height: 0.5
    });
  }
  /**
   * 创建删除线形状。
   * @param x 形状的 X 坐标
   * @param y 形状的 Y 坐标
   * @param width 形状的宽度
   * @param height 形状的高度
   * @returns Konva.Rect 删除线形状对象
   */
  createStrikeoutShape(e, t, o, r, s) {
    return new M.Rect({
      x: e,
      y: t + r / 2,
      width: o,
      stroke: s,
      strokeWidth: 0.5,
      hitStrokeWidth: 10,
      height: 0.5
    });
  }
  decodePdfAnnotation(e, t) {
    const o = Ke(e.color || [0, 0, 0]), s = {
      [re.HIGHLIGHT]: R.HIGHLIGHT,
      [re.UNDERLINE]: R.UNDERLINE,
      [re.STRIKEOUT]: R.STRIKEOUT
    }[e.annotationType] || R.HIGHLIGHT, i = new M.Group({
      draggable: !1,
      name: _e,
      id: e.id
    }), a = (u) => {
      const { x: d, y: h, width: p, height: g } = this.convertQuadPoints(u, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
      switch (e.annotationType) {
        case re.HIGHLIGHT:
          return this.createHighlightShape(d, h, p, g, o);
        case re.UNDERLINE:
          return this.createUnderlineShape(d, h, p, g, o);
        case re.STRIKEOUT:
          return this.createStrikeoutShape(d, h, p, g, o);
        default:
          return null;
      }
    };
    e.quadPoints?.forEach((u) => {
      const d = a(u);
      d && i.add(d);
    });
    const l = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: i.toJSON(),
      konvaClientRect: i.getClientRect(),
      title: e.titleObj.str,
      type: s,
      color: o,
      pdfjsType: e.annotationType,
      subtype: e.subtype,
      date: e.modificationDate,
      contentsObj: {
        text: e.contentsObj.str
      },
      comments: this.getComments(e, t),
      user: {
        id: e.titleObj.str,
        name: e.titleObj.str
      },
      native: !0
    };
    return i.destroy(), l;
  }
}
class Ys extends Xe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const o = Ke(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, { x: s, y: i, width: a, height: l } = this.convertRect(
      e.rect,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), u = new M.Group({
      draggable: !1,
      name: _e,
      id: e.id
    }), d = new M.Rect({
      x: s,
      y: i,
      width: a,
      height: l,
      strokeScaleEnabled: !1,
      stroke: o,
      strokeWidth: r,
      fill: e.borderStyle.width === 0 ? o : "",
      opacity: e.borderStyle.width === 0 ? 0.5 : 1
    });
    u.add(d);
    const h = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: u.toJSON(),
      konvaClientRect: u.getClientRect(),
      title: e.titleObj.str,
      type: R.RECTANGLE,
      color: o,
      pdfjsType: e.annotationType,
      subtype: e.subtype,
      date: e.modificationDate,
      contentsObj: {
        text: e.contentsObj.str
      },
      comments: this.getComments(e, t),
      user: {
        id: e.titleObj.str,
        name: e.titleObj.str
      },
      native: !0
    };
    return u.destroy(), h;
  }
}
class Ks extends Xe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    if (e.inkLists.length === 0)
      return null;
    const o = Ke(e.color || [0, 0, 0]), r = new M.Group({
      draggable: !1,
      name: _e,
      id: e.id
    }), s = (a) => new M.Line({
      strokeScaleEnabled: !1,
      stroke: o,
      strokeWidth: e.borderStyle.width,
      opacity: 0.5,
      lineCap: "round",
      lineJoin: "round",
      hitStrokeWidth: 20,
      globalCompositeOperation: "source-over",
      points: a
    });
    e.inkLists?.forEach((a) => {
      const l = a.map((d) => {
        const { x: h, y: p } = this.convertPoint(d, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
        return [h, p];
      }).flat(), u = s(l);
      r.add(u);
    });
    const i = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: r.toJSON(),
      konvaClientRect: r.getClientRect(),
      title: e.titleObj.str,
      type: R.FREEHAND,
      color: o,
      pdfjsType: e.annotationType,
      subtype: e.subtype,
      date: e.modificationDate,
      contentsObj: {
        text: e.contentsObj.str
      },
      comments: this.getComments(e, t),
      user: {
        id: e.titleObj.str,
        name: e.titleObj.str
      },
      native: !0
    };
    return r.destroy(), i;
  }
}
class Xs extends Xe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const o = Ke(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, s = new M.Group({
      draggable: !1,
      name: _e,
      id: e.id
    }), i = (g, f) => new M.Line({
      strokeScaleEnabled: !1,
      stroke: o,
      strokeWidth: r,
      hitStrokeWidth: 20,
      dash: e.borderStyle.style === 2 ? e.borderStyle.dashArray : [],
      globalCompositeOperation: "source-over",
      points: g
    }), { x: a, y: l, x1: u, y1: d } = this.convertCoordinates(
      e.lineCoordinates,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), h = i([a, l, u, d], e.lineEndings);
    s.add(h);
    const p = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: s.toJSON(),
      konvaClientRect: s.getClientRect(),
      title: e.titleObj.str,
      type: R.FREEHAND,
      color: o,
      pdfjsType: e.annotationType,
      subtype: e.subtype,
      date: e.modificationDate,
      contentsObj: {
        text: e.contentsObj.str
      },
      comments: this.getComments(e, t),
      user: {
        id: e.titleObj.str,
        name: e.titleObj.str
      },
      native: !0
    };
    return s.destroy(), p;
  }
}
class qs extends Xe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const o = Ke(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, s = new M.Group({
      draggable: !1,
      name: _e,
      id: e.id
    }), a = ((u) => {
      const d = [];
      return u?.forEach((h) => {
        const { x: p, y: g } = this.convertPoint(h, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
        d.push(p), d.push(g);
      }), new M.Line({
        strokeScaleEnabled: !1,
        stroke: o,
        strokeWidth: r,
        lineCap: "round",
        lineJoin: "round",
        hitStrokeWidth: 20,
        closed: !0,
        globalCompositeOperation: "source-over",
        points: d
      });
    })(e.vertices);
    s.add(a);
    const l = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: s.toJSON(),
      konvaClientRect: s.getClientRect(),
      title: e.titleObj.str,
      type: R.FREEHAND,
      color: o,
      pdfjsType: e.annotationType,
      subtype: e.subtype,
      date: e.modificationDate,
      contentsObj: {
        text: e.contentsObj.str
      },
      comments: this.getComments(e, t),
      user: {
        id: e.titleObj.str,
        name: e.titleObj.str
      },
      native: !0
    };
    return s.destroy(), l;
  }
}
class Js extends Xe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const o = Ke(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, s = new M.Group({
      draggable: !1,
      name: _e,
      id: e.id
    }), a = ((u) => {
      const d = [];
      return u?.forEach((h) => {
        const { x: p, y: g } = this.convertPoint(h, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
        d.push(p), d.push(g);
      }), new M.Line({
        strokeScaleEnabled: !1,
        stroke: o,
        strokeWidth: r,
        lineCap: "round",
        lineJoin: "round",
        hitStrokeWidth: 20,
        closed: !1,
        globalCompositeOperation: "source-over",
        points: d
      });
    })(e.vertices);
    s.add(a);
    const l = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: s.toJSON(),
      konvaClientRect: s.getClientRect(),
      title: e.titleObj.str,
      type: R.FREEHAND,
      color: o,
      pdfjsType: e.annotationType,
      subtype: e.subtype,
      date: e.modificationDate,
      contentsObj: {
        text: e.contentsObj.str
      },
      comments: this.getComments(e, t),
      user: {
        id: e.titleObj.str,
        name: e.titleObj.str
      },
      native: !0
    };
    return s.destroy(), l;
  }
}
class Zs extends Xe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    if (e.inReplyTo) return null;
    const o = Ke(e.color || [0, 0, 0]), { x: r, y: s } = this.convertRect(e.rect, e.pageViewer.viewport.scale, e.pageViewer.viewport.height), i = new M.Group({
      draggable: !1,
      name: _e,
      id: e.id
    }), a = Yo({ x: r, y: s, fill: o });
    i.add(...a);
    const l = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: i.toJSON(),
      konvaClientRect: i.getClientRect(),
      title: e.titleObj.str,
      type: R.NOTE,
      color: o,
      pdfjsType: e.annotationType,
      subtype: e.subtype,
      date: e.modificationDate,
      contentsObj: {
        text: e.contentsObj.str
      },
      comments: this.getComments(e, t),
      user: {
        id: e.titleObj.str,
        name: e.titleObj.str
      },
      native: !0
    };
    return i.destroy(), l;
  }
}
function Rn(n, e = 15) {
  if (n.length < 2) return "";
  const t = e * 1.3, o = n.reduce(
    (s, i) => ({ x: s.x + i.x, y: s.y + i.y }),
    { x: 0, y: 0 }
  );
  o.x /= n.length, o.y /= n.length;
  let r = "";
  for (let s = 0; s < n.length - 1; s++) {
    const i = n[s], a = n[s + 1], l = a.x - i.x, u = a.y - i.y, d = Math.hypot(l, u), h = Math.atan2(u, l), p = Math.cos(h + Math.PI / 2), g = Math.sin(h + Math.PI / 2), f = (i.x + a.x) / 2, S = (i.y + a.y) / 2, m = o.x - f, v = o.y - S, b = p * m + g * v > 0 ? -1 : 1, w = Math.max(2, Math.floor(d / t));
    for (let x = 0; x < w; x++) {
      const E = x / w, I = (x + 1) / w, P = i.x + l * E, W = i.y + u * E, F = i.x + l * I, D = i.y + u * I, A = (P + F) / 2 + p * e * b, L = (W + D) / 2 + g * e * b;
      s === 0 && x === 0 && (r += `M ${P} ${W} `), r += `Q ${A} ${L} ${F} ${D} `;
    }
  }
  return r;
}
class Qs extends Xe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const o = Ke(e.color || [0, 0, 0]), s = ("inkLists" in e ? e.inkLists?.[0] ?? [] : e.vertices ?? []).map(
      (d) => this.convertPoint(
        d,
        e.pageViewer.viewport.scale,
        e.pageViewer.viewport.height
      )
    );
    if (s.length < 3) return null;
    const i = new M.Group({
      draggable: !1,
      name: _e,
      id: e.id
    }), a = "inkLists" in e ? s.map((d, h) => `${h === 0 ? "M" : "L"} ${d.x} ${d.y}`).join(" ") : Rn([...s, s[0]]), l = new M.Path({
      data: a,
      strokeScaleEnabled: !1,
      stroke: o,
      strokeWidth: e.borderStyle.width === 1 ? 2 : e.borderStyle.width,
      opacity: this.inkLayerMetadata?.opacity ?? 1,
      fillEnabled: !1,
      lineCap: "round",
      lineJoin: "round",
      hitStrokeWidth: 20
    });
    i.add(l);
    const u = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: i.toJSON(),
      konvaClientRect: i.getClientRect(),
      title: e.titleObj.str,
      type: R.CLOUD,
      color: o,
      pdfjsType: e.annotationType,
      subtype: "PolyLine",
      date: e.modificationDate,
      contentsObj: { text: e.contentsObj.str },
      comments: this.getComments(e, t),
      user: {
        id: e.titleObj.str,
        name: e.titleObj.str
      },
      native: !0
    };
    return i.destroy(), u;
  }
}
function Zn(n, e) {
  return Math.hypot(e.x - n.x, e.y - n.y);
}
class ea extends Xe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const o = e.inkLists?.[0] ?? [];
    if (o.length < 2) return null;
    const r = o.map((g) => this.convertPoint(
      g,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    )), s = r[0], i = r[1], a = r[3], l = r[4], u = a && l ? { x: (a.x + l.x) / 2, y: (a.y + l.y) / 2 } : void 0, d = Ke(e.color || [0, 0, 0]), h = new M.Group({ draggable: !1, name: _e, id: e.id });
    h.add(new M.Arrow({
      points: [s.x, s.y, i.x, i.y],
      stroke: d,
      fill: d,
      strokeWidth: e.borderStyle.width || 1,
      opacity: this.inkLayerMetadata?.opacity ?? 1,
      pointerLength: u ? Zn(i, u) : 10,
      pointerWidth: a && l ? Zn(a, l) : 10,
      lineCap: "round",
      lineJoin: "round",
      hitStrokeWidth: 20,
      strokeScaleEnabled: !1
    }));
    const p = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: h.toJSON(),
      konvaClientRect: h.getClientRect(),
      title: e.titleObj.str,
      type: R.ARROW,
      color: d,
      pdfjsType: re.LINE,
      subtype: "Arrow",
      date: e.modificationDate,
      contentsObj: { text: e.contentsObj.str },
      comments: this.getComments(e, t),
      user: { id: e.titleObj.str, name: e.titleObj.str },
      native: !0
    };
    return h.destroy(), p;
  }
}
class ta extends Xe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const o = Ke(e.color || [0, 0, 0]), { x: r, y: s } = this.convertRect(
      e.rect,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), i = new M.Group({ draggable: !1, name: _e, id: e.id });
    i.add(new M.Text({
      x: r,
      y: s,
      text: e.contentsObj.str,
      width: this.inkLayerMetadata?.textWidth,
      fontSize: this.inkLayerMetadata?.fontSize ?? 14,
      fill: o,
      opacity: this.inkLayerMetadata?.opacity ?? 1,
      wrap: "word"
    }));
    const a = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: i.toJSON(),
      konvaClientRect: i.getClientRect(),
      title: e.titleObj.str,
      type: R.FREETEXT,
      color: o,
      pdfjsType: re.FREETEXT,
      subtype: "FreeText",
      date: e.modificationDate,
      contentsObj: { text: e.contentsObj.str },
      comments: this.getComments(e, t),
      user: { id: e.titleObj.str, name: e.titleObj.str },
      native: !0
    };
    return i.destroy(), a;
  }
}
const na = "pdfjs_internal_editor_";
class oa {
  pdfViewerApplication;
  constructor(e) {
    this.pdfViewerApplication = e;
  }
  async getAnnotations() {
    const e = this.pdfViewerApplication.pdfDocument, t = this.pdfViewerApplication, o = e.numPages, r = Array.from(
      { length: o },
      (i, a) => e.getPage(a + 1).then((l) => {
        const u = t.getPageView(a);
        return l.getAnnotations().then(
          (d) => d.map((h) => ({
            ...h,
            pageNumber: a + 1,
            pageViewer: u
          }))
        );
      })
    );
    return (await Promise.all(r)).flat();
  }
  async getInkLayerAnnotationMetadata() {
    const e = /* @__PURE__ */ new Map(), t = this.pdfViewerApplication.pdfDocument;
    if (!t) return e;
    try {
      const o = await _n.load(await t.getData());
      o.getPages().forEach((r) => {
        r.node.lookupMaybe(z.of("Annots"), Ro)?.asArray().forEach((i) => {
          const a = o.context.lookupMaybe(i, xn), l = a?.get(z.of("Subtype"))?.toString(), u = a?.lookupMaybe(z.of("BE"), xn), d = l === "/Polygon" && (u?.get(z.of("S"))?.toString() === "/C" || a?.get(z.of("IT"))?.toString() === "/PolygonCloud"), h = a?.get(z.of("InkLayerType"))?.toString().slice(1);
          if (!d && !(h === "Cloud" && l === "/Ink" || h === "FreeText" && l === "/Text" || h === "Arrow" && l === "/Ink")) return;
          const g = a?.get(z.of("NM")), f = g ? o.context.lookup(g) : void 0, S = f instanceof ie || f instanceof Eo ? f.decodeText() : i instanceof ti ? `${i.objectNumber}R` : void 0;
          if (!S) return;
          const m = d ? "Cloud" : h;
          if (m !== "Cloud" && m !== "FreeText" && m !== "Arrow") return;
          const v = a?.lookupMaybe(z.of("InkLayerFontSize"), ee)?.asNumber(), b = a?.lookupMaybe(z.of("InkLayerTextWidth"), ee)?.asNumber(), w = a?.lookupMaybe(z.of("CA"), ee)?.asNumber();
          e.set(S, { type: m, fontSize: v, textWidth: b, opacity: w });
        });
      });
    } catch (o) {
      console.warn("InkLayer could not inspect PDF annotation metadata.", o);
    }
    return e;
  }
  decodeAnnotation(e, t, o) {
    const r = {
      [re.CIRCLE]: Vs,
      [re.FREETEXT]: $s,
      [re.HIGHLIGHT]: gn,
      [re.UNDERLINE]: gn,
      [re.STRIKEOUT]: gn,
      [re.SQUARE]: Ys,
      [re.INK]: Ks,
      [re.LINE]: Xs,
      [re.POLYGON]: qs,
      [re.POLYLINE]: Js,
      [re.TEXT]: Zs
    }, s = o.get(e.id);
    let i = r[e.annotationType];
    return s?.type === "Cloud" && (e.annotationType === re.POLYGON || e.annotationType === re.INK) && (i = Qs), s?.type === "FreeText" && e.annotationType === re.TEXT && (i = ta), s?.type === "Arrow" && e.annotationType === re.INK && (i = ea), i ? new i({
      pdfViewerApplication: this.pdfViewerApplication,
      id: e.id,
      inkLayerMetadata: s
    }).decodePdfAnnotation(e, t) : null;
  }
  /**
   * 在 pdf store 中 清除原有 pdf 注释
   * @param annotation
   */
  cleanAnnotationStore(e) {
    this.pdfViewerApplication?.pdfDocument?.annotationStorage?.setValue(`${na}${e.id}`, {
      deleted: !0,
      id: e.id,
      pageIndex: e.pageNumber - 1
    });
  }
  async decodePdfAnnotation() {
    const [e, t] = await Promise.all([
      this.getAnnotations(),
      this.getInkLayerAnnotationMetadata()
    ]), o = /* @__PURE__ */ new Map();
    return e.forEach((r) => {
      this.cleanAnnotationStore(r);
      const s = this.decodeAnnotation(r, e, t);
      s && o.set(r.id, s);
    }), o;
  }
}
class ra extends Ee {
  arrow;
  // 当前正在绘制的箭头对象
  startPoint;
  // 起点坐标
  constructor(e) {
    super({ ...e, editorType: R.ARROW }), this.arrow = null, this.startPoint = { x: 0, y: 0 };
  }
  mouseDownHandler(e) {
    if (e.currentTarget !== this.konvaStage) return;
    this.arrow = null, this.isPainting = !0, this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup);
    const t = this.konvaStage.getRelativePointerPosition();
    t && (this.startPoint = { x: t.x, y: t.y }, this.arrow = new M.Arrow({
      points: [t.x, t.y, t.x, t.y],
      stroke: this.currentAnnotation.style.color,
      strokeWidth: this.currentAnnotation.style.strokeWidth,
      fill: this.currentAnnotation.style.color,
      pointerLength: 10,
      pointerWidth: 10,
      hitStrokeWidth: 20,
      // 设置点击检测的宽度
      lineCap: "round",
      lineJoin: "round",
      strokeScaleEnabled: !1,
      visible: !1,
      opacity: this.currentAnnotation.style.opacity
    }), this.currentShapeGroup.konvaGroup.add(this.arrow), window.addEventListener("mouseup", this.globalPointerUpHandler));
  }
  mouseMoveHandler(e) {
    if (!this.isPainting) return;
    e.evt.preventDefault();
    const t = this.konvaStage.getRelativePointerPosition();
    if (!t)
      return;
    const o = [this.startPoint.x, this.startPoint.y, t.x, t.y];
    this.arrow?.show(), this.arrow?.setAttrs({ points: o });
  }
  mouseUpHandler() {
    if (!this.isPainting) return;
    this.isPainting = !1;
    const e = this.arrow?.getParent();
    if (e) {
      if (!this.arrow?.isVisible() && e?.getType() === "Group") {
        this.delShapeGroup(e.id());
        return;
      }
      if (this.isTooShort()) {
        this.arrow?.destroy(), this.delShapeGroup(e.id()), this.arrow = null;
        return;
      }
      this.setShapeGroupDone({
        id: e.id(),
        color: this.currentAnnotation.style.color,
        contentsObj: {
          text: ""
        }
      }), this.arrow = null;
    }
  }
  globalPointerUpHandler = (e) => {
    e.button === 0 && (this.mouseUpHandler(), window.removeEventListener("mouseup", this.globalPointerUpHandler));
  };
  isTooShort() {
    if (!this.arrow) return !0;
    const e = this.arrow.points();
    if (e.length !== 4) return !0;
    const t = e[2] - e[0], o = e[3] - e[1];
    return Math.hypot(t, o) < Ee.MinSize;
  }
  /**
   * @description 更改注释样式
   * @param annotationStore
   * @param styles
   */
  changeStyle(e, t) {
    const o = e.id, r = this.getShapeGroupById(o);
    if (r) {
      r.getChildren().forEach((i) => {
        if (i instanceof M.Arrow) {
          if (t.color !== void 0 && (i.stroke(t.color), i.fill(t.color)), t.strokeWidth !== void 0) {
            const a = t.strokeWidth;
            i.strokeWidth(a);
            const h = Math.max(6, Math.min(30, a * 5));
            i.pointerLength(h), i.pointerWidth(h);
          }
          t.opacity !== void 0 && i.opacity(t.opacity);
        }
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(o, s);
    }
  }
}
class ia extends Ee {
  cloudPath = null;
  points = [];
  startRect = null;
  startRectSize = 12;
  constructor(e) {
    super({ ...e, editorType: R.CLOUD }), this.konvaStage.on("dblclick", this.handleDoubleClick), window.addEventListener("keyup", this.handleKeyUp);
  }
  handleKeyUp = (e) => {
    e.key === "Escape" && this.isPainting && this.cancelDrawing();
  };
  cancelDrawing() {
    this.isPainting = !1, this.points = [], this.cloudPath && (this.cloudPath.destroy(), this.cloudPath = null), this.startRect && (this.startRect.destroy(), this.startRect = null), this.currentShapeGroup && (this.delShapeGroup(this.currentShapeGroup.konvaGroup.id()), this.currentShapeGroup = null), this.getBgLayer().batchDraw();
  }
  mouseDownHandler(e) {
    const t = this.konvaStage.getRelativePointerPosition();
    t && (this.points.push(t), this.isPainting || (this.isPainting = !0, this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup), this.cloudPath = new M.Path({
      data: "",
      stroke: this.currentAnnotation.style.color,
      strokeWidth: this.currentAnnotation.style.strokeWidth,
      fillEnabled: !1,
      lineJoin: "round",
      lineCap: "round",
      hitStrokeWidth: 20,
      // 设置点击检测的宽度
      opacity: this.currentAnnotation.style.opacity,
      strokeScaleEnabled: !1
    }), this.currentShapeGroup.konvaGroup.add(this.cloudPath), this.drawStartRect(t)), this.updateCloudPreview());
  }
  mouseMoveHandler(e) {
    if (!this.isPainting || !this.cloudPath) return;
    const t = this.konvaStage.getRelativePointerPosition();
    t && this.updateCloudPreview(t);
  }
  mouseUpHandler(e) {
  }
  /**
   * @description 处理双击事件，完成云朵绘制
   * @returns
   */
  /**
   * @description 处理双击事件，完成云朵绘制
   * @returns
   */
  handleDoubleClick = () => {
    if (!(!this.isPainting || this.points.length < 3) && (this.isPainting = !1, !!this.cloudPath))
      try {
        const e = [...this.points, this.points[0]], t = Rn(e);
        if (this.cloudPath.data(t), !this.currentShapeGroup)
          throw new Error("Current shape group is null");
        this.setShapeGroupDone({
          id: this.currentShapeGroup.konvaGroup.id(),
          color: this.currentAnnotation.style.color,
          contentsObj: { text: "" }
        }), this.getBgLayer().batchDraw();
      } catch (e) {
        console.error("Error completing cloud annotation:", e);
      } finally {
        this.cloudPath = null, this.points = [], this.startRect && (this.startRect.destroy(), this.startRect = null);
      }
  };
  /**
   * @description 更新云朵预览路径
   * @param cursorPos
   * @returns
   */
  updateCloudPreview(e) {
    if (!this.cloudPath) return;
    const t = [...this.points];
    e && t.push(e);
    const o = Rn(t);
    this.cloudPath.data(o);
  }
  /**
   * @description 绘制起点提示矩形
   * @param pos 起点位置
   */
  drawStartRect(e) {
    this.startRect = new M.Rect({
      x: e.x - this.startRectSize / 2,
      y: e.y - this.startRectSize / 2,
      width: this.startRectSize,
      height: this.startRectSize,
      stroke: "#666",
      strokeWidth: 2,
      cornerRadius: 2,
      hitStrokeWidth: 10,
      // 增加点击检测区域
      draggable: !1,
      dash: [4, 2],
      name: "startRect"
    }), this.getBgLayer().add(this.startRect), this.startRect.moveToTop(), this.startRect.on("mouseup", (t) => {
      this.handleDoubleClick();
    }), this.startRect.on("mousemove", (t) => {
      this.startRect?.stroke("#000"), this.startRect?.getLayer()?.batchDraw();
    }), this.startRect.on("mouseout", (t) => {
      this.startRect?.stroke("#666"), this.startRect?.getLayer()?.batchDraw();
    });
  }
  /**
   * @description 更改注释样式
   * @param annotationStore
   * @param styles
   */
  changeStyle(e, t) {
    const o = e.id, r = this.getShapeGroupById(o);
    if (r) {
      r.getChildren().forEach((i) => {
        i instanceof M.Path && (t.color !== void 0 && i.stroke(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(o, s);
    }
  }
}
const sa = {
  [R.NONE]: "note",
  [R.SELECT]: "note",
  // SELECT 不是真正的批注类型
  [R.HIGHLIGHT]: "text-markup",
  [R.STRIKEOUT]: "text-markup",
  [R.UNDERLINE]: "text-markup",
  [R.FREETEXT]: "note",
  [R.RECTANGLE]: "shape",
  [R.CIRCLE]: "shape",
  [R.FREEHAND]: "ink",
  [R.FREE_HIGHLIGHT]: "ink",
  [R.SIGNATURE]: "stamp",
  [R.STAMP]: "stamp",
  [R.NOTE]: "note",
  [R.ARROW]: "line",
  [R.CLOUD]: "shape"
}, aa = {
  [R.NONE]: "rect",
  [R.SELECT]: "rect",
  [R.HIGHLIGHT]: "quad",
  [R.STRIKEOUT]: "quad",
  [R.UNDERLINE]: "quad",
  [R.FREETEXT]: "rect",
  [R.RECTANGLE]: "rect",
  [R.CIRCLE]: "rect",
  // 实际渲染用 rect 包围盒
  [R.FREEHAND]: "path",
  [R.FREE_HIGHLIGHT]: "path",
  [R.SIGNATURE]: "rect",
  [R.STAMP]: "rect",
  [R.NOTE]: "rect",
  [R.ARROW]: "line",
  [R.CLOUD]: "path"
}, ca = {
  Highlight: "highlight",
  Underline: "underline",
  Squiggly: "squiggly",
  StrikeOut: "strikeout"
}, la = {
  highlight: "Highlight",
  underline: "Underline",
  squiggly: "Squiggly",
  strikeout: "StrikeOut"
}, da = {
  Square: "rect",
  Circle: "ellipse",
  Polygon: "polygon",
  PolyLine: "polygon",
  Cloud: "cloud"
};
function _t(n) {
  const e = sa[n.type] || "note", t = ua(n), o = {
    pageIndex: n.pageNumber - 1,
    // 转换为 0-based
    geometry: t,
    coordinateSystem: "pdf-user-space"
  }, r = ha(n, e), s = {
    strokeColor: n.color || void 0,
    fillColor: n.color ? pa(n.color, 0.3) : void 0,
    opacity: 1
  }, i = {}, a = {
    referenceNumber: n.referenceNumber,
    createdAt: n.date || void 0,
    updatedAt: n.date || void 0,
    authorId: n.user,
    isNative: n.native,
    source: n.native ? "pdfjs" : "inklayer"
  };
  return {
    id: n.id,
    kind: e,
    target: o,
    payload: r,
    appearance: s,
    relations: i,
    meta: a,
    extensions: {
      // 保留原始实现细节
      konva: {
        serialized: n.konvaString,
        clientRect: n.konvaClientRect
      },
      pdfjs: {
        type: re[n.pdfjsType],
        subtype: n.subtype
      },
      legacy: {
        annotationType: n.type,
        title: n.title,
        contentsObj: n.contentsObj,
        comments: n.comments
      }
    }
  };
}
function ua(n) {
  const e = aa[n.type] || "rect", { x: t, y: o, width: r, height: s } = n.konvaClientRect;
  switch (e) {
    case "rect":
      return { type: "rect", rect: { x: t, y: o, width: r, height: s } };
    case "quad":
      return {
        type: "quad",
        quads: [{
          p1: { x: t, y: o },
          p2: { x: t + r, y: o },
          p3: { x: t, y: o + s },
          p4: { x: t + r, y: o + s }
        }]
      };
    case "line":
      return { type: "line", start: { x: t, y: o }, end: { x: t + r, y: o + s } };
    case "path":
      return {
        type: "path",
        points: [{ x: t, y: o }, { x: t + r, y: o }, { x: t + r, y: o + s }, { x: t, y: o + s }],
        closed: !0
      };
    case "poly":
      return {
        type: "poly",
        points: [{ x: t, y: o }, { x: t + r, y: o }, { x: t + r, y: o + s }, { x: t, y: o + s }],
        closed: !0
      };
  }
}
function ha(n, e) {
  const t = n.subtype;
  switch (e) {
    case "text-markup":
      return {
        kind: "text-markup",
        variant: ca[t] || "highlight",
        text: n.contentsObj?.text || "",
        selectedText: n.contentsObj?.selectedText,
        color: n.color || void 0
      };
    case "note":
      return {
        kind: "note",
        text: n.contentsObj?.text || n.title || ""
      };
    case "ink":
      return {
        kind: "ink",
        color: n.color || void 0,
        width: n.konvaClientRect.height || 2
      };
    case "shape":
      return {
        kind: "shape",
        shape: n.type === R.CLOUD ? "cloud" : da[t] || "rect"
      };
    case "line":
      return {
        kind: "line",
        arrowStart: !1,
        arrowEnd: t === "Arrow"
      };
    case "stamp":
      return {
        kind: "stamp",
        name: n.title || "custom-stamp",
        label: n.title || void 0,
        source: "custom"
      };
    default:
      return;
  }
}
function pa(n, e) {
  if (n.startsWith("rgba")) return n;
  if (n.startsWith("#")) {
    const t = n.slice(1), o = parseInt(t.slice(0, 2), 16), r = parseInt(t.slice(2, 4), 16), s = parseInt(t.slice(4, 6), 16);
    return `rgba(${o}, ${r}, ${s}, ${e})`;
  }
  return n;
}
function fa(n) {
  const e = n.kind, t = n.extensions, o = t?.legacy, r = t?.konva, s = n.target.geometry, i = t?.pdfjs?.subtype || ya(e, n.payload), a = va(t?.pdfjs?.type) ?? ma(e, n.payload), l = o?.annotationType ?? (e === "shape" && i === "PolyLine" ? R.CLOUD : ga(e, n.payload));
  return {
    id: n.id,
    referenceNumber: n.meta?.referenceNumber,
    pageNumber: n.target.pageIndex + 1,
    // 转换回 1-based
    konvaString: r?.serialized || "",
    konvaClientRect: r?.clientRect || Ca(s),
    title: o?.title || ba(n.payload),
    type: l,
    color: n.appearance?.strokeColor || null,
    subtype: i,
    pdfjsType: a,
    date: n.meta?.createdAt || null,
    contentsObj: o?.contentsObj || Sa(n.payload),
    comments: o?.comments || [],
    user: wa(n.meta),
    native: n.meta?.isNative || !1
  };
}
function ga(n, e) {
  if (n === "shape" && e?.kind === "shape") {
    if (e.shape === "cloud") return R.CLOUD;
    if (e.shape === "ellipse") return R.CIRCLE;
  }
  return {
    "text-markup": R.HIGHLIGHT,
    note: R.NOTE,
    ink: R.FREEHAND,
    shape: R.RECTANGLE,
    line: R.ARROW,
    stamp: R.STAMP,
    file: R.STAMP
  }[n] || R.NONE;
}
function ma(n, e) {
  if (n === "shape" && e?.kind === "shape") {
    if (e.shape === "cloud") return re.POLYLINE;
    if (e.shape === "ellipse") return re.CIRCLE;
    if (e.shape === "polygon") return re.POLYGON;
  }
  return {
    "text-markup": re.HIGHLIGHT,
    note: re.TEXT,
    ink: re.INK,
    shape: re.SQUARE,
    line: re.LINE,
    stamp: re.STAMP,
    file: re.FILEATTACHMENT
  }[n] || re.NONE;
}
function va(n) {
  if (!n) return;
  const e = re[n];
  return typeof e == "number" ? e : void 0;
}
function ya(n, e) {
  if (!e) return "None";
  switch (n) {
    case "text-markup":
      return e.kind !== "text-markup" ? "Highlight" : la[e.variant];
    case "note":
      return "Text";
    case "ink":
      return "Ink";
    case "shape":
      return e.kind !== "shape" ? "Square" : e.shape === "cloud" ? "PolyLine" : e.shape === "ellipse" ? "Circle" : e.shape === "polygon" ? "Polygon" : "Square";
    case "line":
      return "Line";
    case "stamp":
      return "Stamp";
    case "file":
      return "FileAttachment";
    default:
      return "None";
  }
}
function ba(n) {
  if (!n) return "";
  switch (n.kind) {
    case "note":
      return n.text.slice(0, 50);
    case "stamp":
      return n.label || n.name;
    default:
      return "";
  }
}
function Sa(n) {
  if (!n) return null;
  switch (n.kind) {
    case "text-markup":
      return {
        text: n.text || "",
        selectedText: n.selectedText
      };
    case "note":
      return { text: n.text };
    default:
      return null;
  }
}
function wa(n) {
  return n?.authorId ? typeof n.authorId == "string" ? { id: n.authorId, name: n.authorId } : {
    id: n.authorId.id,
    name: n.authorId.name || n.authorId.id
  } : { id: "unknown", name: "Unknown" };
}
function Ca(n) {
  switch (n.type) {
    case "rect":
      return {
        x: n.rect.x,
        y: n.rect.y,
        width: n.rect.width,
        height: n.rect.height
      };
    case "quad": {
      const e = n.quads.flatMap((i) => [i.p1, i.p2, i.p3, i.p4]), t = e.map((i) => i.x), o = e.map((i) => i.y), r = Math.min(...t), s = Math.min(...o);
      return {
        x: r,
        y: s,
        width: Math.max(...t) - r,
        height: Math.max(...o) - s
      };
    }
    case "line":
      return {
        x: Math.min(n.start.x, n.end.x),
        y: Math.min(n.start.y, n.end.y),
        width: Math.abs(n.end.x - n.start.x),
        height: Math.abs(n.end.y - n.start.y)
      };
    case "path":
    case "poly": {
      if (n.points.length === 0)
        return { x: 0, y: 0, width: 0, height: 0 };
      const e = n.points.map((s) => s.x), t = n.points.map((s) => s.y), o = Math.min(...e), r = Math.min(...t);
      return {
        x: o,
        y: r,
        width: Math.max(...e) - o,
        height: Math.max(...t) - r
      };
    }
  }
}
function Ot(n) {
  return n.map((e) => _t(e));
}
function qo(n) {
  return n.map((e) => fa(e));
}
function Jo(n) {
  return !!(n?.id && n.id !== "null");
}
function Qn(n, e) {
  return Jo(n) && !!e?.id && n.id === e?.id;
}
class xa {
  getCurrentUser;
  getPermissions;
  reportedResolvers = /* @__PURE__ */ new WeakSet();
  constructor({ getCurrentUser: e, getPermissions: t }) {
    this.getCurrentUser = e, this.getPermissions = t;
  }
  can(e, t, o) {
    const r = this.getCurrentUser(), s = this.getPermissions(), a = (s?.mode ?? "unrestricted") === "unrestricted" ? !0 : this.ownerOnlyDecision(e, r, t, o);
    if (!s?.can) return a;
    try {
      return s.can({
        action: e,
        currentUser: r,
        annotation: t ? _t(t) : void 0,
        comment: o,
        defaultAllowed: a
      }) ?? a;
    } catch (l) {
      return this.reportedResolvers.has(s.can) || (this.reportedResolvers.add(s.can), console.error("InkLayer annotation permission resolver failed.", l)), !1;
    }
  }
  ownerOnlyDecision(e, t, o, r) {
    switch (e) {
      case "annotation.create":
      case "annotation.comment":
        return Jo(t);
      case "annotation.transform":
      case "annotation.edit":
      case "annotation.delete":
      case "annotation.change-status":
        return Qn(t, o?.user);
      case "comment.edit":
      case "comment.delete":
        return Qn(t, r?.user);
    }
  }
}
function mt(n) {
  return typeof n == "number" && Number.isSafeInteger(n) && n > 0;
}
function Ta(n) {
  const e = /^D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(?:([Zz])|([+-])(\d{2})'?(\d{2})?'?)?$/.exec(n);
  if (!e) return null;
  const [, t, o, r, s, i, a, l, u, d, h] = e, p = Number(t), g = Number(o), f = Number(r), S = Number(s), m = Number(i), v = Number(a);
  if (g < 1 || g > 12 || f < 1 || f > 31 || S > 23 || m > 59 || v > 59 || Number(d || 0) > 23 || Number(h || 0) > 59)
    return null;
  const b = Date.UTC(
    p,
    g - 1,
    f,
    S,
    m,
    v
  );
  if (!Number.isFinite(b)) return null;
  const w = new Date(b);
  if (w.getUTCFullYear() !== p || w.getUTCMonth() !== g - 1 || w.getUTCDate() !== f)
    return null;
  if (l || !u) return b;
  const x = (Number(d) * 60 + Number(h || 0)) * 60 * 1e3;
  return b - (u === "+" ? x : -x);
}
function eo(n) {
  if (!n) return null;
  const e = Ta(n);
  if (e !== null) return e;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/.test(n))
    return null;
  const t = Date.parse(n);
  return Number.isFinite(t) ? t : null;
}
function Aa(n, e) {
  const t = eo(n.date), o = eo(e.date);
  return t !== null && o !== null && t !== o ? t - o : t !== null && o === null ? -1 : t === null && o !== null ? 1 : n.pageNumber !== e.pageNumber ? n.pageNumber - e.pageNumber : n.id < e.id ? -1 : n.id > e.id ? 1 : 0;
}
function Zt(n) {
  let e = 0;
  for (const t of n)
    mt(t.referenceNumber) && t.referenceNumber > e && (e = t.referenceNumber);
  return e;
}
function Pn(n) {
  if (n >= Number.MAX_SAFE_INTEGER)
    throw new RangeError("Annotation reference number limit reached.");
  return n + 1;
}
function to(n) {
  const e = [...n].sort(Aa), t = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map(), r = [];
  e.forEach((i) => {
    const a = i.referenceNumber;
    mt(a) && !t.has(a) ? (t.add(a), o.set(i.id, a)) : r.push(i);
  });
  let s = r.length > 0 ? Pn(Zt(e)) : 1;
  return r.forEach((i, a) => {
    o.set(i.id, s), a < r.length - 1 && (s = Pn(s));
  }), n.map((i) => {
    const a = o.get(i.id);
    return i.referenceNumber === a ? i : { ...i, referenceNumber: a };
  });
}
function ka(n, e, t = 1) {
  const o = Array.from(e), r = /* @__PURE__ */ new Set();
  for (const i of o)
    mt(i.referenceNumber) && r.add(i.referenceNumber);
  if (mt(n.referenceNumber) && !r.has(n.referenceNumber))
    return n;
  const s = Math.max(
    Pn(Zt(o)),
    t
  );
  if (!mt(s))
    throw new RangeError("Annotation reference number limit reached.");
  return { ...n, referenceNumber: s };
}
const Zo = 4;
function Qo(n) {
  const e = n.user?.name?.trim();
  return e || n.title?.trim() || null;
}
function Ea(n) {
  const e = Qo(n), t = mt(n.referenceNumber);
  return t && e ? `#${n.referenceNumber} · ${e}` : t ? `#${n.referenceNumber}` : e;
}
function Ra({
  selectionRect: n,
  labelWidth: e,
  labelHeight: t,
  stageWidth: o,
  stageHeight: r,
  gap: s = Zo
}) {
  const i = Math.max(0, o - e), a = Math.max(0, r - t), l = Math.max(0, Math.min(i, n.x + n.width - e)), u = n.y - t - s, d = n.y + n.height + s, h = u >= 0 ? u : Math.max(0, Math.min(a, d));
  return { x: l, y: h };
}
function Pa(n, e, t) {
  return n.x < e.x + e.width + t && n.x + n.width + t > e.x && n.y < e.y + e.height + t && n.y + n.height + t > e.y;
}
function Na(n, e, t = Zo) {
  const o = /* @__PURE__ */ new Map(), r = [];
  return [...n].sort(
    (i, a) => i.y - a.y || i.x - a.x || i.id.localeCompare(a.id)
  ).forEach((i) => {
    const a = Math.max(0, e - i.height), l = Math.max(1, i.height + t), u = Math.ceil(e / l) + 1;
    let d = { ...i, y: Math.max(0, Math.min(a, i.y)) };
    for (let h = 0; h <= u; h += 1) {
      const g = (h === 0 ? [0] : [h * l, -h * l]).map((f) => ({ ...i, y: i.y + f })).find((f) => f.y >= 0 && f.y <= a && r.every((S) => !Pa(f, S, t)));
      if (g) {
        d = g;
        break;
      }
    }
    r.push(d), o.set(d.id, { x: d.x, y: d.y });
  }), o;
}
function Ia() {
  return navigator.userAgentData?.platform || navigator.platform || navigator.userAgent;
}
function no(n, e) {
  return e ? n.key === "Meta" : n.key === "Alt";
}
class Ma {
  primaryColor;
  getAnnotationsByPage;
  getAnnotationGroup;
  canTransform;
  isMac;
  pages = /* @__PURE__ */ new Map();
  boundGroups = /* @__PURE__ */ new Map();
  pressedRevealKeys = /* @__PURE__ */ new Set();
  selectedId = null;
  hoveredId = null;
  allVisible;
  constructor({ primaryColor: e, defaultVisible: t = !1, getAnnotationsByPage: o, getAnnotationGroup: r, canTransform: s }) {
    this.primaryColor = e, this.allVisible = t, this.getAnnotationsByPage = o, this.getAnnotationGroup = r, this.canTransform = s, this.isMac = /mac/i.test(Ia()), window.addEventListener("keydown", this.handleKeyDown), window.addEventListener("keyup", this.handleKeyUp), window.addEventListener("blur", this.clearShortcutReveal), document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }
  registerPage(e, t, o) {
    this.unregisterPage(e);
    const r = document.createElement("div");
    r.className = Es, r.setAttribute("aria-hidden", "true"), t.appendChild(r), this.pages.set(e, { stage: o, layer: r, labels: /* @__PURE__ */ new Map() }), this.refreshPage(e);
  }
  unregisterPage(e) {
    const t = this.pages.get(e);
    t && (t.labels.forEach((o, r) => this.unbindGroup(r)), t.layer.remove(), this.pages.delete(e));
  }
  setSelected(e) {
    if (this.selectedId === e) return;
    const t = this.selectedId;
    this.selectedId = e, t && this.refreshAnnotation(t), e && this.refreshAnnotation(e);
  }
  setHovered(e) {
    if (this.hoveredId === e) return;
    const t = this.hoveredId;
    this.hoveredId = e, t && this.refreshAnnotation(t), e && this.refreshAnnotation(e);
  }
  areAllVisible() {
    return this.allVisible;
  }
  setAllVisible(e) {
    if (this.allVisible === e) return;
    const t = this.shouldRevealAll();
    this.allVisible = e, t !== this.shouldRevealAll() && this.refreshAll();
  }
  refreshAnnotation(e) {
    const t = this.findAnnotation(e);
    if (!t) return;
    const o = this.pages.get(t.pageNumber);
    if (o) {
      if (this.shouldRevealAll()) {
        this.refreshPage(t.pageNumber);
        return;
      }
      this.syncAnnotation(o, t, !0);
    }
  }
  refreshPage(e) {
    const t = this.pages.get(e);
    if (!t) return;
    const o = this.getAnnotationsByPage(e), r = new Set(o.map((i) => i.id));
    t.labels.forEach((i, a) => {
      r.has(a) || (this.unbindGroup(a), i.remove(), t.labels.delete(a));
    });
    const s = [];
    o.forEach((i) => {
      const a = this.syncAnnotation(t, i, !1);
      a && s.push(a);
    }), this.shouldRevealAll() ? this.positionVisibleLabels(t, s) : s.forEach(({ label: i, group: a }) => this.positionLabel(t, i, a));
  }
  refreshAll() {
    this.pages.forEach((e, t) => this.refreshPage(t));
  }
  remove(e) {
    this.unbindGroup(e), this.pages.forEach((t) => {
      const o = t.labels.get(e);
      o && (o.remove(), t.labels.delete(e));
    }), this.selectedId === e && (this.selectedId = null), this.hoveredId === e && (this.hoveredId = null);
  }
  destroy() {
    window.removeEventListener("keydown", this.handleKeyDown), window.removeEventListener("keyup", this.handleKeyUp), window.removeEventListener("blur", this.clearShortcutReveal), document.removeEventListener("visibilitychange", this.handleVisibilityChange), Array.from(this.pages.keys()).forEach((e) => this.unregisterPage(e)), this.pressedRevealKeys.clear(), this.boundGroups.clear(), this.selectedId = null, this.hoveredId = null, this.allVisible = !1;
  }
  findAnnotation(e) {
    for (const t of this.pages.keys()) {
      const o = this.getAnnotationsByPage(t).find((r) => r.id === e);
      if (o) return o;
    }
  }
  syncAnnotation(e, t, o) {
    const r = Ea(t), s = this.getAnnotationGroup(t, e.stage);
    if (!r || !s)
      return this.unbindGroup(t.id), e.labels.get(t.id)?.remove(), e.labels.delete(t.id), null;
    this.bindGroup(t.id, s);
    let i = e.labels.get(t.id);
    i || (i = document.createElement("div"), i.className = Rs, i.dataset.annotationId = t.id, e.layer.appendChild(i), e.labels.set(t.id, i)), i.textContent !== r && (i.textContent = r), i.style.backgroundColor = this.primaryColor, i.style.opacity = String(Ko(this.canTransform(t)).authorLabelOpacity);
    const a = this.shouldRevealAll() || t.id === this.selectedId || t.id === this.hoveredId;
    return i.style.display = a ? "block" : "none", a ? (o && this.positionLabel(e, i, s), { id: t.id, label: i, group: s }) : null;
  }
  getLabelPosition(e, t, o) {
    const r = o.getClientRect(), s = 2;
    return Ra({
      selectionRect: {
        x: r.x - s,
        y: r.y - s,
        width: r.width + s * 2,
        height: r.height + s * 2
      },
      labelWidth: t.offsetWidth,
      labelHeight: t.offsetHeight,
      stageWidth: e.stage.width(),
      stageHeight: e.stage.height()
    });
  }
  positionLabel(e, t, o) {
    const r = this.getLabelPosition(e, t, o);
    t.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
  }
  positionVisibleLabels(e, t) {
    const o = t.map(({ id: s, label: i, group: a }) => ({
      id: s,
      ...this.getLabelPosition(e, i, a),
      width: i.offsetWidth,
      height: i.offsetHeight
    })), r = Na(o, e.stage.height());
    t.forEach(({ id: s, label: i }) => {
      const a = r.get(s);
      a && (i.style.transform = `translate3d(${a.x}px, ${a.y}px, 0)`);
    });
  }
  bindGroup(e, t) {
    const o = this.boundGroups.get(e);
    o !== t && (o?.off(".annotationAuthorLabels"), t.on(
      `dragmove.annotationAuthorLabels transform.annotationAuthorLabels ${sn}.annotationAuthorLabels`,
      () => {
        this.refreshAnnotation(e);
      }
    ), this.boundGroups.set(e, t));
  }
  unbindGroup(e) {
    this.boundGroups.get(e)?.off(".annotationAuthorLabels"), this.boundGroups.delete(e);
  }
  shouldRevealAll() {
    return this.allVisible || this.pressedRevealKeys.size > 0;
  }
  handleKeyDown = (e) => {
    if (!no(e, this.isMac)) return;
    const t = this.shouldRevealAll();
    this.pressedRevealKeys.add(e.code || e.key), t !== this.shouldRevealAll() && this.refreshAll();
  };
  handleKeyUp = (e) => {
    if (!no(e, this.isMac)) return;
    const t = this.shouldRevealAll();
    this.pressedRevealKeys.delete(e.code || e.key), t !== this.shouldRevealAll() && this.refreshAll();
  };
  handleVisibilityChange = () => {
    document.hidden && this.clearShortcutReveal();
  };
  clearShortcutReveal = () => {
    const e = this.shouldRevealAll();
    this.pressedRevealKeys.clear(), e !== this.shouldRevealAll() && this.refreshAll();
  };
}
const oo = Object.freeze({
  annotationId: null,
  source: null
});
class Da {
  entries = /* @__PURE__ */ new Map();
  listeners = /* @__PURE__ */ new Set();
  sequence = 0;
  snapshot = oo;
  destroyed = !1;
  set(e, t) {
    this.destroyed || this.entries.get(e)?.annotationId === t || (this.entries.set(e, {
      annotationId: t,
      sequence: ++this.sequence
    }), this.updateSnapshot());
  }
  clear(e, t) {
    this.destroyed || this.entries.get(e)?.annotationId !== t || (this.entries.delete(e), this.updateSnapshot());
  }
  clearAnnotation(e) {
    if (this.destroyed) return;
    let t = !1;
    this.entries.forEach((o, r) => {
      o.annotationId === e && (this.entries.delete(r), t = !0);
    }), t && this.updateSnapshot();
  }
  clearAll() {
    this.destroyed || this.entries.size !== 0 && (this.entries.clear(), this.updateSnapshot());
  }
  getSnapshot = () => this.snapshot;
  subscribe = (e) => this.destroyed ? () => {
  } : (this.listeners.add(e), () => this.listeners.delete(e));
  destroy() {
    this.destroyed || (this.clearAll(), this.destroyed = !0, this.listeners.clear());
  }
  updateSnapshot() {
    let e = null, t = null;
    for (const [r, s] of this.entries)
      (!t || s.sequence > t.sequence) && (e = r, t = s);
    const o = t?.annotationId ?? null;
    this.snapshot.annotationId === o && this.snapshot.source === e || (this.snapshot = o === null ? oo : { annotationId: o, source: e }, this.listeners.forEach((r) => r(this.snapshot)));
  }
}
class La {
  getAnnotation;
  getStage;
  getAnnotationGroup;
  hoveredId = null;
  selectedId = null;
  previewRect = null;
  boundGroup = null;
  constructor({ getAnnotation: e, getStage: t, getAnnotationGroup: o }) {
    this.getAnnotation = e, this.getStage = t, this.getAnnotationGroup = o;
  }
  setHovered(e) {
    this.hoveredId !== e && (this.hoveredId = e, this.refresh());
  }
  setSelected(e) {
    this.selectedId !== e && (this.selectedId = e, this.refresh());
  }
  refresh() {
    this.removePreview();
    const e = this.hoveredId;
    if (!e || e === this.selectedId) return;
    const t = this.getAnnotation(e);
    if (!t) return;
    const o = this.getStage(t.pageNumber);
    if (!o) return;
    const r = this.getAnnotationGroup(t, o), s = r?.getLayer();
    if (!r || !s) return;
    const a = 2 / (Math.abs(o.scaleX()) || 1), l = r.getClientRect({ relativeTo: s });
    this.previewRect = new M.Rect({
      name: Ps,
      x: l.x - a,
      y: l.y - a,
      width: l.width + a * 2,
      height: l.height + a * 2,
      stroke: "#8b8d98",
      strokeWidth: 1,
      dash: [],
      strokeScaleEnabled: !1,
      opacity: 0.65,
      listening: !1,
      perfectDrawEnabled: !1
    }), s.add(this.previewRect), this.previewRect.moveToTop(), s.batchDraw(), r.on(
      `dragmove.annotationHoverPreview transform.annotationHoverPreview ${sn}.annotationHoverPreview`,
      this.handleBoundsChange
    ), this.boundGroup = r;
  }
  unregisterPage(e) {
    const t = this.hoveredId;
    (t ? this.getAnnotation(t) : void 0)?.pageNumber === e && this.removePreview();
  }
  destroy() {
    this.hoveredId = null, this.selectedId = null, this.removePreview();
  }
  removePreview() {
    const e = this.previewRect?.getLayer();
    this.boundGroup?.off(".annotationHoverPreview"), this.boundGroup = null, this.previewRect?.destroy(), this.previewRect = null, e?.batchDraw();
  }
  handleBoundsChange = () => {
    this.refresh();
  };
}
class _a {
  shouldSuppress;
  onHoverStart;
  onHoverEnd;
  pages = /* @__PURE__ */ new Map();
  activeHover = null;
  constructor({ shouldSuppress: e, onHoverStart: t, onHoverEnd: o }) {
    this.shouldSuppress = e, this.onHoverStart = t, this.onHoverEnd = o;
  }
  registerPage(e, t, o) {
    this.unregisterPage(e);
    const r = {
      element: t,
      stage: o,
      pointerMove: (s) => this.handlePointerMove(e, s),
      pointerLeave: (s) => this.handlePointerLeave(e, s),
      pendingPointer: null,
      frameId: null
    };
    t.addEventListener("pointermove", r.pointerMove, { capture: !0, passive: !0 }), t.addEventListener("pointerleave", r.pointerLeave, { capture: !0, passive: !0 }), this.pages.set(e, r);
  }
  unregisterPage(e) {
    const t = this.pages.get(e);
    t && (t.element.removeEventListener("pointermove", t.pointerMove, !0), t.element.removeEventListener("pointerleave", t.pointerLeave, !0), this.cancelPending(t), this.pages.delete(e), this.clearPage(e));
  }
  clear() {
    const e = this.activeHover;
    this.activeHover = null, this.pages.forEach((t) => {
      this.cancelPending(t);
    }), e && this.onHoverEnd(e.annotationId);
  }
  destroy() {
    Array.from(this.pages.keys()).forEach((e) => this.unregisterPage(e)), this.clear();
  }
  handlePointerMove(e, t) {
    const o = this.pages.get(e);
    if (o) {
      if (this.shouldSuppress() || t.buttons !== 0 || t.pointerType === "touch") {
        this.cancelPending(o), this.clearPage(e);
        return;
      }
      o.pendingPointer = {
        clientX: t.clientX,
        clientY: t.clientY,
        buttons: t.buttons,
        pointerType: t.pointerType
      }, o.frameId === null && (o.frameId = requestAnimationFrame(() => {
        o.frameId = null, this.resolvePointer(e);
      }));
    }
  }
  handlePointerLeave(e, t) {
    const o = this.pages.get(e);
    !o || t.target !== o.element || (this.cancelPending(o), this.clearPage(e));
  }
  resolvePointer(e) {
    const t = this.pages.get(e), o = t?.pendingPointer;
    if (!t || !o) return;
    if (t.pendingPointer = null, this.shouldSuppress() || o.buttons !== 0 || o.pointerType === "touch" || t.stage.getLayers().length === 0) {
      this.clearPage(e);
      return;
    }
    const r = t.stage.container().getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0 || o.clientX < r.left || o.clientX > r.right || o.clientY < r.top || o.clientY > r.bottom) {
      this.clearPage(e);
      return;
    }
    const s = {
      x: (o.clientX - r.left) * (t.stage.width() / r.width),
      y: (o.clientY - r.top) * (t.stage.height() / r.height)
    }, l = t.stage.getIntersection(s)?.findAncestor(`.${_e}`)?.id() || null;
    if (!l) {
      this.clearPage(e);
      return;
    }
    this.activeHover?.pageNumber === e && this.activeHover.annotationId === l || (this.activeHover = { pageNumber: e, annotationId: l }, this.onHoverStart(l));
  }
  clearPage(e) {
    if (this.activeHover?.pageNumber !== e) return;
    const { annotationId: t } = this.activeHover;
    this.activeHover = null, this.onHoverEnd(t);
  }
  cancelPending(e) {
    e.frameId !== null && cancelAnimationFrame(e.frameId), e.pendingPointer = null, e.frameId = null;
  }
}
const mn = 8e3;
function er(n) {
  return typeof structuredClone == "function" ? structuredClone(n) : JSON.parse(JSON.stringify(n));
}
function vn(n) {
  return er(n);
}
function ro(n) {
  return er(n);
}
class Oa {
  entries = [];
  snapshot = null;
  listeners = /* @__PURE__ */ new Set();
  timer = null;
  remainingMs = mn;
  paused = !1;
  subscribe(e) {
    return this.listeners.add(e), () => this.listeners.delete(e);
  }
  getSnapshot() {
    return this.snapshot;
  }
  add(e, t) {
    this.entries.push(t === void 0 ? e : { ...e, historyId: t }), this.remainingMs = mn, this.setSnapshot(Date.now() + this.remainingMs), this.clearTimer(), this.paused || this.scheduleExpiry();
  }
  takeEntries() {
    const e = this.entries;
    return this.reset(), e;
  }
  pause() {
    this.paused || !this.snapshot || (this.paused = !0, this.remainingMs = Math.max(0, this.snapshot.expiresAt - Date.now()), this.clearTimer());
  }
  resume() {
    if (!(!this.paused || this.entries.length === 0)) {
      if (this.paused = !1, this.remainingMs <= 0) {
        this.reset();
        return;
      }
      this.setSnapshot(Date.now() + this.remainingMs), this.scheduleExpiry();
    }
  }
  clear() {
    this.reset();
  }
  scheduleExpiry() {
    this.timer = setTimeout(() => this.reset(), this.remainingMs);
  }
  setSnapshot(e) {
    let t = 0, o = 0;
    this.entries.forEach((r) => {
      r.kind === "annotation" ? t += 1 : o += 1;
    }), this.snapshot = {
      annotationCount: t,
      commentCount: o,
      totalCount: this.entries.length,
      expiresAt: e,
      items: this.entries.map((r) => r.kind === "annotation" ? {
        kind: r.kind,
        previewAnnotation: r.annotation,
        annotationReferenceNumber: r.annotation.referenceNumber,
        annotationType: r.annotation.type,
        pageNumber: r.annotation.pageNumber,
        content: r.annotation.contentsObj?.text
      } : {
        kind: r.kind,
        previewAnnotation: r.previewAnnotation,
        previewComment: r.comment,
        annotationReferenceNumber: r.annotationReferenceNumber,
        content: r.comment.content,
        author: r.comment.title
      })
    }, this.emit();
  }
  reset() {
    const e = this.snapshot !== null;
    this.clearTimer(), this.entries = [], this.snapshot = null, this.remainingMs = mn, this.paused = !1, e && this.emit();
  }
  clearTimer() {
    this.timer !== null && (clearTimeout(this.timer), this.timer = null);
  }
  emit() {
    this.listeners.forEach((e) => e());
  }
}
class io {
  limit;
  undoStack = [];
  redoStack = [];
  listeners = /* @__PURE__ */ new Set();
  nextId = 1;
  constructor(e = 100) {
    this.limit = Math.max(1, Math.floor(e));
  }
  get canUndo() {
    return this.undoStack.length > 0;
  }
  get canRedo() {
    return this.redoStack.length > 0;
  }
  subscribe(e) {
    return this.listeners.add(e), () => this.listeners.delete(e);
  }
  record(e) {
    const t = this.undoStack[this.undoStack.length - 1];
    return e.mergeKey && t?.mergeKey === e.mergeKey ? t.redo = e.redo : (this.undoStack.push({ ...e, id: this.nextId }), this.nextId += 1, this.undoStack.length > this.limit && this.undoStack.shift()), this.redoStack = [], this.emit(), this.undoStack[this.undoStack.length - 1]?.id ?? this.nextId - 1;
  }
  undo() {
    const e = this.undoStack.pop();
    return e ? e.undo() ? (this.redoStack.push(e), this.emit(), !0) : (this.undoStack.push(e), !1) : !1;
  }
  redo() {
    const e = this.redoStack.pop();
    return e ? e.redo() ? (this.undoStack.push(e), this.emit(), !0) : (this.redoStack.push(e), !1) : !1;
  }
  undoEntry(e) {
    const t = this.undoStack.findIndex((r) => r.id === e);
    if (t < 0) return !1;
    const [o] = this.undoStack.splice(t, 1);
    return o.undo() ? (this.redoStack.push(o), this.emit(), !0) : (this.undoStack.splice(t, 0, o), !1);
  }
  clear() {
    !this.canUndo && !this.canRedo || (this.undoStack = [], this.redoStack = [], this.emit());
  }
  emit() {
    this.listeners.forEach((e) => e());
  }
}
function Ha(n) {
  return n == null ? n : typeof structuredClone == "function" ? structuredClone(n) : JSON.parse(JSON.stringify(n));
}
function yn(n) {
  return Object.fromEntries(
    Object.entries(n).map(([e, t]) => [e, Ha(t)])
  );
}
class Ga {
  primaryColor;
  defaultOptions;
  currentUser;
  annotationPermissions;
  permissionController;
  konvaCanvasStore = /* @__PURE__ */ new Map();
  // 存储 KonvaCanvas 实例
  editorStore = /* @__PURE__ */ new Map();
  // 存储编辑器实例
  pdfViewerApplication;
  // PDFViewerApplication 实例
  webSelection;
  // WebSelection 实例
  currentAnnotation = null;
  // 当前批注类型
  nextAnnotationReferenceNumber = 1;
  highlightRequestId = 0;
  highlightRetryTimer = null;
  resolveHighlightRequest = null;
  selector;
  // 选择器实例
  authorLabels;
  hoverPreview;
  passiveHover;
  annotationHover = new Da();
  deleteUndoController;
  mutationHistory;
  historyControl;
  nextSelectionSource;
  activeHighlightHistoryEntries = null;
  unsubscribeAnnotationHover;
  transform;
  // 转换器
  tempDataTransfer = null;
  // 临时数据传输
  onTextSelected;
  onAnnotationAdd;
  onAnnotationDelete;
  onAnnotationSelected;
  onAnnotationChanging;
  // 批注正在更改的回调函数
  onAnnotationChanged;
  // 批注已更改的回调函数
  /**
   * 构造函数，初始化 PDFViewerApplication, EventBus, 和 WebSelection
   * @param params - 包含 PDFViewerApplication 和 EventBus 的对象
   */
  constructor({
    primaryColor: e,
    defaultOptions: t,
    currentUser: o,
    annotationPermissions: r,
    defaultShowAnnotationAuthorLabels: s,
    PDFViewerApplication: i,
    positionedTextSource: a,
    onTextSelected: l,
    onAnnotationAdd: u,
    onAnnotationDelete: d,
    onAnnotationSelected: h,
    onAnnotationChanging: p,
    onAnnotationChanged: g
  }) {
    this.primaryColor = e, this.defaultOptions = t, this.currentUser = o, this.annotationPermissions = r, this.permissionController = new xa({
      getCurrentUser: () => this.currentUser,
      getPermissions: () => this.annotationPermissions
    }), this.deleteUndoController = new Oa(), this.mutationHistory = new io(), this.authorLabels = new Ma({
      primaryColor: this.primaryColor,
      defaultVisible: s,
      getAnnotationsByPage: (f) => le.getState().getByPage(f),
      getAnnotationGroup: (f, S) => S.findOne((m) => m.getType() === "Group" && m.id() === f.id),
      canTransform: (f) => this.permissionController.can("annotation.transform", f)
    }), this.hoverPreview = new La({
      getAnnotation: (f) => le.getState().getAnnotation(f),
      getStage: (f) => this.konvaCanvasStore.get(f)?.konvaStage,
      getAnnotationGroup: (f, S) => S.findOne((m) => m.getType() === "Group" && m.id() === f.id)
    }), this.unsubscribeAnnotationHover = this.annotationHover.subscribe((f) => {
      this.authorLabels.setHovered(f.annotationId), this.hoverPreview.setHovered(null);
    }), this.pdfViewerApplication = i, this.onTextSelected = l, this.onAnnotationAdd = u, this.onAnnotationDelete = d, this.onAnnotationSelected = h, this.onAnnotationChanging = p, this.onAnnotationChanged = g, this.selector = new Fs({
      primaryColor: this.primaryColor,
      // 初始化选择器实例
      konvaCanvasStore: this.konvaCanvasStore,
      getAnnotationStore: (f) => le.getState().getAnnotation(f),
      canTransform: (f) => this.permissionController.can("annotation.transform", f),
      onSelected: (f, S, m) => {
        const v = le.getState().getAnnotation(f);
        if (v) {
          const b = this.nextSelectionSource ?? (S ? et.CANVAS : et.SIDEBAR);
          this.nextSelectionSource = void 0, le.getState().setSelectedAnnotation(v, b), this.onAnnotationSelected(v, S, m);
        }
      },
      onDeselected: () => {
        this.nextSelectionSource = void 0, le.getState().clearSelectedAnnotation(), this.onAnnotationSelected(void 0, !1, { x: 0, y: 0, width: 0, height: 0 });
      },
      onSelectionChanged: (f) => {
        this.authorLabels.setSelected(f), this.hoverPreview.setSelected(f);
      },
      onHoverStart: (f) => {
        this.annotationHover.set("canvas", f);
      },
      onHoverEnd: (f) => {
        this.annotationHover.clear("canvas", f);
      },
      onChanged: async (f, S, m, v, b) => {
        const x = this.findEditorForGroupId(f) ? this.updateStore(f, { konvaString: S, konvaClientRect: v }, !1, "annotation.transform", void 0, !0, `transform:${f}`) : void 0;
        x && this.onAnnotationChanged(x, b);
      },
      onCancel: () => {
        this.onAnnotationChanging();
      },
      onDelete: (f) => {
        this.delete(f, !0);
      }
    }), this.webSelection = new Ws({
      // 初始化 WebSelection 实例
      onSelect: (f) => {
        this.onTextSelected(f);
      },
      positionedTextSource: a,
      onHighlight: (f, S) => {
        if (!this.can("annotation.create")) return;
        const m = [];
        this.activeHighlightHistoryEntries = m, Object.keys(f).forEach((v) => {
          const b = Number(v), w = f[v], x = this.konvaCanvasStore.get(b);
          if (x) {
            const { konvaStage: E, wrapper: I } = x;
            let P = this.findEditor(b, this.currentAnnotation.type);
            P || (P = new Yn(
              {
                primaryColor: this.primaryColor,
                defaultOptions: this.defaultOptions,
                currentUser: this.currentUser,
                pdfViewerApplication: this.pdfViewerApplication,
                konvaStage: E,
                pageNumber: b,
                annotation: this.currentAnnotation,
                onAdd: (W) => {
                  this.saveToStore(W, !1, this.activeHighlightHistoryEntries ?? void 0);
                },
                onChange: (W, F) => {
                  this.updateStore(W, F);
                }
              },
              this.currentAnnotation.type
            ), this.editorStore.set(P.id, P)), P.convertTextSelection(w, I, S?.text);
          }
        }), this.activeHighlightHistoryEntries = null, m.length > 0 && this.recordHistory({
          undo: () => {
            let v = !0;
            return m.slice().reverse().forEach((b) => {
              v = this.deleteAnnotation(b.annotation.id, !0, !1) && v;
            }), v && this.selector.delete(), v;
          },
          redo: () => {
            let v = !0;
            return m.forEach((b) => {
              v = this.restoreDeletedAnnotation(b) && v;
            }), v;
          }
        });
      }
    }), this.passiveHover = new _a({
      shouldSuppress: () => !!(this.currentAnnotation && !this.currentAnnotation.webSelectionDependencies) || this.webSelection.isRangeSelectionActive(),
      onHoverStart: (f) => {
        this.annotationHover.set("canvas-passive", f);
      },
      onHoverEnd: (f) => {
        this.annotationHover.clear("canvas-passive", f);
      }
    }), this.transform = new oa(i), this.bindGlobalEvents();
  }
  setPermissionContext(e, t) {
    const o = this.currentUser?.id !== e.id;
    this.currentUser = e, this.annotationPermissions = t, (o || !this.can("annotation.create")) && this.clearHistory(), this.editorStore.forEach((r) => r.setCurrentUser(e)), this.currentAnnotation?.type !== R.SELECT && !this.can("annotation.create") && this.setDefaultMode(), this.selector.refreshCurrentSelection(), this.authorLabels.refreshAll();
  }
  can(e, t, o) {
    return this.permissionController.can(e, t, o);
  }
  areAnnotationAuthorLabelsVisible() {
    return this.authorLabels.areAllVisible();
  }
  setAnnotationAuthorLabelsVisible(e) {
    this.authorLabels.setAllVisible(e);
  }
  setAnnotationHover(e, t) {
    this.annotationHover.set(e, t);
  }
  clearAnnotationHover(e, t) {
    this.annotationHover.clear(e, t);
  }
  subscribeAnnotationHover(e) {
    return this.annotationHover.subscribe(e);
  }
  getAnnotationHoverSnapshot() {
    return this.annotationHover.getSnapshot();
  }
  setDefaultMode() {
    this.activate(De[0], null);
  }
  syncCurrentAnnotation(e) {
    this.currentAnnotation = e, le.getState().setCurrentAnnotationType(e);
  }
  ensureMutationHistory() {
    return this.mutationHistory || (this.mutationHistory = new io()), this.mutationHistory;
  }
  ensureHistoryControl() {
    if (!this.historyControl) {
      const e = {};
      Object.defineProperties(e, {
        canUndo: {
          enumerable: !0,
          get: () => this.ensureMutationHistory().canUndo
        },
        canRedo: {
          enumerable: !0,
          get: () => this.ensureMutationHistory().canRedo
        }
      }), e.undo = () => this.undoHistory(), e.redo = () => this.redoHistory(), e.subscribe = (t) => this.ensureMutationHistory().subscribe(t), this.historyControl = e;
    }
    return this.historyControl;
  }
  getHistory() {
    return this.ensureMutationHistory(), this.ensureHistoryControl();
  }
  undoHistory() {
    const e = this.ensureMutationHistory().undo();
    return e && this.deleteUndoController?.clear(), e;
  }
  redoHistory() {
    const e = this.ensureMutationHistory().redo();
    return e && this.deleteUndoController?.clear(), e;
  }
  clearHistory() {
    this.mutationHistory?.clear(), this.deleteUndoController?.clear();
  }
  recordHistory(e) {
    return this.mutationHistory ? this.mutationHistory.record(e) : null;
  }
  applyAnnotationPatch(e, t) {
    return !!this.updateStore(e, yn(t), !0, null, void 0, !1);
  }
  recordAnnotationPatchChange(e, t, o, r) {
    return this.recordHistory({
      mergeKey: r,
      undo: () => this.applyAnnotationPatch(e, t),
      redo: () => this.applyAnnotationPatch(e, o)
    });
  }
  /**
   * 绑定全局事件。
   */
  bindGlobalEvents() {
    window.addEventListener("keyup", this.globalKeyUpHandler);
  }
  /**
   * 全局键盘抬起事件处理器。
   * @param e - 键盘事件。
   */
  globalKeyUpHandler = (e) => {
    e.code === "Escape" && (this.currentAnnotation?.type === R.SIGNATURE || this.currentAnnotation?.type === R.STAMP) && (pn(Lt), this.setDefaultMode());
  };
  /**
   * 创建绘图容器 (painterWrapper)
   * @param pageView - 当前 PDF 页面视图
   * @param pageNumber - 当前页码
   * @returns 绘图容器元素
   */
  createPainterWrapper(e, t) {
    const o = document.createElement("div");
    return o.id = `${kn}_page_${t}`, o.classList.add(kn), e.div.appendChild(o), o;
  }
  /**
   * 创建 Konva Stage
   * @param container - 绘图容器元素
   * @param viewport - 当前 PDF 页面视口
   * @returns Konva Stage
   */
  createKonvaStage(e, t) {
    const o = new M.Stage({
      container: e,
      width: t.width,
      height: t.height,
      scale: { x: t.scale, y: t.scale }
    }), r = new M.Layer();
    return o.add(r), o;
  }
  /**
   * 清理无效的 canvasStore
   */
  cleanUpInvalidStore() {
    this.konvaCanvasStore.forEach((e) => {
      ks(e.wrapper) || this.disposeCanvas(e.pageNumber);
    });
  }
  disposeCanvas(e) {
    const t = this.konvaCanvasStore.get(e);
    t && (this.authorLabels.unregisterPage(e), this.hoverPreview.unregisterPage(e), this.passiveHover.unregisterPage(e), t.konvaStage.destroy(), t.wrapper.remove(), this.konvaCanvasStore.delete(e));
  }
  /**
   * 插入新的绘图容器和 Konva Stage
   * @param pageView - 当前 PDF 页面视图
   * @param pageNumber - 当前页码
   */
  insertCanvas(e, t) {
    this.cleanUpInvalidStore(), this.disposeCanvas(t);
    const o = this.createPainterWrapper(e, t), r = this.createKonvaStage(o, e.viewport);
    this.konvaCanvasStore.set(t, { pageNumber: t, konvaStage: r, wrapper: o, isActive: !1 }), this.passiveHover.registerPage(t, e.div, r), this.authorLabels.registerPage(t, o, r), this.reDrawAnnotation(t), this.enablePainting();
  }
  /**
   * 调整现有 KonvaCanvas 的缩放
   * @param pageView - 当前 PDF 页面视图
   * @param pageNumber - 当前页码
   */
  scaleCanvas(e, t) {
    const o = this.konvaCanvasStore.get(t);
    if (!o) return;
    const { konvaStage: r } = o, { scale: s, width: i, height: a } = e.viewport;
    r.scale({ x: s, y: s }), r.width(i), r.height(a), this.authorLabels.refreshPage(t), this.hoverPreview.refresh();
  }
  /**
   * 设置当前模式 (绘画模式、默认模式)
   * @param mode - 模式类型 ('painting', 'default')
   */
  setMode(e) {
    const t = e === "painting";
    document.body.classList.toggle(`${$n}`, t), Object.values(R).filter((r) => typeof r == "number").map((r) => `${fn}_${r}`).forEach((r) => document.body.classList.remove(r)), pn(Lt), this.currentAnnotation && document.body.classList.add(`${fn}_${this.currentAnnotation?.type}`);
  }
  /**
   * 保存到存储
   */
  saveToStore(e, t = !1, o) {
    if (!t && !this.can("annotation.create")) return;
    const r = t ? e : ka(
      e,
      le.getState().annotations.values(),
      this.nextAnnotationReferenceNumber
    );
    t || (this.nextAnnotationReferenceNumber = r.referenceNumber + 1);
    const s = De.find((a) => a.pdfjsAnnotationType === r.pdfjsType);
    if (le.getState().addAnnotation(r, t), this.authorLabels.refreshAnnotation(r.id), t) return;
    const i = this.createDeletedAnnotationEntry(r);
    o ? o.push(i) : this.recordHistory({
      undo: () => {
        const a = this.deleteAnnotation(r.id, !0, !1);
        return a && this.selector.delete(), a;
      },
      redo: () => this.restoreDeletedAnnotation(i)
    }), this.onAnnotationAdd(r, t, s);
  }
  /**
   * 更新存储
   */
  updateStore(e, t, o = !0, r = "annotation.edit", s, i = r !== null, a) {
    const l = le.getState().getAnnotation(e);
    if (!l || r && !this.can(r, l, s)) return;
    const u = i ? yn(
      Object.fromEntries(
        Object.keys(t).map((h) => [h, l[h]])
      )
    ) : null, d = le.getState().updateAnnotation(e, t);
    if (d && this.authorLabels.refreshAnnotation(e), d && o && this.onAnnotationChanged(d), d && u) {
      const h = yn(
        Object.fromEntries(
          Object.keys(t).map((p) => [p, d[p]])
        )
      );
      this.recordAnnotationPatchChange(e, u, h, a);
    }
    return d;
  }
  /**
   * 根据组 ID 查找编辑器
   * @param groupId - 组 ID
   * @returns 编辑器实例
   */
  findEditorForGroupId(e) {
    let t = null;
    return this.editorStore.forEach((o) => {
      if (o.shapeGroupStore?.has(e)) {
        t = o;
        return;
      }
    }), t;
  }
  /**
   * 根据页码和编辑器类型查找编辑器
   * @param pageNumber - 页码
   * @param editorType - 编辑器类型
   * @returns 编辑器实例
   */
  findEditor(e, t) {
    return this.editorStore.get(`${e}_${t}`);
  }
  /**
   * 启用特定类型的编辑器
   * @param options - 包含 Konva Stage、页码和批注类型的对象
   */
  enableEditor({ konvaStage: e, pageNumber: t, annotation: o }) {
    const r = this.findEditor(t, o.type);
    if (r) {
      if (r instanceof Kn) {
        r.activateWithSignature(e, o, this.tempDataTransfer);
        return;
      }
      if (r instanceof Xn) {
        r.activateWithStamp(e, o, this.tempDataTransfer);
        return;
      }
      r.activate(e, o);
      return;
    }
    let s = null;
    switch (o.type) {
      case R.FREETEXT:
        s = new Gs({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: o,
          onAdd: (i) => {
            this.saveToStore(i);
          },
          onChange: (i, a) => {
            this.updateStore(i, a);
          }
        });
        break;
      case R.RECTANGLE:
        s = new Us({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: o,
          onAdd: (i) => {
            this.saveToStore(i);
          },
          onChange: (i, a) => {
            this.updateStore(i, a);
          }
        });
        break;
      case R.ARROW:
        s = new ra({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: o,
          onAdd: (i) => {
            this.saveToStore(i);
          },
          onChange: (i, a) => {
            this.updateStore(i, a);
          }
        });
        break;
      case R.CLOUD:
        s = new ia({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: o,
          onAdd: (i) => {
            this.saveToStore(i);
          },
          onChange: (i, a) => {
            this.updateStore(i, a);
          }
        });
        break;
      case R.CIRCLE:
        s = new Is({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: o,
          onAdd: (i) => {
            this.saveToStore(i);
          },
          onChange: (i, a) => {
            this.updateStore(i, a);
          }
        });
        break;
      case R.NOTE:
        s = new zs({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: o,
          onAdd: (i) => {
            this.saveToStore(i);
          },
          onChange: () => {
          }
        });
        break;
      case R.FREEHAND:
        s = new Ms({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: o,
          onAdd: (i) => {
            this.saveToStore(i);
          },
          onChange: (i, a) => {
            this.updateStore(i, a);
          }
        });
        break;
      case R.FREE_HIGHLIGHT:
        s = new Ds({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: o,
          onAdd: (i) => {
            this.saveToStore(i);
          },
          onChange: (i, a) => {
            this.updateStore(i, a);
          }
        });
        break;
      case R.SIGNATURE:
        s = new Kn(
          {
            primaryColor: this.primaryColor,
            defaultOptions: this.defaultOptions,
            currentUser: this.currentUser,
            pdfViewerApplication: this.pdfViewerApplication,
            konvaStage: e,
            pageNumber: t,
            annotation: o,
            onAdd: (i) => {
              this.saveToStore(i);
            },
            onChange: () => {
            }
          },
          this.tempDataTransfer
        );
        break;
      case R.STAMP:
        s = new Xn(
          {
            primaryColor: this.primaryColor,
            defaultOptions: this.defaultOptions,
            currentUser: this.currentUser,
            pdfViewerApplication: this.pdfViewerApplication,
            konvaStage: e,
            pageNumber: t,
            annotation: o,
            onAdd: (i) => {
              this.saveToStore(i);
            },
            onChange: () => {
            }
          },
          this.tempDataTransfer
        );
        break;
      case R.HIGHLIGHT:
      case R.UNDERLINE:
      case R.STRIKEOUT:
        s = new Yn(
          {
            primaryColor: this.primaryColor,
            defaultOptions: this.defaultOptions,
            currentUser: this.currentUser,
            pdfViewerApplication: this.pdfViewerApplication,
            konvaStage: e,
            pageNumber: t,
            annotation: o,
            onAdd: (i) => {
              this.saveToStore(i);
            },
            onChange: (i, a) => {
              this.updateStore(i, a);
            }
          },
          o.type
        );
        break;
      case R.SELECT:
        this.selector.activate(t);
        break;
      default:
        console.warn(`未实现的批注类型: ${o.type}`);
        return;
    }
    s && this.editorStore.set(s.id, s);
  }
  /**
   * 启用绘画
   */
  enablePainting() {
    this.konvaCanvasStore.forEach(({ konvaStage: e, pageNumber: t }) => {
      this.currentAnnotation && this.enableEditor({
        konvaStage: e,
        pageNumber: t,
        annotation: this.currentAnnotation
        // 启用特定类型的编辑器
      });
    });
  }
  /**
   * 重新绘制批注
   * @param pageNumber - 页码
   */
  reDrawAnnotation(e) {
    const t = this.konvaCanvasStore.get(e);
    le.getState().getByPage(e).forEach((r) => {
      let s = this.findEditor(e, r.type);
      if (!s) {
        const i = De.find((a) => a.type === r.type);
        this.enableEditor({ konvaStage: t.konvaStage, pageNumber: e, annotation: i }), s = this.findEditor(e, r.type);
      }
      s && s.addSerializedGroupToLayer(t.konvaStage, r.konvaString);
    }), this.authorLabels.refreshPage(e), this.hoverPreview.refresh();
  }
  /**
   * 删除批注
   * @param id - 批注 ID
   */
  deleteAnnotation(e, t = !1, o = !0) {
    const r = le.getState().getAnnotation(e);
    if (!r || o && !this.can("annotation.delete", r)) return !1;
    this.annotationHover.clearAnnotation(e), le.getState().removeAnnotation(e), this.authorLabels.remove(e);
    const s = this.findEditor(r.pageNumber, r.type), i = this.konvaCanvasStore.get(r.pageNumber);
    return s && i && s.deleteGroup(e, i.konvaStage), t && this.onAnnotationDelete(e), !0;
  }
  createDeletedAnnotationEntry(e) {
    const t = Array.from(le.getState().annotations.keys()), r = this.konvaCanvasStore?.get(e.pageNumber)?.konvaStage?.findOne((s) => s.getType() === "Group" && s.name() === _e && s.id() === e.id);
    return {
      kind: "annotation",
      annotation: vn(e),
      storeIndex: Math.max(0, t.indexOf(e.id)),
      konvaIndex: r?.zIndex() ?? null
    };
  }
  restoreDeletedAnnotation(e) {
    const t = vn(e.annotation);
    if (!le.getState().restoreAnnotation(t, e.storeIndex))
      return console.warn(`Annotation with id ${t.id} already exists; delete undo was skipped.`), !1;
    const r = this.konvaCanvasStore.get(t.pageNumber);
    if (r) {
      let i = this.findEditor(t.pageNumber, t.type);
      if (!i) {
        const l = De.find((u) => u.type === t.type);
        l && (this.enableEditor({
          konvaStage: r.konvaStage,
          pageNumber: t.pageNumber,
          annotation: l
        }), i = this.findEditor(t.pageNumber, t.type));
      }
      i?.addSerializedGroupToLayer(r.konvaStage, t.konvaString);
      const a = r.konvaStage.findOne((l) => l.getType() === "Group" && l.name() === _e && l.id() === t.id);
      if (a && e.konvaIndex !== null) {
        const l = a.getParent()?.getChildren().length ?? 1;
        a.zIndex(Math.min(e.konvaIndex, l - 1));
      }
      r.konvaStage.batchDraw();
    }
    this.authorLabels.refreshAnnotation(t.id), this.hoverPreview.refresh();
    const s = De.find((i) => i.pdfjsAnnotationType === t.pdfjsType);
    return this.onAnnotationAdd(t, !1, s), !0;
  }
  restoreDeletedComment(e) {
    const t = le.getState().getAnnotation(e.annotationId);
    if (!t || t.comments.some((s) => s.id === e.comment.id)) return !1;
    const o = [...t.comments], r = Math.max(0, Math.min(e.commentIndex, o.length));
    return o.splice(r, 0, ro(e.comment)), !!this.updateStore(t.id, { comments: o }, !0, null);
  }
  /**
   * 关闭绘画
   */
  disablePainting() {
    this.setMode("default"), this.clearTempDataTransfer(), this.selector.clear();
  }
  /**
   * 保存临时数据传输
   * @param data - 数据
   * @returns 临时数据传输
   */
  saveTempDataTransfer(e) {
    return this.tempDataTransfer = e, this.tempDataTransfer;
  }
  /**
   * 清除临时数据传输
   * @returns 临时数据传输
   */
  clearTempDataTransfer() {
    return this.tempDataTransfer = null, this.tempDataTransfer;
  }
  /**
   * 初始化或更新 KonvaCanvas
   * @param params - 包含当前 PDF 页面视图、是否需要 CSS 转换和页码的对象
   */
  initCanvas({ pageView: e, cssTransform: t, pageNumber: o }) {
    t ? this.scaleCanvas(e, o) : this.insertCanvas(e, o);
  }
  /**
   * 初始化 WebSelection
   * @param rootElement - 根 DOM 元素
   */
  initWebSelection(e) {
    this.webSelection.create(e);
  }
  setPositionedTextSource(e) {
    this.webSelection.setPositionedTextSource(e);
  }
  /**
   * 激活特定批注类型
   * @param annotation - 批注类型对象
   * @param dataTransfer - 数据传输
   */
  activate(e, t) {
    if (e?.type !== R.SELECT && e && !this.can("annotation.create")) {
      this.syncCurrentAnnotation(null), this.disablePainting(), this.setDefaultMode();
      return;
    }
    if (this.syncCurrentAnnotation(e), this.passiveHover.clear(), this.disablePainting(), this.saveTempDataTransfer(t || ""), !!e) {
      switch (e.type) {
        case R.FREETEXT:
        case R.RECTANGLE:
        case R.CIRCLE:
        case R.FREEHAND:
        case R.FREE_HIGHLIGHT:
        case R.SIGNATURE:
        case R.STAMP:
        case R.SELECT:
        case R.NOTE:
        case R.ARROW:
        case R.CLOUD:
          this.setMode("painting");
          break;
        default:
          this.setMode("default");
          break;
      }
      this.enablePainting();
    }
  }
  /**
   * 重置 PDF.js 批注存储
   */
  resetPdfjsAnnotationStorage() {
  }
  /**
   * @description 根据 range 加亮
   * @param range
   * @param annotation
   */
  highlightRange(e, t) {
    this.can("annotation.create") && (this.syncCurrentAnnotation(t), this.webSelection.highlight(e));
  }
  /**
   * @description 选中对应 ID 批注
   * @param id
   */
  selectAnnotation(e, t, o = t ? et.CANVAS : et.SIDEBAR) {
    this.setDefaultMode(), this.nextSelectionSource = o, this.selector.select(e, t);
  }
  /**
   * @description 将annotation 存入 store, 包含外部 annotation 和 pdf 文件上的 annotation
   */
  async initAnnotationsOnce(e, t) {
    const o = to(e);
    if (this.nextAnnotationReferenceNumber = Math.min(
      Zt(o) + 1,
      Number.MAX_SAFE_INTEGER
    ), t) {
      const i = await this.transform.decodePdfAnnotation();
      i.forEach((a) => {
        this.saveToStore(a, !0);
      }), o.forEach((a) => {
        i.has(a.id) ? this.updateStore(a.id, a, !0, null) : this.saveToStore(a, !0);
      });
    } else
      o.forEach((i) => {
        this.saveToStore(i, !0);
      });
    const r = le.getState(), s = to(
      Array.from(r.annotations.values())
    );
    r.setAnnotationReferenceNumbers(
      new Map(s.map((i) => [
        i.id,
        i.referenceNumber
      ]))
    ), this.nextAnnotationReferenceNumber = Math.min(
      Zt(s) + 1,
      Number.MAX_SAFE_INTEGER
    );
  }
  /**
   * Replace the provider state after a serialized writer transfer. This is
   * intentionally silent: the incoming snapshot is already durable state,
   * not a new local mutation.
   */
  async replaceAnnotations(e, t = !1) {
    this.disablePainting(), this.clearHistory(), this.editorStore.forEach((o) => {
      o.shapeGroupStore.forEach((r) => r.konvaGroup.destroy());
    }), this.editorStore.clear(), le.getState().clearAnnotations(), await this.initAnnotationsOnce(e, t), this.konvaCanvasStore.forEach(({ pageNumber: o }) => this.reDrawAnnotation(o));
  }
  /**
   * @description 更新 store
   * @param id
   * @param updates
   */
  update(e, t, o = "annotation.edit", r) {
    return this.updateStore(e, t, !0, o, r);
  }
  /**
   * @description 删除 annotation
   * @param id
   */
  delete(e, t = !1) {
    const o = le.getState().getAnnotation(e);
    if (!o || !this.can("annotation.delete", o)) return !1;
    const r = this.createDeletedAnnotationEntry(o), s = this.deleteAnnotation(e, t);
    if (s && this.selector.delete(), !s) return !1;
    const i = this.recordHistory({
      undo: () => this.restoreDeletedAnnotation(r),
      redo: () => {
        const a = this.deleteAnnotation(e, !0, !1);
        return a && this.selector.delete(), a;
      }
    });
    return t && this.deleteUndoController?.add(r, i ?? void 0), s;
  }
  deleteCommentWithoutHistory(e, t) {
    const o = le.getState().getAnnotation(e);
    if (!o || !o.comments.some((s) => s.id === t)) return !1;
    const r = o.comments.filter((s) => s.id !== t);
    return !!this.updateStore(e, { comments: r }, !0, null, void 0, !1);
  }
  deleteComment(e, t) {
    const o = le.getState().getAnnotation(e), r = o?.comments.findIndex((d) => d.id === t) ?? -1;
    if (!o || r < 0) return !1;
    const s = o.comments[r];
    if (!this.can("comment.delete", o, s)) return !1;
    const i = {
      kind: "comment",
      annotationId: e,
      annotationReferenceNumber: o.referenceNumber,
      previewAnnotation: vn(o),
      comment: ro(s),
      commentIndex: r
    }, a = o.comments.filter((d) => d.id !== t);
    if (!this.updateStore(e, { comments: a }, !0, "comment.delete", s, !1)) return !1;
    const u = this.recordHistory({
      undo: () => this.restoreDeletedComment(i),
      redo: () => this.deleteCommentWithoutHistory(e, t)
    });
    return this.deleteUndoController?.add(i, u ?? void 0), !0;
  }
  subscribeDeleteUndo(e) {
    return this.deleteUndoController?.subscribe(e) ?? (() => {
    });
  }
  getDeleteUndoSnapshot() {
    return this.deleteUndoController?.getSnapshot() ?? null;
  }
  pauseDeleteUndo() {
    this.deleteUndoController?.pause();
  }
  resumeDeleteUndo() {
    this.deleteUndoController?.resume();
  }
  undoDelete() {
    const e = this.deleteUndoController?.takeEntries() ?? [];
    let t = 0;
    const o = /* @__PURE__ */ new Set();
    return e.reverse().forEach((r) => {
      if (r.kind === "comment" && o.has(r.annotationId)) return;
      const s = r.historyId !== void 0 && this.mutationHistory ? this.mutationHistory.undoEntry(r.historyId) : r.kind === "annotation" ? this.restoreDeletedAnnotation(r) : this.restoreDeletedComment(r);
      r.kind === "annotation" && !s && o.add(r.annotation.id), s && (t += 1);
    }), t;
  }
  cancelHighlightRequest() {
    return this.highlightRequestId += 1, this.highlightRetryTimer !== null && (window.clearTimeout(this.highlightRetryTimer), this.highlightRetryTimer = null), this.resolveHighlightRequest?.(!1), this.resolveHighlightRequest = null, this.highlightRequestId;
  }
  /**
   * @description 高亮选中 annotation
   * @param annotation
   */
  highlight(e) {
    const t = this.cancelHighlightRequest(), o = e.pageNumber - 1, r = this.pdfViewerApplication._pages?.[o] || this.pdfViewerApplication.getPageView(o), { x: s, y: i } = e.konvaClientRect;
    if (r?.viewport) {
      const u = s * r.viewport.scale, d = Math.max(0, i * r.viewport.scale - 200), [h, p] = r.viewport.convertToPdfPoint(u, d);
      this.pdfViewerApplication.scrollPageIntoView({
        pageNumber: e.pageNumber,
        destArray: [null, { name: "XYZ" }, h, p, null],
        allowNegativeOffset: !0
      });
    } else
      this.pdfViewerApplication.scrollPageIntoView({
        pageNumber: e.pageNumber
      });
    const a = 30, l = 100;
    return new Promise((u) => {
      this.resolveHighlightRequest = u;
      const d = (p) => {
        t === this.highlightRequestId && (this.highlightRetryTimer !== null && (window.clearTimeout(this.highlightRetryTimer), this.highlightRetryTimer = null), this.resolveHighlightRequest = null, u(p));
      }, h = (p) => {
        if (t !== this.highlightRequestId) return;
        if (this.findEditor(e.pageNumber, e.type)) {
          this.setDefaultMode(), this.selector.select(e.id), this.currentAnnotation && this.currentAnnotation.type === R.SELECT && this.selector.activate(e.pageNumber), d(!0);
          return;
        }
        if (p <= 0) {
          d(!1);
          return;
        }
        this.highlightRetryTimer = window.setTimeout(() => {
          this.highlightRetryTimer = null, h(p - 1);
        }, l);
      };
      h(a);
    });
  }
  getData() {
    return Array.from(le.getState().annotations.values());
  }
  /**
   * @description 更新样式
   * @param annotationStore
   * @param styles
   */
  updateAnnotationStyle(e, t) {
    if (!this.can("annotation.edit", e)) return;
    const o = this.findEditorForGroupId(e.id);
    o && o.updateStyle(e, t);
  }
  getKonvaCanvasStore() {
    return this.konvaCanvasStore;
  }
  reRenderAnnotations(e) {
    this.reDrawAnnotation(e);
  }
  /**
   * 销毁 Painter 实例，清理所有资源
   */
  destroy() {
    this.cancelHighlightRequest(), this.clearHistory(), this.disablePainting(), this.webSelection.destroy(), this.passiveHover.destroy(), this.annotationHover.destroy(), this.unsubscribeAnnotationHover(), this.hoverPreview.destroy(), this.authorLabels.destroy(), window.removeEventListener("keyup", this.globalKeyUpHandler), this.konvaCanvasStore.forEach((t) => {
      t.konvaStage.destroy();
    }), this.konvaCanvasStore.clear(), this.editorStore.clear(), this.selector.delete(), this.clearTempDataTransfer(), this.currentAnnotation = null, document.body.classList.remove(`${$n}`), Object.values(R).filter((t) => typeof t == "number").map((t) => `${fn}_${t}`).forEach((t) => document.body.classList.remove(t)), pn(Lt);
  }
}
const tr = nn(void 0), ot = () => {
  const n = Gt(tr);
  if (n === void 0)
    throw new Error("usePainter must be used within a PainterProvider");
  return n;
}, Ua = {
  placement: "bottom",
  middleware: [Po()]
}, nr = on(function(e, t) {
  const {
    buttons: o,
    renderButtons: r,
    positionOptions: s = Ua,
    visible: i,
    onVisibleChange: a,
    children: l
  } = e, u = i !== void 0, [d, h] = Y(!1), p = u ? i : d, g = X((D) => {
    u ? a?.(D) : h(D);
  }, [u, a]), [f, S] = Y(null), m = B(null), v = B(null), b = B(null), w = X(() => {
    g(!1), v.current = null, b.current = null;
  }, [g]), x = X((D) => {
    if (v.current = D, b.current = null, !D) {
      w();
      return;
    }
    g(!0);
    const A = D.getBoundingClientRect();
    let L = A;
    if (A.top < 0 || A.left < 0) {
      const j = window.getSelection();
      if (j && j.rangeCount > 0) {
        const _ = j.focusNode, O = j.anchorNode;
        if (_ && O) {
          const Z = document.createRange(), K = document.createRange();
          j.anchorOffset <= j.focusOffset ? (Z.setStart(j.anchorNode, j.anchorOffset), Z.setEnd(j.anchorNode, Math.min(j.anchorOffset + 1, j.anchorNode.textContent?.length || 0)), K.setStart(j.focusNode, Math.max(j.focusOffset - 1, 0)), K.setEnd(j.focusNode, j.focusOffset)) : (Z.setStart(j.focusNode, j.focusOffset), Z.setEnd(j.focusNode, Math.min(j.focusOffset + 1, j.focusNode.textContent?.length || 0)), K.setStart(j.anchorNode, Math.max(j.anchorOffset - 1, 0)), K.setEnd(j.anchorNode, j.anchorOffset));
          const k = Z.getBoundingClientRect(), H = K.getBoundingClientRect();
          L = {
            top: Math.max(0, Math.min(k.top, H.top)),
            left: Math.max(0, Math.min(k.left, H.left)),
            bottom: Math.max(k.bottom, H.bottom),
            right: Math.max(k.right, H.right),
            width: Math.abs(H.right - k.left),
            height: Math.max(k.height, H.height),
            x: Math.max(0, Math.min(k.x, H.x)),
            y: Math.max(0, Math.min(k.y, H.y)),
            toJSON: A.toJSON
          };
        }
      }
    }
    const $ = {
      getBoundingClientRect: () => L
    };
    requestAnimationFrame(() => {
      m.current && Yt($, m.current, s).then(({ x: j, y: _ }) => {
        m.current && Object.assign(m.current.style, {
          left: `${j}px`,
          top: `${_}px`
        });
      }).catch((j) => {
        console.warn("Failed to compute popover position:", j);
      });
    });
  }, [w, s, g]), E = ke(() => (r ? r({ range: v.current, rect: b.current, close: w }) : o || []).map((A) => /* @__PURE__ */ T(
    be,
    {
      size: "2",
      variant: "ghost",
      color: "gray",
      highContrast: !0,
      style: {
        opacity: A.disabled ? 0.5 : 1,
        boxShadow: "none",
        margin: "0"
      },
      onMouseDown: () => {
        A.onClick(v.current, b.current);
      },
      disabled: A.disabled,
      children: [
        A.icon,
        A.title
      ]
    },
    A.key
  )), [o, w, r]), I = E.length > 0 || !!l;
  ne(() => {
    if (!I) {
      p && b.current && f === null && S(b.current);
      return;
    }
    p && m.current && f && (Yt({
      getBoundingClientRect: () => f
    }, m.current, s).then(({ x: A, y: L }) => {
      m.current && Object.assign(m.current.style, {
        left: `${A}px`,
        top: `${L}px`
      });
    }).catch((A) => {
      console.warn("Failed to compute popover position:", A);
    }), S(null));
  }, [I, p, f, s]);
  const P = X((D) => {
    if (v.current = null, b.current = D, m.current || S(D), g(!0), m.current) {
      const A = {
        getBoundingClientRect: () => D
      };
      requestAnimationFrame(() => {
        m.current && Yt(A, m.current, s).then(({ x: L, y: $ }) => {
          m.current && Object.assign(m.current.style, {
            left: `${L}px`,
            top: `${$}px`
          });
        }).catch((L) => {
          console.warn("Failed to compute popover position:", L);
        });
      });
    }
  }, [s, g]);
  Dn(t, () => ({
    open: x,
    openWithRect: P,
    close: w
  }), [x, P, w]);
  const { appearance: W } = rn(), F = {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 999,
    display: p ? "block" : "none",
    width: "max-content",
    backgroundColor: W === "light" ? "#fff" : "#242430",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: 4,
    padding: "2px"
  };
  return I ? /* @__PURE__ */ c(
    "div",
    {
      ref: m,
      style: F,
      children: l || /* @__PURE__ */ c(Q, { gap: "1", align: "center", children: E })
    }
  ) : null;
}), za = on(function(e, t) {
  const { t: o } = ye(["annotator"], { useSuspense: !1 }), {
    popoverBarProps: r = {}
  } = e, s = Pt.useRef(null), { painter: i } = ot();
  return Dn(t, () => ({
    open: (a) => {
      s.current?.open(a);
    },
    close: () => {
      s.current?.close();
    }
  }), []), /* @__PURE__ */ c(
    nr,
    {
      ref: s,
      renderButtons: () => [
        {
          key: "highlight",
          icon: /* @__PURE__ */ c(Uo, {}),
          onClick: (a) => {
            const l = De.find((u) => u.name === "highlight");
            i?.highlightRange(a, l), s.current?.close();
          },
          title: o("annotator:tool.highlight")
        },
        {
          key: "underline",
          icon: /* @__PURE__ */ c(Fo, {}),
          onClick: (a) => {
            const l = De.find((u) => u.name === "underline");
            i?.highlightRange(a, l), s.current?.close();
          },
          title: o("annotator:tool.underline")
        },
        {
          key: "strikeout",
          icon: /* @__PURE__ */ c(zo, {}),
          onClick: (a) => {
            const l = De.find((u) => u.name === "strikeout");
            i?.highlightRange(a, l), s.current?.close();
          },
          title: o("annotator:tool.strikeout")
        }
      ],
      ...r
    }
  );
}), or = nn(null), Nt = () => {
  const n = Gt(or);
  if (!n)
    throw new Error("useOptionsContext must be used within a OptionsProvider");
  return n;
}, Fa = "_ColorPicker_18032_1", ja = "_cell_18032_1", Ba = "_active_18032_21", bn = {
  ColorPicker: Fa,
  cell: ja,
  active: Ba
};
function rr(n, e) {
  if (!jt(n) || !jt(e))
    return e !== void 0 ? e : n;
  const t = { ...n }, o = e, r = n;
  return Object.keys(o).forEach((s) => {
    const i = o[s], a = r[s];
    if (Array.isArray(i)) {
      t[s] = i;
      return;
    }
    if (jt(i) && jt(a)) {
      t[s] = rr(a, i);
      return;
    }
    i !== void 0 && (t[s] = i);
  }), t;
}
function jt(n) {
  return n !== null && typeof n == "object" && Object.prototype.toString.call(n) === "[object Object]";
}
function Wa(n) {
  const e = document.createElement("canvas");
  e.width = e.height = 1;
  const t = e.getContext("2d", { colorSpace: "srgb" });
  if (!t)
    return n;
  t.fillStyle = n, t.fillRect(0, 0, 1, 1);
  const o = t.getImageData(0, 0, 1, 1).data;
  return `rgb(${o[0]}, ${o[1]}, ${o[2]})`;
}
function so() {
  const n = document.getElementById("InkLayer");
  if (n) {
    const t = getComputedStyle(n).getPropertyValue("--accent-9").trim();
    return Wa(t);
  }
  return "#1677ff";
}
function ao(n) {
  const e = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, t = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  if (n = n.trim().toLowerCase(), e.test(n))
    return n.length === 4 ? "#" + n.slice(1).split("").map((r) => r + r).join("") : n;
  const o = n.match(t);
  if (o) {
    const r = Number(o[1]), s = Number(o[2]), i = Number(o[3]), a = (l) => Math.max(0, Math.min(255, l));
    return "#" + [r, s, i].map((l) => a(l).toString(16).padStart(2, "0")).join("");
  }
  throw new Error(`Unsupported color format: ${n}`);
}
function Va(n, e) {
  try {
    return ao(n) === ao(e);
  } catch {
    return !1;
  }
}
function $a(n, e, t = !1) {
  let o = null;
  return function(...r) {
    const s = t && !o;
    o && clearTimeout(o), o = setTimeout(() => {
      o = null, t || n.apply(this, r);
    }, e), s && n.apply(this, r);
  };
}
const Et = ({
  value: n = "#000000",
  onChange: e,
  presets: t = [],
  transparent: o = !1,
  popover: r = !1,
  custom: s = !0,
  trigger: i,
  open: a,
  onOpenChange: l,
  contentRef: u,
  onContentPointerEnter: d,
  onContentPointerLeave: h,
  onPointerDownOutside: p
}) => {
  const { t: g } = ye("common", { useSuspense: !1 }), [f, S] = Y(n);
  Pt.useEffect(() => {
    S(n);
  }, [n]);
  const m = (w) => {
    S(w), e?.(w);
  }, v = (w) => {
    m(w);
  }, b = () => /* @__PURE__ */ c(lt, { maxWidth: "240px", className: bn.ColorPicker, children: /* @__PURE__ */ c(Ir, { size: "2", variant: "ghost", children: /* @__PURE__ */ T(Q, { direction: "column", gap: "3", children: [
    s && /* @__PURE__ */ c(ci, { color: f, onChange: m }),
    /* @__PURE__ */ c($t, { columns: "5", gap: "2", children: t?.map((w) => /* @__PURE__ */ c(
      "div",
      {
        className: `${bn.cell} ${Va(f, w) ? bn.active : ""}`,
        onMouseDown: () => v(w),
        children: /* @__PURE__ */ c("span", { style: { backgroundColor: w } })
      },
      w
    )) }),
    o && /* @__PURE__ */ c(tt, { variant: "ghost", onClick: () => v("transparent"), children: g("transparent") })
  ] }) }) });
  return /* @__PURE__ */ c(ve, { children: r ? /* @__PURE__ */ T(Ae.Root, { open: a, onOpenChange: l, children: [
    /* @__PURE__ */ c(Ae.Trigger, { children: i || /* @__PURE__ */ c(tt, { variant: "outline", color: "gray", children: /* @__PURE__ */ T("svg", { viewBox: "0 0 1024 1024", style: { width: "1em", height: "1em", color: f }, children: [
      /* @__PURE__ */ c("path", { d: "M96 837.68888888h832v160H96z", fill: "currentColor" }),
      /* @__PURE__ */ c("path", { d: "M429.30646525 163.315053m54.92260742 54.92260743l164.76782227 164.76782227q54.92260742 54.92260742 0 109.84521486l-164.76782227 164.76782228q-54.92260742 54.92260742-109.84521486 0l-164.76782228-164.76782228q-54.92260742-54.92260742 0-109.84521486l164.76782228-164.76782227q54.92260742-54.92260742 109.84521486 0Z", fill: "#FFFFFF" }),
      /* @__PURE__ */ c("path", { d: "M364.65047577 163.33699097L262.12304466 60.85098508 320.69831237 2.23429214l153.14905568 153.10763046c2.94119095 2.27838736 5.79953147 4.76390083 8.5335963 7.45654045l234.34249608 234.34249608a82.85044939 82.85044939 0 0 1 0 117.15053543l-234.34249608 234.34249607a82.85044939 82.85044939 0 0 1-117.19196065 0L130.88793283 514.29149456a82.85044939 82.85044939 0 0 1 0-117.15053543l233.76254294-233.80396816z m220.2579197 219.13943862l-0.57995316 0.53852791-161.0612736-161.0612736-226.72025474 226.67882952h454.51756532L584.90839547 382.47642959zM822.68918518 783.3069037a103.56306173 103.56306173 0 0 1-103.56306171-103.56306173c0-57.16681008 87.61435022-161.39267539 103.56306171-161.3926754 15.9487115 0 103.56306173 104.1844401 103.56306173 161.3926754a103.56306173 103.56306173 0 0 1-103.56306173 103.56306173z", fill: "#000000d6" })
    ] }) }) }),
    /* @__PURE__ */ c(
      Ae.Content,
      {
        ref: u,
        sideOffset: 0,
        onPointerDownOutside: () => {
          p ? p() : l?.(!1);
        },
        onPointerEnter: d,
        onPointerLeave: h,
        children: /* @__PURE__ */ c(b, {})
      }
    )
  ] }) : /* @__PURE__ */ c(b, {}) });
};
function Ya(n) {
  return M.Node.create(n).children[0];
}
const Ka = on(function(e, t) {
  const { t: o } = ye(["common", "annotator"], { useSuspense: !1 }), { openSidebar: r, activeSidebarPanel: s, viewerContainerRef: i } = Fe(), { painter: a, requestWrite: l } = ot(), { defaultOptions: u } = Nt(), { popoverBarProps: d = {} } = e, h = B(null), [p, g] = Y(null), [f, S] = Y(2), [m, v] = Y(1), [b, w] = Y(!1), x = B(null), E = X((_, O) => {
    const Z = `${kn}_page_${_.pageNumber}`, K = i?.current?.querySelector(
      `#${Z} .konvajs-content`
    );
    if (K) {
      const k = K.getBoundingClientRect(), H = O.x + k.left, oe = O.y + k.top, N = {
        x: H,
        y: oe,
        width: O.width,
        height: O.height,
        top: oe,
        left: H,
        right: H + O.width,
        bottom: oe + O.height,
        toJSON: () => ({})
      };
      h.current?.openWithRect(N);
    }
  }, [i]);
  Qe(() => {
    const _ = x.current;
    !p || !_ || E(p, _);
  }, [E, p, b]), Dn(t, () => ({
    open: (_, O) => {
      g(_), x.current = O;
      const Z = Ya(_.konvaString);
      S(Z.strokeWidth()), v(Z.opacity() * 100), E(_, O);
    },
    close: () => {
      h.current?.close(), g(null), w(!1), x.current = null;
    }
  }));
  const I = p && De.find((_) => _.type === p.type)?.styleEditable, P = !!l, W = !!(p && (a?.can("annotation.comment", p) || P)), F = !!(p && (a?.can("annotation.edit", p) || P)), D = !!(p && (a?.can("annotation.delete", p) || P)), A = async (_, O) => a?.can(_, O) ? O : !l || !await l({ kind: "mutation", action: _, annotationId: O.id }) ? null : le.getState().getAnnotation(O.id) ?? O, L = (_) => {
    !p || !a || A("annotation.edit", p).then((O) => {
      O && a.updateAnnotationStyle(O, _);
    });
  }, $ = () => {
    !p || !a || A("annotation.delete", p).then((_) => {
      _ && a.delete(_.id, !0);
    });
  }, j = (_) => {
    if (a?.can("annotation.comment", _)) {
      r("annotator-sidebar-toggle"), le.getState().setSelectedAnnotation(_, et.CANVAS);
      return;
    }
    A("annotation.comment", _).then((O) => {
      O && (r("annotator-sidebar-toggle"), le.getState().setSelectedAnnotation(O, et.CANVAS));
    });
  };
  return /* @__PURE__ */ c(
    nr,
    {
      ref: h,
      renderButtons: () => p ? [
        ...W && s !== "annotator-sidebar-toggle" ? [
          {
            key: "comment",
            icon: /* @__PURE__ */ c(jo, {}),
            onClick: () => {
              j(p), h.current?.close();
            },
            title: o("comment")
          }
        ] : [],
        ...F && I ? [
          {
            key: "palette",
            icon: /* @__PURE__ */ c(ws, {}),
            onClick: () => {
              w(!b);
            },
            title: o("color")
          }
        ] : [],
        ...D ? [{
          key: "delete",
          icon: /* @__PURE__ */ c(As, {}),
          onClick: () => {
            $(), h.current?.close();
          },
          title: o("delete")
        }] : []
      ] : [],
      ...d,
      children: b && p && F && I && /* @__PURE__ */ T("div", { style: { margin: 8 }, children: [
        /* @__PURE__ */ T(
          be,
          {
            size: "2",
            variant: "ghost",
            color: "gray",
            highContrast: !0,
            onMouseDown: (_) => {
              _.preventDefault(), w(!1);
            },
            children: [
              /* @__PURE__ */ c(Or, {}),
              o("back")
            ]
          }
        ),
        /* @__PURE__ */ c(nt, { my: "2", size: "4" }),
        I?.color && /* @__PURE__ */ c(
          Et,
          {
            value: p.color ?? void 0,
            onChange: (_) => {
              L({ color: _ });
            },
            popover: !1,
            custom: !1,
            presets: u.colors
          }
        ),
        (I?.opacity || I?.strokeWidth) && /* @__PURE__ */ T(ve, { children: [
          /* @__PURE__ */ c(nt, { my: "3", size: "4" }),
          /* @__PURE__ */ c(lt, { style: { margin: 8 }, children: /* @__PURE__ */ T(Q, { gap: "3", direction: "column", children: [
            I.strokeWidth && /* @__PURE__ */ T(ve, { children: [
              /* @__PURE__ */ T(de, { as: "div", size: "2", weight: "bold", children: [
                o("strokeWidth"),
                " (",
                f,
                ")"
              ] }),
              /* @__PURE__ */ c(
                Fn,
                {
                  variant: "soft",
                  size: "1",
                  min: 1,
                  max: 20,
                  defaultValue: [f || 1],
                  onValueChange: (_) => {
                    L({ strokeWidth: _[0] }), S(_[0]);
                  }
                }
              )
            ] }),
            I.opacity && /* @__PURE__ */ T(ve, { children: [
              /* @__PURE__ */ T(de, { as: "div", size: "2", weight: "bold", children: [
                o("opacity"),
                " (",
                m,
                "%)"
              ] }),
              /* @__PURE__ */ c(
                Fn,
                {
                  variant: "soft",
                  size: "1",
                  min: 1,
                  max: 100,
                  defaultValue: [m || 100],
                  onValueChange: (_) => {
                    L({ opacity: _[0] / 100 }), v(_[0]);
                  }
                }
              )
            ] })
          ] }) })
        ] })
      ] })
    }
  );
}), co = 500;
function Sn(n) {
  const e = n?.replace(/\s+/g, " ").trim() ?? "";
  return e.length <= co ? e : `${e.slice(0, co).trimEnd()}…`;
}
const Xa = "_card_ijigf_1", qa = "_header_ijigf_7", Ja = "_identity_ijigf_15", Za = "_referenceLabel_ijigf_23", Qa = "_referenceLabelStatic_ijigf_44", ec = "_separator_ijigf_50", tc = "_author_ijigf_54", nc = "_page_ijigf_61", oc = "_selectedText_ijigf_67", rc = "_preview_ijigf_68", ic = "_empty_ijigf_69", sc = "_footer_ijigf_93", ac = "_deletedComments_ijigf_98", cc = "_deletedCommentsTitle_ijigf_105", lc = "_deletedCommentAuthor_ijigf_106", dc = "_deletedCommentsMore_ijigf_107", uc = "_deletedComment_ijigf_98", hc = "_deletedCommentContent_ijigf_117", Me = {
  card: Xa,
  header: qa,
  identity: Ja,
  referenceLabel: Za,
  referenceLabelStatic: Qa,
  separator: ec,
  author: tc,
  page: nc,
  selectedText: oc,
  preview: rc,
  empty: ic,
  footer: sc,
  deletedComments: ac,
  deletedCommentsTitle: cc,
  deletedCommentAuthor: lc,
  deletedCommentsMore: dc,
  deletedComment: uc,
  deletedCommentContent: hc
}, ir = ({
  annotation: n,
  children: e,
  onActivate: t,
  onOpenChange: o,
  previewComments: r = []
}) => {
  const { t: s } = ye("annotator", { useSuspense: !1 }), [i, a] = Y(!1), l = Sn(n.contentsObj?.text), u = Sn(n.contentsObj?.selectedText), d = r.length > 0, h = !!(l || u || d), p = n.user?.name || n.title, g = n.comments?.length ?? 0, f = n.referenceNumber === void 0 ? n.title : `#${n.referenceNumber}`, S = () => {
    t && (a(!1), t(n.id));
  }, m = (v) => {
    a(v), o?.(v);
  };
  return /* @__PURE__ */ T(
    hn.Root,
    {
      open: i,
      onOpenChange: m,
      openDelay: 350,
      closeDelay: 150,
      children: [
        /* @__PURE__ */ c(hn.Trigger, { children: e }),
        /* @__PURE__ */ T(
          hn.Content,
          {
            align: "center",
            size: "2",
            className: Me.card,
            onClick: (v) => v.stopPropagation(),
            children: [
              /* @__PURE__ */ T("div", { className: Me.header, children: [
                /* @__PURE__ */ T("span", { className: Me.identity, children: [
                  t ? /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      className: Me.referenceLabel,
                      "aria-label": s("comment.reference.open", {
                        value: f
                      }),
                      onClick: S,
                      children: f
                    }
                  ) : /* @__PURE__ */ c("span", { className: Me.referenceLabelStatic, children: f }),
                  /* @__PURE__ */ c("span", { className: Me.separator, "aria-hidden": "true", children: "·" }),
                  /* @__PURE__ */ c("span", { className: Me.author, children: p })
                ] }),
                /* @__PURE__ */ c("span", { className: Me.page, children: s("comment.reference.previewPage", {
                  value: n.pageNumber
                }) })
              ] }),
              u ? /* @__PURE__ */ c("blockquote", { className: Me.selectedText, children: u }) : null,
              !d && l ? /* @__PURE__ */ c("p", { className: Me.preview, children: l }) : null,
              d ? /* @__PURE__ */ T("section", { className: Me.deletedComments, children: [
                /* @__PURE__ */ c("div", { className: Me.deletedCommentsTitle, children: s("deleteUndo.deletedCommentPreview") }),
                r.slice(0, 3).map((v) => /* @__PURE__ */ T("div", { className: Me.deletedComment, children: [
                  /* @__PURE__ */ c("span", { className: Me.deletedCommentAuthor, children: v.user?.name || v.title }),
                  /* @__PURE__ */ c("p", { className: Me.deletedCommentContent, children: Sn(v.content) || s("comment.reference.previewNoContent") })
                ] }, v.id)),
                r.length > 3 ? /* @__PURE__ */ c("div", { className: Me.deletedCommentsMore, children: s("deleteUndo.deletedCommentsMore", {
                  count: r.length - 3
                }) }) : null
              ] }) : null,
              h ? null : /* @__PURE__ */ c("p", { className: Me.empty, children: s("comment.reference.previewNoContent") }),
              g > 0 && !d ? /* @__PURE__ */ c("div", { className: Me.footer, children: s("comment.reference.replyCount", {
                count: g
              }) }) : null
            ]
          }
        )
      ]
    }
  );
}, pc = "_overlay_1ya7e_1", fc = "_snackbar_1ya7e_13", gc = "_content_1ya7e_18", mc = "_message_1ya7e_22", vc = "_reference_1ya7e_29", Mt = {
  overlay: pc,
  snackbar: fc,
  content: gc,
  message: mc,
  reference: vc
}, lo = 24, yc = /#(\d+)/g;
function bc(n) {
  const e = n?.replace(/\s+/g, " ").trim() ?? "", t = Array.from(e);
  return t.length <= lo ? e : `${t.slice(0, lo).join("")}…`;
}
function Sc(n) {
  return n.annotationReferenceNumber === void 0 ? "" : ` #${n.annotationReferenceNumber}`;
}
function uo(n) {
  return `“${n}”`;
}
function wc(n, e, t) {
  const o = Array.from(new Set(n.map((i) => i.annotationReferenceNumber).filter((i) => i !== void 0))), r = t.startsWith("zh") ? "、" : ", ", s = o.slice(0, 3).map((i) => `#${i}`).join(r);
  return o.length > 3 ? e("annotator:deleteUndo.referencesMore", { references: s }) : s;
}
function Cc(n, e, t) {
  if (n.totalCount === 1) {
    const r = n.items[0], s = Sc(r), i = bc(r.content);
    if (r.kind === "annotation") {
      if (i)
        return e("annotator:deleteUndo.annotationDeletedDetailed", {
          reference: s,
          detail: uo(i)
        });
      const a = De.find((d) => d.type === r.annotationType), l = a ? e(`annotator:tool.${a.name}`) : "", u = l && r.pageNumber ? e("annotator:deleteUndo.typeAndPage", { type: l, page: r.pageNumber }) : l || (r.pageNumber ? e("annotator:deleteUndo.page", { page: r.pageNumber }) : "");
      return u ? e("annotator:deleteUndo.annotationDeletedDetailed", { reference: s, detail: u }) : e("annotator:deleteUndo.annotationDeleted", { reference: s });
    }
    return i ? e("annotator:deleteUndo.commentDeletedDetailed", {
      reference: s,
      detail: uo(i)
    }) : r.author ? e("annotator:deleteUndo.commentDeletedByAuthor", { reference: s, author: r.author }) : e("annotator:deleteUndo.commentDeleted", { reference: s });
  }
  const o = wc(n.items, e, t);
  return n.annotationCount === n.totalCount ? o ? e("annotator:deleteUndo.annotationsDeletedDetailed", { count: n.totalCount, references: o }) : e("annotator:deleteUndo.annotationsDeleted", { count: n.totalCount }) : n.commentCount === n.totalCount ? o ? e("annotator:deleteUndo.commentsDeletedDetailed", { count: n.totalCount, references: o }) : e("annotator:deleteUndo.commentsDeleted", { count: n.totalCount }) : o ? e("annotator:deleteUndo.itemsDeletedDetailed", { count: n.totalCount, references: o }) : e("annotator:deleteUndo.itemsDeleted", { count: n.totalCount });
}
function xc(n, e) {
  const t = /* @__PURE__ */ new Map();
  e.forEach((s) => {
    if (s.annotationReferenceNumber === void 0) return;
    const i = t.get(s.annotationReferenceNumber) ?? {
      annotation: s.previewAnnotation,
      comments: []
    };
    s.previewComment && i.comments.push(s.previewComment), t.set(s.annotationReferenceNumber, i);
  });
  const o = [];
  let r = 0;
  for (const s of n.matchAll(yc)) {
    const i = s.index;
    i > r && o.push({ kind: "text", value: n.slice(r, i) });
    const a = t.get(Number(s[1]));
    a ? o.push({
      kind: "reference",
      value: s[0],
      annotation: a.annotation,
      comments: a.comments
    }) : o.push({ kind: "text", value: s[0] }), r = i + s[0].length;
  }
  return r < n.length && o.push({ kind: "text", value: n.slice(r) }), o;
}
function Tc() {
  const { painter: n } = ot(), { t: e, i18n: t } = ye(["common", "annotator"], { useSuspense: !1 }), o = B(null), r = B(!1), s = B(!1), i = B(/* @__PURE__ */ new Set()), a = X(
    (g) => n?.subscribeDeleteUndo(g) ?? (() => {
    }),
    [n]
  ), l = X(
    () => n?.getDeleteUndoSnapshot() ?? null,
    [n]
  ), u = vr(a, l, () => null);
  if (!u) return null;
  const d = Cc(u, e, t.resolvedLanguage ?? t.language), h = xc(d, u.items), p = (g, f) => {
    if (f) {
      i.current.add(g), n?.pauseDeleteUndo();
      return;
    }
    i.current.delete(g), !r.current && !s.current && i.current.size === 0 && n?.resumeDeleteUndo();
  };
  return /* @__PURE__ */ c("div", { className: Mt.overlay, children: /* @__PURE__ */ c(
    dt.Root,
    {
      ref: o,
      className: Mt.snackbar,
      size: "1",
      role: "status",
      "aria-live": "polite",
      onMouseEnter: () => {
        r.current = !0, n?.pauseDeleteUndo();
      },
      onMouseLeave: () => {
        r.current = !1, !s.current && i.current.size === 0 && n?.resumeDeleteUndo();
      },
      onFocusCapture: () => {
        s.current = !0, n?.pauseDeleteUndo();
      },
      onBlurCapture: (g) => {
        o.current?.contains(g.relatedTarget) || (s.current = !1, !r.current && i.current.size === 0 && n?.resumeDeleteUndo());
      },
      children: /* @__PURE__ */ T(Q, { className: Mt.content, align: "center", gap: "2", children: [
        /* @__PURE__ */ c(dt.Text, { className: Mt.message, children: h.map((g, f) => {
          if (g.kind === "text")
            return /* @__PURE__ */ c(Pt.Fragment, { children: g.value }, `text-${f}`);
          const S = `${g.annotation.id}-${f}`;
          return /* @__PURE__ */ c(
            ir,
            {
              annotation: g.annotation,
              previewComments: g.comments,
              onOpenChange: (m) => p(S, m),
              children: /* @__PURE__ */ c("button", { className: Mt.reference, type: "button", children: g.value })
            },
            S
          );
        }) }),
        /* @__PURE__ */ c(
          be,
          {
            size: "1",
            onClick: () => n?.undoDelete(),
            children: e(u.totalCount === 1 ? "common:restore" : "common:restoreAll")
          }
        )
      ] })
    }
  ) });
}
const ho = "inklayer-annotator", po = "annotator-sidebar-toggle", Ac = ({
  enableNativeAnnotations: n,
  annotations: e,
  annotationPermissions: t,
  positionedTextSource: o,
  defaultShowAnnotationAuthorLabels: r = !1,
  onLoad: s,
  onAnnotationAdd: i,
  onAnnotationDelete: a,
  onAnnotationSelected: l,
  onAnnotationChanged: u
}) => {
  const {
    isReady: d,
    pdfViewer: h,
    eventBus: p,
    isSidebarCollapsed: g,
    activeSidebarPanel: f,
    openSidebar: S,
    viewerContainerRef: m
  } = Fe(), { user: v } = Do(), { refreshPainter: b, setPainter: w } = ot(), { defaultOptions: x, primaryColor: E } = Nt(), I = le((K) => K.clearAnnotations), P = B({
    annotations: e ?? [],
    enableNativeAnnotations: n,
    onLoad: s,
    onAnnotationAdd: i,
    onAnnotationDelete: a,
    onAnnotationSelected: l,
    onAnnotationChanged: u
  });
  P.current = {
    annotations: e ?? [],
    enableNativeAnnotations: n,
    onLoad: s,
    onAnnotationAdd: i,
    onAnnotationDelete: a,
    onAnnotationSelected: l,
    onAnnotationChanged: u
  };
  const W = B(null), F = B(null), D = B(null), A = B(v), L = B(t), $ = B({ activeSidebarPanel: f, openSidebar: S }), j = B(r), _ = B(o);
  A.current = v, L.current = t, $.current = { activeSidebarPanel: f, openSidebar: S }, _.current = o;
  const O = B(
    $a(
      () => {
        F.current?.close(), W.current?.close();
        const K = document.querySelector(`#${$o}`);
        if (K?.parentNode)
          try {
            K.parentNode.removeChild(K);
          } catch {
          }
      },
      100,
      !0
    )
  ).current, Z = X(() => {
    O();
  }, [O]);
  return ne(() => {
    if (I(), !d || !h || !p || !A.current) return;
    let K = !1, k = !1, H = null;
    const oe = new Ga({
      primaryColor: E,
      defaultOptions: x,
      currentUser: A.current,
      annotationPermissions: L.current,
      defaultShowAnnotationAuthorLabels: j.current,
      PDFViewerApplication: h,
      positionedTextSource: _.current,
      onTextSelected: (te) => {
        W.current?.open(te);
      },
      onAnnotationAdd: (te) => {
        P.current.onAnnotationAdd(te);
      },
      onAnnotationDelete: (te) => {
        P.current.onAnnotationDelete(te);
      },
      onAnnotationSelected: (te, se, G) => {
        const J = $.current;
        se && te && J.activeSidebarPanel !== po && J.openSidebar?.(po), se && te && F.current?.open(te, G), P.current.onAnnotationSelected(te ?? null, se);
      },
      onAnnotationChanging: () => {
        F.current?.close();
      },
      onAnnotationChanged: (te, se) => {
        te && se && F.current?.open(te, se), te && P.current.onAnnotationChanged(te);
      }
    });
    D.current = oe, w(oe);
    const N = ({ source: te, cssTransform: se, pageNumber: G }) => {
      oe.initCanvas({
        pageView: te,
        cssTransform: se,
        pageNumber: G
      });
    };
    p.on("pagerendered", N), p._on("updateviewarea", Z), m.current && oe.initWebSelection(m.current);
    const q = async () => {
      if (!(K || k)) {
        k = !0;
        try {
          const { annotations: te, enableNativeAnnotations: se } = P.current;
          await oe.initAnnotationsOnce(te, se);
        } catch (te) {
          K || console.error("[Annotator] Failed to initialize annotations", te);
          return;
        }
        K || (H = setTimeout(() => {
          if (H = null, !K)
            for (let te = 0; te < h.pagesCount; te++) {
              const se = h.getPageView(te);
              if (se && se.div && se.canvas) {
                const G = oe.getKonvaCanvasStore();
                G && G.has(te + 1) && oe.reRenderAnnotations(te + 1);
              }
            }
        }, 0), P.current.onLoad?.());
      }
    };
    return h.pdfDocument ? q() : p.on("documentloaded", q), () => {
      K = !0, H && (clearTimeout(H), H = null), p.off("pagerendered", N), p.off("updateviewarea", Z), p.off("documentloaded", q), oe.destroy(), D.current === oe && (D.current = null), w(null);
    };
  }, [I, x, p, Z, d, h, E, w, m]), ne(() => {
    D.current?.setPositionedTextSource(o);
  }, [o]), Qe(() => {
    A.current && (F.current?.close(), D.current?.setPermissionContext(A.current, L.current), D.current && b());
  }, [t, b, v]), ne(() => {
    if (!p) return;
    const K = (H) => {
      const oe = /* @__PURE__ */ new Map();
      H.forEach((N) => {
        oe.set(N.pageNumber, (oe.get(N.pageNumber) ?? 0) + 1);
      }), p.dispatch(qt, {
        source: ho,
        markers: oe
      });
    };
    K(le.getState().annotations);
    const k = le.subscribe((H, oe) => {
      H.annotations !== oe.annotations && K(H.annotations);
    });
    return () => {
      k(), p.dispatch(qt, {
        source: ho,
        markers: /* @__PURE__ */ new Map()
      });
    };
  }, [p]), ne(() => {
    Z();
  }, [Z, g]), /* @__PURE__ */ T(ve, { children: [
    /* @__PURE__ */ c(za, { ref: W }),
    /* @__PURE__ */ c(Ka, { ref: F }),
    /* @__PURE__ */ c(Tc, {})
  ] });
}, kc = {
  common: {
    save: "保存",
    export: "导出",
    author: "作者",
    type: "类型",
    loading: "PDF 加载中...",
    error: "PDF加载失败",
    success: "操作成功",
    default: "默认",
    custom: "自定义",
    upload: "上传",
    ok: "确定",
    cancel: "取消",
    clear: "清空",
    selectAll: "全选",
    draw: "绘制",
    enter: "输入",
    back: "返回",
    confirm: "确认",
    reply: "回复",
    edit: "编辑",
    delete: "删除",
    restore: "恢复",
    restoreAll: "全部恢复",
    more: "更多",
    color: "颜色",
    strokeWidth: "笔触宽度",
    opacity: "透明度",
    transparent: "透明",
    fileSizeLimit: "文件大小超出 {{value}} 限制",
    comment: "评论",
    print: "打印",
    dateFormat: {
      full: "{{year}}-{{month}}-{{day}} {{hour}}:{{minute}}",
      dayMonth: "{{month}}-{{day}}",
      dayMonthYear: "{{year}}-{{month}}-{{day}}",
      compact: "{{month}}-{{day}} {{hour}}:{{minute}}",
      compactWithYear: "{{year}}-{{month}}-{{day}} {{hour}}:{{minute}}"
    }
  },
  viewer: {
    zoom: {
      auto: "自动",
      actual: "实际大小",
      fit: "适合页面",
      width: "适合宽度",
      zoomIn: "放大",
      zoomOut: "缩小"
    },
    sidebar: {
      toggle: "切换侧边栏"
    },
    navigation: {
      toggle: "切换文档导航",
      label: "文档导航",
      thumbnails: "缩略图",
      outline: "目录",
      page: "第 {{value}} 页",
      pageWithMarkers: "第 {{value}} 页，{{count}} 个批注",
      pageInput: "页码",
      previousPage: "上一页",
      nextPage: "下一页",
      thumbnailError: "此页面无法生成缩略图",
      outlineLoading: "正在加载目录…",
      outlineEmpty: "此文档没有目录",
      outlineError: "无法加载文档目录",
      untitledOutlineItem: "未命名章节",
      expandOutlineItem: "展开{{title}}",
      collapseOutlineItem: "收起{{title}}"
    },
    search: {
      search: "搜索",
      placeholder: "搜索文档...",
      searching: "搜索中...",
      page: "第 {{value}} 页",
      resultTotal: "共找到{{total}}条结果",
      caseSensitive: "区分大小写",
      entireWord: "完整单词"
    }
  },
  annotator: {
    tool: {
      select: "选择",
      highlight: "高亮",
      strikeout: "删除线",
      underline: "下划线",
      rectangle: "矩形",
      circle: "圆形",
      freehand: "自由绘制",
      freeHighlight: "自由高亮",
      freeText: "文字",
      signature: "签名",
      stamp: "盖章",
      note: "注解",
      arrow: "箭头",
      cloud: "云线"
    },
    sidebar: {
      toggle: "查看所有批注"
    },
    authorLabels: {
      show: "显示所有批注作者 · 按住 {{shortcut}} 临时查看",
      hide: "隐藏批注作者"
    },
    deleteUndo: {
      annotationDeleted: "已删除{{reference}}",
      annotationDeletedDetailed: "已删除{{reference}} · {{detail}}",
      commentDeleted: "已删除{{reference}} 的评论",
      commentDeletedDetailed: "已删除{{reference}} 的评论 · {{detail}}",
      commentDeletedByAuthor: "已删除{{reference}} 中 {{author}} 的评论",
      annotationsDeleted: "已删除 {{count}} 个批注",
      annotationsDeletedDetailed: "已删除 {{count}} 个批注 · {{references}}",
      commentsDeleted: "已删除 {{count}} 条评论",
      commentsDeletedDetailed: "已删除 {{count}} 条评论 · {{references}}",
      itemsDeleted: "已删除 {{count}} 项",
      itemsDeletedDetailed: "已删除 {{count}} 项 · {{references}}",
      typeAndPage: "{{type}}，第 {{page}} 页",
      page: "第 {{page}} 页",
      referencesMore: "{{references}} 等",
      deletedCommentPreview: "已删除的评论",
      deletedCommentsMore: "另有 {{count}} 条"
    },
    common: {
      createStamp: "创建印章",
      createSignature: "创建签名",
      loadError: "批注加载失败",
      errorCode: "错误代码",
      unknownError: "未知错误",
      loading: "批注加载中...",
      loadingHint: "批注加载时间较长，请稍候..."
    },
    editor: {
      text: {
        startTyping: "输入文字，回车确认..."
      },
      stamp: {
        stampText: "印章内容",
        fontStyle: "字体样式",
        fontFamily: "字体",
        textColor: "文字颜色",
        backgroundColor: "背景颜色",
        borderColor: "边框颜色",
        borderStyle: "边框样式",
        timestampText: "时间戳",
        customTimestamp: "自定义",
        username: "用户名",
        date: "日期",
        time: "时间",
        dateFormat: "日期格式",
        solid: "实线",
        dashed: "虚线",
        none: "无",
        defaultText: "草稿",
        defaultStampNotSet: "未设置默认签章",
        upload: "选择图像"
      },
      signature: {
        area: "签名处",
        upload: "图像",
        choose: "选择图像",
        uploadHint: "支持{{format}}格式, 最大 {{maxSize}}"
      }
    },
    comment: {
      total: " {{value}} 条批注",
      page: "第{{value}}页",
      status: {
        accepted: "接受",
        rejected: "拒绝",
        cancelled: "取消",
        completed: "完成",
        none: "无",
        closed: "关闭"
      },
      statusText: "将状态设置为 “{{value}}”",
      nativeAnnotation: "原生批注",
      reference: {
        commentPlaceholder: "发表评论或用“#”引用批注",
        empty: "没有匹配的批注",
        inputLabel: "支持引用批注的评论输入框",
        noContent: "暂无评论内容",
        open: "跳转到批注 {{value}}",
        previewNoContent: "暂无批注内容",
        previewPage: "第{{value}}页",
        replyCount: "{{count}} 条回复",
        replyCount_other: "{{count}} 条回复",
        replyPlaceholder: "回复或用“#”引用批注",
        unavailable: "批注 {{value}} 不可用"
      }
    },
    export: {
      fields: {
        id: "ID",
        page: "页码",
        author: "用户",
        date: "日期",
        content: "内容",
        status: "状态",
        annotationType: "批注类型",
        recordType: "类型"
      },
      recordType: {
        annotation: "批注",
        reply: "回复"
      }
    }
  }
}, Ec = {
  common: {
    save: "Save",
    export: "Export",
    author: "Author",
    type: "Type",
    loading: "PDF Loading...",
    error: "Load failed",
    success: "Successfully",
    default: "Default",
    custom: "Custom",
    upload: "Upload",
    ok: "OK",
    cancel: "Cancel",
    clear: "Clear",
    selectAll: "Select All",
    draw: "Draw",
    enter: "Enter",
    back: "Back",
    confirm: "Confirm",
    reply: "Reply",
    edit: "Edit",
    delete: "Delete",
    restore: "Restore",
    restoreAll: "Restore all",
    more: "More",
    color: "Color",
    strokeWidth: "Stroke",
    opacity: "Opacity",
    transparent: "Transparent",
    comment: "Comment",
    fileSizeLimit: "The file size exceeds the {{value}} limit",
    print: "Print",
    dateFormat: {
      full: "{{month}}/{{day}}/{{year}} {{hour}}:{{minute}}",
      dayMonth: "{{month}}/{{day}}",
      dayMonthYear: "{{month}}/{{day}}/{{year}}",
      compact: "{{month}}/{{day}} {{hour}}:{{minute}}",
      compactWithYear: "{{month}}/{{day}}/{{year}} {{hour}}:{{minute}}"
    }
  },
  viewer: {
    zoom: {
      auto: "auto",
      actual: "actual",
      fit: "page-fit",
      width: "page-width",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out"
    },
    sidebar: {
      toggle: "Toggle Sidebar"
    },
    navigation: {
      toggle: "Toggle document navigation",
      label: "Document navigation",
      thumbnails: "Thumbnails",
      outline: "Outline",
      page: "Page {{value}}",
      pageWithMarkers: "Page {{value}}, {{count}} annotations",
      pageInput: "Page number",
      previousPage: "Previous page",
      nextPage: "Next page",
      thumbnailError: "Unable to render this page",
      outlineLoading: "Loading outline…",
      outlineEmpty: "This document has no outline",
      outlineError: "Unable to load the document outline",
      untitledOutlineItem: "Untitled section",
      expandOutlineItem: "Expand {{title}}",
      collapseOutlineItem: "Collapse {{title}}"
    },
    search: {
      search: "Search",
      placeholder: "Search the docs…",
      searching: "Searching...",
      page: "Page {{value}}",
      resultTotal: "{{total}} results found",
      caseSensitive: "Case Sensitive",
      entireWord: "Entire Word"
    }
  },
  annotator: {
    tool: {
      select: "Select",
      highlight: "Highlight",
      strikeout: "Strikeout",
      underline: "Underline",
      rectangle: "Rectangle",
      circle: "Circle",
      freehand: "Free Hand",
      freeHighlight: "Free Highlight",
      freeText: "Text",
      signature: "Signature",
      stamp: "Stamp",
      note: "Note",
      arrow: "Arrow",
      cloud: "Cloud"
    },
    sidebar: {
      toggle: "Show Annotations"
    },
    authorLabels: {
      show: "Show annotation authors · Hold {{shortcut}} to peek",
      hide: "Hide annotation authors"
    },
    deleteUndo: {
      annotationDeleted: "Deleted{{reference}}",
      annotationDeletedDetailed: "Deleted{{reference}} · {{detail}}",
      commentDeleted: "Deleted comment in{{reference}}",
      commentDeletedDetailed: "Deleted comment in{{reference}} · {{detail}}",
      commentDeletedByAuthor: "Deleted {{author}}’s comment in{{reference}}",
      annotationsDeleted: "{{count}} annotations deleted",
      annotationsDeletedDetailed: "{{count}} annotations deleted · {{references}}",
      commentsDeleted: "{{count}} comments deleted",
      commentsDeletedDetailed: "{{count}} comments deleted · {{references}}",
      itemsDeleted: "{{count}} items deleted",
      itemsDeletedDetailed: "{{count}} items deleted · {{references}}",
      typeAndPage: "{{type}}, page {{page}}",
      page: "Page {{page}}",
      referencesMore: "{{references}}, and more",
      deletedCommentPreview: "Deleted comment",
      deletedCommentsMore: "{{count}} more"
    },
    common: {
      createStamp: "Create Stamp",
      createSignature: "Create signature",
      loadError: "Annotation load failed",
      errorCode: "Error code",
      unknownError: "Unknown error",
      loading: "Annotation loading...",
      loadingHint: "Annotation loading time is long, please wait..."
    },
    editor: {
      text: {
        startTyping: "Start typing…"
      },
      stamp: {
        stampText: "Stamp Text",
        fontStyle: "Font Style",
        fontFamily: "Font Family",
        textColor: "Text Color",
        backgroundColor: "Background Color",
        borderColor: "Border Color",
        borderStyle: "Border Style",
        timestampText: "Timestamp Text",
        customTimestamp: "Custom Text",
        username: "Username",
        date: "Date",
        time: "Time",
        dateFormat: "Date Format",
        solid: "Solid",
        dashed: "Dashed",
        none: "None",
        defaultText: "Draft",
        defaultStampNotSet: "Default Stamp Not Set",
        upload: "Choose Image"
      },
      signature: {
        area: "Signature",
        upload: "Image",
        choose: "Choose Image",
        uploadHint: "{{format}}, maxSize {{maxSize}}"
      }
    },
    comment: {
      total: "Comment {{value}}",
      page: "Page {{value}}",
      status: {
        accepted: "Accepted",
        rejected: "Rejected",
        cancelled: "Cancelled",
        completed: "Completed",
        none: "None",
        closed: "Closed"
      },
      statusText: "Set Status: {{value}}",
      nativeAnnotation: "Native Annotation",
      reference: {
        commentPlaceholder: "Comment or use “#” to reference an annotation",
        empty: "No matching annotations",
        inputLabel: "Comment with annotation references",
        noContent: "No comment content",
        open: "Go to annotation {{value}}",
        previewNoContent: "No annotation content",
        previewPage: "Page {{value}}",
        replyCount: "{{count}} replies",
        replyCount_one: "{{count}} reply",
        replyCount_other: "{{count}} replies",
        replyPlaceholder: "Reply or use “#” to reference an annotation",
        unavailable: "Annotation {{value}} is unavailable"
      }
    },
    export: {
      fields: {
        id: "ID",
        page: "Page",
        author: "Author",
        date: "Date",
        content: "Content",
        status: "Status",
        annotationType: "Annotation Type",
        recordType: "Type"
      },
      recordType: {
        annotation: "Annotation",
        reply: "Reply"
      }
    }
  }
}, Rc = ["common", "viewer", "annotator"];
Te.use(Lr).init({
  resources: {
    "zh-CN": kc,
    "en-US": Ec
  },
  lng: "zh-CN",
  fallbackLng: "en-US",
  ns: Rc,
  defaultNS: "common",
  interpolation: { escapeValue: !1 }
});
const xt = on(({
  icon: n,
  selected: e,
  onClick: t,
  disabled: o = !1,
  title: r,
  label: s,
  tooltip: i = "auto",
  tooltipSide: a = "bottom",
  className: l,
  onPointerEnter: u,
  onPointerLeave: d,
  onFocus: h,
  onBlur: p,
  buttonProps: g = {}
}, f) => {
  const [S, m] = Y(!1);
  ne(() => {
    if (!r || i === "none" || typeof window > "u") return;
    const w = () => m(!1);
    return window.addEventListener("inklayer:close-toolbar-tooltips", w), window.addEventListener("scroll", w, !0), () => {
      window.removeEventListener("inklayer:close-toolbar-tooltips", w), window.removeEventListener("scroll", w, !0);
    };
  }, [r, i]), ne(() => {
    e === void 0 || typeof window > "u" || window.dispatchEvent(new Event("inklayer:close-toolbar-tooltips"));
  }, [e]);
  const b = /* @__PURE__ */ T(
    tt,
    {
      ref: f,
      className: l,
      color: e ? void 0 : "gray",
      variant: e ? "soft" : "outline",
      style: {
        opacity: o ? 0.5 : 1,
        boxShadow: "none"
      },
      onClick: t,
      disabled: o,
      "aria-label": r,
      "aria-pressed": e === void 0 ? void 0 : e,
      "data-inklayer-toolbar-button": "true",
      "data-selected": e ? "true" : "false",
      ...g,
      onPointerEnter: u,
      onPointerLeave: d,
      onFocus: h,
      onBlur: p,
      onPointerDown: () => {
        m(!1), typeof window < "u" && window.dispatchEvent(new Event("inklayer:close-toolbar-tooltips"));
      },
      children: [
        n,
        s
      ]
    }
  );
  return r && i !== "none" ? /* @__PURE__ */ c(Rt, { content: r, side: a, open: S, onOpenChange: m, children: b }) : b;
}), St = {
  MIN_SCALE: 0.1,
  MAX_SCALE: 4,
  ZOOM_STEP: 0.1,
  ZOOM_OPTIONS: [
    { key: "auto", labelKey: "viewer:zoom.auto", value: "auto" },
    { key: "page-actual", labelKey: "viewer:zoom.actual", value: "page-actual" },
    { key: "page-fit", labelKey: "viewer:zoom.fit", value: "page-fit" },
    { key: "page-width", labelKey: "viewer:zoom.width", value: "page-width" },
    { key: "0.5", label: "50%", value: "0.5" },
    { key: "0.75", label: "75%", value: "0.75" },
    { key: "1", label: "100%", value: "1" },
    { key: "1.25", label: "125%", value: "1.25" },
    { key: "1.5", label: "150%", value: "1.5" },
    { key: "2", label: "200%", value: "2" },
    { key: "3", label: "300%", value: "3" },
    { key: "4", label: "400%", value: "4" }
  ]
}, Qt = () => {
  const { t: n } = ye("viewer", { useSuspense: !1 }), { pdfViewer: e, eventBus: t } = Fe(), [o, r] = Y("auto");
  ne(() => {
    if (!t || !e) return;
    const p = () => {
      const g = e.currentScaleValue;
      r(g || "auto");
    };
    return t.on("scalechanging", p), t.on("pagesloaded", p), () => {
      t.off("scalechanging", p), t.off("pagesloaded", p);
    };
  }, [t, e]);
  const s = (p) => {
    if (["auto", "page-actual", "page-fit", "page-width"].includes(p))
      return null;
    const g = parseFloat(p);
    return isNaN(g) ? null : g;
  }, i = (p) => {
    r(p), e && (e.currentScaleValue = p);
  }, a = () => {
    let p = s(o);
    p === null && (p = e ? e.currentScale : 1);
    const g = Math.min(p + St.ZOOM_STEP, St.MAX_SCALE), f = Math.round(g * 100) / 100;
    i(f.toString());
  }, l = () => {
    let p = s(o);
    p === null && (p = e ? e.currentScale : 1);
    const g = Math.max(p - St.ZOOM_STEP, St.MIN_SCALE), f = Math.round(g * 100) / 100;
    i(f.toString());
  }, u = () => (s(o) ?? (e?.currentScale || 1)) >= St.MAX_SCALE, d = () => (s(o) ?? (e?.currentScale || 1)) <= St.MIN_SCALE, h = (() => {
    const p = St.ZOOM_OPTIONS.find((f) => f.value === o);
    if (p)
      return "labelKey" in p && p.labelKey ? n(p.labelKey) : "label" in p ? p.label : o;
    const g = parseFloat(o);
    return isNaN(g) ? n("viewer:zoom.auto") : `${Math.round(g * 100)}%`;
  })();
  return /* @__PURE__ */ T(Q, { gap: "2", align: "center", children: [
    /* @__PURE__ */ c(
      xt,
      {
        title: "缩小",
        tooltipSide: "top",
        buttonProps: {
          size: "1",
          disabled: d()
        },
        icon: /* @__PURE__ */ c(Hr, {}),
        onClick: l
      }
    ),
    /* @__PURE__ */ T(me.Root, { onOpenChange: (p) => {
      p && window.dispatchEvent(new Event("inklayer:close-toolbar-tooltips"));
    }, children: [
      /* @__PURE__ */ c(me.Trigger, { children: /* @__PURE__ */ T(be, { "aria-label": "选择缩放比例", variant: "ghost", size: "2", color: "gray", style: { width: 80 }, children: [
        h,
        /* @__PURE__ */ c(me.TriggerIcon, {})
      ] }) }),
      /* @__PURE__ */ c(me.Content, { children: St.ZOOM_OPTIONS.map((p) => /* @__PURE__ */ c(
        me.Item,
        {
          onSelect: () => i(p.value),
          children: "labelKey" in p ? n(p.labelKey) : p.label
        },
        p.key
      )) })
    ] }),
    /* @__PURE__ */ c(
      xt,
      {
        title: "放大",
        tooltipSide: "top",
        buttonProps: {
          size: "1",
          disabled: u()
        },
        icon: /* @__PURE__ */ c(Gr, {}),
        onClick: a
      }
    )
  ] });
}, Pc = "_SignatureTool_mpyjt_1", Nc = "_container_mpyjt_1", Ic = "_info_mpyjt_23", Mc = "_imagePreview_mpyjt_34", Dc = "_toolbar_mpyjt_48", Lc = "_colorPalette_mpyjt_53", _c = "_cell_mpyjt_58", Oc = "_active_mpyjt_75", Hc = "_toolbarDark_mpyjt_84", Gc = "_SignaturePop_mpyjt_94", Ze = {
  SignatureTool: Pc,
  container: Nc,
  info: Ic,
  imagePreview: Mc,
  toolbar: Dc,
  colorPalette: Lc,
  cell: _c,
  active: Oc,
  toolbarDark: Hc,
  SignaturePop: Gc
}, en = /* @__PURE__ */ new Set();
function Uc(n) {
  if (!n.external || !n.url || en.has(n.value)) return;
  const e = document.createElement("style");
  e.innerHTML = `
    @font-face {
        font-family: '${n.value}';
        src: url('${n.url}') format('truetype');
        font-weight: normal;
        font-style: normal;
    }
    `, document.head.appendChild(e), en.add(n.value);
}
async function zc(n) {
  if (!(!n.external || !n.url || en.has(n.value)))
    try {
      const e = new FontFace(n.value, `url(${n.url})`);
      await e.load(), document.fonts.add(e), en.add(n.value);
    } catch {
      Uc(n);
    }
}
const Bt = 80, Fc = ({ annotation: n, disabled: e = !1, onAdd: t, default_signatures: o, presentation: r = "toolbar-icon", label: s, selected: i, onIntent: a }) => {
  const { defaultOptions: l } = Nt(), u = l.signature.colors, d = 420, h = 200, p = l.signature.type, g = l.signature.maxSize, f = l.signature.accept, S = 600, m = l.signature.defaultFont, { t: v } = ye(["common", "annotator"], { useSuspense: !1 }), b = B(null), w = B(null), x = B(u[0]), E = B(null), [I, P] = Y(!1), [W, F] = Y(x.current), [D, A] = Y(!0), [L, $] = Y([]), [j, _] = Y(null), [O, Z] = Y(""), [K, k] = Y(m[0]?.value || "Arial"), [H, oe] = Y(null), [N, q] = Y(!1), { appearance: te } = rn(), se = o ?? l.signature.defaultSignature, G = g;
  ne(() => {
    x.current = W;
  }, [W]);
  const J = (y) => {
    t(y);
  }, ce = async (y) => {
    const C = m.find((U) => U.value === y);
    C && C.external && await zc(C), k(y);
  }, fe = B({ fontFamily: K, signatureTypeDefault: p, loadFont: ce });
  fe.current = { fontFamily: K, signatureTypeDefault: p, loadFont: ce };
  const xe = () => {
    if (!O.trim()) return null;
    const y = document.createElement("canvas");
    y.width = d / 1.1, y.height = h;
    const C = y.getContext("2d");
    if (!C) return null;
    const U = 20;
    C.clearRect(0, 0, y.width, y.height), C.font = `${Bt}px "${K}", cursive, sans-serif`;
    const V = C.measureText(O).width, ue = V + U * 2 > y.width ? (y.width - U * 2) / V : 1;
    return C.font = `${Bt * ue}px "${K}", cursive, sans-serif`, C.textAlign = "center", C.textBaseline = "middle", C.imageSmoothingEnabled = !0, C.shadowColor = "rgba(0, 0, 0, 0.1)", C.shadowBlur = 2, C.shadowOffsetX = 1, C.shadowOffsetY = 1, C.fillStyle = W, C.fillText(O, y.width / 2, y.height / 2), y.toDataURL("image/png");
  }, Je = () => {
    if (j === "Upload") {
      H && ($((y) => [...y, H]), J(H), P(!1));
      return;
    }
    if (j === "Enter") {
      const y = xe();
      y && ($((C) => [...C, y]), J(y), P(!1));
      return;
    }
    if (j === "Draw") {
      const y = w.current?.toDataURL();
      y && ($((C) => [...C, y]), J(y), P(!1));
      return;
    }
  }, Ve = () => {
    const y = w.current;
    y && (y.clear(), y.getLayers().forEach((C) => C.destroyChildren()), A(!0)), Z(""), oe(null);
  }, He = () => {
    if (!b.current) return;
    const y = new M.Stage({
      container: b.current,
      width: d,
      height: h
    }), C = new M.Layer();
    y.add(C), w.current = y;
    let U = !1, V = null;
    const ue = () => {
      U = !0;
      const we = y.getPointerPosition();
      we && (V = new M.Line({
        stroke: x.current,
        strokeWidth: 3,
        globalCompositeOperation: "source-over",
        lineCap: "round",
        lineJoin: "round",
        points: [we.x, we.y]
      }), C.add(V));
    }, he = (we) => {
      if (!U || !V) return;
      we.evt.preventDefault();
      const Be = y.getPointerPosition();
      if (!Be) return;
      const ht = V.points().concat([Be.x, Be.y]);
      V.points(ht), A(!1);
    }, pe = () => {
      U = !1, V = null;
    };
    y.on("mousedown touchstart", ue), y.on("mouseup touchend", pe), y.on("mousemove touchmove", he);
  }, je = (y) => {
    F(y), (w.current?.getLayers()[0].getChildren((U) => U.getClassName() === "Line") || []).forEach((U) => U.stroke(y));
  }, $e = (y) => {
    const C = y.target, U = C.files;
    if (!U?.length) return;
    const V = U[0];
    if (V.size > G) {
      q(!0), setTimeout(() => q(!1), 3e3), C && (C.value = "");
      return;
    }
    const ue = new FileReader();
    ue.onload = async (he) => {
      const pe = he.target?.result, we = new Image();
      we.src = pe, we.onload = () => {
        const Be = S, ht = S;
        let { width: Ye, height: Oe } = we;
        Ye > Oe && Ye > Be ? (Oe = Math.round(Oe * Be / Ye), Ye = Be) : Oe > ht && (Ye = Math.round(Ye * ht / Oe), Oe = ht);
        const Ge = document.createElement("canvas"), vt = Ge.getContext("2d");
        if (Ge.width = Ye, Ge.height = Oe, vt) {
          vt.drawImage(we, 0, 0, Ye, Oe);
          const wt = Ge.toDataURL("image/png");
          C.value = "", oe(wt), A(!1);
        }
      };
    }, ue.readAsDataURL(V);
  };
  return ne(() => {
    Z(""), oe(null), (j === "Enter" || j === "Draw" || j === "Upload") && A(!0);
  }, [j]), ne(() => {
    A(O.trim().length === 0);
  }, [O]), ne(() => {
    if (I) {
      const y = fe.current;
      y.loadFont(y.fontFamily), Z(""), oe(null), _(y.signatureTypeDefault);
    }
  }, [I]), ne(() => {
    I && j === "Draw" ? setTimeout(() => {
      He();
    }, 300) : (w.current?.destroy(), w.current = null);
  }, [j, I]), /* @__PURE__ */ T(ve, { children: [
    /* @__PURE__ */ T(Ae.Root, { children: [
      /* @__PURE__ */ c(Ae.Trigger, { children: /* @__PURE__ */ c(
        xt,
        {
          disabled: e,
          selected: i,
          tooltip: r === "menu-item" ? "none" : "auto",
          title: v(`annotator:tool.${n.name}`),
          label: r === "menu-item" ? s : void 0,
          buttonProps: r === "menu-item" ? { variant: "ghost", size: "2", style: { width: "100%", justifyContent: "flex-start", gap: 8 } } : void 0,
          icon: n.icon,
          onClick: a
        }
      ) }),
      /* @__PURE__ */ c(Ae.Content, { size: "1", style: { width: 180 }, onCloseAutoFocus: (y) => y.preventDefault(), children: /* @__PURE__ */ T("div", { className: Ze.SignaturePop, children: [
        /* @__PURE__ */ T("ul", { className: Ze.container, children: [
          se.map((y, C) => /* @__PURE__ */ c(Ae.Close, { children: /* @__PURE__ */ c("li", { onClick: () => J(y), children: /* @__PURE__ */ c("img", { src: y }) }, C) }, C)),
          L.map((y, C) => /* @__PURE__ */ c(Ae.Close, { children: /* @__PURE__ */ c("li", { onClick: () => J(y), children: /* @__PURE__ */ c("img", { src: y }) }, C) }, C))
        ] }),
        /* @__PURE__ */ c(Ae.Close, { children: /* @__PURE__ */ T(be, { style: { width: "100%" }, variant: "soft", onClick: () => {
          P(!0);
        }, children: [
          /* @__PURE__ */ c(Ao, {}),
          " ",
          v("annotator:common.createSignature")
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ c(ct.Root, { open: I, onOpenChange: P, children: /* @__PURE__ */ T(ct.Content, { style: { width: "550px" }, children: [
      /* @__PURE__ */ c(ct.Title, { children: v("annotator:common.createSignature") }),
      /* @__PURE__ */ c(Q, { as: "span", justify: "center", mb: "4", children: /* @__PURE__ */ T(gt.Root, { size: "3", defaultValue: p, onValueChange: (y) => _(y), radius: "full", children: [
        /* @__PURE__ */ c(gt.Item, { value: "Enter", children: v("enter") }),
        /* @__PURE__ */ c(gt.Item, { value: "Draw", children: v("draw") }),
        /* @__PURE__ */ c(gt.Item, { value: "Upload", children: v("annotator:editor.signature.upload") })
      ] }) }),
      /* @__PURE__ */ T("div", { className: Ze.SignatureTool, children: [
        /* @__PURE__ */ T("div", { className: Ze.container, style: { width: d }, children: [
          j === "Enter" && /* @__PURE__ */ c(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: O,
              onChange: (y) => Z(y.target.value),
              placeholder: v("annotator:editor.signature.area"),
              style: {
                height: h - 2,
                width: d / 1.1,
                color: W,
                fontFamily: `${K}`,
                fontSize: Bt,
                lineHeight: `${Bt}px`
              }
            }
          ),
          j === "Draw" && /* @__PURE__ */ T(ve, { children: [
            /* @__PURE__ */ c("div", { className: Ze.info, children: v("annotator:editor.signature.area") }),
            /* @__PURE__ */ c(
              "div",
              {
                ref: b,
                style: {
                  height: h,
                  width: d
                }
              }
            )
          ] }),
          j === "Upload" && /* @__PURE__ */ c("div", { style: {
            height: h,
            width: d
          }, children: H ? /* @__PURE__ */ c("div", { className: Ze.imagePreview, style: {
            height: h,
            width: d
          }, children: /* @__PURE__ */ c("img", { src: H, alt: "preview" }) }) : /* @__PURE__ */ T("div", { style: {
            height: h,
            width: d
          }, children: [
            /* @__PURE__ */ c("input", { style: { display: "none" }, type: "file", ref: E, accept: f, onChange: $e }),
            /* @__PURE__ */ T(Q, { height: `${h}px`, direction: "column", gap: "3", justify: "center", align: "center", children: [
              /* @__PURE__ */ T(be, { size: "3", onClick: () => {
                E.current?.click();
              }, children: [
                /* @__PURE__ */ c(ko, {}),
                " ",
                v("annotator:editor.signature.choose")
              ] }),
              /* @__PURE__ */ c(de, { color: "gray", size: "2", style: { textAlign: "center" }, children: v("annotator:editor.signature.uploadHint", { format: f, maxSize: Tn(g) }) }),
              N && /* @__PURE__ */ c(dt.Root, { color: "red", mt: "3", children: /* @__PURE__ */ c(dt.Text, { children: v("fileSizeLimit", { value: Tn(G) }) }) })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ c("div", { className: `${Ze.toolbar} ${te === "dark" ? Ze.toolbarDark : ""}`, style: { width: d }, children: /* @__PURE__ */ T(Q, { justify: "between", align: "center", gap: "2", children: [
          /* @__PURE__ */ T("div", { className: Ze.colorPalette, children: [
            j !== "Upload" && /* @__PURE__ */ c(ve, { children: u.map((y) => /* @__PURE__ */ c("div", { onClick: () => je(y), className: `${Ze.cell} ${y === W ? Ze.active : ""}`, children: /* @__PURE__ */ c("span", { style: { backgroundColor: y } }) }, y)) }),
            j === "Enter" && /* @__PURE__ */ c(ve, { children: /* @__PURE__ */ T(Re.Root, { onValueChange: async (y) => {
              await ce(y);
            }, defaultValue: K, size: "1", children: [
              /* @__PURE__ */ c(Re.Trigger, {}),
              /* @__PURE__ */ c(Re.Content, { children: m.map((y) => /* @__PURE__ */ c(Re.Item, { value: y.value, children: y.label }, y.value)) })
            ] }) })
          ] }),
          /* @__PURE__ */ c(be, { variant: "ghost", mr: "3", onClick: Ve, children: v("clear") })
        ] }) }),
        /* @__PURE__ */ T(Q, { gap: "3", mt: "4", justify: "end", children: [
          /* @__PURE__ */ c(ct.Close, { children: /* @__PURE__ */ c(be, { style: { width: 100 }, variant: "soft", color: "gray", children: v("cancel") }) }),
          /* @__PURE__ */ c(ct.Close, { children: /* @__PURE__ */ c(be, { disabled: D, style: { width: 100 }, onClick: Je, children: v("ok") }) })
        ] })
      ] })
    ] }) })
  ] });
}, jc = "_StampPop_1pr7b_1", Bc = "_container_1pr7b_4", Wc = "_StampTool_1pr7b_38", Vc = "_imagePreview_1pr7b_45", $c = "_imagePreviewDark_1pr7b_54", Yc = "_formItem_1pr7b_58", Ue = {
  StampPop: jc,
  container: Bc,
  StampTool: Wc,
  imagePreview: Vc,
  imagePreviewDark: $c,
  formItem: Yc
};
No.extend(li);
const fo = "StampGroup", Wt = 470, Dt = 120, Kc = [
  {
    label: "📅",
    options: [
      { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
      { label: "YYYY/MM/DD", value: "YYYY/MM/DD" },
      { label: "YYYY年MM月DD日", value: "YYYY年MM月DD日" },
      { label: "DD-MM-YYYY", value: "DD-MM-YYYY" },
      { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
      { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
      { label: "dddd, MMMM D, YYYY", value: "dddd, MMMM D, YYYY" },
      // 星期几 + 全月份
      { label: "MMM D, YYYY", value: "MMM D, YYYY" },
      // Jan 1, 2025
      { label: "D MMMM YYYY", value: "D MMMM YYYY" }
      // 1 January 2025
    ]
  },
  {
    label: "⏰",
    options: [
      { label: "HH:mm:ss", value: "HH:mm:ss" },
      { label: "HH:mm", value: "HH:mm" },
      { label: "hh:mm A", value: "hh:mm A" },
      // 12小时制带AM/PM
      { label: "h:mm A", value: "h:mm A" },
      { label: "HH:mm:ss.SSS", value: "HH:mm:ss.SSS" }
    ]
  },
  {
    label: "🗓️ ",
    options: [
      { label: "YYYY-MM-DD HH:mm:ss", value: "YYYY-MM-DD HH:mm:ss" },
      { label: "YYYY-MM-DD HH:mm", value: "YYYY-MM-DD HH:mm" },
      { label: "DD/MM/YYYY HH:mm", value: "DD/MM/YYYY HH:mm" },
      { label: "MM/DD/YYYY hh:mm A", value: "MM/DD/YYYY hh:mm A" },
      { label: "YYYY年MM月DD日 HH:mm", value: "YYYY年MM月DD日 HH:mm" },
      { label: "dddd, MMMM D, YYYY HH:mm", value: "dddd, MMMM D, YYYY HH:mm" },
      { label: "D MMMM YYYY HH:mm", value: "D MMMM YYYY HH:mm" }
    ]
  }
], Xc = ({ annotation: n, disabled: e = !1, default_stamps: t, onAdd: o, presentation: r = "toolbar-icon", label: s, selected: i, onIntent: a }) => {
  const { defaultOptions: l } = Nt(), u = l.stamp.maxSize, d = l.stamp.accept, h = 600, p = l.stamp.editor.defaultFont, g = l.stamp.editor.defaultTextColor, f = l.stamp.editor.defaultBorderStyle, S = l.stamp.editor.defaultBackgroundColor, m = l.stamp.editor.defaultBorderColor, v = l.colors, { t: b } = ye(["common", "annotator"]), w = B(null), x = B(null), E = B(null), { user: I } = Do(), [P, W] = Y([]), { appearance: F } = rn(), D = t ?? l.stamp.defaultStamp, [A, L] = Y(!1), [$, j] = Y(D.length === 0 ? "custom" : "default"), [_, O] = Y({
    stampText: b("annotator:editor.stamp.defaultText"),
    fontStyle: [],
    fontFamily: p[0].value,
    textColor: g,
    backgroundColor: S,
    borderColor: m,
    borderStyle: f,
    timestamp: ["username", "date"],
    customTimestampText: "",
    dateFormat: "YYYY-MM-DD"
  });
  Qe(() => {
    O((G) => ({
      ...G,
      stampText: b("annotator:editor.stamp.defaultText")
    }));
  }, [b]);
  const [Z, K] = Y(null), k = (G) => {
    o(G);
  }, H = () => {
    const G = x.current?.getLayers()[0];
    if (!G) return;
    const J = G.getChildren((fe) => fe.name() === fo)[0];
    if (!J) return;
    const ce = x.current?.toDataURL({
      x: J.x(),
      y: J.y(),
      width: J.width(),
      height: J.height()
    });
    ce && (W((fe) => [...fe, ce]), k(ce), L(!1));
  }, oe = (G) => {
    const J = G.target, ce = J.files;
    if (!ce?.length) return;
    const fe = ce[0];
    if (fe.size > u) {
      alert(b("fileSizeLimit", { value: Tn(u) })), J && (J.value = "");
      return;
    }
    const xe = new FileReader();
    xe.onload = async (Je) => {
      const Ve = Je.target?.result, He = new Image();
      He.src = Ve, He.onload = () => {
        const je = h, $e = h;
        let { width: y, height: C } = He;
        y > C && y > je ? (C = Math.round(C * je / y), y = je) : C > $e && (y = Math.round(y * $e / C), C = $e);
        const U = document.createElement("canvas"), V = U.getContext("2d");
        if (U.width = y, U.height = C, V) {
          V.drawImage(He, 0, 0, y, C);
          const ue = U.toDataURL("image/png");
          J.value = "", W((he) => [...he, ue]);
        }
      };
    }, xe.readAsDataURL(fe);
  }, N = (G, J) => {
    const ce = {
      ..._,
      [G]: J
    };
    O(ce), K(ce), q(ce);
  }, q = (G) => {
    if (!w.current) return;
    const { stampText: J, fontStyle: ce, textColor: fe, backgroundColor: xe, borderColor: Je, borderStyle: Ve, timestamp: He, dateFormat: je, fontFamily: $e } = G;
    x.current?.destroy();
    const y = new M.Stage({
      container: w.current,
      width: Wt,
      height: Dt
    }), C = new M.Layer(), U = [];
    ce.includes("italic") && U.push("italic"), ce.includes("bold") && U.push("bold");
    const V = U.join(" ") || "normal", ue = ce.includes("underline"), he = ce.includes("strikeout"), pe = No(), we = I?.name, Be = je ? pe.format(je) : "", ht = G.customTimestampText?.trim(), Oe = [
      He.includes("username") ? we : null,
      He.includes("date") ? Be : null,
      ht || null
    ].filter(Boolean).join(" · ");
    let Ge = 30;
    const vt = 16, wt = 10, Ut = new M.Text({
      text: J,
      fontSize: Ge,
      fontStyle: V,
      fontFamily: $e
    }), an = new M.Text({
      text: Oe,
      fontSize: vt,
      fontFamily: $e
    }), cn = Math.max(Ut.width(), an.width()) + 60, Ce = Ge + wt + vt + 25, pt = Math.max(cn, 180), yt = Math.max(Ce, 60), rt = new M.Rect({
      name: fo,
      width: pt,
      height: yt,
      x: (Wt - pt) / 2,
      y: (Dt - yt) / 2,
      fill: xe,
      strokeWidth: Ve === "none" ? 0 : 5,
      stroke: Je,
      dash: Ve === "dashed" ? [5, 5] : void 0,
      cornerRadius: 10
    });
    C.add(rt), Oe || (Ge = Ge * 1.2);
    let it;
    Oe ? it = (Dt - yt) / 2 + 15 : it = (Dt - yt) / 2 + yt / 2 - Ge / 2;
    const ln = new M.Text({
      text: J,
      x: 0,
      y: it,
      width: Wt,
      align: "center",
      fontSize: Ge,
      fontStyle: V,
      fontFamily: $e,
      fill: fe
    });
    if (C.add(ln), ue) {
      const It = ln.y() + Ge + 4, dn = new M.Line({
        points: [rt.x(), It, rt.x() + rt.width(), It],
        stroke: fe,
        strokeWidth: 2
      });
      C.add(dn);
    }
    if (he) {
      const It = ln.y() + Ge / 2, dn = new M.Line({
        points: [rt.x(), It, rt.x() + rt.width(), It],
        stroke: fe,
        strokeWidth: 2
      });
      C.add(dn);
    }
    const mr = new M.Text({
      text: Oe,
      x: 0,
      y: it + Ge + wt,
      width: Wt,
      align: "center",
      fontSize: vt,
      fontFamily: $e,
      fill: fe
    });
    Oe && C.add(mr), y.add(C), x.current = y;
  }, te = B(_);
  te.current = Z ?? _;
  const se = B(q);
  return se.current = q, Qe(() => {
    if (A) {
      const J = requestAnimationFrame(() => {
        w.current && se.current(te.current);
      });
      return () => cancelAnimationFrame(J);
    }
    const G = x.current;
    G && (G.destroy(), x.current = null);
  }, [A]), /* @__PURE__ */ T(ve, { children: [
    /* @__PURE__ */ T(Ae.Root, { children: [
      /* @__PURE__ */ c(Ae.Trigger, { children: /* @__PURE__ */ c(
        xt,
        {
          disabled: e,
          selected: i,
          tooltip: r === "menu-item" ? "none" : "auto",
          title: b(`annotator:tool.${n.name}`),
          label: r === "menu-item" ? s : void 0,
          buttonProps: r === "menu-item" ? { variant: "ghost", size: "2", style: { width: "100%", justifyContent: "flex-start", gap: 8 } } : void 0,
          icon: n.icon,
          onClick: a
        }
      ) }),
      /* @__PURE__ */ c(
        Ae.Content,
        {
          size: "1",
          onCloseAutoFocus: (G) => {
            G.preventDefault(), j(D.length === 0 ? "custom" : "default");
          },
          children: /* @__PURE__ */ T("div", { className: Ue.StampPop, children: [
            /* @__PURE__ */ c(Q, { align: "center", justify: "center", mb: "4", children: /* @__PURE__ */ c(
              gt.Root,
              {
                radius: "full",
                defaultValue: D.length === 0 ? "custom" : "default",
                onValueChange: (G) => j(G),
                children: D.length === 0 ? /* @__PURE__ */ T(ve, { children: [
                  /* @__PURE__ */ c(gt.Item, { value: "custom", children: b("custom") }),
                  /* @__PURE__ */ c(gt.Item, { value: "default", children: b("default") })
                ] }) : /* @__PURE__ */ T(ve, { children: [
                  /* @__PURE__ */ c(gt.Item, { value: "default", children: b("default") }),
                  /* @__PURE__ */ c(gt.Item, { value: "custom", children: b("custom") })
                ] })
              }
            ) }),
            $ === "default" && /* @__PURE__ */ T(ve, { children: [
              D.length === 0 && /* @__PURE__ */ c(Q, { align: "center", justify: "center", gap: "2", children: /* @__PURE__ */ T(dt.Root, { variant: "soft", color: "gray", size: "1", style: { width: "100%" }, children: [
                /* @__PURE__ */ c(dt.Icon, { children: /* @__PURE__ */ c(Ur, {}) }),
                /* @__PURE__ */ c(dt.Text, { children: b("annotator:editor.stamp.defaultStampNotSet") })
              ] }) }),
              /* @__PURE__ */ c("ul", { className: Ue.container, children: D.map((G, J) => /* @__PURE__ */ c(Ae.Close, { children: /* @__PURE__ */ c("li", { onClick: () => k(G), children: /* @__PURE__ */ c("img", { src: G }) }, J) }, J)) })
            ] }),
            /* @__PURE__ */ c("div", { children: $ === "custom" && /* @__PURE__ */ T(ve, { children: [
              /* @__PURE__ */ c("ul", { className: Ue.container, children: P.map((G, J) => /* @__PURE__ */ c(Ae.Close, { children: /* @__PURE__ */ c("li", { onClick: () => k(G), children: /* @__PURE__ */ c("img", { src: G }) }, J) }, J)) }),
              /* @__PURE__ */ c(Q, { gap: "4", p: "1", children: /* @__PURE__ */ c(Ae.Close, { children: /* @__PURE__ */ T(
                be,
                {
                  variant: "soft",
                  style: { width: "100%" },
                  onClick: () => {
                    L(!0);
                  },
                  children: [
                    /* @__PURE__ */ c(Ao, {}),
                    " ",
                    b("annotator:common.createStamp")
                  ]
                }
              ) }) }),
              /* @__PURE__ */ c(nt, { my: "3", size: "4" }),
              /* @__PURE__ */ c("input", { style: { display: "none" }, type: "file", ref: E, accept: d, onChange: oe }),
              /* @__PURE__ */ c(Q, { gap: "2", justify: "end", children: /* @__PURE__ */ T(
                be,
                {
                  variant: "ghost",
                  mr: "3",
                  onClick: () => {
                    E.current?.click();
                  },
                  children: [
                    /* @__PURE__ */ c(ko, {}),
                    b("annotator:editor.stamp.upload")
                  ]
                }
              ) })
            ] }) })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ c(ct.Root, { open: A, onOpenChange: L, children: /* @__PURE__ */ T(ct.Content, { style: { width: "550px" }, children: [
      /* @__PURE__ */ c(ct.Title, { children: b("annotator:common.createStamp") }),
      /* @__PURE__ */ T("div", { className: Ue.StampTool, children: [
        /* @__PURE__ */ T("div", { className: Ue.container, children: [
          /* @__PURE__ */ c(
            "div",
            {
              className: `${Ue.imagePreview} ${F === "dark" ? Ue.imagePreviewDark : ""}`,
              ref: w,
              style: {
                height: Dt
              }
            }
          ),
          /* @__PURE__ */ T($t, { align: "center", columns: "22", gap: "5", mt: "3", children: [
            /* @__PURE__ */ c(Q, { direction: "column", gridColumn: "span 22", children: /* @__PURE__ */ T(de, { as: "label", size: "2", children: [
              b("annotator:editor.stamp.stampText"),
              /* @__PURE__ */ c(kt.Root, { value: _.stampText, onChange: (G) => N("stampText", G.target.value) })
            ] }) }),
            /* @__PURE__ */ T(Q, { direction: "column", gridColumn: "span 9", children: [
              /* @__PURE__ */ c(de, { size: "2", children: b("annotator:editor.stamp.textColor") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ c(
                Et,
                {
                  transparent: !0,
                  value: _.textColor,
                  onChange: (G) => N("textColor", G),
                  presets: v,
                  popover: !0
                }
              ) })
            ] }),
            /* @__PURE__ */ T(Q, { direction: "column", gridColumn: "span 8", children: [
              /* @__PURE__ */ c(de, { size: "2", children: b("annotator:editor.stamp.backgroundColor") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ c(
                Et,
                {
                  value: _.backgroundColor,
                  onChange: (G) => N("backgroundColor", G),
                  presets: v,
                  popover: !0,
                  transparent: !0
                }
              ) })
            ] }),
            /* @__PURE__ */ T(Q, { direction: "column", gridColumn: "span 5", children: [
              /* @__PURE__ */ c(de, { size: "2", children: b("annotator:editor.stamp.borderColor") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ c(
                Et,
                {
                  value: _.borderColor,
                  onChange: (G) => N("borderColor", G),
                  presets: v,
                  transparent: !0,
                  popover: !0
                }
              ) })
            ] }),
            /* @__PURE__ */ T(Q, { direction: "column", gridColumn: "span 9", children: [
              /* @__PURE__ */ c(de, { size: "2", children: b("annotator:editor.stamp.fontStyle") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ c(
                bt.Root,
                {
                  value: _.fontStyle,
                  onValueChange: (G) => N("fontStyle", G),
                  children: /* @__PURE__ */ T(Q, { direction: "row", gap: "2", children: [
                    /* @__PURE__ */ c(bt.Item, { value: "bold", children: /* @__PURE__ */ c(zr, {}) }),
                    /* @__PURE__ */ c(bt.Item, { value: "italic", children: /* @__PURE__ */ c(Fr, {}) }),
                    /* @__PURE__ */ c(bt.Item, { value: "underline", children: /* @__PURE__ */ c(jr, {}) }),
                    /* @__PURE__ */ c(bt.Item, { value: "strikeout", children: /* @__PURE__ */ c(Br, {}) })
                  ] })
                }
              ) })
            ] }),
            /* @__PURE__ */ T(Q, { direction: "column", gridColumn: "span 8", children: [
              /* @__PURE__ */ c(de, { size: "2", children: b("annotator:editor.stamp.fontFamily") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ T(Re.Root, { value: _.fontFamily, onValueChange: (G) => N("fontFamily", G), children: [
                /* @__PURE__ */ c(Re.Trigger, {}),
                /* @__PURE__ */ c(Re.Content, { children: p.map((G) => /* @__PURE__ */ c(Re.Item, { value: G.value, children: G.label }, G.value)) })
              ] }) })
            ] }),
            /* @__PURE__ */ T(Q, { direction: "column", gridColumn: "span 5", children: [
              /* @__PURE__ */ c(de, { size: "2", children: b("annotator:editor.stamp.borderStyle") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ T(
                Re.Root,
                {
                  value: _.borderStyle,
                  onValueChange: (G) => N("borderStyle", G),
                  children: [
                    /* @__PURE__ */ c(Re.Trigger, {}),
                    /* @__PURE__ */ T(Re.Content, { children: [
                      /* @__PURE__ */ c(Re.Item, { value: "none", children: b("annotator:editor.stamp.none") }),
                      /* @__PURE__ */ c(Re.Item, { value: "solid", children: b("annotator:editor.stamp.solid") }),
                      /* @__PURE__ */ c(Re.Item, { value: "dashed", children: b("annotator:editor.stamp.dashed") })
                    ] })
                  ]
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ c(nt, { my: "3", size: "4" }),
          /* @__PURE__ */ T($t, { align: "center", columns: "2", gap: "3", children: [
            /* @__PURE__ */ T(Q, { direction: "column", children: [
              /* @__PURE__ */ c(de, { size: "2", children: b("annotator:editor.stamp.timestampText") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ c(
                bt.Root,
                {
                  value: _.timestamp,
                  onValueChange: (G) => N("timestamp", G),
                  children: /* @__PURE__ */ T(Q, { direction: "row", gap: "2", children: [
                    /* @__PURE__ */ c(bt.Item, { value: "username", children: b("annotator:editor.stamp.username") }),
                    /* @__PURE__ */ c(bt.Item, { value: "date", children: b("annotator:editor.stamp.date") })
                  ] })
                }
              ) })
            ] }),
            /* @__PURE__ */ T(Q, { direction: "column", children: [
              /* @__PURE__ */ c(de, { size: "2", children: b("annotator:editor.stamp.dateFormat") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ T(Re.Root, { value: _.dateFormat, onValueChange: (G) => N("dateFormat", G), children: [
                /* @__PURE__ */ c(Re.Trigger, {}),
                /* @__PURE__ */ c(Re.Content, { children: Kc?.map((G) => /* @__PURE__ */ T(Re.Group, { children: [
                  /* @__PURE__ */ c(Re.Label, { children: G.label }),
                  G.options.map((J) => /* @__PURE__ */ c(Re.Item, { value: J.value, children: J.label }, J.value))
                ] }, G.label)) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ c($t, { align: "center", columns: "1", gap: "3", mt: "3", children: /* @__PURE__ */ T(de, { as: "label", size: "2", children: [
            b("annotator:editor.stamp.customTimestamp"),
            /* @__PURE__ */ c(
              kt.Root,
              {
                value: _.customTimestampText,
                onChange: (G) => N("customTimestampText", G.target.value)
              }
            )
          ] }) }),
          /* @__PURE__ */ T(Q, { gap: "3", mt: "4", justify: "end", children: [
            /* @__PURE__ */ c(ct.Close, { children: /* @__PURE__ */ c(be, { style: { width: 100 }, variant: "soft", color: "gray", children: b("cancel") }) }),
            /* @__PURE__ */ c(ct.Close, { children: /* @__PURE__ */ c(be, { style: { width: 100 }, onClick: H, children: b("ok") }) })
          ] })
        ] }),
        /* @__PURE__ */ c("div", { className: "StampTool-Toolbar" })
      ] })
    ] }) })
  ] });
}, sr = {
  select: R.SELECT,
  rectangle: R.RECTANGLE,
  circle: R.CIRCLE,
  note: R.NOTE,
  arrow: R.ARROW,
  cloud: R.CLOUD,
  freehand: R.FREEHAND,
  freeHighlight: R.FREE_HIGHLIGHT,
  freeText: R.FREETEXT,
  signature: R.SIGNATURE,
  stamp: R.STAMP
};
function qc(n) {
  const e = De.find((t) => t.type === sr[n]);
  if (!e) throw new Error(`UNKNOWN_ANNOTATION_TOOL:${n}`);
  return e;
}
function Gn(n) {
  return n === void 0 ? null : Object.entries(sr).find(([, t]) => t === n)?.[0] ?? null;
}
function Un(n) {
  return n !== "menu-item" ? {} : {
    variant: "ghost",
    size: "2",
    style: { width: "100%", justifyContent: "flex-start", gap: 8 }
  };
}
const Nn = ({
  tool: n,
  presentation: e = "toolbar-icon",
  label: t,
  colorOnHover: o = !1,
  default_signatures: r,
  default_stamps: s
}) => {
  const { t: i } = ye(["annotator"], { useSuspense: !1 }), { defaultOptions: a } = Nt(), { painter: l, requestWrite: u } = ot(), d = le((O) => O.currentAnnotationType), h = ke(() => qc(n), [n]), p = l?.can("annotation.create") ?? !1, g = d?.type === h.type, f = t ?? i(`annotator:tool.${h.name}`), S = Un(e), m = o && e === "toolbar-icon" && g && !!h.styleEditable?.color, [v, b] = Y(!1), w = B(null), x = B(null), E = B(null), I = B(!1), P = X(() => {
    w.current !== null && (window.clearTimeout(w.current), w.current = null);
  }, []), W = X(() => {
    P(), I.current = !0, m && b(!0);
  }, [P, m]), F = X(() => {
    P(), I.current = !1, b(!1);
  }, [P]), D = X((O) => O instanceof Node ? !!(x.current?.contains(O) || E.current?.contains(O)) : !1, []), A = X((O) => {
    if (D(O?.relatedTarget ?? null)) {
      I.current = !0, P();
      return;
    }
    I.current = !1, P(), w.current = window.setTimeout(() => {
      w.current = null, I.current || b(!1);
    }, 120);
  }, [P, D]);
  ne(() => (m || F(), P), [P, F, m]), ne(() => {
    if (!m || !v) return;
    const O = (Z) => {
      if (D(Z.target)) {
        I.current = !0, P();
        return;
      }
      I.current && A();
    };
    return document.addEventListener("pointermove", O, !0), () => document.removeEventListener("pointermove", O, !0);
  }, [P, m, v, D, A]);
  const L = X(async (O = null) => {
    if (!p && u && !await u({ kind: "tool", tool: n }))
      return;
    const Z = g ? null : h;
    l?.activate(Z, Z && [R.SIGNATURE, R.STAMP].includes(Z.type) ? O : null);
  }, [h, p, l, u, g, n]), $ = p || !!u, j = X(() => {
    p || !u || u({ kind: "tool", tool: n });
  }, [p, u, n]);
  if (n === "signature")
    return /* @__PURE__ */ c(
      Fc,
      {
        annotation: h,
        disabled: !$,
        selected: g,
        presentation: e,
        label: f,
        default_signatures: r,
        onAdd: (O) => L(O),
        onIntent: j
      }
    );
  if (n === "stamp")
    return /* @__PURE__ */ c(
      Xc,
      {
        annotation: h,
        disabled: !$,
        selected: g,
        presentation: e,
        label: f,
        default_stamps: s,
        onAdd: (O) => L(O),
        onIntent: j
      }
    );
  const _ = /* @__PURE__ */ c(
    xt,
    {
      disabled: n !== "select" && !$,
      selected: g,
      tooltip: e === "menu-item" || m ? "none" : "auto",
      title: String(f),
      label: e === "menu-item" ? f : void 0,
      icon: h.icon,
      buttonProps: S,
      ref: m ? x : void 0,
      onPointerEnter: m ? W : void 0,
      onPointerLeave: m ? A : void 0,
      onClick: () => L()
    }
  );
  return m ? /* @__PURE__ */ c(
    Et,
    {
      value: d?.style?.color || a.colors[0],
      onChange: (O) => {
        if (!d) return;
        const Z = {
          ...d,
          style: { ...d.style, color: O }
        };
        if (l?.can("annotation.create")) {
          l.activate(Z, null);
          return;
        }
        const K = u?.({ kind: "tool", tool: Gn(Z.type) ?? "select" });
        K && K.then((k) => {
          k && l?.activate(Z, null);
        });
      },
      presets: a.colors,
      popover: !0,
      open: g && v,
      onOpenChange: (O) => {
        g && (O ? (I.current = !0, b(!0)) : I.current || b(!1));
      },
      contentRef: E,
      onContentPointerEnter: W,
      onContentPointerLeave: A,
      onPointerDownOutside: F,
      trigger: _
    }
  ) : _;
}, ar = ({ presentation: n = "toolbar-icon" }) => {
  const { defaultOptions: e } = Nt(), { painter: t, requestWrite: o } = ot(), r = le((l) => l.currentAnnotationType), s = !r?.styleEditable?.color, i = Un(n), a = (l) => {
    if (!r) return;
    const u = {
      ...r,
      style: { ...r.style, color: l }
    };
    if (t?.can("annotation.create")) {
      t.activate(u, null);
      return;
    }
    const d = o?.({ kind: "tool", tool: Gn(u.type) ?? "select" });
    d && d.then((h) => {
      h && t?.activate(u, null);
    });
  };
  return /* @__PURE__ */ c(
    Et,
    {
      value: r?.style?.color || e.colors[0],
      onChange: a,
      presets: e.colors,
      popover: !0,
      trigger: /* @__PURE__ */ c(
        xt,
        {
          disabled: s || !t?.can("annotation.create") && !o,
          tooltip: n === "menu-item" ? "none" : "auto",
          title: "Color",
          label: n === "menu-item" ? "Color" : void 0,
          buttonProps: i,
          icon: /* @__PURE__ */ c(
            bs,
            {
              style: { "--palette-preview-color": r?.style?.color }
            }
          )
        }
      )
    }
  );
}, cr = ({ presentation: n = "toolbar-icon" }) => {
  const { t: e } = ye(["annotator"], { useSuspense: !1 }), { painter: t } = ot(), [o, r] = Y(!1), s = Un(n);
  return Qe(() => {
    r(t?.areAnnotationAuthorLabelsVisible() ?? !1);
  }, [t]), /* @__PURE__ */ c(
    xt,
    {
      disabled: !t,
      selected: o,
      tooltip: n === "menu-item" ? "none" : "auto",
      title: o ? e("annotator:authorLabels.hide") : e("annotator:authorLabels.show", { shortcut: "Alt" }),
      label: n === "menu-item" ? "作者标签" : void 0,
      buttonProps: s,
      icon: /* @__PURE__ */ c(Ss, {}),
      onClick: () => {
        if (!t) return;
        const i = !t.areAnnotationAuthorLabelsVisible();
        t.setAnnotationAuthorLabelsVisible(i), r(i);
      }
    }
  );
}, Jc = ({ defaultAnnotationName: n = "", stamps: e, signatures: t }) => {
  const o = n ? De.find((s) => s.name === n) ?? null : null, { painter: r } = ot();
  return Pt.useEffect(() => {
    if (o)
      return r?.activate(o, null), () => {
        r?.activate(null, null);
      };
  }, [o, r]), /* @__PURE__ */ T(Q, { gap: "3", align: "center", children: [
    /* @__PURE__ */ c(Qt, {}),
    /* @__PURE__ */ c(nt, { orientation: "vertical" }),
    /* @__PURE__ */ c(Nn, { tool: "select" }),
    De.filter((s) => s.webSelectionDependencies === !1 && s.type !== R.SELECT).map((s) => /* @__PURE__ */ c(
      Nn,
      {
        tool: s.name,
        default_stamps: s.type === R.STAMP ? e : void 0,
        default_signatures: s.type === R.SIGNATURE ? t : void 0
      },
      s.name
    )),
    /* @__PURE__ */ c(nt, { orientation: "vertical" }),
    /* @__PURE__ */ c(ar, {}),
    /* @__PURE__ */ c(nt, { orientation: "vertical" }),
    /* @__PURE__ */ c(cr, {})
  ] });
}, Zc = ({ defaultAnnotationName: n, stamps: e, signatures: t }) => /* @__PURE__ */ c(
  Jc,
  {
    defaultAnnotationName: n,
    stamps: e,
    signatures: t
  }
), Qc = {
  // 可选颜色列表 / Available color options
  colors: [
    "#ff6b6b",
    "#ffa94d",
    "#ffe066",
    "#b4fa56",
    "#51cf66",
    "#4dabf7",
    "#228be6",
    "#364fc7",
    "#9c36b5",
    "#e64980",
    "#1272e8",
    "#04861b",
    "#da3324",
    "#000000",
    "#fefefe"
  ],
  // 签名默认配置 / Signature default configuration
  signature: {
    colors: ["#000000", "#ff0000", "#1677ff"],
    // 签名可用颜色 / Available signature colors
    type: "Enter",
    // 默认签名模式: Draw 绘制，Enter 输入，Upload 上传 / Default signature mode: Draw, Enter, Upload
    maxSize: 1024 * 1024 * 5,
    // 最大文件大小为 5MB / Maximum file size is 5MB
    accept: ".png,.jpg,.jpeg,.bmp",
    // 签名文件允许的格式 / Allowed signature file formats
    defaultSignature: [],
    // 默认签名图片 / Default signature image
    defaultFont: [
      {
        label: "楷体",
        value: "STKaiti",
        external: !1
      }
    ]
    // 默认字体列表 / Default font list
  },
  // 盖章默认配置 / Stamp default configuration
  stamp: {
    maxSize: 1024 * 1024 * 5,
    // 最大文件大小为 5MB / Maximum file size is 5MB
    accept: ".png,.jpg,.jpeg,.bmp",
    // 盖章文件允许的格式 / Allowed stamp file formats
    defaultStamp: [],
    // 默认印章内容 / Default stamp content
    editor: {
      // 编辑器默认配置 / Editor default configuration
      defaultBackgroundColor: "#2f9e44",
      // 默认背景颜色 / Default background color
      defaultBorderColor: "#2b8a3e",
      // 默认边框颜色 / Default border color
      defaultBorderStyle: "none",
      // 默认边框样式 / Default border style
      defaultTextColor: "#fff",
      // 默认文字颜色 / Default text color
      defaultFont: [
        // 默认字体列表 / Default font list
        { label: "Arial", value: "Arial" },
        { label: "Times New Roman", value: "Times New Roman" },
        { label: "Georgia", value: "Georgia" },
        { label: "Verdana", value: "Verdana" },
        { label: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
        { label: "Trebuchet MS", value: '"Trebuchet MS", sans-serif' },
        { label: "Courier New", value: '"Courier New", Courier, monospace' },
        { label: "Lucida Console", value: '"Lucida Console", Monaco, monospace' },
        { label: "宋体", value: 'SimSun, Songti SC, STSong, 宋体, "Noto Serif SC", serif' },
        { label: "黑体", value: "Microsoft YaHei, PingFang SC, Heiti SC, SimHei, 黑体, sans-serif" },
        { label: "楷体", value: 'KaiTi, KaiTi_GB2312, STFangsong, 楷体, "AR PL UKai CN", serif' }
      ]
    }
  }
}, el = ({ children: n, requestWrite: e }) => {
  const [t, o] = Y(null), [r, s] = Y(0), i = X(() => s((l) => l + 1), []), a = ke(
    () => ({ painter: t, setPainter: o, refreshPainter: i, revision: r, requestWrite: e }),
    [t, i, e, r]
  );
  return /* @__PURE__ */ c(tr.Provider, { value: a, children: n });
}, tl = "_filter_xc5y0_1", nl = "_sidebar_xc5y0_19", ol = "_list_xc5y0_19", rl = "_group_xc5y0_23", il = "_comment_xc5y0_26", sl = "_title_xc5y0_39", al = "_annotationHeader_xc5y0_52", cl = "_annotationHeading_xc5y0_56", ll = "_annotationHeadingActive_xc5y0_60", dl = "_annotationMeta_xc5y0_63", ul = "_annotationAuthor_xc5y0_68", hl = "_annotationDateTime_xc5y0_74", pl = "_toolButton_xc5y0_78", fl = "_reply_xc5y0_81", gl = "_replyMeta_xc5y0_91", ml = "_selected_xc5y0_100", vl = "_annotationTypeIcon_xc5y0_111", yl = "_commentEditor_xc5y0_122", bl = "_replyEditor_xc5y0_127", ge = {
  filter: tl,
  sidebar: nl,
  list: ol,
  group: rl,
  comment: il,
  title: sl,
  annotationHeader: al,
  annotationHeading: cl,
  annotationHeadingActive: ll,
  annotationMeta: dl,
  annotationAuthor: ul,
  annotationDateTime: hl,
  toolButton: pl,
  reply: fl,
  replyMeta: gl,
  selected: ml,
  annotationTypeIcon: vl,
  commentEditor: yl,
  replyEditor: bl
}, Sl = /^#([1-9]\d*)$/;
function wl(n) {
  if (!n || typeof n != "object") return !1;
  const e = n;
  if (e.type !== "annotation" || typeof e.annotationId != "string" || e.annotationId.length === 0 || typeof e.label != "string")
    return !1;
  const t = Sl.exec(e.label);
  return !!(t && Number.isSafeInteger(Number(t[1])));
}
function Cl(n, e) {
  let t = 0;
  for (; t < n.length; ) {
    const o = n.indexOf(e, t);
    if (o === -1) return -1;
    const r = n[o + e.length];
    if (!r || !/\d/.test(r)) return o;
    t = o + e.length;
  }
  return -1;
}
function tn(n, e) {
  if (!e?.length) return;
  const t = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  e.forEach((i) => {
    if (!wl(i) || r.has(i.label)) return;
    const a = Cl(n, i.label);
    if (a === -1) return;
    const l = o.get(i.label);
    if (l && l !== i.annotationId) {
      r.add(i.label), o.delete(i.label), Array.from(t.entries()).forEach(([d, h]) => {
        h.reference.label === i.label && t.delete(d);
      });
      return;
    }
    o.set(i.label, i.annotationId);
    const u = `${i.annotationId}\0${i.label}`;
    t.has(u) || t.set(u, { reference: i, index: a });
  });
  const s = Array.from(t.values()).sort((i, a) => i.index - a.index).map(({ reference: i }) => ({ ...i }));
  return s.length > 0 ? s : void 0;
}
function In(n, e, t) {
  const o = tn(n, e);
  if (!o) return { content: n };
  const r = new Map(
    t.map((h) => [h.id, h])
  ), s = /* @__PURE__ */ new Map(), i = o.map((h) => {
    const p = r.get(h.annotationId)?.referenceNumber;
    if (p === void 0) return h;
    const g = `#${p}`;
    return s.set(h.label, g), g === h.label ? h : { ...h, label: g };
  }), a = Array.from(s.entries()).filter(([h, p]) => h !== p);
  if (a.length === 0)
    return { content: n, references: o };
  const l = a.map(([h]) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).sort((h, p) => p.length - h.length), u = new RegExp(`(?:${l.join("|")})(?!\\d)`, "g"), d = n.replace(
    u,
    (h) => s.get(h) ?? h
  );
  return {
    content: d,
    references: tn(
      d,
      i
    )
  };
}
const xl = 20, Tl = /^[\p{L}\p{N}_-]*$/u, Al = /[\s([{'",.!?;:“‘，。！？、：；]/;
function kl(n, e) {
  const t = n.slice(0, e), o = t.lastIndexOf("#");
  if (o === -1) return null;
  const r = n[o - 1];
  if (r && !Al.test(r)) return null;
  const s = t.slice(o + 1);
  return Tl.test(s) ? {
    start: o,
    end: e,
    query: s
  } : null;
}
function El(n, e, t) {
  const o = e.trim().toLocaleLowerCase();
  return n.filter((r) => r.id === t || r.referenceNumber === void 0 ? !1 : o ? [
    r.referenceNumber,
    `#${r.referenceNumber}`,
    r.title,
    r.pageNumber,
    r.subtype,
    r.contentsObj?.text
  ].filter((i) => i != null).join(" ").toLocaleLowerCase().includes(o) : !0).sort((r, s) => r.referenceNumber - s.referenceNumber).slice(0, xl);
}
const Rl = new Map(
  De.map((n) => [n.type, n.icon])
), lr = ({
  type: n,
  label: e,
  className: t,
  decorative: o = !1,
  showTooltip: r = !0
}) => {
  const s = Rl.get(n);
  if (!s) return null;
  const i = /* @__PURE__ */ c(
    "span",
    {
      className: t,
      role: o ? void 0 : "img",
      "aria-hidden": o || void 0,
      "aria-label": o ? void 0 : e,
      children: s
    }
  );
  return r ? /* @__PURE__ */ c(Rt, { content: e, children: i }) : i;
}, Pl = "_referenceInput_dfggt_1", Nl = "_editor_dfggt_5", Il = "_referenceMenu_dfggt_9", Ml = "_referenceOption_dfggt_17", Dl = "_referenceOptionHeader_dfggt_49", Ll = "_referenceTypeIcon_dfggt_53", _l = "_referencePage_dfggt_71", Ol = "_referenceSummary_dfggt_77", Hl = "_referenceMeta_dfggt_87", Gl = "_referenceAuthor_dfggt_97", Ul = "_referenceDate_dfggt_103", zl = "_referenceEmpty_dfggt_107", Fl = "_submit_dfggt_112", We = {
  referenceInput: Pl,
  editor: Nl,
  referenceMenu: Il,
  referenceOption: Ml,
  referenceOptionHeader: Dl,
  referenceTypeIcon: Ll,
  referencePage: _l,
  referenceSummary: Ol,
  referenceMeta: Hl,
  referenceAuthor: Gl,
  referenceDate: Ul,
  referenceEmpty: zl,
  submit: Fl
}, jl = /^[\s.,!?;:'"<>/\\，。！？；：、“”‘’《》（）()[\]{}]/, Bl = new Map(
  De.map((n) => [n.type, n.name])
);
function Wl(n) {
  const e = n.contentsObj;
  return (e?.text || e?.selectedText || "").replace(/\s+/g, " ").trim();
}
const wn = ({
  annotations: n,
  excludeAnnotationId: e,
  initialContent: t = "",
  initialReferences: o,
  className: r,
  placeholder: s,
  onSubmit: i,
  onCancel: a
}) => {
  const { t: l } = ye(["annotator", "common"], { useSuspense: !1 }), u = B(null);
  u.current === null && (u.current = In(
    t,
    o,
    n
  ));
  const [d, h] = Y(u.current.content), [p, g] = Y(
    () => u.current?.references ?? []
  ), [f, S] = Y(null), [m, v] = Y(0), b = B(null), w = B(null), x = B(null), E = B(null), I = B(!1), P = B(null), W = B([]), F = yr(), D = ke(
    () => El(
      n,
      f?.query ?? "",
      e
    ),
    [n, e, f?.query]
  ), A = f !== null, L = D.length > 0 ? Math.min(m, D.length - 1) : 0;
  Qe(() => {
    const k = requestAnimationFrame(() => {
      b.current?.focus();
    });
    return () => cancelAnimationFrame(k);
  }, []), Qe(() => {
    const k = E.current;
    k !== null && (E.current = null, b.current?.focus(), b.current?.setSelectionRange(k, k));
  }, [d]), Qe(() => () => {
    P.current !== null && cancelAnimationFrame(P.current);
  }, []), Qe(() => {
    A && W.current[L]?.scrollIntoView?.({
      block: "nearest"
    });
  }, [L, A]);
  const $ = (k, H) => {
    const oe = kl(k, H);
    S(oe), v(0);
  }, j = (k) => {
    const H = k.target.value;
    h(H), g(tn(H, p) ?? []), I.current || $(H, k.target.selectionStart);
  }, _ = (k) => {
    if (!f || k.referenceNumber === void 0) return;
    const H = `#${k.referenceNumber}`, oe = d.slice(0, f.start), N = d.slice(f.end), q = N.length === 0 || !jl.test(N) ? " " : "", te = `${oe}${H}${q}${N}`, se = [
      ...p.filter((G) => G.label !== H),
      {
        type: "annotation",
        annotationId: k.id,
        label: H
      }
    ];
    E.current = oe.length + H.length + q.length, h(te), g(tn(te, se) ?? []), S(null), v(0);
  }, O = () => {
    i(In(
      d,
      p,
      n
    ));
  }, Z = (k) => {
    if (!(k.nativeEvent.isComposing || I.current || k.keyCode === 229)) {
      if (A) {
        if (k.key === "ArrowDown") {
          k.preventDefault(), D.length > 0 && v((L + 1) % D.length);
          return;
        }
        if (k.key === "ArrowUp") {
          k.preventDefault(), D.length > 0 && v((L - 1 + D.length) % D.length);
          return;
        }
        if (k.key === "Enter") {
          k.preventDefault();
          const H = D[L];
          H && _(H);
          return;
        }
        if (k.key === "Escape") {
          k.preventDefault(), S(null);
          return;
        }
      }
      if (k.key === "Escape") {
        k.preventDefault(), a();
        return;
      }
      k.key === "Enter" && !k.shiftKey && (k.preventDefault(), O());
    }
  }, K = (k) => {
    k.relatedTarget instanceof Node && (w.current?.contains(k.relatedTarget) || x.current?.contains(k.relatedTarget)) || (P.current !== null && cancelAnimationFrame(P.current), P.current = requestAnimationFrame(() => {
      P.current = null, !w.current?.contains(document.activeElement) && !x.current?.contains(document.activeElement) && a();
    }));
  };
  return /* @__PURE__ */ T(
    "div",
    {
      ref: w,
      "data-annotation-editor": !0,
      className: `${We.referenceInput} ${r ?? ""}`,
      onBlurCapture: K,
      onClick: (k) => k.stopPropagation(),
      children: [
        /* @__PURE__ */ c("div", { className: We.editor, children: /* @__PURE__ */ T(
          Ae.Root,
          {
            open: A,
            onOpenChange: (k) => {
              k || S(null);
            },
            children: [
              /* @__PURE__ */ c(Ae.Trigger, { children: /* @__PURE__ */ c(
                Mr,
                {
                  ref: b,
                  value: d,
                  rows: 4,
                  size: "1",
                  placeholder: s,
                  role: "combobox",
                  "aria-label": l("annotator:comment.reference.inputLabel"),
                  "aria-autocomplete": "list",
                  "aria-haspopup": "listbox",
                  "aria-expanded": A,
                  "aria-controls": A ? F : void 0,
                  "aria-activedescendant": A && D.length > 0 ? `${F}-option-${L}` : void 0,
                  onChange: j,
                  onClick: (k) => $(k.currentTarget.value, k.currentTarget.selectionStart),
                  onKeyDown: Z,
                  onKeyUp: (k) => {
                    !I.current && !["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(k.key) && $(k.currentTarget.value, k.currentTarget.selectionStart);
                  },
                  onCompositionStart: () => {
                    I.current = !0;
                  },
                  onCompositionEnd: (k) => {
                    I.current = !1, $(k.currentTarget.value, k.currentTarget.selectionStart);
                  }
                }
              ) }),
              /* @__PURE__ */ c(
                Ae.Content,
                {
                  ref: x,
                  container: w.current,
                  id: F,
                  className: We.referenceMenu,
                  role: "listbox",
                  size: "1",
                  side: "bottom",
                  align: "start",
                  sideOffset: 4,
                  collisionPadding: 8,
                  onOpenAutoFocus: (k) => k.preventDefault(),
                  onCloseAutoFocus: (k) => {
                    k.preventDefault(), b.current?.focus();
                  },
                  children: D.length > 0 ? D.map((k, H) => {
                    const oe = Wl(k), N = Bl.get(k.type), q = N ? l(`annotator:tool.${N}`) : k.subtype, te = An(k.date);
                    return /* @__PURE__ */ T(
                      "div",
                      {
                        id: `${F}-option-${H}`,
                        ref: (se) => {
                          W.current[H] = se;
                        },
                        role: "option",
                        "aria-selected": H === L,
                        className: We.referenceOption,
                        onMouseEnter: () => v(H),
                        onMouseDown: (se) => se.preventDefault(),
                        onClick: () => _(k),
                        children: [
                          /* @__PURE__ */ T(Q, { align: "center", gap: "2", className: We.referenceOptionHeader, children: [
                            /* @__PURE__ */ T(Dr, { size: "1", radius: "full", variant: "soft", children: [
                              "#",
                              k.referenceNumber
                            ] }),
                            /* @__PURE__ */ c(de, { as: "span", size: "1", color: "gray", className: We.referencePage, children: l("annotator:comment.page", { value: k.pageNumber }) })
                          ] }),
                          /* @__PURE__ */ c(de, { as: "span", size: "2", className: We.referenceSummary, children: oe || l("annotator:comment.reference.noContent") }),
                          /* @__PURE__ */ T(de, { as: "span", size: "1", color: "gray", className: We.referenceMeta, children: [
                            /* @__PURE__ */ c(
                              lr,
                              {
                                type: k.type,
                                label: q,
                                className: We.referenceTypeIcon,
                                decorative: !0,
                                showTooltip: !1
                              }
                            ),
                            /* @__PURE__ */ c("span", { className: We.referenceAuthor, children: k.title }),
                            te && /* @__PURE__ */ T(ve, { children: [
                              /* @__PURE__ */ c("span", { "aria-hidden": "true", children: "·" }),
                              /* @__PURE__ */ c("span", { className: We.referenceDate, children: te })
                            ] })
                          ] })
                        ]
                      },
                      k.id
                    );
                  }) : /* @__PURE__ */ c(de, { as: "div", size: "2", color: "gray", className: We.referenceEmpty, children: l("annotator:comment.reference.empty") })
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ c(
          be,
          {
            type: "button",
            className: We.submit,
            onMouseDown: (k) => k.preventDefault(),
            onClick: O,
            children: l("common:confirm")
          }
        )
      ]
    }
  );
};
function Vl(n) {
  return n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function $l(n, e) {
  if (!n || !e?.length)
    return [{ kind: "text", value: n }];
  const t = new Map(
    e.map((a) => [a.label, a])
  ), o = Array.from(t.keys()).sort((a, l) => l.length - a.length), r = new RegExp(
    `(${o.map(Vl).join("|")})(?!\\d)`,
    "g"
  ), s = [];
  let i = 0;
  return n.replace(r, (a, l, u) => {
    u > i && s.push({
      kind: "text",
      value: n.slice(i, u)
    });
    const d = t.get(a);
    return d && s.push({
      kind: "reference",
      value: a,
      annotationId: d.annotationId
    }), i = u + a.length, a;
  }), i < n.length && s.push({
    kind: "text",
    value: n.slice(i)
  }), s.length > 0 ? s : [{ kind: "text", value: n }];
}
const Yl = "_content_1x9x1_1", Kl = "_reference_1x9x1_6", Xl = "_unavailable_1x9x1_29", Cn = {
  content: Yl,
  reference: Kl,
  unavailable: Xl
}, go = ({
  annotations: n,
  content: e = "",
  references: t,
  onActivate: o
}) => {
  const { t: r } = ye("annotator", { useSuspense: !1 }), s = ke(
    () => new Map(n.map((l) => [l.id, l])),
    [n]
  ), i = ke(
    () => In(e, t, n),
    [n, e, t]
  ), a = ke(
    () => $l(
      i.content,
      i.references
    ),
    [i]
  );
  return /* @__PURE__ */ c("span", { className: Cn.content, children: a.map((l, u) => {
    if (l.kind === "text")
      return /* @__PURE__ */ c(Pt.Fragment, { children: l.value }, `text-${u}`);
    const d = s.get(l.annotationId);
    return d ? /* @__PURE__ */ c(
      ir,
      {
        annotation: d,
        onActivate: o,
        children: /* @__PURE__ */ c(
          "button",
          {
            className: Cn.reference,
            type: "button",
            "aria-label": r("comment.reference.open", {
              value: l.value
            }),
            onClick: (h) => {
              h.stopPropagation(), o(l.annotationId);
            },
            children: l.value
          }
        )
      },
      `reference-${l.annotationId}-${u}`
    ) : /* @__PURE__ */ c(
      "span",
      {
        className: Cn.unavailable,
        "aria-label": r("comment.reference.unavailable", {
          value: l.value
        }),
        title: r("comment.reference.unavailable", {
          value: l.value
        }),
        children: l.value
      },
      `reference-${l.annotationId}-${u}`
    );
  }) });
};
function ql(n, e) {
  return {
    ...n || { text: "" },
    text: e.content,
    references: e.references
  };
}
function Jl({
  id: n,
  title: e,
  date: t,
  draft: o,
  status: r,
  user: s
}) {
  return {
    id: n,
    title: e,
    date: t,
    content: o.content,
    references: o.references,
    status: r,
    user: s
  };
}
function Zl(n, e, t, o, r) {
  return n.map((s) => s.id === e ? {
    ...s,
    content: t.content,
    references: t.references,
    date: o,
    title: r
  } : s);
}
const mo = new Map(
  De.map((n) => [n.type, n.name])
), Vt = {
  [at.Accepted]: {
    labelKey: "annotator:comment.status.accepted",
    icon: /* @__PURE__ */ c(Jr, {})
  },
  [at.Rejected]: {
    labelKey: "annotator:comment.status.rejected",
    icon: /* @__PURE__ */ c(qr, {})
  },
  [at.Cancelled]: {
    labelKey: "annotator:comment.status.cancelled",
    icon: /* @__PURE__ */ c(Xr, {})
  },
  [at.Completed]: {
    labelKey: "annotator:comment.status.completed",
    icon: /* @__PURE__ */ c(Kr, {})
  },
  [at.Closed]: {
    labelKey: "annotator:comment.status.closed",
    icon: /* @__PURE__ */ c(Yr, {})
  },
  [at.None]: {
    labelKey: "annotator:comment.status.none",
    icon: /* @__PURE__ */ c($r, {})
  }
}, Ql = () => {
  const n = le((y) => y.annotations), e = Gt(On), { isSidebarCollapsed: t } = Fe(), { painter: o, requestWrite: r } = ot(), s = !!r, i = le((y) => y.selectedAnnotation), a = le((y) => y.selectionRevision), l = le((y) => y.setSelectedAnnotation), [u, d] = Y(null), [h, p] = Y([]), [g, f] = Y([]), [S, m] = Y(null), v = B(null), b = B(null), w = B(null), x = B(null), { t: E } = ye(["common", "annotator"], { useSuspense: !1 }), I = u?.annotationId ?? null;
  ne(() => {
    const y = i?.store?.id;
    if (!y || i.source !== et.CANVAS || t)
      return;
    const C = le.getState().getAnnotation(y);
    if (!C) return;
    const U = !!(o?.can("annotation.edit", C) || s), V = C.contentsObj?.text === "", ue = C.comments?.length === 0;
    d(
      U && V && ue ? { kind: "annotation-edit", annotationId: C.id } : o?.can("annotation.comment", C) || s ? { kind: "annotation-reply", annotationId: C.id } : null
    );
  }, [
    i?.source,
    i?.store?.id,
    t,
    o,
    s,
    a
  ]);
  const P = B({});
  Qe(() => {
    if (!u) return;
    const y = requestAnimationFrame(() => {
      P.current[u.annotationId]?.querySelector("[data-annotation-editor]")?.scrollIntoView?.({
        behavior: "auto",
        block: "nearest",
        inline: "nearest"
      });
    });
    return () => cancelAnimationFrame(y);
  }, [u]);
  const W = ke(() => {
    const y = /* @__PURE__ */ new Map();
    return n.forEach((C) => {
      y.set(C.title, (y.get(C.title) || 0) + 1);
    }), Array.from(y.entries());
  }, [n]), F = ke(() => {
    const y = /* @__PURE__ */ new Map();
    return n.forEach((C) => {
      const U = y.get(C.type);
      y.set(C.type, {
        count: (U?.count || 0) + 1,
        fallbackLabel: U?.fallbackLabel || C.subtype
      });
    }), Array.from(y.entries());
  }, [n]);
  ne(() => {
    const y = new Set(W.map(([U]) => U)), C = v.current;
    v.current = y, p((U) => {
      if (C === null) return Array.from(y);
      const V = U.filter((pe) => y.has(pe)), ue = Array.from(y).filter((pe) => !C.has(pe)), he = [...V, ...ue];
      return he.length === U.length && he.every((pe, we) => pe === U[we]) ? U : he;
    });
  }, [W]), ne(() => {
    const y = new Set(F.map(([U]) => U)), C = b.current;
    b.current = y, f((U) => {
      if (C === null) return Array.from(y);
      const V = U.filter((pe) => y.has(pe)), ue = Array.from(y).filter((pe) => !C.has(pe)), he = [...V, ...ue];
      return he.length === U.length && he.every((pe, we) => pe === U[we]) ? U : he;
    });
  }, [F]), ne(() => () => {
    x.current !== null && cancelAnimationFrame(x.current), w.current = null;
  }, []);
  const D = ke(() => h.length === 0 || g.length === 0 ? [] : Array.from(n.values()).filter((y) => h.includes(y.title) && g.includes(y.type)), [n, h, g]);
  ne(() => {
    if (!u) return;
    const y = i?.store?.id, C = D.some(
      (V) => V.id === u.annotationId
    ), U = !!(y && y !== u.annotationId && i?.source === et.CANVAS);
    C && !t && (y === u.annotationId || U) || d(null);
  }, [
    i?.source,
    i?.store?.id,
    u,
    D,
    t
  ]);
  const A = ke(
    () => Array.from(n.values()),
    [n]
  ), L = ke(() => D.reduce(
    (y, C) => (y[C.pageNumber] || (y[C.pageNumber] = []), y[C.pageNumber].push(C), y),
    {}
  ), [D]);
  ne(() => {
    if (!S) return;
    const y = window.requestAnimationFrame(() => {
      const C = P.current[S];
      C && (C.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      }), m(null));
    });
    return () => window.cancelAnimationFrame(y);
  }, [L, S]);
  const $ = (y) => {
    p((C) => C.includes(y) ? C.filter((U) => U !== y) : [...C, y]);
  }, j = (y) => {
    f((C) => C.includes(y) ? C.filter((U) => U !== y) : [...C, y]);
  }, _ = /* @__PURE__ */ T("div", { className: ge.filter, children: [
    /* @__PURE__ */ c(de, { as: "div", children: E("author") }),
    /* @__PURE__ */ c("ul", { children: W.map(([y, C]) => /* @__PURE__ */ c("li", { children: /* @__PURE__ */ c(de, { as: "label", size: "2", children: /* @__PURE__ */ T(Q, { gap: "2", children: [
      /* @__PURE__ */ c(Xt, { checked: h.includes(y), onCheckedChange: () => $(y) }),
      y,
      " (",
      C,
      ")"
    ] }) }) }, y)) }),
    /* @__PURE__ */ c(de, { as: "div", children: E("type") }),
    /* @__PURE__ */ c("ul", { children: F.map(([y, { count: C, fallbackLabel: U }]) => {
      const V = mo.get(y), ue = V ? E(`annotator:tool.${V}`) : U;
      return /* @__PURE__ */ c("li", { children: /* @__PURE__ */ c(de, { as: "label", size: "2", children: /* @__PURE__ */ T(Q, { gap: "2", children: [
        /* @__PURE__ */ c(Xt, { checked: g.includes(y), onCheckedChange: () => j(y) }),
        ue,
        " (",
        C,
        ")"
      ] }) }) }, y);
    }) }),
    /* @__PURE__ */ T(Q, { gap: "3", mt: "2", justify: "between", children: [
      /* @__PURE__ */ c(
        be,
        {
          variant: "ghost",
          onClick: () => {
            p(W.map(([y]) => y)), f(F.map(([y]) => y));
          },
          children: E("selectAll")
        }
      ),
      /* @__PURE__ */ c(
        be,
        {
          variant: "ghost",
          onClick: () => {
            p([]), f([]);
          },
          children: E("clear")
        }
      )
    ] })
  ] }), O = (y) => [...y.comments || []].reverse().find((U) => U.status !== void 0 && U.status !== null)?.status ?? at.None, Z = (y) => {
    const C = O(y);
    return Vt[C]?.icon ?? Vt[at.None].icon;
  }, K = (y) => {
    I && I !== y.id && d(null), l(y, et.SIDEBAR), o?.highlight(y);
  }, k = (y) => {
    I && (y.preventDefault(), y.stopPropagation(), d(null));
  }, H = (y) => {
    G("annotation.comment", y).then((C) => {
      C && (K(C), d({
        kind: "annotation-reply",
        annotationId: C.id
      }));
    });
  }, oe = (y) => {
    G("annotation.edit", y).then((C) => {
      C && (K(C), d({
        kind: "annotation-edit",
        annotationId: C.id
      }));
    });
  }, N = (y, C) => {
    G("comment.edit", y, C).then((U) => {
      const V = U?.comments?.find((ue) => ue.id === C.id);
      !U || !V || (K(U), d({
        kind: "reply-edit",
        annotationId: U.id,
        replyId: V.id
      }));
    });
  }, q = (y) => {
    w.current = y;
  }, te = (y) => {
    y.preventDefault();
    const C = w.current;
    w.current = null, C && (x.current !== null && cancelAnimationFrame(x.current), x.current = requestAnimationFrame(() => {
      x.current = null, C();
    }));
  }, se = (y) => {
    const C = n.get(y);
    C && (p((U) => U.includes(C.title) ? U : [...U, C.title]), f((U) => U.includes(C.type) ? U : [...U, C.type]), m(C.id), l(C, et.SIDEBAR), o?.highlight(C));
  }, G = async (y, C, U) => o?.can(y, C, U) ? C : !r || !await r({ kind: "mutation", action: y, annotationId: C.id }) ? null : le.getState().getAnnotation(C.id) ?? C, J = (y, C) => {
    const U = le.getState().getAnnotation(y.id);
    !U || !o || G("annotation.edit", U).then((V) => {
      V && (o.update(V.id, {
        contentsObj: ql(V.contentsObj, C),
        date: Kt(Date.now())
      }, "annotation.edit"), d(null));
    });
  }, ce = (y, C, U) => {
    const V = le.getState().getAnnotation(y.id);
    if (!V || !o) return;
    const ue = U === void 0 ? "annotation.comment" : "annotation.change-status";
    G(ue, V).then((he) => {
      if (!he) return;
      const pe = e?.user ?? void 0, we = Jl({
        id: Bo(),
        title: pe?.name ?? "Anonymous",
        date: Kt(Date.now()),
        draft: C,
        status: U,
        user: pe
      });
      o.update(he.id, {
        comments: [...he.comments || [], we]
      }, ue), d(null);
    });
  }, fe = (y, C, U) => {
    const V = le.getState().getAnnotation(y.id), ue = V?.comments?.find((he) => he.id === C.id);
    !V || !ue || !o || G("comment.edit", V, ue).then((he) => {
      const pe = he?.comments?.find((Be) => Be.id === ue.id);
      if (!he || !pe) return;
      const we = Zl(
        he.comments || [],
        pe.id,
        U,
        Kt(Date.now()),
        e?.user?.name || pe.title
      );
      o.update(he.id, {
        comments: we
      }, "comment.edit", pe), d(null);
    });
  }, xe = (y) => {
    o && G("annotation.delete", y).then((C) => {
      C && o.delete(C.id, !0);
    });
  }, Je = (y, C) => {
    o && G("comment.delete", y, C).then((U) => {
      !U || !o.deleteComment(U.id, C.id) || u?.kind === "reply-edit" && u.replyId === C.id && d(null);
    });
  }, Ve = (y) => {
    if (u?.kind === "annotation-edit" && u.annotationId === y.id && i?.store?.id === y.id)
      return /* @__PURE__ */ c(
        wn,
        {
          annotations: A,
          excludeAnnotationId: y.id,
          initialContent: y.contentsObj?.text,
          initialReferences: y.contentsObj?.references,
          className: ge.commentEditor,
          placeholder: E("annotator:comment.reference.commentPlaceholder"),
          onSubmit: (U) => J(y, U),
          onCancel: () => {
            d(null);
          }
        }
      );
    const C = y.contentsObj?.text;
    return C?.trim() ? /* @__PURE__ */ c(Q, { gap: "3", pl: "4", children: /* @__PURE__ */ c(de, { as: "p", size: "2", children: /* @__PURE__ */ c(
      go,
      {
        annotations: A,
        content: C,
        references: y.contentsObj?.references,
        onActivate: se
      }
    ) }) }) : null;
  }, He = (y) => u?.kind === "annotation-reply" && u.annotationId === y.id && i?.store?.id === y.id ? /* @__PURE__ */ c(
    wn,
    {
      annotations: A,
      excludeAnnotationId: y.id,
      className: ge.commentEditor,
      placeholder: E("annotator:comment.reference.replyPlaceholder"),
      onSubmit: (C) => ce(y, C),
      onCancel: () => {
        d(null);
      }
    }
  ) : null, je = (y, C) => u?.kind === "reply-edit" && u.annotationId === y.id && u.replyId === C.id ? /* @__PURE__ */ c(
    wn,
    {
      annotations: A,
      excludeAnnotationId: y.id,
      initialContent: C.content,
      initialReferences: C.references,
      className: ge.replyEditor,
      placeholder: E("annotator:comment.reference.replyPlaceholder"),
      onSubmit: (U) => fe(y, C, U),
      onCancel: () => {
        d(null);
      }
    }
  ) : /* @__PURE__ */ c(Q, { gap: "3", children: /* @__PURE__ */ c(de, { as: "p", size: "2", children: /* @__PURE__ */ c(
    go,
    {
      annotations: A,
      content: C.content,
      references: C.references,
      onActivate: se
    }
  ) }) }), $e = Object.entries(L).map(([y, C]) => {
    const U = C.sort((V, ue) => V.konvaClientRect.y - ue.konvaClientRect.y);
    return /* @__PURE__ */ T("div", { className: ge.group, children: [
      /* @__PURE__ */ T(Q, { gap: "2", justify: "between", p: "1", children: [
        /* @__PURE__ */ c(de, { size: "1", children: E("annotator:comment.page", { value: y }) }),
        /* @__PURE__ */ c(de, { size: "1", children: E("annotator:comment.total", { value: C.length }) })
      ] }),
      U.map((V) => {
        const ue = V.id === i?.store?.id, he = !!(o?.can("annotation.comment", V) || s), pe = !!(o?.can("annotation.edit", V) || s), we = !!(o?.can("annotation.delete", V) || s), Be = !!(o?.can("annotation.change-status", V) || s), ht = O(V), Ye = Qo(V) ?? V.title, Oe = mt(V.referenceNumber), Ge = Oe ? `#${V.referenceNumber}` : Ye, vt = Oe && ue, wt = Wn(V.date), Ut = mo.get(V.type), an = Ut ? E(`annotator:tool.${Ut}`) : V.subtype, cn = {
          className: [
            ge.comment,
            ue ? ge.selected : ""
          ].filter(Boolean).join(" "),
          id: `annotation-${V.id}`
        };
        return /* @__PURE__ */ br(
          "div",
          {
            ...cn,
            key: V.id,
            onClick: () => K(V),
            ref: (Ce) => P.current[V.id] = Ce
          },
          /* @__PURE__ */ T("div", { className: `${ge.title} ${ge.annotationHeader}`, children: [
            /* @__PURE__ */ T(
              de,
              {
                as: "div",
                size: "2",
                weight: "medium",
                highContrast: !0,
                className: [
                  ge.annotationHeading,
                  vt ? ge.annotationHeadingActive : ""
                ].filter(Boolean).join(" "),
                children: [
                  Ge,
                  V.native && /* @__PURE__ */ c(Rt, { content: E("annotator:comment.nativeAnnotation"), children: /* @__PURE__ */ c("span", { children: /* @__PURE__ */ c(Wr, {}) }) })
                ]
              }
            ),
            /* @__PURE__ */ T(
              Q,
              {
                align: "center",
                gap: "1",
                ml: "auto",
                onClick: (Ce) => Ce.stopPropagation(),
                children: [
                  Be && /* @__PURE__ */ T(me.Root, { children: [
                    /* @__PURE__ */ c(me.Trigger, { children: /* @__PURE__ */ c(
                      tt,
                      {
                        variant: "ghost",
                        color: "gray",
                        size: "1",
                        className: ge.toolButton,
                        "aria-label": E(Vt[ht].labelKey),
                        onPointerDown: k,
                        style: {
                          boxShadow: "none"
                        },
                        children: Z(V)
                      }
                    ) }),
                    /* @__PURE__ */ c(
                      me.Content,
                      {
                        onCloseAutoFocus: te,
                        children: Object.entries(Vt).map(([Ce, pt]) => /* @__PURE__ */ T(
                          me.Item,
                          {
                            onSelect: () => {
                              ce(
                                V,
                                {
                                  content: E("annotator:comment.statusText", { value: E(pt.labelKey) })
                                },
                                Ce
                              );
                            },
                            children: [
                              pt.icon,
                              " ",
                              E(pt.labelKey)
                            ]
                          },
                          Ce
                        ))
                      }
                    )
                  ] }),
                  (he || pe || we) && /* @__PURE__ */ T(me.Root, { children: [
                    /* @__PURE__ */ c(me.Trigger, { children: /* @__PURE__ */ c(
                      tt,
                      {
                        variant: "ghost",
                        color: "gray",
                        size: "1",
                        className: ge.toolButton,
                        "aria-label": E("more"),
                        onPointerDown: k,
                        style: {
                          boxShadow: "none"
                        },
                        children: /* @__PURE__ */ c(jn, {})
                      }
                    ) }),
                    /* @__PURE__ */ T(
                      me.Content,
                      {
                        onCloseAutoFocus: te,
                        children: [
                          he && /* @__PURE__ */ c(
                            me.Item,
                            {
                              onSelect: (Ce) => {
                                Ce.stopPropagation(), q(() => H(V));
                              },
                              children: E("reply")
                            }
                          ),
                          pe && /* @__PURE__ */ c(
                            me.Item,
                            {
                              onSelect: (Ce) => {
                                Ce.stopPropagation(), q(() => oe(V));
                              },
                              children: E("edit")
                            }
                          ),
                          we && /* @__PURE__ */ c(
                            me.Item,
                            {
                              onSelect: (Ce) => {
                                Ce.stopPropagation(), xe(V);
                              },
                              children: E("delete")
                            }
                          )
                        ]
                      }
                    )
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ T(Q, { align: "center", gap: "1", className: ge.annotationMeta, children: [
            /* @__PURE__ */ c(
              lr,
              {
                type: V.type,
                label: an,
                className: ge.annotationTypeIcon
              }
            ),
            /* @__PURE__ */ c(
              de,
              {
                as: "span",
                size: "1",
                color: "gray",
                className: ge.annotationAuthor,
                children: Ye
              }
            ),
            wt && /* @__PURE__ */ T(ve, { children: [
              /* @__PURE__ */ c(de, { as: "span", size: "1", color: "gray", "aria-hidden": "true", children: "·" }),
              /* @__PURE__ */ c(
                de,
                {
                  as: "span",
                  size: "1",
                  color: "gray",
                  className: ge.annotationDateTime,
                  children: wt
                }
              )
            ] })
          ] }),
          Ve(V),
          V.comments?.map((Ce) => {
            const pt = Wn(Ce.date), yt = !!(o?.can("comment.edit", V, Ce) || s), rt = !!(o?.can("comment.delete", V, Ce) || s);
            return /* @__PURE__ */ T("div", { className: ge.reply, children: [
              /* @__PURE__ */ T("div", { className: `${ge.title} ${ge.annotationHeader}`, children: [
                /* @__PURE__ */ c(
                  de,
                  {
                    truncate: !0,
                    size: "1",
                    weight: "medium",
                    as: "div",
                    className: ge.annotationHeading,
                    children: Ce.title
                  }
                ),
                (yt || rt) && /* @__PURE__ */ c(
                  Q,
                  {
                    align: "center",
                    gap: "1",
                    ml: "auto",
                    onClick: (it) => it.stopPropagation(),
                    children: /* @__PURE__ */ T(me.Root, { children: [
                      /* @__PURE__ */ c(me.Trigger, { children: /* @__PURE__ */ c(
                        tt,
                        {
                          variant: "ghost",
                          color: "gray",
                          highContrast: !0,
                          size: "1",
                          className: ge.toolButton,
                          "aria-label": E("more"),
                          onPointerDown: k,
                          style: {
                            boxShadow: "none"
                          },
                          children: /* @__PURE__ */ c(jn, {})
                        }
                      ) }),
                      /* @__PURE__ */ T(
                        me.Content,
                        {
                          onCloseAutoFocus: te,
                          children: [
                            yt && /* @__PURE__ */ c(
                              me.Item,
                              {
                                onSelect: (it) => {
                                  it.stopPropagation(), q(() => N(V, Ce));
                                },
                                children: E("edit")
                              }
                            ),
                            rt && /* @__PURE__ */ c(
                              me.Item,
                              {
                                onSelect: (it) => {
                                  it.stopPropagation(), Je(V, Ce);
                                },
                                children: E("delete")
                              }
                            )
                          ]
                        }
                      )
                    ] })
                  }
                )
              ] }),
              pt && /* @__PURE__ */ c(Q, { align: "center", className: `${ge.annotationMeta} ${ge.replyMeta}`, children: /* @__PURE__ */ c(de, { as: "span", size: "1", color: "gray", children: pt }) }),
              je(V, Ce)
            ] }, Ce.id);
          }),
          /* @__PURE__ */ T("div", { children: [
            He(V),
            he && !u && i?.store?.id === V.id && /* @__PURE__ */ c(be, { mt: "2", style: { width: "100%" }, onClick: () => H(V), children: E("reply") })
          ] })
        );
      })
    ] }, y);
  });
  return /* @__PURE__ */ T("div", { className: ge.sidebar, children: [
    /* @__PURE__ */ c(Q, { align: "center", justify: "start", p: "1", children: /* @__PURE__ */ T(Ae.Root, { children: [
      /* @__PURE__ */ c(Ae.Trigger, { children: /* @__PURE__ */ c(
        be,
        {
          variant: "outline",
          size: "2",
          color: "gray",
          highContrast: !0,
          style: {
            boxShadow: "none",
            fontSize: "16px"
          },
          children: /* @__PURE__ */ c(Vr, {})
        }
      ) }),
      /* @__PURE__ */ c(Ae.Content, { children: _ })
    ] }) }),
    /* @__PURE__ */ c("div", { className: ge.list, children: $e })
  ] });
};
function Tt(n) {
  const e = JSON.parse(n);
  if (!e || typeof e != "object")
    throw new Error("Invalid serialized Konva node");
  return e;
}
class qe {
  annotation;
  page;
  pdfDoc;
  pageView;
  constructor(e, t, o, r) {
    this.pdfDoc = e, this.page = t, this.annotation = o, this.pageView = r;
  }
  addAnnotationToPage(e, t) {
    const o = e.node.lookup(z.of("Annots"));
    o ? o.push(t) : e.node.set(z.of("Annots"), e.doc.context.obj([t]));
  }
  getExportTitle(e) {
    const t = this.annotation.user?.name?.trim() || this.annotation.title?.trim() || e;
    return mt(this.annotation.referenceNumber) ? `${t} · #${this.annotation.referenceNumber}` : t;
  }
  extractGroupTransform(e) {
    const t = e.attrs ?? {};
    return {
      groupX: t.x || 0,
      groupY: t.y || 0,
      scaleX: t.scaleX || 1,
      scaleY: t.scaleY || 1
    };
  }
}
class ed extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, [s, i] = Pe(e.konvaClientRect, r), a = o.context, l = 32, u = [ee.of(s), ee.of(i), ee.of(s + l), ee.of(i + l)], d = a.obj({
      Type: z.of("Annot"),
      Subtype: z.of("Text"),
      Rect: u,
      NM: ie.of(e.id),
      // 唯一标识
      Contents: ae(e.contentsObj?.text || ""),
      Name: z.of("Comment"),
      T: ae(this.getExportTitle(Se("normal.unknownUser"))),
      M: ie.of(e.date || ""),
      C: Le(e.color || "#000000"),
      F: ee.of(4),
      P: t.ref,
      Open: !1
    }), h = a.register(d);
    this.addAnnotationToPage(t, h);
    for (const p of e.comments || []) {
      const g = a.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: u,
        Contents: ae(p.content),
        T: ae(p.title || Se("normal.unknownUser")),
        M: ie.of(p.date || ""),
        C: Le(e.color || "#000000"),
        IRT: h,
        RT: z.of("R"),
        NM: ie.of(p.id),
        // 唯一标识
        Open: !1
      }), f = a.register(g);
      this.addAnnotationToPage(t, f);
    }
  }
}
function Ct(n, e) {
  const t = e.attrs ?? {}, o = t.scaleX ?? 1, r = t.scaleY ?? 1, s = t.offsetX ?? 0, i = t.offsetY ?? 0, a = (n.x - s) * o, l = (n.y - i) * r, u = (t.rotation ?? 0) * Math.PI / 180, d = Math.cos(u), h = Math.sin(u);
  return {
    x: (t.x ?? 0) + a * d - l * h,
    y: (t.y ?? 0) + a * h + l * d
  };
}
function zn(n, e) {
  const t = n.x ?? 0, o = n.y ?? 0, r = n.width ?? 0, s = n.height ?? 0, i = [
    Ct({ x: t, y: o }, e),
    Ct({ x: t + r, y: o }, e),
    Ct({ x: t, y: o + s }, e),
    Ct({ x: t + r, y: o + s }, e)
  ], a = i.map((g) => g.x), l = i.map((g) => g.y), u = Math.min(...a), d = Math.max(...a), h = Math.min(...l), p = Math.max(...l);
  return { x: u, y: h, width: d - u, height: p - h };
}
function Mn(n, e) {
  const { viewport: t } = e;
  return t.convertToPdfPoint(n.x * t.scale, n.y * t.scale);
}
class td extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, i = Tt(e.konvaString), a = (i.children ?? []).filter((h) => h.className === "Rect"), l = [];
    for (const h of a) {
      const p = zn(h.attrs ?? {}, i), [g, f, S, m] = Pe(p, r);
      l.push(
        g,
        m,
        // 左上
        S,
        m,
        // 右上
        g,
        f,
        // 左下
        S,
        f
        // 右下
      );
    }
    const u = s.obj({
      Type: z.of("Annot"),
      Subtype: z.of("Highlight"),
      Rect: Pe(e.konvaClientRect, r),
      QuadPoints: l,
      C: Le(e.color || "#000000"),
      // 批注颜色
      T: ae(this.getExportTitle(Se("normal.unknownUser"))),
      // 编号与作者
      // QuadPoints anchor the source text; Contents is only the user-authored note.
      Contents: ae(e.contentsObj?.text || ""),
      M: ie.of(e.date || ""),
      // 日期
      NM: ie.of(e.id),
      // 唯一标识
      F: ee.of(4)
    }), d = s.register(u);
    this.addAnnotationToPage(t, d);
    for (const h of e.comments || []) {
      const p = s.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: [0, 0, 0, 0],
        Contents: ae(h.content),
        T: ae(h.title || Se("normal.unknownUser")),
        M: ie.of(h.date || ""),
        C: Le(e.color || "#000000"),
        IRT: d,
        RT: z.of("R"),
        NM: ie.of(h.id),
        // 唯一标识
        Open: !1
      }), g = s.register(p);
      this.addAnnotationToPage(t, g);
    }
  }
}
class nd extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, i = Tt(e.konvaString), a = (i.children ?? []).filter((h) => h.className === "Rect"), l = [];
    for (const h of a) {
      const p = zn(h.attrs ?? {}, i), [g, f, S, m] = Pe(p, r);
      l.push(
        g,
        m,
        // 左上
        S,
        m,
        // 右上
        g,
        f,
        // 左下
        S,
        f
        // 右下
      );
    }
    const u = s.obj({
      Type: z.of("Annot"),
      Subtype: z.of("Underline"),
      Rect: Pe(e.konvaClientRect, r),
      QuadPoints: l,
      C: Le(e.color || "#000000"),
      T: ae(this.getExportTitle(Se("normal.unknownUser"))),
      // QuadPoints anchor the source text; Contents is only the user-authored note.
      Contents: ae(e.contentsObj?.text || ""),
      M: ie.of(e.date || ""),
      NM: ie.of(e.id),
      F: ee.of(4)
    }), d = s.register(u);
    this.addAnnotationToPage(t, d);
    for (const h of e.comments || []) {
      const p = s.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: Pe(e.konvaClientRect, r),
        Contents: ae(h.content),
        T: ae(h.title || Se("normal.unknownUser")),
        M: ie.of(h.date || ""),
        C: Le(e.color || "#000000"),
        IRT: d,
        RT: z.of("R"),
        NM: ie.of(h.id),
        Open: !1
      }), g = s.register(p);
      this.addAnnotationToPage(t, g);
    }
  }
}
class od extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, i = Tt(e.konvaString), a = (i.children ?? []).filter((h) => h.className === "Rect"), l = [];
    for (const h of a) {
      const p = zn(h.attrs ?? {}, i), [g, f, S, m] = Pe(p, r);
      l.push(
        g,
        m,
        // 左上
        S,
        m,
        // 右上
        g,
        f,
        // 左下
        S,
        f
        // 右下
      );
    }
    const u = s.obj({
      Type: z.of("Annot"),
      Subtype: z.of("StrikeOut"),
      Rect: Pe(e.konvaClientRect, r),
      QuadPoints: l,
      C: Le(e.color || "#000000"),
      T: ae(this.getExportTitle(Se("normal.unknownUser"))),
      // QuadPoints anchor the source text; Contents is only the user-authored note.
      Contents: ae(e.contentsObj?.text || ""),
      M: ie.of(e.date || ""),
      NM: ie.of(e.id),
      F: ee.of(4)
    }), d = s.register(u);
    this.addAnnotationToPage(t, d);
    for (const h of e.comments || []) {
      const p = s.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: Pe(e.konvaClientRect, r),
        Contents: ae(h.content),
        T: ae(h.title || Se("normal.unknownUser")),
        M: ie.of(h.date || ""),
        C: Le(e.color || "#000000"),
        IRT: d,
        RT: z.of("R"),
        NM: ie.of(h.id),
        Open: !1
      }), g = s.register(p);
      this.addAnnotationToPage(t, g);
    }
  }
}
class rd extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, i = Tt(e.konvaString), l = (i.children?.[0] ?? i).attrs ?? i.attrs ?? {}, u = l.strokeWidth ?? 2, d = l.dash ?? [], h = l.opacity ?? 1, p = {
      W: ee.of(u),
      S: z.of(d.length > 0 ? "D" : "S"),
      ...d.length > 0 ? { D: s.obj(d) } : {}
    }, g = s.obj({
      Type: z.of("Annot"),
      Subtype: z.of("Square"),
      Rect: Pe(e.konvaClientRect, r),
      C: Le(e.color || "#000000"),
      // 边框颜色
      T: ae(this.getExportTitle(Se("normal.unknownUser"))),
      // 编号与作者
      Contents: ae(e.contentsObj?.text || ""),
      // 说明文字
      M: ie.of(e.date || ""),
      NM: ie.of(e.id),
      // 唯一标识
      F: ee.of(4),
      P: t.ref,
      BS: s.obj(p),
      CA: ee.of(h)
    }), f = s.register(g);
    this.addAnnotationToPage(t, f);
    for (const S of e.comments || []) {
      const m = s.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: Pe(e.konvaClientRect, r),
        Contents: ae(S.content),
        T: ae(S.title || Se("normal.unknownUser")),
        M: ie.of(S.date || ""),
        C: Le(e.color || "#000000"),
        IRT: f,
        RT: z.of("R"),
        NM: ie.of(S.id),
        Open: !1
      }), v = s.register(m);
      this.addAnnotationToPage(t, v);
    }
  }
}
class id extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, a = Tt(e.konvaString).children?.find((m) => m.className === "Ellipse");
    if (!a) throw new Error(`Annotation ${e.id} is missing its ellipse geometry.`);
    const l = a.attrs ?? {}, u = l.strokeWidth ?? 2, d = l.dash ?? [], h = l.opacity ?? 1, p = {
      W: ee.of(u),
      S: z.of(d.length > 0 ? "D" : "S"),
      ...d.length > 0 ? { D: s.obj(d) } : {}
    }, g = Pe(e.konvaClientRect, r), f = s.obj({
      Type: z.of("Annot"),
      Subtype: z.of("Circle"),
      Rect: g,
      C: Le(e.color || "#000000"),
      T: ae(this.getExportTitle(Se("normal.unknownUser"))),
      Contents: ae(e.contentsObj?.text || ""),
      M: ie.of(e.date || ""),
      NM: ie.of(e.id),
      F: ee.of(4),
      P: t.ref,
      BS: s.obj(p),
      CA: ee.of(h)
    }), S = s.register(f);
    this.addAnnotationToPage(t, S);
    for (const m of e.comments || []) {
      const v = s.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: g,
        Contents: ae(m.content),
        T: ae(m.title || Se("normal.unknownUser")),
        M: ie.of(m.date || ""),
        C: Le(e.color || "#000000"),
        IRT: S,
        RT: z.of("R"),
        NM: ie.of(m.id),
        Open: !1
      }), b = s.register(v);
      this.addAnnotationToPage(t, b);
    }
  }
}
class sd extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, i = Tt(e.konvaString), a = (i.children ?? []).filter((F) => F.className === "Line"), { groupX: l, groupY: u, scaleX: d, scaleY: h } = this.extractGroupTransform(i), p = r.viewport, g = s.obj(
      a.map((F) => {
        const D = F.attrs?.points ?? [], A = [];
        for (let L = 0; L < D.length; L += 2) {
          const $ = l + D[L] * d, j = u + D[L + 1] * h, _ = $ * p.scale, O = j * p.scale, [Z, K] = p.convertToPdfPoint(_, O);
          A.push(Z, K);
        }
        return s.obj(A);
      })
    ), f = a[0]?.attrs ?? {}, S = f.strokeWidth ?? 1, m = f.opacity ?? 1, v = f.stroke ?? e.color ?? "rgb(255, 0, 0)", [b, w, x] = Le(v), E = s.obj({
      W: ee.of(S),
      S: z.of("S")
      // Solid border style
    }), I = Pe(e.konvaClientRect, r), P = s.obj({
      Type: z.of("Annot"),
      Subtype: z.of("Ink"),
      Rect: I,
      InkList: g,
      C: s.obj([ee.of(b), ee.of(w), ee.of(x)]),
      T: ae(this.getExportTitle(Se("normal.unknownUser"))),
      Contents: ae(e.contentsObj?.text || ""),
      M: ie.of(e.date || ""),
      NM: ie.of(e.id),
      Border: s.obj([0, 0, 0]),
      BS: E,
      F: ee.of(4),
      P: t.ref,
      CA: ee.of(m)
      // Non-stroking opacity (used for drawing)
    }), W = s.register(P);
    this.addAnnotationToPage(t, W);
    for (const F of e.comments || []) {
      const D = s.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: I,
        Contents: ae(F.content),
        T: ae(F.title || Se("normal.unknownUser")),
        M: ie.of(F.date || ""),
        C: s.obj([ee.of(b), ee.of(w), ee.of(x)]),
        IRT: W,
        RT: z.of("R"),
        NM: ie.of(F.id),
        Open: !1
      }), A = s.register(D);
      this.addAnnotationToPage(t, A);
    }
  }
}
class ad extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, [s, , , i] = Pe(e.konvaClientRect, r), a = o.context, l = 20, u = t.getWidth(), d = t.getHeight(), h = Math.max(0, Math.min(s, u - l)), p = Math.max(l, Math.min(i, d)), g = [
      ee.of(h),
      ee.of(p - l),
      ee.of(h + l),
      ee.of(p)
    ], f = JSON.parse(e.konvaString), S = f.children?.find((E) => E.className === "Text"), m = Math.abs(f.attrs?.scaleY ?? 1), v = (S?.attrs?.fontSize ?? 14) * m, b = S?.attrs?.opacity ?? 1, w = a.obj({
      Type: z.of("Annot"),
      Subtype: z.of("Text"),
      InkLayerType: z.of("FreeText"),
      InkLayerFontSize: ee.of(v),
      InkLayerTextWidth: ee.of(e.konvaClientRect.width),
      Rect: g,
      NM: ie.of(e.id),
      // 唯一标识
      Contents: ae(e.contentsObj?.text || ""),
      Name: z.of("Comment"),
      T: ae(this.getExportTitle(Se("normal.unknownUser"))),
      M: ie.of(e.date || ""),
      C: Le(e.color || "#000000"),
      CA: ee.of(b),
      F: ee.of(4),
      P: t.ref,
      Open: !1
    }), x = a.register(w);
    this.addAnnotationToPage(t, x);
    for (const E of e.comments || []) {
      const I = a.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: g,
        Contents: ae(E.content),
        T: ae(E.title || Se("normal.unknownUser")),
        M: ie.of(E.date || ""),
        C: Le(e.color || "#000000"),
        IRT: x,
        RT: z.of("R"),
        NM: ie.of(E.id),
        // 唯一标识
        Open: !1
      }), P = a.register(I);
      this.addAnnotationToPage(t, P);
    }
  }
}
function cd(n, e, t) {
  switch (n % 360) {
    case 0:
      return "1 0 0 1 0 0 cm";
    case 90:
      return `0 1 -1 0 ${t} 0 cm`;
    case 180:
      return `-1 0 0 -1 ${e} ${t} cm`;
    case 270:
      return `0 -1 1 0 0 ${e} cm`;
    default:
      return "1 0 0 1 0 0 cm";
  }
}
function ld(n, e, t) {
  const o = n % 360;
  return o === 90 || o === 270 ? [0, 0, t, e] : [0, 0, e, t];
}
class dd extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, [i, a, l, u] = Pe(e.konvaClientRect, r), d = l - i, h = u - a, p = [ee.of(i), ee.of(a), ee.of(l), ee.of(u)], g = r.pdfPageRotate || 0;
    let f;
    if (e.contentsObj?.image) {
      const b = e.contentsObj.image.replace(/^data:image\/png;base64,/, ""), w = await o.embedPng(b), x = ld(g, d, h), E = s.obj({
        Type: "XObject",
        Subtype: "Form",
        BBox: x,
        Resources: s.obj({
          XObject: {
            Im1: w.ref
          }
        })
      }), I = `q ${cd(g, d, h)} ${d} 0 0 ${h} 0 0 cm /Im1 Do Q`, P = ni.of(E, new TextEncoder().encode(I)), W = s.register(P);
      f = s.obj({
        N: W
      });
    }
    const S = {
      Type: z.of("Annot"),
      Subtype: z.of("Stamp"),
      Rect: p,
      NM: ie.of(e.id),
      Contents: ae(e.contentsObj?.text || ""),
      T: ae(this.getExportTitle(Se("normal.unknownUser"))),
      M: ie.of(e.date || ""),
      Open: !1,
      P: t.ref,
      F: ee.of(132),
      ...f ? { AP: f } : {}
    }, m = s.obj(S), v = s.register(m);
    this.addAnnotationToPage(t, v);
    for (const b of e.comments || []) {
      const w = s.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: p,
        Contents: ae(b.content),
        T: ae(b.title || Se("normal.unknownUser")),
        M: ie.of(b.date || ""),
        IRT: v,
        RT: z.of("R"),
        NM: ie.of(b.id),
        Open: !1
      }), x = s.register(w);
      this.addAnnotationToPage(t, x);
    }
  }
}
function ud(n, e, t, o, r = 10, s = 10) {
  const i = t - n, a = o - e, l = Math.hypot(i, a) || 1, u = i / l, d = a / l, h = -d, p = u, g = t - u * r + h * (s / 2), f = o - d * r + p * (s / 2), S = t - u * r - h * (s / 2), m = o - d * r - p * (s / 2);
  return [t, o, g, f, S, m, t, o];
}
class hd extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, i = JSON.parse(e.konvaString), a = i.children.filter((w) => w.className === "Arrow");
    if (a.length === 0) throw new Error(`Arrow annotation ${e.id} has no arrow shape.`);
    const l = s.obj(
      a.map((w) => {
        const x = w.attrs.points;
        if (!x || x.length < 4)
          throw new Error(`Arrow annotation ${e.id} needs at least two points.`);
        const E = [];
        for (let W = 0; W < x.length; W += 2) {
          const F = Ct({ x: x[W], y: x[W + 1] }, i), [D, A] = Mn(F, r);
          E.push(D, A);
        }
        const I = x.length, P = ud(
          x[I - 4],
          x[I - 3],
          x[I - 2],
          x[I - 1],
          typeof w.attrs.pointerLength == "number" ? w.attrs.pointerLength : 10,
          typeof w.attrs.pointerWidth == "number" ? w.attrs.pointerWidth : 10
        );
        for (let W = 0; W < P.length; W += 2) {
          const F = Ct({ x: P[W], y: P[W + 1] }, i), [D, A] = Mn(F, r);
          E.push(D, A);
        }
        return s.obj(E);
      })
    ), u = a[0]?.attrs || {}, d = u.strokeWidth ?? 1, h = u.opacity ?? 1, p = u.stroke ?? e.color ?? "rgb(255, 0, 0)", [g, f, S] = Le(p), m = s.obj({
      W: ee.of(d),
      S: z.of("S")
      // Solid border style
    }), v = s.obj({
      Type: z.of("Annot"),
      // Ink is intentional: the sampled arrowhead renders consistently in PDF viewers.
      Subtype: z.of("Ink"),
      InkLayerType: z.of("Arrow"),
      Rect: Pe(e.konvaClientRect, r),
      InkList: l,
      C: s.obj([ee.of(g), ee.of(f), ee.of(S)]),
      T: ae(this.getExportTitle(Se("normal.unknownUser"))),
      Contents: ae(e.contentsObj?.text || ""),
      M: ie.of(e.date || ""),
      NM: ie.of(e.id),
      BS: m,
      F: ee.of(4),
      P: t.ref,
      CA: ee.of(h)
      // Constant opacity for the Ink stroke.
    }), b = s.register(v);
    this.addAnnotationToPage(t, b);
    for (const w of e.comments || []) {
      const x = s.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: Pe(e.konvaClientRect, r),
        Contents: ae(w.content),
        T: ae(w.title || Se("normal.unknownUser")),
        M: ie.of(w.date || ""),
        C: s.obj([ee.of(g), ee.of(f), ee.of(S)]),
        IRT: b,
        RT: z.of("R"),
        NM: ie.of(w.id),
        Open: !1
      }), E = s.register(x);
      this.addAnnotationToPage(t, E);
    }
  }
}
function pd(n, e, t, o = 12) {
  const r = [];
  for (let s = 1; s <= o; s++) {
    const i = s / o, a = (1 - i) * (1 - i) * n[0] + 2 * (1 - i) * i * e[0] + i * i * t[0], l = (1 - i) * (1 - i) * n[1] + 2 * (1 - i) * i * e[1] + i * i * t[1];
    r.push(a, l);
  }
  return r;
}
function fd(n, e, t, o, r = 16) {
  const s = [];
  for (let i = 1; i <= r; i++) {
    const a = i / r, l = Math.pow(1 - a, 3) * n[0] + 3 * Math.pow(1 - a, 2) * a * e[0] + 3 * (1 - a) * a * a * t[0] + a * a * a * o[0], u = Math.pow(1 - a, 3) * n[1] + 3 * Math.pow(1 - a, 2) * a * e[1] + 3 * (1 - a) * a * a * t[1] + a * a * a * o[1];
    s.push(l, u);
  }
  return s;
}
function gd(n) {
  const e = n.match(/[a-zA-Z][^a-zA-Z]*/g) || [], t = [];
  let o = [0, 0];
  for (const r of e) {
    const s = r[0], i = r.slice(1).trim().split(/[\s,]+/).map(parseFloat);
    if (s === "M" && (o = [i[0], i[1]], t.push(...o)), s === "L")
      for (let a = 0; a < i.length; a += 2)
        o = [i[a], i[a + 1]], t.push(...o);
    if (s === "Q") {
      const a = o, l = [i[0], i[1]], u = [i[2], i[3]];
      t.push(...pd(a, l, u)), o = u;
    }
    if (s === "C") {
      const a = o, l = [i[0], i[1]], u = [i[2], i[3]], d = [i[4], i[5]];
      t.push(...fd(a, l, u, d)), o = d;
    }
  }
  return t;
}
class md extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, i = Tt(e.konvaString), a = (i.children ?? []).filter((F) => F.className === "Path"), { groupX: l, groupY: u, scaleX: d, scaleY: h } = this.extractGroupTransform(i), p = r.viewport, g = s.obj(
      a.map((F) => {
        const D = gd(F.attrs?.data ?? ""), A = [];
        for (let L = 0; L < D.length; L += 2) {
          const $ = l + D[L] * d, j = u + D[L + 1] * h, _ = $ * p.scale, O = j * p.scale, [Z, K] = p.convertToPdfPoint(_, O);
          A.push(Z, K);
        }
        return s.obj(A);
      })
    ), f = a[0]?.attrs ?? {}, S = f.strokeWidth ?? 1, m = f.opacity ?? 1, v = f.stroke ?? e.color ?? "rgb(255, 0, 0)", [b, w, x] = Le(v), E = s.obj({
      W: ee.of(S),
      S: z.of("S")
      // Solid border style
    }), I = Pe(e.konvaClientRect, r), P = s.obj({
      Type: z.of("Annot"),
      Subtype: z.of("Ink"),
      Rect: I,
      InkList: g,
      C: s.obj([ee.of(b), ee.of(w), ee.of(x)]),
      T: ae(this.getExportTitle(Se("normal.unknownUser"))),
      Contents: ae(e.contentsObj?.text || ""),
      M: ie.of(e.date || ""),
      NM: ie.of(e.id),
      Border: s.obj([0, 0, 0]),
      BS: E,
      F: ee.of(4),
      P: t.ref,
      CA: ee.of(m)
      // Non-stroking opacity (used for drawing)
    }), W = s.register(P);
    this.addAnnotationToPage(t, W);
    for (const F of e.comments || []) {
      const D = s.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: I,
        Contents: ae(F.content),
        T: ae(F.title || Se("normal.unknownUser")),
        M: ie.of(F.date || ""),
        C: s.obj([ee.of(b), ee.of(w), ee.of(x)]),
        IRT: W,
        RT: z.of("R"),
        NM: ie.of(F.id),
        Open: !1
      }), A = s.register(D);
      this.addAnnotationToPage(t, A);
    }
  }
}
function vd(n) {
  return (n.match(/[a-zA-Z][^a-zA-Z]*/g) ?? []).map((t) => ({
    type: t[0].toUpperCase(),
    values: t.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(Number)
  }));
}
function yd(n, e, t, o) {
  const r = 1 - o;
  return {
    x: r * r * n.x + 2 * r * o * e.x + o * o * t.x,
    y: r * r * n.y + 2 * r * o * e.y + o * o * t.y
  };
}
function bd(n, e, t, o, r) {
  const s = 1 - r;
  return {
    x: s ** 3 * n.x + 3 * s ** 2 * r * e.x + 3 * s * r ** 2 * t.x + r ** 3 * o.x,
    y: s ** 3 * n.y + 3 * s ** 2 * r * e.y + 3 * s * r ** 2 * t.y + r ** 3 * o.y
  };
}
function Sd(n) {
  const e = [];
  let t = null;
  return n.forEach((o) => {
    if (o.type === "M" && o.values.length >= 2) {
      t = { x: o.values[0], y: o.values[1] }, e.push(t);
      return;
    }
    if (o.type === "L" && o.values.length >= 2) {
      t = { x: o.values[0], y: o.values[1] }, e.push(t);
      return;
    }
    if (o.type === "Q" && t && o.values.length >= 4) {
      const r = t, s = { x: o.values[0], y: o.values[1] }, i = { x: o.values[2], y: o.values[3] };
      for (let a = 1; a <= 12; a++)
        e.push(yd(r, s, i, a / 12));
      t = i;
      return;
    }
    if (o.type === "C" && t && o.values.length >= 6) {
      const r = t, s = { x: o.values[0], y: o.values[1] }, i = { x: o.values[2], y: o.values[3] }, a = { x: o.values[4], y: o.values[5] };
      for (let l = 1; l <= 16; l++)
        e.push(bd(r, s, i, a, l / 16));
      t = a;
    }
  }), e;
}
class wd extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, i = JSON.parse(e.konvaString), a = i.children?.find((w) => w.className === "Path");
    if (!a?.attrs?.data) throw new Error(`Cloud annotation ${e.id} has no path data.`);
    const l = Sd(vd(a.attrs.data));
    if (l.length < 2) throw new Error(`Cloud annotation ${e.id} needs at least two points.`);
    const u = l.flatMap((w) => {
      const x = Ct(w, i);
      return Mn(x, r);
    }), d = a.attrs.strokeWidth ?? 2, h = a.attrs.opacity ?? 1, p = a.attrs.stroke ?? e.color ?? "#000000", [g, f, S] = Le(p), m = Pe(e.konvaClientRect, r), v = s.obj({
      Type: z.of("Annot"),
      Subtype: z.of("Ink"),
      InkLayerType: z.of("Cloud"),
      Rect: m,
      InkList: s.obj([u]),
      C: s.obj([g, f, S]),
      T: ae(this.getExportTitle(Se("normal.unknownUser"))),
      Contents: ae(e.contentsObj?.text || ""),
      M: ie.of(e.date || ""),
      NM: ie.of(e.id),
      Border: s.obj([0, 0, 0]),
      BS: s.obj({ W: d, S: z.of("S") }),
      F: ee.of(4),
      P: t.ref,
      CA: ee.of(h)
    }), b = s.register(v);
    this.addAnnotationToPage(t, b);
    for (const w of e.comments || []) {
      const x = s.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: m,
        Contents: ae(w.content),
        T: ae(w.title || Se("normal.unknownUser")),
        M: ie.of(w.date || ""),
        C: s.obj([g, f, S]),
        IRT: b,
        RT: z.of("R"),
        NM: ie.of(w.id),
        Open: !1
      });
      this.addAnnotationToPage(t, s.register(x));
    }
  }
}
const Cd = {
  [re.TEXT]: ed,
  [re.HIGHLIGHT]: td,
  [re.UNDERLINE]: nd,
  [re.STRIKEOUT]: od,
  [re.SQUARE]: rd,
  [re.CIRCLE]: id,
  [re.INK]: sd,
  [re.POLYLINE]: md,
  [re.FREETEXT]: ad,
  [re.STAMP]: dd,
  [re.LINE]: hd
  // 你可以在这里扩展其他类型的解析器
}, xd = /* @__PURE__ */ new Set([
  "/Text",
  "/FreeText",
  "/Line",
  "/Square",
  "/Circle",
  "/Polygon",
  "/PolyLine",
  "/Highlight",
  "/Underline",
  "/StrikeOut",
  "/Ink",
  "/Stamp",
  "/Popup"
]);
function dr(n) {
  return n.type === R.CLOUD ? wd : Cd[n.pdfjsType];
}
async function Td(n, e, t, o) {
  const r = dr(n);
  r ? await new r(t, e, n, o).parse() : console.warn("Unsupported annotation type:", n.pdfjsType);
}
function Ad(n, e) {
  const t = new ArrayBuffer(n.byteLength);
  new Uint8Array(t).set(n);
  const o = new Blob([t], { type: "application/pdf" });
  Io(o, `${e}.pdf`);
}
function kd(n, e) {
  const t = new Blob([n], { type: "application/octet-stream" });
  Io(t, `${e}.xlsx`);
}
function Ed(n) {
  for (const e of n.getPages()) {
    const t = z.of("Annots"), o = e.node.lookupMaybe(t, Ro);
    if (!o) continue;
    const r = o.asArray().filter((s) => {
      const a = n.context.lookupMaybe(s, xn)?.get(z.of("Subtype"))?.toString();
      return !a || !xd.has(a);
    });
    e.node.set(t, n.context.obj(r));
  }
}
async function Rd(n, e) {
  const t = n.pdfDocument;
  if (!t) throw new Error("Cannot export annotations before the PDF document is ready.");
  const o = await t.getData(), r = await _n.load(o), s = r.getPages(), i = e.map((a) => {
    if (!dr(a))
      throw new Error(`Unsupported annotation type: ${a.pdfjsType}`);
    const l = s[a.pageNumber - 1];
    if (!l) throw new Error(`Annotation ${a.id} references missing page ${a.pageNumber}.`);
    const u = n.getPageView(a.pageNumber - 1);
    if (!u?.viewport)
      throw new Error(`Page view ${a.pageNumber} is not ready for annotation export.`);
    return { annotation: a, page: l, pageView: u };
  });
  Ed(r);
  for (const { annotation: a, page: l, pageView: u } of i)
    await Td(a, l, r, u);
  return r.save();
}
async function ur(n, e, t) {
  const o = await Rd(n, e), r = t || `annotated_${Vo()}`;
  Ad(o, r);
}
function Pd(n) {
  const e = [], t = [...n].sort((i, a) => i.pageNumber !== a.pageNumber ? i.pageNumber - a.pageNumber : Vn(a.date) - Vn(i.date)), o = (i) => {
    const l = [...i.comments || []].reverse().find((u) => u.status !== void 0 && u.status !== null)?.status ?? at.None;
    return Te.t(`annotator:comment.status.${l.toLowerCase()}`);
  };
  let r = 1, s = 0;
  return t.forEach((i) => {
    const a = De.find((d) => d.type === i.type)?.name, l = Te.t(`annotator:tool.${a}`), u = mt(i.referenceNumber) ? `#${i.referenceNumber}` : `#${r}`;
    e.push({
      index: u,
      id: i.id,
      page: i.pageNumber,
      annotationType: l,
      recordType: Te.t("annotator:export.recordType.annotation"),
      author: i.title,
      content: i.contentsObj?.text || "",
      date: An(i.date, !0),
      status: o(i)
    }), s = 0, i.comments.forEach((d) => {
      s++, e.push({
        index: `${u}.${s}`,
        id: d.id,
        page: "",
        annotationType: "--",
        recordType: Te.t("annotator:export.recordType.reply"),
        author: d.title,
        content: d.content,
        date: An(d.date, !0),
        status: ""
      });
    }), r++;
  }), e;
}
async function hr(n, e, t) {
  const o = Pd(e), r = await import("exceljs"), s = new r.Workbook(), i = s.addWorksheet("sheet1");
  i.columns = [
    {
      key: "index",
      header: "#",
      width: 8,
      style: {
        alignment: { vertical: "middle" }
      }
    },
    {
      key: "id",
      header: Te.t("annotator:export.fields.id"),
      width: 20,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    },
    {
      key: "page",
      header: Te.t("annotator:export.fields.page"),
      width: 10,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    },
    {
      key: "annotationType",
      header: Te.t("annotator:export.fields.annotationType"),
      width: 18,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    },
    {
      key: "recordType",
      header: Te.t("annotator:export.fields.recordType"),
      width: 12,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    },
    {
      key: "author",
      header: Te.t("annotator:export.fields.author"),
      width: 16,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    },
    {
      key: "content",
      header: Te.t("annotator:export.fields.content"),
      width: 40,
      style: {
        alignment: {
          wrapText: !0,
          vertical: "top"
        }
      }
    },
    {
      key: "date",
      header: Te.t("annotator:export.fields.date"),
      width: 22,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    },
    {
      key: "status",
      header: Te.t("annotator:export.fields.status"),
      width: 14,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    }
  ], o.forEach((u) => {
    const d = i.addRow(u), h = u.recordType === Te.t("annotator:export.recordType.reply");
    d.font = {
      size: 12,
      color: { argb: h ? "389e0d" : "000000" }
    };
  }), i.getRow(1).eachCell((u) => {
    u.font = { bold: !0, size: 12 }, u.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D9E1F2" }
    };
  }), i.eachRow((u) => {
    u.eachCell((d) => {
      d.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } }
      };
    });
  });
  const a = await s.xlsx.writeBuffer(), l = t || `annotated_${Vo()}`;
  kd(a, l);
}
async function Nd(n, e, t) {
  if (t.has(e)) return t.get(e);
  const o = n.getPageView(e);
  if (!o?.pdfPage) return "";
  const s = (await o.pdfPage.getTextContent()).items.map((i) => "str" in i ? i.str : "").join("");
  return t.set(e, s), s;
}
function Id({ pdfViewer: n }) {
  const [e, t] = Y(""), [o, r] = Y([]), [s, i] = Y(!1), [a, l] = Y({
    caseSensitive: !1,
    entireWord: !1,
    matchDiacritics: !1
  }), u = B(/* @__PURE__ */ new Map()), d = B(a), h = B(0), p = B(null), g = X(() => {
    p.current?.(), p.current = null;
  }, []);
  ne(() => (u.current.clear(), () => {
    h.current += 1, g();
  }), [n, g]);
  const f = X(({ pageNumber: v, matchIndex: b }) => {
    if (!n || !e) return;
    const w = n.findController;
    if (!w || !n.pdfDocument) return;
    n.scrollPageIntoView({ pageNumber: v });
    const E = w;
    E._selected = { pageIdx: v - 1, matchIdx: b }, E._offset = { pageIdx: v - 1, matchIdx: b - 1, wrapped: !1 }, E._highlightMatches = !0, n.eventBus.dispatch("find", {
      type: "again",
      query: e,
      caseSensitive: a.caseSensitive,
      entireWord: a.entireWord,
      findPrevious: !1,
      matchDiacritics: a.matchDiacritics,
      highlightAll: !0
    });
  }, [n, e, a]), S = X(
    async (v, b) => {
      if (!n) return;
      const w = h.current + 1;
      h.current = w, g();
      const x = {
        ...d.current,
        ...b
      };
      d.current = x, i(!0), t(v), l(x);
      try {
        const E = await new Promise((I, P) => {
          const W = n.pagesCount;
          let F = 0;
          const D = 60, A = 200;
          let L = null, $ = !1, j = null;
          const _ = () => {
            L && (clearTimeout(L), L = null), n.eventBus.off("updatefindcontrolstate", k);
          }, O = (H) => {
            $ || ($ = !0, _(), I(H));
          }, Z = (H) => {
            $ || ($ = !0, _(), P(H));
          }, K = async () => {
            if ($ || w !== h.current) {
              O(null);
              return;
            }
            try {
              const H = j?._pageMatches;
              if (Array.isArray(H) && H.length === W) {
                const oe = [];
                for (let N = 0; N < H.length; N++) {
                  const q = H[N];
                  if (!q || q.length === 0) continue;
                  const te = await Nd(n, N, u.current);
                  if ($ || w !== h.current) {
                    O(null);
                    return;
                  }
                  const se = q.map((G, J) => {
                    const fe = Math.max(0, G - 5), xe = Math.min(te.length, G + v.length + 30);
                    return {
                      matchIndex: J,
                      charIndex: G,
                      snippet: te.slice(fe, xe)
                    };
                  });
                  oe.push({
                    pageNumber: N + 1,
                    countTotal: q.length,
                    matches: se
                  });
                }
                O({
                  query: v,
                  countTotal: j?._matchesCountTotal ?? 0,
                  pageMatches: oe
                });
              } else F < D ? (F += 1, L = setTimeout(() => {
                L = null, K();
              }, A)) : O({
                query: v,
                countTotal: 0,
                pageMatches: []
              });
            } catch (H) {
              Z(H);
            }
          }, k = ({ source: H, rawQuery: oe }) => {
            const N = Array.isArray(oe) ? oe.join("") : oe;
            N != null && N !== v || (j = H ?? null, L && (clearTimeout(L), L = null), K());
          };
          p.current = () => O(null), n.eventBus.on("updatefindcontrolstate", k), n.eventBus.dispatch("find", {
            type: "highlightallchange",
            query: v,
            caseSensitive: x.caseSensitive ?? !1,
            entireWord: x.entireWord ?? !1,
            findPrevious: !1,
            matchDiacritics: x.matchDiacritics ?? !1,
            highlightAll: !0
          });
        });
        E && w === h.current && r([E]);
      } catch (E) {
        console.error(E), w === h.current && r([{ query: v, countTotal: 0, pageMatches: [] }]);
      } finally {
        w === h.current && (p.current = null, i(!1));
      }
    },
    [n, g]
  ), m = X(() => {
    h.current += 1, g(), n?.eventBus.dispatch("find", { query: "" }), t(""), r([]), i(!1);
  }, [n, g]);
  return { query: e, setQuery: t, results: o, searching: s, search: S, clearSearch: m, jumpToMatch: f, searchOptions: a };
}
function Md(n, e, t) {
  if (!e) return [{ text: n, highlighted: !1 }];
  const o = e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), r = new RegExp(
    `(${o})`,
    t ? "g" : "gi"
  ), s = new RegExp(
    `^${o}$`,
    t ? "" : "i"
  );
  return n.split(r).map((i) => ({
    text: i,
    highlighted: s.test(i)
  }));
}
const Dd = ({ text: n, query: e, caseSensitive: t }) => /* @__PURE__ */ c(ve, { children: Md(n, e, t).map(
  (o, r) => o.highlighted ? /* @__PURE__ */ c("mark", { style: { backgroundColor: "rgba(255, 255, 0, 0.2)", padding: "0 2px" }, children: o.text }, `${r}-${o.text}`) : o.text
) }), pr = ({ pdfViewer: n }) => {
  const { query: e, setQuery: t, results: o, searching: r, search: s, clearSearch: i, jumpToMatch: a } = Id({ pdfViewer: n }), { t: l } = ye("viewer", { useSuspense: !1 }), [u, d] = Y({
    caseSensitive: !1,
    entireWord: !1
  }), [h, p] = Y(null), g = B({}), f = B(o), S = B(e);
  S.current = e;
  const m = X(
    (A) => {
      A.trim() && n && (i(), p(null), s(A.trim(), {
        caseSensitive: u.caseSensitive,
        entireWord: u.entireWord
      }));
    },
    [n, s, i, u]
  ), v = X(
    (A) => {
      switch (A.key) {
        case "Escape":
          (o.length > 0 || e.trim() !== "") && i();
          break;
        case "Enter":
          e.trim() === "" && o.length > 0 && i(), e.trim() && (i(), m(e));
          break;
      }
    },
    [e, o, i, m]
  ), b = X(
    (A, L) => {
      p({ pageNumber: A, matchIndex: L }), a({
        pageNumber: A,
        matchIndex: L
      });
    },
    [a]
  ), w = X((A, L) => {
    d(($) => ({
      ...$,
      [A]: L
    }));
  }, []), x = X(() => {
    const A = [];
    return o.forEach((L) => {
      L.pageMatches.forEach(($) => {
        $.matches.forEach((j) => {
          A.push({
            pageNumber: $.pageNumber,
            matchIndex: j.matchIndex,
            query: L.query
          });
        });
      });
    }), A;
  }, [o]), E = X((A, L) => {
    const $ = g.current[`${A}-${L}`];
    $ && $.scrollIntoView({
      block: "center",
      inline: "center"
    });
  }, []), I = X(() => h ? x().findIndex((L) => L.pageNumber === h.pageNumber && L.matchIndex === h.matchIndex) : -1, [h, x]), P = X(() => {
    if (!o.length) return;
    const A = x();
    if (!A.length) return;
    let L = 0;
    h && (L = (I() + 1) % A.length);
    const $ = A[L];
    p({
      pageNumber: $.pageNumber,
      matchIndex: $.matchIndex
    }), a({
      pageNumber: $.pageNumber,
      matchIndex: $.matchIndex
    }), E($.pageNumber, $.matchIndex);
  }, [o, h, x, I, a, E]), W = X(() => {
    if (!o.length) return;
    const A = x();
    if (!A.length) return;
    let L = A.length - 1;
    h && (L = (I() - 1 + A.length) % A.length);
    const $ = A[L];
    p({
      pageNumber: $.pageNumber,
      matchIndex: $.matchIndex
    }), a({
      pageNumber: $.pageNumber,
      matchIndex: $.matchIndex
    }), E($.pageNumber, $.matchIndex);
  }, [o, h, x, I, a, E]);
  ne(() => {
    f.current = o;
  }, [o]), ne(() => {
    const A = S.current.trim();
    A && m(A);
  }, [u, m]), ne(() => () => {
    f.current.length > 0 && i(), p(null), t("");
  }, [i, t]);
  const F = () => !o.length || r ? null : o.map((A) => /* @__PURE__ */ T(lt, { children: [
    /* @__PURE__ */ T(
      Q,
      {
        pb: "2",
        justify: "between",
        align: "center",
        style: { position: "sticky", top: 89, backgroundColor: "var(--bg-color-tertiary)", zIndex: 1 },
        children: [
          /* @__PURE__ */ c(de, { size: "2", children: l("viewer:search.resultTotal", {
            total: A.countTotal
          }) }),
          A.countTotal > 0 && /* @__PURE__ */ T("div", { children: [
            /* @__PURE__ */ c(tt, { onClick: W, variant: "soft", color: "gray", size: "1", mr: "1", children: /* @__PURE__ */ c(xo, {}) }),
            /* @__PURE__ */ c(tt, { onClick: P, variant: "soft", color: "gray", size: "1", mr: "1", children: /* @__PURE__ */ c(To, {}) })
          ] })
        ]
      }
    ),
    A.pageMatches.map((L) => /* @__PURE__ */ T(lt, { mt: "1", mb: "3", pl: "2", children: [
      /* @__PURE__ */ T(de, { size: "2", children: [
        l("viewer:search.page", { value: L.pageNumber }),
        " (",
        L.countTotal,
        ")"
      ] }),
      L.matches.map(($) => {
        const j = h && h.pageNumber === L.pageNumber && h.matchIndex === $.matchIndex, _ = `${L.pageNumber}-${$.matchIndex}`;
        return /* @__PURE__ */ c(lt, { mt: "2", pl: "0", children: /* @__PURE__ */ c(
          be,
          {
            ref: (O) => g.current[_] = O,
            variant: j ? "soft" : "outline",
            color: j ? void 0 : "gray",
            type: "button",
            onClick: () => b(L.pageNumber, $.matchIndex),
            style: {
              width: "100%",
              textAlign: "left",
              justifyContent: "flex-start"
            },
            children: /* @__PURE__ */ c(de, { truncate: !0, children: /* @__PURE__ */ c(
              Dd,
              {
                text: $.snippet,
                query: A.query,
                caseSensitive: u.caseSensitive
              }
            ) })
          }
        ) }, $.matchIndex);
      })
    ] }, L.pageNumber))
  ] }, A.query)), D = ke(() => r ? /* @__PURE__ */ T(Q, { mt: "2", align: "center", gap: "2", children: [
    /* @__PURE__ */ c(wo, {}),
    /* @__PURE__ */ c(de, { size: "2", children: l("viewer:search.searching") })
  ] }) : null, [r, l]);
  return /* @__PURE__ */ T(lt, { p: "2", pt: "0", children: [
    /* @__PURE__ */ T(Q, { direction: "column", style: { position: "sticky", top: 0, backgroundColor: "var(--bg-color-tertiary)", zIndex: 1 }, children: [
      /* @__PURE__ */ T(
        kt.Root,
        {
          placeholder: l("viewer:search.placeholder"),
          value: e,
          onChange: (A) => t(A.currentTarget.value),
          onKeyDown: v,
          "aria-label": l("viewer:search.placeholder"),
          mt: "3",
          children: [
            /* @__PURE__ */ c(kt.Slot, { children: /* @__PURE__ */ c(Ln, {}) }),
            /* @__PURE__ */ c(kt.Slot, { children: e.trim() && /* @__PURE__ */ c(
              tt,
              {
                size: "1",
                variant: "ghost",
                onClick: () => {
                  t(""), o.length > 0 && (i(), p(null));
                },
                children: /* @__PURE__ */ c(Zr, {})
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ T(Q, { mt: "2", align: "center", gap: "2", children: [
        /* @__PURE__ */ c(de, { as: "label", size: "2", children: /* @__PURE__ */ T(Q, { gap: "2", children: [
          /* @__PURE__ */ c(
            Xt,
            {
              checked: u.caseSensitive,
              onCheckedChange: (A) => w("caseSensitive", !!A),
              "aria-label": l("viewer:search.caseSensitive")
            }
          ),
          l("viewer:search.caseSensitive")
        ] }) }),
        /* @__PURE__ */ c(de, { as: "label", size: "2", children: /* @__PURE__ */ T(Q, { gap: "2", children: [
          /* @__PURE__ */ c(
            Xt,
            {
              checked: u.entireWord,
              onCheckedChange: (A) => w("entireWord", !!A),
              "aria-label": l("viewer:search.entireWord")
            }
          ),
          l("viewer:search.entireWord")
        ] }) })
      ] }),
      /* @__PURE__ */ c(nt, { my: "2", size: "4" })
    ] }),
    D,
    F()
  ] });
}, fr = () => {
  const [n, e] = Y(() => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  return ne(() => {
    const t = window.matchMedia("(prefers-color-scheme: dark)"), o = (r) => {
      e(r.matches ? "dark" : "light");
    };
    return t.addEventListener ? t.addEventListener("change", o) : t.addListener(o), () => {
      t.removeEventListener ? t.removeEventListener("change", o) : t.removeListener(o);
    };
  }, []), n;
}, Ld = () => /* @__PURE__ */ T(Q, { align: "center", gap: "2", "data-inklayer-page-zoom-control": "true", children: [
  /* @__PURE__ */ c(Lo, { persistent: !0 }),
  /* @__PURE__ */ c(nt, { orientation: "vertical" }),
  /* @__PURE__ */ c(Qt, {})
] }), vo = "search-sidebar", yo = "annotator-sidebar-toggle", _d = ({
  Chrome: n,
  onSave: e,
  enableNativeAnnotations: t,
  searchAvailable: o
}) => {
  const { painter: r, requestWrite: s } = ot(), i = le((v) => v.currentAnnotationType), {
    activeSidebarPanel: a,
    closeSidebar: l,
    openSidebar: u,
    isNavigationSidebarOpen: d,
    toggleNavigationSidebar: h,
    pdfViewer: p
  } = Fe(), g = r?.can("annotation.create") ?? !1, f = !!s;
  ne(() => {
    g || f || i && i.type !== R.SELECT && r?.activate(null, null);
  }, [g, f, i, r]), ne(() => () => {
    r?.activate(null, null);
  }, [r]);
  const S = (v) => {
    a === v ? l() : u(v);
  }, m = {
    save: () => {
      r && e?.(Ot(r.getData()));
    },
    getAnnotations: () => Ot(r?.getData() ?? []),
    replaceAnnotations: async (v) => {
      r && await r.replaceAnnotations(qo(v), t);
    },
    exportToExcel: (v) => {
      r && p && hr(p, r.getData(), v);
    },
    exportToPdf: (v) => {
      r && p && ur(p, r.getData(), v);
    }
  };
  return /* @__PURE__ */ c(
    n,
    {
      activeTool: Gn(i?.type),
      canCreate: g,
      canRequestWrite: f,
      ToolControl: Nn,
      ColorControl: ar,
      AuthorLabelsControl: cr,
      PageZoomControl: Ld,
      history: r?.getHistory(),
      panels: {
        navigation: {
          open: d,
          toggle: h
        },
        search: {
          open: a === vo,
          available: o,
          toggle: () => S(vo)
        },
        annotations: {
          open: a === yo,
          toggle: () => S(yo)
        }
      },
      actions: m
    }
  );
}, Od = "_positionedTextLayer_133az_1", Hd = "_positionedTextSpan_133az_11", Gd = "_positionedTextContent_133az_25", Ud = "_positionedTextSearchHit_133az_29", zd = "_positionedTextBlock_133az_35", Ht = {
  positionedTextLayer: Od,
  positionedTextSpan: Hd,
  positionedTextContent: Gd,
  positionedTextSearchHit: Ud,
  positionedTextBlock: zd
}, bo = 1, Fd = ({ source: n, searchHit: e }) => {
  const { pdfViewer: t, eventBus: o, viewerContainerRef: r, isReady: s } = Fe(), [i, a] = Y([]), [l, u] = Y(/* @__PURE__ */ new Map()), [, d] = Y(0), h = B(/* @__PURE__ */ new Set()), p = B(0), g = X(() => {
    if (!t || !r.current) return [];
    const m = Math.min(n.pageCount, t.pagesCount);
    if (m <= 0) return [];
    const v = r.current.getBoundingClientRect(), b = v.width > 0 && v.height > 0, w = /* @__PURE__ */ new Set();
    for (let E = 0; E < m; E += 1) {
      const P = t.getPageView(E)?.div?.getBoundingClientRect();
      !P || P.width <= 0 || P.height <= 0 || b && P.bottom >= v.top && P.top <= v.bottom && w.add(E + 1);
    }
    if (w.size === 0) {
      const E = Math.max(1, Math.min(m, t.currentPageNumber || 1));
      w.add(E);
    }
    const x = /* @__PURE__ */ new Set();
    return w.forEach((E) => {
      for (let I = -bo; I <= bo; I += 1) {
        const P = E + I;
        P >= 1 && P <= m && x.add(P);
      }
    }), [...x].sort((E, I) => E - I);
  }, [t, n.pageCount, r]), f = X(() => {
    a(g());
  }, [g]);
  ne(() => {
    if (p.current += 1, h.current.clear(), u(/* @__PURE__ */ new Map()), a([]), !t || !o || !s) return;
    f();
    const m = () => f(), v = () => {
      f(), d((E) => E + 1);
    }, b = [0, 50, 200, 500].map((E) => window.setTimeout(m, E)), w = r.current, x = typeof ResizeObserver > "u" || !w ? null : new ResizeObserver(m);
    return w && (x?.observe(w), w.addEventListener("scroll", m, { passive: !0 })), o.on("pagesloaded", m), o.on("pagerendered", v), o.on("updateviewarea", m), o.on("scalechanging", m), o.on("rotationchanging", m), () => {
      b.forEach((E) => window.clearTimeout(E)), x?.disconnect(), w?.removeEventListener("scroll", m), o.off("pagesloaded", m), o.off("pagerendered", v), o.off("updateviewarea", m), o.off("scalechanging", m), o.off("rotationchanging", m);
    };
  }, [o, s, t, f, n, r]), ne(() => {
    if (!t || !i.length) return;
    const m = p.current;
    let v = !1;
    return i.forEach((b) => {
      l.has(b) || h.current.has(b) || (h.current.add(b), n.getPage(b).then((w) => {
        h.current.delete(b), !(v || p.current !== m || !w) && u((x) => {
          const E = new Map(x);
          return E.set(b, w), E;
        });
      }).catch(() => {
        h.current.delete(b);
      }));
    }), () => {
      v = !0;
    };
  }, [l, t, n, i]);
  const S = t ? i.flatMap((m) => {
    const v = t.getPageView(m - 1), b = l.get(m);
    if (!v?.div || !b) return [];
    const w = v.viewport;
    return !w || ![w.width, w.height, b.dimensions.width, b.dimensions.height].every(Number.isFinite) || w.width <= 0 || w.height <= 0 || b.dimensions.width <= 0 || b.dimensions.height <= 0 ? [] : [{
      pageNumber: m,
      host: jd(v.div, m, n.sourceKey),
      scaleX: w.width / b.dimensions.width,
      scaleY: w.height / b.dimensions.height
    }];
  }) : [];
  return /* @__PURE__ */ c(ve, { children: S.map((m) => {
    const v = l.get(m.pageNumber);
    return v ? di(
      /* @__PURE__ */ T(ve, { children: [
        v.blocks?.map((b) => /* @__PURE__ */ c(
          Bd,
          {
            block: b,
            scaleX: m.scaleX,
            scaleY: m.scaleY
          },
          b.id
        )),
        v.spans.map((b) => /* @__PURE__ */ c(
          Wd,
          {
            span: b,
            pageNumber: m.pageNumber,
            sourceKey: n.sourceKey,
            searchHit: e,
            scaleX: m.scaleX,
            scaleY: m.scaleY
          },
          b.id
        ))
      ] }),
      m.host,
      `positioned-text-${m.pageNumber}`
    ) : null;
  }) });
};
function jd(n, e, t) {
  const o = n.querySelector(`:scope > [data-inklayer-positioned-text-page="${e}"]`);
  if (o)
    return t && (o.dataset.inklayerPositionedTextSourceKey = t), o;
  const r = document.createElement("div");
  return r.className = Ht.positionedTextLayer, r.dataset.inklayerPositionedTextPage = String(e), t && (r.dataset.inklayerPositionedTextSourceKey = t), n.append(r), r;
}
function Bd({
  block: n,
  scaleX: e,
  scaleY: t
}) {
  const o = Yd(n.geometry, e, t);
  return o ? /* @__PURE__ */ c(
    "div",
    {
      className: Ht.positionedTextBlock,
      "data-inklayer-positioned-text-block": n.id,
      "data-inklayer-positioned-text-block-id": n.blockId,
      "data-inklayer-positioned-text-block-kind": n.kind,
      "aria-hidden": "true",
      style: o
    }
  ) : null;
}
function Wd({
  span: n,
  pageNumber: e,
  sourceKey: t,
  searchHit: o,
  scaleX: r,
  scaleY: s
}) {
  const { geometry: i } = n, a = $d(i, r, s), l = B(null);
  if (Qe(() => {
    const d = l.current, h = typeof a?.width == "number" ? a.width : 0, p = typeof a?.height == "number" ? a.height : 0;
    if (!d || h <= 0 || p <= 0) return;
    const g = () => {
      d.style.fontSize = `${p}px`, d.style.lineHeight = `${p}px`;
      const S = d.offsetWidth;
      if (!Number.isFinite(S) || S <= 0) return;
      const m = p * h / S;
      d.style.fontSize = `${m}px`, d.dataset.inklayerPositionedTextFontSize = String(m);
    };
    g();
    let f = !0;
    return document.fonts?.ready.then(() => {
      f && g();
    }), () => {
      f = !1;
    };
  }, [n.text, a?.height, a?.width]), !a || !n.text.trim()) return null;
  const u = Vd(n, t, o);
  return /* @__PURE__ */ c(
    "span",
    {
      className: Ht.positionedTextSpan,
      "data-inklayer-positioned-text-id": n.id,
      "data-inklayer-positioned-text-page": e,
      "data-inklayer-positioned-text-source-key": t,
      "data-inklayer-positioned-text-block-id": n.blockId,
      "data-inklayer-positioned-text-span-id": n.spanId,
      "data-inklayer-positioned-text-logical-start": n.logicalRange?.start,
      "data-inklayer-positioned-text-logical-end": n.logicalRange?.end,
      style: a,
      children: /* @__PURE__ */ c("span", { ref: l, className: Ht.positionedTextContent, children: u ? /* @__PURE__ */ T(ve, { children: [
        n.text.slice(0, u.start),
        /* @__PURE__ */ c(
          "mark",
          {
            className: Ht.positionedTextSearchHit,
            "data-inklayer-positioned-text-search-hit": "active",
            children: n.text.slice(u.start, u.end)
          }
        ),
        n.text.slice(u.end)
      ] }) : n.text })
    }
  );
}
function Vd(n, e, t) {
  const o = n.logicalRange;
  if (!e || !t || t.sourceKey !== e || !o || ![o.start, o.end, t.range.start, t.range.end].every(Number.isInteger) || o.start < 0 || o.end <= o.start || t.range.start < 0 || t.range.end <= t.range.start || o.end - o.start !== n.text.length) return null;
  const r = Math.max(o.start, t.range.start), s = Math.min(o.end, t.range.end);
  return s <= r ? null : {
    start: r - o.start,
    end: s - o.start
  };
}
function $d(n, e, t) {
  const o = gr(n, e, t);
  if (!o) return null;
  const r = typeof o.height == "number" ? o.height : 0;
  return {
    ...o,
    fontSize: Math.max(1, r),
    lineHeight: `${Math.max(1, r)}px`,
    zIndex: 1
  };
}
function Yd(n, e, t) {
  const o = gr(n, e, t);
  return o ? {
    ...o,
    boxSizing: "border-box",
    border: "1px solid rgba(37, 99, 235, 0.95)",
    backgroundColor: "rgba(37, 99, 235, 0.04)",
    pointerEvents: "none",
    zIndex: 0
  } : null;
}
function gr(n, e, t) {
  const o = n.kind === "bbox" ? [
    { x: n.x, y: n.y },
    { x: n.x + n.width, y: n.y },
    { x: n.x + n.width, y: n.y + n.height },
    { x: n.x, y: n.y + n.height }
  ] : n.points;
  if (o.length < 4 || !o.slice(0, 4).every((p) => Number.isFinite(p.x) && Number.isFinite(p.y)))
    return null;
  const [r, s, , i] = o, a = Math.hypot(s.x - r.x, s.y - r.y), l = Math.hypot(i.x - r.x, i.y - r.y);
  if (![a, l, e, t].every(Number.isFinite) || a <= 0 || l <= 0 || e <= 0 || t <= 0) return null;
  const u = a * e, d = l * t, h = [
    (s.x - r.x) * e / u,
    (s.y - r.y) * t / u,
    (i.x - r.x) * e / d,
    (i.y - r.y) * t / d,
    0,
    0
  ];
  return {
    left: r.x * e,
    top: r.y * t,
    width: u,
    height: d,
    transformOrigin: "0 0",
    transform: `matrix(${h.join(",")})`
  };
}
const bu = ({
  appearance: n = "auto",
  enableRange: e = "auto",
  theme: t = "violet",
  title: o = "PDF ANNOTATOR",
  data: r,
  url: s,
  locale: i = "zh-CN",
  pdfjsOptions: a,
  user: l = { id: "null", name: "unknown" },
  annotationPermissions: u,
  requestWrite: d,
  defaultShowAnnotationAuthorLabels: h = !1,
  defaultOptions: p,
  initialScale: g,
  enableNativeAnnotations: f = !1,
  initialAnnotations: S = [],
  defaultShowAnnotationsSidebar: m = !1,
  onSave: v,
  onLoad: b,
  onAnnotationAdded: w,
  onAnnotationDeleted: x,
  onAnnotationSelected: E,
  onAnnotationUpdated: I,
  layoutStyle: P,
  actions: W,
  chrome: F,
  searchAvailable: D = !0,
  positionedTextSource: A,
  positionedTextSearchHit: L
}) => {
  const $ = ke(
    () => qo(S),
    [S]
  ), j = ke(
    () => ({ textLayerMode: A ? 0 : 1, annotationMode: 0, externalLinkTarget: 0, enableRange: e, pdfjsOptions: a }),
    [e, a, A]
  ), { t: _ } = ye(["annotator", "common"], { useSuspense: !1 }), O = ke(() => rr(Qc, p || {}), [p]), [Z, K] = Y(() => so()), k = fr(), H = n === "auto" ? k : n;
  ne(() => {
    const N = setTimeout(() => {
      const q = so();
      K(q);
    }, 0);
    return () => clearTimeout(N);
  }, []), ne(() => {
    Te.changeLanguage(i);
  }, [i]);
  const oe = () => {
    const { painter: N } = ot(), { pdfViewer: q } = Fe(), te = () => {
      if (N) {
        const J = N.getData();
        v?.(Ot(J));
      }
    }, se = async (J) => {
      if (N && q) {
        const ce = N.getData();
        await ur(q, ce, J);
      }
    }, G = async (J) => {
      if (N && q) {
        const ce = N.getData();
        await hr(q, ce, J);
      }
    };
    return W ? typeof W == "function" ? /* @__PURE__ */ c(
      W,
      {
        save: te,
        getAnnotations: () => Ot(N?.getData() || []),
        exportToExcel: (ce) => {
          G(ce);
        },
        exportToPdf: (ce) => {
          se(ce);
        }
      }
    ) : Pt.cloneElement(W, {
      save: te,
      getAnnotations: () => Ot(N?.getData() || []),
      exportToExcel: (J) => {
        G(J);
      },
      exportToPdf: (J) => {
        se(J);
      }
    }) : /* @__PURE__ */ T(ve, { children: [
      /* @__PURE__ */ c(nt, { orientation: "vertical" }),
      /* @__PURE__ */ T(me.Root, { children: [
        /* @__PURE__ */ c(me.Trigger, { children: /* @__PURE__ */ T(be, { variant: "soft", children: [
          _("common:export"),
          /* @__PURE__ */ c(me.TriggerIcon, {})
        ] }) }),
        /* @__PURE__ */ T(me.Content, { children: [
          /* @__PURE__ */ T(me.Item, { onClick: () => se(), children: [
            _("common:export"),
            " PDF"
          ] }),
          /* @__PURE__ */ T(me.Item, { onClick: () => G(), children: [
            _("common:export"),
            " Excel"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ T(be, { onClick: te, children: [
        /* @__PURE__ */ c(Qr, {}),
        _("common:save")
      ] })
    ] });
  };
  return /* @__PURE__ */ c(Co, { accentColor: t, appearance: H, children: /* @__PURE__ */ c(el, { requestWrite: d, children: /* @__PURE__ */ c(
    or.Provider,
    {
      value: {
        defaultOptions: O,
        primaryColor: Z
      },
      children: /* @__PURE__ */ T(
        Go,
        {
          title: o,
          url: s,
          data: r,
          initialScale: g,
          user: l,
          ...j,
          toolbar: F ? void 0 : /* @__PURE__ */ c(Zc, { defaultAnnotationName: "" }),
          hideHeader: !!F,
          hidePageIndicator: !!F,
          defaultActiveSidebarKey: m ? "annotator-sidebar-toggle" : null,
          sidebar: [
            {
              key: "search-sidebar",
              title: _("viewer:search.search"),
              icon: /* @__PURE__ */ c(Ln, { style: { width: 18, height: 18 } }),
              render: (N) => /* @__PURE__ */ c(pr, { pdfViewer: N.pdfViewer })
            },
            {
              title: _("annotator:sidebar.toggle"),
              key: "annotator-sidebar-toggle",
              icon: /* @__PURE__ */ c(jo, { style: { width: 18, height: 18 } }),
              render: () => /* @__PURE__ */ c(Ql, {})
            }
          ],
          actions: F ? void 0 : /* @__PURE__ */ c(oe, {}),
          style: P,
          children: [
            A && /* @__PURE__ */ c(
              Fd,
              {
                source: A,
                searchHit: L
              }
            ),
            F ? /* @__PURE__ */ c(
              _d,
              {
                Chrome: F,
                onSave: v,
                enableNativeAnnotations: f,
                searchAvailable: D
              }
            ) : null,
            /* @__PURE__ */ c(
              Ac,
              {
                onLoad: () => {
                  b?.();
                },
                onAnnotationAdd: (N) => w?.(_t(N)),
                onAnnotationDelete: (N) => {
                  x?.(N);
                },
                onAnnotationSelected: (N, q) => E?.(N ? _t(N) : null, q),
                onAnnotationChanged: (N) => I?.(_t(N)),
                enableNativeAnnotations: f,
                annotations: $,
                positionedTextSource: A,
                annotationPermissions: u,
                defaultShowAnnotationAuthorLabels: h
              }
            )
          ]
        }
      )
    }
  ) }) });
}, Kd = ({
  onDocumentLoaded: n,
  onEventBusReady: e
}) => {
  const { isReady: t, pdfViewer: o, eventBus: r, isSidebarCollapsed: s } = Fe();
  return ne(() => {
    if (!t || !o || !r) return;
    e?.(r);
    const i = async () => {
      n?.(o);
    };
    return o.pdfDocument ? i() : r.on("documentloaded", i), () => {
      r.off("documentloaded", i);
    };
  }, [t, o, r, n, e]), ne(() => {
    r && o && r.dispatch("updateviewarea", { pdfViewer: o });
  }, [s, r, o]), /* @__PURE__ */ c(ve, {});
}, Xd = () => {
  const { t: n } = ye("common", { useSuspense: !1 }), { pdfDocument: e } = Fe(), { printClean: t } = Oo(e);
  return /* @__PURE__ */ c(Rt, { content: n("common:print"), children: /* @__PURE__ */ c(
    be,
    {
      variant: "outline",
      size: "2",
      color: "gray",
      highContrast: !0,
      style: {
        boxShadow: "none"
      },
      onClick: () => t(),
      children: /* @__PURE__ */ c(ei, { style: { width: 18, height: 18 } })
    }
  ) });
}, qd = ({ actions: n }) => {
  const e = Fe();
  return n ? typeof n == "function" ? n(e) : n : /* @__PURE__ */ c(ve, { children: /* @__PURE__ */ c(Q, { gap: "3", align: "center", children: /* @__PURE__ */ c(Xd, {}) }) });
}, Jd = ({ toolbar: n }) => {
  const e = Fe();
  return n ? typeof n == "function" ? /* @__PURE__ */ T(Q, { gap: "3", align: "center", children: [
    /* @__PURE__ */ c(Qt, {}),
    /* @__PURE__ */ c(nt, { orientation: "vertical" }),
    n(e)
  ] }) : n : /* @__PURE__ */ c(Q, { gap: "3", align: "center", children: /* @__PURE__ */ c(Qt, {}) });
}, Su = ({
  appearance: n = "auto",
  enableRange: e = "auto",
  title: t = "PDF VIEWER",
  url: o,
  data: r,
  locale: s = "zh-CN",
  pdfjsOptions: i,
  initialScale: a,
  layoutStyle: l,
  theme: u = "violet",
  actions: d,
  sidebar: h,
  toolbar: p,
  showTextLayer: g = !0,
  showAnnotations: f = !1,
  defaultActiveSidebarKey: S,
  onDocumentLoaded: m,
  onEventBusReady: v
}) => {
  const { t: b } = ye(["viewer"], { useSuspense: !1 }), w = ke(
    () => ({
      textLayerMode: g ? 1 : 0,
      annotationMode: f ? 1 : 0,
      externalLinkTarget: 0,
      enableRange: e,
      pdfjsOptions: i
    }),
    [g, f, e, i]
  );
  ne(() => {
    Te.changeLanguage(s);
  }, [s]);
  const x = fr();
  return /* @__PURE__ */ c(Co, { accentColor: u, appearance: n === "auto" ? x : n, children: /* @__PURE__ */ c(
    Go,
    {
      title: t,
      url: o,
      data: r,
      sidebar: [{
        key: "search-sidebar",
        title: b("viewer:search.search"),
        icon: /* @__PURE__ */ c(Ln, { style: { width: 18, height: 18 } }),
        render: (I) => /* @__PURE__ */ c(pr, { pdfViewer: I.pdfViewer })
      }, ...h || []],
      defaultActiveSidebarKey: S,
      toolbar: /* @__PURE__ */ c(Jd, { toolbar: p }),
      initialScale: a,
      ...w,
      style: l,
      actions: /* @__PURE__ */ c(qd, { actions: d }),
      children: /* @__PURE__ */ c(Kd, { onEventBusReady: v, onDocumentLoaded: m })
    }
  ) });
};
export {
  bu as PdfAnnotator,
  qn as PdfPositionedTextSelectionResolver,
  Su as PdfViewer
};
