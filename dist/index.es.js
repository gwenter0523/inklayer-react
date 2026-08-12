import { jsxs as C, Fragment as Ce, jsx as c } from "react/jsx-runtime";
import Pt, { useRef as $, useState as K, useCallback as q, useEffect as te, createContext as Qt, useContext as Ht, memo as fo, useMemo as ke, forwardRef as en, useImperativeHandle as Nn, useLayoutEffect as ct, useSyncExternalStore as lr, useId as dr, createElement as ur } from "react";
import * as hr from "pdfjs-dist/legacy/build/pdf.mjs";
import { AnnotationMode as pr, AnnotationEditorType as fr, getDocument as cn, PDFDataRangeTransport as gr } from "pdfjs-dist/legacy/build/pdf.mjs";
import { EventBus as mr, PDFLinkService as vr, DownloadManager as yr, PDFFindController as br, PDFViewer as Sr } from "pdfjs-dist/legacy/web/pdf_viewer.mjs";
import "pdfjs-dist/legacy/web/pdf_viewer.css";
import { useThemeContext as tn, Flex as Z, Spinner as go, Box as lt, Text as ae, Progress as wr, Callout as dt, Strong as Cr, IconButton as et, TextField as kt, Tabs as xt, Tooltip as Rt, Button as ye, Popover as xe, Card as Ar, Grid as Wt, Separator as tt, Slider as Gn, HoverCard as ln, DropdownMenu as me, Dialog as at, SegmentedControl as gt, Select as Re, CheckboxGroup as bt, TextArea as Tr, Badge as xr, Checkbox as Vt, Theme as mo } from "@radix-ui/themes";
import { useTranslation as ve, initReactI18next as kr } from "react-i18next";
import { AiOutlineWarning as Er, AiOutlineLeft as vo, AiOutlineRight as yo, AiOutlineArrowLeft as Rr, AiOutlineLine as Pr, AiOutlinePlus as Nr, AiOutlinePlusCircle as bo, AiOutlineImport as So, AiOutlineExclamationCircle as Ir, AiOutlineBold as Mr, AiOutlineItalic as Dr, AiOutlineUnderline as Lr, AiOutlineStrikethrough as Or, AiOutlineExclamation as _r, AiOutlineEllipsis as Un, AiOutlineFilter as Hr, AiOutlineMinusSquare as Gr, AiOutlineStop as Ur, AiOutlineCheckCircle as zr, AiOutlineMinusCircle as Fr, AiOutlineDislike as jr, AiOutlineLike as Wr, AiOutlineSearch as In, AiFillCloseCircle as Br, AiOutlineSave as $r, AiOutlinePrinter as Vr } from "react-icons/ai";
import { PDFDocument as Mn, PDFName as F, PDFHexString as wo, PDFArray as Co, PDFDict as Sn, PDFString as re, PDFRef as Yr, PDFNumber as Q, PDFRawStream as Kr } from "pdf-lib";
import { GoSidebarExpand as Xr, GoSidebarCollapse as qr } from "react-icons/go";
import M from "konva";
import { nanoid as Jr } from "nanoid";
import Te, { t as be } from "i18next";
import { computePosition as Bt, flip as Ao } from "@floating-ui/dom";
import { create as Zr } from "zustand";
import Qr from "web-highlighter";
import { HexColorPicker as ei } from "react-colorful";
import To from "dayjs";
import ti from "dayjs/plugin/customParseFormat.js";
import { saveAs as xo } from "file-saver";
const ni = new URL("pdf.worker.min.mjs", import.meta.url).href;
hr.GlobalWorkerOptions.workerSrc = ni;
function oi(o) {
  if (!(o instanceof Error)) return !1;
  const e = o.message.toLowerCase();
  return e.includes("range") || e.includes("content-length") || e.includes("unexpected server response") || e.includes("cors");
}
function ri(o, e) {
  const {
    url: t,
    data: n,
    enableRange: r = "auto",
    onLoadSuccess: s,
    onLoadError: i,
    onLoadEnd: a,
    onViewerInit: l,
    eventBus: u,
    textLayerMode: d = 1,
    annotationMode: h = pr.DISABLE,
    externalLinkTarget: f = 2,
    pdfjsOptions: p
  } = e, g = $(s), v = $(i), y = $(a), b = $(l);
  g.current = s, v.current = i, y.current = a, b.current = l;
  const S = $(null), A = $(null), T = $(null), E = $(null), O = $(0), [G, j] = K(!0), [W, L] = K(0), [k, N] = K(null), [z, H] = K(null), [I, V] = K(null), ee = q(() => {
    if (E.current && (E.current(), E.current = null), !o.current) throw new Error("PDF container not ready");
    const D = u || new mr();
    T.current = D;
    const J = new vr({ eventBus: D, externalLinkTarget: f }), de = new yr(), ce = new br({ linkService: J, eventBus: D }), _ = new Sr({
      container: o.current,
      eventBus: D,
      textLayerMode: d,
      annotationMode: h,
      annotationEditorMode: fr.DISABLE,
      linkService: J,
      downloadManager: de,
      findController: ce
    });
    return J.setViewer(_), S.current = _, A.current = J, E.current = () => {
      S.current && (S.current.cleanup(), S.current = null), A.current && (A.current = null), !u && T.current && (T.current = null);
    }, b.current?.(_), { bus: D, linkService: J, viewer: _ };
  }, [o, u, d, h, f]), X = q(async (D) => {
    const J = await fetch(D, { method: "HEAD" }), de = Number(J.headers.get("Content-Length"));
    if (isNaN(de)) throw new Error("Cannot get PDF length for range loading");
    class ce extends gr {
      async requestDataRange(ne, le) {
        const Ae = await (await fetch(D, { headers: { Range: `bytes=${ne}-${le - 1}` } })).arrayBuffer();
        this.onDataRange(ne, new Uint8Array(Ae));
      }
    }
    return new ce(de, null);
  }, []), x = q(
    async (D) => {
      if (n)
        return cn({
          ...p,
          data: n,
          disableRange: !0,
          disableStream: !0
        });
      if (t && D) {
        const J = await X(t);
        return cn({ ...p, range: J });
      } else {
        if (t)
          return cn({ ...p, url: t, disableRange: !0, disableStream: !0 });
        throw new Error("Either url or data must be provided");
      }
    },
    [t, X, n, p]
  ), P = $(null), Y = q(async () => {
    const D = O.current + 1;
    O.current = D;
    const J = () => O.current === D;
    if (!t && !n) {
      const ne = new Error("Either url or data must be provided");
      J() && (V(ne), j(!1), v.current?.(ne), y.current?.());
      return;
    }
    j(!0), L(0), V(null), N(null);
    let de = !1, ce = null, _ = null;
    try {
      _ = ee();
      const { linkService: ne, viewer: le } = _;
      if (r === !0 || r === "auto" ? (de = !0, ce = await x(!0)) : ce = await x(!1), !J()) {
        await ce.destroy();
        return;
      }
      P.current = ce, ce.onProgress = ({ loaded: Ve, total: He }) => {
        J() && He > 0 && L(Math.min(100, Math.round(Ve / He * 100)));
      };
      const Ae = await ce.promise;
      if (!J()) {
        await Ae.destroy();
        return;
      }
      N(Ae), ne.setDocument(Ae), le.setDocument(Ae);
      const Ze = await Ae.getMetadata();
      if (!J()) return;
      H(Ze), g.current?.(Ae);
    } catch (ne) {
      if (!J()) return;
      if (r === "auto" && de && oi(ne)) {
        console.warn("[PDF] Range failed, fallback to full loading"), await ce?.destroy(), P.current === ce && (P.current = null);
        try {
          if (!_)
            throw new Error("PDF viewer was not initialized");
          const le = await x(!1);
          if (ce = le, !J()) {
            await le.destroy();
            return;
          }
          P.current = le, le.onProgress = ({ loaded: He, total: je }) => {
            J() && je > 0 && L(Math.min(100, Math.round(He / je * 100)));
          };
          const fe = await le.promise;
          if (!J()) {
            await fe.destroy();
            return;
          }
          const { linkService: Ae, viewer: Ze } = _;
          N(fe), Ae.setDocument(fe), Ze.setDocument(fe);
          const Ve = await fe.getMetadata();
          if (!J()) return;
          H(Ve), g.current?.(fe);
          return;
        } catch (le) {
          if (!J()) return;
          V(le), v.current?.(le);
          return;
        }
      }
      V(ne), v.current?.(ne);
    } finally {
      J() && (j(!1), y.current?.());
    }
  }, [t, n, r, ee, x]);
  return te(() => (Y(), () => {
    O.current += 1, E.current && (E.current(), E.current = null), P.current && (P.current.destroy(), P.current = null);
  }), [Y]), {
    /** 是否加载中 */
    loading: G,
    /** 加载进度 */
    progress: W,
    /** PDF 文档对象 */
    pdfDocument: k,
    /** PDFViewer 实例 */
    pdfViewer: S.current,
    /** EventBus 引用 */
    eventBus: T.current,
    /** PDF 元数据 */
    metadata: z,
    /** 加载错误 */
    loadError: I
  };
}
const ko = Qt(null), Fe = () => {
  const o = Ht(ko);
  if (!o)
    throw new Error("usePdfViewerContext must be used within a PdfViewerProvider");
  return o;
}, Dn = Qt(null), Eo = () => {
  const o = Ht(Dn);
  if (!o)
    throw new Error("useUserContext must be used within a UserProvider");
  return o;
}, ii = "_InkLayerViewer_1ief7_1", si = "_viewerHeader_1ief7_91", ai = "_viewerBody_1ief7_130", ci = "_navigationSidebarTriggerIcon_1ief7_136", li = "_viewerWrapper_1ief7_142", di = "_viewerContainer_1ief7_150", ui = "_pdfjsViewerContainer_1ief7_167", hi = "_viewerSidebar_1ief7_197", pi = "_sidebarOverlay_1ief7_225", Ie = {
  InkLayerViewer: ii,
  viewerHeader: si,
  "viewerHeader-title": "_viewerHeader-title_1ief7_102",
  "viewerHeader-title-left": "_viewerHeader-title-left_1ief7_109",
  "viewerHeader-title-name": "_viewerHeader-title-name_1ief7_115",
  "viewerHeader-title-actions": "_viewerHeader-title-actions_1ief7_124",
  viewerBody: ai,
  navigationSidebarTriggerIcon: ci,
  viewerWrapper: li,
  viewerContainer: di,
  "viewerContainer-header": "_viewerContainer-header_1ief7_156",
  pdfjsViewerContainer: ui,
  viewerSidebar: hi,
  "viewerSidebar--hidden": "_viewerSidebar--hidden_1ief7_209",
  "viewerSidebar-container": "_viewerSidebar-container_1ief7_215",
  sidebarOverlay: pi
};
function fi(o, e) {
  const [t, n] = K(!1), r = $(null);
  return te(() => (o ? r.current = setTimeout(() => {
    n(!0);
  }, e) : (r.current && (clearTimeout(r.current), r.current = null), n(!1)), () => {
    r.current && (clearTimeout(r.current), r.current = null);
  }), [o, e]), t;
}
function gi(o, e) {
  const [t, n] = K(!1), [r, s] = K(o), i = $(null), a = $(o);
  return te(() => {
    o !== a.current && (a.current = o, s(o), t || n(!0), i.current && clearTimeout(i.current), i.current = setTimeout(() => {
      n(!1), i.current = null;
    }, e));
  }, [o, e, t]), {
    visible: t,
    value: r
  };
}
const mi = ({ loading: o, progress: e, loadingDelay: t = 500, progressHideDelay: n = 1500 }) => {
  const r = fi(o, t), s = gi(e, n), { t: i } = ve(["common"]), { appearance: a } = tn();
  return /* @__PURE__ */ C(Ce, { children: [
    r && /* @__PURE__ */ C(
      Z,
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
          /* @__PURE__ */ c(go, { size: "3" }),
          /* @__PURE__ */ c(lt, { mt: "4", children: /* @__PURE__ */ C(ae, { weight: "medium", style: { fontSize: "1.1em" }, children: [
            i("common:loading"),
            " ",
            e,
            "%"
          ] }) })
        ]
      }
    ),
    s.visible && /* @__PURE__ */ c(
      wr,
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
}, vi = ({ error: o }) => {
  const { t: e } = ve(["common"]);
  return /* @__PURE__ */ c(
    Z,
    {
      position: "absolute",
      inset: "0",
      style: { backgroundColor: "rgba(255, 255, 255, 0.9)", zIndex: 1e3 },
      align: "center",
      justify: "center",
      direction: "column",
      p: "4",
      children: /* @__PURE__ */ C(dt.Root, { color: "red", size: "3", children: [
        /* @__PURE__ */ c(dt.Icon, { children: /* @__PURE__ */ c(Er, {}) }),
        /* @__PURE__ */ C(dt.Text, { children: [
          /* @__PURE__ */ c(ae, { children: /* @__PURE__ */ C(Cr, { children: [
            e("common:error"),
            " ",
            o.name
          ] }) }),
          /* @__PURE__ */ c("br", {}),
          /* @__PURE__ */ c(ae, { children: o.message })
        ] })
      ] })
    }
  );
}, yi = 3e3, Ro = ({ persistent: o = !1 }) => {
  const { t: e } = ve(["viewer"], { useSuspense: !1 }), { pdfViewer: t, isReady: n } = Fe(), [r, s] = K(1), [i, a] = K(1), [l, u] = K("1"), [d, h] = K(!1), [f, p] = K(!1), [g, v] = K(!0), y = $(null), b = $({
    hovered: !1,
    inputFocused: !1
  }), S = q(() => {
    y.current && (window.clearTimeout(y.current), y.current = null);
  }, []), A = q(() => {
    S(), !(b.current.hovered || b.current.inputFocused) && (y.current = window.setTimeout(() => {
      y.current = null, v(!1);
    }, yi));
  }, [S]), T = q(() => {
    v(!0), o || A();
  }, [o, A]), E = q(() => {
    b.current.hovered = !0, S(), v(!0);
  }, [S]), O = q(() => {
    b.current.hovered = !1, A();
  }, [A]), G = q(() => {
    b.current.inputFocused = !0, S(), v(!0);
  }, [S]), j = q((x) => {
    x.currentTarget.select(), T();
  }, [T]), W = q((x) => {
    s(x), u(x.toString());
  }, []), L = q(
    (x) => !isNaN(x) && x >= 1 && x <= i,
    [i]
  ), k = q(
    (x) => {
      if (!(!t || !L(x))) {
        T(), h(!0);
        try {
          t.currentPageNumber = x, s(x), u(x.toString());
        } catch (P) {
          console.error("Error changing page:", P);
        } finally {
          h(!1);
        }
      }
    },
    [t, L, T]
  ), N = (x) => {
    T();
    const P = x.target.value;
    (P === "" || /^\d+$/.test(P)) && u(P);
  }, z = q(() => {
    T();
    const x = parseInt(l, 10);
    L(x) ? k(x) : u(r.toString());
  }, [l, r, k, L, T]), H = q(() => {
    T(), r > 1 && k(r - 1);
  }, [r, k, T]), I = q(() => {
    T(), r < i && k(r + 1);
  }, [r, i, k, T]);
  te(() => {
    if (!t) return;
    const x = ({ pageNumber: P }) => {
      W(P), h(!1), T();
    };
    if (n) {
      const P = t.currentPageNumber || 1, Y = t.pagesCount || 1;
      s(P), u(P.toString()), a(Y), p(!0), T();
    }
    return t.eventBus.on("pagechanging", x), () => {
      t.eventBus.off("pagechanging", x);
    };
  }, [t, n, W, T]), te(() => {
    o && (S(), v(!0));
  }, [S, o]), te(() => {
    if (!t?.container) return;
    const x = t.container, P = () => {
      T();
    };
    return x.addEventListener("scroll", P, { passive: !0 }), x.addEventListener("wheel", P, { passive: !0 }), () => {
      x.removeEventListener("scroll", P), x.removeEventListener("wheel", P);
    };
  }, [t, T]), te(() => S, [S]);
  const V = (x) => {
    x.key === "Enter" ? z() : x.key === "Escape" && u(r.toString());
  }, ee = () => {
    b.current.inputFocused = !1, z(), A();
  }, X = l === "" || L(parseInt(l, 10));
  return /* @__PURE__ */ c(
    lt,
    {
      position: o ? "static" : "absolute",
      bottom: "20px",
      left: "50%",
      "data-inklayer-page-indicator": "true",
      style: {
        transform: o ? void 0 : "translateX(-50%)",
        zIndex: 1e3,
        background: "var(--inklayer-page-indicator-background, rgba(60, 60, 60, 0.85))",
        color: "var(--inklayer-page-indicator-color, #fff)",
        borderRadius: "var(--inklayer-page-indicator-border-radius, 4px)",
        opacity: f && (o || g) ? 1 : 0,
        pointerEvents: f && (o || g) ? "auto" : "none",
        transition: "var(--inklayer-page-indicator-transition, opacity 0.3s ease)"
      },
      onMouseEnter: E,
      onMouseLeave: O,
      children: /* @__PURE__ */ C(Z, { gap: "2", align: "center", pt: "1", pl: "1", pr: "2", pb: "1", children: [
        /* @__PURE__ */ c(
          et,
          {
            style: {
              color: `var(--inklayer-page-indicator-button-color, ${r <= 1 || d ? "#aaa" : "#fff"})`,
              transition: "var(--inklayer-page-indicator-button-transition, background-color 0.2s ease)",
              cursor: "pointer"
            },
            color: "gray",
            variant: "soft",
            onClick: H,
            size: "1",
            disabled: r <= 1 || d,
            "aria-label": e("viewer:navigation.previousPage"),
            children: /* @__PURE__ */ c(vo, {})
          }
        ),
        /* @__PURE__ */ C(Z, { align: "center", gap: "1", pr: "2", children: [
          /* @__PURE__ */ c(
            kt.Root,
            {
              size: "1",
              value: l,
              onChange: N,
              onFocus: G,
              onBlur: ee,
              onDoubleClick: j,
              onKeyDown: V,
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
                borderColor: X ? void 0 : "red"
              }
            }
          ),
          /* @__PURE__ */ C(
            ae,
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
          et,
          {
            color: "gray",
            variant: "ghost",
            disabled: r >= i || d,
            onClick: I,
            size: "1",
            "aria-label": e("viewer:navigation.nextPage"),
            style: {
              color: `var(--inklayer-page-indicator-button-color, ${r >= i || d ? "#aaa" : "#fff"})`,
              transition: "var(--inklayer-page-indicator-button-transition, background-color 0.2s ease)",
              cursor: "pointer"
            },
            children: /* @__PURE__ */ c(yo, {})
          }
        )
      ] })
    }
  );
};
function bi(o) {
  for (const e of o.getPages()) {
    const t = F.of("Annots");
    e.node.has(t) && e.node.set(t, o.context.obj([]));
  }
}
async function zn(o, e = !1) {
  const t = await o.getData(), n = await Mn.load(t);
  return e && bi(n), n.save();
}
function Po(o) {
  const e = new ArrayBuffer(o.byteLength);
  return new Uint8Array(e).set(o), e;
}
function Si(o, e) {
  const t = new Blob([Po(o)], { type: "application/pdf" }), n = document.createElement("a");
  n.href = URL.createObjectURL(t), n.download = e, n.click(), URL.revokeObjectURL(n.href);
}
function wi(o) {
  const e = new Blob([Po(o)], { type: "application/pdf" }), t = URL.createObjectURL(e), n = document.createElement("iframe");
  n.style.position = "fixed", n.style.width = "0", n.style.height = "0", n.style.border = "none", n.src = t, document.body.appendChild(n), n.onload = () => {
    n.contentWindow?.focus(), n.contentWindow?.print(), setTimeout(() => {
      document.body.removeChild(n), URL.revokeObjectURL(t);
    }, 1e3);
  };
}
function No(o) {
  const e = q(
    async (n) => {
      if (!o) return;
      const r = await zn(o, !0), s = n || `file_${Date.now()}.pdf`;
      Si(r, s);
    },
    [o]
  ), t = q(async () => {
    if (!o) return;
    const n = await zn(o, !0);
    wi(n);
  }, [o]);
  return {
    downloadClean: e,
    printClean: t
  };
}
const Ci = (o, e, t) => {
  if (e === 1) return 1;
  const n = t.current;
  (n > 1 && e < 1 || n < 1 && e > 1) && (t.current = 1);
  const r = Math.floor(o * e * t.current * 100) / (100 * o);
  return t.current = e / r, r;
};
function Ai({
  pdfViewer: o,
  containerRef: e,
  minScale: t = 0.1,
  maxScale: n = 10
}) {
  const r = $(1), s = $(1), i = $(!1), a = $(null), l = q((d, h, f) => {
    const p = e.current;
    if (!p || !o) return;
    const v = o.currentScale / d - 1;
    if (v === 0) return;
    const { left: y, top: b } = p.getBoundingClientRect();
    p.scrollLeft += (h - y) * v, p.scrollTop += (f - b) * v;
  }, [e, o]), u = q((d, h, f, p, g) => {
    const v = Ci(d, h, g);
    if (v === 1) return;
    let y = Math.round(d * v * 100) / 100;
    y = Math.min(n, Math.max(t, y)), !(!o || !o.pdfDocument) && (o.currentScale = y, l(d, f, p));
  }, [l, n, t, o]);
  te(() => {
    const d = e.current;
    if (!d || !o) return;
    const h = (g) => {
      if (!g.ctrlKey && !g.metaKey) return;
      g.preventDefault();
      const v = Math.exp(-g.deltaY / 100), y = o.currentScale;
      u(
        y,
        v,
        g.clientX,
        g.clientY,
        r
      );
    }, f = (g) => {
      (g.key === "Control" || g.key === "Meta") && (i.current = !0);
    }, p = (g) => {
      (g.key === "Control" || g.key === "Meta") && (i.current = !1);
    };
    return d.addEventListener("wheel", h, { passive: !1 }), window.addEventListener("keydown", f), window.addEventListener("keyup", p), () => {
      d.removeEventListener("wheel", h), window.removeEventListener("keydown", f), window.removeEventListener("keyup", p);
    };
  }, [o, e, u]), te(() => {
    const d = e.current;
    if (!d || !o) return;
    const h = (g) => {
      if (g.touches.length !== 2) {
        a.current = null;
        return;
      }
      g.preventDefault();
      let [v, y] = [g.touches[0], g.touches[1]];
      v.identifier > y.identifier && ([v, y] = [y, v]), a.current = {
        touch0X: v.pageX,
        touch0Y: v.pageY,
        touch1X: y.pageX,
        touch1Y: y.pageY
      };
    }, f = (g) => {
      const v = a.current;
      if (!v || g.touches.length !== 2) return;
      let [y, b] = [g.touches[0], g.touches[1]];
      y.identifier > b.identifier && ([y, b] = [b, y]);
      const { pageX: S, pageY: A } = y, { pageX: T, pageY: E } = b, {
        touch0X: O,
        touch0Y: G,
        touch1X: j,
        touch1Y: W
      } = v;
      if (Math.abs(O - S) <= 1 && Math.abs(G - A) <= 1 && Math.abs(j - T) <= 1 && Math.abs(W - E) <= 1)
        return;
      if (v.touch0X = S, v.touch0Y = A, v.touch1X = T, v.touch1Y = E, O === S && G === A) {
        const I = j - S, V = W - A, ee = T - S, X = E - A, x = I * X - V * ee;
        if (Math.abs(x) > 0.02 * Math.hypot(I, V) * Math.hypot(ee, X))
          return;
      } else if (j === T && W === E) {
        const I = O - T, V = G - E, ee = S - T, X = A - E, x = I * X - V * ee;
        if (Math.abs(x) > 0.02 * Math.hypot(I, V) * Math.hypot(ee, X))
          return;
      } else {
        const I = S - O, V = T - j, ee = A - G, X = E - W;
        if (I * V + ee * X >= 0) return;
      }
      g.preventDefault();
      const L = Math.hypot(S - T, A - E) || 1, k = Math.hypot(O - j, G - W) || 1, N = o.currentScale, z = (y.clientX + b.clientX) / 2, H = (y.clientY + b.clientY) / 2;
      u(
        N,
        L / k,
        z,
        H,
        s
      );
    }, p = (g) => {
      a.current && (g.preventDefault(), a.current = null, s.current = 1);
    };
    return d.addEventListener("touchstart", h, {
      passive: !1
    }), d.addEventListener("touchmove", f, {
      passive: !1
    }), d.addEventListener("touchend", p, {
      passive: !1
    }), d.addEventListener("touchcancel", p), () => {
      d.removeEventListener("touchstart", h), d.removeEventListener("touchmove", f), d.removeEventListener("touchend", p), d.removeEventListener("touchcancel", p);
    };
  }, [o, e, u]);
}
const Ti = "_thumbnailList_vmgds_1", xi = "_thumbnail_vmgds_1", ki = "_thumbnailCanvasWrapper_vmgds_19", Ei = "_thumbnailCanvas_vmgds_19", Ri = "_thumbnailPlaceholder_vmgds_51", Pi = "_thumbnailError_vmgds_58", Ni = "_thumbnailPageNumber_vmgds_71", Ii = "_thumbnailMarker_vmgds_93", ft = {
  thumbnailList: Ti,
  thumbnail: xi,
  thumbnailCanvasWrapper: ki,
  "thumbnail--selected": "_thumbnail--selected_vmgds_27",
  thumbnailCanvas: Ei,
  thumbnailPlaceholder: Ri,
  thumbnailError: Pi,
  thumbnailPageNumber: Ni,
  thumbnailMarker: Ii
}, Mi = 132, Di = "320px 0px", Io = fo(({
  pdfDocument: o,
  pageNumber: e,
  selected: t,
  markerCount: n,
  onSelect: r,
  onLayoutChange: s,
  registerElement: i
}) => {
  const { t: a } = ve(["viewer"], { useSuspense: !1 }), l = $(null), u = $(null), d = $(null), [h, f] = K(!1), [p, g] = K(!1), [v, y] = K(!1), b = n > 0 ? a("viewer:navigation.pageWithMarkers", {
    value: e,
    count: n
  }) : a("viewer:navigation.page", { value: e }), S = q((A) => {
    l.current = A, i(e, A);
  }, [e, i]);
  return te(() => {
    const A = l.current;
    if (!A || h) return;
    if (typeof IntersectionObserver > "u") {
      f(!0);
      return;
    }
    const T = new IntersectionObserver(
      ([E]) => {
        E.isIntersecting && (f(!0), T.disconnect());
      },
      { rootMargin: Di }
    );
    return T.observe(A), () => T.disconnect();
  }, [h]), te(() => {
    if (!h) return;
    let A = !1;
    return (async () => {
      let E = null;
      try {
        g(!1), y(!1);
        const O = await o.getPage(e);
        if (A) return;
        const G = u.current, j = G?.getContext("2d");
        if (!G || !j) return;
        const W = O.getViewport({ scale: 1 }), L = O.getViewport({ scale: Mi / W.width }), k = Math.min(window.devicePixelRatio || 1, 2);
        G.width = Math.floor(L.width * k), G.height = Math.floor(L.height * k), G.style.width = `${Math.floor(L.width)}px`, G.style.height = `${Math.floor(L.height)}px`, s(), E = O.render({
          canvasContext: j,
          viewport: L,
          transform: k === 1 ? void 0 : [k, 0, 0, k, 0, 0]
        }), d.current = E, await E.promise, A || g(!0);
      } catch (O) {
        !A && O.name !== "RenderingCancelledException" && y(!0);
      } finally {
        d.current === E && (d.current = null);
      }
    })(), () => {
      A = !0, d.current?.cancel(), d.current = null;
    };
  }, [s, o, e, h]), /* @__PURE__ */ c(
    "button",
    {
      ref: S,
      type: "button",
      className: [
        ft.thumbnail,
        t ? ft["thumbnail--selected"] : ""
      ].join(" "),
      "aria-current": t ? "page" : void 0,
      "aria-label": b,
      onClick: () => r(e),
      children: /* @__PURE__ */ C("span", { className: ft.thumbnailCanvasWrapper, children: [
        /* @__PURE__ */ c("canvas", { ref: u, className: ft.thumbnailCanvas }),
        !p && !v && /* @__PURE__ */ c("span", { className: ft.thumbnailPlaceholder }),
        v && /* @__PURE__ */ c("span", { className: ft.thumbnailError, children: a("viewer:navigation.thumbnailError") }),
        n > 0 && /* @__PURE__ */ c("span", { className: ft.thumbnailMarker, "aria-hidden": "true", children: n > 99 ? "99+" : n }),
        /* @__PURE__ */ c("span", { className: ft.thumbnailPageNumber, children: e })
      ] })
    }
  );
});
Io.displayName = "PdfThumbnail";
const Li = ({ pageMarkerCounts: o }) => {
  const { pdfDocument: e, pdfViewer: t, eventBus: n } = Fe(), [r, s] = K(() => t?.currentPageNumber || 1), i = $(r), a = $(/* @__PURE__ */ new Map()), l = $(null), u = $(!0), d = q((v, y) => {
    y ? a.current.set(v, y) : a.current.delete(v);
  }, []), h = q(() => {
    l.current !== null && (window.cancelAnimationFrame(l.current), l.current = null);
  }, []), f = q(() => {
    u.current && (h(), l.current = window.requestAnimationFrame(() => {
      l.current = null, a.current.get(i.current)?.scrollIntoView({
        block: "nearest"
      });
    }));
  }, [h]), p = q(() => {
    u.current = !1, h();
  }, [h]), g = q((v) => {
    t && (u.current = !0, i.current = v, s(v), t.currentPageNumber = v);
  }, [t]);
  return te(() => {
    if (!t || !n) return;
    const v = t.currentPageNumber || 1;
    u.current = !0, i.current = v, s(v);
    const y = ({ pageNumber: b }) => {
      u.current = !0, i.current = b, s(b);
    };
    return n.on("pagechanging", y), () => n.off("pagechanging", y);
  }, [n, t]), te(() => {
    u.current = !0, i.current = r, f();
  }, [r, f, e]), te(() => h, [h]), e ? /* @__PURE__ */ c(
    "div",
    {
      className: ft.thumbnailList,
      onPointerDown: p,
      onTouchStart: p,
      onWheel: p,
      children: Array.from({ length: e.numPages }, (v, y) => {
        const b = y + 1;
        return /* @__PURE__ */ c(
          Io,
          {
            pdfDocument: e,
            pageNumber: b,
            selected: b === r,
            markerCount: o.get(b) ?? 0,
            onSelect: g,
            onLayoutChange: f,
            registerElement: d
          },
          b
        );
      })
    }
  ) : null;
}, Oi = "_outline_fpevi_1", _i = "_outlineTree_fpevi_5", Hi = "_outlineItem_fpevi_11", Gi = "_outlineRow_fpevi_16", Ui = "_outlineTitle_fpevi_26", zi = "_outlineToggle_fpevi_33", Fi = "_outlineToggleSpacer_fpevi_60", ji = "_outlineChevron_fpevi_64", Wi = "_outlineState_fpevi_100", ze = {
  outline: Oi,
  outlineTree: _i,
  outlineItem: Hi,
  outlineRow: Gi,
  "outlineRow--selected": "_outlineRow--selected_fpevi_26",
  outlineTitle: Ui,
  outlineToggle: zi,
  outlineToggleSpacer: Fi,
  outlineChevron: ji,
  "outlineChevron--expanded": "_outlineChevron--expanded_fpevi_73",
  outlineState: Wi
}, Bi = (o) => {
  if (!o || typeof o != "object") return !1;
  const e = o;
  return Number.isInteger(e.num) && Number.isInteger(e.gen);
}, Ln = fo(({
  depth: o,
  item: e,
  itemKey: t,
  selectedItemKey: n,
  onNavigate: r
}) => {
  const { t: s } = ve(["viewer"], { useSuspense: !1 }), i = e.items.length > 0, [a, l] = K(() => e.count === void 0 || e.count >= 0), u = e.title.trim() || s("viewer:navigation.untitledOutlineItem"), d = e.dest !== null, h = n === t, f = () => {
    d ? r(e, t) : i && l((p) => !p);
  };
  return /* @__PURE__ */ C(
    "li",
    {
      role: "treeitem",
      "aria-expanded": i ? a : void 0,
      className: ze.outlineItem,
      children: [
        /* @__PURE__ */ C(
          "div",
          {
            className: [
              ze.outlineRow,
              h ? ze["outlineRow--selected"] : ""
            ].join(" "),
            style: { paddingLeft: `${8 + Math.min(o, 8) * 12}px` },
            children: [
              i ? /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: ze.outlineToggle,
                  "aria-label": s(a ? "viewer:navigation.collapseOutlineItem" : "viewer:navigation.expandOutlineItem", { title: u }),
                  "aria-controls": `${t}-children`,
                  "aria-expanded": a,
                  onClick: () => l((p) => !p),
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
                  onClick: f,
                  children: u
                }
              )
            ]
          }
        ),
        i && a && /* @__PURE__ */ c("ul", { id: `${t}-children`, role: "group", className: ze.outlineTree, children: e.items.map((p, g) => /* @__PURE__ */ c(
          Ln,
          {
            itemKey: `${t}-${g}`,
            item: p,
            depth: o + 1,
            selectedItemKey: n,
            onNavigate: r
          },
          `${t}-${g}`
        )) })
      ]
    }
  );
});
Ln.displayName = "OutlineItem";
const $i = ({ onNavigate: o }) => {
  const { t: e } = ve(["viewer"], { useSuspense: !1 }), { pdfDocument: t, pdfViewer: n } = Fe(), r = $(0), [s, i] = K(null), [a, l] = K({
    document: null,
    status: "loading",
    items: []
  });
  te(() => {
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
  const u = q(async (d, h) => {
    const f = r.current + 1;
    if (r.current = f, d.url) {
      o?.();
      return;
    }
    if (!(!t || !n || d.dest === null))
      try {
        const p = typeof d.dest == "string" ? await t.getDestination(d.dest) : d.dest;
        if (r.current !== f || n.pdfDocument !== t || !Array.isArray(p))
          return;
        const g = p[0];
        let v = null;
        if (Bi(g) ? (v = t.cachedPageNumber(g), v || (v = await t.getPageIndex(g) + 1)) : Number.isInteger(g) && (v = g + 1), r.current !== f || n.pdfDocument !== t || !v || v < 1 || v > t.numPages)
          return;
        n.scrollPageIntoView({
          pageNumber: v,
          destArray: p
        }), i(h), o?.();
      } catch {
      }
  }, [o, t, n]);
  return !t || a.document !== t || a.status === "loading" ? /* @__PURE__ */ c("div", { className: ze.outlineState, children: e("viewer:navigation.outlineLoading") }) : a.status === "error" ? /* @__PURE__ */ c("div", { className: ze.outlineState, children: e("viewer:navigation.outlineError") }) : a.items.length === 0 ? /* @__PURE__ */ c("div", { className: ze.outlineState, children: e("viewer:navigation.outlineEmpty") }) : /* @__PURE__ */ c("nav", { className: ze.outline, "aria-label": e("viewer:navigation.outline"), children: /* @__PURE__ */ c("ul", { role: "tree", className: ze.outlineTree, children: a.items.map((d, h) => /* @__PURE__ */ c(
    Ln,
    {
      itemKey: `outline-${h}`,
      item: d,
      depth: 0,
      selectedItemKey: s,
      onNavigate: u
    },
    `outline-${h}`
  )) }) });
}, Yt = "inklayer:navigation-page-markers-changed", Vi = "_navigationSidebar_13vi9_1", Yi = "_navigationSidebarContainer_13vi9_19", Ki = "_navigationTabs_13vi9_29", Xi = "_navigationTabsList_13vi9_36", qi = "_navigationTabsTrigger_13vi9_47", Ji = "_navigationTabsContent_13vi9_56", Zi = "_navigationSidebarOverlay_13vi9_63", it = {
  navigationSidebar: Vi,
  "navigationSidebar--hidden": "_navigationSidebar--hidden_13vi9_14",
  navigationSidebarContainer: Yi,
  navigationTabs: Ki,
  navigationTabsList: Xi,
  navigationTabsTrigger: qi,
  navigationTabsContent: Ji,
  navigationSidebarOverlay: Zi
}, Qi = ({
  open: o,
  onClose: e,
  onTransitionEnd: t
}) => {
  const { t: n } = ve(["viewer"], { useSuspense: !1 }), { eventBus: r } = Fe(), [s, i] = K("thumbnails"), [a, l] = K(() => /* @__PURE__ */ new Map()), u = q((f) => {
    (f === "thumbnails" || f === "outline") && i(f);
  }, []);
  te(() => {
    if (l(/* @__PURE__ */ new Map()), !r) return;
    const f = ({
      source: p,
      markers: g
    }) => {
      l((v) => {
        const y = new Map(v);
        return g.size > 0 ? y.set(p, g) : y.delete(p), y;
      });
    };
    return r.on(Yt, f), () => {
      r.off(Yt, f);
    };
  }, [r]), te(() => {
    if (!o) return;
    const f = (p) => {
      p.key === "Escape" && e();
    };
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, [e, o]);
  const d = ke(() => {
    const f = /* @__PURE__ */ new Map();
    return a.forEach((p) => {
      p.forEach((g, v) => {
        f.set(v, (f.get(v) ?? 0) + g);
      });
    }), f;
  }, [a]), h = q(() => {
    window.matchMedia("(max-width: 840px)").matches && e();
  }, [e]);
  return /* @__PURE__ */ C(Ce, { children: [
    /* @__PURE__ */ c(
      "aside",
      {
        id: "InkLayer-navigation-sidebar",
        className: [
          it.navigationSidebar,
          o ? "" : it["navigationSidebar--hidden"]
        ].join(" "),
        "aria-label": n("viewer:navigation.label"),
        "aria-hidden": !o,
        onTransitionEnd: t,
        children: /* @__PURE__ */ c("div", { className: it.navigationSidebarContainer, hidden: !o, children: /* @__PURE__ */ C(
          xt.Root,
          {
            value: s,
            onValueChange: u,
            className: it.navigationTabs,
            children: [
              /* @__PURE__ */ C(xt.List, { className: it.navigationTabsList, children: [
                /* @__PURE__ */ c(
                  xt.Trigger,
                  {
                    value: "thumbnails",
                    className: it.navigationTabsTrigger,
                    children: /* @__PURE__ */ c("span", { children: n("viewer:navigation.thumbnails") })
                  }
                ),
                /* @__PURE__ */ c(
                  xt.Trigger,
                  {
                    value: "outline",
                    className: it.navigationTabsTrigger,
                    children: /* @__PURE__ */ c("span", { children: n("viewer:navigation.outline") })
                  }
                )
              ] }),
              /* @__PURE__ */ c(
                xt.Content,
                {
                  value: "thumbnails",
                  className: it.navigationTabsContent,
                  children: /* @__PURE__ */ c(Li, { pageMarkerCounts: d })
                }
              ),
              /* @__PURE__ */ c(
                xt.Content,
                {
                  value: "outline",
                  className: it.navigationTabsContent,
                  children: /* @__PURE__ */ c($i, { onNavigate: h })
                }
              )
            ]
          }
        ) })
      }
    ),
    o && /* @__PURE__ */ c(
      "div",
      {
        className: it.navigationSidebarOverlay,
        onClick: e
      }
    )
  ] });
}, es = /* @__PURE__ */ new Set(["auto", "page-fit", "page-width"]), Mo = ({
  children: o,
  toolbar: e,
  sidebar: t,
  defaultActiveSidebarKey: n,
  title: r,
  actions: s,
  style: i = { width: "100vw", height: "100vh" },
  initialScale: a = "auto",
  user: l,
  hideHeader: u = !1,
  hidePageIndicator: d = !1,
  ...h
}) => {
  const { t: f } = ve(["viewer"], { useSuspense: !1 }), p = $(null), { loading: g, progress: v, pdfDocument: y, pdfViewer: b, eventBus: S, loadError: A } = ri(p, h), [T, E] = K(!1), O = q(() => {
    E((D) => !D);
  }, []), [G, j] = K(() => n || null), W = G === null;
  te(() => {
    if (!b || !S) return;
    const D = () => {
      b.currentScaleValue = a;
    };
    return S.on("pagesloaded", D), () => {
      S.off("pagesloaded", D);
    };
  }, [b, S, a]);
  const L = q(() => {
    j((D) => D ? null : t?.[0]?.key ?? null);
  }, [t]), k = q((D) => {
    j(D);
  }, []), N = q(() => {
    j(null);
  }, []), z = q(() => {
    if (!b) return;
    const D = b.currentScaleValue;
    es.has(D) && (b.currentScaleValue = D, b.update());
  }, [b]), H = q(
    (D) => {
      D.target !== D.currentTarget || D.propertyName !== "width" || z();
    },
    [z]
  ), I = !!(b && S && p.current && !g), { printClean: V, downloadClean: ee } = No(y);
  Ai({
    pdfViewer: b ?? null,
    containerRef: p,
    minScale: 0.1,
    maxScale: 10
  });
  const X = ke(
    () => ({
      pdfDocument: y,
      pdfViewer: b,
      eventBus: S,
      viewerContainerRef: p,
      isReady: I,
      activeSidebarPanel: G,
      isNavigationSidebarOpen: T,
      toggleNavigationSidebar: O,
      toggleSidebar: L,
      openSidebar: k,
      closeSidebar: N,
      isSidebarCollapsed: W,
      print: V,
      download: ee
    }),
    [
      y,
      b,
      S,
      I,
      L,
      W,
      k,
      N,
      G,
      T,
      O,
      V,
      ee
    ]
  ), x = ke(
    () => ({
      user: l || null
    }),
    [l]
  );
  te(() => {
    if (!b || !S)
      return;
    const D = () => {
      const J = b.currentScaleValue;
      (J === "auto" || J === "page-fit" || J === "page-width") && (b.currentScaleValue = J), b.update();
    };
    return window.addEventListener("resize", D), D(), () => {
      window.removeEventListener("resize", D);
    };
  }, [b, S]);
  const P = t && /* @__PURE__ */ c(Z, { gap: "2", children: t.map((D) => /* @__PURE__ */ c(Rt, { content: D.title, children: /* @__PURE__ */ c(
    ye,
    {
      variant: G === D.key ? "soft" : "outline",
      size: "2",
      color: "gray",
      highContrast: !0,
      style: {
        boxShadow: "none"
      },
      onClick: () => j((J) => J === D.key ? null : D.key),
      children: D.icon
    }
  ) }, D.key)) }), Y = ke(() => !t || !G ? null : t.find((D) => D.key === G) || null, [t, G]);
  return te(() => {
    if (!t || !G) return;
    t.some((J) => J.key === G) || j(null);
  }, [t, G]), /* @__PURE__ */ c(Dn.Provider, { value: x, children: /* @__PURE__ */ c(ko.Provider, { value: X, children: /* @__PURE__ */ C(Z, { id: "InkLayer", className: Ie.InkLayerViewer, style: i, direction: "column", width: "100%", position: "relative", children: [
    /* @__PURE__ */ c(mi, { progress: v, loading: g }),
    A && /* @__PURE__ */ c(vi, { error: A }),
    !u && /* @__PURE__ */ c(Z, { pl: "2", pr: "2", className: Ie.viewerHeader, children: /* @__PURE__ */ C("div", { className: Ie["viewerHeader-title"], children: [
      /* @__PURE__ */ C(Z, { align: "center", gap: "2", className: Ie["viewerHeader-title-left"], children: [
        /* @__PURE__ */ c(Rt, { content: f("viewer:navigation.toggle"), children: /* @__PURE__ */ c(
          ye,
          {
            variant: "outline",
            size: "2",
            color: "gray",
            highContrast: !0,
            style: { boxShadow: "none" },
            "aria-controls": "InkLayer-navigation-sidebar",
            "aria-expanded": T,
            "aria-label": f("viewer:navigation.toggle"),
            onClick: () => E((D) => !D),
            children: T ? /* @__PURE__ */ c(Xr, { className: Ie.navigationSidebarTriggerIcon }) : /* @__PURE__ */ c(qr, { className: Ie.navigationSidebarTriggerIcon })
          }
        ) }),
        /* @__PURE__ */ c("div", { className: Ie["viewerHeader-title-name"], children: r || "PDF Viewer" })
      ] }),
      /* @__PURE__ */ c("div", { className: Ie["viewerHeader-title-actions"], children: /* @__PURE__ */ C(Z, { direction: "row", gap: "3", justify: "between", align: "center", children: [
        P,
        s
      ] }) })
    ] }) }),
    /* @__PURE__ */ C(Z, { flexGrow: "1", minHeight: "0", className: Ie.viewerBody, children: [
      /* @__PURE__ */ c(
        Qi,
        {
          open: T,
          onClose: () => E(!1),
          onTransitionEnd: H
        }
      ),
      /* @__PURE__ */ C(Z, { flexGrow: "1", minHeight: "0", className: Ie.viewerWrapper, children: [
        /* @__PURE__ */ C(Z, { className: Ie.viewerContainer, direction: "column", flexGrow: "1", children: [
          e && /* @__PURE__ */ c(Z, { align: "center", justify: "center", className: Ie["viewerContainer-header"], children: e }),
          /* @__PURE__ */ C(lt, { position: "relative", flexGrow: "1", className: Ie["viewerContainer-content"], children: [
            !d && /* @__PURE__ */ c(Ro, {}),
            /* @__PURE__ */ c("div", { ref: p, className: Ie.pdfjsViewerContainer, children: /* @__PURE__ */ c("div", { className: "pdfViewer" }) })
          ] })
        ] }),
        /* @__PURE__ */ c(
          lt,
          {
            id: "InkLayer-viewer-sidebar",
            className: [
              Ie.viewerSidebar,
              Y ? "" : Ie["viewerSidebar--hidden"]
            ].join(" "),
            pl: "1",
            pr: "1",
            onTransitionEnd: H,
            children: Y && /* @__PURE__ */ c("div", { className: Ie["viewerSidebar-container"], children: Y.render(X) })
          }
        ),
        Y && /* @__PURE__ */ c(
          "div",
          {
            className: Ie.sidebarOverlay,
            onClick: () => j(null)
          }
        )
      ] })
    ] }),
    o
  ] }) }) });
}, Ne = ({ children: o, style: e, ...t }) => /* @__PURE__ */ c("svg", { ...t, style: { width: "1em", height: "1em", ...e }, children: o }), ts = ({ style: o }) => /* @__PURE__ */ c(Ne, { viewBox: "0 0 320 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M0 55.2V426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320H297.9c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"
  }
) }), Do = ({ style: o }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 576 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M315 315l158.4-215L444.1 70.6 229 229 315 315zm-187 5l0 0V248.3c0-15.3 7.2-29.6 19.5-38.6L420.6 8.4C428 2.9 437 0 446.2 0c11.4 0 22.4 4.5 30.5 12.6l54.8 54.8c8.1 8.1 12.6 19 12.6 30.5c0 9.2-2.9 18.2-8.4 25.6L334.4 396.5c-9 12.3-23.4 19.5-38.6 19.5H224l-25.4 25.4c-12.5 12.5-32.8 12.5-45.3 0l-50.7-50.7c-12.5-12.5-12.5-32.8 0-45.3L128 320zM7 466.3l63-63 70.6 70.6-31 31c-4.5 4.5-10.6 7-17 7H24c-13.3 0-24-10.7-24-24v-4.7c0-6.4 2.5-12.5 7-17z"
  }
) }), Lo = ({ style: o }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 512 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M161.3 144c3.2-17.2 14-30.1 33.7-38.6c21.1-9 51.8-12.3 88.6-6.5c11.9 1.9 48.8 9.1 60.1 12c17.1 4.5 34.6-5.6 39.2-22.7s-5.6-34.6-22.7-39.2c-14.3-3.8-53.6-11.4-66.6-13.4c-44.7-7-88.3-4.2-123.7 10.9c-36.5 15.6-64.4 44.8-71.8 87.3c-.1 .6-.2 1.1-.2 1.7c-2.8 23.9 .5 45.6 10.1 64.6c4.5 9 10.2 16.9 16.7 23.9H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H270.1c-.1 0-.3-.1-.4-.1l-1.1-.3c-36-10.8-65.2-19.6-85.2-33.1c-9.3-6.3-15-12.6-18.2-19.1c-3.1-6.1-5.2-14.6-3.8-27.4zM348.9 337.2c2.7 6.5 4.4 15.8 1.9 30.1c-3 17.6-13.8 30.8-33.9 39.4c-21.1 9-51.7 12.3-88.5 6.5c-18-2.9-49.1-13.5-74.4-22.1c-5.6-1.9-11-3.7-15.9-5.4c-16.8-5.6-34.9 3.5-40.5 20.3s3.5 34.9 20.3 40.5c3.6 1.2 7.9 2.7 12.7 4.3l0 0 0 0c24.9 8.5 63.6 21.7 87.6 25.6l0 0 .2 0c44.7 7 88.3 4.2 123.7-10.9c36.5-15.6 64.4-44.8 71.8-87.3c3.6-21 2.7-40.4-3.1-58.1H335.1c7 5.6 11.4 11.2 13.9 17.2z"
  }
) }), Oo = ({ style: o }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 448 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M16 64c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H128V224c0 53 43 96 96 96s96-43 96-96V96H304c-17.7 0-32-14.3-32-32s14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H384V224c0 88.4-71.6 160-160 160s-160-71.6-160-160V96H48C30.3 96 16 81.7 16 64zM0 448c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32z"
  }
) }), ns = ({ style: o }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 384 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M32 32C14.3 32 0 46.3 0 64S14.3 96 32 96H160V448c0 17.7 14.3 32 32 32s32-14.3 32-32V96H352c17.7 0 32-14.3 32-32s-14.3-32-32-32H192 32z"
  }
) }), os = ({ style: o }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 512 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M384 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H384zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"
  }
) }), rs = ({ style: o }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 512 512", style: o, children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" }) }), is = ({ style: o }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 512 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
  }
) }), ss = ({ style: o }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 576 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M315 315l158.4-215L444.1 70.6 229 229 315 315zm-187 5l0 0V248.3c0-15.3 7.2-29.6 19.5-38.6L420.6 8.4C428 2.9 437 0 446.2 0c11.4 0 22.4 4.5 30.5 12.6l54.8 54.8c8.1 8.1 12.6 19 12.6 30.5c0 9.2-2.9 18.2-8.4 25.6L334.4 396.5c-9 12.3-23.4 19.5-38.6 19.5H224l-25.4 25.4c-12.5 12.5-32.8 12.5-45.3 0l-50.7-50.7c-12.5-12.5-12.5-32.8 0-45.3L128 320zM7 466.3l63-63 70.6 70.6-31 31c-4.5 4.5-10.6 7-17 7H24c-13.3 0-24-10.7-24-24v-4.7c0-6.4 2.5-12.5 7-17z"
  }
) }), as = ({ style: o }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 640 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M192 128c0-17.7 14.3-32 32-32s32 14.3 32 32v7.8c0 27.7-2.4 55.3-7.1 82.5l-84.4 25.3c-40.6 12.2-68.4 49.6-68.4 92v71.9c0 40 32.5 72.5 72.5 72.5c26 0 50-13.9 62.9-36.5l13.9-24.3c26.8-47 46.5-97.7 58.4-150.5l94.4-28.3-12.5 37.5c-3.3 9.8-1.6 20.5 4.4 28.8s15.7 13.3 26 13.3H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H460.4l18-53.9c3.8-11.3 .9-23.8-7.4-32.4s-20.7-11.8-32.2-8.4L316.4 198.1c2.4-20.7 3.6-41.4 3.6-62.3V128c0-53-43-96-96-96s-96 43-96 96v32c0 17.7 14.3 32 32 32s32-14.3 32-32V128zm-9.2 177l49-14.7c-10.4 33.8-24.5 66.4-42.1 97.2l-13.9 24.3c-1.5 2.6-4.3 4.3-7.4 4.3c-4.7 0-8.5-3.8-8.5-8.5V335.6c0-14.1 9.3-26.6 22.8-30.7zM24 368c-13.3 0-24 10.7-24 24s10.7 24 24 24H64.3c-.2-2.8-.3-5.6-.3-8.5V368H24zm592 48c13.3 0 24-10.7 24-24s-10.7-24-24-24H305.9c-6.7 16.3-14.2 32.3-22.3 48H616z"
  }
) }), cs = ({ style: o }) => /* @__PURE__ */ c(Ne, { fill: "currentColor", viewBox: "0 0 512 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M312 201.8c0-17.4 9.2-33.2 19.9-47C344.5 138.5 352 118.1 352 96c0-53-43-96-96-96s-96 43-96 96c0 22.1 7.5 42.5 20.1 58.8c10.7 13.8 19.9 29.6 19.9 47c0 29.9-24.3 54.2-54.2 54.2H112C50.1 256 0 306.1 0 368c0 20.9 13.4 38.7 32 45.3V464c0 26.5 21.5 48 48 48H432c26.5 0 48-21.5 48-48V413.3c18.6-6.6 32-24.4 32-45.3c0-61.9-50.1-112-112-112H366.2c-29.9 0-54.2-24.3-54.2-54.2zM416 416v32H96V416H416z"
  }
) }), ls = ({ style: o }) => /* @__PURE__ */ C(Ne, { viewBox: "0 0 1024 1024", style: o, children: [
  /* @__PURE__ */ c("path", { d: "M96 837.68888888h832v160H96z", fill: "var(--palette-preview-color, currentColor)" }),
  /* @__PURE__ */ c("path", { d: "M429.30646525 163.315053m54.92260742 54.92260743l164.76782227 164.76782227q54.92260742 54.92260742 0 109.84521486l-164.76782227 164.76782228q-54.92260742 54.92260742-109.84521486 0l-164.76782228-164.76782228q-54.92260742-54.92260742 0-109.84521486l164.76782228-164.76782227q54.92260742-54.92260742 109.84521486 0Z", fill: "var(--palette-preview-color, currentColor)" }),
  /* @__PURE__ */ c("path", { d: "M364.65047577 163.33699097L262.12304466 60.85098508 320.69831237 2.23429214l153.14905568 153.10763046c2.94119095 2.27838736 5.79953147 4.76390083 8.5335963 7.45654045l234.34249608 234.34249608a82.85044939 82.85044939 0 0 1 0 117.15053543l-234.34249608 234.34249607a82.85044939 82.85044939 0 0 1-117.19196065 0L130.88793283 514.29149456a82.85044939 82.85044939 0 0 1 0-117.15053543l233.76254294-233.80396816z m220.2579197 219.13943862l-0.57995316 0.53852791-161.0612736-161.0612736-226.72025474 226.67882952h454.51756532L584.90839547 382.47642959zM822.68918518 783.3069037a103.56306173 103.56306173 0 0 1-103.56306171-103.56306173c0-57.16681008 87.61435022-161.39267539 103.56306171-161.3926754 15.9487115 0 103.56306173 104.1844401 103.56306173 161.3926754a103.56306173 103.56306173 0 0 1-103.56306173 103.56306173z", fill: "currentColor" })
] }), ds = ({ style: o }) => /* @__PURE__ */ C(
  Ne,
  {
    viewBox: "0 0 1024 1024",
    style: o,
    children: [
      /* @__PURE__ */ c("path", { fill: "currentColor", stroke: "currentColor", strokeWidth: "16", strokeLinejoin: "round", d: "M542.04 141.43c-68.07-39.3-151.95-39.3-220.03 0-68.07 39.31-110.01 111.95-110 190.56C212.02 453.5 310.52 552 432.03 552s220.01-98.5 220.02-220.01c0.01-78.61-41.93-151.25-110.01-190.56zM432.03 472c-77.33 0-140.01-62.69-140.01-140.01s62.68-140.02 140.01-140.02c77.33 0 140.02 62.69 140.02 140.02S509.36 472 432.03 472zM325.06 612.02h186.98c22.09 0 40 17.91 40 40s-17.91 40-40 40H332.02c-58.73 0-79.21 0.4-94.81 5.2a120.03 120.03 0 0 0-80.01 80c-4.79 15.6-5.2 36.09-5.2 94.82 0 14.29-7.62 27.5-19.99 34.65a40.044 40.044 0 0 1-40.01 0 40.013 40.013 0 0 1-20-34.65v-6.97c0-49.08 0-82.61 8.6-111.09C99.99 690.04 150.03 640 213.98 620.62c28.48-8.65 62-8.65 111.08-8.6z" }),
      /* @__PURE__ */ c("path", { fill: "currentColor", stroke: "currentColor", strokeWidth: "24", strokeLinecap: "round", strokeLinejoin: "round", d: "M720.72 551.99c4.72 0 9.24 1.87 12.58 5.21 3.34 3.33 5.21 7.86 5.21 12.58v71.16h106.74v-71.16c0-6.36 3.39-12.23 8.9-15.41a17.78 17.78 0 0 1 17.79 0c5.5 3.18 8.89 9.05 8.89 15.41v71.16h53.37c6.36 0 12.23 3.39 15.41 8.89a17.78 17.78 0 0 1 0 17.79c-3.18 5.5-9.05 8.89-15.41 8.89h-53.37v106.74h53.37c6.36 0 12.23 3.39 15.41 8.9a17.78 17.78 0 0 1 0 17.79c-3.18 5.5-9.05 8.9-15.41 8.89h-53.37v71.16c0 6.36-3.39 12.23-8.89 15.41a17.78 17.78 0 0 1-17.79 0c-5.51-3.18-8.9-9.05-8.9-15.41v-71.16H738.51v71.16c0 6.36-3.39 12.23-8.9 15.41a17.78 17.78 0 0 1-17.79 0c-5.51-3.18-8.9-9.05-8.89-15.41v-71.16h-53.37c-6.36 0-12.23-3.39-15.41-8.89a17.78 17.78 0 0 1 0-17.79c3.18-5.51 9.05-8.9 15.41-8.9h53.37V676.53h-53.37c-9.82 0-17.79-7.96-17.79-17.79 0-9.82 7.96-17.79 17.79-17.79h53.37v-71.16c0-9.83 7.96-17.8 17.79-17.8z m17.79 124.54v106.74h106.74V676.53H738.51z m0 0" })
    ]
  }
), us = ({ style: o }) => /* @__PURE__ */ c(Ne, { viewBox: "0 0 1024 1024", style: o, children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M766.4 744.3c43.7 0 79.4-36.2 79.4-80.5 0-53.5-79.4-140.8-79.4-140.8S687 610.3 687 663.8c0 44.3 35.7 80.5 79.4 80.5zm-377.1-44.1c7.1 7.1 18.6 7.1 25.6 0l256.1-256c7.1-7.1 7.1-18.6 0-25.6l-256-256c-.6-.6-1.3-1.2-2-1.7l-78.2-78.2a9.11 9.11 0 00-12.8 0l-48 48a9.11 9.11 0 000 12.8l67.2 67.2-207.8 207.9c-7.1 7.1-7.1 18.6 0 25.6l255.9 256zm12.9-448.6l178.9 178.9H223.4l178.8-178.9zM904 816H120c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8z" }) }), hs = ({ style: o }) => /* @__PURE__ */ C(Ne, { viewBox: "0 0 1024 1024", style: o, children: [
  /* @__PURE__ */ c("path", { d: "M66.782609 772.541217h196.051478a58.835478 58.835478 0 0 1 58.768696 58.768696v117.359304l235.78713-165.442782c9.928348-6.989913 21.615304-10.685217 33.747478-10.685218H957.217391V89.043478H66.782609v683.475479zM313.61113 1022.886957a58.768696 58.768696 0 0 1-58.768695-58.768696v-124.794435H58.724174A58.813217 58.813217 0 0 1 0 780.55513V81.029565A58.835478 58.835478 0 0 1 58.768696 22.26087h906.462608A58.835478 58.835478 0 0 1 1024 81.029565v699.503305a58.835478 58.835478 0 0 1-58.768696 58.768695H593.697391L347.336348 1012.201739c-10.106435 7.101217-21.904696 10.685217-33.725218 10.685218z", fill: "currentColor" }),
  /* @__PURE__ */ c("path", { d: "M761.878261 326.032696h-499.756522a33.391304 33.391304 0 0 1 0-66.782609h499.756522a33.391304 33.391304 0 1 1 0 66.782609M761.878261 567.652174h-499.756522a33.391304 33.391304 0 0 1 0-66.782609h499.756522a33.391304 33.391304 0 1 1 0 66.782609", fill: "currentColor" })
] }), _o = ({ style: o }) => /* @__PURE__ */ c(Ne, { viewBox: "0 0 1024 1024", style: o, children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M464 512a48 48 0 1096 0 48 48 0 10-96 0zm200 0a48 48 0 1096 0 48 48 0 10-96 0zm-400 0a48 48 0 1096 0 48 48 0 10-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 00-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 00-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 00112 714v152a46 46 0 0046 46h152.1A449.4 449.4 0 00510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 00142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z" }) }), ps = ({ style: o }) => /* @__PURE__ */ c(Ne, { style: o, viewBox: "0 0 1024 1024", children: /* @__PURE__ */ c("path", { d: "M820.35259846 337.71374951V646.0663464h134.06634641V109.8009592h-536.2653872v134.06634641h308.35259689L109.8009592 860.57250255l93.84644234 93.84644232 616.70519692-616.70519536z", fill: "currentColor" }) }), fs = ({ style: o }) => /* @__PURE__ */ c(Ne, { style: o, viewBox: "0 0 1365 1024", children: /* @__PURE__ */ c("path", { d: "M992 992H392v-2.71999969A319.75999969 319.75999969 0 0 1 193.92000031 393.99999969a400.00000031 400.00000031 0 0 1 790.11999938-41.47999969c2.68000031 0 5.28-0.52000031 8.00000062-0.52000031A319.99999969 319.99999969 0 0 1 992 992z m0-480h-7.99999969a247.99999969 247.99999969 0 0 1-77.28 0H831.99999969v-79.99999969a240 240 0 0 0-480 0v79.99999969a202.87999969 202.87999969 0 0 0-79.99999969 22.56L247.23999969 552.00000031a157.39999969 157.39999969 0 0 0-15.24 15.31999969 54.28000031 54.28000031 0 0 0-9.96 12.48A157.44 157.44 0 0 0 192.00000031 672.00000031a166.36000031 166.36000031 0 0 0 120 159.99999938h679.99999969a160.00000031 160.00000031 0 0 0 0-319.99999969z", fill: "currentColor" }) }), gs = ({ style: o }) => /* @__PURE__ */ c(Ne, { style: o, viewBox: "0 0 1024 1024", children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" }) });
var oe = /* @__PURE__ */ ((o) => (o[o.NONE = 0] = "NONE", o[o.TEXT = 1] = "TEXT", o[o.LINK = 2] = "LINK", o[o.FREETEXT = 3] = "FREETEXT", o[o.LINE = 4] = "LINE", o[o.SQUARE = 5] = "SQUARE", o[o.CIRCLE = 6] = "CIRCLE", o[o.POLYGON = 7] = "POLYGON", o[o.POLYLINE = 8] = "POLYLINE", o[o.HIGHLIGHT = 9] = "HIGHLIGHT", o[o.UNDERLINE = 10] = "UNDERLINE", o[o.SQUIGGLY = 11] = "SQUIGGLY", o[o.STRIKEOUT = 12] = "STRIKEOUT", o[o.STAMP = 13] = "STAMP", o[o.CARET = 14] = "CARET", o[o.INK = 15] = "INK", o[o.POPUP = 16] = "POPUP", o[o.FILEATTACHMENT = 17] = "FILEATTACHMENT", o[o.SOUND = 18] = "SOUND", o[o.MOVIE = 19] = "MOVIE", o[o.WIDGET = 20] = "WIDGET", o[o.SCREEN = 21] = "SCREEN", o[o.PRINTERMARK = 22] = "PRINTERMARK", o[o.TRAPNET = 23] = "TRAPNET", o[o.WATERMARK = 24] = "WATERMARK", o[o.THREED = 25] = "THREED", o[o.REDACT = 26] = "REDACT", o[o.NOTE = 27] = "NOTE", o))(oe || {}), R = /* @__PURE__ */ ((o) => (o[o.NONE = -1] = "NONE", o[o.SELECT = 0] = "SELECT", o[o.HIGHLIGHT = 1] = "HIGHLIGHT", o[o.STRIKEOUT = 2] = "STRIKEOUT", o[o.UNDERLINE = 3] = "UNDERLINE", o[o.FREETEXT = 4] = "FREETEXT", o[o.RECTANGLE = 5] = "RECTANGLE", o[o.CIRCLE = 6] = "CIRCLE", o[o.FREEHAND = 7] = "FREEHAND", o[o.FREE_HIGHLIGHT = 8] = "FREE_HIGHLIGHT", o[o.SIGNATURE = 9] = "SIGNATURE", o[o.STAMP = 10] = "STAMP", o[o.NOTE = 11] = "NOTE", o[o.ARROW = 12] = "ARROW", o[o.CLOUD = 13] = "CLOUD", o))(R || {}), st = /* @__PURE__ */ ((o) => (o.Accepted = "Accepted", o.Rejected = "Rejected", o.Cancelled = "Cancelled", o.Completed = "Completed", o.None = "None", o.Closed = "Closed", o))(st || {});
const De = [
  {
    name: "select",
    // 批注名称
    type: 0,
    // 批注类型
    pdfjsAnnotationType: 0,
    subtype: "None",
    webSelectionDependencies: !1,
    isOnce: !1,
    // 是否只绘制一次
    resizable: !1,
    draggable: !1,
    icon: /* @__PURE__ */ c(ts, {})
    // 图标
  },
  {
    name: "highlight",
    type: 1,
    pdfjsAnnotationType: 9,
    subtype: "Highlight",
    webSelectionDependencies: !0,
    isOnce: !1,
    resizable: !1,
    draggable: !1,
    icon: /* @__PURE__ */ c(Do, {}),
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
    isOnce: !1,
    resizable: !1,
    draggable: !1,
    icon: /* @__PURE__ */ c(Lo, {}),
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
    isOnce: !1,
    resizable: !1,
    draggable: !1,
    icon: /* @__PURE__ */ c(Oo, {}),
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
    isOnce: !0,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(os, {}),
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
    isOnce: !0,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(rs, {}),
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
    isOnce: !0,
    resizable: !1,
    draggable: !0,
    icon: /* @__PURE__ */ c(hs, {})
  },
  {
    name: "arrow",
    type: 12,
    pdfjsAnnotationType: 4,
    subtype: "Arrow",
    webSelectionDependencies: !1,
    isOnce: !0,
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
    name: "cloud",
    type: 13,
    pdfjsAnnotationType: 8,
    subtype: "PolyLine",
    webSelectionDependencies: !1,
    isOnce: !0,
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
    name: "freehand",
    type: 7,
    pdfjsAnnotationType: 15,
    subtype: "Ink",
    webSelectionDependencies: !1,
    isOnce: !0,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(is, {}),
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
    isOnce: !0,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(ss, {}),
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
    isOnce: !0,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(ns, {}),
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
    isOnce: !0,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(as, {})
  },
  {
    name: "stamp",
    type: 10,
    pdfjsAnnotationType: 13,
    subtype: "Stamp",
    webSelectionDependencies: !1,
    isOnce: !0,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(cs, {})
  }
];
function Le(o) {
  if (!o) return [1, 1, 0];
  if (o.startsWith("rgb")) {
    const e = o.match(/\d+/g);
    return !e || e.length < 3 ? [1, 1, 0] : e.slice(0, 3).map((t) => parseInt(t) / 255);
  }
  if (o.startsWith("#")) {
    const e = o.replace("#", "");
    if (e.length !== 6) return [1, 1, 0];
    const t = parseInt(e.slice(0, 2), 16) / 255, n = parseInt(e.slice(2, 4), 16) / 255, r = parseInt(e.slice(4, 6), 16) / 255;
    return [t, n, r];
  }
  return [1, 1, 0];
}
function ms(o) {
  return document.body.contains(o);
}
function Ho() {
  return Jr();
}
function Go(o, e) {
  document.documentElement.style.setProperty(o, e);
}
function dn(o) {
  document.documentElement.style.removeProperty(o);
}
function wn(o) {
  if (o < 1024) return `${o} B`;
  const e = ["KB", "MB", "GB", "TB"];
  let t = -1, n = o;
  do
    n /= 1024, t++;
  while (n >= 1024 && t < e.length - 1);
  return `${n.toFixed(2)} ${e[t]}`;
}
function Kt(o, e, t) {
  if (o <= t && e <= t)
    return { newWidth: o, newHeight: e };
  const n = t / o, r = t / e, s = Math.min(n, r), i = o * s, a = e * s;
  return { newWidth: i, newHeight: a };
}
function Xe(o, e = 0) {
  if (e < 0 || e * 3 + 2 >= o.length)
    throw new Error("Index out of bounds");
  const t = o[e * 3], n = o[e * 3 + 1], r = o[e * 3 + 2];
  return `rgb(${t}, ${n}, ${r})`;
}
function $t(o) {
  const e = new Date(o), t = e.getFullYear(), n = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getDate()).padStart(2, "0"), s = String(e.getHours()).padStart(2, "0"), i = String(e.getMinutes()).padStart(2, "0"), a = String(e.getSeconds()).padStart(2, "0"), l = -e.getTimezoneOffset(), u = String(Math.floor(Math.abs(l) / 60)).padStart(2, "0"), d = String(Math.abs(l) % 60).padStart(2, "0"), h = l >= 0 ? "+" : "-";
  return `D:${t}${n}${r}${s}${i}${a}${h}${u}'${d}'`;
}
function Cn(o, e = !1) {
  if (!o || typeof o != "string" || !o.startsWith("D:"))
    return "";
  const t = o.slice(2, 16);
  if (t.length !== 14)
    return "";
  const n = t.slice(0, 4), r = t.slice(4, 6), s = t.slice(6, 8), i = t.slice(8, 10), a = t.slice(10, 12);
  if (e)
    return Te.t("common:dateFormat.full", { year: n, month: r, day: s, hour: i, minute: a });
  const l = /* @__PURE__ */ new Date(), u = l.getFullYear().toString(), d = (l.getMonth() + 1).toString().padStart(2, "0"), h = l.getDate().toString().padStart(2, "0");
  return n === u && r === d && s === h ? `${i}:${a}` : n === u ? Te.t("common:dateFormat.dayMonth", { day: s, month: r }) : Te.t("common:dateFormat.dayMonthYear", { day: s, month: r, year: n });
}
function Fn(o) {
  if (!o || typeof o != "string" || !o.startsWith("D:"))
    return "";
  const e = o.slice(2, 16);
  if (e.length !== 14)
    return "";
  const t = e.slice(0, 4), n = e.slice(4, 6), r = e.slice(6, 8), s = e.slice(8, 10), i = e.slice(10, 12), a = (/* @__PURE__ */ new Date()).getFullYear().toString(), l = t === a ? "common:dateFormat.compact" : "common:dateFormat.compactWithYear";
  return Te.t(l, {
    year: t,
    month: n,
    day: r,
    hour: s,
    minute: i
  });
}
function jn(o) {
  const e = o.slice(2, 16), t = parseInt(e.slice(0, 4), 10), n = parseInt(e.slice(4, 6), 10) - 1, r = parseInt(e.slice(6, 8), 10), s = parseInt(e.slice(8, 10), 10), i = parseInt(e.slice(10, 12), 10), a = parseInt(e.slice(12, 14), 10) || 0, l = o.slice(16).match(/([+-])(\d{2})'?(\d{2})?'/);
  let u = 0;
  if (l) {
    const h = l[1] === "+" ? 1 : -1, f = parseInt(l[2], 10) || 0, p = parseInt(l[3] || "0", 10) || 0;
    u = h * (f * 60 + p);
  }
  return new Date(Date.UTC(t, n, r, s, i, a)).getTime() - u * 60 * 1e3;
}
function Pe(o, e) {
  const { viewport: t } = e, n = t.scale, r = o.x * n, s = o.y * n, i = o.width * n, a = o.height * n, [l, u] = t.convertToPdfPoint(r, s), [d, h] = t.convertToPdfPoint(r + i, s + a);
  return [Math.min(l, d), Math.min(u, h), Math.max(l, d), Math.max(u, h)];
}
function ie(o) {
  const t = [...[254, 255]];
  for (let r = 0; r < o.length; r++) {
    const s = o.charCodeAt(r);
    t.push(s >> 8 & 255, s & 255);
  }
  const n = t.map((r) => r.toString(16).padStart(2, "0")).join("").toUpperCase();
  return wo.of(n);
}
function Uo(o = /* @__PURE__ */ new Date()) {
  const e = (l) => l.toString().padStart(2, "0"), t = o.getFullYear(), n = e(o.getMonth() + 1), r = e(o.getDate()), s = e(o.getHours()), i = e(o.getMinutes()), a = e(o.getSeconds());
  return `${t}${n}${r}_${s}${i}${a}`;
}
const ut = "InkLayer_Annotator", An = `${ut}_painter_wrapper`, vs = `${ut}_annotation_author_labels_layer`, ys = `${ut}_annotation_author_label`, nn = "annotationAuthorLabelBoundsChange", bs = `${ut}_annotation_hover_preview`, Wn = `${ut}_is_painting`, un = `${ut}_painting_type`, Oe = `${ut}_shape_group`, Ss = `${ut}_selector_hover`, Lt = `--${ut}-image-cursor`, zo = `${ut}_free_text_editor`;
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
    currentUser: n,
    konvaStage: r,
    pageNumber: s,
    annotation: i,
    onAdd: a,
    editorType: l,
    pdfViewerApplication: u,
    onChange: d
  }) {
    this.primaryColor = e, this.defaultOptions = t, this.currentUser = n, this.pdfViewerApplication = u, this.id = `${s}_${l}`, this.konvaStage = r, this.pageNumber = s, this.currentAnnotation = i, this.isPainting = !1, this.currentShapeGroup = null, this.onAdd = a, this.onChange = d || (() => {
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
    color: n
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
        color: n,
        date: $t(Date.now()),
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
    const t = this.konvaStage.findOne((n) => n.getType() === "Group" && n.id() === e);
    t && t.destroy();
  }
  /**
   * @description 获取指定 ID 的形状组。
   * @param id
   * @returns
   */
  getShapeGroupById(e) {
    return this.konvaStage.findOne((n) => n.getType() === "Group" && n.id() === e);
  }
  /**
   * 设置指定 ID 的形状组为已完成状态，并触发添加事件。
   * @protected
   */
  setShapeGroupDone({
    id: e,
    contentsObj: t,
    color: n
  }) {
    const r = this.shapeGroupStore.get(e);
    r && (r.isDone = !0, this.dispatchAddEvent({
      shapeGroup: r,
      contentsObj: t,
      color: n
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
    return this.currentShapeGroup?.konvaGroup.getChildren((n) => n.getClassName() === e);
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
      const n = this.shapeGroupStore.get(e);
      if (n)
        return n.konvaGroup = t, this.shapeGroupStore.set(e, n), n;
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
    const e = Ho(), t = new M.Group({
      // 创建新的 Konva.Group 对象
      draggable: !1,
      name: Oe,
      id: e
    }), n = {
      // 创建形状组对象
      id: e,
      konvaGroup: t,
      pageNumber: this.pageNumber,
      annotation: this.currentAnnotation,
      isDone: !1
    };
    return this.shapeGroupStore.set(e, n), n;
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
    const n = M.Node.create(t);
    this.registerSerializedGroup(e, n);
  }
  /**
   * 将反序列化的 Group 绑定到当前 Stage，并让 Store 始终指向当前页面上的节点。
   */
  registerSerializedGroup(e, t) {
    this.konvaStage = e;
    const n = t.id(), r = e.findOne(
      (s) => s.getType() === "Group" && s.id() === n
    );
    return r ? (t.destroy(), this.storeSerializedGroup(r), { konvaGroup: r, added: !1 }) : (t.draggable(!1), this.getBgLayer(e).add(t), this.storeSerializedGroup(t), { konvaGroup: t, added: !0 });
  }
  storeSerializedGroup(e) {
    const t = e.id(), n = this.shapeGroupStore.get(t);
    this.shapeGroupStore.set(t, {
      ...n,
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
class ws extends Ee {
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
    const n = Math.abs(t.x - this.vertex.x) / 2, r = Math.abs(t.y - this.vertex.y) / 2, s = {
      x: (t.x - this.vertex.x) / 2 + this.vertex.x,
      y: (t.y - this.vertex.y) / 2 + this.vertex.y,
      radiusX: n,
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
    const n = e.id, r = this.getShapeGroupById(n);
    if (r) {
      r.getChildren().forEach((i) => {
        i instanceof M.Ellipse && (t.color !== void 0 && i.stroke(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(n, s);
    }
  }
}
class Cs extends Ee {
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
    const n = this.line.points().concat([t.x, t.y]);
    this.line.points(n);
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
    const n = e.id, r = this.getShapeGroupById(n);
    if (r) {
      r.getChildren().forEach((i) => {
        i instanceof M.Line && (t.color !== void 0 && i.stroke(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(n, s);
    }
  }
}
class As extends Ee {
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
    const n = this.line.points().concat([t.x, t.y]);
    this.line.points(n);
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
      const t = this.line.points(), n = this.correctLineIfStraight(t);
      this.line.points(n), this.setShapeGroupDone({
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
    const t = 2, n = e[0], r = e[1], s = e[e.length - 2], i = e[e.length - 1], a = s - n, l = i - r;
    if (a === 0 && l !== 0)
      return e.map((p, g) => g % 2 === 0 ? n : p);
    if (l === 0 && a !== 0)
      return e.map((p, g) => g % 2 === 0 ? p : r);
    if (a === 0 && l === 0)
      return e;
    const u = Math.atan2(l, a), d = Math.abs(u * (180 / Math.PI)), h = d <= t || d >= 180 - t || d >= 90 - t && d <= 90 + t && Math.abs(a) > Math.abs(l), f = d >= 90 - t && d <= 90 + t && Math.abs(l) > Math.abs(a) || d >= 180 - t || d <= t;
    return h ? e.map((p, g) => g % 2 === 0 ? p : r) : f ? e.map((p, g) => g % 2 === 0 ? n : p) : e;
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
    const n = e.id, r = this.getShapeGroupById(n);
    if (r) {
      r.getChildren().forEach((i) => {
        i instanceof M.Line && (t.color !== void 0 && i.stroke(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(n, s);
    }
  }
}
const Ts = {
  placement: "bottom-start",
  middleware: [Ao()]
}, Tn = 200;
class xs {
  resolveFunction = null;
  container = null;
  inputElement = null;
  isActive = !1;
  isCleaningUp = !1;
  show(e, t, n, r) {
    return this.isActive && this.handleConfirm(), this.isActive = !0, this.isCleaningUp = !1, new Promise((s) => {
      this.resolveFunction = s, this.container = document.createElement("div"), this.container.id = zo, Object.assign(this.container.style, {
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: "1000"
      }), document.body.appendChild(this.container), Bt({
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
      }, this.container, Ts).then(({ x: a, y: l }) => {
        Object.assign(this.container.style, {
          left: `${a}px`,
          top: `${l}px`
        }), this.renderInputComponent(t, n, r);
      });
    });
  }
  renderInputComponent(e, t, n) {
    if (!this.container) return;
    const r = document.createElement("div"), s = document.createElement("textarea");
    s.placeholder = Te.t("annotator:editor.text.startTyping"), Object.assign(s.style, {
      minHeight: "40px",
      width: `${Tn}px`,
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
        boxShadow: `0 0 0 1px ${n}`
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
const ks = new xs();
async function Es(o, e, t, n) {
  return ks.show(o, e, t, n);
}
class Rs extends Ee {
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
    const n = this.konvaStage.scale(), r = this.konvaStage.container();
    if (e.currentTarget !== this.konvaStage)
      return;
    this.isPainting = !0, this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup);
    const s = r.getBoundingClientRect(), i = s.left + t.x * n.x, a = s.top + t.y * n.y, l = await Es(
      { x: i, y: a },
      this.currentAnnotation.style.fontSize,
      this.currentAnnotation.style.color,
      this.primaryColor
    );
    this.inputDoneHandler(l, n, t, this.currentAnnotation.style.color, this.currentAnnotation.style.fontSize);
  }
  /**
   * 处理输入完成后的操作。
   * @param inputValue string 输入值
   * @param scale 缩放比例
   * @param pos 相对位置坐标
   */
  async inputDoneHandler(e, t, n, r, s) {
    const i = e.trim();
    if (i === "") {
      this.delShapeGroup(this.currentShapeGroup.id), this.currentShapeGroup = null;
      return;
    }
    const l = new M.Text({
      text: i,
      fontSize: s,
      padding: 2
    }).width(), u = l > Tn ? Tn : l, d = new M.Text({
      x: n.x,
      y: n.y + 2,
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
    const n = e.id, r = this.getShapeGroupById(n);
    if (r) {
      r.getChildren().forEach((i) => {
        i instanceof M.Text && (t.color !== void 0 && i.fill(t.color), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(n, s);
    }
  }
}
class Bn extends Ee {
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
  convertTextSelection(e, t) {
    this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup);
    const n = t.getBoundingClientRect(), r = e.map((i) => {
      const a = i.getBoundingClientRect();
      return this.calculateRelativePosition(a, n);
    });
    this.mergeSpanRectsByRow(r).forEach((i) => {
      const a = this.createShape(i.x, i.y, i.width, i.height);
      this.currentShapeGroup.konvaGroup.add(a);
    }), this.setShapeGroupDone({
      id: this.currentShapeGroup.id,
      contentsObj: {
        text: "",
        selectedText: this.getSelectedText(e)
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
    const t = 2, n = 1, r = [...e].sort((u, d) => u.y - d.y), s = [];
    let i = [r[0]], a = r[0].y;
    for (let u = 1; u < r.length; u++)
      Math.abs(r[u].y - a) < t ? i.push(r[u]) : (s.push(i), i = [r[u]], a = r[u].y);
    s.push(i);
    const l = [];
    for (const u of s) {
      u.sort((h, f) => h.x - f.x);
      let d = { ...u[0] };
      for (let h = 1; h < u.length; h++) {
        const f = u[h], p = d.x + d.width;
        if (f.x - p <= n) {
          const v = f.x + f.width;
          d.width = Math.max(p, v) - d.x, d.height = Math.max(d.height, f.height), d.y = Math.min(d.y, f.y);
        } else
          l.push({ ...d }), d = { ...f };
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
    const n = this.konvaStage.scale(), r = (e.x - t.x) / n.x, s = (e.y - t.y) / n.y, i = e.width / n.x, a = e.height / n.y;
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
  createShape(e, t, n, r) {
    switch (this.currentAnnotation.type) {
      case R.HIGHLIGHT:
        return this.createHighlightShape(e, t, n, r);
      case R.UNDERLINE:
        return this.createUnderlineShape(e, t, n, r);
      case R.STRIKEOUT:
        return this.createStrikeoutShape(e, t, n, r);
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
  createHighlightShape(e, t, n, r) {
    return new M.Rect({
      x: e,
      y: t,
      width: n,
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
  createUnderlineShape(e, t, n, r) {
    return new M.Rect({
      x: e,
      y: r + t - 2,
      width: n,
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
  createStrikeoutShape(e, t, n, r) {
    return new M.Rect({
      x: e,
      y: t + r / 2,
      width: n,
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
    const n = e.id, r = this.getShapeGroupById(n);
    if (r) {
      r.getChildren().forEach((i) => {
        e.type === R.HIGHLIGHT && i instanceof M.Rect && (t.color !== void 0 && i.fill(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity)), e.type === R.UNDERLINE && i instanceof M.Rect && (t.color !== void 0 && i.fill(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity)), e.type === R.STRIKEOUT && i instanceof M.Rect && (t.color !== void 0 && i.stroke(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(n, s);
    }
  }
}
class Ps extends Ee {
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
    const n = {
      x: Math.min(this.vertex.x, t.x),
      y: Math.min(this.vertex.y, t.y),
      width: Math.abs(t.x - this.vertex.x),
      height: Math.abs(t.y - this.vertex.y)
    };
    this.rect?.setAttrs(n);
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
    const n = e.id, r = this.getShapeGroupById(n);
    if (r) {
      r.getChildren().forEach((i) => {
        i instanceof M.Rect && (t.color !== void 0 && i.stroke(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(n, s);
    }
  }
}
class $n extends Ee {
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
      const { width: n, height: r } = t.getClientRect(), { newWidth: s, newHeight: i } = Kt(n, r, 96), a = { x: s / 2, y: i / 2 }, l = new M.Rect({
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
      const f = e.toDataURL();
      e.destroy(), Go(
        Lt,
        `url(${f}) ${a.x} ${a.y}, default`
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
    this.signatureUrl && t && M.Image.fromURL(this.signatureUrl, async (n) => {
      const { width: r, height: s } = n.getClientRect(), { newWidth: i, newHeight: a } = Kt(r, s, 120), l = { x: i / 2, y: a / 2 };
      this.signatureImage = n, this.signatureImage.setAttrs({
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
  activateWithSignature(e, t, n) {
    super.activate(e, t), this.signatureUrl = n, n && this.createCursorImg();
  }
  /**
   * 将序列化的 Konva.Group 添加到图层，并恢复其中的签名图片。
   * @param konvaStage Konva 舞台对象
   * @param konvaString 序列化的 Konva.Group 字符串表示
   */
  addSerializedGroupToLayer(e, t) {
    const n = M.Node.create(t), { konvaGroup: r, added: s } = this.registerSerializedGroup(e, n);
    if (!s) return;
    const i = this.getGroupNodesByClassName(r, "Image")[0];
    if (!i) return;
    const a = i.getAttr("base64");
    a && M.Image.fromURL(a, (l) => {
      l.setAttrs(i.getAttrs()), i.destroy(), r.add(l), r.getLayer()?.batchDraw(), r.fire(nn);
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
class Vn extends Ee {
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
      const { width: n, height: r } = t.getClientRect(), { newWidth: s, newHeight: i } = Kt(n, r, 96), a = { x: s / 2, y: i / 2 }, l = new M.Rect({
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
      const f = e.toDataURL();
      e.destroy(), Go(
        Lt,
        `url(${f}) ${a.x} ${a.y}, default`
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
    this.stampUrl && t && M.Image.fromURL(this.stampUrl, async (n) => {
      const { width: r, height: s } = n.getClientRect(), { newWidth: i, newHeight: a } = Kt(r, s, 120), l = { x: i / 2, y: a / 2 };
      this.stampImage = n, this.stampImage.setAttrs({
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
  activateWithStamp(e, t, n) {
    super.activate(e, t), this.stampUrl = n, n && this.createCursorImg();
  }
  /**
   * 将序列化的 Konva.Group 添加到图层，并恢复其中的签章图片。
   * @param konvaStage Konva 舞台对象
   * @param konvaString 序列化的 Konva.Group 字符串表示
   */
  addSerializedGroupToLayer(e, t) {
    const n = M.Node.create(t), { konvaGroup: r, added: s } = this.registerSerializedGroup(e, n);
    if (!s) return;
    const i = this.getGroupNodesByClassName(r, "Image")[0];
    if (!i) return;
    const a = i.getAttr("base64"), l = this.getGroupNodesByClassName(r, "Text")[0];
    a && M.Image.fromURL(a, (u) => {
      u.setAttrs(i.getAttrs()), i.destroy(), r.add(u), l && l.moveToTop(), r.getLayer()?.batchDraw(), r.fire(nn);
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
function Fo({
  x: o,
  y: e,
  fill: t = "rgba(255, 221, 31, 1)",
  stroke: n = "#C0A042",
  strokeWidth: r = 0.8,
  cornerSize: s = 4
}) {
  const u = [], d = new M.Rect({
    x: o,
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
    stroke: n,
    strokeWidth: r
  });
  u.push(d);
  const h = new M.Line({
    points: [
      o + 18 - 5,
      e,
      o + 18,
      e + 5,
      o + 18 - 5,
      e + 5
    ],
    fill: "rgba(255,255,255,0.85)",
    closed: !0,
    stroke: "rgba(0,0,0,0.12)",
    strokeWidth: 0.6
  });
  u.push(h);
  const f = new M.Line({
    points: [
      o + 18 - 5,
      e + 5,
      o + 18,
      e + 5,
      o + 18 - 5,
      e
    ],
    stroke: "rgba(0,0,0,0.10)",
    strokeWidth: 0.4
  });
  u.push(f);
  const p = 4, g = 4, v = (20 - p * 2) / (g + 1);
  for (let y = 1; y <= g; y++) {
    const b = e + p + y * v, S = new M.Line({
      points: [
        o + 3,
        b,
        o + 18 - (y === 1 ? 7 : 4),
        b
      ],
      stroke: "rgba(0,0,0,0.45)",
      strokeWidth: 0.7,
      lineCap: "round"
    });
    u.push(S);
  }
  return u;
}
class Ns extends Ee {
  constructor(e) {
    super({ ...e, editorType: R.NOTE });
  }
  mouseDownHandler() {
  }
  mouseMoveHandler() {
  }
  async mouseUpHandler(e) {
    const t = "rgb(255, 221, 31)", n = this.konvaStage.getRelativePointerPosition();
    if (e.currentTarget !== this.konvaStage || !n)
      return;
    const { x: r, y: s } = n;
    this.isPainting = !0, this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup);
    const i = Fo({ x: r, y: s, fill: t });
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
function jo(o) {
  return {
    borderStrokeWidth: 2,
    borderDash: o ? [] : [3, 3],
    opacity: 1,
    authorLabelOpacity: 0.9,
    anchorFill: o ? "#fff" : "transparent",
    anchorStrokeWidth: o ? 2 : 0,
    anchorSize: o ? 10 : 0
  };
}
class Is {
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
    getAnnotationStore: n,
    canTransform: r,
    onDelete: s,
    onSelected: i,
    onDeselected: a,
    onSelectionChanged: l,
    onHoverStart: u,
    onHoverEnd: d,
    onCancel: h,
    onChanged: f
  }) {
    this.primaryColor = e, this.konvaCanvasStore = t, this.getAnnotationStore = n, this.canTransform = r, this.onDelete = s, this.onSelected = i, this.onDeselected = a, this.onSelectionChanged = l, this.onHoverStart = u, this.onHoverEnd = d, this.onCancel = h, this.onChanged = f;
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
    return this.getBackgroundLayer(e).getChildren((t) => t.name() === Oe);
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
    e.forEach((n) => {
      this.removeGroupHoverEvents(n), this.bindGroupHoverEvents(n), n.getChildren().forEach((r) => {
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
      this.removeGroupHoverEvents(t), t.getChildren().forEach((n) => {
        n instanceof M.Shape && this.removeShapeEvents(n);
      });
    });
  }
  /**
   * 为给定形状绑定点击事件。
   * @param shape - 要绑定事件的形状。
   * @param konvaStage - 形状所在的 Konva Stage。
   */
  bindShapeEvents(e, t) {
    this.removeShapeEvents(e), e.on("pointerclick", (n) => {
      n.evt.button === 0 && this.handleShapeClick(e, t, !0);
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
  handleShapeClick(e, t, n = !1) {
    const r = e.findAncestor(`.${Oe}`);
    if (!r) return;
    this.hoveredGroupId === r.id() && this.clearCanvasHover(), this.clearTransformers();
    const s = !n;
    if (this.createTransformer(r, t, s), !s) {
      const i = this.transformerStore.get(r.id());
      if (i) {
        const a = i.getClientRect();
        this.onSelected(r.id(), n, a);
      }
    }
  }
  /**
   * 创建变形区域
   * @param group
   * @param konvaStage
   */
  createTransformer(e, t, n) {
    const r = e.children[0], s = e.id();
    this.currentTransformerId = s;
    const i = this.getAnnotationStore(s);
    if (e.off("dragend"), !i) return;
    const a = De.find((f) => f.pdfjsAnnotationType === i.pdfjsType), l = this.canTransform(i), u = jo(l), d = new M.Transformer({
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
      boundBoxFunc: (f, p) => (p.width = Math.max(30, p.width), p)
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
        const f = d.nodes().map((g) => g.getClientRect()), p = this.getTotalBox(f);
        d.nodes().forEach((g) => {
          const v = g.getAbsolutePosition(), y = p.x - v.x, b = p.y - v.y, S = p.width / 2, A = p.height / 2, T = { ...v };
          p.x + S < 0 && (T.x = -y - S), p.y + A < 0 && (T.y = -b - A), p.x + S > t.width() && (T.x = t.width() - S - y), p.y + A > t.height() && (T.y = t.height() - A - b), g.setAbsolutePosition(T);
        });
      });
    }), d.nodes([e]), this.getBackgroundLayer(t).add(d), this.transformerStore.set(s, d), this.onSelectionChanged(s), n && this.flashNodeWithTransformer(e, d, () => {
      this.onSelected(e.id(), !1, d.getClientRect());
    });
  }
  flashNodeWithTransformer(e, t, n) {
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
      }), f = this.tweenStore.get(a) || { fadeOut: null, fadeIn: null };
      f.fadeOut = h, this.tweenStore.set(a, f), h.play();
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
            t.getLayer() && (t.borderStrokeWidth(l), t.getLayer()?.batchDraw()), r++, r < s ? setTimeout(u, 100) : (this.cleanupTween(a), n && n());
          } catch {
            this.cleanupTween(a);
          }
        }
      }), f = this.tweenStore.get(a) || { fadeOut: null, fadeIn: null };
      f.fadeIn = h, this.tweenStore.set(a, f), h.play();
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
    let t = 1 / 0, n = 1 / 0, r = -1 / 0, s = -1 / 0;
    return e.forEach((i) => {
      t = Math.min(t, i.x), n = Math.min(n, i.y), r = Math.max(r, i.x + i.width), s = Math.max(s, i.y + i.height);
    }), {
      x: t,
      y: n,
      width: r - t,
      height: s - n
    };
  }
  /**
   * 根据悬停状态切换光标样式。
   * @param add - 是否添加悬停样式。
   */
  toggleCursorStyle(e) {
    document.body.classList.toggle(Ss, e);
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
    this.transformerStore.forEach((t, n) => {
      t && (t.nodes().forEach((r) => {
        r instanceof M.Group && (r.draggable(!1), r.off("dragend"));
      }), t.off("transformend transformstart dragstart dragend dragmove"), t.nodes([]), t.destroy()), this.cleanupTween(n);
    }), this.transformerStore.clear(), this.currentTransformerId = null, this.onSelectionChanged(null), e && this.onCancel();
  }
  /**
   * 停用指定变换器。
   * @param transformerId - 要停用的变换器ID。
   */
  deactivateTransformer(e) {
    if (e) {
      const t = this.transformerStore.get(e);
      t && t.nodes().forEach((n) => {
        n instanceof M.Group && n.draggable(!1);
      });
    }
  }
  selectedShape(e, t, n = !1) {
    const r = this.getGroupById(t, e);
    if (!r)
      return;
    const s = this.getFirstShapeInGroup(r);
    s && this.handleShapeClick(s, t, n);
  }
  /**
   * 清除选择器的所有状态和事件。
   */
  clear() {
    this.clearCanvasHover(), this.clearTransformers(), this.konvaCanvasStore.forEach((e) => {
      const { konvaStage: t } = e, n = this.getPageShapeGroups(t);
      this.disableStageEvents(t), this.disableShapeGroups(n);
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
    const { konvaStage: n } = t, r = this.getPageShapeGroups(n);
    this.disableStageEvents(n), this.bindStageEvents(n), this.enableShapeGroups(r, n), this.selectedId && this.selectedShape(this.selectedId, n, this.isSelectedByClick);
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
    const t = this.transformerStore.get(e), n = t?.nodes()[0], r = n?.getStage();
    !(n instanceof M.Group) || !r || (t?.off("transformend transformstart dragstart dragend dragmove"), t?.nodes([]), t?.destroy(), this.cleanupTween(e), this.transformerStore.delete(e), this._currentTransformerId = null, this.createTransformer(n, r, !1));
  }
  delete() {
    this.clearTransformers();
  }
}
var $e = /* @__PURE__ */ ((o) => (o.CANVAS = "canvas", o.SIDEBAR = "sidebar", o))($e || {});
const se = Zr((o, e) => ({
  annotations: /* @__PURE__ */ new Map(),
  originalAnnotations: /* @__PURE__ */ new Map(),
  selectedAnnotation: null,
  selectionRevision: 0,
  currentAnnotationType: null,
  getAnnotation: (t) => e().annotations.get(t),
  getByPage: (t) => {
    const { annotations: n } = e();
    return Array.from(n.values()).filter((r) => r.pageNumber === t);
  },
  addAnnotation: (t, n = !1) => (o((r) => {
    const s = new Map(r.annotations);
    if (s.set(t.id, t), n) {
      const i = new Map(r.originalAnnotations);
      return i.set(t.id, t), {
        annotations: s,
        originalAnnotations: i
      };
    }
    return { annotations: s };
  }), t),
  restoreAnnotation: (t, n) => e().annotations.has(t.id) ? !1 : (o((r) => {
    const s = Array.from(r.annotations.entries()), i = Math.max(0, Math.min(n, s.length));
    return s.splice(i, 0, [t.id, t]), { annotations: new Map(s) };
  }), !0),
  updateAnnotation: (t, n) => {
    let r = null;
    return o((s) => {
      const i = s.annotations.get(t);
      if (!i)
        return console.warn(`Annotation with id ${t} not found.`), s;
      r = {
        ...i,
        ...n
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
  setAnnotationReferenceNumbers: (t) => o((n) => {
    const r = (d) => {
      let h = !1;
      const f = new Map(d);
      return t.forEach((p, g) => {
        const v = f.get(g);
        !v || v.referenceNumber === p || (f.set(g, { ...v, referenceNumber: p }), h = !0);
      }), h ? f : d;
    }, s = r(n.annotations), i = r(n.originalAnnotations), a = n.selectedAnnotation?.store, l = a ? t.get(a.id) : void 0, u = a && l !== void 0 && a.referenceNumber !== l ? {
      store: { ...a, referenceNumber: l },
      source: n.selectedAnnotation?.source ?? null
    } : n.selectedAnnotation;
    return s === n.annotations && i === n.originalAnnotations && u === n.selectedAnnotation ? n : { annotations: s, originalAnnotations: i, selectedAnnotation: u };
  }),
  removeAnnotation: (t) => o((n) => {
    const r = new Map(n.annotations);
    if (r.has(t)) {
      r.delete(t);
      const s = n.selectedAnnotation?.store?.id === t;
      return {
        annotations: r,
        selectedAnnotation: s ? null : n.selectedAnnotation,
        selectionRevision: s ? n.selectionRevision + 1 : n.selectionRevision
      };
    }
    return console.warn(`Annotation with id ${t} not found.`), n;
  }),
  clearAnnotations: () => o((t) => ({
    annotations: /* @__PURE__ */ new Map(),
    originalAnnotations: /* @__PURE__ */ new Map(),
    selectedAnnotation: null,
    selectionRevision: t.selectedAnnotation ? t.selectionRevision + 1 : t.selectionRevision
  })),
  setSelectedAnnotation: (t, n) => o((r) => ({
    selectedAnnotation: t ? {
      store: t,
      source: n || null
    } : null,
    selectionRevision: r.selectionRevision + 1
  })),
  setCurrentAnnotationType: (t) => o({ currentAnnotationType: t }),
  clearSelectedAnnotation: () => o((t) => t.selectedAnnotation ? {
    selectedAnnotation: null,
    selectionRevision: t.selectionRevision + 1
  } : t)
}));
class Ms {
  isEditing;
  // 指示是否启用编辑模式
  onSelect;
  // 当选区被选中时调用的回调函数
  onHighlight;
  highlighterObj;
  root = null;
  isSelecting = !1;
  handleSelectionChange = () => {
    const e = window.getSelection();
    if (e?.type === "Caret" || e?.anchorNode === null) {
      this.isSelecting = !1, this.onSelect(null);
      return;
    }
    if (e && e.toString()) {
      const n = e.getRangeAt(0).commonAncestorContainer;
      if (this.root?.contains(n)) {
        this.isSelecting = !0;
        return;
      }
    }
    this.isSelecting = !1, this.onSelect(null);
  };
  handleSelectionEnd = () => {
    if (!this.isSelecting) return;
    this.isSelecting = !1;
    const e = window.getSelection(), t = e && e.rangeCount > 0 ? e.getRangeAt(0) : null;
    t && this.root?.contains(t.commonAncestorContainer) ? this.onSelect(t) : this.onSelect(null);
  };
  handleHighlightCreated = (e) => {
    const t = this.highlighterObj;
    if (!t) return;
    const r = e.sources.flatMap((s) => t.getDoms(s.id)).reduce((s, i) => {
      const a = i.closest(".page")?.getAttribute("data-page-number") ?? "-1";
      return (s[a] ||= []).push(i), s;
    }, {});
    this.onHighlight(r), t.removeAll(), window.getSelection()?.removeAllRanges();
  };
  /**
   * 构造一个新的 WebSelection 实例。
   * @param onSelect 当选区被选中时调用的回调函数
   */
  constructor({
    onSelect: e,
    onHighlight: t
  }) {
    this.isEditing = !1, this.onSelect = e, this.onHighlight = t, this.highlighterObj = null;
  }
  /**
   * 在指定的根元素和页码上创建一个高亮器。
   * @param root 要应用高亮器的根元素
   */
  create(e) {
    this.destroy(), this.root = e, this.highlighterObj = new Qr({
      $root: e,
      wrapTag: "mark"
    }), this.highlighterObj.stop(), document.addEventListener("selectionchange", this.handleSelectionChange), document.addEventListener("mouseup", this.handleSelectionEnd), document.addEventListener("touchend", this.handleSelectionEnd), this.highlighterObj.on("selection:create", this.handleHighlightCreated);
  }
  highlight(e) {
    e && this.highlighterObj?.fromRange(e);
  }
  isRangeSelectionActive() {
    return this.isSelecting;
  }
  destroy() {
    document.removeEventListener("selectionchange", this.handleSelectionChange), document.removeEventListener("mouseup", this.handleSelectionEnd), document.removeEventListener("touchend", this.handleSelectionEnd), this.highlighterObj && (this.highlighterObj.off("selection:create", this.handleHighlightCreated), this.highlighterObj.dispose(), this.highlighterObj = null), this.root = null, this.isSelecting = !1;
  }
}
class qe {
  pdfViewerApplication;
  id;
  inkLayerMetadata;
  constructor({ pdfViewerApplication: e, id: t, inkLayerMetadata: n }) {
    this.pdfViewerApplication = e, this.id = t, this.inkLayerMetadata = n;
  }
  /**
   * @description pdfjs annotation rect 转为 konva 的 rect
   * @param annotation
   * @returns
   */
  convertRect(e, t, n) {
    const r = n / t, [s, i, a, l] = e, u = s, d = r - l, h = a - s, f = l - i;
    return { x: u, y: d, width: h, height: f };
  }
  /**
   * @description pdfjs annotation quadPoint 转为 konva 的 rect
   * @param quadPoint  [左上，右上，左下，右下]
   * @param scale
   * @param height
   * @returns
   */
  convertQuadPoints(e, t, n) {
    const r = n / t, s = e[0].x, i = r - e[0].y, a = e[1].x - e[0].x, l = e[1].y - e[3].y;
    return { x: s, y: i, width: a, height: l };
  }
  convertPoint(e, t, n) {
    const r = n / t;
    return { x: e.x, y: r - e.y };
  }
  convertCoordinates(e, t, n) {
    const r = n / t, s = e[0], i = r - e[1], a = e[2], l = r - e[3];
    return { x: s, y: i, x1: a, y1: l };
  }
  getComments(e, t) {
    const n = [];
    return t.forEach((r) => {
      r.annotationType === oe.TEXT && r.inReplyTo === e.id && n.push({
        id: r.id,
        title: r.titleObj.str,
        date: r.modificationDate,
        content: r.contentsObj.str
      });
    }), n;
  }
}
class Ds extends qe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Xe(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, { x: s, y: i, width: a, height: l } = this.convertRect(
      e.rect,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), u = new M.Group({
      draggable: !1,
      name: Oe,
      id: e.id
    }), d = new M.Ellipse({
      radiusX: a / 2,
      radiusY: l / 2,
      x: s + a / 2,
      y: i + l / 2,
      strokeScaleEnabled: !1,
      strokeWidth: r,
      stroke: n,
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
      color: n,
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
class Ls extends qe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Xe(e.defaultAppearanceData.fontColor), r = e.defaultAppearanceData.fontSize, s = e.contentsObj.str, { x: i, y: a } = this.convertRect(
      e.rect,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), l = new M.Group({
      draggable: !1,
      name: Oe,
      id: e.id
    }), u = new M.Text({
      x: i,
      y: a + 2,
      text: s,
      fontSize: r,
      fill: n
    });
    return l.add(u), {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: l.toJSON(),
      konvaClientRect: l.getClientRect(),
      title: e.titleObj.str,
      type: R.FREETEXT,
      color: n,
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
class hn extends qe {
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
  createHighlightShape(e, t, n, r, s) {
    return new M.Rect({
      x: e,
      y: t,
      width: n,
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
  createUnderlineShape(e, t, n, r, s) {
    return new M.Rect({
      x: e,
      y: r + t - 1.5,
      width: n,
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
  createStrikeoutShape(e, t, n, r, s) {
    return new M.Rect({
      x: e,
      y: t + r / 2,
      width: n,
      stroke: s,
      strokeWidth: 0.5,
      hitStrokeWidth: 10,
      height: 0.5
    });
  }
  decodePdfAnnotation(e, t) {
    const n = Xe(e.color || [0, 0, 0]), s = {
      [oe.HIGHLIGHT]: R.HIGHLIGHT,
      [oe.UNDERLINE]: R.UNDERLINE,
      [oe.STRIKEOUT]: R.STRIKEOUT
    }[e.annotationType] || R.HIGHLIGHT, i = new M.Group({
      draggable: !1,
      name: Oe,
      id: e.id
    }), a = (u) => {
      const { x: d, y: h, width: f, height: p } = this.convertQuadPoints(u, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
      switch (e.annotationType) {
        case oe.HIGHLIGHT:
          return this.createHighlightShape(d, h, f, p, n);
        case oe.UNDERLINE:
          return this.createUnderlineShape(d, h, f, p, n);
        case oe.STRIKEOUT:
          return this.createStrikeoutShape(d, h, f, p, n);
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
      color: n,
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
class Os extends qe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Xe(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, { x: s, y: i, width: a, height: l } = this.convertRect(
      e.rect,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), u = new M.Group({
      draggable: !1,
      name: Oe,
      id: e.id
    }), d = new M.Rect({
      x: s,
      y: i,
      width: a,
      height: l,
      strokeScaleEnabled: !1,
      stroke: n,
      strokeWidth: r,
      fill: e.borderStyle.width === 0 ? n : "",
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
      color: n,
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
class _s extends qe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    if (e.inkLists.length === 0)
      return null;
    const n = Xe(e.color || [0, 0, 0]), r = new M.Group({
      draggable: !1,
      name: Oe,
      id: e.id
    }), s = (a) => new M.Line({
      strokeScaleEnabled: !1,
      stroke: n,
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
        const { x: h, y: f } = this.convertPoint(d, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
        return [h, f];
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
      color: n,
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
class Hs extends qe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Xe(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, s = new M.Group({
      draggable: !1,
      name: Oe,
      id: e.id
    }), i = (p, g) => new M.Line({
      strokeScaleEnabled: !1,
      stroke: n,
      strokeWidth: r,
      hitStrokeWidth: 20,
      dash: e.borderStyle.style === 2 ? e.borderStyle.dashArray : [],
      globalCompositeOperation: "source-over",
      points: p
    }), { x: a, y: l, x1: u, y1: d } = this.convertCoordinates(
      e.lineCoordinates,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), h = i([a, l, u, d], e.lineEndings);
    s.add(h);
    const f = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: s.toJSON(),
      konvaClientRect: s.getClientRect(),
      title: e.titleObj.str,
      type: R.FREEHAND,
      color: n,
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
    return s.destroy(), f;
  }
}
class Gs extends qe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Xe(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, s = new M.Group({
      draggable: !1,
      name: Oe,
      id: e.id
    }), a = ((u) => {
      const d = [];
      return u?.forEach((h) => {
        const { x: f, y: p } = this.convertPoint(h, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
        d.push(f), d.push(p);
      }), new M.Line({
        strokeScaleEnabled: !1,
        stroke: n,
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
      color: n,
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
class Us extends qe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Xe(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, s = new M.Group({
      draggable: !1,
      name: Oe,
      id: e.id
    }), a = ((u) => {
      const d = [];
      return u?.forEach((h) => {
        const { x: f, y: p } = this.convertPoint(h, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
        d.push(f), d.push(p);
      }), new M.Line({
        strokeScaleEnabled: !1,
        stroke: n,
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
      color: n,
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
class zs extends qe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    if (e.inReplyTo) return null;
    const n = Xe(e.color || [0, 0, 0]), { x: r, y: s } = this.convertRect(e.rect, e.pageViewer.viewport.scale, e.pageViewer.viewport.height), i = new M.Group({
      draggable: !1,
      name: Oe,
      id: e.id
    }), a = Fo({ x: r, y: s, fill: n });
    i.add(...a);
    const l = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: i.toJSON(),
      konvaClientRect: i.getClientRect(),
      title: e.titleObj.str,
      type: R.NOTE,
      color: n,
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
function xn(o, e = 15) {
  if (o.length < 2) return "";
  const t = e * 1.3, n = o.reduce(
    (s, i) => ({ x: s.x + i.x, y: s.y + i.y }),
    { x: 0, y: 0 }
  );
  n.x /= o.length, n.y /= o.length;
  let r = "";
  for (let s = 0; s < o.length - 1; s++) {
    const i = o[s], a = o[s + 1], l = a.x - i.x, u = a.y - i.y, d = Math.hypot(l, u), h = Math.atan2(u, l), f = Math.cos(h + Math.PI / 2), p = Math.sin(h + Math.PI / 2), g = (i.x + a.x) / 2, v = (i.y + a.y) / 2, y = n.x - g, b = n.y - v, S = f * y + p * b > 0 ? -1 : 1, A = Math.max(2, Math.floor(d / t));
    for (let T = 0; T < A; T++) {
      const E = T / A, O = (T + 1) / A, G = i.x + l * E, j = i.y + u * E, W = i.x + l * O, L = i.y + u * O, k = (G + W) / 2 + f * e * S, N = (j + L) / 2 + p * e * S;
      s === 0 && T === 0 && (r += `M ${G} ${j} `), r += `Q ${k} ${N} ${W} ${L} `;
    }
  }
  return r;
}
class Fs extends qe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Xe(e.color || [0, 0, 0]), s = ("inkLists" in e ? e.inkLists?.[0] ?? [] : e.vertices ?? []).map(
      (d) => this.convertPoint(
        d,
        e.pageViewer.viewport.scale,
        e.pageViewer.viewport.height
      )
    );
    if (s.length < 3) return null;
    const i = new M.Group({
      draggable: !1,
      name: Oe,
      id: e.id
    }), a = "inkLists" in e ? s.map((d, h) => `${h === 0 ? "M" : "L"} ${d.x} ${d.y}`).join(" ") : xn([...s, s[0]]), l = new M.Path({
      data: a,
      strokeScaleEnabled: !1,
      stroke: n,
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
      color: n,
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
function Yn(o, e) {
  return Math.hypot(e.x - o.x, e.y - o.y);
}
class js extends qe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = e.inkLists?.[0] ?? [];
    if (n.length < 2) return null;
    const r = n.map((p) => this.convertPoint(
      p,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    )), s = r[0], i = r[1], a = r[3], l = r[4], u = a && l ? { x: (a.x + l.x) / 2, y: (a.y + l.y) / 2 } : void 0, d = Xe(e.color || [0, 0, 0]), h = new M.Group({ draggable: !1, name: Oe, id: e.id });
    h.add(new M.Arrow({
      points: [s.x, s.y, i.x, i.y],
      stroke: d,
      fill: d,
      strokeWidth: e.borderStyle.width || 1,
      opacity: this.inkLayerMetadata?.opacity ?? 1,
      pointerLength: u ? Yn(i, u) : 10,
      pointerWidth: a && l ? Yn(a, l) : 10,
      lineCap: "round",
      lineJoin: "round",
      hitStrokeWidth: 20,
      strokeScaleEnabled: !1
    }));
    const f = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: h.toJSON(),
      konvaClientRect: h.getClientRect(),
      title: e.titleObj.str,
      type: R.ARROW,
      color: d,
      pdfjsType: oe.LINE,
      subtype: "Arrow",
      date: e.modificationDate,
      contentsObj: { text: e.contentsObj.str },
      comments: this.getComments(e, t),
      user: { id: e.titleObj.str, name: e.titleObj.str },
      native: !0
    };
    return h.destroy(), f;
  }
}
class Ws extends qe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Xe(e.color || [0, 0, 0]), { x: r, y: s } = this.convertRect(
      e.rect,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), i = new M.Group({ draggable: !1, name: Oe, id: e.id });
    i.add(new M.Text({
      x: r,
      y: s,
      text: e.contentsObj.str,
      width: this.inkLayerMetadata?.textWidth,
      fontSize: this.inkLayerMetadata?.fontSize ?? 14,
      fill: n,
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
      color: n,
      pdfjsType: oe.FREETEXT,
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
const Bs = "pdfjs_internal_editor_";
class $s {
  pdfViewerApplication;
  constructor(e) {
    this.pdfViewerApplication = e;
  }
  async getAnnotations() {
    const e = this.pdfViewerApplication.pdfDocument, t = this.pdfViewerApplication, n = e.numPages, r = Array.from(
      { length: n },
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
      const n = await Mn.load(await t.getData());
      n.getPages().forEach((r) => {
        r.node.lookupMaybe(F.of("Annots"), Co)?.asArray().forEach((i) => {
          const a = n.context.lookupMaybe(i, Sn), l = a?.get(F.of("Subtype"))?.toString(), u = a?.lookupMaybe(F.of("BE"), Sn), d = l === "/Polygon" && (u?.get(F.of("S"))?.toString() === "/C" || a?.get(F.of("IT"))?.toString() === "/PolygonCloud"), h = a?.get(F.of("InkLayerType"))?.toString().slice(1);
          if (!d && !(h === "Cloud" && l === "/Ink" || h === "FreeText" && l === "/Text" || h === "Arrow" && l === "/Ink")) return;
          const p = a?.get(F.of("NM")), g = p ? n.context.lookup(p) : void 0, v = g instanceof re || g instanceof wo ? g.decodeText() : i instanceof Yr ? `${i.objectNumber}R` : void 0;
          if (!v) return;
          const y = d ? "Cloud" : h;
          if (y !== "Cloud" && y !== "FreeText" && y !== "Arrow") return;
          const b = a?.lookupMaybe(F.of("InkLayerFontSize"), Q)?.asNumber(), S = a?.lookupMaybe(F.of("InkLayerTextWidth"), Q)?.asNumber(), A = a?.lookupMaybe(F.of("CA"), Q)?.asNumber();
          e.set(v, { type: y, fontSize: b, textWidth: S, opacity: A });
        });
      });
    } catch (n) {
      console.warn("InkLayer could not inspect PDF annotation metadata.", n);
    }
    return e;
  }
  decodeAnnotation(e, t, n) {
    const r = {
      [oe.CIRCLE]: Ds,
      [oe.FREETEXT]: Ls,
      [oe.HIGHLIGHT]: hn,
      [oe.UNDERLINE]: hn,
      [oe.STRIKEOUT]: hn,
      [oe.SQUARE]: Os,
      [oe.INK]: _s,
      [oe.LINE]: Hs,
      [oe.POLYGON]: Gs,
      [oe.POLYLINE]: Us,
      [oe.TEXT]: zs
    }, s = n.get(e.id);
    let i = r[e.annotationType];
    return s?.type === "Cloud" && (e.annotationType === oe.POLYGON || e.annotationType === oe.INK) && (i = Fs), s?.type === "FreeText" && e.annotationType === oe.TEXT && (i = Ws), s?.type === "Arrow" && e.annotationType === oe.INK && (i = js), i ? new i({
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
    this.pdfViewerApplication?.pdfDocument?.annotationStorage?.setValue(`${Bs}${e.id}`, {
      deleted: !0,
      id: e.id,
      pageIndex: e.pageNumber - 1
    });
  }
  async decodePdfAnnotation() {
    const [e, t] = await Promise.all([
      this.getAnnotations(),
      this.getInkLayerAnnotationMetadata()
    ]), n = /* @__PURE__ */ new Map();
    return e.forEach((r) => {
      this.cleanAnnotationStore(r);
      const s = this.decodeAnnotation(r, e, t);
      s && n.set(r.id, s);
    }), n;
  }
}
class Vs extends Ee {
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
    const n = [this.startPoint.x, this.startPoint.y, t.x, t.y];
    this.arrow?.show(), this.arrow?.setAttrs({ points: n });
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
    const t = e[2] - e[0], n = e[3] - e[1];
    return Math.hypot(t, n) < Ee.MinSize;
  }
  /**
   * @description 更改注释样式
   * @param annotationStore
   * @param styles
   */
  changeStyle(e, t) {
    const n = e.id, r = this.getShapeGroupById(n);
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
      t.color !== void 0 && (s.color = t.color), this.setChanged(n, s);
    }
  }
}
class Ys extends Ee {
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
        const e = [...this.points, this.points[0]], t = xn(e);
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
    const n = xn(t);
    this.cloudPath.data(n);
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
    const n = e.id, r = this.getShapeGroupById(n);
    if (r) {
      r.getChildren().forEach((i) => {
        i instanceof M.Path && (t.color !== void 0 && i.stroke(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(n, s);
    }
  }
}
const Ks = {
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
}, Xs = {
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
}, qs = {
  Highlight: "highlight",
  Underline: "underline",
  Squiggly: "squiggly",
  StrikeOut: "strikeout"
}, Js = {
  highlight: "Highlight",
  underline: "Underline",
  squiggly: "Squiggly",
  strikeout: "StrikeOut"
}, Zs = {
  Square: "rect",
  Circle: "ellipse",
  Polygon: "polygon",
  PolyLine: "polygon",
  Cloud: "cloud"
};
function Ot(o) {
  const e = Ks[o.type] || "note", t = Qs(o), n = {
    pageIndex: o.pageNumber - 1,
    // 转换为 0-based
    geometry: t,
    coordinateSystem: "pdf-user-space"
  }, r = ea(o, e), s = {
    strokeColor: o.color || void 0,
    fillColor: o.color ? ta(o.color, 0.3) : void 0,
    opacity: 1
  }, i = {}, a = {
    referenceNumber: o.referenceNumber,
    createdAt: o.date || void 0,
    updatedAt: o.date || void 0,
    authorId: o.user,
    isNative: o.native,
    source: o.native ? "pdfjs" : "inklayer"
  };
  return {
    id: o.id,
    kind: e,
    target: n,
    payload: r,
    appearance: s,
    relations: i,
    meta: a,
    extensions: {
      // 保留原始实现细节
      konva: {
        serialized: o.konvaString,
        clientRect: o.konvaClientRect
      },
      pdfjs: {
        type: oe[o.pdfjsType],
        subtype: o.subtype
      },
      legacy: {
        annotationType: o.type,
        title: o.title,
        contentsObj: o.contentsObj,
        comments: o.comments
      }
    }
  };
}
function Qs(o) {
  const e = Xs[o.type] || "rect", { x: t, y: n, width: r, height: s } = o.konvaClientRect;
  switch (e) {
    case "rect":
      return { type: "rect", rect: { x: t, y: n, width: r, height: s } };
    case "quad":
      return {
        type: "quad",
        quads: [{
          p1: { x: t, y: n },
          p2: { x: t + r, y: n },
          p3: { x: t, y: n + s },
          p4: { x: t + r, y: n + s }
        }]
      };
    case "line":
      return { type: "line", start: { x: t, y: n }, end: { x: t + r, y: n + s } };
    case "path":
      return {
        type: "path",
        points: [{ x: t, y: n }, { x: t + r, y: n }, { x: t + r, y: n + s }, { x: t, y: n + s }],
        closed: !0
      };
    case "poly":
      return {
        type: "poly",
        points: [{ x: t, y: n }, { x: t + r, y: n }, { x: t + r, y: n + s }, { x: t, y: n + s }],
        closed: !0
      };
  }
}
function ea(o, e) {
  const t = o.subtype;
  switch (e) {
    case "text-markup":
      return {
        kind: "text-markup",
        variant: qs[t] || "highlight",
        text: o.contentsObj?.text || "",
        selectedText: o.contentsObj?.selectedText,
        color: o.color || void 0
      };
    case "note":
      return {
        kind: "note",
        text: o.contentsObj?.text || o.title || ""
      };
    case "ink":
      return {
        kind: "ink",
        color: o.color || void 0,
        width: o.konvaClientRect.height || 2
      };
    case "shape":
      return {
        kind: "shape",
        shape: o.type === R.CLOUD ? "cloud" : Zs[t] || "rect"
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
        name: o.title || "custom-stamp",
        label: o.title || void 0,
        source: "custom"
      };
    default:
      return;
  }
}
function ta(o, e) {
  if (o.startsWith("rgba")) return o;
  if (o.startsWith("#")) {
    const t = o.slice(1), n = parseInt(t.slice(0, 2), 16), r = parseInt(t.slice(2, 4), 16), s = parseInt(t.slice(4, 6), 16);
    return `rgba(${n}, ${r}, ${s}, ${e})`;
  }
  return o;
}
function na(o) {
  const e = o.kind, t = o.extensions, n = t?.legacy, r = t?.konva, s = o.target.geometry, i = t?.pdfjs?.subtype || sa(e, o.payload), a = ia(t?.pdfjs?.type) ?? ra(e, o.payload), l = n?.annotationType ?? (e === "shape" && i === "PolyLine" ? R.CLOUD : oa(e, o.payload));
  return {
    id: o.id,
    referenceNumber: o.meta?.referenceNumber,
    pageNumber: o.target.pageIndex + 1,
    // 转换回 1-based
    konvaString: r?.serialized || "",
    konvaClientRect: r?.clientRect || da(s),
    title: n?.title || aa(o.payload),
    type: l,
    color: o.appearance?.strokeColor || null,
    subtype: i,
    pdfjsType: a,
    date: o.meta?.createdAt || null,
    contentsObj: n?.contentsObj || ca(o.payload),
    comments: n?.comments || [],
    user: la(o.meta),
    native: o.meta?.isNative || !1
  };
}
function oa(o, e) {
  if (o === "shape" && e?.kind === "shape") {
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
  }[o] || R.NONE;
}
function ra(o, e) {
  if (o === "shape" && e?.kind === "shape") {
    if (e.shape === "cloud") return oe.POLYLINE;
    if (e.shape === "ellipse") return oe.CIRCLE;
    if (e.shape === "polygon") return oe.POLYGON;
  }
  return {
    "text-markup": oe.HIGHLIGHT,
    note: oe.TEXT,
    ink: oe.INK,
    shape: oe.SQUARE,
    line: oe.LINE,
    stamp: oe.STAMP,
    file: oe.FILEATTACHMENT
  }[o] || oe.NONE;
}
function ia(o) {
  if (!o) return;
  const e = oe[o];
  return typeof e == "number" ? e : void 0;
}
function sa(o, e) {
  if (!e) return "None";
  switch (o) {
    case "text-markup":
      return e.kind !== "text-markup" ? "Highlight" : Js[e.variant];
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
function aa(o) {
  if (!o) return "";
  switch (o.kind) {
    case "note":
      return o.text.slice(0, 50);
    case "stamp":
      return o.label || o.name;
    default:
      return "";
  }
}
function ca(o) {
  if (!o) return null;
  switch (o.kind) {
    case "text-markup":
      return {
        text: o.text || "",
        selectedText: o.selectedText
      };
    case "note":
      return { text: o.text };
    default:
      return null;
  }
}
function la(o) {
  return o?.authorId ? typeof o.authorId == "string" ? { id: o.authorId, name: o.authorId } : {
    id: o.authorId.id,
    name: o.authorId.name || o.authorId.id
  } : { id: "unknown", name: "Unknown" };
}
function da(o) {
  switch (o.type) {
    case "rect":
      return {
        x: o.rect.x,
        y: o.rect.y,
        width: o.rect.width,
        height: o.rect.height
      };
    case "quad": {
      const e = o.quads.flatMap((i) => [i.p1, i.p2, i.p3, i.p4]), t = e.map((i) => i.x), n = e.map((i) => i.y), r = Math.min(...t), s = Math.min(...n);
      return {
        x: r,
        y: s,
        width: Math.max(...t) - r,
        height: Math.max(...n) - s
      };
    }
    case "line":
      return {
        x: Math.min(o.start.x, o.end.x),
        y: Math.min(o.start.y, o.end.y),
        width: Math.abs(o.end.x - o.start.x),
        height: Math.abs(o.end.y - o.start.y)
      };
    case "path":
    case "poly": {
      if (o.points.length === 0)
        return { x: 0, y: 0, width: 0, height: 0 };
      const e = o.points.map((s) => s.x), t = o.points.map((s) => s.y), n = Math.min(...e), r = Math.min(...t);
      return {
        x: n,
        y: r,
        width: Math.max(...e) - n,
        height: Math.max(...t) - r
      };
    }
  }
}
function _t(o) {
  return o.map((e) => Ot(e));
}
function Wo(o) {
  return o.map((e) => na(e));
}
function Bo(o) {
  return !!(o?.id && o.id !== "null");
}
function Kn(o, e) {
  return Bo(o) && !!e?.id && o.id === e?.id;
}
class ua {
  getCurrentUser;
  getPermissions;
  reportedResolvers = /* @__PURE__ */ new WeakSet();
  constructor({ getCurrentUser: e, getPermissions: t }) {
    this.getCurrentUser = e, this.getPermissions = t;
  }
  can(e, t, n) {
    const r = this.getCurrentUser(), s = this.getPermissions(), a = (s?.mode ?? "unrestricted") === "unrestricted" ? !0 : this.ownerOnlyDecision(e, r, t, n);
    if (!s?.can) return a;
    try {
      return s.can({
        action: e,
        currentUser: r,
        annotation: t ? Ot(t) : void 0,
        comment: n,
        defaultAllowed: a
      }) ?? a;
    } catch (l) {
      return this.reportedResolvers.has(s.can) || (this.reportedResolvers.add(s.can), console.error("InkLayer annotation permission resolver failed.", l)), !1;
    }
  }
  ownerOnlyDecision(e, t, n, r) {
    switch (e) {
      case "annotation.create":
      case "annotation.comment":
        return Bo(t);
      case "annotation.transform":
      case "annotation.edit":
      case "annotation.delete":
      case "annotation.change-status":
        return Kn(t, n?.user);
      case "comment.edit":
      case "comment.delete":
        return Kn(t, r?.user);
    }
  }
}
function mt(o) {
  return typeof o == "number" && Number.isSafeInteger(o) && o > 0;
}
function ha(o) {
  const e = /^D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(?:([Zz])|([+-])(\d{2})'?(\d{2})?'?)?$/.exec(o);
  if (!e) return null;
  const [, t, n, r, s, i, a, l, u, d, h] = e, f = Number(t), p = Number(n), g = Number(r), v = Number(s), y = Number(i), b = Number(a);
  if (p < 1 || p > 12 || g < 1 || g > 31 || v > 23 || y > 59 || b > 59 || Number(d || 0) > 23 || Number(h || 0) > 59)
    return null;
  const S = Date.UTC(
    f,
    p - 1,
    g,
    v,
    y,
    b
  );
  if (!Number.isFinite(S)) return null;
  const A = new Date(S);
  if (A.getUTCFullYear() !== f || A.getUTCMonth() !== p - 1 || A.getUTCDate() !== g)
    return null;
  if (l || !u) return S;
  const T = (Number(d) * 60 + Number(h || 0)) * 60 * 1e3;
  return S - (u === "+" ? T : -T);
}
function Xn(o) {
  if (!o) return null;
  const e = ha(o);
  if (e !== null) return e;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/.test(o))
    return null;
  const t = Date.parse(o);
  return Number.isFinite(t) ? t : null;
}
function pa(o, e) {
  const t = Xn(o.date), n = Xn(e.date);
  return t !== null && n !== null && t !== n ? t - n : t !== null && n === null ? -1 : t === null && n !== null ? 1 : o.pageNumber !== e.pageNumber ? o.pageNumber - e.pageNumber : o.id < e.id ? -1 : o.id > e.id ? 1 : 0;
}
function Xt(o) {
  let e = 0;
  for (const t of o)
    mt(t.referenceNumber) && t.referenceNumber > e && (e = t.referenceNumber);
  return e;
}
function kn(o) {
  if (o >= Number.MAX_SAFE_INTEGER)
    throw new RangeError("Annotation reference number limit reached.");
  return o + 1;
}
function qn(o) {
  const e = [...o].sort(pa), t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), r = [];
  e.forEach((i) => {
    const a = i.referenceNumber;
    mt(a) && !t.has(a) ? (t.add(a), n.set(i.id, a)) : r.push(i);
  });
  let s = r.length > 0 ? kn(Xt(e)) : 1;
  return r.forEach((i, a) => {
    n.set(i.id, s), a < r.length - 1 && (s = kn(s));
  }), o.map((i) => {
    const a = n.get(i.id);
    return i.referenceNumber === a ? i : { ...i, referenceNumber: a };
  });
}
function fa(o, e, t = 1) {
  const n = Array.from(e), r = /* @__PURE__ */ new Set();
  for (const i of n)
    mt(i.referenceNumber) && r.add(i.referenceNumber);
  if (mt(o.referenceNumber) && !r.has(o.referenceNumber))
    return o;
  const s = Math.max(
    kn(Xt(n)),
    t
  );
  if (!mt(s))
    throw new RangeError("Annotation reference number limit reached.");
  return { ...o, referenceNumber: s };
}
const $o = 4;
function Vo(o) {
  const e = o.user?.name?.trim();
  return e || o.title?.trim() || null;
}
function ga(o) {
  const e = Vo(o), t = mt(o.referenceNumber);
  return t && e ? `#${o.referenceNumber} · ${e}` : t ? `#${o.referenceNumber}` : e;
}
function ma({
  selectionRect: o,
  labelWidth: e,
  labelHeight: t,
  stageWidth: n,
  stageHeight: r,
  gap: s = $o
}) {
  const i = Math.max(0, n - e), a = Math.max(0, r - t), l = Math.max(0, Math.min(i, o.x + o.width - e)), u = o.y - t - s, d = o.y + o.height + s, h = u >= 0 ? u : Math.max(0, Math.min(a, d));
  return { x: l, y: h };
}
function va(o, e, t) {
  return o.x < e.x + e.width + t && o.x + o.width + t > e.x && o.y < e.y + e.height + t && o.y + o.height + t > e.y;
}
function ya(o, e, t = $o) {
  const n = /* @__PURE__ */ new Map(), r = [];
  return [...o].sort(
    (i, a) => i.y - a.y || i.x - a.x || i.id.localeCompare(a.id)
  ).forEach((i) => {
    const a = Math.max(0, e - i.height), l = Math.max(1, i.height + t), u = Math.ceil(e / l) + 1;
    let d = { ...i, y: Math.max(0, Math.min(a, i.y)) };
    for (let h = 0; h <= u; h += 1) {
      const p = (h === 0 ? [0] : [h * l, -h * l]).map((g) => ({ ...i, y: i.y + g })).find((g) => g.y >= 0 && g.y <= a && r.every((v) => !va(g, v, t)));
      if (p) {
        d = p;
        break;
      }
    }
    r.push(d), n.set(d.id, { x: d.x, y: d.y });
  }), n;
}
function ba() {
  return navigator.userAgentData?.platform || navigator.platform || navigator.userAgent;
}
function Jn(o, e) {
  return e ? o.key === "Meta" : o.key === "Alt";
}
class Sa {
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
  constructor({ primaryColor: e, defaultVisible: t = !1, getAnnotationsByPage: n, getAnnotationGroup: r, canTransform: s }) {
    this.primaryColor = e, this.allVisible = t, this.getAnnotationsByPage = n, this.getAnnotationGroup = r, this.canTransform = s, this.isMac = /mac/i.test(ba()), window.addEventListener("keydown", this.handleKeyDown), window.addEventListener("keyup", this.handleKeyUp), window.addEventListener("blur", this.clearShortcutReveal), document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }
  registerPage(e, t, n) {
    this.unregisterPage(e);
    const r = document.createElement("div");
    r.className = vs, r.setAttribute("aria-hidden", "true"), t.appendChild(r), this.pages.set(e, { stage: n, layer: r, labels: /* @__PURE__ */ new Map() }), this.refreshPage(e);
  }
  unregisterPage(e) {
    const t = this.pages.get(e);
    t && (t.labels.forEach((n, r) => this.unbindGroup(r)), t.layer.remove(), this.pages.delete(e));
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
    const n = this.pages.get(t.pageNumber);
    if (n) {
      if (this.shouldRevealAll()) {
        this.refreshPage(t.pageNumber);
        return;
      }
      this.syncAnnotation(n, t, !0);
    }
  }
  refreshPage(e) {
    const t = this.pages.get(e);
    if (!t) return;
    const n = this.getAnnotationsByPage(e), r = new Set(n.map((i) => i.id));
    t.labels.forEach((i, a) => {
      r.has(a) || (this.unbindGroup(a), i.remove(), t.labels.delete(a));
    });
    const s = [];
    n.forEach((i) => {
      const a = this.syncAnnotation(t, i, !1);
      a && s.push(a);
    }), this.shouldRevealAll() ? this.positionVisibleLabels(t, s) : s.forEach(({ label: i, group: a }) => this.positionLabel(t, i, a));
  }
  refreshAll() {
    this.pages.forEach((e, t) => this.refreshPage(t));
  }
  remove(e) {
    this.unbindGroup(e), this.pages.forEach((t) => {
      const n = t.labels.get(e);
      n && (n.remove(), t.labels.delete(e));
    }), this.selectedId === e && (this.selectedId = null), this.hoveredId === e && (this.hoveredId = null);
  }
  destroy() {
    window.removeEventListener("keydown", this.handleKeyDown), window.removeEventListener("keyup", this.handleKeyUp), window.removeEventListener("blur", this.clearShortcutReveal), document.removeEventListener("visibilitychange", this.handleVisibilityChange), Array.from(this.pages.keys()).forEach((e) => this.unregisterPage(e)), this.pressedRevealKeys.clear(), this.boundGroups.clear(), this.selectedId = null, this.hoveredId = null, this.allVisible = !1;
  }
  findAnnotation(e) {
    for (const t of this.pages.keys()) {
      const n = this.getAnnotationsByPage(t).find((r) => r.id === e);
      if (n) return n;
    }
  }
  syncAnnotation(e, t, n) {
    const r = ga(t), s = this.getAnnotationGroup(t, e.stage);
    if (!r || !s)
      return this.unbindGroup(t.id), e.labels.get(t.id)?.remove(), e.labels.delete(t.id), null;
    this.bindGroup(t.id, s);
    let i = e.labels.get(t.id);
    i || (i = document.createElement("div"), i.className = ys, i.dataset.annotationId = t.id, e.layer.appendChild(i), e.labels.set(t.id, i)), i.textContent !== r && (i.textContent = r), i.style.backgroundColor = this.primaryColor, i.style.opacity = String(jo(this.canTransform(t)).authorLabelOpacity);
    const a = this.shouldRevealAll() || t.id === this.selectedId || t.id === this.hoveredId;
    return i.style.display = a ? "block" : "none", a ? (n && this.positionLabel(e, i, s), { id: t.id, label: i, group: s }) : null;
  }
  getLabelPosition(e, t, n) {
    const r = n.getClientRect(), s = 2;
    return ma({
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
  positionLabel(e, t, n) {
    const r = this.getLabelPosition(e, t, n);
    t.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
  }
  positionVisibleLabels(e, t) {
    const n = t.map(({ id: s, label: i, group: a }) => ({
      id: s,
      ...this.getLabelPosition(e, i, a),
      width: i.offsetWidth,
      height: i.offsetHeight
    })), r = ya(n, e.stage.height());
    t.forEach(({ id: s, label: i }) => {
      const a = r.get(s);
      a && (i.style.transform = `translate3d(${a.x}px, ${a.y}px, 0)`);
    });
  }
  bindGroup(e, t) {
    const n = this.boundGroups.get(e);
    n !== t && (n?.off(".annotationAuthorLabels"), t.on(
      `dragmove.annotationAuthorLabels transform.annotationAuthorLabels ${nn}.annotationAuthorLabels`,
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
    if (!Jn(e, this.isMac)) return;
    const t = this.shouldRevealAll();
    this.pressedRevealKeys.add(e.code || e.key), t !== this.shouldRevealAll() && this.refreshAll();
  };
  handleKeyUp = (e) => {
    if (!Jn(e, this.isMac)) return;
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
const Zn = Object.freeze({
  annotationId: null,
  source: null
});
class wa {
  entries = /* @__PURE__ */ new Map();
  listeners = /* @__PURE__ */ new Set();
  sequence = 0;
  snapshot = Zn;
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
    this.entries.forEach((n, r) => {
      n.annotationId === e && (this.entries.delete(r), t = !0);
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
    const n = t?.annotationId ?? null;
    this.snapshot.annotationId === n && this.snapshot.source === e || (this.snapshot = n === null ? Zn : { annotationId: n, source: e }, this.listeners.forEach((r) => r(this.snapshot)));
  }
}
class Ca {
  getAnnotation;
  getStage;
  getAnnotationGroup;
  hoveredId = null;
  selectedId = null;
  previewRect = null;
  boundGroup = null;
  constructor({ getAnnotation: e, getStage: t, getAnnotationGroup: n }) {
    this.getAnnotation = e, this.getStage = t, this.getAnnotationGroup = n;
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
    const n = this.getStage(t.pageNumber);
    if (!n) return;
    const r = this.getAnnotationGroup(t, n), s = r?.getLayer();
    if (!r || !s) return;
    const a = 2 / (Math.abs(n.scaleX()) || 1), l = r.getClientRect({ relativeTo: s });
    this.previewRect = new M.Rect({
      name: bs,
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
      `dragmove.annotationHoverPreview transform.annotationHoverPreview ${nn}.annotationHoverPreview`,
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
class Aa {
  shouldSuppress;
  onHoverStart;
  onHoverEnd;
  pages = /* @__PURE__ */ new Map();
  activeHover = null;
  constructor({ shouldSuppress: e, onHoverStart: t, onHoverEnd: n }) {
    this.shouldSuppress = e, this.onHoverStart = t, this.onHoverEnd = n;
  }
  registerPage(e, t, n) {
    this.unregisterPage(e);
    const r = {
      element: t,
      stage: n,
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
    const n = this.pages.get(e);
    if (n) {
      if (this.shouldSuppress() || t.buttons !== 0 || t.pointerType === "touch") {
        this.cancelPending(n), this.clearPage(e);
        return;
      }
      n.pendingPointer = {
        clientX: t.clientX,
        clientY: t.clientY,
        buttons: t.buttons,
        pointerType: t.pointerType
      }, n.frameId === null && (n.frameId = requestAnimationFrame(() => {
        n.frameId = null, this.resolvePointer(e);
      }));
    }
  }
  handlePointerLeave(e, t) {
    const n = this.pages.get(e);
    !n || t.target !== n.element || (this.cancelPending(n), this.clearPage(e));
  }
  resolvePointer(e) {
    const t = this.pages.get(e), n = t?.pendingPointer;
    if (!t || !n) return;
    if (t.pendingPointer = null, this.shouldSuppress() || n.buttons !== 0 || n.pointerType === "touch" || t.stage.getLayers().length === 0) {
      this.clearPage(e);
      return;
    }
    const r = t.stage.container().getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0 || n.clientX < r.left || n.clientX > r.right || n.clientY < r.top || n.clientY > r.bottom) {
      this.clearPage(e);
      return;
    }
    const s = {
      x: (n.clientX - r.left) * (t.stage.width() / r.width),
      y: (n.clientY - r.top) * (t.stage.height() / r.height)
    }, l = t.stage.getIntersection(s)?.findAncestor(`.${Oe}`)?.id() || null;
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
const pn = 8e3;
function Yo(o) {
  return typeof structuredClone == "function" ? structuredClone(o) : JSON.parse(JSON.stringify(o));
}
function fn(o) {
  return Yo(o);
}
function Qn(o) {
  return Yo(o);
}
class Ta {
  entries = [];
  snapshot = null;
  listeners = /* @__PURE__ */ new Set();
  timer = null;
  remainingMs = pn;
  paused = !1;
  subscribe(e) {
    return this.listeners.add(e), () => this.listeners.delete(e);
  }
  getSnapshot() {
    return this.snapshot;
  }
  add(e, t) {
    this.entries.push(t === void 0 ? e : { ...e, historyId: t }), this.remainingMs = pn, this.setSnapshot(Date.now() + this.remainingMs), this.clearTimer(), this.paused || this.scheduleExpiry();
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
    let t = 0, n = 0;
    this.entries.forEach((r) => {
      r.kind === "annotation" ? t += 1 : n += 1;
    }), this.snapshot = {
      annotationCount: t,
      commentCount: n,
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
    this.clearTimer(), this.entries = [], this.snapshot = null, this.remainingMs = pn, this.paused = !1, e && this.emit();
  }
  clearTimer() {
    this.timer !== null && (clearTimeout(this.timer), this.timer = null);
  }
  emit() {
    this.listeners.forEach((e) => e());
  }
}
class eo {
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
    const [n] = this.undoStack.splice(t, 1);
    return n.undo() ? (this.redoStack.push(n), this.emit(), !0) : (this.undoStack.splice(t, 0, n), !1);
  }
  clear() {
    !this.canUndo && !this.canRedo || (this.undoStack = [], this.redoStack = [], this.emit());
  }
  emit() {
    this.listeners.forEach((e) => e());
  }
}
function xa(o) {
  return o == null ? o : typeof structuredClone == "function" ? structuredClone(o) : JSON.parse(JSON.stringify(o));
}
function gn(o) {
  return Object.fromEntries(
    Object.entries(o).map(([e, t]) => [e, xa(t)])
  );
}
class ka {
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
  annotationHover = new wa();
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
    currentUser: n,
    annotationPermissions: r,
    defaultShowAnnotationAuthorLabels: s,
    PDFViewerApplication: i,
    onTextSelected: a,
    onAnnotationAdd: l,
    onAnnotationDelete: u,
    onAnnotationSelected: d,
    onAnnotationChanging: h,
    onAnnotationChanged: f
  }) {
    this.primaryColor = e, this.defaultOptions = t, this.currentUser = n, this.annotationPermissions = r, this.permissionController = new ua({
      getCurrentUser: () => this.currentUser,
      getPermissions: () => this.annotationPermissions
    }), this.deleteUndoController = new Ta(), this.mutationHistory = new eo(), this.authorLabels = new Sa({
      primaryColor: this.primaryColor,
      defaultVisible: s,
      getAnnotationsByPage: (p) => se.getState().getByPage(p),
      getAnnotationGroup: (p, g) => g.findOne((v) => v.getType() === "Group" && v.id() === p.id),
      canTransform: (p) => this.permissionController.can("annotation.transform", p)
    }), this.hoverPreview = new Ca({
      getAnnotation: (p) => se.getState().getAnnotation(p),
      getStage: (p) => this.konvaCanvasStore.get(p)?.konvaStage,
      getAnnotationGroup: (p, g) => g.findOne((v) => v.getType() === "Group" && v.id() === p.id)
    }), this.unsubscribeAnnotationHover = this.annotationHover.subscribe((p) => {
      this.authorLabels.setHovered(p.annotationId), this.hoverPreview.setHovered(null);
    }), this.pdfViewerApplication = i, this.onTextSelected = a, this.onAnnotationAdd = l, this.onAnnotationDelete = u, this.onAnnotationSelected = d, this.onAnnotationChanging = h, this.onAnnotationChanged = f, this.selector = new Is({
      primaryColor: this.primaryColor,
      // 初始化选择器实例
      konvaCanvasStore: this.konvaCanvasStore,
      getAnnotationStore: (p) => se.getState().getAnnotation(p),
      canTransform: (p) => this.permissionController.can("annotation.transform", p),
      onSelected: (p, g, v) => {
        const y = se.getState().getAnnotation(p);
        if (y) {
          const b = this.nextSelectionSource ?? (g ? $e.CANVAS : $e.SIDEBAR);
          this.nextSelectionSource = void 0, se.getState().setSelectedAnnotation(y, b), this.onAnnotationSelected(y, g, v);
        }
      },
      onDeselected: () => {
        this.nextSelectionSource = void 0, se.getState().clearSelectedAnnotation(), this.onAnnotationSelected(void 0, !1, { x: 0, y: 0, width: 0, height: 0 });
      },
      onSelectionChanged: (p) => {
        this.authorLabels.setSelected(p), this.hoverPreview.setSelected(p);
      },
      onHoverStart: (p) => {
        this.annotationHover.set("canvas", p);
      },
      onHoverEnd: (p) => {
        this.annotationHover.clear("canvas", p);
      },
      onChanged: async (p, g, v, y, b) => {
        const A = this.findEditorForGroupId(p) ? this.updateStore(p, { konvaString: g, konvaClientRect: y }, !1, "annotation.transform", void 0, !0, `transform:${p}`) : void 0;
        A && this.onAnnotationChanged(A, b);
      },
      onCancel: () => {
        this.onAnnotationChanging();
      },
      onDelete: (p) => {
        this.delete(p, !0);
      }
    }), this.webSelection = new Ms({
      // 初始化 WebSelection 实例
      onSelect: (p) => {
        this.onTextSelected(p);
      },
      onHighlight: (p) => {
        if (!this.can("annotation.create")) return;
        const g = [];
        this.activeHighlightHistoryEntries = g, Object.keys(p).forEach((v) => {
          const y = Number(v), b = p[v], S = this.konvaCanvasStore.get(y);
          if (S) {
            const { konvaStage: A, wrapper: T } = S;
            let E = this.findEditor(y, this.currentAnnotation.type);
            E || (E = new Bn(
              {
                primaryColor: this.primaryColor,
                defaultOptions: this.defaultOptions,
                currentUser: this.currentUser,
                pdfViewerApplication: this.pdfViewerApplication,
                konvaStage: A,
                pageNumber: y,
                annotation: this.currentAnnotation,
                onAdd: (O) => {
                  this.saveToStore(O, !1, this.activeHighlightHistoryEntries ?? void 0);
                },
                onChange: (O, G) => {
                  this.updateStore(O, G);
                }
              },
              this.currentAnnotation.type
            ), this.editorStore.set(E.id, E)), E.convertTextSelection(b, T);
          }
        }), this.activeHighlightHistoryEntries = null, g.length > 0 && this.recordHistory({
          undo: () => {
            let v = !0;
            return g.slice().reverse().forEach((y) => {
              v = this.deleteAnnotation(y.annotation.id, !0, !1) && v;
            }), v && this.selector.delete(), v;
          },
          redo: () => {
            let v = !0;
            return g.forEach((y) => {
              v = this.restoreDeletedAnnotation(y) && v;
            }), v;
          }
        });
      }
    }), this.passiveHover = new Aa({
      shouldSuppress: () => !!(this.currentAnnotation && !this.currentAnnotation.webSelectionDependencies) || this.webSelection.isRangeSelectionActive(),
      onHoverStart: (p) => {
        this.annotationHover.set("canvas-passive", p);
      },
      onHoverEnd: (p) => {
        this.annotationHover.clear("canvas-passive", p);
      }
    }), this.transform = new $s(i), this.bindGlobalEvents();
  }
  setPermissionContext(e, t) {
    const n = this.currentUser?.id !== e.id;
    this.currentUser = e, this.annotationPermissions = t, (n || !this.can("annotation.create")) && this.clearHistory(), this.editorStore.forEach((r) => r.setCurrentUser(e)), this.currentAnnotation?.type !== R.SELECT && !this.can("annotation.create") && this.setDefaultMode(), this.selector.refreshCurrentSelection(), this.authorLabels.refreshAll();
  }
  can(e, t, n) {
    return this.permissionController.can(e, t, n);
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
    this.currentAnnotation = e, se.getState().setCurrentAnnotationType(e);
  }
  ensureMutationHistory() {
    return this.mutationHistory || (this.mutationHistory = new eo()), this.mutationHistory;
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
    return !!this.updateStore(e, gn(t), !0, null, void 0, !1);
  }
  recordAnnotationPatchChange(e, t, n, r) {
    return this.recordHistory({
      mergeKey: r,
      undo: () => this.applyAnnotationPatch(e, t),
      redo: () => this.applyAnnotationPatch(e, n)
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
    e.code === "Escape" && (this.currentAnnotation?.type === R.SIGNATURE || this.currentAnnotation?.type === R.STAMP) && (dn(Lt), this.setDefaultMode());
  };
  /**
   * 创建绘图容器 (painterWrapper)
   * @param pageView - 当前 PDF 页面视图
   * @param pageNumber - 当前页码
   * @returns 绘图容器元素
   */
  createPainterWrapper(e, t) {
    const n = document.createElement("div");
    return n.id = `${An}_page_${t}`, n.classList.add(An), e.div.appendChild(n), n;
  }
  /**
   * 创建 Konva Stage
   * @param container - 绘图容器元素
   * @param viewport - 当前 PDF 页面视口
   * @returns Konva Stage
   */
  createKonvaStage(e, t) {
    const n = new M.Stage({
      container: e,
      width: t.width,
      height: t.height,
      scale: { x: t.scale, y: t.scale }
    }), r = new M.Layer();
    return n.add(r), n;
  }
  /**
   * 清理无效的 canvasStore
   */
  cleanUpInvalidStore() {
    this.konvaCanvasStore.forEach((e) => {
      ms(e.wrapper) || this.disposeCanvas(e.pageNumber);
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
    const n = this.createPainterWrapper(e, t), r = this.createKonvaStage(n, e.viewport);
    this.konvaCanvasStore.set(t, { pageNumber: t, konvaStage: r, wrapper: n, isActive: !1 }), this.passiveHover.registerPage(t, e.div, r), this.authorLabels.registerPage(t, n, r), this.reDrawAnnotation(t), this.enablePainting();
  }
  /**
   * 调整现有 KonvaCanvas 的缩放
   * @param pageView - 当前 PDF 页面视图
   * @param pageNumber - 当前页码
   */
  scaleCanvas(e, t) {
    const n = this.konvaCanvasStore.get(t);
    if (!n) return;
    const { konvaStage: r } = n, { scale: s, width: i, height: a } = e.viewport;
    r.scale({ x: s, y: s }), r.width(i), r.height(a), this.authorLabels.refreshPage(t), this.hoverPreview.refresh();
  }
  /**
   * 设置当前模式 (绘画模式、默认模式)
   * @param mode - 模式类型 ('painting', 'default')
   */
  setMode(e) {
    const t = e === "painting";
    document.body.classList.toggle(`${Wn}`, t), Object.values(R).filter((r) => typeof r == "number").map((r) => `${un}_${r}`).forEach((r) => document.body.classList.remove(r)), dn(Lt), this.currentAnnotation && document.body.classList.add(`${un}_${this.currentAnnotation?.type}`);
  }
  /**
   * 保存到存储
   */
  saveToStore(e, t = !1, n) {
    if (!t && !this.can("annotation.create")) return;
    const r = t ? e : fa(
      e,
      se.getState().annotations.values(),
      this.nextAnnotationReferenceNumber
    );
    t || (this.nextAnnotationReferenceNumber = r.referenceNumber + 1);
    const s = De.find((a) => a.pdfjsAnnotationType === r.pdfjsType);
    if (se.getState().addAnnotation(r, t), this.authorLabels.refreshAnnotation(r.id), t) return;
    const i = this.createDeletedAnnotationEntry(r);
    n ? n.push(i) : this.recordHistory({
      undo: () => {
        const a = this.deleteAnnotation(r.id, !0, !1);
        return a && this.selector.delete(), a;
      },
      redo: () => this.restoreDeletedAnnotation(i)
    }), s && (s.isOnce ? this.selectAnnotation(r.id, !1, $e.CANVAS) : se.getState().setSelectedAnnotation(r, $e.CANVAS)), this.onAnnotationAdd(r, t, s);
  }
  /**
   * 更新存储
   */
  updateStore(e, t, n = !0, r = "annotation.edit", s, i = r !== null, a) {
    const l = se.getState().getAnnotation(e);
    if (!l || r && !this.can(r, l, s)) return;
    const u = i ? gn(
      Object.fromEntries(
        Object.keys(t).map((h) => [h, l[h]])
      )
    ) : null, d = se.getState().updateAnnotation(e, t);
    if (d && this.authorLabels.refreshAnnotation(e), d && n && this.onAnnotationChanged(d), d && u) {
      const h = gn(
        Object.fromEntries(
          Object.keys(t).map((f) => [f, d[f]])
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
    return this.editorStore.forEach((n) => {
      if (n.shapeGroupStore?.has(e)) {
        t = n;
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
  enableEditor({ konvaStage: e, pageNumber: t, annotation: n }) {
    const r = this.findEditor(t, n.type);
    if (r) {
      if (r instanceof $n) {
        r.activateWithSignature(e, n, this.tempDataTransfer);
        return;
      }
      if (r instanceof Vn) {
        r.activateWithStamp(e, n, this.tempDataTransfer);
        return;
      }
      r.activate(e, n);
      return;
    }
    let s = null;
    switch (n.type) {
      case R.FREETEXT:
        s = new Rs({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: n,
          onAdd: (i) => {
            this.saveToStore(i);
          },
          onChange: (i, a) => {
            this.updateStore(i, a);
          }
        });
        break;
      case R.RECTANGLE:
        s = new Ps({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: n,
          onAdd: (i) => {
            this.saveToStore(i);
          },
          onChange: (i, a) => {
            this.updateStore(i, a);
          }
        });
        break;
      case R.ARROW:
        s = new Vs({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: n,
          onAdd: (i) => {
            this.saveToStore(i);
          },
          onChange: (i, a) => {
            this.updateStore(i, a);
          }
        });
        break;
      case R.CLOUD:
        s = new Ys({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: n,
          onAdd: (i) => {
            this.saveToStore(i);
          },
          onChange: (i, a) => {
            this.updateStore(i, a);
          }
        });
        break;
      case R.CIRCLE:
        s = new ws({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: n,
          onAdd: (i) => {
            this.saveToStore(i);
          },
          onChange: (i, a) => {
            this.updateStore(i, a);
          }
        });
        break;
      case R.NOTE:
        s = new Ns({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: n,
          onAdd: (i) => {
            this.saveToStore(i);
          },
          onChange: () => {
          }
        });
        break;
      case R.FREEHAND:
        s = new Cs({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: n,
          onAdd: (i) => {
            this.saveToStore(i);
          },
          onChange: (i, a) => {
            this.updateStore(i, a);
          }
        });
        break;
      case R.FREE_HIGHLIGHT:
        s = new As({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: n,
          onAdd: (i) => {
            this.saveToStore(i);
          },
          onChange: (i, a) => {
            this.updateStore(i, a);
          }
        });
        break;
      case R.SIGNATURE:
        s = new $n(
          {
            primaryColor: this.primaryColor,
            defaultOptions: this.defaultOptions,
            currentUser: this.currentUser,
            pdfViewerApplication: this.pdfViewerApplication,
            konvaStage: e,
            pageNumber: t,
            annotation: n,
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
        s = new Vn(
          {
            primaryColor: this.primaryColor,
            defaultOptions: this.defaultOptions,
            currentUser: this.currentUser,
            pdfViewerApplication: this.pdfViewerApplication,
            konvaStage: e,
            pageNumber: t,
            annotation: n,
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
        s = new Bn(
          {
            primaryColor: this.primaryColor,
            defaultOptions: this.defaultOptions,
            currentUser: this.currentUser,
            pdfViewerApplication: this.pdfViewerApplication,
            konvaStage: e,
            pageNumber: t,
            annotation: n,
            onAdd: (i) => {
              this.saveToStore(i);
            },
            onChange: (i, a) => {
              this.updateStore(i, a);
            }
          },
          n.type
        );
        break;
      case R.SELECT:
        this.selector.activate(t);
        break;
      default:
        console.warn(`未实现的批注类型: ${n.type}`);
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
    se.getState().getByPage(e).forEach((r) => {
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
  deleteAnnotation(e, t = !1, n = !0) {
    const r = se.getState().getAnnotation(e);
    if (!r || n && !this.can("annotation.delete", r)) return !1;
    this.annotationHover.clearAnnotation(e), se.getState().removeAnnotation(e), this.authorLabels.remove(e);
    const s = this.findEditor(r.pageNumber, r.type), i = this.konvaCanvasStore.get(r.pageNumber);
    return s && i && s.deleteGroup(e, i.konvaStage), t && this.onAnnotationDelete(e), !0;
  }
  createDeletedAnnotationEntry(e) {
    const t = Array.from(se.getState().annotations.keys()), r = this.konvaCanvasStore?.get(e.pageNumber)?.konvaStage?.findOne((s) => s.getType() === "Group" && s.name() === Oe && s.id() === e.id);
    return {
      kind: "annotation",
      annotation: fn(e),
      storeIndex: Math.max(0, t.indexOf(e.id)),
      konvaIndex: r?.zIndex() ?? null
    };
  }
  restoreDeletedAnnotation(e) {
    const t = fn(e.annotation);
    if (!se.getState().restoreAnnotation(t, e.storeIndex))
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
      const a = r.konvaStage.findOne((l) => l.getType() === "Group" && l.name() === Oe && l.id() === t.id);
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
    const t = se.getState().getAnnotation(e.annotationId);
    if (!t || t.comments.some((s) => s.id === e.comment.id)) return !1;
    const n = [...t.comments], r = Math.max(0, Math.min(e.commentIndex, n.length));
    return n.splice(r, 0, Qn(e.comment)), !!this.updateStore(t.id, { comments: n }, !0, null);
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
  initCanvas({ pageView: e, cssTransform: t, pageNumber: n }) {
    t ? this.scaleCanvas(e, n) : this.insertCanvas(e, n);
  }
  /**
   * 初始化 WebSelection
   * @param rootElement - 根 DOM 元素
   */
  initWebSelection(e) {
    this.webSelection.create(e);
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
  selectAnnotation(e, t, n = t ? $e.CANVAS : $e.SIDEBAR) {
    this.setDefaultMode(), this.nextSelectionSource = n, this.selector.select(e, t);
  }
  /**
   * @description 将annotation 存入 store, 包含外部 annotation 和 pdf 文件上的 annotation
   */
  async initAnnotationsOnce(e, t) {
    const n = qn(e);
    if (this.nextAnnotationReferenceNumber = Math.min(
      Xt(n) + 1,
      Number.MAX_SAFE_INTEGER
    ), t) {
      const i = await this.transform.decodePdfAnnotation();
      i.forEach((a) => {
        this.saveToStore(a, !0);
      }), n.forEach((a) => {
        i.has(a.id) ? this.updateStore(a.id, a, !0, null) : this.saveToStore(a, !0);
      });
    } else
      n.forEach((i) => {
        this.saveToStore(i, !0);
      });
    const r = se.getState(), s = qn(
      Array.from(r.annotations.values())
    );
    r.setAnnotationReferenceNumbers(
      new Map(s.map((i) => [
        i.id,
        i.referenceNumber
      ]))
    ), this.nextAnnotationReferenceNumber = Math.min(
      Xt(s) + 1,
      Number.MAX_SAFE_INTEGER
    );
  }
  /**
   * Replace the provider state after a serialized writer transfer. This is
   * intentionally silent: the incoming snapshot is already durable state,
   * not a new local mutation.
   */
  async replaceAnnotations(e, t = !1) {
    this.disablePainting(), this.clearHistory(), this.editorStore.forEach((n) => {
      n.shapeGroupStore.forEach((r) => r.konvaGroup.destroy());
    }), this.editorStore.clear(), se.getState().clearAnnotations(), await this.initAnnotationsOnce(e, t), this.konvaCanvasStore.forEach(({ pageNumber: n }) => this.reDrawAnnotation(n));
  }
  /**
   * @description 更新 store
   * @param id
   * @param updates
   */
  update(e, t, n = "annotation.edit", r) {
    return this.updateStore(e, t, !0, n, r);
  }
  /**
   * @description 删除 annotation
   * @param id
   */
  delete(e, t = !1) {
    const n = se.getState().getAnnotation(e);
    if (!n || !this.can("annotation.delete", n)) return !1;
    const r = this.createDeletedAnnotationEntry(n), s = this.deleteAnnotation(e, t);
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
    const n = se.getState().getAnnotation(e);
    if (!n || !n.comments.some((s) => s.id === t)) return !1;
    const r = n.comments.filter((s) => s.id !== t);
    return !!this.updateStore(e, { comments: r }, !0, null, void 0, !1);
  }
  deleteComment(e, t) {
    const n = se.getState().getAnnotation(e), r = n?.comments.findIndex((d) => d.id === t) ?? -1;
    if (!n || r < 0) return !1;
    const s = n.comments[r];
    if (!this.can("comment.delete", n, s)) return !1;
    const i = {
      kind: "comment",
      annotationId: e,
      annotationReferenceNumber: n.referenceNumber,
      previewAnnotation: fn(n),
      comment: Qn(s),
      commentIndex: r
    }, a = n.comments.filter((d) => d.id !== t);
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
    const n = /* @__PURE__ */ new Set();
    return e.reverse().forEach((r) => {
      if (r.kind === "comment" && n.has(r.annotationId)) return;
      const s = r.historyId !== void 0 && this.mutationHistory ? this.mutationHistory.undoEntry(r.historyId) : r.kind === "annotation" ? this.restoreDeletedAnnotation(r) : this.restoreDeletedComment(r);
      r.kind === "annotation" && !s && n.add(r.annotation.id), s && (t += 1);
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
    const t = this.cancelHighlightRequest(), n = e.pageNumber - 1, r = this.pdfViewerApplication._pages?.[n] || this.pdfViewerApplication.getPageView(n), { x: s, y: i } = e.konvaClientRect;
    if (r?.viewport) {
      const u = s * r.viewport.scale, d = Math.max(0, i * r.viewport.scale - 200), [h, f] = r.viewport.convertToPdfPoint(u, d);
      this.pdfViewerApplication.scrollPageIntoView({
        pageNumber: e.pageNumber,
        destArray: [null, { name: "XYZ" }, h, f, null],
        allowNegativeOffset: !0
      });
    } else
      this.pdfViewerApplication.scrollPageIntoView({
        pageNumber: e.pageNumber
      });
    const a = 30, l = 100;
    return new Promise((u) => {
      this.resolveHighlightRequest = u;
      const d = (f) => {
        t === this.highlightRequestId && (this.highlightRetryTimer !== null && (window.clearTimeout(this.highlightRetryTimer), this.highlightRetryTimer = null), this.resolveHighlightRequest = null, u(f));
      }, h = (f) => {
        if (t !== this.highlightRequestId) return;
        if (this.findEditor(e.pageNumber, e.type)) {
          this.setDefaultMode(), this.selector.select(e.id), this.currentAnnotation && this.currentAnnotation.type === R.SELECT && this.selector.activate(e.pageNumber), d(!0);
          return;
        }
        if (f <= 0) {
          d(!1);
          return;
        }
        this.highlightRetryTimer = window.setTimeout(() => {
          this.highlightRetryTimer = null, h(f - 1);
        }, l);
      };
      h(a);
    });
  }
  getData() {
    return Array.from(se.getState().annotations.values());
  }
  /**
   * @description 更新样式
   * @param annotationStore
   * @param styles
   */
  updateAnnotationStyle(e, t) {
    if (!this.can("annotation.edit", e)) return;
    const n = this.findEditorForGroupId(e.id);
    n && n.updateStyle(e, t);
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
    }), this.konvaCanvasStore.clear(), this.editorStore.clear(), this.selector.delete(), this.clearTempDataTransfer(), this.currentAnnotation = null, document.body.classList.remove(`${Wn}`), Object.values(R).filter((t) => typeof t == "number").map((t) => `${un}_${t}`).forEach((t) => document.body.classList.remove(t)), dn(Lt);
  }
}
const Ko = Qt(void 0), nt = () => {
  const o = Ht(Ko);
  if (o === void 0)
    throw new Error("usePainter must be used within a PainterProvider");
  return o;
}, Ea = {
  placement: "bottom",
  middleware: [Ao()]
}, Xo = en(function(e, t) {
  const {
    buttons: n,
    renderButtons: r,
    positionOptions: s = Ea,
    visible: i,
    onVisibleChange: a,
    children: l
  } = e, u = i !== void 0, [d, h] = K(!1), f = u ? i : d, p = q((L) => {
    u ? a?.(L) : h(L);
  }, [u, a]), [g, v] = K(null), y = $(null), b = $(null), S = $(null), A = q(() => {
    p(!1), b.current = null, S.current = null;
  }, [p]), T = q((L) => {
    if (b.current = L, S.current = null, !L) {
      A();
      return;
    }
    p(!0);
    const k = L.getBoundingClientRect();
    let N = k;
    if (k.top < 0 || k.left < 0) {
      const H = window.getSelection();
      if (H && H.rangeCount > 0) {
        const I = H.focusNode, V = H.anchorNode;
        if (I && V) {
          const ee = document.createRange(), X = document.createRange();
          H.anchorOffset <= H.focusOffset ? (ee.setStart(H.anchorNode, H.anchorOffset), ee.setEnd(H.anchorNode, Math.min(H.anchorOffset + 1, H.anchorNode.textContent?.length || 0)), X.setStart(H.focusNode, Math.max(H.focusOffset - 1, 0)), X.setEnd(H.focusNode, H.focusOffset)) : (ee.setStart(H.focusNode, H.focusOffset), ee.setEnd(H.focusNode, Math.min(H.focusOffset + 1, H.focusNode.textContent?.length || 0)), X.setStart(H.anchorNode, Math.max(H.anchorOffset - 1, 0)), X.setEnd(H.anchorNode, H.anchorOffset));
          const x = ee.getBoundingClientRect(), P = X.getBoundingClientRect();
          N = {
            top: Math.max(0, Math.min(x.top, P.top)),
            left: Math.max(0, Math.min(x.left, P.left)),
            bottom: Math.max(x.bottom, P.bottom),
            right: Math.max(x.right, P.right),
            width: Math.abs(P.right - x.left),
            height: Math.max(x.height, P.height),
            x: Math.max(0, Math.min(x.x, P.x)),
            y: Math.max(0, Math.min(x.y, P.y)),
            toJSON: k.toJSON
          };
        }
      }
    }
    const z = {
      getBoundingClientRect: () => N
    };
    requestAnimationFrame(() => {
      y.current && Bt(z, y.current, s).then(({ x: H, y: I }) => {
        y.current && Object.assign(y.current.style, {
          left: `${H}px`,
          top: `${I}px`
        });
      }).catch((H) => {
        console.warn("Failed to compute popover position:", H);
      });
    });
  }, [A, s, p]), E = ke(() => (r ? r({ range: b.current, rect: S.current, close: A }) : n || []).map((k) => /* @__PURE__ */ C(
    ye,
    {
      size: "2",
      variant: "ghost",
      color: "gray",
      highContrast: !0,
      style: {
        opacity: k.disabled ? 0.5 : 1,
        boxShadow: "none",
        margin: "0"
      },
      onMouseDown: () => {
        k.onClick(b.current, S.current);
      },
      disabled: k.disabled,
      children: [
        k.icon,
        k.title
      ]
    },
    k.key
  )), [n, A, r]), O = E.length > 0 || !!l;
  te(() => {
    if (!O) {
      f && S.current && g === null && v(S.current);
      return;
    }
    f && y.current && g && (Bt({
      getBoundingClientRect: () => g
    }, y.current, s).then(({ x: k, y: N }) => {
      y.current && Object.assign(y.current.style, {
        left: `${k}px`,
        top: `${N}px`
      });
    }).catch((k) => {
      console.warn("Failed to compute popover position:", k);
    }), v(null));
  }, [O, f, g, s]);
  const G = q((L) => {
    if (b.current = null, S.current = L, y.current || v(L), p(!0), y.current) {
      const k = {
        getBoundingClientRect: () => L
      };
      requestAnimationFrame(() => {
        y.current && Bt(k, y.current, s).then(({ x: N, y: z }) => {
          y.current && Object.assign(y.current.style, {
            left: `${N}px`,
            top: `${z}px`
          });
        }).catch((N) => {
          console.warn("Failed to compute popover position:", N);
        });
      });
    }
  }, [s, p]);
  Nn(t, () => ({
    open: T,
    openWithRect: G,
    close: A
  }), [T, G, A]);
  const { appearance: j } = tn(), W = {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 999,
    display: f ? "block" : "none",
    width: "max-content",
    backgroundColor: j === "light" ? "#fff" : "#242430",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: 4,
    padding: "2px"
  };
  return O ? /* @__PURE__ */ c(
    "div",
    {
      ref: y,
      style: W,
      children: l || /* @__PURE__ */ c(Z, { gap: "1", align: "center", children: E })
    }
  ) : null;
}), Ra = en(function(e, t) {
  const { t: n } = ve(["annotator"], { useSuspense: !1 }), {
    popoverBarProps: r = {}
  } = e, s = Pt.useRef(null), { painter: i } = nt();
  return Nn(t, () => ({
    open: (a) => {
      s.current?.open(a);
    },
    close: () => {
      s.current?.close();
    }
  }), []), /* @__PURE__ */ c(
    Xo,
    {
      ref: s,
      renderButtons: () => [
        {
          key: "highlight",
          icon: /* @__PURE__ */ c(Do, {}),
          onClick: (a) => {
            const l = De.find((u) => u.name === "highlight");
            i?.highlightRange(a, l), s.current?.close();
          },
          title: n("annotator:tool.highlight")
        },
        {
          key: "underline",
          icon: /* @__PURE__ */ c(Oo, {}),
          onClick: (a) => {
            const l = De.find((u) => u.name === "underline");
            i?.highlightRange(a, l), s.current?.close();
          },
          title: n("annotator:tool.underline")
        },
        {
          key: "strikeout",
          icon: /* @__PURE__ */ c(Lo, {}),
          onClick: (a) => {
            const l = De.find((u) => u.name === "strikeout");
            i?.highlightRange(a, l), s.current?.close();
          },
          title: n("annotator:tool.strikeout")
        }
      ],
      ...r
    }
  );
}), qo = Qt(null), Nt = () => {
  const o = Ht(qo);
  if (!o)
    throw new Error("useOptionsContext must be used within a OptionsProvider");
  return o;
}, Pa = "_ColorPicker_18032_1", Na = "_cell_18032_1", Ia = "_active_18032_21", mn = {
  ColorPicker: Pa,
  cell: Na,
  active: Ia
};
function Jo(o, e) {
  if (!Ut(o) || !Ut(e))
    return e !== void 0 ? e : o;
  const t = { ...o }, n = e, r = o;
  return Object.keys(n).forEach((s) => {
    const i = n[s], a = r[s];
    if (Array.isArray(i)) {
      t[s] = i;
      return;
    }
    if (Ut(i) && Ut(a)) {
      t[s] = Jo(a, i);
      return;
    }
    i !== void 0 && (t[s] = i);
  }), t;
}
function Ut(o) {
  return o !== null && typeof o == "object" && Object.prototype.toString.call(o) === "[object Object]";
}
function Ma(o) {
  const e = document.createElement("canvas");
  e.width = e.height = 1;
  const t = e.getContext("2d", { colorSpace: "srgb" });
  if (!t)
    return o;
  t.fillStyle = o, t.fillRect(0, 0, 1, 1);
  const n = t.getImageData(0, 0, 1, 1).data;
  return `rgb(${n[0]}, ${n[1]}, ${n[2]})`;
}
function to() {
  const o = document.getElementById("InkLayer");
  if (o) {
    const t = getComputedStyle(o).getPropertyValue("--accent-9").trim();
    return Ma(t);
  }
  return "#1677ff";
}
function no(o) {
  const e = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, t = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  if (o = o.trim().toLowerCase(), e.test(o))
    return o.length === 4 ? "#" + o.slice(1).split("").map((r) => r + r).join("") : o;
  const n = o.match(t);
  if (n) {
    const r = Number(n[1]), s = Number(n[2]), i = Number(n[3]), a = (l) => Math.max(0, Math.min(255, l));
    return "#" + [r, s, i].map((l) => a(l).toString(16).padStart(2, "0")).join("");
  }
  throw new Error(`Unsupported color format: ${o}`);
}
function Da(o, e) {
  try {
    return no(o) === no(e);
  } catch {
    return !1;
  }
}
function La(o, e, t = !1) {
  let n = null;
  return function(...r) {
    const s = t && !n;
    n && clearTimeout(n), n = setTimeout(() => {
      n = null, t || o.apply(this, r);
    }, e), s && o.apply(this, r);
  };
}
const Et = ({
  value: o = "#000000",
  onChange: e,
  presets: t = [],
  transparent: n = !1,
  popover: r = !1,
  custom: s = !0,
  trigger: i,
  open: a,
  onOpenChange: l,
  onContentPointerEnter: u,
  onContentPointerLeave: d
}) => {
  const { t: h } = ve("common", { useSuspense: !1 }), [f, p] = K(o);
  Pt.useEffect(() => {
    p(o);
  }, [o]);
  const g = (b) => {
    p(b), e?.(b);
  }, v = (b) => {
    g(b);
  }, y = () => /* @__PURE__ */ c(lt, { maxWidth: "240px", className: mn.ColorPicker, children: /* @__PURE__ */ c(Ar, { size: "2", variant: "ghost", children: /* @__PURE__ */ C(Z, { direction: "column", gap: "3", children: [
    s && /* @__PURE__ */ c(ei, { color: f, onChange: g }),
    /* @__PURE__ */ c(Wt, { columns: "5", gap: "2", children: t?.map((b) => /* @__PURE__ */ c(
      "div",
      {
        className: `${mn.cell} ${Da(f, b) ? mn.active : ""}`,
        onMouseDown: () => v(b),
        children: /* @__PURE__ */ c("span", { style: { backgroundColor: b } })
      },
      b
    )) }),
    n && /* @__PURE__ */ c(et, { variant: "ghost", onClick: () => v("transparent"), children: h("transparent") })
  ] }) }) });
  return /* @__PURE__ */ c(Ce, { children: r ? /* @__PURE__ */ C(xe.Root, { open: a, onOpenChange: l, children: [
    /* @__PURE__ */ c(xe.Trigger, { children: i || /* @__PURE__ */ c(et, { variant: "outline", color: "gray", children: /* @__PURE__ */ C("svg", { viewBox: "0 0 1024 1024", style: { width: "1em", height: "1em", color: f }, children: [
      /* @__PURE__ */ c("path", { d: "M96 837.68888888h832v160H96z", fill: "currentColor" }),
      /* @__PURE__ */ c("path", { d: "M429.30646525 163.315053m54.92260742 54.92260743l164.76782227 164.76782227q54.92260742 54.92260742 0 109.84521486l-164.76782227 164.76782228q-54.92260742 54.92260742-109.84521486 0l-164.76782228-164.76782228q-54.92260742-54.92260742 0-109.84521486l164.76782228-164.76782227q54.92260742-54.92260742 109.84521486 0Z", fill: "#FFFFFF" }),
      /* @__PURE__ */ c("path", { d: "M364.65047577 163.33699097L262.12304466 60.85098508 320.69831237 2.23429214l153.14905568 153.10763046c2.94119095 2.27838736 5.79953147 4.76390083 8.5335963 7.45654045l234.34249608 234.34249608a82.85044939 82.85044939 0 0 1 0 117.15053543l-234.34249608 234.34249607a82.85044939 82.85044939 0 0 1-117.19196065 0L130.88793283 514.29149456a82.85044939 82.85044939 0 0 1 0-117.15053543l233.76254294-233.80396816z m220.2579197 219.13943862l-0.57995316 0.53852791-161.0612736-161.0612736-226.72025474 226.67882952h454.51756532L584.90839547 382.47642959zM822.68918518 783.3069037a103.56306173 103.56306173 0 0 1-103.56306171-103.56306173c0-57.16681008 87.61435022-161.39267539 103.56306171-161.3926754 15.9487115 0 103.56306173 104.1844401 103.56306173 161.3926754a103.56306173 103.56306173 0 0 1-103.56306173 103.56306173z", fill: "#000000d6" })
    ] }) }) }),
    /* @__PURE__ */ c(
      xe.Content,
      {
        onPointerEnter: u,
        onPointerLeave: d,
        children: /* @__PURE__ */ c(y, {})
      }
    )
  ] }) : /* @__PURE__ */ c(y, {}) });
};
function Oa(o) {
  return M.Node.create(o).children[0];
}
const _a = en(function(e, t) {
  const { t: n } = ve(["common", "annotator"], { useSuspense: !1 }), { openSidebar: r, activeSidebarPanel: s, viewerContainerRef: i } = Fe(), { painter: a, requestWrite: l } = nt(), { defaultOptions: u } = Nt(), { popoverBarProps: d = {} } = e, h = $(null), [f, p] = K(null), [g, v] = K(2), [y, b] = K(1), [S, A] = K(!1), T = $(null), E = q((I, V) => {
    const ee = `${An}_page_${I.pageNumber}`, X = i?.current?.querySelector(
      `#${ee} .konvajs-content`
    );
    if (X) {
      const x = X.getBoundingClientRect(), P = V.x + x.left, Y = V.y + x.top, D = {
        x: P,
        y: Y,
        width: V.width,
        height: V.height,
        top: Y,
        left: P,
        right: P + V.width,
        bottom: Y + V.height,
        toJSON: () => ({})
      };
      h.current?.openWithRect(D);
    }
  }, [i]);
  ct(() => {
    const I = T.current;
    !f || !I || E(f, I);
  }, [E, f, S]), Nn(t, () => ({
    open: (I, V) => {
      p(I), T.current = V;
      const ee = Oa(I.konvaString);
      v(ee.strokeWidth()), b(ee.opacity() * 100), E(I, V);
    },
    close: () => {
      h.current?.close(), p(null), A(!1), T.current = null;
    }
  }));
  const O = f && De.find((I) => I.type === f.type)?.styleEditable, G = !!l, j = !!(f && (a?.can("annotation.comment", f) || G)), W = !!(f && (a?.can("annotation.edit", f) || G)), L = !!(f && (a?.can("annotation.delete", f) || G)), k = async (I, V) => a?.can(I, V) ? V : !l || !await l({ kind: "mutation", action: I, annotationId: V.id }) ? null : se.getState().getAnnotation(V.id) ?? V, N = (I) => {
    !f || !a || k("annotation.edit", f).then((V) => {
      V && a.updateAnnotationStyle(V, I);
    });
  }, z = () => {
    !f || !a || k("annotation.delete", f).then((I) => {
      I && a.delete(I.id, !0);
    });
  }, H = (I) => {
    if (a?.can("annotation.comment", I)) {
      r("annotator-sidebar-toggle"), se.getState().setSelectedAnnotation(I, $e.CANVAS);
      return;
    }
    k("annotation.comment", I).then((V) => {
      V && (r("annotator-sidebar-toggle"), se.getState().setSelectedAnnotation(V, $e.CANVAS));
    });
  };
  return /* @__PURE__ */ c(
    Xo,
    {
      ref: h,
      renderButtons: () => f ? [
        ...j && s !== "annotator-sidebar-toggle" ? [
          {
            key: "comment",
            icon: /* @__PURE__ */ c(_o, {}),
            onClick: () => {
              H(f), h.current?.close();
            },
            title: n("comment")
          }
        ] : [],
        ...W && O ? [
          {
            key: "palette",
            icon: /* @__PURE__ */ c(us, {}),
            onClick: () => {
              A(!S);
            },
            title: n("color")
          }
        ] : [],
        ...L ? [{
          key: "delete",
          icon: /* @__PURE__ */ c(gs, {}),
          onClick: () => {
            z(), h.current?.close();
          },
          title: n("delete")
        }] : []
      ] : [],
      ...d,
      children: S && f && W && O && /* @__PURE__ */ C("div", { style: { margin: 8 }, children: [
        /* @__PURE__ */ C(
          ye,
          {
            size: "2",
            variant: "ghost",
            color: "gray",
            highContrast: !0,
            onMouseDown: (I) => {
              I.preventDefault(), A(!1);
            },
            children: [
              /* @__PURE__ */ c(Rr, {}),
              n("back")
            ]
          }
        ),
        /* @__PURE__ */ c(tt, { my: "2", size: "4" }),
        O?.color && /* @__PURE__ */ c(
          Et,
          {
            value: f.color ?? void 0,
            onChange: (I) => {
              N({ color: I });
            },
            popover: !1,
            custom: !1,
            presets: u.colors
          }
        ),
        (O?.opacity || O?.strokeWidth) && /* @__PURE__ */ C(Ce, { children: [
          /* @__PURE__ */ c(tt, { my: "3", size: "4" }),
          /* @__PURE__ */ c(lt, { style: { margin: 8 }, children: /* @__PURE__ */ C(Z, { gap: "3", direction: "column", children: [
            O.strokeWidth && /* @__PURE__ */ C(Ce, { children: [
              /* @__PURE__ */ C(ae, { as: "div", size: "2", weight: "bold", children: [
                n("strokeWidth"),
                " (",
                g,
                ")"
              ] }),
              /* @__PURE__ */ c(
                Gn,
                {
                  variant: "soft",
                  size: "1",
                  min: 1,
                  max: 20,
                  defaultValue: [g || 1],
                  onValueChange: (I) => {
                    N({ strokeWidth: I[0] }), v(I[0]);
                  }
                }
              )
            ] }),
            O.opacity && /* @__PURE__ */ C(Ce, { children: [
              /* @__PURE__ */ C(ae, { as: "div", size: "2", weight: "bold", children: [
                n("opacity"),
                " (",
                y,
                "%)"
              ] }),
              /* @__PURE__ */ c(
                Gn,
                {
                  variant: "soft",
                  size: "1",
                  min: 1,
                  max: 100,
                  defaultValue: [y || 100],
                  onValueChange: (I) => {
                    N({ opacity: I[0] / 100 }), b(I[0]);
                  }
                }
              )
            ] })
          ] }) })
        ] })
      ] })
    }
  );
}), oo = 500;
function vn(o) {
  const e = o?.replace(/\s+/g, " ").trim() ?? "";
  return e.length <= oo ? e : `${e.slice(0, oo).trimEnd()}…`;
}
const Ha = "_card_ijigf_1", Ga = "_header_ijigf_7", Ua = "_identity_ijigf_15", za = "_referenceLabel_ijigf_23", Fa = "_referenceLabelStatic_ijigf_44", ja = "_separator_ijigf_50", Wa = "_author_ijigf_54", Ba = "_page_ijigf_61", $a = "_selectedText_ijigf_67", Va = "_preview_ijigf_68", Ya = "_empty_ijigf_69", Ka = "_footer_ijigf_93", Xa = "_deletedComments_ijigf_98", qa = "_deletedCommentsTitle_ijigf_105", Ja = "_deletedCommentAuthor_ijigf_106", Za = "_deletedCommentsMore_ijigf_107", Qa = "_deletedComment_ijigf_98", ec = "_deletedCommentContent_ijigf_117", Me = {
  card: Ha,
  header: Ga,
  identity: Ua,
  referenceLabel: za,
  referenceLabelStatic: Fa,
  separator: ja,
  author: Wa,
  page: Ba,
  selectedText: $a,
  preview: Va,
  empty: Ya,
  footer: Ka,
  deletedComments: Xa,
  deletedCommentsTitle: qa,
  deletedCommentAuthor: Ja,
  deletedCommentsMore: Za,
  deletedComment: Qa,
  deletedCommentContent: ec
}, Zo = ({
  annotation: o,
  children: e,
  onActivate: t,
  onOpenChange: n,
  previewComments: r = []
}) => {
  const { t: s } = ve("annotator", { useSuspense: !1 }), [i, a] = K(!1), l = vn(o.contentsObj?.text), u = vn(o.contentsObj?.selectedText), d = r.length > 0, h = !!(l || u || d), f = o.user?.name || o.title, p = o.comments?.length ?? 0, g = o.referenceNumber === void 0 ? o.title : `#${o.referenceNumber}`, v = () => {
    t && (a(!1), t(o.id));
  }, y = (b) => {
    a(b), n?.(b);
  };
  return /* @__PURE__ */ C(
    ln.Root,
    {
      open: i,
      onOpenChange: y,
      openDelay: 350,
      closeDelay: 150,
      children: [
        /* @__PURE__ */ c(ln.Trigger, { children: e }),
        /* @__PURE__ */ C(
          ln.Content,
          {
            align: "center",
            size: "2",
            className: Me.card,
            onClick: (b) => b.stopPropagation(),
            children: [
              /* @__PURE__ */ C("div", { className: Me.header, children: [
                /* @__PURE__ */ C("span", { className: Me.identity, children: [
                  t ? /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      className: Me.referenceLabel,
                      "aria-label": s("comment.reference.open", {
                        value: g
                      }),
                      onClick: v,
                      children: g
                    }
                  ) : /* @__PURE__ */ c("span", { className: Me.referenceLabelStatic, children: g }),
                  /* @__PURE__ */ c("span", { className: Me.separator, "aria-hidden": "true", children: "·" }),
                  /* @__PURE__ */ c("span", { className: Me.author, children: f })
                ] }),
                /* @__PURE__ */ c("span", { className: Me.page, children: s("comment.reference.previewPage", {
                  value: o.pageNumber
                }) })
              ] }),
              u ? /* @__PURE__ */ c("blockquote", { className: Me.selectedText, children: u }) : null,
              !d && l ? /* @__PURE__ */ c("p", { className: Me.preview, children: l }) : null,
              d ? /* @__PURE__ */ C("section", { className: Me.deletedComments, children: [
                /* @__PURE__ */ c("div", { className: Me.deletedCommentsTitle, children: s("deleteUndo.deletedCommentPreview") }),
                r.slice(0, 3).map((b) => /* @__PURE__ */ C("div", { className: Me.deletedComment, children: [
                  /* @__PURE__ */ c("span", { className: Me.deletedCommentAuthor, children: b.user?.name || b.title }),
                  /* @__PURE__ */ c("p", { className: Me.deletedCommentContent, children: vn(b.content) || s("comment.reference.previewNoContent") })
                ] }, b.id)),
                r.length > 3 ? /* @__PURE__ */ c("div", { className: Me.deletedCommentsMore, children: s("deleteUndo.deletedCommentsMore", {
                  count: r.length - 3
                }) }) : null
              ] }) : null,
              h ? null : /* @__PURE__ */ c("p", { className: Me.empty, children: s("comment.reference.previewNoContent") }),
              p > 0 && !d ? /* @__PURE__ */ c("div", { className: Me.footer, children: s("comment.reference.replyCount", {
                count: p
              }) }) : null
            ]
          }
        )
      ]
    }
  );
}, tc = "_overlay_1ya7e_1", nc = "_snackbar_1ya7e_13", oc = "_content_1ya7e_18", rc = "_message_1ya7e_22", ic = "_reference_1ya7e_29", Mt = {
  overlay: tc,
  snackbar: nc,
  content: oc,
  message: rc,
  reference: ic
}, ro = 24, sc = /#(\d+)/g;
function ac(o) {
  const e = o?.replace(/\s+/g, " ").trim() ?? "", t = Array.from(e);
  return t.length <= ro ? e : `${t.slice(0, ro).join("")}…`;
}
function cc(o) {
  return o.annotationReferenceNumber === void 0 ? "" : ` #${o.annotationReferenceNumber}`;
}
function io(o) {
  return `“${o}”`;
}
function lc(o, e, t) {
  const n = Array.from(new Set(o.map((i) => i.annotationReferenceNumber).filter((i) => i !== void 0))), r = t.startsWith("zh") ? "、" : ", ", s = n.slice(0, 3).map((i) => `#${i}`).join(r);
  return n.length > 3 ? e("annotator:deleteUndo.referencesMore", { references: s }) : s;
}
function dc(o, e, t) {
  if (o.totalCount === 1) {
    const r = o.items[0], s = cc(r), i = ac(r.content);
    if (r.kind === "annotation") {
      if (i)
        return e("annotator:deleteUndo.annotationDeletedDetailed", {
          reference: s,
          detail: io(i)
        });
      const a = De.find((d) => d.type === r.annotationType), l = a ? e(`annotator:tool.${a.name}`) : "", u = l && r.pageNumber ? e("annotator:deleteUndo.typeAndPage", { type: l, page: r.pageNumber }) : l || (r.pageNumber ? e("annotator:deleteUndo.page", { page: r.pageNumber }) : "");
      return u ? e("annotator:deleteUndo.annotationDeletedDetailed", { reference: s, detail: u }) : e("annotator:deleteUndo.annotationDeleted", { reference: s });
    }
    return i ? e("annotator:deleteUndo.commentDeletedDetailed", {
      reference: s,
      detail: io(i)
    }) : r.author ? e("annotator:deleteUndo.commentDeletedByAuthor", { reference: s, author: r.author }) : e("annotator:deleteUndo.commentDeleted", { reference: s });
  }
  const n = lc(o.items, e, t);
  return o.annotationCount === o.totalCount ? n ? e("annotator:deleteUndo.annotationsDeletedDetailed", { count: o.totalCount, references: n }) : e("annotator:deleteUndo.annotationsDeleted", { count: o.totalCount }) : o.commentCount === o.totalCount ? n ? e("annotator:deleteUndo.commentsDeletedDetailed", { count: o.totalCount, references: n }) : e("annotator:deleteUndo.commentsDeleted", { count: o.totalCount }) : n ? e("annotator:deleteUndo.itemsDeletedDetailed", { count: o.totalCount, references: n }) : e("annotator:deleteUndo.itemsDeleted", { count: o.totalCount });
}
function uc(o, e) {
  const t = /* @__PURE__ */ new Map();
  e.forEach((s) => {
    if (s.annotationReferenceNumber === void 0) return;
    const i = t.get(s.annotationReferenceNumber) ?? {
      annotation: s.previewAnnotation,
      comments: []
    };
    s.previewComment && i.comments.push(s.previewComment), t.set(s.annotationReferenceNumber, i);
  });
  const n = [];
  let r = 0;
  for (const s of o.matchAll(sc)) {
    const i = s.index;
    i > r && n.push({ kind: "text", value: o.slice(r, i) });
    const a = t.get(Number(s[1]));
    a ? n.push({
      kind: "reference",
      value: s[0],
      annotation: a.annotation,
      comments: a.comments
    }) : n.push({ kind: "text", value: s[0] }), r = i + s[0].length;
  }
  return r < o.length && n.push({ kind: "text", value: o.slice(r) }), n;
}
function hc() {
  const { painter: o } = nt(), { t: e, i18n: t } = ve(["common", "annotator"], { useSuspense: !1 }), n = $(null), r = $(!1), s = $(!1), i = $(/* @__PURE__ */ new Set()), a = q(
    (p) => o?.subscribeDeleteUndo(p) ?? (() => {
    }),
    [o]
  ), l = q(
    () => o?.getDeleteUndoSnapshot() ?? null,
    [o]
  ), u = lr(a, l, () => null);
  if (!u) return null;
  const d = dc(u, e, t.resolvedLanguage ?? t.language), h = uc(d, u.items), f = (p, g) => {
    if (g) {
      i.current.add(p), o?.pauseDeleteUndo();
      return;
    }
    i.current.delete(p), !r.current && !s.current && i.current.size === 0 && o?.resumeDeleteUndo();
  };
  return /* @__PURE__ */ c("div", { className: Mt.overlay, children: /* @__PURE__ */ c(
    dt.Root,
    {
      ref: n,
      className: Mt.snackbar,
      size: "1",
      role: "status",
      "aria-live": "polite",
      onMouseEnter: () => {
        r.current = !0, o?.pauseDeleteUndo();
      },
      onMouseLeave: () => {
        r.current = !1, !s.current && i.current.size === 0 && o?.resumeDeleteUndo();
      },
      onFocusCapture: () => {
        s.current = !0, o?.pauseDeleteUndo();
      },
      onBlurCapture: (p) => {
        n.current?.contains(p.relatedTarget) || (s.current = !1, !r.current && i.current.size === 0 && o?.resumeDeleteUndo());
      },
      children: /* @__PURE__ */ C(Z, { className: Mt.content, align: "center", gap: "2", children: [
        /* @__PURE__ */ c(dt.Text, { className: Mt.message, children: h.map((p, g) => {
          if (p.kind === "text")
            return /* @__PURE__ */ c(Pt.Fragment, { children: p.value }, `text-${g}`);
          const v = `${p.annotation.id}-${g}`;
          return /* @__PURE__ */ c(
            Zo,
            {
              annotation: p.annotation,
              previewComments: p.comments,
              onOpenChange: (y) => f(v, y),
              children: /* @__PURE__ */ c("button", { className: Mt.reference, type: "button", children: p.value })
            },
            v
          );
        }) }),
        /* @__PURE__ */ c(
          ye,
          {
            size: "1",
            onClick: () => o?.undoDelete(),
            children: e(u.totalCount === 1 ? "common:restore" : "common:restoreAll")
          }
        )
      ] })
    }
  ) });
}
const so = "inklayer-annotator", ao = "annotator-sidebar-toggle", pc = ({
  enableNativeAnnotations: o,
  annotations: e,
  annotationPermissions: t,
  defaultShowAnnotationAuthorLabels: n = !1,
  onLoad: r,
  onAnnotationAdd: s,
  onAnnotationDelete: i,
  onAnnotationSelected: a,
  onAnnotationChanged: l
}) => {
  const {
    isReady: u,
    pdfViewer: d,
    eventBus: h,
    isSidebarCollapsed: f,
    activeSidebarPanel: p,
    openSidebar: g
  } = Fe(), { user: v } = Eo(), { refreshPainter: y, setPainter: b } = nt(), { defaultOptions: S, primaryColor: A } = Nt(), T = se((I) => I.clearAnnotations), E = $({
    annotations: e ?? [],
    enableNativeAnnotations: o,
    onLoad: r,
    onAnnotationAdd: s,
    onAnnotationDelete: i,
    onAnnotationSelected: a,
    onAnnotationChanged: l
  });
  E.current = {
    annotations: e ?? [],
    enableNativeAnnotations: o,
    onLoad: r,
    onAnnotationAdd: s,
    onAnnotationDelete: i,
    onAnnotationSelected: a,
    onAnnotationChanged: l
  };
  const O = $(null), G = $(null), j = $(null), W = $(v), L = $(t), k = $({ activeSidebarPanel: p, openSidebar: g }), N = $(n);
  W.current = v, L.current = t, k.current = { activeSidebarPanel: p, openSidebar: g };
  const z = $(
    La(
      () => {
        G.current?.close(), O.current?.close();
        const I = document.querySelector(`#${zo}`);
        if (I?.parentNode)
          try {
            I.parentNode.removeChild(I);
          } catch {
          }
      },
      100,
      !0
    )
  ).current, H = q(() => {
    z();
  }, [z]);
  return te(() => {
    if (T(), !u || !d || !h || !W.current) return;
    let I = !1, V = !1, ee = null;
    const X = new ka({
      primaryColor: A,
      defaultOptions: S,
      currentUser: W.current,
      annotationPermissions: L.current,
      defaultShowAnnotationAuthorLabels: N.current,
      PDFViewerApplication: d,
      onTextSelected: (Y) => {
        O.current?.open(Y);
      },
      onAnnotationAdd: (Y) => {
        E.current.onAnnotationAdd(Y);
      },
      onAnnotationDelete: (Y) => {
        E.current.onAnnotationDelete(Y);
      },
      onAnnotationSelected: (Y, D, J) => {
        const de = k.current;
        D && Y && de.activeSidebarPanel !== ao && de.openSidebar?.(ao), D && Y && G.current?.open(Y, J), E.current.onAnnotationSelected(Y ?? null, D);
      },
      onAnnotationChanging: () => {
        G.current?.close();
      },
      onAnnotationChanged: (Y, D) => {
        Y && D && G.current?.open(Y, D), Y && E.current.onAnnotationChanged(Y);
      }
    });
    j.current = X, b(X);
    const x = ({ source: Y, cssTransform: D, pageNumber: J }) => {
      X.initCanvas({
        pageView: Y,
        cssTransform: D,
        pageNumber: J
      });
    };
    h.on("pagerendered", x), h._on("updateviewarea", H), X.initWebSelection(d.viewer);
    const P = async () => {
      if (!(I || V)) {
        V = !0;
        try {
          const { annotations: Y, enableNativeAnnotations: D } = E.current;
          await X.initAnnotationsOnce(Y, D);
        } catch (Y) {
          I || console.error("[Annotator] Failed to initialize annotations", Y);
          return;
        }
        I || (ee = setTimeout(() => {
          if (ee = null, !I)
            for (let Y = 0; Y < d.pagesCount; Y++) {
              const D = d.getPageView(Y);
              if (D && D.div && D.canvas) {
                const J = X.getKonvaCanvasStore();
                J && J.has(Y + 1) && X.reRenderAnnotations(Y + 1);
              }
            }
        }, 0), E.current.onLoad?.());
      }
    };
    return d.pdfDocument ? P() : h.on("documentloaded", P), () => {
      I = !0, ee && (clearTimeout(ee), ee = null), h.off("pagerendered", x), h.off("updateviewarea", H), h.off("documentloaded", P), X.destroy(), j.current === X && (j.current = null), b(null);
    };
  }, [T, S, h, H, u, d, A, b]), ct(() => {
    W.current && (G.current?.close(), j.current?.setPermissionContext(W.current, L.current), j.current && y());
  }, [t, y, v]), te(() => {
    if (!h) return;
    const I = (ee) => {
      const X = /* @__PURE__ */ new Map();
      ee.forEach((x) => {
        X.set(x.pageNumber, (X.get(x.pageNumber) ?? 0) + 1);
      }), h.dispatch(Yt, {
        source: so,
        markers: X
      });
    };
    I(se.getState().annotations);
    const V = se.subscribe((ee, X) => {
      ee.annotations !== X.annotations && I(ee.annotations);
    });
    return () => {
      V(), h.dispatch(Yt, {
        source: so,
        markers: /* @__PURE__ */ new Map()
      });
    };
  }, [h]), te(() => {
    H();
  }, [H, f]), /* @__PURE__ */ C(Ce, { children: [
    /* @__PURE__ */ c(Ra, { ref: O }),
    /* @__PURE__ */ c(_a, { ref: G }),
    /* @__PURE__ */ c(hc, {})
  ] });
}, fc = {
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
}, gc = {
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
}, mc = ["common", "viewer", "annotator"];
Te.use(kr).init({
  resources: {
    "zh-CN": fc,
    "en-US": gc
  },
  lng: "zh-CN",
  fallbackLng: "en-US",
  ns: mc,
  defaultNS: "common",
  interpolation: { escapeValue: !1 }
});
const At = en(({
  icon: o,
  selected: e,
  onClick: t,
  disabled: n = !1,
  title: r,
  label: s,
  tooltip: i = "auto",
  tooltipSide: a = "bottom",
  className: l,
  onPointerEnter: u,
  onPointerLeave: d,
  onFocus: h,
  onBlur: f,
  buttonProps: p = {}
}, g) => {
  const [v, y] = K(!1);
  te(() => {
    if (!r || i === "none" || typeof window > "u") return;
    const A = () => y(!1);
    return window.addEventListener("inklayer:close-toolbar-tooltips", A), window.addEventListener("scroll", A, !0), () => {
      window.removeEventListener("inklayer:close-toolbar-tooltips", A), window.removeEventListener("scroll", A, !0);
    };
  }, [r, i]), te(() => {
    e === void 0 || typeof window > "u" || window.dispatchEvent(new Event("inklayer:close-toolbar-tooltips"));
  }, [e]);
  const S = /* @__PURE__ */ C(
    et,
    {
      ref: g,
      className: l,
      color: e ? void 0 : "gray",
      variant: e ? "soft" : "outline",
      style: {
        opacity: n ? 0.5 : 1,
        boxShadow: "none"
      },
      onClick: t,
      disabled: n,
      "aria-label": r,
      "aria-pressed": e === void 0 ? void 0 : e,
      "data-inklayer-toolbar-button": "true",
      "data-selected": e ? "true" : "false",
      ...p,
      onPointerEnter: u,
      onPointerLeave: d,
      onFocus: h,
      onBlur: f,
      onPointerDown: () => {
        y(!1), typeof window < "u" && window.dispatchEvent(new Event("inklayer:close-toolbar-tooltips"));
      },
      children: [
        o,
        s
      ]
    }
  );
  return r && i !== "none" ? /* @__PURE__ */ c(Rt, { content: r, side: a, open: v, onOpenChange: y, children: S }) : S;
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
}, qt = () => {
  const { t: o } = ve("viewer", { useSuspense: !1 }), { pdfViewer: e, eventBus: t } = Fe(), [n, r] = K("auto");
  te(() => {
    if (!t || !e) return;
    const f = () => {
      const p = e.currentScaleValue;
      r(p || "auto");
    };
    return t.on("scalechanging", f), t.on("pagesloaded", f), () => {
      t.off("scalechanging", f), t.off("pagesloaded", f);
    };
  }, [t, e]);
  const s = (f) => {
    if (["auto", "page-actual", "page-fit", "page-width"].includes(f))
      return null;
    const p = parseFloat(f);
    return isNaN(p) ? null : p;
  }, i = (f) => {
    r(f), e && (e.currentScaleValue = f);
  }, a = () => {
    let f = s(n);
    f === null && (f = e ? e.currentScale : 1);
    const p = Math.min(f + St.ZOOM_STEP, St.MAX_SCALE), g = Math.round(p * 100) / 100;
    i(g.toString());
  }, l = () => {
    let f = s(n);
    f === null && (f = e ? e.currentScale : 1);
    const p = Math.max(f - St.ZOOM_STEP, St.MIN_SCALE), g = Math.round(p * 100) / 100;
    i(g.toString());
  }, u = () => (s(n) ?? (e?.currentScale || 1)) >= St.MAX_SCALE, d = () => (s(n) ?? (e?.currentScale || 1)) <= St.MIN_SCALE, h = (() => {
    const f = St.ZOOM_OPTIONS.find((g) => g.value === n);
    if (f)
      return "labelKey" in f && f.labelKey ? o(f.labelKey) : "label" in f ? f.label : n;
    const p = parseFloat(n);
    return isNaN(p) ? o("viewer:zoom.auto") : `${Math.round(p * 100)}%`;
  })();
  return /* @__PURE__ */ C(Z, { gap: "2", align: "center", children: [
    /* @__PURE__ */ c(
      At,
      {
        title: "缩小",
        tooltipSide: "top",
        buttonProps: {
          size: "1",
          disabled: d()
        },
        icon: /* @__PURE__ */ c(Pr, {}),
        onClick: l
      }
    ),
    /* @__PURE__ */ C(me.Root, { onOpenChange: (f) => {
      f && window.dispatchEvent(new Event("inklayer:close-toolbar-tooltips"));
    }, children: [
      /* @__PURE__ */ c(me.Trigger, { children: /* @__PURE__ */ C(ye, { "aria-label": "选择缩放比例", variant: "ghost", size: "2", color: "gray", style: { width: 80 }, children: [
        h,
        /* @__PURE__ */ c(me.TriggerIcon, {})
      ] }) }),
      /* @__PURE__ */ c(me.Content, { children: St.ZOOM_OPTIONS.map((f) => /* @__PURE__ */ c(
        me.Item,
        {
          onSelect: () => i(f.value),
          children: "labelKey" in f ? o(f.labelKey) : f.label
        },
        f.key
      )) })
    ] }),
    /* @__PURE__ */ c(
      At,
      {
        title: "放大",
        tooltipSide: "top",
        buttonProps: {
          size: "1",
          disabled: u()
        },
        icon: /* @__PURE__ */ c(Nr, {}),
        onClick: a
      }
    )
  ] });
}, vc = "_SignatureTool_mpyjt_1", yc = "_container_mpyjt_1", bc = "_info_mpyjt_23", Sc = "_imagePreview_mpyjt_34", wc = "_toolbar_mpyjt_48", Cc = "_colorPalette_mpyjt_53", Ac = "_cell_mpyjt_58", Tc = "_active_mpyjt_75", xc = "_toolbarDark_mpyjt_84", kc = "_SignaturePop_mpyjt_94", Qe = {
  SignatureTool: vc,
  container: yc,
  info: bc,
  imagePreview: Sc,
  toolbar: wc,
  colorPalette: Cc,
  cell: Ac,
  active: Tc,
  toolbarDark: xc,
  SignaturePop: kc
}, Jt = /* @__PURE__ */ new Set();
function Ec(o) {
  if (!o.external || !o.url || Jt.has(o.value)) return;
  const e = document.createElement("style");
  e.innerHTML = `
    @font-face {
        font-family: '${o.value}';
        src: url('${o.url}') format('truetype');
        font-weight: normal;
        font-style: normal;
    }
    `, document.head.appendChild(e), Jt.add(o.value);
}
async function Rc(o) {
  if (!(!o.external || !o.url || Jt.has(o.value)))
    try {
      const e = new FontFace(o.value, `url(${o.url})`);
      await e.load(), document.fonts.add(e), Jt.add(o.value);
    } catch {
      Ec(o);
    }
}
const zt = 80, Pc = ({ annotation: o, disabled: e = !1, onAdd: t, default_signatures: n, presentation: r = "toolbar-icon", label: s, selected: i, onIntent: a }) => {
  const { defaultOptions: l } = Nt(), u = l.signature.colors, d = 420, h = 200, f = l.signature.type, p = l.signature.maxSize, g = l.signature.accept, v = 600, y = l.signature.defaultFont, { t: b } = ve(["common", "annotator"], { useSuspense: !1 }), S = $(null), A = $(null), T = $(u[0]), E = $(null), [O, G] = K(!1), [j, W] = K(T.current), [L, k] = K(!0), [N, z] = K([]), [H, I] = K(null), [V, ee] = K(""), [X, x] = K(y[0]?.value || "Arial"), [P, Y] = K(null), [D, J] = K(!1), { appearance: de } = tn(), ce = n ?? l.signature.defaultSignature, _ = p;
  te(() => {
    T.current = j;
  }, [j]);
  const ne = (m) => {
    t(m);
  }, le = async (m) => {
    const w = y.find((U) => U.value === m);
    w && w.external && await Rc(w), x(m);
  }, fe = $({ fontFamily: X, signatureTypeDefault: f, loadFont: le });
  fe.current = { fontFamily: X, signatureTypeDefault: f, loadFont: le };
  const Ae = () => {
    if (!V.trim()) return null;
    const m = document.createElement("canvas");
    m.width = d / 1.1, m.height = h;
    const w = m.getContext("2d");
    if (!w) return null;
    const U = 20;
    w.clearRect(0, 0, m.width, m.height), w.font = `${zt}px "${X}", cursive, sans-serif`;
    const B = w.measureText(V).width, ue = B + U * 2 > m.width ? (m.width - U * 2) / B : 1;
    return w.font = `${zt * ue}px "${X}", cursive, sans-serif`, w.textAlign = "center", w.textBaseline = "middle", w.imageSmoothingEnabled = !0, w.shadowColor = "rgba(0, 0, 0, 0.1)", w.shadowBlur = 2, w.shadowOffsetX = 1, w.shadowOffsetY = 1, w.fillStyle = j, w.fillText(V, m.width / 2, m.height / 2), m.toDataURL("image/png");
  }, Ze = () => {
    if (H === "Upload") {
      P && (z((m) => [...m, P]), ne(P), G(!1));
      return;
    }
    if (H === "Enter") {
      const m = Ae();
      m && (z((w) => [...w, m]), ne(m), G(!1));
      return;
    }
    if (H === "Draw") {
      const m = A.current?.toDataURL();
      m && (z((w) => [...w, m]), ne(m), G(!1));
      return;
    }
  }, Ve = () => {
    const m = A.current;
    m && (m.clear(), m.getLayers().forEach((w) => w.destroyChildren()), k(!0)), ee(""), Y(null);
  }, He = () => {
    if (!S.current) return;
    const m = new M.Stage({
      container: S.current,
      width: d,
      height: h
    }), w = new M.Layer();
    m.add(w), A.current = m;
    let U = !1, B = null;
    const ue = () => {
      U = !0;
      const Se = m.getPointerPosition();
      Se && (B = new M.Line({
        stroke: T.current,
        strokeWidth: 3,
        globalCompositeOperation: "source-over",
        lineCap: "round",
        lineJoin: "round",
        points: [Se.x, Se.y]
      }), w.add(B));
    }, he = (Se) => {
      if (!U || !B) return;
      Se.evt.preventDefault();
      const We = m.getPointerPosition();
      if (!We) return;
      const ht = B.points().concat([We.x, We.y]);
      B.points(ht), k(!1);
    }, pe = () => {
      U = !1, B = null;
    };
    m.on("mousedown touchstart", ue), m.on("mouseup touchend", pe), m.on("mousemove touchmove", he);
  }, je = (m) => {
    W(m), (A.current?.getLayers()[0].getChildren((U) => U.getClassName() === "Line") || []).forEach((U) => U.stroke(m));
  }, Ye = (m) => {
    const w = m.target, U = w.files;
    if (!U?.length) return;
    const B = U[0];
    if (B.size > _) {
      J(!0), setTimeout(() => J(!1), 3e3), w && (w.value = "");
      return;
    }
    const ue = new FileReader();
    ue.onload = async (he) => {
      const pe = he.target?.result, Se = new Image();
      Se.src = pe, Se.onload = () => {
        const We = v, ht = v;
        let { width: Ke, height: _e } = Se;
        Ke > _e && Ke > We ? (_e = Math.round(_e * We / Ke), Ke = We) : _e > ht && (Ke = Math.round(Ke * ht / _e), _e = ht);
        const Ge = document.createElement("canvas"), vt = Ge.getContext("2d");
        if (Ge.width = Ke, Ge.height = _e, vt) {
          vt.drawImage(Se, 0, 0, Ke, _e);
          const wt = Ge.toDataURL("image/png");
          w.value = "", Y(wt), k(!1);
        }
      };
    }, ue.readAsDataURL(B);
  };
  return te(() => {
    ee(""), Y(null), (H === "Enter" || H === "Draw" || H === "Upload") && k(!0);
  }, [H]), te(() => {
    k(V.trim().length === 0);
  }, [V]), te(() => {
    if (O) {
      const m = fe.current;
      m.loadFont(m.fontFamily), ee(""), Y(null), I(m.signatureTypeDefault);
    }
  }, [O]), te(() => {
    O && H === "Draw" ? setTimeout(() => {
      He();
    }, 300) : (A.current?.destroy(), A.current = null);
  }, [H, O]), /* @__PURE__ */ C(Ce, { children: [
    /* @__PURE__ */ C(xe.Root, { children: [
      /* @__PURE__ */ c(xe.Trigger, { children: /* @__PURE__ */ c(
        At,
        {
          disabled: e,
          selected: i,
          tooltip: r === "menu-item" ? "none" : "auto",
          title: b(`annotator:tool.${o.name}`),
          label: r === "menu-item" ? s : void 0,
          buttonProps: r === "menu-item" ? { variant: "ghost", size: "2", style: { width: "100%", justifyContent: "flex-start", gap: 8 } } : void 0,
          icon: o.icon,
          onClick: a
        }
      ) }),
      /* @__PURE__ */ c(xe.Content, { size: "1", style: { width: 180 }, onCloseAutoFocus: (m) => m.preventDefault(), children: /* @__PURE__ */ C("div", { className: Qe.SignaturePop, children: [
        /* @__PURE__ */ C("ul", { className: Qe.container, children: [
          ce.map((m, w) => /* @__PURE__ */ c(xe.Close, { children: /* @__PURE__ */ c("li", { onClick: () => ne(m), children: /* @__PURE__ */ c("img", { src: m }) }, w) }, w)),
          N.map((m, w) => /* @__PURE__ */ c(xe.Close, { children: /* @__PURE__ */ c("li", { onClick: () => ne(m), children: /* @__PURE__ */ c("img", { src: m }) }, w) }, w))
        ] }),
        /* @__PURE__ */ c(xe.Close, { children: /* @__PURE__ */ C(ye, { style: { width: "100%" }, variant: "soft", onClick: () => {
          G(!0);
        }, children: [
          /* @__PURE__ */ c(bo, {}),
          " ",
          b("annotator:common.createSignature")
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ c(at.Root, { open: O, onOpenChange: G, children: /* @__PURE__ */ C(at.Content, { style: { width: "550px" }, children: [
      /* @__PURE__ */ c(at.Title, { children: b("annotator:common.createSignature") }),
      /* @__PURE__ */ c(Z, { as: "span", justify: "center", mb: "4", children: /* @__PURE__ */ C(gt.Root, { size: "3", defaultValue: f, onValueChange: (m) => I(m), radius: "full", children: [
        /* @__PURE__ */ c(gt.Item, { value: "Enter", children: b("enter") }),
        /* @__PURE__ */ c(gt.Item, { value: "Draw", children: b("draw") }),
        /* @__PURE__ */ c(gt.Item, { value: "Upload", children: b("annotator:editor.signature.upload") })
      ] }) }),
      /* @__PURE__ */ C("div", { className: Qe.SignatureTool, children: [
        /* @__PURE__ */ C("div", { className: Qe.container, style: { width: d }, children: [
          H === "Enter" && /* @__PURE__ */ c(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: V,
              onChange: (m) => ee(m.target.value),
              placeholder: b("annotator:editor.signature.area"),
              style: {
                height: h - 2,
                width: d / 1.1,
                color: j,
                fontFamily: `${X}`,
                fontSize: zt,
                lineHeight: `${zt}px`
              }
            }
          ),
          H === "Draw" && /* @__PURE__ */ C(Ce, { children: [
            /* @__PURE__ */ c("div", { className: Qe.info, children: b("annotator:editor.signature.area") }),
            /* @__PURE__ */ c(
              "div",
              {
                ref: S,
                style: {
                  height: h,
                  width: d
                }
              }
            )
          ] }),
          H === "Upload" && /* @__PURE__ */ c("div", { style: {
            height: h,
            width: d
          }, children: P ? /* @__PURE__ */ c("div", { className: Qe.imagePreview, style: {
            height: h,
            width: d
          }, children: /* @__PURE__ */ c("img", { src: P, alt: "preview" }) }) : /* @__PURE__ */ C("div", { style: {
            height: h,
            width: d
          }, children: [
            /* @__PURE__ */ c("input", { style: { display: "none" }, type: "file", ref: E, accept: g, onChange: Ye }),
            /* @__PURE__ */ C(Z, { height: `${h}px`, direction: "column", gap: "3", justify: "center", align: "center", children: [
              /* @__PURE__ */ C(ye, { size: "3", onClick: () => {
                E.current?.click();
              }, children: [
                /* @__PURE__ */ c(So, {}),
                " ",
                b("annotator:editor.signature.choose")
              ] }),
              /* @__PURE__ */ c(ae, { color: "gray", size: "2", style: { textAlign: "center" }, children: b("annotator:editor.signature.uploadHint", { format: g, maxSize: wn(p) }) }),
              D && /* @__PURE__ */ c(dt.Root, { color: "red", mt: "3", children: /* @__PURE__ */ c(dt.Text, { children: b("fileSizeLimit", { value: wn(_) }) }) })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ c("div", { className: `${Qe.toolbar} ${de === "dark" ? Qe.toolbarDark : ""}`, style: { width: d }, children: /* @__PURE__ */ C(Z, { justify: "between", align: "center", gap: "2", children: [
          /* @__PURE__ */ C("div", { className: Qe.colorPalette, children: [
            H !== "Upload" && /* @__PURE__ */ c(Ce, { children: u.map((m) => /* @__PURE__ */ c("div", { onClick: () => je(m), className: `${Qe.cell} ${m === j ? Qe.active : ""}`, children: /* @__PURE__ */ c("span", { style: { backgroundColor: m } }) }, m)) }),
            H === "Enter" && /* @__PURE__ */ c(Ce, { children: /* @__PURE__ */ C(Re.Root, { onValueChange: async (m) => {
              await le(m);
            }, defaultValue: X, size: "1", children: [
              /* @__PURE__ */ c(Re.Trigger, {}),
              /* @__PURE__ */ c(Re.Content, { children: y.map((m) => /* @__PURE__ */ c(Re.Item, { value: m.value, children: m.label }, m.value)) })
            ] }) })
          ] }),
          /* @__PURE__ */ c(ye, { variant: "ghost", mr: "3", onClick: Ve, children: b("clear") })
        ] }) }),
        /* @__PURE__ */ C(Z, { gap: "3", mt: "4", justify: "end", children: [
          /* @__PURE__ */ c(at.Close, { children: /* @__PURE__ */ c(ye, { style: { width: 100 }, variant: "soft", color: "gray", children: b("cancel") }) }),
          /* @__PURE__ */ c(at.Close, { children: /* @__PURE__ */ c(ye, { disabled: L, style: { width: 100 }, onClick: Ze, children: b("ok") }) })
        ] })
      ] })
    ] }) })
  ] });
}, Nc = "_StampPop_1pr7b_1", Ic = "_container_1pr7b_4", Mc = "_StampTool_1pr7b_38", Dc = "_imagePreview_1pr7b_45", Lc = "_imagePreviewDark_1pr7b_54", Oc = "_formItem_1pr7b_58", Ue = {
  StampPop: Nc,
  container: Ic,
  StampTool: Mc,
  imagePreview: Dc,
  imagePreviewDark: Lc,
  formItem: Oc
};
To.extend(ti);
const co = "StampGroup", Ft = 470, Dt = 120, _c = [
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
], Hc = ({ annotation: o, disabled: e = !1, default_stamps: t, onAdd: n, presentation: r = "toolbar-icon", label: s, selected: i, onIntent: a }) => {
  const { defaultOptions: l } = Nt(), u = l.stamp.maxSize, d = l.stamp.accept, h = 600, f = l.stamp.editor.defaultFont, p = l.stamp.editor.defaultTextColor, g = l.stamp.editor.defaultBorderStyle, v = l.stamp.editor.defaultBackgroundColor, y = l.stamp.editor.defaultBorderColor, b = l.colors, { t: S } = ve(["common", "annotator"]), A = $(null), T = $(null), E = $(null), { user: O } = Eo(), [G, j] = K([]), { appearance: W } = tn(), L = t ?? l.stamp.defaultStamp, [k, N] = K(!1), [z, H] = K(L.length === 0 ? "custom" : "default"), [I, V] = K({
    stampText: S("annotator:editor.stamp.defaultText"),
    fontStyle: [],
    fontFamily: f[0].value,
    textColor: p,
    backgroundColor: v,
    borderColor: y,
    borderStyle: g,
    timestamp: ["username", "date"],
    customTimestampText: "",
    dateFormat: "YYYY-MM-DD"
  });
  ct(() => {
    V((_) => ({
      ..._,
      stampText: S("annotator:editor.stamp.defaultText")
    }));
  }, [S]);
  const [ee, X] = K(null), x = (_) => {
    n(_);
  }, P = () => {
    const _ = T.current?.getLayers()[0];
    if (!_) return;
    const ne = _.getChildren((fe) => fe.name() === co)[0];
    if (!ne) return;
    const le = T.current?.toDataURL({
      x: ne.x(),
      y: ne.y(),
      width: ne.width(),
      height: ne.height()
    });
    le && (j((fe) => [...fe, le]), x(le), N(!1));
  }, Y = (_) => {
    const ne = _.target, le = ne.files;
    if (!le?.length) return;
    const fe = le[0];
    if (fe.size > u) {
      alert(S("fileSizeLimit", { value: wn(u) })), ne && (ne.value = "");
      return;
    }
    const Ae = new FileReader();
    Ae.onload = async (Ze) => {
      const Ve = Ze.target?.result, He = new Image();
      He.src = Ve, He.onload = () => {
        const je = h, Ye = h;
        let { width: m, height: w } = He;
        m > w && m > je ? (w = Math.round(w * je / m), m = je) : w > Ye && (m = Math.round(m * Ye / w), w = Ye);
        const U = document.createElement("canvas"), B = U.getContext("2d");
        if (U.width = m, U.height = w, B) {
          B.drawImage(He, 0, 0, m, w);
          const ue = U.toDataURL("image/png");
          ne.value = "", j((he) => [...he, ue]);
        }
      };
    }, Ae.readAsDataURL(fe);
  }, D = (_, ne) => {
    const le = {
      ...I,
      [_]: ne
    };
    V(le), X(le), J(le);
  }, J = (_) => {
    if (!A.current) return;
    const { stampText: ne, fontStyle: le, textColor: fe, backgroundColor: Ae, borderColor: Ze, borderStyle: Ve, timestamp: He, dateFormat: je, fontFamily: Ye } = _;
    T.current?.destroy();
    const m = new M.Stage({
      container: A.current,
      width: Ft,
      height: Dt
    }), w = new M.Layer(), U = [];
    le.includes("italic") && U.push("italic"), le.includes("bold") && U.push("bold");
    const B = U.join(" ") || "normal", ue = le.includes("underline"), he = le.includes("strikeout"), pe = To(), Se = O?.name, We = je ? pe.format(je) : "", ht = _.customTimestampText?.trim(), _e = [
      He.includes("username") ? Se : null,
      He.includes("date") ? We : null,
      ht || null
    ].filter(Boolean).join(" · ");
    let Ge = 30;
    const vt = 16, wt = 10, Gt = new M.Text({
      text: ne,
      fontSize: Ge,
      fontStyle: B,
      fontFamily: Ye
    }), on = new M.Text({
      text: _e,
      fontSize: vt,
      fontFamily: Ye
    }), rn = Math.max(Gt.width(), on.width()) + 60, we = Ge + wt + vt + 25, pt = Math.max(rn, 180), yt = Math.max(we, 60), ot = new M.Rect({
      name: co,
      width: pt,
      height: yt,
      x: (Ft - pt) / 2,
      y: (Dt - yt) / 2,
      fill: Ae,
      strokeWidth: Ve === "none" ? 0 : 5,
      stroke: Ze,
      dash: Ve === "dashed" ? [5, 5] : void 0,
      cornerRadius: 10
    });
    w.add(ot), _e || (Ge = Ge * 1.2);
    let rt;
    _e ? rt = (Dt - yt) / 2 + 15 : rt = (Dt - yt) / 2 + yt / 2 - Ge / 2;
    const sn = new M.Text({
      text: ne,
      x: 0,
      y: rt,
      width: Ft,
      align: "center",
      fontSize: Ge,
      fontStyle: B,
      fontFamily: Ye,
      fill: fe
    });
    if (w.add(sn), ue) {
      const It = sn.y() + Ge + 4, an = new M.Line({
        points: [ot.x(), It, ot.x() + ot.width(), It],
        stroke: fe,
        strokeWidth: 2
      });
      w.add(an);
    }
    if (he) {
      const It = sn.y() + Ge / 2, an = new M.Line({
        points: [ot.x(), It, ot.x() + ot.width(), It],
        stroke: fe,
        strokeWidth: 2
      });
      w.add(an);
    }
    const cr = new M.Text({
      text: _e,
      x: 0,
      y: rt + Ge + wt,
      width: Ft,
      align: "center",
      fontSize: vt,
      fontFamily: Ye,
      fill: fe
    });
    _e && w.add(cr), m.add(w), T.current = m;
  }, de = $(I);
  de.current = ee ?? I;
  const ce = $(J);
  return ce.current = J, ct(() => {
    if (k) {
      const ne = requestAnimationFrame(() => {
        A.current && ce.current(de.current);
      });
      return () => cancelAnimationFrame(ne);
    }
    const _ = T.current;
    _ && (_.destroy(), T.current = null);
  }, [k]), /* @__PURE__ */ C(Ce, { children: [
    /* @__PURE__ */ C(xe.Root, { children: [
      /* @__PURE__ */ c(xe.Trigger, { children: /* @__PURE__ */ c(
        At,
        {
          disabled: e,
          selected: i,
          tooltip: r === "menu-item" ? "none" : "auto",
          title: S(`annotator:tool.${o.name}`),
          label: r === "menu-item" ? s : void 0,
          buttonProps: r === "menu-item" ? { variant: "ghost", size: "2", style: { width: "100%", justifyContent: "flex-start", gap: 8 } } : void 0,
          icon: o.icon,
          onClick: a
        }
      ) }),
      /* @__PURE__ */ c(
        xe.Content,
        {
          size: "1",
          onCloseAutoFocus: (_) => {
            _.preventDefault(), H(L.length === 0 ? "custom" : "default");
          },
          children: /* @__PURE__ */ C("div", { className: Ue.StampPop, children: [
            /* @__PURE__ */ c(Z, { align: "center", justify: "center", mb: "4", children: /* @__PURE__ */ c(
              gt.Root,
              {
                radius: "full",
                defaultValue: L.length === 0 ? "custom" : "default",
                onValueChange: (_) => H(_),
                children: L.length === 0 ? /* @__PURE__ */ C(Ce, { children: [
                  /* @__PURE__ */ c(gt.Item, { value: "custom", children: S("custom") }),
                  /* @__PURE__ */ c(gt.Item, { value: "default", children: S("default") })
                ] }) : /* @__PURE__ */ C(Ce, { children: [
                  /* @__PURE__ */ c(gt.Item, { value: "default", children: S("default") }),
                  /* @__PURE__ */ c(gt.Item, { value: "custom", children: S("custom") })
                ] })
              }
            ) }),
            z === "default" && /* @__PURE__ */ C(Ce, { children: [
              L.length === 0 && /* @__PURE__ */ c(Z, { align: "center", justify: "center", gap: "2", children: /* @__PURE__ */ C(dt.Root, { variant: "soft", color: "gray", size: "1", style: { width: "100%" }, children: [
                /* @__PURE__ */ c(dt.Icon, { children: /* @__PURE__ */ c(Ir, {}) }),
                /* @__PURE__ */ c(dt.Text, { children: S("annotator:editor.stamp.defaultStampNotSet") })
              ] }) }),
              /* @__PURE__ */ c("ul", { className: Ue.container, children: L.map((_, ne) => /* @__PURE__ */ c(xe.Close, { children: /* @__PURE__ */ c("li", { onClick: () => x(_), children: /* @__PURE__ */ c("img", { src: _ }) }, ne) }, ne)) })
            ] }),
            /* @__PURE__ */ c("div", { children: z === "custom" && /* @__PURE__ */ C(Ce, { children: [
              /* @__PURE__ */ c("ul", { className: Ue.container, children: G.map((_, ne) => /* @__PURE__ */ c(xe.Close, { children: /* @__PURE__ */ c("li", { onClick: () => x(_), children: /* @__PURE__ */ c("img", { src: _ }) }, ne) }, ne)) }),
              /* @__PURE__ */ c(Z, { gap: "4", p: "1", children: /* @__PURE__ */ c(xe.Close, { children: /* @__PURE__ */ C(
                ye,
                {
                  variant: "soft",
                  style: { width: "100%" },
                  onClick: () => {
                    N(!0);
                  },
                  children: [
                    /* @__PURE__ */ c(bo, {}),
                    " ",
                    S("annotator:common.createStamp")
                  ]
                }
              ) }) }),
              /* @__PURE__ */ c(tt, { my: "3", size: "4" }),
              /* @__PURE__ */ c("input", { style: { display: "none" }, type: "file", ref: E, accept: d, onChange: Y }),
              /* @__PURE__ */ c(Z, { gap: "2", justify: "end", children: /* @__PURE__ */ C(
                ye,
                {
                  variant: "ghost",
                  mr: "3",
                  onClick: () => {
                    E.current?.click();
                  },
                  children: [
                    /* @__PURE__ */ c(So, {}),
                    S("annotator:editor.stamp.upload")
                  ]
                }
              ) })
            ] }) })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ c(at.Root, { open: k, onOpenChange: N, children: /* @__PURE__ */ C(at.Content, { style: { width: "550px" }, children: [
      /* @__PURE__ */ c(at.Title, { children: S("annotator:common.createStamp") }),
      /* @__PURE__ */ C("div", { className: Ue.StampTool, children: [
        /* @__PURE__ */ C("div", { className: Ue.container, children: [
          /* @__PURE__ */ c(
            "div",
            {
              className: `${Ue.imagePreview} ${W === "dark" ? Ue.imagePreviewDark : ""}`,
              ref: A,
              style: {
                height: Dt
              }
            }
          ),
          /* @__PURE__ */ C(Wt, { align: "center", columns: "22", gap: "5", mt: "3", children: [
            /* @__PURE__ */ c(Z, { direction: "column", gridColumn: "span 22", children: /* @__PURE__ */ C(ae, { as: "label", size: "2", children: [
              S("annotator:editor.stamp.stampText"),
              /* @__PURE__ */ c(kt.Root, { value: I.stampText, onChange: (_) => D("stampText", _.target.value) })
            ] }) }),
            /* @__PURE__ */ C(Z, { direction: "column", gridColumn: "span 9", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: S("annotator:editor.stamp.textColor") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ c(
                Et,
                {
                  transparent: !0,
                  value: I.textColor,
                  onChange: (_) => D("textColor", _),
                  presets: b,
                  popover: !0
                }
              ) })
            ] }),
            /* @__PURE__ */ C(Z, { direction: "column", gridColumn: "span 8", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: S("annotator:editor.stamp.backgroundColor") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ c(
                Et,
                {
                  value: I.backgroundColor,
                  onChange: (_) => D("backgroundColor", _),
                  presets: b,
                  popover: !0,
                  transparent: !0
                }
              ) })
            ] }),
            /* @__PURE__ */ C(Z, { direction: "column", gridColumn: "span 5", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: S("annotator:editor.stamp.borderColor") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ c(
                Et,
                {
                  value: I.borderColor,
                  onChange: (_) => D("borderColor", _),
                  presets: b,
                  transparent: !0,
                  popover: !0
                }
              ) })
            ] }),
            /* @__PURE__ */ C(Z, { direction: "column", gridColumn: "span 9", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: S("annotator:editor.stamp.fontStyle") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ c(
                bt.Root,
                {
                  value: I.fontStyle,
                  onValueChange: (_) => D("fontStyle", _),
                  children: /* @__PURE__ */ C(Z, { direction: "row", gap: "2", children: [
                    /* @__PURE__ */ c(bt.Item, { value: "bold", children: /* @__PURE__ */ c(Mr, {}) }),
                    /* @__PURE__ */ c(bt.Item, { value: "italic", children: /* @__PURE__ */ c(Dr, {}) }),
                    /* @__PURE__ */ c(bt.Item, { value: "underline", children: /* @__PURE__ */ c(Lr, {}) }),
                    /* @__PURE__ */ c(bt.Item, { value: "strikeout", children: /* @__PURE__ */ c(Or, {}) })
                  ] })
                }
              ) })
            ] }),
            /* @__PURE__ */ C(Z, { direction: "column", gridColumn: "span 8", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: S("annotator:editor.stamp.fontFamily") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ C(Re.Root, { value: I.fontFamily, onValueChange: (_) => D("fontFamily", _), children: [
                /* @__PURE__ */ c(Re.Trigger, {}),
                /* @__PURE__ */ c(Re.Content, { children: f.map((_) => /* @__PURE__ */ c(Re.Item, { value: _.value, children: _.label }, _.value)) })
              ] }) })
            ] }),
            /* @__PURE__ */ C(Z, { direction: "column", gridColumn: "span 5", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: S("annotator:editor.stamp.borderStyle") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ C(
                Re.Root,
                {
                  value: I.borderStyle,
                  onValueChange: (_) => D("borderStyle", _),
                  children: [
                    /* @__PURE__ */ c(Re.Trigger, {}),
                    /* @__PURE__ */ C(Re.Content, { children: [
                      /* @__PURE__ */ c(Re.Item, { value: "none", children: S("annotator:editor.stamp.none") }),
                      /* @__PURE__ */ c(Re.Item, { value: "solid", children: S("annotator:editor.stamp.solid") }),
                      /* @__PURE__ */ c(Re.Item, { value: "dashed", children: S("annotator:editor.stamp.dashed") })
                    ] })
                  ]
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ c(tt, { my: "3", size: "4" }),
          /* @__PURE__ */ C(Wt, { align: "center", columns: "2", gap: "3", children: [
            /* @__PURE__ */ C(Z, { direction: "column", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: S("annotator:editor.stamp.timestampText") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ c(
                bt.Root,
                {
                  value: I.timestamp,
                  onValueChange: (_) => D("timestamp", _),
                  children: /* @__PURE__ */ C(Z, { direction: "row", gap: "2", children: [
                    /* @__PURE__ */ c(bt.Item, { value: "username", children: S("annotator:editor.stamp.username") }),
                    /* @__PURE__ */ c(bt.Item, { value: "date", children: S("annotator:editor.stamp.date") })
                  ] })
                }
              ) })
            ] }),
            /* @__PURE__ */ C(Z, { direction: "column", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: S("annotator:editor.stamp.dateFormat") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ C(Re.Root, { value: I.dateFormat, onValueChange: (_) => D("dateFormat", _), children: [
                /* @__PURE__ */ c(Re.Trigger, {}),
                /* @__PURE__ */ c(Re.Content, { children: _c?.map((_) => /* @__PURE__ */ C(Re.Group, { children: [
                  /* @__PURE__ */ c(Re.Label, { children: _.label }),
                  _.options.map((ne) => /* @__PURE__ */ c(Re.Item, { value: ne.value, children: ne.label }, ne.value))
                ] }, _.label)) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ c(Wt, { align: "center", columns: "1", gap: "3", mt: "3", children: /* @__PURE__ */ C(ae, { as: "label", size: "2", children: [
            S("annotator:editor.stamp.customTimestamp"),
            /* @__PURE__ */ c(
              kt.Root,
              {
                value: I.customTimestampText,
                onChange: (_) => D("customTimestampText", _.target.value)
              }
            )
          ] }) }),
          /* @__PURE__ */ C(Z, { gap: "3", mt: "4", justify: "end", children: [
            /* @__PURE__ */ c(at.Close, { children: /* @__PURE__ */ c(ye, { style: { width: 100 }, variant: "soft", color: "gray", children: S("cancel") }) }),
            /* @__PURE__ */ c(at.Close, { children: /* @__PURE__ */ c(ye, { style: { width: 100 }, onClick: P, children: S("ok") }) })
          ] })
        ] }),
        /* @__PURE__ */ c("div", { className: "StampTool-Toolbar" })
      ] })
    ] }) })
  ] });
}, Qo = {
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
function Gc(o) {
  const e = De.find((t) => t.type === Qo[o]);
  if (!e) throw new Error(`UNKNOWN_ANNOTATION_TOOL:${o}`);
  return e;
}
function On(o) {
  return o === void 0 ? null : Object.entries(Qo).find(([, t]) => t === o)?.[0] ?? null;
}
function _n(o) {
  return o !== "menu-item" ? {} : {
    variant: "ghost",
    size: "2",
    style: { width: "100%", justifyContent: "flex-start", gap: 8 }
  };
}
const En = ({
  tool: o,
  presentation: e = "toolbar-icon",
  label: t,
  colorOnHover: n = !1,
  default_signatures: r,
  default_stamps: s
}) => {
  const { t: i } = ve(["annotator"], { useSuspense: !1 }), { defaultOptions: a } = Nt(), { painter: l, requestWrite: u } = nt(), d = se((N) => N.currentAnnotationType), h = ke(() => Gc(o), [o]), f = l?.can("annotation.create") ?? !1, p = d?.type === h.type, g = t ?? i(`annotator:tool.${h.name}`), v = _n(e), y = n && e === "toolbar-icon" && p && !!h.styleEditable?.color, [b, S] = K(!1), A = $(null), T = q(() => {
    A.current !== null && (window.clearTimeout(A.current), A.current = null);
  }, []), E = q(() => {
    T(), y && S(!0);
  }, [T, y]), O = q(() => {
    T(), S(!1);
  }, [T]), G = q(() => {
    T(), A.current = window.setTimeout(() => {
      A.current = null, S(!1);
    }, 120);
  }, [T]);
  te(() => (y || O(), T), [T, O, y]);
  const j = q(async (N = null) => {
    if (!f && u && !await u({ kind: "tool", tool: o }))
      return;
    const z = p ? null : h;
    l?.activate(z, z && [R.SIGNATURE, R.STAMP].includes(z.type) ? N : null);
  }, [h, f, l, u, p, o]), W = f || !!u, L = q(() => {
    f || !u || u({ kind: "tool", tool: o });
  }, [f, u, o]);
  if (o === "signature")
    return /* @__PURE__ */ c(
      Pc,
      {
        annotation: h,
        disabled: !W,
        selected: p,
        presentation: e,
        label: g,
        default_signatures: r,
        onAdd: (N) => j(N),
        onIntent: L
      }
    );
  if (o === "stamp")
    return /* @__PURE__ */ c(
      Hc,
      {
        annotation: h,
        disabled: !W,
        selected: p,
        presentation: e,
        label: g,
        default_stamps: s,
        onAdd: (N) => j(N),
        onIntent: L
      }
    );
  const k = /* @__PURE__ */ c(
    At,
    {
      disabled: o !== "select" && !W,
      selected: p,
      tooltip: e === "menu-item" || y ? "none" : "auto",
      title: String(g),
      label: e === "menu-item" ? g : void 0,
      icon: h.icon,
      buttonProps: v,
      onPointerEnter: y ? E : void 0,
      onPointerLeave: y ? G : void 0,
      onFocus: y ? E : void 0,
      onBlur: y ? G : void 0,
      onClick: () => j()
    }
  );
  return !n || e !== "toolbar-icon" || !h.styleEditable?.color ? k : /* @__PURE__ */ c(
    Et,
    {
      value: d?.style?.color || a.colors[0],
      onChange: (N) => {
        if (!d) return;
        const z = {
          ...d,
          style: { ...d.style, color: N }
        };
        if (l?.can("annotation.create")) {
          l.activate(z, null);
          return;
        }
        const H = u?.({ kind: "tool", tool: On(z.type) ?? "select" });
        H && H.then((I) => {
          I && l?.activate(z, null);
        });
      },
      presets: a.colors,
      popover: !0,
      open: p && b,
      onOpenChange: (N) => {
        p && S(N);
      },
      onContentPointerEnter: T,
      onContentPointerLeave: G,
      trigger: k
    }
  );
}, er = ({ presentation: o = "toolbar-icon" }) => {
  const { defaultOptions: e } = Nt(), { painter: t, requestWrite: n } = nt(), r = se((l) => l.currentAnnotationType), s = !r?.styleEditable?.color, i = _n(o), a = (l) => {
    if (!r) return;
    const u = {
      ...r,
      style: { ...r.style, color: l }
    };
    if (t?.can("annotation.create")) {
      t.activate(u, null);
      return;
    }
    const d = n?.({ kind: "tool", tool: On(u.type) ?? "select" });
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
        At,
        {
          disabled: s || !t?.can("annotation.create") && !n,
          tooltip: o === "menu-item" ? "none" : "auto",
          title: "Color",
          label: o === "menu-item" ? "Color" : void 0,
          buttonProps: i,
          icon: /* @__PURE__ */ c(
            ls,
            {
              style: { "--palette-preview-color": r?.style?.color }
            }
          )
        }
      )
    }
  );
}, tr = ({ presentation: o = "toolbar-icon" }) => {
  const { t: e } = ve(["annotator"], { useSuspense: !1 }), { painter: t } = nt(), [n, r] = K(!1), s = _n(o);
  return ct(() => {
    r(t?.areAnnotationAuthorLabelsVisible() ?? !1);
  }, [t]), /* @__PURE__ */ c(
    At,
    {
      disabled: !t,
      selected: n,
      tooltip: o === "menu-item" ? "none" : "auto",
      title: n ? e("annotator:authorLabels.hide") : e("annotator:authorLabels.show", { shortcut: "Alt" }),
      label: o === "menu-item" ? "作者标签" : void 0,
      buttonProps: s,
      icon: /* @__PURE__ */ c(ds, {}),
      onClick: () => {
        if (!t) return;
        const i = !t.areAnnotationAuthorLabelsVisible();
        t.setAnnotationAuthorLabelsVisible(i), r(i);
      }
    }
  );
}, Uc = ({ defaultAnnotationName: o = "", stamps: e, signatures: t }) => {
  const n = o ? De.find((s) => s.name === o) ?? null : null, { painter: r } = nt();
  return Pt.useEffect(() => {
    if (n)
      return r?.activate(n, null), () => {
        r?.activate(null, null);
      };
  }, [n, r]), /* @__PURE__ */ C(Z, { gap: "3", align: "center", children: [
    /* @__PURE__ */ c(qt, {}),
    /* @__PURE__ */ c(tt, { orientation: "vertical" }),
    /* @__PURE__ */ c(En, { tool: "select" }),
    De.filter((s) => s.webSelectionDependencies === !1 && s.type !== R.SELECT).map((s) => /* @__PURE__ */ c(
      En,
      {
        tool: s.name,
        default_stamps: s.type === R.STAMP ? e : void 0,
        default_signatures: s.type === R.SIGNATURE ? t : void 0
      },
      s.name
    )),
    /* @__PURE__ */ c(tt, { orientation: "vertical" }),
    /* @__PURE__ */ c(er, {}),
    /* @__PURE__ */ c(tt, { orientation: "vertical" }),
    /* @__PURE__ */ c(tr, {})
  ] });
}, zc = ({ defaultAnnotationName: o, stamps: e, signatures: t }) => /* @__PURE__ */ c(
  Uc,
  {
    defaultAnnotationName: o,
    stamps: e,
    signatures: t
  }
), Fc = {
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
}, jc = ({ children: o, requestWrite: e }) => {
  const [t, n] = K(null), [r, s] = K(0), i = q(() => s((l) => l + 1), []), a = ke(
    () => ({ painter: t, setPainter: n, refreshPainter: i, revision: r, requestWrite: e }),
    [t, i, e, r]
  );
  return /* @__PURE__ */ c(Ko.Provider, { value: a, children: o });
}, Wc = "_filter_xc5y0_1", Bc = "_sidebar_xc5y0_19", $c = "_list_xc5y0_19", Vc = "_group_xc5y0_23", Yc = "_comment_xc5y0_26", Kc = "_title_xc5y0_39", Xc = "_annotationHeader_xc5y0_52", qc = "_annotationHeading_xc5y0_56", Jc = "_annotationHeadingActive_xc5y0_60", Zc = "_annotationMeta_xc5y0_63", Qc = "_annotationAuthor_xc5y0_68", el = "_annotationDateTime_xc5y0_74", tl = "_toolButton_xc5y0_78", nl = "_reply_xc5y0_81", ol = "_replyMeta_xc5y0_91", rl = "_selected_xc5y0_100", il = "_annotationTypeIcon_xc5y0_111", sl = "_commentEditor_xc5y0_122", al = "_replyEditor_xc5y0_127", ge = {
  filter: Wc,
  sidebar: Bc,
  list: $c,
  group: Vc,
  comment: Yc,
  title: Kc,
  annotationHeader: Xc,
  annotationHeading: qc,
  annotationHeadingActive: Jc,
  annotationMeta: Zc,
  annotationAuthor: Qc,
  annotationDateTime: el,
  toolButton: tl,
  reply: nl,
  replyMeta: ol,
  selected: rl,
  annotationTypeIcon: il,
  commentEditor: sl,
  replyEditor: al
}, cl = /^#([1-9]\d*)$/;
function ll(o) {
  if (!o || typeof o != "object") return !1;
  const e = o;
  if (e.type !== "annotation" || typeof e.annotationId != "string" || e.annotationId.length === 0 || typeof e.label != "string")
    return !1;
  const t = cl.exec(e.label);
  return !!(t && Number.isSafeInteger(Number(t[1])));
}
function dl(o, e) {
  let t = 0;
  for (; t < o.length; ) {
    const n = o.indexOf(e, t);
    if (n === -1) return -1;
    const r = o[n + e.length];
    if (!r || !/\d/.test(r)) return n;
    t = n + e.length;
  }
  return -1;
}
function Zt(o, e) {
  if (!e?.length) return;
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  e.forEach((i) => {
    if (!ll(i) || r.has(i.label)) return;
    const a = dl(o, i.label);
    if (a === -1) return;
    const l = n.get(i.label);
    if (l && l !== i.annotationId) {
      r.add(i.label), n.delete(i.label), Array.from(t.entries()).forEach(([d, h]) => {
        h.reference.label === i.label && t.delete(d);
      });
      return;
    }
    n.set(i.label, i.annotationId);
    const u = `${i.annotationId}\0${i.label}`;
    t.has(u) || t.set(u, { reference: i, index: a });
  });
  const s = Array.from(t.values()).sort((i, a) => i.index - a.index).map(({ reference: i }) => ({ ...i }));
  return s.length > 0 ? s : void 0;
}
function Rn(o, e, t) {
  const n = Zt(o, e);
  if (!n) return { content: o };
  const r = new Map(
    t.map((h) => [h.id, h])
  ), s = /* @__PURE__ */ new Map(), i = n.map((h) => {
    const f = r.get(h.annotationId)?.referenceNumber;
    if (f === void 0) return h;
    const p = `#${f}`;
    return s.set(h.label, p), p === h.label ? h : { ...h, label: p };
  }), a = Array.from(s.entries()).filter(([h, f]) => h !== f);
  if (a.length === 0)
    return { content: o, references: n };
  const l = a.map(([h]) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).sort((h, f) => f.length - h.length), u = new RegExp(`(?:${l.join("|")})(?!\\d)`, "g"), d = o.replace(
    u,
    (h) => s.get(h) ?? h
  );
  return {
    content: d,
    references: Zt(
      d,
      i
    )
  };
}
const ul = 20, hl = /^[\p{L}\p{N}_-]*$/u, pl = /[\s([{'",.!?;:“‘，。！？、：；]/;
function fl(o, e) {
  const t = o.slice(0, e), n = t.lastIndexOf("#");
  if (n === -1) return null;
  const r = o[n - 1];
  if (r && !pl.test(r)) return null;
  const s = t.slice(n + 1);
  return hl.test(s) ? {
    start: n,
    end: e,
    query: s
  } : null;
}
function gl(o, e, t) {
  const n = e.trim().toLocaleLowerCase();
  return o.filter((r) => r.id === t || r.referenceNumber === void 0 ? !1 : n ? [
    r.referenceNumber,
    `#${r.referenceNumber}`,
    r.title,
    r.pageNumber,
    r.subtype,
    r.contentsObj?.text
  ].filter((i) => i != null).join(" ").toLocaleLowerCase().includes(n) : !0).sort((r, s) => r.referenceNumber - s.referenceNumber).slice(0, ul);
}
const ml = new Map(
  De.map((o) => [o.type, o.icon])
), nr = ({
  type: o,
  label: e,
  className: t,
  decorative: n = !1,
  showTooltip: r = !0
}) => {
  const s = ml.get(o);
  if (!s) return null;
  const i = /* @__PURE__ */ c(
    "span",
    {
      className: t,
      role: n ? void 0 : "img",
      "aria-hidden": n || void 0,
      "aria-label": n ? void 0 : e,
      children: s
    }
  );
  return r ? /* @__PURE__ */ c(Rt, { content: e, children: i }) : i;
}, vl = "_referenceInput_dfggt_1", yl = "_editor_dfggt_5", bl = "_referenceMenu_dfggt_9", Sl = "_referenceOption_dfggt_17", wl = "_referenceOptionHeader_dfggt_49", Cl = "_referenceTypeIcon_dfggt_53", Al = "_referencePage_dfggt_71", Tl = "_referenceSummary_dfggt_77", xl = "_referenceMeta_dfggt_87", kl = "_referenceAuthor_dfggt_97", El = "_referenceDate_dfggt_103", Rl = "_referenceEmpty_dfggt_107", Pl = "_submit_dfggt_112", Be = {
  referenceInput: vl,
  editor: yl,
  referenceMenu: bl,
  referenceOption: Sl,
  referenceOptionHeader: wl,
  referenceTypeIcon: Cl,
  referencePage: Al,
  referenceSummary: Tl,
  referenceMeta: xl,
  referenceAuthor: kl,
  referenceDate: El,
  referenceEmpty: Rl,
  submit: Pl
}, Nl = /^[\s.,!?;:'"<>/\\，。！？；：、“”‘’《》（）()[\]{}]/, Il = new Map(
  De.map((o) => [o.type, o.name])
);
function Ml(o) {
  const e = o.contentsObj;
  return (e?.text || e?.selectedText || "").replace(/\s+/g, " ").trim();
}
const yn = ({
  annotations: o,
  excludeAnnotationId: e,
  initialContent: t = "",
  initialReferences: n,
  className: r,
  placeholder: s,
  onSubmit: i,
  onCancel: a
}) => {
  const { t: l } = ve(["annotator", "common"], { useSuspense: !1 }), u = $(null);
  u.current === null && (u.current = Rn(
    t,
    n,
    o
  ));
  const [d, h] = K(u.current.content), [f, p] = K(
    () => u.current?.references ?? []
  ), [g, v] = K(null), [y, b] = K(0), S = $(null), A = $(null), T = $(null), E = $(null), O = $(!1), G = $(null), j = $([]), W = dr(), L = ke(
    () => gl(
      o,
      g?.query ?? "",
      e
    ),
    [o, e, g?.query]
  ), k = g !== null, N = L.length > 0 ? Math.min(y, L.length - 1) : 0;
  ct(() => {
    const x = requestAnimationFrame(() => {
      S.current?.focus();
    });
    return () => cancelAnimationFrame(x);
  }, []), ct(() => {
    const x = E.current;
    x !== null && (E.current = null, S.current?.focus(), S.current?.setSelectionRange(x, x));
  }, [d]), ct(() => () => {
    G.current !== null && cancelAnimationFrame(G.current);
  }, []), ct(() => {
    k && j.current[N]?.scrollIntoView?.({
      block: "nearest"
    });
  }, [N, k]);
  const z = (x, P) => {
    const Y = fl(x, P);
    v(Y), b(0);
  }, H = (x) => {
    const P = x.target.value;
    h(P), p(Zt(P, f) ?? []), O.current || z(P, x.target.selectionStart);
  }, I = (x) => {
    if (!g || x.referenceNumber === void 0) return;
    const P = `#${x.referenceNumber}`, Y = d.slice(0, g.start), D = d.slice(g.end), J = D.length === 0 || !Nl.test(D) ? " " : "", de = `${Y}${P}${J}${D}`, ce = [
      ...f.filter((_) => _.label !== P),
      {
        type: "annotation",
        annotationId: x.id,
        label: P
      }
    ];
    E.current = Y.length + P.length + J.length, h(de), p(Zt(de, ce) ?? []), v(null), b(0);
  }, V = () => {
    i(Rn(
      d,
      f,
      o
    ));
  }, ee = (x) => {
    if (!(x.nativeEvent.isComposing || O.current || x.keyCode === 229)) {
      if (k) {
        if (x.key === "ArrowDown") {
          x.preventDefault(), L.length > 0 && b((N + 1) % L.length);
          return;
        }
        if (x.key === "ArrowUp") {
          x.preventDefault(), L.length > 0 && b((N - 1 + L.length) % L.length);
          return;
        }
        if (x.key === "Enter") {
          x.preventDefault();
          const P = L[N];
          P && I(P);
          return;
        }
        if (x.key === "Escape") {
          x.preventDefault(), v(null);
          return;
        }
      }
      if (x.key === "Escape") {
        x.preventDefault(), a();
        return;
      }
      x.key === "Enter" && !x.shiftKey && (x.preventDefault(), V());
    }
  }, X = (x) => {
    x.relatedTarget instanceof Node && (A.current?.contains(x.relatedTarget) || T.current?.contains(x.relatedTarget)) || (G.current !== null && cancelAnimationFrame(G.current), G.current = requestAnimationFrame(() => {
      G.current = null, !A.current?.contains(document.activeElement) && !T.current?.contains(document.activeElement) && a();
    }));
  };
  return /* @__PURE__ */ C(
    "div",
    {
      ref: A,
      "data-annotation-editor": !0,
      className: `${Be.referenceInput} ${r ?? ""}`,
      onBlurCapture: X,
      onClick: (x) => x.stopPropagation(),
      children: [
        /* @__PURE__ */ c("div", { className: Be.editor, children: /* @__PURE__ */ C(
          xe.Root,
          {
            open: k,
            onOpenChange: (x) => {
              x || v(null);
            },
            children: [
              /* @__PURE__ */ c(xe.Trigger, { children: /* @__PURE__ */ c(
                Tr,
                {
                  ref: S,
                  value: d,
                  rows: 4,
                  size: "1",
                  placeholder: s,
                  role: "combobox",
                  "aria-label": l("annotator:comment.reference.inputLabel"),
                  "aria-autocomplete": "list",
                  "aria-haspopup": "listbox",
                  "aria-expanded": k,
                  "aria-controls": k ? W : void 0,
                  "aria-activedescendant": k && L.length > 0 ? `${W}-option-${N}` : void 0,
                  onChange: H,
                  onClick: (x) => z(x.currentTarget.value, x.currentTarget.selectionStart),
                  onKeyDown: ee,
                  onKeyUp: (x) => {
                    !O.current && !["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(x.key) && z(x.currentTarget.value, x.currentTarget.selectionStart);
                  },
                  onCompositionStart: () => {
                    O.current = !0;
                  },
                  onCompositionEnd: (x) => {
                    O.current = !1, z(x.currentTarget.value, x.currentTarget.selectionStart);
                  }
                }
              ) }),
              /* @__PURE__ */ c(
                xe.Content,
                {
                  ref: T,
                  container: A.current,
                  id: W,
                  className: Be.referenceMenu,
                  role: "listbox",
                  size: "1",
                  side: "bottom",
                  align: "start",
                  sideOffset: 4,
                  collisionPadding: 8,
                  onOpenAutoFocus: (x) => x.preventDefault(),
                  onCloseAutoFocus: (x) => {
                    x.preventDefault(), S.current?.focus();
                  },
                  children: L.length > 0 ? L.map((x, P) => {
                    const Y = Ml(x), D = Il.get(x.type), J = D ? l(`annotator:tool.${D}`) : x.subtype, de = Cn(x.date);
                    return /* @__PURE__ */ C(
                      "div",
                      {
                        id: `${W}-option-${P}`,
                        ref: (ce) => {
                          j.current[P] = ce;
                        },
                        role: "option",
                        "aria-selected": P === N,
                        className: Be.referenceOption,
                        onMouseEnter: () => b(P),
                        onMouseDown: (ce) => ce.preventDefault(),
                        onClick: () => I(x),
                        children: [
                          /* @__PURE__ */ C(Z, { align: "center", gap: "2", className: Be.referenceOptionHeader, children: [
                            /* @__PURE__ */ C(xr, { size: "1", radius: "full", variant: "soft", children: [
                              "#",
                              x.referenceNumber
                            ] }),
                            /* @__PURE__ */ c(ae, { as: "span", size: "1", color: "gray", className: Be.referencePage, children: l("annotator:comment.page", { value: x.pageNumber }) })
                          ] }),
                          /* @__PURE__ */ c(ae, { as: "span", size: "2", className: Be.referenceSummary, children: Y || l("annotator:comment.reference.noContent") }),
                          /* @__PURE__ */ C(ae, { as: "span", size: "1", color: "gray", className: Be.referenceMeta, children: [
                            /* @__PURE__ */ c(
                              nr,
                              {
                                type: x.type,
                                label: J,
                                className: Be.referenceTypeIcon,
                                decorative: !0,
                                showTooltip: !1
                              }
                            ),
                            /* @__PURE__ */ c("span", { className: Be.referenceAuthor, children: x.title }),
                            de && /* @__PURE__ */ C(Ce, { children: [
                              /* @__PURE__ */ c("span", { "aria-hidden": "true", children: "·" }),
                              /* @__PURE__ */ c("span", { className: Be.referenceDate, children: de })
                            ] })
                          ] })
                        ]
                      },
                      x.id
                    );
                  }) : /* @__PURE__ */ c(ae, { as: "div", size: "2", color: "gray", className: Be.referenceEmpty, children: l("annotator:comment.reference.empty") })
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ c(
          ye,
          {
            type: "button",
            className: Be.submit,
            onMouseDown: (x) => x.preventDefault(),
            onClick: V,
            children: l("common:confirm")
          }
        )
      ]
    }
  );
};
function Dl(o) {
  return o.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Ll(o, e) {
  if (!o || !e?.length)
    return [{ kind: "text", value: o }];
  const t = new Map(
    e.map((a) => [a.label, a])
  ), n = Array.from(t.keys()).sort((a, l) => l.length - a.length), r = new RegExp(
    `(${n.map(Dl).join("|")})(?!\\d)`,
    "g"
  ), s = [];
  let i = 0;
  return o.replace(r, (a, l, u) => {
    u > i && s.push({
      kind: "text",
      value: o.slice(i, u)
    });
    const d = t.get(a);
    return d && s.push({
      kind: "reference",
      value: a,
      annotationId: d.annotationId
    }), i = u + a.length, a;
  }), i < o.length && s.push({
    kind: "text",
    value: o.slice(i)
  }), s.length > 0 ? s : [{ kind: "text", value: o }];
}
const Ol = "_content_1x9x1_1", _l = "_reference_1x9x1_6", Hl = "_unavailable_1x9x1_29", bn = {
  content: Ol,
  reference: _l,
  unavailable: Hl
}, lo = ({
  annotations: o,
  content: e = "",
  references: t,
  onActivate: n
}) => {
  const { t: r } = ve("annotator", { useSuspense: !1 }), s = ke(
    () => new Map(o.map((l) => [l.id, l])),
    [o]
  ), i = ke(
    () => Rn(e, t, o),
    [o, e, t]
  ), a = ke(
    () => Ll(
      i.content,
      i.references
    ),
    [i]
  );
  return /* @__PURE__ */ c("span", { className: bn.content, children: a.map((l, u) => {
    if (l.kind === "text")
      return /* @__PURE__ */ c(Pt.Fragment, { children: l.value }, `text-${u}`);
    const d = s.get(l.annotationId);
    return d ? /* @__PURE__ */ c(
      Zo,
      {
        annotation: d,
        onActivate: n,
        children: /* @__PURE__ */ c(
          "button",
          {
            className: bn.reference,
            type: "button",
            "aria-label": r("comment.reference.open", {
              value: l.value
            }),
            onClick: (h) => {
              h.stopPropagation(), n(l.annotationId);
            },
            children: l.value
          }
        )
      },
      `reference-${l.annotationId}-${u}`
    ) : /* @__PURE__ */ c(
      "span",
      {
        className: bn.unavailable,
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
function Gl(o, e) {
  return {
    ...o || { text: "" },
    text: e.content,
    references: e.references
  };
}
function Ul({
  id: o,
  title: e,
  date: t,
  draft: n,
  status: r,
  user: s
}) {
  return {
    id: o,
    title: e,
    date: t,
    content: n.content,
    references: n.references,
    status: r,
    user: s
  };
}
function zl(o, e, t, n, r) {
  return o.map((s) => s.id === e ? {
    ...s,
    content: t.content,
    references: t.references,
    date: n,
    title: r
  } : s);
}
const uo = new Map(
  De.map((o) => [o.type, o.name])
), jt = {
  [st.Accepted]: {
    labelKey: "annotator:comment.status.accepted",
    icon: /* @__PURE__ */ c(Wr, {})
  },
  [st.Rejected]: {
    labelKey: "annotator:comment.status.rejected",
    icon: /* @__PURE__ */ c(jr, {})
  },
  [st.Cancelled]: {
    labelKey: "annotator:comment.status.cancelled",
    icon: /* @__PURE__ */ c(Fr, {})
  },
  [st.Completed]: {
    labelKey: "annotator:comment.status.completed",
    icon: /* @__PURE__ */ c(zr, {})
  },
  [st.Closed]: {
    labelKey: "annotator:comment.status.closed",
    icon: /* @__PURE__ */ c(Ur, {})
  },
  [st.None]: {
    labelKey: "annotator:comment.status.none",
    icon: /* @__PURE__ */ c(Gr, {})
  }
}, Fl = () => {
  const o = se((m) => m.annotations), e = Ht(Dn), { isSidebarCollapsed: t } = Fe(), { painter: n, requestWrite: r } = nt(), s = !!r, i = se((m) => m.selectedAnnotation), a = se((m) => m.selectionRevision), l = se((m) => m.setSelectedAnnotation), [u, d] = K(null), [h, f] = K([]), [p, g] = K([]), [v, y] = K(null), b = $(null), S = $(null), A = $(null), T = $(null), { t: E } = ve(["common", "annotator"], { useSuspense: !1 }), O = u?.annotationId ?? null;
  te(() => {
    const m = i?.store?.id;
    if (!m || i.source !== $e.CANVAS || t)
      return;
    const w = se.getState().getAnnotation(m);
    if (!w) return;
    const U = !!(n?.can("annotation.edit", w) || s), B = w.contentsObj?.text === "", ue = w.comments?.length === 0;
    d(
      U && B && ue ? { kind: "annotation-edit", annotationId: w.id } : n?.can("annotation.comment", w) || s ? { kind: "annotation-reply", annotationId: w.id } : null
    );
  }, [
    i?.source,
    i?.store?.id,
    t,
    n,
    s,
    a
  ]);
  const G = $({});
  ct(() => {
    if (!u) return;
    const m = requestAnimationFrame(() => {
      G.current[u.annotationId]?.querySelector("[data-annotation-editor]")?.scrollIntoView?.({
        behavior: "auto",
        block: "nearest",
        inline: "nearest"
      });
    });
    return () => cancelAnimationFrame(m);
  }, [u]);
  const j = ke(() => {
    const m = /* @__PURE__ */ new Map();
    return o.forEach((w) => {
      m.set(w.title, (m.get(w.title) || 0) + 1);
    }), Array.from(m.entries());
  }, [o]), W = ke(() => {
    const m = /* @__PURE__ */ new Map();
    return o.forEach((w) => {
      const U = m.get(w.type);
      m.set(w.type, {
        count: (U?.count || 0) + 1,
        fallbackLabel: U?.fallbackLabel || w.subtype
      });
    }), Array.from(m.entries());
  }, [o]);
  te(() => {
    const m = new Set(j.map(([U]) => U)), w = b.current;
    b.current = m, f((U) => {
      if (w === null) return Array.from(m);
      const B = U.filter((pe) => m.has(pe)), ue = Array.from(m).filter((pe) => !w.has(pe)), he = [...B, ...ue];
      return he.length === U.length && he.every((pe, Se) => pe === U[Se]) ? U : he;
    });
  }, [j]), te(() => {
    const m = new Set(W.map(([U]) => U)), w = S.current;
    S.current = m, g((U) => {
      if (w === null) return Array.from(m);
      const B = U.filter((pe) => m.has(pe)), ue = Array.from(m).filter((pe) => !w.has(pe)), he = [...B, ...ue];
      return he.length === U.length && he.every((pe, Se) => pe === U[Se]) ? U : he;
    });
  }, [W]), te(() => () => {
    T.current !== null && cancelAnimationFrame(T.current), A.current = null;
  }, []);
  const L = ke(() => h.length === 0 || p.length === 0 ? [] : Array.from(o.values()).filter((m) => h.includes(m.title) && p.includes(m.type)), [o, h, p]);
  te(() => {
    if (!u) return;
    const m = i?.store?.id, w = L.some(
      (B) => B.id === u.annotationId
    ), U = !!(m && m !== u.annotationId && i?.source === $e.CANVAS);
    w && !t && (m === u.annotationId || U) || d(null);
  }, [
    i?.source,
    i?.store?.id,
    u,
    L,
    t
  ]);
  const k = ke(
    () => Array.from(o.values()),
    [o]
  ), N = ke(() => L.reduce(
    (m, w) => (m[w.pageNumber] || (m[w.pageNumber] = []), m[w.pageNumber].push(w), m),
    {}
  ), [L]);
  te(() => {
    if (!v) return;
    const m = window.requestAnimationFrame(() => {
      const w = G.current[v];
      w && (w.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      }), y(null));
    });
    return () => window.cancelAnimationFrame(m);
  }, [N, v]);
  const z = (m) => {
    f((w) => w.includes(m) ? w.filter((U) => U !== m) : [...w, m]);
  }, H = (m) => {
    g((w) => w.includes(m) ? w.filter((U) => U !== m) : [...w, m]);
  }, I = /* @__PURE__ */ C("div", { className: ge.filter, children: [
    /* @__PURE__ */ c(ae, { as: "div", children: E("author") }),
    /* @__PURE__ */ c("ul", { children: j.map(([m, w]) => /* @__PURE__ */ c("li", { children: /* @__PURE__ */ c(ae, { as: "label", size: "2", children: /* @__PURE__ */ C(Z, { gap: "2", children: [
      /* @__PURE__ */ c(Vt, { checked: h.includes(m), onCheckedChange: () => z(m) }),
      m,
      " (",
      w,
      ")"
    ] }) }) }, m)) }),
    /* @__PURE__ */ c(ae, { as: "div", children: E("type") }),
    /* @__PURE__ */ c("ul", { children: W.map(([m, { count: w, fallbackLabel: U }]) => {
      const B = uo.get(m), ue = B ? E(`annotator:tool.${B}`) : U;
      return /* @__PURE__ */ c("li", { children: /* @__PURE__ */ c(ae, { as: "label", size: "2", children: /* @__PURE__ */ C(Z, { gap: "2", children: [
        /* @__PURE__ */ c(Vt, { checked: p.includes(m), onCheckedChange: () => H(m) }),
        ue,
        " (",
        w,
        ")"
      ] }) }) }, m);
    }) }),
    /* @__PURE__ */ C(Z, { gap: "3", mt: "2", justify: "between", children: [
      /* @__PURE__ */ c(
        ye,
        {
          variant: "ghost",
          onClick: () => {
            f(j.map(([m]) => m)), g(W.map(([m]) => m));
          },
          children: E("selectAll")
        }
      ),
      /* @__PURE__ */ c(
        ye,
        {
          variant: "ghost",
          onClick: () => {
            f([]), g([]);
          },
          children: E("clear")
        }
      )
    ] })
  ] }), V = (m) => [...m.comments || []].reverse().find((U) => U.status !== void 0 && U.status !== null)?.status ?? st.None, ee = (m) => {
    const w = V(m);
    return jt[w]?.icon ?? jt[st.None].icon;
  }, X = (m) => {
    O && O !== m.id && d(null), l(m, $e.SIDEBAR), n?.highlight(m);
  }, x = (m) => {
    O && (m.preventDefault(), m.stopPropagation(), d(null));
  }, P = (m) => {
    _("annotation.comment", m).then((w) => {
      w && (X(w), d({
        kind: "annotation-reply",
        annotationId: w.id
      }));
    });
  }, Y = (m) => {
    _("annotation.edit", m).then((w) => {
      w && (X(w), d({
        kind: "annotation-edit",
        annotationId: w.id
      }));
    });
  }, D = (m, w) => {
    _("comment.edit", m, w).then((U) => {
      const B = U?.comments?.find((ue) => ue.id === w.id);
      !U || !B || (X(U), d({
        kind: "reply-edit",
        annotationId: U.id,
        replyId: B.id
      }));
    });
  }, J = (m) => {
    A.current = m;
  }, de = (m) => {
    m.preventDefault();
    const w = A.current;
    A.current = null, w && (T.current !== null && cancelAnimationFrame(T.current), T.current = requestAnimationFrame(() => {
      T.current = null, w();
    }));
  }, ce = (m) => {
    const w = o.get(m);
    w && (f((U) => U.includes(w.title) ? U : [...U, w.title]), g((U) => U.includes(w.type) ? U : [...U, w.type]), y(w.id), l(w, $e.SIDEBAR), n?.highlight(w));
  }, _ = async (m, w, U) => n?.can(m, w, U) ? w : !r || !await r({ kind: "mutation", action: m, annotationId: w.id }) ? null : se.getState().getAnnotation(w.id) ?? w, ne = (m, w) => {
    const U = se.getState().getAnnotation(m.id);
    !U || !n || _("annotation.edit", U).then((B) => {
      B && (n.update(B.id, {
        contentsObj: Gl(B.contentsObj, w),
        date: $t(Date.now())
      }, "annotation.edit"), d(null));
    });
  }, le = (m, w, U) => {
    const B = se.getState().getAnnotation(m.id);
    if (!B || !n) return;
    const ue = U === void 0 ? "annotation.comment" : "annotation.change-status";
    _(ue, B).then((he) => {
      if (!he) return;
      const pe = e?.user ?? void 0, Se = Ul({
        id: Ho(),
        title: pe?.name ?? "Anonymous",
        date: $t(Date.now()),
        draft: w,
        status: U,
        user: pe
      });
      n.update(he.id, {
        comments: [...he.comments || [], Se]
      }, ue), d(null);
    });
  }, fe = (m, w, U) => {
    const B = se.getState().getAnnotation(m.id), ue = B?.comments?.find((he) => he.id === w.id);
    !B || !ue || !n || _("comment.edit", B, ue).then((he) => {
      const pe = he?.comments?.find((We) => We.id === ue.id);
      if (!he || !pe) return;
      const Se = zl(
        he.comments || [],
        pe.id,
        U,
        $t(Date.now()),
        e?.user?.name || pe.title
      );
      n.update(he.id, {
        comments: Se
      }, "comment.edit", pe), d(null);
    });
  }, Ae = (m) => {
    n && _("annotation.delete", m).then((w) => {
      w && n.delete(w.id, !0);
    });
  }, Ze = (m, w) => {
    n && _("comment.delete", m, w).then((U) => {
      !U || !n.deleteComment(U.id, w.id) || u?.kind === "reply-edit" && u.replyId === w.id && d(null);
    });
  }, Ve = (m) => {
    if (u?.kind === "annotation-edit" && u.annotationId === m.id && i?.store?.id === m.id)
      return /* @__PURE__ */ c(
        yn,
        {
          annotations: k,
          excludeAnnotationId: m.id,
          initialContent: m.contentsObj?.text,
          initialReferences: m.contentsObj?.references,
          className: ge.commentEditor,
          placeholder: E("annotator:comment.reference.commentPlaceholder"),
          onSubmit: (U) => ne(m, U),
          onCancel: () => {
            d(null);
          }
        }
      );
    const w = m.contentsObj?.text;
    return w?.trim() ? /* @__PURE__ */ c(Z, { gap: "3", pl: "4", children: /* @__PURE__ */ c(ae, { as: "p", size: "2", children: /* @__PURE__ */ c(
      lo,
      {
        annotations: k,
        content: w,
        references: m.contentsObj?.references,
        onActivate: ce
      }
    ) }) }) : null;
  }, He = (m) => u?.kind === "annotation-reply" && u.annotationId === m.id && i?.store?.id === m.id ? /* @__PURE__ */ c(
    yn,
    {
      annotations: k,
      excludeAnnotationId: m.id,
      className: ge.commentEditor,
      placeholder: E("annotator:comment.reference.replyPlaceholder"),
      onSubmit: (w) => le(m, w),
      onCancel: () => {
        d(null);
      }
    }
  ) : null, je = (m, w) => u?.kind === "reply-edit" && u.annotationId === m.id && u.replyId === w.id ? /* @__PURE__ */ c(
    yn,
    {
      annotations: k,
      excludeAnnotationId: m.id,
      initialContent: w.content,
      initialReferences: w.references,
      className: ge.replyEditor,
      placeholder: E("annotator:comment.reference.replyPlaceholder"),
      onSubmit: (U) => fe(m, w, U),
      onCancel: () => {
        d(null);
      }
    }
  ) : /* @__PURE__ */ c(Z, { gap: "3", children: /* @__PURE__ */ c(ae, { as: "p", size: "2", children: /* @__PURE__ */ c(
    lo,
    {
      annotations: k,
      content: w.content,
      references: w.references,
      onActivate: ce
    }
  ) }) }), Ye = Object.entries(N).map(([m, w]) => {
    const U = w.sort((B, ue) => B.konvaClientRect.y - ue.konvaClientRect.y);
    return /* @__PURE__ */ C("div", { className: ge.group, children: [
      /* @__PURE__ */ C(Z, { gap: "2", justify: "between", p: "1", children: [
        /* @__PURE__ */ c(ae, { size: "1", children: E("annotator:comment.page", { value: m }) }),
        /* @__PURE__ */ c(ae, { size: "1", children: E("annotator:comment.total", { value: w.length }) })
      ] }),
      U.map((B) => {
        const ue = B.id === i?.store?.id, he = !!(n?.can("annotation.comment", B) || s), pe = !!(n?.can("annotation.edit", B) || s), Se = !!(n?.can("annotation.delete", B) || s), We = !!(n?.can("annotation.change-status", B) || s), ht = V(B), Ke = Vo(B) ?? B.title, _e = mt(B.referenceNumber), Ge = _e ? `#${B.referenceNumber}` : Ke, vt = _e && ue, wt = Fn(B.date), Gt = uo.get(B.type), on = Gt ? E(`annotator:tool.${Gt}`) : B.subtype, rn = {
          className: [
            ge.comment,
            ue ? ge.selected : ""
          ].filter(Boolean).join(" "),
          id: `annotation-${B.id}`
        };
        return /* @__PURE__ */ ur(
          "div",
          {
            ...rn,
            key: B.id,
            onClick: () => X(B),
            ref: (we) => G.current[B.id] = we
          },
          /* @__PURE__ */ C("div", { className: `${ge.title} ${ge.annotationHeader}`, children: [
            /* @__PURE__ */ C(
              ae,
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
                  B.native && /* @__PURE__ */ c(Rt, { content: E("annotator:comment.nativeAnnotation"), children: /* @__PURE__ */ c("span", { children: /* @__PURE__ */ c(_r, {}) }) })
                ]
              }
            ),
            /* @__PURE__ */ C(
              Z,
              {
                align: "center",
                gap: "1",
                ml: "auto",
                onClick: (we) => we.stopPropagation(),
                children: [
                  We && /* @__PURE__ */ C(me.Root, { children: [
                    /* @__PURE__ */ c(me.Trigger, { children: /* @__PURE__ */ c(
                      et,
                      {
                        variant: "ghost",
                        color: "gray",
                        size: "1",
                        className: ge.toolButton,
                        "aria-label": E(jt[ht].labelKey),
                        onPointerDown: x,
                        style: {
                          boxShadow: "none"
                        },
                        children: ee(B)
                      }
                    ) }),
                    /* @__PURE__ */ c(
                      me.Content,
                      {
                        onCloseAutoFocus: de,
                        children: Object.entries(jt).map(([we, pt]) => /* @__PURE__ */ C(
                          me.Item,
                          {
                            onSelect: () => {
                              le(
                                B,
                                {
                                  content: E("annotator:comment.statusText", { value: E(pt.labelKey) })
                                },
                                we
                              );
                            },
                            children: [
                              pt.icon,
                              " ",
                              E(pt.labelKey)
                            ]
                          },
                          we
                        ))
                      }
                    )
                  ] }),
                  (he || pe || Se) && /* @__PURE__ */ C(me.Root, { children: [
                    /* @__PURE__ */ c(me.Trigger, { children: /* @__PURE__ */ c(
                      et,
                      {
                        variant: "ghost",
                        color: "gray",
                        size: "1",
                        className: ge.toolButton,
                        "aria-label": E("more"),
                        onPointerDown: x,
                        style: {
                          boxShadow: "none"
                        },
                        children: /* @__PURE__ */ c(Un, {})
                      }
                    ) }),
                    /* @__PURE__ */ C(
                      me.Content,
                      {
                        onCloseAutoFocus: de,
                        children: [
                          he && /* @__PURE__ */ c(
                            me.Item,
                            {
                              onSelect: (we) => {
                                we.stopPropagation(), J(() => P(B));
                              },
                              children: E("reply")
                            }
                          ),
                          pe && /* @__PURE__ */ c(
                            me.Item,
                            {
                              onSelect: (we) => {
                                we.stopPropagation(), J(() => Y(B));
                              },
                              children: E("edit")
                            }
                          ),
                          Se && /* @__PURE__ */ c(
                            me.Item,
                            {
                              onSelect: (we) => {
                                we.stopPropagation(), Ae(B);
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
          /* @__PURE__ */ C(Z, { align: "center", gap: "1", className: ge.annotationMeta, children: [
            /* @__PURE__ */ c(
              nr,
              {
                type: B.type,
                label: on,
                className: ge.annotationTypeIcon
              }
            ),
            /* @__PURE__ */ c(
              ae,
              {
                as: "span",
                size: "1",
                color: "gray",
                className: ge.annotationAuthor,
                children: Ke
              }
            ),
            wt && /* @__PURE__ */ C(Ce, { children: [
              /* @__PURE__ */ c(ae, { as: "span", size: "1", color: "gray", "aria-hidden": "true", children: "·" }),
              /* @__PURE__ */ c(
                ae,
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
          Ve(B),
          B.comments?.map((we) => {
            const pt = Fn(we.date), yt = !!(n?.can("comment.edit", B, we) || s), ot = !!(n?.can("comment.delete", B, we) || s);
            return /* @__PURE__ */ C("div", { className: ge.reply, children: [
              /* @__PURE__ */ C("div", { className: `${ge.title} ${ge.annotationHeader}`, children: [
                /* @__PURE__ */ c(
                  ae,
                  {
                    truncate: !0,
                    size: "1",
                    weight: "medium",
                    as: "div",
                    className: ge.annotationHeading,
                    children: we.title
                  }
                ),
                (yt || ot) && /* @__PURE__ */ c(
                  Z,
                  {
                    align: "center",
                    gap: "1",
                    ml: "auto",
                    onClick: (rt) => rt.stopPropagation(),
                    children: /* @__PURE__ */ C(me.Root, { children: [
                      /* @__PURE__ */ c(me.Trigger, { children: /* @__PURE__ */ c(
                        et,
                        {
                          variant: "ghost",
                          color: "gray",
                          highContrast: !0,
                          size: "1",
                          className: ge.toolButton,
                          "aria-label": E("more"),
                          onPointerDown: x,
                          style: {
                            boxShadow: "none"
                          },
                          children: /* @__PURE__ */ c(Un, {})
                        }
                      ) }),
                      /* @__PURE__ */ C(
                        me.Content,
                        {
                          onCloseAutoFocus: de,
                          children: [
                            yt && /* @__PURE__ */ c(
                              me.Item,
                              {
                                onSelect: (rt) => {
                                  rt.stopPropagation(), J(() => D(B, we));
                                },
                                children: E("edit")
                              }
                            ),
                            ot && /* @__PURE__ */ c(
                              me.Item,
                              {
                                onSelect: (rt) => {
                                  rt.stopPropagation(), Ze(B, we);
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
              pt && /* @__PURE__ */ c(Z, { align: "center", className: `${ge.annotationMeta} ${ge.replyMeta}`, children: /* @__PURE__ */ c(ae, { as: "span", size: "1", color: "gray", children: pt }) }),
              je(B, we)
            ] }, we.id);
          }),
          /* @__PURE__ */ C("div", { children: [
            He(B),
            he && !u && i?.store?.id === B.id && /* @__PURE__ */ c(ye, { mt: "2", style: { width: "100%" }, onClick: () => P(B), children: E("reply") })
          ] })
        );
      })
    ] }, m);
  });
  return /* @__PURE__ */ C("div", { className: ge.sidebar, children: [
    /* @__PURE__ */ c(Z, { align: "center", justify: "start", p: "1", children: /* @__PURE__ */ C(xe.Root, { children: [
      /* @__PURE__ */ c(xe.Trigger, { children: /* @__PURE__ */ c(
        ye,
        {
          variant: "outline",
          size: "2",
          color: "gray",
          highContrast: !0,
          style: {
            boxShadow: "none",
            fontSize: "16px"
          },
          children: /* @__PURE__ */ c(Hr, {})
        }
      ) }),
      /* @__PURE__ */ c(xe.Content, { children: I })
    ] }) }),
    /* @__PURE__ */ c("div", { className: ge.list, children: Ye })
  ] });
};
function Tt(o) {
  const e = JSON.parse(o);
  if (!e || typeof e != "object")
    throw new Error("Invalid serialized Konva node");
  return e;
}
class Je {
  annotation;
  page;
  pdfDoc;
  pageView;
  constructor(e, t, n, r) {
    this.pdfDoc = e, this.page = t, this.annotation = n, this.pageView = r;
  }
  addAnnotationToPage(e, t) {
    const n = e.node.lookup(F.of("Annots"));
    n ? n.push(t) : e.node.set(F.of("Annots"), e.doc.context.obj([t]));
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
class jl extends Je {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, [s, i] = Pe(e.konvaClientRect, r), a = n.context, l = 32, u = [Q.of(s), Q.of(i), Q.of(s + l), Q.of(i + l)], d = a.obj({
      Type: F.of("Annot"),
      Subtype: F.of("Text"),
      Rect: u,
      NM: re.of(e.id),
      // 唯一标识
      Contents: ie(e.contentsObj?.text || ""),
      Name: F.of("Comment"),
      T: ie(this.getExportTitle(be("normal.unknownUser"))),
      M: re.of(e.date || ""),
      C: Le(e.color || "#000000"),
      F: Q.of(4),
      P: t.ref,
      Open: !1
    }), h = a.register(d);
    this.addAnnotationToPage(t, h);
    for (const f of e.comments || []) {
      const p = a.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: u,
        Contents: ie(f.content),
        T: ie(f.title || be("normal.unknownUser")),
        M: re.of(f.date || ""),
        C: Le(e.color || "#000000"),
        IRT: h,
        RT: F.of("R"),
        NM: re.of(f.id),
        // 唯一标识
        Open: !1
      }), g = a.register(p);
      this.addAnnotationToPage(t, g);
    }
  }
}
function Ct(o, e) {
  const t = e.attrs ?? {}, n = t.scaleX ?? 1, r = t.scaleY ?? 1, s = t.offsetX ?? 0, i = t.offsetY ?? 0, a = (o.x - s) * n, l = (o.y - i) * r, u = (t.rotation ?? 0) * Math.PI / 180, d = Math.cos(u), h = Math.sin(u);
  return {
    x: (t.x ?? 0) + a * d - l * h,
    y: (t.y ?? 0) + a * h + l * d
  };
}
function Hn(o, e) {
  const t = o.x ?? 0, n = o.y ?? 0, r = o.width ?? 0, s = o.height ?? 0, i = [
    Ct({ x: t, y: n }, e),
    Ct({ x: t + r, y: n }, e),
    Ct({ x: t, y: n + s }, e),
    Ct({ x: t + r, y: n + s }, e)
  ], a = i.map((p) => p.x), l = i.map((p) => p.y), u = Math.min(...a), d = Math.max(...a), h = Math.min(...l), f = Math.max(...l);
  return { x: u, y: h, width: d - u, height: f - h };
}
function Pn(o, e) {
  const { viewport: t } = e;
  return t.convertToPdfPoint(o.x * t.scale, o.y * t.scale);
}
class Wl extends Je {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, i = Tt(e.konvaString), a = (i.children ?? []).filter((h) => h.className === "Rect"), l = [];
    for (const h of a) {
      const f = Hn(h.attrs ?? {}, i), [p, g, v, y] = Pe(f, r);
      l.push(
        p,
        y,
        // 左上
        v,
        y,
        // 右上
        p,
        g,
        // 左下
        v,
        g
        // 右下
      );
    }
    const u = s.obj({
      Type: F.of("Annot"),
      Subtype: F.of("Highlight"),
      Rect: Pe(e.konvaClientRect, r),
      QuadPoints: l,
      C: Le(e.color || "#000000"),
      // 批注颜色
      T: ie(this.getExportTitle(be("normal.unknownUser"))),
      // 编号与作者
      // QuadPoints anchor the source text; Contents is only the user-authored note.
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      // 日期
      NM: re.of(e.id),
      // 唯一标识
      F: Q.of(4)
    }), d = s.register(u);
    this.addAnnotationToPage(t, d);
    for (const h of e.comments || []) {
      const f = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: [0, 0, 0, 0],
        Contents: ie(h.content),
        T: ie(h.title || be("normal.unknownUser")),
        M: re.of(h.date || ""),
        C: Le(e.color || "#000000"),
        IRT: d,
        RT: F.of("R"),
        NM: re.of(h.id),
        // 唯一标识
        Open: !1
      }), p = s.register(f);
      this.addAnnotationToPage(t, p);
    }
  }
}
class Bl extends Je {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, i = Tt(e.konvaString), a = (i.children ?? []).filter((h) => h.className === "Rect"), l = [];
    for (const h of a) {
      const f = Hn(h.attrs ?? {}, i), [p, g, v, y] = Pe(f, r);
      l.push(
        p,
        y,
        // 左上
        v,
        y,
        // 右上
        p,
        g,
        // 左下
        v,
        g
        // 右下
      );
    }
    const u = s.obj({
      Type: F.of("Annot"),
      Subtype: F.of("Underline"),
      Rect: Pe(e.konvaClientRect, r),
      QuadPoints: l,
      C: Le(e.color || "#000000"),
      T: ie(this.getExportTitle(be("normal.unknownUser"))),
      // QuadPoints anchor the source text; Contents is only the user-authored note.
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      F: Q.of(4)
    }), d = s.register(u);
    this.addAnnotationToPage(t, d);
    for (const h of e.comments || []) {
      const f = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: Pe(e.konvaClientRect, r),
        Contents: ie(h.content),
        T: ie(h.title || be("normal.unknownUser")),
        M: re.of(h.date || ""),
        C: Le(e.color || "#000000"),
        IRT: d,
        RT: F.of("R"),
        NM: re.of(h.id),
        Open: !1
      }), p = s.register(f);
      this.addAnnotationToPage(t, p);
    }
  }
}
class $l extends Je {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, i = Tt(e.konvaString), a = (i.children ?? []).filter((h) => h.className === "Rect"), l = [];
    for (const h of a) {
      const f = Hn(h.attrs ?? {}, i), [p, g, v, y] = Pe(f, r);
      l.push(
        p,
        y,
        // 左上
        v,
        y,
        // 右上
        p,
        g,
        // 左下
        v,
        g
        // 右下
      );
    }
    const u = s.obj({
      Type: F.of("Annot"),
      Subtype: F.of("StrikeOut"),
      Rect: Pe(e.konvaClientRect, r),
      QuadPoints: l,
      C: Le(e.color || "#000000"),
      T: ie(this.getExportTitle(be("normal.unknownUser"))),
      // QuadPoints anchor the source text; Contents is only the user-authored note.
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      F: Q.of(4)
    }), d = s.register(u);
    this.addAnnotationToPage(t, d);
    for (const h of e.comments || []) {
      const f = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: Pe(e.konvaClientRect, r),
        Contents: ie(h.content),
        T: ie(h.title || be("normal.unknownUser")),
        M: re.of(h.date || ""),
        C: Le(e.color || "#000000"),
        IRT: d,
        RT: F.of("R"),
        NM: re.of(h.id),
        Open: !1
      }), p = s.register(f);
      this.addAnnotationToPage(t, p);
    }
  }
}
class Vl extends Je {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, i = Tt(e.konvaString), l = (i.children?.[0] ?? i).attrs ?? i.attrs ?? {}, u = l.strokeWidth ?? 2, d = l.dash ?? [], h = l.opacity ?? 1, f = {
      W: Q.of(u),
      S: F.of(d.length > 0 ? "D" : "S"),
      ...d.length > 0 ? { D: s.obj(d) } : {}
    }, p = s.obj({
      Type: F.of("Annot"),
      Subtype: F.of("Square"),
      Rect: Pe(e.konvaClientRect, r),
      C: Le(e.color || "#000000"),
      // 边框颜色
      T: ie(this.getExportTitle(be("normal.unknownUser"))),
      // 编号与作者
      Contents: ie(e.contentsObj?.text || ""),
      // 说明文字
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      // 唯一标识
      F: Q.of(4),
      P: t.ref,
      BS: s.obj(f),
      CA: Q.of(h)
    }), g = s.register(p);
    this.addAnnotationToPage(t, g);
    for (const v of e.comments || []) {
      const y = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: Pe(e.konvaClientRect, r),
        Contents: ie(v.content),
        T: ie(v.title || be("normal.unknownUser")),
        M: re.of(v.date || ""),
        C: Le(e.color || "#000000"),
        IRT: g,
        RT: F.of("R"),
        NM: re.of(v.id),
        Open: !1
      }), b = s.register(y);
      this.addAnnotationToPage(t, b);
    }
  }
}
class Yl extends Je {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, a = Tt(e.konvaString).children?.find((y) => y.className === "Ellipse");
    if (!a) throw new Error(`Annotation ${e.id} is missing its ellipse geometry.`);
    const l = a.attrs ?? {}, u = l.strokeWidth ?? 2, d = l.dash ?? [], h = l.opacity ?? 1, f = {
      W: Q.of(u),
      S: F.of(d.length > 0 ? "D" : "S"),
      ...d.length > 0 ? { D: s.obj(d) } : {}
    }, p = Pe(e.konvaClientRect, r), g = s.obj({
      Type: F.of("Annot"),
      Subtype: F.of("Circle"),
      Rect: p,
      C: Le(e.color || "#000000"),
      T: ie(this.getExportTitle(be("normal.unknownUser"))),
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      F: Q.of(4),
      P: t.ref,
      BS: s.obj(f),
      CA: Q.of(h)
    }), v = s.register(g);
    this.addAnnotationToPage(t, v);
    for (const y of e.comments || []) {
      const b = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: p,
        Contents: ie(y.content),
        T: ie(y.title || be("normal.unknownUser")),
        M: re.of(y.date || ""),
        C: Le(e.color || "#000000"),
        IRT: v,
        RT: F.of("R"),
        NM: re.of(y.id),
        Open: !1
      }), S = s.register(b);
      this.addAnnotationToPage(t, S);
    }
  }
}
class Kl extends Je {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, i = Tt(e.konvaString), a = (i.children ?? []).filter((W) => W.className === "Line"), { groupX: l, groupY: u, scaleX: d, scaleY: h } = this.extractGroupTransform(i), f = r.viewport, p = s.obj(
      a.map((W) => {
        const L = W.attrs?.points ?? [], k = [];
        for (let N = 0; N < L.length; N += 2) {
          const z = l + L[N] * d, H = u + L[N + 1] * h, I = z * f.scale, V = H * f.scale, [ee, X] = f.convertToPdfPoint(I, V);
          k.push(ee, X);
        }
        return s.obj(k);
      })
    ), g = a[0]?.attrs ?? {}, v = g.strokeWidth ?? 1, y = g.opacity ?? 1, b = g.stroke ?? e.color ?? "rgb(255, 0, 0)", [S, A, T] = Le(b), E = s.obj({
      W: Q.of(v),
      S: F.of("S")
      // Solid border style
    }), O = Pe(e.konvaClientRect, r), G = s.obj({
      Type: F.of("Annot"),
      Subtype: F.of("Ink"),
      Rect: O,
      InkList: p,
      C: s.obj([Q.of(S), Q.of(A), Q.of(T)]),
      T: ie(this.getExportTitle(be("normal.unknownUser"))),
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      Border: s.obj([0, 0, 0]),
      BS: E,
      F: Q.of(4),
      P: t.ref,
      CA: Q.of(y)
      // Non-stroking opacity (used for drawing)
    }), j = s.register(G);
    this.addAnnotationToPage(t, j);
    for (const W of e.comments || []) {
      const L = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: O,
        Contents: ie(W.content),
        T: ie(W.title || be("normal.unknownUser")),
        M: re.of(W.date || ""),
        C: s.obj([Q.of(S), Q.of(A), Q.of(T)]),
        IRT: j,
        RT: F.of("R"),
        NM: re.of(W.id),
        Open: !1
      }), k = s.register(L);
      this.addAnnotationToPage(t, k);
    }
  }
}
class Xl extends Je {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, [s, , , i] = Pe(e.konvaClientRect, r), a = n.context, l = 20, u = t.getWidth(), d = t.getHeight(), h = Math.max(0, Math.min(s, u - l)), f = Math.max(l, Math.min(i, d)), p = [
      Q.of(h),
      Q.of(f - l),
      Q.of(h + l),
      Q.of(f)
    ], g = JSON.parse(e.konvaString), v = g.children?.find((E) => E.className === "Text"), y = Math.abs(g.attrs?.scaleY ?? 1), b = (v?.attrs?.fontSize ?? 14) * y, S = v?.attrs?.opacity ?? 1, A = a.obj({
      Type: F.of("Annot"),
      Subtype: F.of("Text"),
      InkLayerType: F.of("FreeText"),
      InkLayerFontSize: Q.of(b),
      InkLayerTextWidth: Q.of(e.konvaClientRect.width),
      Rect: p,
      NM: re.of(e.id),
      // 唯一标识
      Contents: ie(e.contentsObj?.text || ""),
      Name: F.of("Comment"),
      T: ie(this.getExportTitle(be("normal.unknownUser"))),
      M: re.of(e.date || ""),
      C: Le(e.color || "#000000"),
      CA: Q.of(S),
      F: Q.of(4),
      P: t.ref,
      Open: !1
    }), T = a.register(A);
    this.addAnnotationToPage(t, T);
    for (const E of e.comments || []) {
      const O = a.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: p,
        Contents: ie(E.content),
        T: ie(E.title || be("normal.unknownUser")),
        M: re.of(E.date || ""),
        C: Le(e.color || "#000000"),
        IRT: T,
        RT: F.of("R"),
        NM: re.of(E.id),
        // 唯一标识
        Open: !1
      }), G = a.register(O);
      this.addAnnotationToPage(t, G);
    }
  }
}
function ql(o, e, t) {
  switch (o % 360) {
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
function Jl(o, e, t) {
  const n = o % 360;
  return n === 90 || n === 270 ? [0, 0, t, e] : [0, 0, e, t];
}
class Zl extends Je {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, [i, a, l, u] = Pe(e.konvaClientRect, r), d = l - i, h = u - a, f = [Q.of(i), Q.of(a), Q.of(l), Q.of(u)], p = r.pdfPageRotate || 0;
    let g;
    if (e.contentsObj?.image) {
      const S = e.contentsObj.image.replace(/^data:image\/png;base64,/, ""), A = await n.embedPng(S), T = Jl(p, d, h), E = s.obj({
        Type: "XObject",
        Subtype: "Form",
        BBox: T,
        Resources: s.obj({
          XObject: {
            Im1: A.ref
          }
        })
      }), O = `q ${ql(p, d, h)} ${d} 0 0 ${h} 0 0 cm /Im1 Do Q`, G = Kr.of(E, new TextEncoder().encode(O)), j = s.register(G);
      g = s.obj({
        N: j
      });
    }
    const v = {
      Type: F.of("Annot"),
      Subtype: F.of("Stamp"),
      Rect: f,
      NM: re.of(e.id),
      Contents: ie(e.contentsObj?.text || ""),
      T: ie(this.getExportTitle(be("normal.unknownUser"))),
      M: re.of(e.date || ""),
      Open: !1,
      P: t.ref,
      F: Q.of(132),
      ...g ? { AP: g } : {}
    }, y = s.obj(v), b = s.register(y);
    this.addAnnotationToPage(t, b);
    for (const S of e.comments || []) {
      const A = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: f,
        Contents: ie(S.content),
        T: ie(S.title || be("normal.unknownUser")),
        M: re.of(S.date || ""),
        IRT: b,
        RT: F.of("R"),
        NM: re.of(S.id),
        Open: !1
      }), T = s.register(A);
      this.addAnnotationToPage(t, T);
    }
  }
}
function Ql(o, e, t, n, r = 10, s = 10) {
  const i = t - o, a = n - e, l = Math.hypot(i, a) || 1, u = i / l, d = a / l, h = -d, f = u, p = t - u * r + h * (s / 2), g = n - d * r + f * (s / 2), v = t - u * r - h * (s / 2), y = n - d * r - f * (s / 2);
  return [t, n, p, g, v, y, t, n];
}
class ed extends Je {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, i = JSON.parse(e.konvaString), a = i.children.filter((A) => A.className === "Arrow");
    if (a.length === 0) throw new Error(`Arrow annotation ${e.id} has no arrow shape.`);
    const l = s.obj(
      a.map((A) => {
        const T = A.attrs.points;
        if (!T || T.length < 4)
          throw new Error(`Arrow annotation ${e.id} needs at least two points.`);
        const E = [];
        for (let j = 0; j < T.length; j += 2) {
          const W = Ct({ x: T[j], y: T[j + 1] }, i), [L, k] = Pn(W, r);
          E.push(L, k);
        }
        const O = T.length, G = Ql(
          T[O - 4],
          T[O - 3],
          T[O - 2],
          T[O - 1],
          typeof A.attrs.pointerLength == "number" ? A.attrs.pointerLength : 10,
          typeof A.attrs.pointerWidth == "number" ? A.attrs.pointerWidth : 10
        );
        for (let j = 0; j < G.length; j += 2) {
          const W = Ct({ x: G[j], y: G[j + 1] }, i), [L, k] = Pn(W, r);
          E.push(L, k);
        }
        return s.obj(E);
      })
    ), u = a[0]?.attrs || {}, d = u.strokeWidth ?? 1, h = u.opacity ?? 1, f = u.stroke ?? e.color ?? "rgb(255, 0, 0)", [p, g, v] = Le(f), y = s.obj({
      W: Q.of(d),
      S: F.of("S")
      // Solid border style
    }), b = s.obj({
      Type: F.of("Annot"),
      // Ink is intentional: the sampled arrowhead renders consistently in PDF viewers.
      Subtype: F.of("Ink"),
      InkLayerType: F.of("Arrow"),
      Rect: Pe(e.konvaClientRect, r),
      InkList: l,
      C: s.obj([Q.of(p), Q.of(g), Q.of(v)]),
      T: ie(this.getExportTitle(be("normal.unknownUser"))),
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      BS: y,
      F: Q.of(4),
      P: t.ref,
      CA: Q.of(h)
      // Constant opacity for the Ink stroke.
    }), S = s.register(b);
    this.addAnnotationToPage(t, S);
    for (const A of e.comments || []) {
      const T = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: Pe(e.konvaClientRect, r),
        Contents: ie(A.content),
        T: ie(A.title || be("normal.unknownUser")),
        M: re.of(A.date || ""),
        C: s.obj([Q.of(p), Q.of(g), Q.of(v)]),
        IRT: S,
        RT: F.of("R"),
        NM: re.of(A.id),
        Open: !1
      }), E = s.register(T);
      this.addAnnotationToPage(t, E);
    }
  }
}
function td(o, e, t, n = 12) {
  const r = [];
  for (let s = 1; s <= n; s++) {
    const i = s / n, a = (1 - i) * (1 - i) * o[0] + 2 * (1 - i) * i * e[0] + i * i * t[0], l = (1 - i) * (1 - i) * o[1] + 2 * (1 - i) * i * e[1] + i * i * t[1];
    r.push(a, l);
  }
  return r;
}
function nd(o, e, t, n, r = 16) {
  const s = [];
  for (let i = 1; i <= r; i++) {
    const a = i / r, l = Math.pow(1 - a, 3) * o[0] + 3 * Math.pow(1 - a, 2) * a * e[0] + 3 * (1 - a) * a * a * t[0] + a * a * a * n[0], u = Math.pow(1 - a, 3) * o[1] + 3 * Math.pow(1 - a, 2) * a * e[1] + 3 * (1 - a) * a * a * t[1] + a * a * a * n[1];
    s.push(l, u);
  }
  return s;
}
function od(o) {
  const e = o.match(/[a-zA-Z][^a-zA-Z]*/g) || [], t = [];
  let n = [0, 0];
  for (const r of e) {
    const s = r[0], i = r.slice(1).trim().split(/[\s,]+/).map(parseFloat);
    if (s === "M" && (n = [i[0], i[1]], t.push(...n)), s === "L")
      for (let a = 0; a < i.length; a += 2)
        n = [i[a], i[a + 1]], t.push(...n);
    if (s === "Q") {
      const a = n, l = [i[0], i[1]], u = [i[2], i[3]];
      t.push(...td(a, l, u)), n = u;
    }
    if (s === "C") {
      const a = n, l = [i[0], i[1]], u = [i[2], i[3]], d = [i[4], i[5]];
      t.push(...nd(a, l, u, d)), n = d;
    }
  }
  return t;
}
class rd extends Je {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, i = Tt(e.konvaString), a = (i.children ?? []).filter((W) => W.className === "Path"), { groupX: l, groupY: u, scaleX: d, scaleY: h } = this.extractGroupTransform(i), f = r.viewport, p = s.obj(
      a.map((W) => {
        const L = od(W.attrs?.data ?? ""), k = [];
        for (let N = 0; N < L.length; N += 2) {
          const z = l + L[N] * d, H = u + L[N + 1] * h, I = z * f.scale, V = H * f.scale, [ee, X] = f.convertToPdfPoint(I, V);
          k.push(ee, X);
        }
        return s.obj(k);
      })
    ), g = a[0]?.attrs ?? {}, v = g.strokeWidth ?? 1, y = g.opacity ?? 1, b = g.stroke ?? e.color ?? "rgb(255, 0, 0)", [S, A, T] = Le(b), E = s.obj({
      W: Q.of(v),
      S: F.of("S")
      // Solid border style
    }), O = Pe(e.konvaClientRect, r), G = s.obj({
      Type: F.of("Annot"),
      Subtype: F.of("Ink"),
      Rect: O,
      InkList: p,
      C: s.obj([Q.of(S), Q.of(A), Q.of(T)]),
      T: ie(this.getExportTitle(be("normal.unknownUser"))),
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      Border: s.obj([0, 0, 0]),
      BS: E,
      F: Q.of(4),
      P: t.ref,
      CA: Q.of(y)
      // Non-stroking opacity (used for drawing)
    }), j = s.register(G);
    this.addAnnotationToPage(t, j);
    for (const W of e.comments || []) {
      const L = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: O,
        Contents: ie(W.content),
        T: ie(W.title || be("normal.unknownUser")),
        M: re.of(W.date || ""),
        C: s.obj([Q.of(S), Q.of(A), Q.of(T)]),
        IRT: j,
        RT: F.of("R"),
        NM: re.of(W.id),
        Open: !1
      }), k = s.register(L);
      this.addAnnotationToPage(t, k);
    }
  }
}
function id(o) {
  return (o.match(/[a-zA-Z][^a-zA-Z]*/g) ?? []).map((t) => ({
    type: t[0].toUpperCase(),
    values: t.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(Number)
  }));
}
function sd(o, e, t, n) {
  const r = 1 - n;
  return {
    x: r * r * o.x + 2 * r * n * e.x + n * n * t.x,
    y: r * r * o.y + 2 * r * n * e.y + n * n * t.y
  };
}
function ad(o, e, t, n, r) {
  const s = 1 - r;
  return {
    x: s ** 3 * o.x + 3 * s ** 2 * r * e.x + 3 * s * r ** 2 * t.x + r ** 3 * n.x,
    y: s ** 3 * o.y + 3 * s ** 2 * r * e.y + 3 * s * r ** 2 * t.y + r ** 3 * n.y
  };
}
function cd(o) {
  const e = [];
  let t = null;
  return o.forEach((n) => {
    if (n.type === "M" && n.values.length >= 2) {
      t = { x: n.values[0], y: n.values[1] }, e.push(t);
      return;
    }
    if (n.type === "L" && n.values.length >= 2) {
      t = { x: n.values[0], y: n.values[1] }, e.push(t);
      return;
    }
    if (n.type === "Q" && t && n.values.length >= 4) {
      const r = t, s = { x: n.values[0], y: n.values[1] }, i = { x: n.values[2], y: n.values[3] };
      for (let a = 1; a <= 12; a++)
        e.push(sd(r, s, i, a / 12));
      t = i;
      return;
    }
    if (n.type === "C" && t && n.values.length >= 6) {
      const r = t, s = { x: n.values[0], y: n.values[1] }, i = { x: n.values[2], y: n.values[3] }, a = { x: n.values[4], y: n.values[5] };
      for (let l = 1; l <= 16; l++)
        e.push(ad(r, s, i, a, l / 16));
      t = a;
    }
  }), e;
}
class ld extends Je {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, i = JSON.parse(e.konvaString), a = i.children?.find((A) => A.className === "Path");
    if (!a?.attrs?.data) throw new Error(`Cloud annotation ${e.id} has no path data.`);
    const l = cd(id(a.attrs.data));
    if (l.length < 2) throw new Error(`Cloud annotation ${e.id} needs at least two points.`);
    const u = l.flatMap((A) => {
      const T = Ct(A, i);
      return Pn(T, r);
    }), d = a.attrs.strokeWidth ?? 2, h = a.attrs.opacity ?? 1, f = a.attrs.stroke ?? e.color ?? "#000000", [p, g, v] = Le(f), y = Pe(e.konvaClientRect, r), b = s.obj({
      Type: F.of("Annot"),
      Subtype: F.of("Ink"),
      InkLayerType: F.of("Cloud"),
      Rect: y,
      InkList: s.obj([u]),
      C: s.obj([p, g, v]),
      T: ie(this.getExportTitle(be("normal.unknownUser"))),
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      Border: s.obj([0, 0, 0]),
      BS: s.obj({ W: d, S: F.of("S") }),
      F: Q.of(4),
      P: t.ref,
      CA: Q.of(h)
    }), S = s.register(b);
    this.addAnnotationToPage(t, S);
    for (const A of e.comments || []) {
      const T = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: y,
        Contents: ie(A.content),
        T: ie(A.title || be("normal.unknownUser")),
        M: re.of(A.date || ""),
        C: s.obj([p, g, v]),
        IRT: S,
        RT: F.of("R"),
        NM: re.of(A.id),
        Open: !1
      });
      this.addAnnotationToPage(t, s.register(T));
    }
  }
}
const dd = {
  [oe.TEXT]: jl,
  [oe.HIGHLIGHT]: Wl,
  [oe.UNDERLINE]: Bl,
  [oe.STRIKEOUT]: $l,
  [oe.SQUARE]: Vl,
  [oe.CIRCLE]: Yl,
  [oe.INK]: Kl,
  [oe.POLYLINE]: rd,
  [oe.FREETEXT]: Xl,
  [oe.STAMP]: Zl,
  [oe.LINE]: ed
  // 你可以在这里扩展其他类型的解析器
}, ud = /* @__PURE__ */ new Set([
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
function or(o) {
  return o.type === R.CLOUD ? ld : dd[o.pdfjsType];
}
async function hd(o, e, t, n) {
  const r = or(o);
  r ? await new r(t, e, o, n).parse() : console.warn("Unsupported annotation type:", o.pdfjsType);
}
function pd(o, e) {
  const t = new ArrayBuffer(o.byteLength);
  new Uint8Array(t).set(o);
  const n = new Blob([t], { type: "application/pdf" });
  xo(n, `${e}.pdf`);
}
function fd(o, e) {
  const t = new Blob([o], { type: "application/octet-stream" });
  xo(t, `${e}.xlsx`);
}
function gd(o) {
  for (const e of o.getPages()) {
    const t = F.of("Annots"), n = e.node.lookupMaybe(t, Co);
    if (!n) continue;
    const r = n.asArray().filter((s) => {
      const a = o.context.lookupMaybe(s, Sn)?.get(F.of("Subtype"))?.toString();
      return !a || !ud.has(a);
    });
    e.node.set(t, o.context.obj(r));
  }
}
async function md(o, e) {
  const t = o.pdfDocument;
  if (!t) throw new Error("Cannot export annotations before the PDF document is ready.");
  const n = await t.getData(), r = await Mn.load(n), s = r.getPages(), i = e.map((a) => {
    if (!or(a))
      throw new Error(`Unsupported annotation type: ${a.pdfjsType}`);
    const l = s[a.pageNumber - 1];
    if (!l) throw new Error(`Annotation ${a.id} references missing page ${a.pageNumber}.`);
    const u = o.getPageView(a.pageNumber - 1);
    if (!u?.viewport)
      throw new Error(`Page view ${a.pageNumber} is not ready for annotation export.`);
    return { annotation: a, page: l, pageView: u };
  });
  gd(r);
  for (const { annotation: a, page: l, pageView: u } of i)
    await hd(a, l, r, u);
  return r.save();
}
async function rr(o, e, t) {
  const n = await md(o, e), r = t || `annotated_${Uo()}`;
  pd(n, r);
}
function vd(o) {
  const e = [], t = [...o].sort((i, a) => i.pageNumber !== a.pageNumber ? i.pageNumber - a.pageNumber : jn(a.date) - jn(i.date)), n = (i) => {
    const l = [...i.comments || []].reverse().find((u) => u.status !== void 0 && u.status !== null)?.status ?? st.None;
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
      date: Cn(i.date, !0),
      status: n(i)
    }), s = 0, i.comments.forEach((d) => {
      s++, e.push({
        index: `${u}.${s}`,
        id: d.id,
        page: "",
        annotationType: "--",
        recordType: Te.t("annotator:export.recordType.reply"),
        author: d.title,
        content: d.content,
        date: Cn(d.date, !0),
        status: ""
      });
    }), r++;
  }), e;
}
async function ir(o, e, t) {
  const n = vd(e), r = await import("exceljs"), s = new r.Workbook(), i = s.addWorksheet("sheet1");
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
  ], n.forEach((u) => {
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
  const a = await s.xlsx.writeBuffer(), l = t || `annotated_${Uo()}`;
  fd(a, l);
}
async function yd(o, e, t) {
  if (t.has(e)) return t.get(e);
  const n = o.getPageView(e);
  if (!n?.pdfPage) return "";
  const s = (await n.pdfPage.getTextContent()).items.map((i) => "str" in i ? i.str : "").join("");
  return t.set(e, s), s;
}
function bd({ pdfViewer: o }) {
  const [e, t] = K(""), [n, r] = K([]), [s, i] = K(!1), [a, l] = K({
    caseSensitive: !1,
    entireWord: !1,
    matchDiacritics: !1
  }), u = $(/* @__PURE__ */ new Map()), d = $(a), h = $(0), f = $(null), p = q(() => {
    f.current?.(), f.current = null;
  }, []);
  te(() => (u.current.clear(), () => {
    h.current += 1, p();
  }), [o, p]);
  const g = q(({ pageNumber: b, matchIndex: S }) => {
    if (!o || !e) return;
    const A = o.findController;
    if (!A || !o.pdfDocument) return;
    o.scrollPageIntoView({ pageNumber: b });
    const E = A;
    E._selected = { pageIdx: b - 1, matchIdx: S }, E._offset = { pageIdx: b - 1, matchIdx: S - 1, wrapped: !1 }, E._highlightMatches = !0, o.eventBus.dispatch("find", {
      type: "again",
      query: e,
      caseSensitive: a.caseSensitive,
      entireWord: a.entireWord,
      findPrevious: !1,
      matchDiacritics: a.matchDiacritics,
      highlightAll: !0
    });
  }, [o, e, a]), v = q(
    async (b, S) => {
      if (!o) return;
      const A = h.current + 1;
      h.current = A, p();
      const T = {
        ...d.current,
        ...S
      };
      d.current = T, i(!0), t(b), l(T);
      try {
        const E = await new Promise((O, G) => {
          const j = o.pagesCount;
          let W = 0;
          const L = 60, k = 200;
          let N = null, z = !1, H = null;
          const I = () => {
            N && (clearTimeout(N), N = null), o.eventBus.off("updatefindcontrolstate", x);
          }, V = (P) => {
            z || (z = !0, I(), O(P));
          }, ee = (P) => {
            z || (z = !0, I(), G(P));
          }, X = async () => {
            if (z || A !== h.current) {
              V(null);
              return;
            }
            try {
              const P = H?._pageMatches;
              if (Array.isArray(P) && P.length === j) {
                const Y = [];
                for (let D = 0; D < P.length; D++) {
                  const J = P[D];
                  if (!J || J.length === 0) continue;
                  const de = await yd(o, D, u.current);
                  if (z || A !== h.current) {
                    V(null);
                    return;
                  }
                  const ce = J.map((_, ne) => {
                    const fe = Math.max(0, _ - 5), Ae = Math.min(de.length, _ + b.length + 30);
                    return {
                      matchIndex: ne,
                      charIndex: _,
                      snippet: de.slice(fe, Ae)
                    };
                  });
                  Y.push({
                    pageNumber: D + 1,
                    countTotal: J.length,
                    matches: ce
                  });
                }
                V({
                  query: b,
                  countTotal: H?._matchesCountTotal ?? 0,
                  pageMatches: Y
                });
              } else W < L ? (W += 1, N = setTimeout(() => {
                N = null, X();
              }, k)) : V({
                query: b,
                countTotal: 0,
                pageMatches: []
              });
            } catch (P) {
              ee(P);
            }
          }, x = ({ source: P, rawQuery: Y }) => {
            const D = Array.isArray(Y) ? Y.join("") : Y;
            D != null && D !== b || (H = P ?? null, N && (clearTimeout(N), N = null), X());
          };
          f.current = () => V(null), o.eventBus.on("updatefindcontrolstate", x), o.eventBus.dispatch("find", {
            type: "highlightallchange",
            query: b,
            caseSensitive: T.caseSensitive ?? !1,
            entireWord: T.entireWord ?? !1,
            findPrevious: !1,
            matchDiacritics: T.matchDiacritics ?? !1,
            highlightAll: !0
          });
        });
        E && A === h.current && r([E]);
      } catch (E) {
        console.error(E), A === h.current && r([{ query: b, countTotal: 0, pageMatches: [] }]);
      } finally {
        A === h.current && (f.current = null, i(!1));
      }
    },
    [o, p]
  ), y = q(() => {
    h.current += 1, p(), o?.eventBus.dispatch("find", { query: "" }), t(""), r([]), i(!1);
  }, [o, p]);
  return { query: e, setQuery: t, results: n, searching: s, search: v, clearSearch: y, jumpToMatch: g, searchOptions: a };
}
function Sd(o, e, t) {
  if (!e) return [{ text: o, highlighted: !1 }];
  const n = e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), r = new RegExp(
    `(${n})`,
    t ? "g" : "gi"
  ), s = new RegExp(
    `^${n}$`,
    t ? "" : "i"
  );
  return o.split(r).map((i) => ({
    text: i,
    highlighted: s.test(i)
  }));
}
const wd = ({ text: o, query: e, caseSensitive: t }) => /* @__PURE__ */ c(Ce, { children: Sd(o, e, t).map(
  (n, r) => n.highlighted ? /* @__PURE__ */ c("mark", { style: { backgroundColor: "rgba(255, 255, 0, 0.2)", padding: "0 2px" }, children: n.text }, `${r}-${n.text}`) : n.text
) }), sr = ({ pdfViewer: o }) => {
  const { query: e, setQuery: t, results: n, searching: r, search: s, clearSearch: i, jumpToMatch: a } = bd({ pdfViewer: o }), { t: l } = ve("viewer", { useSuspense: !1 }), [u, d] = K({
    caseSensitive: !1,
    entireWord: !1
  }), [h, f] = K(null), p = $({}), g = $(n), v = $(e);
  v.current = e;
  const y = q(
    (k) => {
      k.trim() && o && (i(), f(null), s(k.trim(), {
        caseSensitive: u.caseSensitive,
        entireWord: u.entireWord
      }));
    },
    [o, s, i, u]
  ), b = q(
    (k) => {
      switch (k.key) {
        case "Escape":
          (n.length > 0 || e.trim() !== "") && i();
          break;
        case "Enter":
          e.trim() === "" && n.length > 0 && i(), e.trim() && (i(), y(e));
          break;
      }
    },
    [e, n, i, y]
  ), S = q(
    (k, N) => {
      f({ pageNumber: k, matchIndex: N }), a({
        pageNumber: k,
        matchIndex: N
      });
    },
    [a]
  ), A = q((k, N) => {
    d((z) => ({
      ...z,
      [k]: N
    }));
  }, []), T = q(() => {
    const k = [];
    return n.forEach((N) => {
      N.pageMatches.forEach((z) => {
        z.matches.forEach((H) => {
          k.push({
            pageNumber: z.pageNumber,
            matchIndex: H.matchIndex,
            query: N.query
          });
        });
      });
    }), k;
  }, [n]), E = q((k, N) => {
    const z = p.current[`${k}-${N}`];
    z && z.scrollIntoView({
      block: "center",
      inline: "center"
    });
  }, []), O = q(() => h ? T().findIndex((N) => N.pageNumber === h.pageNumber && N.matchIndex === h.matchIndex) : -1, [h, T]), G = q(() => {
    if (!n.length) return;
    const k = T();
    if (!k.length) return;
    let N = 0;
    h && (N = (O() + 1) % k.length);
    const z = k[N];
    f({
      pageNumber: z.pageNumber,
      matchIndex: z.matchIndex
    }), a({
      pageNumber: z.pageNumber,
      matchIndex: z.matchIndex
    }), E(z.pageNumber, z.matchIndex);
  }, [n, h, T, O, a, E]), j = q(() => {
    if (!n.length) return;
    const k = T();
    if (!k.length) return;
    let N = k.length - 1;
    h && (N = (O() - 1 + k.length) % k.length);
    const z = k[N];
    f({
      pageNumber: z.pageNumber,
      matchIndex: z.matchIndex
    }), a({
      pageNumber: z.pageNumber,
      matchIndex: z.matchIndex
    }), E(z.pageNumber, z.matchIndex);
  }, [n, h, T, O, a, E]);
  te(() => {
    g.current = n;
  }, [n]), te(() => {
    const k = v.current.trim();
    k && y(k);
  }, [u, y]), te(() => () => {
    g.current.length > 0 && i(), f(null), t("");
  }, [i, t]);
  const W = () => !n.length || r ? null : n.map((k) => /* @__PURE__ */ C(lt, { children: [
    /* @__PURE__ */ C(
      Z,
      {
        pb: "2",
        justify: "between",
        align: "center",
        style: { position: "sticky", top: 89, backgroundColor: "var(--bg-color-tertiary)", zIndex: 1 },
        children: [
          /* @__PURE__ */ c(ae, { size: "2", children: l("viewer:search.resultTotal", {
            total: k.countTotal
          }) }),
          k.countTotal > 0 && /* @__PURE__ */ C("div", { children: [
            /* @__PURE__ */ c(et, { onClick: j, variant: "soft", color: "gray", size: "1", mr: "1", children: /* @__PURE__ */ c(vo, {}) }),
            /* @__PURE__ */ c(et, { onClick: G, variant: "soft", color: "gray", size: "1", mr: "1", children: /* @__PURE__ */ c(yo, {}) })
          ] })
        ]
      }
    ),
    k.pageMatches.map((N) => /* @__PURE__ */ C(lt, { mt: "1", mb: "3", pl: "2", children: [
      /* @__PURE__ */ C(ae, { size: "2", children: [
        l("viewer:search.page", { value: N.pageNumber }),
        " (",
        N.countTotal,
        ")"
      ] }),
      N.matches.map((z) => {
        const H = h && h.pageNumber === N.pageNumber && h.matchIndex === z.matchIndex, I = `${N.pageNumber}-${z.matchIndex}`;
        return /* @__PURE__ */ c(lt, { mt: "2", pl: "0", children: /* @__PURE__ */ c(
          ye,
          {
            ref: (V) => p.current[I] = V,
            variant: H ? "soft" : "outline",
            color: H ? void 0 : "gray",
            type: "button",
            onClick: () => S(N.pageNumber, z.matchIndex),
            style: {
              width: "100%",
              textAlign: "left",
              justifyContent: "flex-start"
            },
            children: /* @__PURE__ */ c(ae, { truncate: !0, children: /* @__PURE__ */ c(
              wd,
              {
                text: z.snippet,
                query: k.query,
                caseSensitive: u.caseSensitive
              }
            ) })
          }
        ) }, z.matchIndex);
      })
    ] }, N.pageNumber))
  ] }, k.query)), L = ke(() => r ? /* @__PURE__ */ C(Z, { mt: "2", align: "center", gap: "2", children: [
    /* @__PURE__ */ c(go, {}),
    /* @__PURE__ */ c(ae, { size: "2", children: l("viewer:search.searching") })
  ] }) : null, [r, l]);
  return /* @__PURE__ */ C(lt, { p: "2", pt: "0", children: [
    /* @__PURE__ */ C(Z, { direction: "column", style: { position: "sticky", top: 0, backgroundColor: "var(--bg-color-tertiary)", zIndex: 1 }, children: [
      /* @__PURE__ */ C(
        kt.Root,
        {
          placeholder: l("viewer:search.placeholder"),
          value: e,
          onChange: (k) => t(k.currentTarget.value),
          onKeyDown: b,
          "aria-label": l("viewer:search.placeholder"),
          mt: "3",
          children: [
            /* @__PURE__ */ c(kt.Slot, { children: /* @__PURE__ */ c(In, {}) }),
            /* @__PURE__ */ c(kt.Slot, { children: e.trim() && /* @__PURE__ */ c(
              et,
              {
                size: "1",
                variant: "ghost",
                onClick: () => {
                  t(""), n.length > 0 && (i(), f(null));
                },
                children: /* @__PURE__ */ c(Br, {})
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ C(Z, { mt: "2", align: "center", gap: "2", children: [
        /* @__PURE__ */ c(ae, { as: "label", size: "2", children: /* @__PURE__ */ C(Z, { gap: "2", children: [
          /* @__PURE__ */ c(
            Vt,
            {
              checked: u.caseSensitive,
              onCheckedChange: (k) => A("caseSensitive", !!k),
              "aria-label": l("viewer:search.caseSensitive")
            }
          ),
          l("viewer:search.caseSensitive")
        ] }) }),
        /* @__PURE__ */ c(ae, { as: "label", size: "2", children: /* @__PURE__ */ C(Z, { gap: "2", children: [
          /* @__PURE__ */ c(
            Vt,
            {
              checked: u.entireWord,
              onCheckedChange: (k) => A("entireWord", !!k),
              "aria-label": l("viewer:search.entireWord")
            }
          ),
          l("viewer:search.entireWord")
        ] }) })
      ] }),
      /* @__PURE__ */ c(tt, { my: "2", size: "4" })
    ] }),
    L,
    W()
  ] });
}, ar = () => {
  const [o, e] = K(() => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  return te(() => {
    const t = window.matchMedia("(prefers-color-scheme: dark)"), n = (r) => {
      e(r.matches ? "dark" : "light");
    };
    return t.addEventListener ? t.addEventListener("change", n) : t.addListener(n), () => {
      t.removeEventListener ? t.removeEventListener("change", n) : t.removeListener(n);
    };
  }, []), o;
}, Cd = () => /* @__PURE__ */ C(Z, { align: "center", gap: "2", "data-inklayer-page-zoom-control": "true", children: [
  /* @__PURE__ */ c(Ro, { persistent: !0 }),
  /* @__PURE__ */ c(tt, { orientation: "vertical" }),
  /* @__PURE__ */ c(qt, {})
] }), ho = "search-sidebar", po = "annotator-sidebar-toggle", Ad = ({
  Chrome: o,
  onSave: e,
  enableNativeAnnotations: t,
  searchAvailable: n
}) => {
  const { painter: r, requestWrite: s } = nt(), i = se((b) => b.currentAnnotationType), {
    activeSidebarPanel: a,
    closeSidebar: l,
    openSidebar: u,
    isNavigationSidebarOpen: d,
    toggleNavigationSidebar: h,
    pdfViewer: f
  } = Fe(), p = r?.can("annotation.create") ?? !1, g = !!s;
  te(() => {
    p || i && i.type !== R.SELECT && r?.activate(null, null);
  }, [p, i, r]), te(() => () => {
    r?.activate(null, null);
  }, [r]);
  const v = (b) => {
    a === b ? l() : u(b);
  }, y = {
    save: () => {
      r && e?.(_t(r.getData()));
    },
    getAnnotations: () => _t(r?.getData() ?? []),
    replaceAnnotations: async (b) => {
      r && await r.replaceAnnotations(Wo(b), t);
    },
    exportToExcel: (b) => {
      r && f && ir(f, r.getData(), b);
    },
    exportToPdf: (b) => {
      r && f && rr(f, r.getData(), b);
    }
  };
  return /* @__PURE__ */ c(
    o,
    {
      activeTool: On(i?.type),
      canCreate: p,
      canRequestWrite: g,
      ToolControl: En,
      ColorControl: er,
      AuthorLabelsControl: tr,
      PageZoomControl: Cd,
      history: r?.getHistory(),
      panels: {
        navigation: {
          open: d,
          toggle: h
        },
        search: {
          open: a === ho,
          available: n,
          toggle: () => v(ho)
        },
        annotations: {
          open: a === po,
          toggle: () => v(po)
        }
      },
      actions: y
    }
  );
}, Kd = ({
  appearance: o = "auto",
  enableRange: e = "auto",
  theme: t = "violet",
  title: n = "PDF ANNOTATOR",
  data: r,
  url: s,
  locale: i = "zh-CN",
  pdfjsOptions: a,
  user: l = { id: "null", name: "unknown" },
  annotationPermissions: u,
  requestWrite: d,
  defaultShowAnnotationAuthorLabels: h = !1,
  defaultOptions: f,
  initialScale: p,
  enableNativeAnnotations: g = !1,
  initialAnnotations: v = [],
  defaultShowAnnotationsSidebar: y = !1,
  onSave: b,
  onLoad: S,
  onAnnotationAdded: A,
  onAnnotationDeleted: T,
  onAnnotationSelected: E,
  onAnnotationUpdated: O,
  layoutStyle: G,
  actions: j,
  chrome: W,
  searchAvailable: L = !0
}) => {
  const k = ke(
    () => Wo(v),
    [v]
  ), N = ke(
    () => ({ textLayerMode: 1, annotationMode: 0, externalLinkTarget: 0, enableRange: e, pdfjsOptions: a }),
    [e, a]
  ), { t: z } = ve(["annotator", "common"], { useSuspense: !1 }), H = ke(() => Jo(Fc, f || {}), [f]), [I, V] = K(() => to()), ee = ar(), X = o === "auto" ? ee : o;
  te(() => {
    const P = setTimeout(() => {
      const Y = to();
      V(Y);
    }, 0);
    return () => clearTimeout(P);
  }, []), te(() => {
    Te.changeLanguage(i);
  }, [i]);
  const x = () => {
    const { painter: P } = nt(), { pdfViewer: Y } = Fe(), D = () => {
      if (P) {
        const ce = P.getData();
        b?.(_t(ce));
      }
    }, J = async (ce) => {
      if (P && Y) {
        const _ = P.getData();
        await rr(Y, _, ce);
      }
    }, de = async (ce) => {
      if (P && Y) {
        const _ = P.getData();
        await ir(Y, _, ce);
      }
    };
    return j ? typeof j == "function" ? /* @__PURE__ */ c(
      j,
      {
        save: D,
        getAnnotations: () => _t(P?.getData() || []),
        exportToExcel: (_) => {
          de(_);
        },
        exportToPdf: (_) => {
          J(_);
        }
      }
    ) : Pt.cloneElement(j, {
      save: D,
      getAnnotations: () => _t(P?.getData() || []),
      exportToExcel: (ce) => {
        de(ce);
      },
      exportToPdf: (ce) => {
        J(ce);
      }
    }) : /* @__PURE__ */ C(Ce, { children: [
      /* @__PURE__ */ c(tt, { orientation: "vertical" }),
      /* @__PURE__ */ C(me.Root, { children: [
        /* @__PURE__ */ c(me.Trigger, { children: /* @__PURE__ */ C(ye, { variant: "soft", children: [
          z("common:export"),
          /* @__PURE__ */ c(me.TriggerIcon, {})
        ] }) }),
        /* @__PURE__ */ C(me.Content, { children: [
          /* @__PURE__ */ C(me.Item, { onClick: () => J(), children: [
            z("common:export"),
            " PDF"
          ] }),
          /* @__PURE__ */ C(me.Item, { onClick: () => de(), children: [
            z("common:export"),
            " Excel"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ C(ye, { onClick: D, children: [
        /* @__PURE__ */ c($r, {}),
        z("common:save")
      ] })
    ] });
  };
  return /* @__PURE__ */ c(mo, { accentColor: t, appearance: X, children: /* @__PURE__ */ c(jc, { requestWrite: d, children: /* @__PURE__ */ c(
    qo.Provider,
    {
      value: {
        defaultOptions: H,
        primaryColor: I
      },
      children: /* @__PURE__ */ C(
        Mo,
        {
          title: n,
          url: s,
          data: r,
          initialScale: p,
          user: l,
          ...N,
          toolbar: W ? void 0 : /* @__PURE__ */ c(zc, { defaultAnnotationName: "" }),
          hideHeader: !!W,
          hidePageIndicator: !!W,
          defaultActiveSidebarKey: y ? "annotator-sidebar-toggle" : null,
          sidebar: [
            {
              key: "search-sidebar",
              title: z("viewer:search.search"),
              icon: /* @__PURE__ */ c(In, { style: { width: 18, height: 18 } }),
              render: (P) => /* @__PURE__ */ c(sr, { pdfViewer: P.pdfViewer })
            },
            {
              title: z("annotator:sidebar.toggle"),
              key: "annotator-sidebar-toggle",
              icon: /* @__PURE__ */ c(_o, { style: { width: 18, height: 18 } }),
              render: () => /* @__PURE__ */ c(Fl, {})
            }
          ],
          actions: W ? void 0 : /* @__PURE__ */ c(x, {}),
          style: G,
          children: [
            W ? /* @__PURE__ */ c(
              Ad,
              {
                Chrome: W,
                onSave: b,
                enableNativeAnnotations: g,
                searchAvailable: L
              }
            ) : null,
            /* @__PURE__ */ c(
              pc,
              {
                onLoad: () => {
                  S?.();
                },
                onAnnotationAdd: (P) => A?.(Ot(P)),
                onAnnotationDelete: (P) => {
                  T?.(P);
                },
                onAnnotationSelected: (P, Y) => E?.(P ? Ot(P) : null, Y),
                onAnnotationChanged: (P) => O?.(Ot(P)),
                enableNativeAnnotations: g,
                annotations: k,
                annotationPermissions: u,
                defaultShowAnnotationAuthorLabels: h
              }
            )
          ]
        }
      )
    }
  ) }) });
}, Td = ({
  onDocumentLoaded: o,
  onEventBusReady: e
}) => {
  const { isReady: t, pdfViewer: n, eventBus: r, isSidebarCollapsed: s } = Fe();
  return te(() => {
    if (!t || !n || !r) return;
    e?.(r);
    const i = async () => {
      o?.(n);
    };
    return n.pdfDocument ? i() : r.on("documentloaded", i), () => {
      r.off("documentloaded", i);
    };
  }, [t, n, r, o, e]), te(() => {
    r && n && r.dispatch("updateviewarea", { pdfViewer: n });
  }, [s, r, n]), /* @__PURE__ */ c(Ce, {});
}, xd = () => {
  const { t: o } = ve("common", { useSuspense: !1 }), { pdfDocument: e } = Fe(), { printClean: t } = No(e);
  return /* @__PURE__ */ c(Rt, { content: o("common:print"), children: /* @__PURE__ */ c(
    ye,
    {
      variant: "outline",
      size: "2",
      color: "gray",
      highContrast: !0,
      style: {
        boxShadow: "none"
      },
      onClick: () => t(),
      children: /* @__PURE__ */ c(Vr, { style: { width: 18, height: 18 } })
    }
  ) });
}, kd = ({ actions: o }) => {
  const e = Fe();
  return o ? typeof o == "function" ? o(e) : o : /* @__PURE__ */ c(Ce, { children: /* @__PURE__ */ c(Z, { gap: "3", align: "center", children: /* @__PURE__ */ c(xd, {}) }) });
}, Ed = ({ toolbar: o }) => {
  const e = Fe();
  return o ? typeof o == "function" ? /* @__PURE__ */ C(Z, { gap: "3", align: "center", children: [
    /* @__PURE__ */ c(qt, {}),
    /* @__PURE__ */ c(tt, { orientation: "vertical" }),
    o(e)
  ] }) : o : /* @__PURE__ */ c(Z, { gap: "3", align: "center", children: /* @__PURE__ */ c(qt, {}) });
}, Xd = ({
  appearance: o = "auto",
  enableRange: e = "auto",
  title: t = "PDF VIEWER",
  url: n,
  data: r,
  locale: s = "zh-CN",
  pdfjsOptions: i,
  initialScale: a,
  layoutStyle: l,
  theme: u = "violet",
  actions: d,
  sidebar: h,
  toolbar: f,
  showTextLayer: p = !0,
  showAnnotations: g = !1,
  defaultActiveSidebarKey: v,
  onDocumentLoaded: y,
  onEventBusReady: b
}) => {
  const { t: S } = ve(["viewer"], { useSuspense: !1 }), A = ke(
    () => ({
      textLayerMode: p ? 1 : 0,
      annotationMode: g ? 1 : 0,
      externalLinkTarget: 0,
      enableRange: e,
      pdfjsOptions: i
    }),
    [p, g, e, i]
  );
  te(() => {
    Te.changeLanguage(s);
  }, [s]);
  const T = ar();
  return /* @__PURE__ */ c(mo, { accentColor: u, appearance: o === "auto" ? T : o, children: /* @__PURE__ */ c(
    Mo,
    {
      title: t,
      url: n,
      data: r,
      sidebar: [{
        key: "search-sidebar",
        title: S("viewer:search.search"),
        icon: /* @__PURE__ */ c(In, { style: { width: 18, height: 18 } }),
        render: (O) => /* @__PURE__ */ c(sr, { pdfViewer: O.pdfViewer })
      }, ...h || []],
      defaultActiveSidebarKey: v,
      toolbar: /* @__PURE__ */ c(Ed, { toolbar: f }),
      initialScale: a,
      ...A,
      style: l,
      actions: /* @__PURE__ */ c(kd, { actions: d }),
      children: /* @__PURE__ */ c(Td, { onEventBusReady: b, onDocumentLoaded: y })
    }
  ) });
};
export {
  Kd as PdfAnnotator,
  Xd as PdfViewer
};
