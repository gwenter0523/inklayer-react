import { jsxs as w, Fragment as Se, jsx as c } from "react/jsx-runtime";
import Lt, { useRef as W, useState as V, useCallback as Z, useEffect as ne, createContext as Qt, useContext as _t, memo as ho, useMemo as Ae, forwardRef as en, useImperativeHandle as Pn, useLayoutEffect as st, useSyncExternalStore as sr, useId as ar, createElement as cr } from "react";
import * as lr from "pdfjs-dist/legacy/build/pdf.mjs";
import { AnnotationMode as dr, AnnotationEditorType as ur, getDocument as an, PDFDataRangeTransport as hr } from "pdfjs-dist/legacy/build/pdf.mjs";
import { EventBus as pr, PDFLinkService as fr, DownloadManager as gr, PDFFindController as mr, PDFViewer as vr } from "pdfjs-dist/legacy/web/pdf_viewer.mjs";
import "pdfjs-dist/legacy/web/pdf_viewer.css";
import { useThemeContext as tn, Flex as X, Spinner as po, Box as at, Text as ae, Progress as yr, Callout as ct, Strong as br, IconButton as Qe, TextField as Tt, Tabs as At, Tooltip as xt, Button as ve, Popover as Ce, Card as Sr, Grid as Wt, Separator as et, Slider as On, HoverCard as cn, DropdownMenu as ge, Dialog as it, SegmentedControl as ht, Select as ke, CheckboxGroup as gt, TextArea as wr, Badge as Cr, Checkbox as Vt, Theme as fo } from "@radix-ui/themes";
import { useTranslation as me, initReactI18next as Ar } from "react-i18next";
import { AiOutlineWarning as Tr, AiOutlineLeft as go, AiOutlineRight as mo, AiOutlineArrowLeft as xr, AiOutlineLine as kr, AiOutlinePlus as Er, AiOutlinePlusCircle as vo, AiOutlineImport as yo, AiOutlineExclamationCircle as Rr, AiOutlineBold as Pr, AiOutlineItalic as Nr, AiOutlineUnderline as Ir, AiOutlineStrikethrough as Mr, AiOutlineExclamation as Dr, AiOutlineEllipsis as Hn, AiOutlineFilter as Lr, AiOutlineMinusSquare as _r, AiOutlineStop as Or, AiOutlineCheckCircle as Hr, AiOutlineMinusCircle as Gr, AiOutlineDislike as Ur, AiOutlineLike as zr, AiOutlineSearch as Nn, AiFillCloseCircle as Fr, AiOutlineSave as jr, AiOutlinePrinter as Wr } from "react-icons/ai";
import { PDFDocument as In, PDFName as z, PDFHexString as bo, PDFArray as So, PDFDict as bn, PDFString as re, PDFRef as $r, PDFNumber as Q, PDFRawStream as Br } from "pdf-lib";
import { GoSidebarExpand as Vr, GoSidebarCollapse as Yr } from "react-icons/go";
import I from "konva";
import { nanoid as Kr } from "nanoid";
import we, { t as ye } from "i18next";
import { computePosition as $t, flip as wo } from "@floating-ui/dom";
import { create as Xr } from "zustand";
import qr from "web-highlighter";
import { HexColorPicker as Jr } from "react-colorful";
import Co from "dayjs";
import Zr from "dayjs/plugin/customParseFormat.js";
import { saveAs as Ao } from "file-saver";
const Qr = new URL("pdf.worker.min.mjs", import.meta.url).href;
lr.GlobalWorkerOptions.workerSrc = Qr;
function ei(o) {
  if (!(o instanceof Error)) return !1;
  const e = o.message.toLowerCase();
  return e.includes("range") || e.includes("content-length") || e.includes("unexpected server response") || e.includes("cors");
}
function ti(o, e) {
  const {
    url: t,
    data: n,
    enableRange: r = "auto",
    onLoadSuccess: i,
    onLoadError: s,
    onLoadEnd: a,
    onViewerInit: l,
    eventBus: h,
    textLayerMode: d = 1,
    annotationMode: u = dr.DISABLE,
    externalLinkTarget: f = 2,
    pdfjsOptions: p
  } = e, g = W(i), m = W(s), v = W(a), y = W(l);
  g.current = i, m.current = s, v.current = a, y.current = l;
  const T = W(null), S = W(null), x = W(null), N = W(null), F = W(0), [U, $] = V(!0), [j, _] = V(0), [E, R] = V(null), [D, H] = V(null), [Y, ee] = V(null), J = Z(() => {
    if (N.current && (N.current(), N.current = null), !o.current) throw new Error("PDF container not ready");
    const L = h || new pr();
    x.current = L;
    const q = new fr({ eventBus: L, externalLinkTarget: f }), le = new gr(), O = new mr({ linkService: q, eventBus: L }), te = new vr({
      container: o.current,
      eventBus: L,
      textLayerMode: d,
      annotationMode: u,
      annotationEditorMode: ur.DISABLE,
      linkService: q,
      downloadManager: le,
      findController: O
    });
    return q.setViewer(te), T.current = te, S.current = q, N.current = () => {
      T.current && (T.current.cleanup(), T.current = null), S.current && (S.current = null), !h && x.current && (x.current = null);
    }, y.current?.(te), { bus: L, linkService: q, viewer: te };
  }, [o, h, d, u, f]), K = Z(async (L) => {
    const q = await fetch(L, { method: "HEAD" }), le = Number(q.headers.get("Content-Length"));
    if (isNaN(le)) throw new Error("Cannot get PDF length for range loading");
    class O extends hr {
      async requestDataRange(de, he) {
        const xe = await (await fetch(L, { headers: { Range: `bytes=${de}-${he - 1}` } })).arrayBuffer();
        this.onDataRange(de, new Uint8Array(xe));
      }
    }
    return new O(le, null);
  }, []), b = Z(
    async (L) => {
      if (n)
        return an({
          ...p,
          data: n,
          disableRange: !0,
          disableStream: !0
        });
      if (t && L) {
        const q = await K(t);
        return an({ ...p, range: q });
      } else {
        if (t)
          return an({ ...p, url: t, disableRange: !0, disableStream: !0 });
        throw new Error("Either url or data must be provided");
      }
    },
    [t, K, n, p]
  ), G = W(null), B = Z(async () => {
    const L = F.current + 1;
    F.current = L;
    const q = () => F.current === L;
    if (!t && !n) {
      const de = new Error("Either url or data must be provided");
      q() && (ee(de), $(!1), m.current?.(de), v.current?.());
      return;
    }
    $(!0), _(0), ee(null), R(null);
    let le = !1, O = null, te = null;
    try {
      te = J();
      const { linkService: de, viewer: he } = te;
      if (r === !0 || r === "auto" ? (le = !0, O = await b(!0)) : O = await b(!1), !q()) {
        await O.destroy();
        return;
      }
      G.current = O, O.onProgress = ({ loaded: He, total: C }) => {
        q() && C > 0 && _(Math.min(100, Math.round(He / C * 100)));
      };
      const xe = await O.promise;
      if (!q()) {
        await xe.destroy();
        return;
      }
      R(xe), de.setDocument(xe), he.setDocument(xe);
      const $e = await xe.getMetadata();
      if (!q()) return;
      H($e), g.current?.(xe);
    } catch (de) {
      if (!q()) return;
      if (r === "auto" && le && ei(de)) {
        console.warn("[PDF] Range failed, fallback to full loading"), await O?.destroy(), G.current === O && (G.current = null);
        try {
          if (!te)
            throw new Error("PDF viewer was not initialized");
          const he = await b(!1);
          if (O = he, !q()) {
            await he.destroy();
            return;
          }
          G.current = he, he.onProgress = ({ loaded: C, total: M }) => {
            q() && M > 0 && _(Math.min(100, Math.round(C / M * 100)));
          };
          const Ee = await he.promise;
          if (!q()) {
            await Ee.destroy();
            return;
          }
          const { linkService: xe, viewer: $e } = te;
          R(Ee), xe.setDocument(Ee), $e.setDocument(Ee);
          const He = await Ee.getMetadata();
          if (!q()) return;
          H(He), g.current?.(Ee);
          return;
        } catch (he) {
          if (!q()) return;
          ee(he), m.current?.(he);
          return;
        }
      }
      ee(de), m.current?.(de);
    } finally {
      q() && ($(!1), v.current?.());
    }
  }, [t, n, r, J, b]);
  return ne(() => (B(), () => {
    F.current += 1, N.current && (N.current(), N.current = null), G.current && (G.current.destroy(), G.current = null);
  }), [B]), {
    /** 是否加载中 */
    loading: U,
    /** 加载进度 */
    progress: j,
    /** PDF 文档对象 */
    pdfDocument: E,
    /** PDFViewer 实例 */
    pdfViewer: T.current,
    /** EventBus 引用 */
    eventBus: x.current,
    /** PDF 元数据 */
    metadata: D,
    /** 加载错误 */
    loadError: Y
  };
}
const To = Qt(null), je = () => {
  const o = _t(To);
  if (!o)
    throw new Error("usePdfViewerContext must be used within a PdfViewerProvider");
  return o;
}, Mn = Qt(null), xo = () => {
  const o = _t(Mn);
  if (!o)
    throw new Error("useUserContext must be used within a UserProvider");
  return o;
}, ni = "_InkLayerViewer_1ief7_1", oi = "_viewerHeader_1ief7_91", ri = "_viewerBody_1ief7_130", ii = "_navigationSidebarTriggerIcon_1ief7_136", si = "_viewerWrapper_1ief7_142", ai = "_viewerContainer_1ief7_150", ci = "_pdfjsViewerContainer_1ief7_167", li = "_viewerSidebar_1ief7_197", di = "_sidebarOverlay_1ief7_225", Ne = {
  InkLayerViewer: ni,
  viewerHeader: oi,
  "viewerHeader-title": "_viewerHeader-title_1ief7_102",
  "viewerHeader-title-left": "_viewerHeader-title-left_1ief7_109",
  "viewerHeader-title-name": "_viewerHeader-title-name_1ief7_115",
  "viewerHeader-title-actions": "_viewerHeader-title-actions_1ief7_124",
  viewerBody: ri,
  navigationSidebarTriggerIcon: ii,
  viewerWrapper: si,
  viewerContainer: ai,
  "viewerContainer-header": "_viewerContainer-header_1ief7_156",
  pdfjsViewerContainer: ci,
  viewerSidebar: li,
  "viewerSidebar--hidden": "_viewerSidebar--hidden_1ief7_209",
  "viewerSidebar-container": "_viewerSidebar-container_1ief7_215",
  sidebarOverlay: di
};
function ui(o, e) {
  const [t, n] = V(!1), r = W(null);
  return ne(() => (o ? r.current = setTimeout(() => {
    n(!0);
  }, e) : (r.current && (clearTimeout(r.current), r.current = null), n(!1)), () => {
    r.current && (clearTimeout(r.current), r.current = null);
  }), [o, e]), t;
}
function hi(o, e) {
  const [t, n] = V(!1), [r, i] = V(o), s = W(null), a = W(o);
  return ne(() => {
    o !== a.current && (a.current = o, i(o), t || n(!0), s.current && clearTimeout(s.current), s.current = setTimeout(() => {
      n(!1), s.current = null;
    }, e));
  }, [o, e, t]), {
    visible: t,
    value: r
  };
}
const pi = ({ loading: o, progress: e, loadingDelay: t = 500, progressHideDelay: n = 1500 }) => {
  const r = ui(o, t), i = hi(e, n), { t: s } = me(["common"]), { appearance: a } = tn();
  return /* @__PURE__ */ w(Se, { children: [
    r && /* @__PURE__ */ w(
      X,
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
          /* @__PURE__ */ c(po, { size: "3" }),
          /* @__PURE__ */ c(at, { mt: "4", children: /* @__PURE__ */ w(ae, { weight: "medium", style: { fontSize: "1.1em" }, children: [
            s("common:loading"),
            " ",
            e,
            "%"
          ] }) })
        ]
      }
    ),
    i.visible && /* @__PURE__ */ c(
      yr,
      {
        value: Math.min(i.value, 100),
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
}, fi = ({ error: o }) => {
  const { t: e } = me(["common"]);
  return /* @__PURE__ */ c(
    X,
    {
      position: "absolute",
      inset: "0",
      style: { backgroundColor: "rgba(255, 255, 255, 0.9)", zIndex: 1e3 },
      align: "center",
      justify: "center",
      direction: "column",
      p: "4",
      children: /* @__PURE__ */ w(ct.Root, { color: "red", size: "3", children: [
        /* @__PURE__ */ c(ct.Icon, { children: /* @__PURE__ */ c(Tr, {}) }),
        /* @__PURE__ */ w(ct.Text, { children: [
          /* @__PURE__ */ c(ae, { children: /* @__PURE__ */ w(br, { children: [
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
}, gi = 3e3, ko = ({ persistent: o = !1 }) => {
  const { t: e } = me(["viewer"], { useSuspense: !1 }), { pdfViewer: t, isReady: n } = je(), [r, i] = V(1), [s, a] = V(1), [l, h] = V("1"), [d, u] = V(!1), [f, p] = V(!1), [g, m] = V(!0), v = W(null), y = W({
    hovered: !1,
    inputFocused: !1
  }), T = Z(() => {
    v.current && (window.clearTimeout(v.current), v.current = null);
  }, []), S = Z(() => {
    T(), !(y.current.hovered || y.current.inputFocused) && (v.current = window.setTimeout(() => {
      v.current = null, m(!1);
    }, gi));
  }, [T]), x = Z(() => {
    m(!0), o || S();
  }, [o, S]), N = Z(() => {
    y.current.hovered = !0, T(), m(!0);
  }, [T]), F = Z(() => {
    y.current.hovered = !1, S();
  }, [S]), U = Z(() => {
    y.current.inputFocused = !0, T(), m(!0);
  }, [T]), $ = Z((b) => {
    b.currentTarget.select(), x();
  }, [x]), j = Z((b) => {
    i(b), h(b.toString());
  }, []), _ = Z(
    (b) => !isNaN(b) && b >= 1 && b <= s,
    [s]
  ), E = Z(
    (b) => {
      if (!(!t || !_(b))) {
        x(), u(!0);
        try {
          t.currentPageNumber = b, i(b), h(b.toString());
        } catch (G) {
          console.error("Error changing page:", G);
        } finally {
          u(!1);
        }
      }
    },
    [t, _, x]
  ), R = (b) => {
    x();
    const G = b.target.value;
    (G === "" || /^\d+$/.test(G)) && h(G);
  }, D = Z(() => {
    x();
    const b = parseInt(l, 10);
    _(b) ? E(b) : h(r.toString());
  }, [l, r, E, _, x]), H = Z(() => {
    x(), r > 1 && E(r - 1);
  }, [r, E, x]), Y = Z(() => {
    x(), r < s && E(r + 1);
  }, [r, s, E, x]);
  ne(() => {
    if (!t) return;
    const b = ({ pageNumber: G }) => {
      j(G), u(!1), x();
    };
    if (n) {
      const G = t.currentPageNumber || 1, B = t.pagesCount || 1;
      i(G), h(G.toString()), a(B), p(!0), x();
    }
    return t.eventBus.on("pagechanging", b), () => {
      t.eventBus.off("pagechanging", b);
    };
  }, [t, n, j, x]), ne(() => {
    o && (T(), m(!0));
  }, [T, o]), ne(() => {
    if (!t?.container) return;
    const b = t.container, G = () => {
      x();
    };
    return b.addEventListener("scroll", G, { passive: !0 }), b.addEventListener("wheel", G, { passive: !0 }), () => {
      b.removeEventListener("scroll", G), b.removeEventListener("wheel", G);
    };
  }, [t, x]), ne(() => T, [T]);
  const ee = (b) => {
    b.key === "Enter" ? D() : b.key === "Escape" && h(r.toString());
  }, J = () => {
    y.current.inputFocused = !1, D(), S();
  }, K = l === "" || _(parseInt(l, 10));
  return /* @__PURE__ */ c(
    at,
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
      onMouseEnter: N,
      onMouseLeave: F,
      children: /* @__PURE__ */ w(X, { gap: "2", align: "center", pt: "1", pl: "1", pr: "2", pb: "1", children: [
        /* @__PURE__ */ c(
          Qe,
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
            children: /* @__PURE__ */ c(go, {})
          }
        ),
        /* @__PURE__ */ w(X, { align: "center", gap: "1", pr: "2", children: [
          /* @__PURE__ */ c(
            Tt.Root,
            {
              size: "1",
              value: l,
              onChange: R,
              onFocus: U,
              onBlur: J,
              onDoubleClick: $,
              onKeyDown: ee,
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
          /* @__PURE__ */ w(
            ae,
            {
              style: {
                minWidth: 30
              },
              size: "1",
              weight: "medium",
              children: [
                "/ ",
                s
              ]
            }
          )
        ] }),
        /* @__PURE__ */ c(
          Qe,
          {
            color: "gray",
            variant: "ghost",
            disabled: r >= s || d,
            onClick: Y,
            size: "1",
            "aria-label": e("viewer:navigation.nextPage"),
            style: {
              color: `var(--inklayer-page-indicator-button-color, ${r >= s || d ? "#aaa" : "#fff"})`,
              transition: "var(--inklayer-page-indicator-button-transition, background-color 0.2s ease)",
              cursor: "pointer"
            },
            children: /* @__PURE__ */ c(mo, {})
          }
        )
      ] })
    }
  );
};
function mi(o) {
  for (const e of o.getPages()) {
    const t = z.of("Annots");
    e.node.has(t) && e.node.set(t, o.context.obj([]));
  }
}
async function Gn(o, e = !1) {
  const t = await o.getData(), n = await In.load(t);
  return e && mi(n), n.save();
}
function Eo(o) {
  const e = new ArrayBuffer(o.byteLength);
  return new Uint8Array(e).set(o), e;
}
function vi(o, e) {
  const t = new Blob([Eo(o)], { type: "application/pdf" }), n = document.createElement("a");
  n.href = URL.createObjectURL(t), n.download = e, n.click(), URL.revokeObjectURL(n.href);
}
function yi(o) {
  const e = new Blob([Eo(o)], { type: "application/pdf" }), t = URL.createObjectURL(e), n = document.createElement("iframe");
  n.style.position = "fixed", n.style.width = "0", n.style.height = "0", n.style.border = "none", n.src = t, document.body.appendChild(n), n.onload = () => {
    n.contentWindow?.focus(), n.contentWindow?.print(), setTimeout(() => {
      document.body.removeChild(n), URL.revokeObjectURL(t);
    }, 1e3);
  };
}
function Ro(o) {
  const e = Z(
    async (n) => {
      if (!o) return;
      const r = await Gn(o, !0), i = n || `file_${Date.now()}.pdf`;
      vi(r, i);
    },
    [o]
  ), t = Z(async () => {
    if (!o) return;
    const n = await Gn(o, !0);
    yi(n);
  }, [o]);
  return {
    downloadClean: e,
    printClean: t
  };
}
const bi = (o, e, t) => {
  if (e === 1) return 1;
  const n = t.current;
  (n > 1 && e < 1 || n < 1 && e > 1) && (t.current = 1);
  const r = Math.floor(o * e * t.current * 100) / (100 * o);
  return t.current = e / r, r;
};
function Si({
  pdfViewer: o,
  containerRef: e,
  minScale: t = 0.1,
  maxScale: n = 10
}) {
  const r = W(1), i = W(1), s = W(!1), a = W(null), l = Z((d, u, f) => {
    const p = e.current;
    if (!p || !o) return;
    const m = o.currentScale / d - 1;
    if (m === 0) return;
    const { left: v, top: y } = p.getBoundingClientRect();
    p.scrollLeft += (u - v) * m, p.scrollTop += (f - y) * m;
  }, [e, o]), h = Z((d, u, f, p, g) => {
    const m = bi(d, u, g);
    if (m === 1) return;
    let v = Math.round(d * m * 100) / 100;
    v = Math.min(n, Math.max(t, v)), !(!o || !o.pdfDocument) && (o.currentScale = v, l(d, f, p));
  }, [l, n, t, o]);
  ne(() => {
    const d = e.current;
    if (!d || !o) return;
    const u = (g) => {
      if (!g.ctrlKey && !g.metaKey) return;
      g.preventDefault();
      const m = Math.exp(-g.deltaY / 100), v = o.currentScale;
      h(
        v,
        m,
        g.clientX,
        g.clientY,
        r
      );
    }, f = (g) => {
      (g.key === "Control" || g.key === "Meta") && (s.current = !0);
    }, p = (g) => {
      (g.key === "Control" || g.key === "Meta") && (s.current = !1);
    };
    return d.addEventListener("wheel", u, { passive: !1 }), window.addEventListener("keydown", f), window.addEventListener("keyup", p), () => {
      d.removeEventListener("wheel", u), window.removeEventListener("keydown", f), window.removeEventListener("keyup", p);
    };
  }, [o, e, h]), ne(() => {
    const d = e.current;
    if (!d || !o) return;
    const u = (g) => {
      if (g.touches.length !== 2) {
        a.current = null;
        return;
      }
      g.preventDefault();
      let [m, v] = [g.touches[0], g.touches[1]];
      m.identifier > v.identifier && ([m, v] = [v, m]), a.current = {
        touch0X: m.pageX,
        touch0Y: m.pageY,
        touch1X: v.pageX,
        touch1Y: v.pageY
      };
    }, f = (g) => {
      const m = a.current;
      if (!m || g.touches.length !== 2) return;
      let [v, y] = [g.touches[0], g.touches[1]];
      v.identifier > y.identifier && ([v, y] = [y, v]);
      const { pageX: T, pageY: S } = v, { pageX: x, pageY: N } = y, {
        touch0X: F,
        touch0Y: U,
        touch1X: $,
        touch1Y: j
      } = m;
      if (Math.abs(F - T) <= 1 && Math.abs(U - S) <= 1 && Math.abs($ - x) <= 1 && Math.abs(j - N) <= 1)
        return;
      if (m.touch0X = T, m.touch0Y = S, m.touch1X = x, m.touch1Y = N, F === T && U === S) {
        const Y = $ - T, ee = j - S, J = x - T, K = N - S, b = Y * K - ee * J;
        if (Math.abs(b) > 0.02 * Math.hypot(Y, ee) * Math.hypot(J, K))
          return;
      } else if ($ === x && j === N) {
        const Y = F - x, ee = U - N, J = T - x, K = S - N, b = Y * K - ee * J;
        if (Math.abs(b) > 0.02 * Math.hypot(Y, ee) * Math.hypot(J, K))
          return;
      } else {
        const Y = T - F, ee = x - $, J = S - U, K = N - j;
        if (Y * ee + J * K >= 0) return;
      }
      g.preventDefault();
      const _ = Math.hypot(T - x, S - N) || 1, E = Math.hypot(F - $, U - j) || 1, R = o.currentScale, D = (v.clientX + y.clientX) / 2, H = (v.clientY + y.clientY) / 2;
      h(
        R,
        _ / E,
        D,
        H,
        i
      );
    }, p = (g) => {
      a.current && (g.preventDefault(), a.current = null, i.current = 1);
    };
    return d.addEventListener("touchstart", u, {
      passive: !1
    }), d.addEventListener("touchmove", f, {
      passive: !1
    }), d.addEventListener("touchend", p, {
      passive: !1
    }), d.addEventListener("touchcancel", p), () => {
      d.removeEventListener("touchstart", u), d.removeEventListener("touchmove", f), d.removeEventListener("touchend", p), d.removeEventListener("touchcancel", p);
    };
  }, [o, e, h]);
}
const wi = "_thumbnailList_vmgds_1", Ci = "_thumbnail_vmgds_1", Ai = "_thumbnailCanvasWrapper_vmgds_19", Ti = "_thumbnailCanvas_vmgds_19", xi = "_thumbnailPlaceholder_vmgds_51", ki = "_thumbnailError_vmgds_58", Ei = "_thumbnailPageNumber_vmgds_71", Ri = "_thumbnailMarker_vmgds_93", ut = {
  thumbnailList: wi,
  thumbnail: Ci,
  thumbnailCanvasWrapper: Ai,
  "thumbnail--selected": "_thumbnail--selected_vmgds_27",
  thumbnailCanvas: Ti,
  thumbnailPlaceholder: xi,
  thumbnailError: ki,
  thumbnailPageNumber: Ei,
  thumbnailMarker: Ri
}, Pi = 132, Ni = "320px 0px", Po = ho(({
  pdfDocument: o,
  pageNumber: e,
  selected: t,
  markerCount: n,
  onSelect: r,
  onLayoutChange: i,
  registerElement: s
}) => {
  const { t: a } = me(["viewer"], { useSuspense: !1 }), l = W(null), h = W(null), d = W(null), [u, f] = V(!1), [p, g] = V(!1), [m, v] = V(!1), y = n > 0 ? a("viewer:navigation.pageWithMarkers", {
    value: e,
    count: n
  }) : a("viewer:navigation.page", { value: e }), T = Z((S) => {
    l.current = S, s(e, S);
  }, [e, s]);
  return ne(() => {
    const S = l.current;
    if (!S || u) return;
    if (typeof IntersectionObserver > "u") {
      f(!0);
      return;
    }
    const x = new IntersectionObserver(
      ([N]) => {
        N.isIntersecting && (f(!0), x.disconnect());
      },
      { rootMargin: Ni }
    );
    return x.observe(S), () => x.disconnect();
  }, [u]), ne(() => {
    if (!u) return;
    let S = !1;
    return (async () => {
      let N = null;
      try {
        g(!1), v(!1);
        const F = await o.getPage(e);
        if (S) return;
        const U = h.current, $ = U?.getContext("2d");
        if (!U || !$) return;
        const j = F.getViewport({ scale: 1 }), _ = F.getViewport({ scale: Pi / j.width }), E = Math.min(window.devicePixelRatio || 1, 2);
        U.width = Math.floor(_.width * E), U.height = Math.floor(_.height * E), U.style.width = `${Math.floor(_.width)}px`, U.style.height = `${Math.floor(_.height)}px`, i(), N = F.render({
          canvasContext: $,
          viewport: _,
          transform: E === 1 ? void 0 : [E, 0, 0, E, 0, 0]
        }), d.current = N, await N.promise, S || g(!0);
      } catch (F) {
        !S && F.name !== "RenderingCancelledException" && v(!0);
      } finally {
        d.current === N && (d.current = null);
      }
    })(), () => {
      S = !0, d.current?.cancel(), d.current = null;
    };
  }, [i, o, e, u]), /* @__PURE__ */ c(
    "button",
    {
      ref: T,
      type: "button",
      className: [
        ut.thumbnail,
        t ? ut["thumbnail--selected"] : ""
      ].join(" "),
      "aria-current": t ? "page" : void 0,
      "aria-label": y,
      onClick: () => r(e),
      children: /* @__PURE__ */ w("span", { className: ut.thumbnailCanvasWrapper, children: [
        /* @__PURE__ */ c("canvas", { ref: h, className: ut.thumbnailCanvas }),
        !p && !m && /* @__PURE__ */ c("span", { className: ut.thumbnailPlaceholder }),
        m && /* @__PURE__ */ c("span", { className: ut.thumbnailError, children: a("viewer:navigation.thumbnailError") }),
        n > 0 && /* @__PURE__ */ c("span", { className: ut.thumbnailMarker, "aria-hidden": "true", children: n > 99 ? "99+" : n }),
        /* @__PURE__ */ c("span", { className: ut.thumbnailPageNumber, children: e })
      ] })
    }
  );
});
Po.displayName = "PdfThumbnail";
const Ii = ({ pageMarkerCounts: o }) => {
  const { pdfDocument: e, pdfViewer: t, eventBus: n } = je(), [r, i] = V(() => t?.currentPageNumber || 1), s = W(r), a = W(/* @__PURE__ */ new Map()), l = W(null), h = W(!0), d = Z((m, v) => {
    v ? a.current.set(m, v) : a.current.delete(m);
  }, []), u = Z(() => {
    l.current !== null && (window.cancelAnimationFrame(l.current), l.current = null);
  }, []), f = Z(() => {
    h.current && (u(), l.current = window.requestAnimationFrame(() => {
      l.current = null, a.current.get(s.current)?.scrollIntoView({
        block: "nearest"
      });
    }));
  }, [u]), p = Z(() => {
    h.current = !1, u();
  }, [u]), g = Z((m) => {
    t && (h.current = !0, s.current = m, i(m), t.currentPageNumber = m);
  }, [t]);
  return ne(() => {
    if (!t || !n) return;
    const m = t.currentPageNumber || 1;
    h.current = !0, s.current = m, i(m);
    const v = ({ pageNumber: y }) => {
      h.current = !0, s.current = y, i(y);
    };
    return n.on("pagechanging", v), () => n.off("pagechanging", v);
  }, [n, t]), ne(() => {
    h.current = !0, s.current = r, f();
  }, [r, f, e]), ne(() => u, [u]), e ? /* @__PURE__ */ c(
    "div",
    {
      className: ut.thumbnailList,
      onPointerDown: p,
      onTouchStart: p,
      onWheel: p,
      children: Array.from({ length: e.numPages }, (m, v) => {
        const y = v + 1;
        return /* @__PURE__ */ c(
          Po,
          {
            pdfDocument: e,
            pageNumber: y,
            selected: y === r,
            markerCount: o.get(y) ?? 0,
            onSelect: g,
            onLayoutChange: f,
            registerElement: d
          },
          y
        );
      })
    }
  ) : null;
}, Mi = "_outline_fpevi_1", Di = "_outlineTree_fpevi_5", Li = "_outlineItem_fpevi_11", _i = "_outlineRow_fpevi_16", Oi = "_outlineTitle_fpevi_26", Hi = "_outlineToggle_fpevi_33", Gi = "_outlineToggleSpacer_fpevi_60", Ui = "_outlineChevron_fpevi_64", zi = "_outlineState_fpevi_100", Ue = {
  outline: Mi,
  outlineTree: Di,
  outlineItem: Li,
  outlineRow: _i,
  "outlineRow--selected": "_outlineRow--selected_fpevi_26",
  outlineTitle: Oi,
  outlineToggle: Hi,
  outlineToggleSpacer: Gi,
  outlineChevron: Ui,
  "outlineChevron--expanded": "_outlineChevron--expanded_fpevi_73",
  outlineState: zi
}, Fi = (o) => {
  if (!o || typeof o != "object") return !1;
  const e = o;
  return Number.isInteger(e.num) && Number.isInteger(e.gen);
}, Dn = ho(({
  depth: o,
  item: e,
  itemKey: t,
  selectedItemKey: n,
  onNavigate: r
}) => {
  const { t: i } = me(["viewer"], { useSuspense: !1 }), s = e.items.length > 0, [a, l] = V(() => e.count === void 0 || e.count >= 0), h = e.title.trim() || i("viewer:navigation.untitledOutlineItem"), d = e.dest !== null, u = n === t, f = () => {
    d ? r(e, t) : s && l((p) => !p);
  };
  return /* @__PURE__ */ w(
    "li",
    {
      role: "treeitem",
      "aria-expanded": s ? a : void 0,
      className: Ue.outlineItem,
      children: [
        /* @__PURE__ */ w(
          "div",
          {
            className: [
              Ue.outlineRow,
              u ? Ue["outlineRow--selected"] : ""
            ].join(" "),
            style: { paddingLeft: `${8 + Math.min(o, 8) * 12}px` },
            children: [
              s ? /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: Ue.outlineToggle,
                  "aria-label": i(a ? "viewer:navigation.collapseOutlineItem" : "viewer:navigation.expandOutlineItem", { title: h }),
                  "aria-controls": `${t}-children`,
                  "aria-expanded": a,
                  onClick: () => l((p) => !p),
                  children: /* @__PURE__ */ c(
                    "span",
                    {
                      className: [
                        Ue.outlineChevron,
                        a ? Ue["outlineChevron--expanded"] : ""
                      ].join(" ")
                    }
                  )
                }
              ) : /* @__PURE__ */ c("span", { className: Ue.outlineToggleSpacer }),
              e.url ? /* @__PURE__ */ c(
                "a",
                {
                  className: Ue.outlineTitle,
                  href: e.url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  style: {
                    fontStyle: e.italic ? "italic" : void 0,
                    fontWeight: e.bold ? 600 : void 0
                  },
                  onClick: () => r(e, t),
                  children: h
                }
              ) : /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: Ue.outlineTitle,
                  disabled: !d && !s,
                  "aria-current": u ? "location" : void 0,
                  style: {
                    fontStyle: e.italic ? "italic" : void 0,
                    fontWeight: e.bold ? 600 : void 0
                  },
                  onClick: f,
                  children: h
                }
              )
            ]
          }
        ),
        s && a && /* @__PURE__ */ c("ul", { id: `${t}-children`, role: "group", className: Ue.outlineTree, children: e.items.map((p, g) => /* @__PURE__ */ c(
          Dn,
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
Dn.displayName = "OutlineItem";
const ji = ({ onNavigate: o }) => {
  const { t: e } = me(["viewer"], { useSuspense: !1 }), { pdfDocument: t, pdfViewer: n } = je(), r = W(0), [i, s] = V(null), [a, l] = V({
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
    return r.current += 1, s(null), l({ document: t, status: "loading", items: [] }), t.getOutline().then(
      (u) => {
        d || l({
          document: t,
          status: "ready",
          items: u ?? []
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
  const h = Z(async (d, u) => {
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
        let m = null;
        if (Fi(g) ? (m = t.cachedPageNumber(g), m || (m = await t.getPageIndex(g) + 1)) : Number.isInteger(g) && (m = g + 1), r.current !== f || n.pdfDocument !== t || !m || m < 1 || m > t.numPages)
          return;
        n.scrollPageIntoView({
          pageNumber: m,
          destArray: p
        }), s(u), o?.();
      } catch {
      }
  }, [o, t, n]);
  return !t || a.document !== t || a.status === "loading" ? /* @__PURE__ */ c("div", { className: Ue.outlineState, children: e("viewer:navigation.outlineLoading") }) : a.status === "error" ? /* @__PURE__ */ c("div", { className: Ue.outlineState, children: e("viewer:navigation.outlineError") }) : a.items.length === 0 ? /* @__PURE__ */ c("div", { className: Ue.outlineState, children: e("viewer:navigation.outlineEmpty") }) : /* @__PURE__ */ c("nav", { className: Ue.outline, "aria-label": e("viewer:navigation.outline"), children: /* @__PURE__ */ c("ul", { role: "tree", className: Ue.outlineTree, children: a.items.map((d, u) => /* @__PURE__ */ c(
    Dn,
    {
      itemKey: `outline-${u}`,
      item: d,
      depth: 0,
      selectedItemKey: i,
      onNavigate: h
    },
    `outline-${u}`
  )) }) });
}, Yt = "inklayer:navigation-page-markers-changed", Wi = "_navigationSidebar_13vi9_1", $i = "_navigationSidebarContainer_13vi9_19", Bi = "_navigationTabs_13vi9_29", Vi = "_navigationTabsList_13vi9_36", Yi = "_navigationTabsTrigger_13vi9_47", Ki = "_navigationTabsContent_13vi9_56", Xi = "_navigationSidebarOverlay_13vi9_63", ot = {
  navigationSidebar: Wi,
  "navigationSidebar--hidden": "_navigationSidebar--hidden_13vi9_14",
  navigationSidebarContainer: $i,
  navigationTabs: Bi,
  navigationTabsList: Vi,
  navigationTabsTrigger: Yi,
  navigationTabsContent: Ki,
  navigationSidebarOverlay: Xi
}, qi = ({
  open: o,
  onClose: e,
  onTransitionEnd: t
}) => {
  const { t: n } = me(["viewer"], { useSuspense: !1 }), { eventBus: r } = je(), [i, s] = V("thumbnails"), [a, l] = V(() => /* @__PURE__ */ new Map()), h = Z((f) => {
    (f === "thumbnails" || f === "outline") && s(f);
  }, []);
  ne(() => {
    if (l(/* @__PURE__ */ new Map()), !r) return;
    const f = ({
      source: p,
      markers: g
    }) => {
      l((m) => {
        const v = new Map(m);
        return g.size > 0 ? v.set(p, g) : v.delete(p), v;
      });
    };
    return r.on(Yt, f), () => {
      r.off(Yt, f);
    };
  }, [r]), ne(() => {
    if (!o) return;
    const f = (p) => {
      p.key === "Escape" && e();
    };
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, [e, o]);
  const d = Ae(() => {
    const f = /* @__PURE__ */ new Map();
    return a.forEach((p) => {
      p.forEach((g, m) => {
        f.set(m, (f.get(m) ?? 0) + g);
      });
    }), f;
  }, [a]), u = Z(() => {
    window.matchMedia("(max-width: 840px)").matches && e();
  }, [e]);
  return /* @__PURE__ */ w(Se, { children: [
    /* @__PURE__ */ c(
      "aside",
      {
        id: "InkLayer-navigation-sidebar",
        className: [
          ot.navigationSidebar,
          o ? "" : ot["navigationSidebar--hidden"]
        ].join(" "),
        "aria-label": n("viewer:navigation.label"),
        "aria-hidden": !o,
        onTransitionEnd: t,
        children: /* @__PURE__ */ c("div", { className: ot.navigationSidebarContainer, hidden: !o, children: /* @__PURE__ */ w(
          At.Root,
          {
            value: i,
            onValueChange: h,
            className: ot.navigationTabs,
            children: [
              /* @__PURE__ */ w(At.List, { className: ot.navigationTabsList, children: [
                /* @__PURE__ */ c(
                  At.Trigger,
                  {
                    value: "thumbnails",
                    className: ot.navigationTabsTrigger,
                    children: /* @__PURE__ */ c("span", { children: n("viewer:navigation.thumbnails") })
                  }
                ),
                /* @__PURE__ */ c(
                  At.Trigger,
                  {
                    value: "outline",
                    className: ot.navigationTabsTrigger,
                    children: /* @__PURE__ */ c("span", { children: n("viewer:navigation.outline") })
                  }
                )
              ] }),
              /* @__PURE__ */ c(
                At.Content,
                {
                  value: "thumbnails",
                  className: ot.navigationTabsContent,
                  children: /* @__PURE__ */ c(Ii, { pageMarkerCounts: d })
                }
              ),
              /* @__PURE__ */ c(
                At.Content,
                {
                  value: "outline",
                  className: ot.navigationTabsContent,
                  children: /* @__PURE__ */ c(ji, { onNavigate: u })
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
        className: ot.navigationSidebarOverlay,
        onClick: e
      }
    )
  ] });
}, Ji = /* @__PURE__ */ new Set(["auto", "page-fit", "page-width"]), No = ({
  children: o,
  toolbar: e,
  sidebar: t,
  defaultActiveSidebarKey: n,
  title: r,
  actions: i,
  style: s = { width: "100vw", height: "100vh" },
  initialScale: a = "auto",
  user: l,
  hideHeader: h = !1,
  hidePageIndicator: d = !1,
  ...u
}) => {
  const { t: f } = me(["viewer"], { useSuspense: !1 }), p = W(null), { loading: g, progress: m, pdfDocument: v, pdfViewer: y, eventBus: T, loadError: S } = ti(p, u), [x, N] = V(!1), F = Z(() => {
    N((L) => !L);
  }, []), [U, $] = V(() => n || null), j = U === null;
  ne(() => {
    if (!y || !T) return;
    const L = () => {
      y.currentScaleValue = a;
    };
    return T.on("pagesloaded", L), () => {
      T.off("pagesloaded", L);
    };
  }, [y, T, a]);
  const _ = Z(() => {
    $((L) => L ? null : t?.[0]?.key ?? null);
  }, [t]), E = Z((L) => {
    $(L);
  }, []), R = Z(() => {
    $(null);
  }, []), D = Z(() => {
    if (!y) return;
    const L = y.currentScaleValue;
    Ji.has(L) && (y.currentScaleValue = L, y.update());
  }, [y]), H = Z(
    (L) => {
      L.target !== L.currentTarget || L.propertyName !== "width" || D();
    },
    [D]
  ), Y = !!(y && T && p.current && !g), { printClean: ee, downloadClean: J } = Ro(v);
  Si({
    pdfViewer: y ?? null,
    containerRef: p,
    minScale: 0.1,
    maxScale: 10
  });
  const K = Ae(
    () => ({
      pdfDocument: v,
      pdfViewer: y,
      eventBus: T,
      viewerContainerRef: p,
      isReady: Y,
      activeSidebarPanel: U,
      isNavigationSidebarOpen: x,
      toggleNavigationSidebar: F,
      toggleSidebar: _,
      openSidebar: E,
      closeSidebar: R,
      isSidebarCollapsed: j,
      print: ee,
      download: J
    }),
    [
      v,
      y,
      T,
      Y,
      _,
      j,
      E,
      R,
      U,
      x,
      F,
      ee,
      J
    ]
  ), b = Ae(
    () => ({
      user: l || null
    }),
    [l]
  );
  ne(() => {
    if (!y || !T)
      return;
    const L = () => {
      const q = y.currentScaleValue;
      (q === "auto" || q === "page-fit" || q === "page-width") && (y.currentScaleValue = q), y.update();
    };
    return window.addEventListener("resize", L), L(), () => {
      window.removeEventListener("resize", L);
    };
  }, [y, T]);
  const G = t && /* @__PURE__ */ c(X, { gap: "2", children: t.map((L) => /* @__PURE__ */ c(xt, { content: L.title, children: /* @__PURE__ */ c(
    ve,
    {
      variant: U === L.key ? "soft" : "outline",
      size: "2",
      color: "gray",
      highContrast: !0,
      style: {
        boxShadow: "none"
      },
      onClick: () => $((q) => q === L.key ? null : L.key),
      children: L.icon
    }
  ) }, L.key)) }), B = Ae(() => !t || !U ? null : t.find((L) => L.key === U) || null, [t, U]);
  return ne(() => {
    if (!t || !U) return;
    t.some((q) => q.key === U) || $(null);
  }, [t, U]), /* @__PURE__ */ c(Mn.Provider, { value: b, children: /* @__PURE__ */ c(To.Provider, { value: K, children: /* @__PURE__ */ w(X, { id: "InkLayer", className: Ne.InkLayerViewer, style: s, direction: "column", width: "100%", position: "relative", children: [
    /* @__PURE__ */ c(pi, { progress: m, loading: g }),
    S && /* @__PURE__ */ c(fi, { error: S }),
    !h && /* @__PURE__ */ c(X, { pl: "2", pr: "2", className: Ne.viewerHeader, children: /* @__PURE__ */ w("div", { className: Ne["viewerHeader-title"], children: [
      /* @__PURE__ */ w(X, { align: "center", gap: "2", className: Ne["viewerHeader-title-left"], children: [
        /* @__PURE__ */ c(xt, { content: f("viewer:navigation.toggle"), children: /* @__PURE__ */ c(
          ve,
          {
            variant: "outline",
            size: "2",
            color: "gray",
            highContrast: !0,
            style: { boxShadow: "none" },
            "aria-controls": "InkLayer-navigation-sidebar",
            "aria-expanded": x,
            "aria-label": f("viewer:navigation.toggle"),
            onClick: () => N((L) => !L),
            children: x ? /* @__PURE__ */ c(Vr, { className: Ne.navigationSidebarTriggerIcon }) : /* @__PURE__ */ c(Yr, { className: Ne.navigationSidebarTriggerIcon })
          }
        ) }),
        /* @__PURE__ */ c("div", { className: Ne["viewerHeader-title-name"], children: r || "PDF Viewer" })
      ] }),
      /* @__PURE__ */ c("div", { className: Ne["viewerHeader-title-actions"], children: /* @__PURE__ */ w(X, { direction: "row", gap: "3", justify: "between", align: "center", children: [
        G,
        i
      ] }) })
    ] }) }),
    /* @__PURE__ */ w(X, { flexGrow: "1", minHeight: "0", className: Ne.viewerBody, children: [
      /* @__PURE__ */ c(
        qi,
        {
          open: x,
          onClose: () => N(!1),
          onTransitionEnd: H
        }
      ),
      /* @__PURE__ */ w(X, { flexGrow: "1", minHeight: "0", className: Ne.viewerWrapper, children: [
        /* @__PURE__ */ w(X, { className: Ne.viewerContainer, direction: "column", flexGrow: "1", children: [
          e && /* @__PURE__ */ c(X, { align: "center", justify: "center", className: Ne["viewerContainer-header"], children: e }),
          /* @__PURE__ */ w(at, { position: "relative", flexGrow: "1", className: Ne["viewerContainer-content"], children: [
            !d && /* @__PURE__ */ c(ko, {}),
            /* @__PURE__ */ c("div", { ref: p, className: Ne.pdfjsViewerContainer, children: /* @__PURE__ */ c("div", { className: "pdfViewer" }) })
          ] })
        ] }),
        /* @__PURE__ */ c(
          at,
          {
            id: "InkLayer-viewer-sidebar",
            className: [
              Ne.viewerSidebar,
              B ? "" : Ne["viewerSidebar--hidden"]
            ].join(" "),
            pl: "1",
            pr: "1",
            onTransitionEnd: H,
            children: B && /* @__PURE__ */ c("div", { className: Ne["viewerSidebar-container"], children: B.render(K) })
          }
        ),
        B && /* @__PURE__ */ c(
          "div",
          {
            className: Ne.sidebarOverlay,
            onClick: () => $(null)
          }
        )
      ] })
    ] }),
    o
  ] }) }) });
}, Pe = ({ children: o, style: e, ...t }) => /* @__PURE__ */ c("svg", { ...t, style: { width: "1em", height: "1em", ...e }, children: o }), Zi = ({ style: o }) => /* @__PURE__ */ c(Pe, { viewBox: "0 0 320 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M0 55.2V426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320H297.9c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"
  }
) }), Io = ({ style: o }) => /* @__PURE__ */ c(Pe, { fill: "currentColor", viewBox: "0 0 576 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M315 315l158.4-215L444.1 70.6 229 229 315 315zm-187 5l0 0V248.3c0-15.3 7.2-29.6 19.5-38.6L420.6 8.4C428 2.9 437 0 446.2 0c11.4 0 22.4 4.5 30.5 12.6l54.8 54.8c8.1 8.1 12.6 19 12.6 30.5c0 9.2-2.9 18.2-8.4 25.6L334.4 396.5c-9 12.3-23.4 19.5-38.6 19.5H224l-25.4 25.4c-12.5 12.5-32.8 12.5-45.3 0l-50.7-50.7c-12.5-12.5-12.5-32.8 0-45.3L128 320zM7 466.3l63-63 70.6 70.6-31 31c-4.5 4.5-10.6 7-17 7H24c-13.3 0-24-10.7-24-24v-4.7c0-6.4 2.5-12.5 7-17z"
  }
) }), Mo = ({ style: o }) => /* @__PURE__ */ c(Pe, { fill: "currentColor", viewBox: "0 0 512 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M161.3 144c3.2-17.2 14-30.1 33.7-38.6c21.1-9 51.8-12.3 88.6-6.5c11.9 1.9 48.8 9.1 60.1 12c17.1 4.5 34.6-5.6 39.2-22.7s-5.6-34.6-22.7-39.2c-14.3-3.8-53.6-11.4-66.6-13.4c-44.7-7-88.3-4.2-123.7 10.9c-36.5 15.6-64.4 44.8-71.8 87.3c-.1 .6-.2 1.1-.2 1.7c-2.8 23.9 .5 45.6 10.1 64.6c4.5 9 10.2 16.9 16.7 23.9H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H270.1c-.1 0-.3-.1-.4-.1l-1.1-.3c-36-10.8-65.2-19.6-85.2-33.1c-9.3-6.3-15-12.6-18.2-19.1c-3.1-6.1-5.2-14.6-3.8-27.4zM348.9 337.2c2.7 6.5 4.4 15.8 1.9 30.1c-3 17.6-13.8 30.8-33.9 39.4c-21.1 9-51.7 12.3-88.5 6.5c-18-2.9-49.1-13.5-74.4-22.1c-5.6-1.9-11-3.7-15.9-5.4c-16.8-5.6-34.9 3.5-40.5 20.3s3.5 34.9 20.3 40.5c3.6 1.2 7.9 2.7 12.7 4.3l0 0 0 0c24.9 8.5 63.6 21.7 87.6 25.6l0 0 .2 0c44.7 7 88.3 4.2 123.7-10.9c36.5-15.6 64.4-44.8 71.8-87.3c3.6-21 2.7-40.4-3.1-58.1H335.1c7 5.6 11.4 11.2 13.9 17.2z"
  }
) }), Do = ({ style: o }) => /* @__PURE__ */ c(Pe, { fill: "currentColor", viewBox: "0 0 448 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M16 64c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H128V224c0 53 43 96 96 96s96-43 96-96V96H304c-17.7 0-32-14.3-32-32s14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H384V224c0 88.4-71.6 160-160 160s-160-71.6-160-160V96H48C30.3 96 16 81.7 16 64zM0 448c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32z"
  }
) }), Qi = ({ style: o }) => /* @__PURE__ */ c(Pe, { fill: "currentColor", viewBox: "0 0 384 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M32 32C14.3 32 0 46.3 0 64S14.3 96 32 96H160V448c0 17.7 14.3 32 32 32s32-14.3 32-32V96H352c17.7 0 32-14.3 32-32s-14.3-32-32-32H192 32z"
  }
) }), es = ({ style: o }) => /* @__PURE__ */ c(Pe, { fill: "currentColor", viewBox: "0 0 512 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M384 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H384zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"
  }
) }), ts = ({ style: o }) => /* @__PURE__ */ c(Pe, { fill: "currentColor", viewBox: "0 0 512 512", style: o, children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" }) }), ns = ({ style: o }) => /* @__PURE__ */ c(Pe, { fill: "currentColor", viewBox: "0 0 512 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
  }
) }), os = ({ style: o }) => /* @__PURE__ */ c(Pe, { fill: "currentColor", viewBox: "0 0 576 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M315 315l158.4-215L444.1 70.6 229 229 315 315zm-187 5l0 0V248.3c0-15.3 7.2-29.6 19.5-38.6L420.6 8.4C428 2.9 437 0 446.2 0c11.4 0 22.4 4.5 30.5 12.6l54.8 54.8c8.1 8.1 12.6 19 12.6 30.5c0 9.2-2.9 18.2-8.4 25.6L334.4 396.5c-9 12.3-23.4 19.5-38.6 19.5H224l-25.4 25.4c-12.5 12.5-32.8 12.5-45.3 0l-50.7-50.7c-12.5-12.5-12.5-32.8 0-45.3L128 320zM7 466.3l63-63 70.6 70.6-31 31c-4.5 4.5-10.6 7-17 7H24c-13.3 0-24-10.7-24-24v-4.7c0-6.4 2.5-12.5 7-17z"
  }
) }), rs = ({ style: o }) => /* @__PURE__ */ c(Pe, { fill: "currentColor", viewBox: "0 0 640 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M192 128c0-17.7 14.3-32 32-32s32 14.3 32 32v7.8c0 27.7-2.4 55.3-7.1 82.5l-84.4 25.3c-40.6 12.2-68.4 49.6-68.4 92v71.9c0 40 32.5 72.5 72.5 72.5c26 0 50-13.9 62.9-36.5l13.9-24.3c26.8-47 46.5-97.7 58.4-150.5l94.4-28.3-12.5 37.5c-3.3 9.8-1.6 20.5 4.4 28.8s15.7 13.3 26 13.3H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H460.4l18-53.9c3.8-11.3 .9-23.8-7.4-32.4s-20.7-11.8-32.2-8.4L316.4 198.1c2.4-20.7 3.6-41.4 3.6-62.3V128c0-53-43-96-96-96s-96 43-96 96v32c0 17.7 14.3 32 32 32s32-14.3 32-32V128zm-9.2 177l49-14.7c-10.4 33.8-24.5 66.4-42.1 97.2l-13.9 24.3c-1.5 2.6-4.3 4.3-7.4 4.3c-4.7 0-8.5-3.8-8.5-8.5V335.6c0-14.1 9.3-26.6 22.8-30.7zM24 368c-13.3 0-24 10.7-24 24s10.7 24 24 24H64.3c-.2-2.8-.3-5.6-.3-8.5V368H24zm592 48c13.3 0 24-10.7 24-24s-10.7-24-24-24H305.9c-6.7 16.3-14.2 32.3-22.3 48H616z"
  }
) }), is = ({ style: o }) => /* @__PURE__ */ c(Pe, { fill: "currentColor", viewBox: "0 0 512 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M312 201.8c0-17.4 9.2-33.2 19.9-47C344.5 138.5 352 118.1 352 96c0-53-43-96-96-96s-96 43-96 96c0 22.1 7.5 42.5 20.1 58.8c10.7 13.8 19.9 29.6 19.9 47c0 29.9-24.3 54.2-54.2 54.2H112C50.1 256 0 306.1 0 368c0 20.9 13.4 38.7 32 45.3V464c0 26.5 21.5 48 48 48H432c26.5 0 48-21.5 48-48V413.3c18.6-6.6 32-24.4 32-45.3c0-61.9-50.1-112-112-112H366.2c-29.9 0-54.2-24.3-54.2-54.2zM416 416v32H96V416H416z"
  }
) }), ss = ({ style: o }) => /* @__PURE__ */ w(Pe, { viewBox: "0 0 1024 1024", style: o, children: [
  /* @__PURE__ */ c("path", { d: "M96 837.68888888h832v160H96z", fill: "var(--palette-preview-color, currentColor)" }),
  /* @__PURE__ */ c("path", { d: "M429.30646525 163.315053m54.92260742 54.92260743l164.76782227 164.76782227q54.92260742 54.92260742 0 109.84521486l-164.76782227 164.76782228q-54.92260742 54.92260742-109.84521486 0l-164.76782228-164.76782228q-54.92260742-54.92260742 0-109.84521486l164.76782228-164.76782227q54.92260742-54.92260742 109.84521486 0Z", fill: "var(--palette-preview-color, currentColor)" }),
  /* @__PURE__ */ c("path", { d: "M364.65047577 163.33699097L262.12304466 60.85098508 320.69831237 2.23429214l153.14905568 153.10763046c2.94119095 2.27838736 5.79953147 4.76390083 8.5335963 7.45654045l234.34249608 234.34249608a82.85044939 82.85044939 0 0 1 0 117.15053543l-234.34249608 234.34249607a82.85044939 82.85044939 0 0 1-117.19196065 0L130.88793283 514.29149456a82.85044939 82.85044939 0 0 1 0-117.15053543l233.76254294-233.80396816z m220.2579197 219.13943862l-0.57995316 0.53852791-161.0612736-161.0612736-226.72025474 226.67882952h454.51756532L584.90839547 382.47642959zM822.68918518 783.3069037a103.56306173 103.56306173 0 0 1-103.56306171-103.56306173c0-57.16681008 87.61435022-161.39267539 103.56306171-161.3926754 15.9487115 0 103.56306173 104.1844401 103.56306173 161.3926754a103.56306173 103.56306173 0 0 1-103.56306173 103.56306173z", fill: "currentColor" })
] }), as = ({ style: o }) => /* @__PURE__ */ w(
  Pe,
  {
    viewBox: "0 0 1024 1024",
    style: o,
    children: [
      /* @__PURE__ */ c("path", { fill: "currentColor", stroke: "currentColor", strokeWidth: "16", strokeLinejoin: "round", d: "M542.04 141.43c-68.07-39.3-151.95-39.3-220.03 0-68.07 39.31-110.01 111.95-110 190.56C212.02 453.5 310.52 552 432.03 552s220.01-98.5 220.02-220.01c0.01-78.61-41.93-151.25-110.01-190.56zM432.03 472c-77.33 0-140.01-62.69-140.01-140.01s62.68-140.02 140.01-140.02c77.33 0 140.02 62.69 140.02 140.02S509.36 472 432.03 472zM325.06 612.02h186.98c22.09 0 40 17.91 40 40s-17.91 40-40 40H332.02c-58.73 0-79.21 0.4-94.81 5.2a120.03 120.03 0 0 0-80.01 80c-4.79 15.6-5.2 36.09-5.2 94.82 0 14.29-7.62 27.5-19.99 34.65a40.044 40.044 0 0 1-40.01 0 40.013 40.013 0 0 1-20-34.65v-6.97c0-49.08 0-82.61 8.6-111.09C99.99 690.04 150.03 640 213.98 620.62c28.48-8.65 62-8.65 111.08-8.6z" }),
      /* @__PURE__ */ c("path", { fill: "currentColor", stroke: "currentColor", strokeWidth: "24", strokeLinecap: "round", strokeLinejoin: "round", d: "M720.72 551.99c4.72 0 9.24 1.87 12.58 5.21 3.34 3.33 5.21 7.86 5.21 12.58v71.16h106.74v-71.16c0-6.36 3.39-12.23 8.9-15.41a17.78 17.78 0 0 1 17.79 0c5.5 3.18 8.89 9.05 8.89 15.41v71.16h53.37c6.36 0 12.23 3.39 15.41 8.89a17.78 17.78 0 0 1 0 17.79c-3.18 5.5-9.05 8.89-15.41 8.89h-53.37v106.74h53.37c6.36 0 12.23 3.39 15.41 8.9a17.78 17.78 0 0 1 0 17.79c-3.18 5.5-9.05 8.9-15.41 8.89h-53.37v71.16c0 6.36-3.39 12.23-8.89 15.41a17.78 17.78 0 0 1-17.79 0c-5.51-3.18-8.9-9.05-8.9-15.41v-71.16H738.51v71.16c0 6.36-3.39 12.23-8.9 15.41a17.78 17.78 0 0 1-17.79 0c-5.51-3.18-8.9-9.05-8.89-15.41v-71.16h-53.37c-6.36 0-12.23-3.39-15.41-8.89a17.78 17.78 0 0 1 0-17.79c3.18-5.51 9.05-8.9 15.41-8.9h53.37V676.53h-53.37c-9.82 0-17.79-7.96-17.79-17.79 0-9.82 7.96-17.79 17.79-17.79h53.37v-71.16c0-9.83 7.96-17.8 17.79-17.8z m17.79 124.54v106.74h106.74V676.53H738.51z m0 0" })
    ]
  }
), cs = ({ style: o }) => /* @__PURE__ */ c(Pe, { viewBox: "0 0 1024 1024", style: o, children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M766.4 744.3c43.7 0 79.4-36.2 79.4-80.5 0-53.5-79.4-140.8-79.4-140.8S687 610.3 687 663.8c0 44.3 35.7 80.5 79.4 80.5zm-377.1-44.1c7.1 7.1 18.6 7.1 25.6 0l256.1-256c7.1-7.1 7.1-18.6 0-25.6l-256-256c-.6-.6-1.3-1.2-2-1.7l-78.2-78.2a9.11 9.11 0 00-12.8 0l-48 48a9.11 9.11 0 000 12.8l67.2 67.2-207.8 207.9c-7.1 7.1-7.1 18.6 0 25.6l255.9 256zm12.9-448.6l178.9 178.9H223.4l178.8-178.9zM904 816H120c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8z" }) }), ls = ({ style: o }) => /* @__PURE__ */ w(Pe, { viewBox: "0 0 1024 1024", style: o, children: [
  /* @__PURE__ */ c("path", { d: "M66.782609 772.541217h196.051478a58.835478 58.835478 0 0 1 58.768696 58.768696v117.359304l235.78713-165.442782c9.928348-6.989913 21.615304-10.685217 33.747478-10.685218H957.217391V89.043478H66.782609v683.475479zM313.61113 1022.886957a58.768696 58.768696 0 0 1-58.768695-58.768696v-124.794435H58.724174A58.813217 58.813217 0 0 1 0 780.55513V81.029565A58.835478 58.835478 0 0 1 58.768696 22.26087h906.462608A58.835478 58.835478 0 0 1 1024 81.029565v699.503305a58.835478 58.835478 0 0 1-58.768696 58.768695H593.697391L347.336348 1012.201739c-10.106435 7.101217-21.904696 10.685217-33.725218 10.685218z", fill: "currentColor" }),
  /* @__PURE__ */ c("path", { d: "M761.878261 326.032696h-499.756522a33.391304 33.391304 0 0 1 0-66.782609h499.756522a33.391304 33.391304 0 1 1 0 66.782609M761.878261 567.652174h-499.756522a33.391304 33.391304 0 0 1 0-66.782609h499.756522a33.391304 33.391304 0 1 1 0 66.782609", fill: "currentColor" })
] }), Lo = ({ style: o }) => /* @__PURE__ */ c(Pe, { viewBox: "0 0 1024 1024", style: o, children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M464 512a48 48 0 1096 0 48 48 0 10-96 0zm200 0a48 48 0 1096 0 48 48 0 10-96 0zm-400 0a48 48 0 1096 0 48 48 0 10-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 00-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 00-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 00112 714v152a46 46 0 0046 46h152.1A449.4 449.4 0 00510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 00142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z" }) }), ds = ({ style: o }) => /* @__PURE__ */ c(Pe, { style: o, viewBox: "0 0 1024 1024", children: /* @__PURE__ */ c("path", { d: "M820.35259846 337.71374951V646.0663464h134.06634641V109.8009592h-536.2653872v134.06634641h308.35259689L109.8009592 860.57250255l93.84644234 93.84644232 616.70519692-616.70519536z", fill: "currentColor" }) }), us = ({ style: o }) => /* @__PURE__ */ c(Pe, { style: o, viewBox: "0 0 1365 1024", children: /* @__PURE__ */ c("path", { d: "M992 992H392v-2.71999969A319.75999969 319.75999969 0 0 1 193.92000031 393.99999969a400.00000031 400.00000031 0 0 1 790.11999938-41.47999969c2.68000031 0 5.28-0.52000031 8.00000062-0.52000031A319.99999969 319.99999969 0 0 1 992 992z m0-480h-7.99999969a247.99999969 247.99999969 0 0 1-77.28 0H831.99999969v-79.99999969a240 240 0 0 0-480 0v79.99999969a202.87999969 202.87999969 0 0 0-79.99999969 22.56L247.23999969 552.00000031a157.39999969 157.39999969 0 0 0-15.24 15.31999969 54.28000031 54.28000031 0 0 0-9.96 12.48A157.44 157.44 0 0 0 192.00000031 672.00000031a166.36000031 166.36000031 0 0 0 120 159.99999938h679.99999969a160.00000031 160.00000031 0 0 0 0-319.99999969z", fill: "currentColor" }) }), hs = ({ style: o }) => /* @__PURE__ */ c(Pe, { style: o, viewBox: "0 0 1024 1024", children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" }) });
var oe = /* @__PURE__ */ ((o) => (o[o.NONE = 0] = "NONE", o[o.TEXT = 1] = "TEXT", o[o.LINK = 2] = "LINK", o[o.FREETEXT = 3] = "FREETEXT", o[o.LINE = 4] = "LINE", o[o.SQUARE = 5] = "SQUARE", o[o.CIRCLE = 6] = "CIRCLE", o[o.POLYGON = 7] = "POLYGON", o[o.POLYLINE = 8] = "POLYLINE", o[o.HIGHLIGHT = 9] = "HIGHLIGHT", o[o.UNDERLINE = 10] = "UNDERLINE", o[o.SQUIGGLY = 11] = "SQUIGGLY", o[o.STRIKEOUT = 12] = "STRIKEOUT", o[o.STAMP = 13] = "STAMP", o[o.CARET = 14] = "CARET", o[o.INK = 15] = "INK", o[o.POPUP = 16] = "POPUP", o[o.FILEATTACHMENT = 17] = "FILEATTACHMENT", o[o.SOUND = 18] = "SOUND", o[o.MOVIE = 19] = "MOVIE", o[o.WIDGET = 20] = "WIDGET", o[o.SCREEN = 21] = "SCREEN", o[o.PRINTERMARK = 22] = "PRINTERMARK", o[o.TRAPNET = 23] = "TRAPNET", o[o.WATERMARK = 24] = "WATERMARK", o[o.THREED = 25] = "THREED", o[o.REDACT = 26] = "REDACT", o[o.NOTE = 27] = "NOTE", o))(oe || {}), k = /* @__PURE__ */ ((o) => (o[o.NONE = -1] = "NONE", o[o.SELECT = 0] = "SELECT", o[o.HIGHLIGHT = 1] = "HIGHLIGHT", o[o.STRIKEOUT = 2] = "STRIKEOUT", o[o.UNDERLINE = 3] = "UNDERLINE", o[o.FREETEXT = 4] = "FREETEXT", o[o.RECTANGLE = 5] = "RECTANGLE", o[o.CIRCLE = 6] = "CIRCLE", o[o.FREEHAND = 7] = "FREEHAND", o[o.FREE_HIGHLIGHT = 8] = "FREE_HIGHLIGHT", o[o.SIGNATURE = 9] = "SIGNATURE", o[o.STAMP = 10] = "STAMP", o[o.NOTE = 11] = "NOTE", o[o.ARROW = 12] = "ARROW", o[o.CLOUD = 13] = "CLOUD", o))(k || {}), rt = /* @__PURE__ */ ((o) => (o.Accepted = "Accepted", o.Rejected = "Rejected", o.Cancelled = "Cancelled", o.Completed = "Completed", o.None = "None", o.Closed = "Closed", o))(rt || {});
const Me = [
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
    icon: /* @__PURE__ */ c(Zi, {})
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
    icon: /* @__PURE__ */ c(Io, {}),
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
    icon: /* @__PURE__ */ c(Mo, {}),
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
    icon: /* @__PURE__ */ c(Do, {}),
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
    icon: /* @__PURE__ */ c(es, {}),
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
    icon: /* @__PURE__ */ c(ts, {}),
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
    icon: /* @__PURE__ */ c(ls, {})
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
    icon: /* @__PURE__ */ c(ds, {}),
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
    icon: /* @__PURE__ */ c(us, {}),
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
    icon: /* @__PURE__ */ c(ns, {}),
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
    icon: /* @__PURE__ */ c(os, {}),
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
    icon: /* @__PURE__ */ c(Qi, {}),
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
    icon: /* @__PURE__ */ c(rs, {})
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
    icon: /* @__PURE__ */ c(is, {})
  }
];
function De(o) {
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
function ps(o) {
  return document.body.contains(o);
}
function _o() {
  return Kr();
}
function Oo(o, e) {
  document.documentElement.style.setProperty(o, e);
}
function ln(o) {
  document.documentElement.style.removeProperty(o);
}
function Sn(o) {
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
  const n = t / o, r = t / e, i = Math.min(n, r), s = o * i, a = e * i;
  return { newWidth: s, newHeight: a };
}
function Ye(o, e = 0) {
  if (e < 0 || e * 3 + 2 >= o.length)
    throw new Error("Index out of bounds");
  const t = o[e * 3], n = o[e * 3 + 1], r = o[e * 3 + 2];
  return `rgb(${t}, ${n}, ${r})`;
}
function Bt(o) {
  const e = new Date(o), t = e.getFullYear(), n = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getDate()).padStart(2, "0"), i = String(e.getHours()).padStart(2, "0"), s = String(e.getMinutes()).padStart(2, "0"), a = String(e.getSeconds()).padStart(2, "0"), l = -e.getTimezoneOffset(), h = String(Math.floor(Math.abs(l) / 60)).padStart(2, "0"), d = String(Math.abs(l) % 60).padStart(2, "0"), u = l >= 0 ? "+" : "-";
  return `D:${t}${n}${r}${i}${s}${a}${u}${h}'${d}'`;
}
function wn(o, e = !1) {
  if (!o || typeof o != "string" || !o.startsWith("D:"))
    return "";
  const t = o.slice(2, 16);
  if (t.length !== 14)
    return "";
  const n = t.slice(0, 4), r = t.slice(4, 6), i = t.slice(6, 8), s = t.slice(8, 10), a = t.slice(10, 12);
  if (e)
    return we.t("common:dateFormat.full", { year: n, month: r, day: i, hour: s, minute: a });
  const l = /* @__PURE__ */ new Date(), h = l.getFullYear().toString(), d = (l.getMonth() + 1).toString().padStart(2, "0"), u = l.getDate().toString().padStart(2, "0");
  return n === h && r === d && i === u ? `${s}:${a}` : n === h ? we.t("common:dateFormat.dayMonth", { day: i, month: r }) : we.t("common:dateFormat.dayMonthYear", { day: i, month: r, year: n });
}
function Un(o) {
  if (!o || typeof o != "string" || !o.startsWith("D:"))
    return "";
  const e = o.slice(2, 16);
  if (e.length !== 14)
    return "";
  const t = e.slice(0, 4), n = e.slice(4, 6), r = e.slice(6, 8), i = e.slice(8, 10), s = e.slice(10, 12), a = (/* @__PURE__ */ new Date()).getFullYear().toString(), l = t === a ? "common:dateFormat.compact" : "common:dateFormat.compactWithYear";
  return we.t(l, {
    year: t,
    month: n,
    day: r,
    hour: i,
    minute: s
  });
}
function zn(o) {
  const e = o.slice(2, 16), t = parseInt(e.slice(0, 4), 10), n = parseInt(e.slice(4, 6), 10) - 1, r = parseInt(e.slice(6, 8), 10), i = parseInt(e.slice(8, 10), 10), s = parseInt(e.slice(10, 12), 10), a = parseInt(e.slice(12, 14), 10) || 0, l = o.slice(16).match(/([+-])(\d{2})'?(\d{2})?'/);
  let h = 0;
  if (l) {
    const u = l[1] === "+" ? 1 : -1, f = parseInt(l[2], 10) || 0, p = parseInt(l[3] || "0", 10) || 0;
    h = u * (f * 60 + p);
  }
  return new Date(Date.UTC(t, n, r, i, s, a)).getTime() - h * 60 * 1e3;
}
function Re(o, e) {
  const { viewport: t } = e, n = t.scale, r = o.x * n, i = o.y * n, s = o.width * n, a = o.height * n, [l, h] = t.convertToPdfPoint(r, i), [d, u] = t.convertToPdfPoint(r + s, i + a);
  return [Math.min(l, d), Math.min(h, u), Math.max(l, d), Math.max(h, u)];
}
function ie(o) {
  const t = [...[254, 255]];
  for (let r = 0; r < o.length; r++) {
    const i = o.charCodeAt(r);
    t.push(i >> 8 & 255, i & 255);
  }
  const n = t.map((r) => r.toString(16).padStart(2, "0")).join("").toUpperCase();
  return bo.of(n);
}
function Ho(o = /* @__PURE__ */ new Date()) {
  const e = (l) => l.toString().padStart(2, "0"), t = o.getFullYear(), n = e(o.getMonth() + 1), r = e(o.getDate()), i = e(o.getHours()), s = e(o.getMinutes()), a = e(o.getSeconds());
  return `${t}${n}${r}_${i}${s}${a}`;
}
const lt = "InkLayer_Annotator", Cn = `${lt}_painter_wrapper`, fs = `${lt}_annotation_author_labels_layer`, gs = `${lt}_annotation_author_label`, nn = "annotationAuthorLabelBoundsChange", ms = `${lt}_annotation_hover_preview`, Fn = `${lt}_is_painting`, dn = `${lt}_painting_type`, Le = `${lt}_shape_group`, vs = `${lt}_selector_hover`, Nt = `--${lt}-image-cursor`, Go = `${lt}_free_text_editor`;
class Te {
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
    pageNumber: i,
    annotation: s,
    onAdd: a,
    editorType: l,
    pdfViewerApplication: h,
    onChange: d
  }) {
    this.primaryColor = e, this.defaultOptions = t, this.currentUser = n, this.pdfViewerApplication = h, this.id = `${i}_${l}`, this.konvaStage = r, this.pageNumber = i, this.currentAnnotation = s, this.isPainting = !1, this.currentShapeGroup = null, this.onAdd = a, this.onChange = d || (() => {
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
    const { id: r, pageNumber: i, konvaGroup: s, annotation: a } = e;
    if (a) {
      const l = {
        id: r,
        pageNumber: i,
        konvaString: s.toJSON(),
        konvaClientRect: I.Node.create(s.toJSON()).getClientRect(),
        title: this.currentUser.name,
        type: a.type,
        pdfjsType: a.pdfjsAnnotationType,
        subtype: a.subtype,
        color: n,
        date: Bt(Date.now()),
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
    const e = _o(), t = new I.Group({
      // 创建新的 Konva.Group 对象
      draggable: !1,
      name: Le,
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
    const n = I.Node.create(t);
    this.registerSerializedGroup(e, n);
  }
  /**
   * 将反序列化的 Group 绑定到当前 Stage，并让 Store 始终指向当前页面上的节点。
   */
  registerSerializedGroup(e, t) {
    this.konvaStage = e;
    const n = t.id(), r = e.findOne(
      (i) => i.getType() === "Group" && i.id() === n
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
    const t = Te.Timer[e];
    t && window.clearTimeout(t);
  }
  /**
   * 静态方法，启动指定页面的定时器。
   * @param pageNumber 页面编号
   * @param callback 定时器回调函数，接受页面编号作为参数
   */
  static TimerStart(e, t) {
    Te.Timer[e] = window.setTimeout(() => {
      typeof t == "function" && t(e);
    }, 1e3);
  }
}
class ys extends Te {
  ellipse;
  // 当前正在绘制的椭圆对象
  vertex;
  // 用于存储椭圆的起点（顶点）坐标
  /**
   * 构造函数，初始化椭圆编辑器。
   * @param EditorOptions 编辑器选项接口
   */
  constructor(e) {
    super({ ...e, editorType: k.CIRCLE }), this.ellipse = null, this.vertex = { x: 0, y: 0 };
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
    t && (this.vertex = { x: t.x, y: t.y }, this.ellipse = new I.Ellipse({
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
    const n = Math.abs(t.x - this.vertex.x) / 2, r = Math.abs(t.y - this.vertex.y) / 2, i = {
      x: (t.x - this.vertex.x) / 2 + this.vertex.x,
      y: (t.y - this.vertex.y) / 2 + this.vertex.y,
      radiusX: n,
      radiusY: r
    };
    this.ellipse?.setAttrs(i);
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
    return Math.max(e, t) < Te.MinSize;
  }
  /**
   * @description 更改注释样式
   * @param annotationStore
   * @param styles
   */
  changeStyle(e, t) {
    const n = e.id, r = this.getShapeGroupById(n);
    if (r) {
      r.getChildren().forEach((s) => {
        s instanceof I.Ellipse && (t.color !== void 0 && s.stroke(t.color), t.strokeWidth !== void 0 && s.strokeWidth(t.strokeWidth), t.opacity !== void 0 && s.opacity(t.opacity));
      });
      const i = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (i.color = t.color), this.setChanged(n, i);
    }
  }
}
class bs extends Te {
  line;
  // 当前正在绘制的自由曲线
  /**
   * 构造函数，初始化自由手绘编辑器。
   * @param EditorOptions 编辑器选项接口
   */
  constructor(e) {
    super({ ...e, editorType: k.FREEHAND }), this.line = null;
  }
  /**
   * 处理鼠标或触摸指针按下事件，开始绘制自由曲线。
   * @param e Konva 事件对象
   */
  mouseDownHandler(e) {
    if (e.currentTarget !== this.konvaStage)
      return;
    Te.TimerClear(this.pageNumber), this.line = null, this.isPainting = !0, this.currentShapeGroup || (this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup));
    const t = this.konvaStage.getRelativePointerPosition();
    t && (this.line = new I.Line({
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
      this.line.destroy(), Te.TimerStart(this.pageNumber, () => {
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
    Te.TimerStart(this.pageNumber, () => {
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
    return this.line ? this.line.points().length < Te.MinSize : !0;
  }
  /**
   * @description 更改注释样式
   * @param annotationStore
   * @param styles
   */
  changeStyle(e, t) {
    const n = e.id, r = this.getShapeGroupById(n);
    if (r) {
      r.getChildren().forEach((s) => {
        s instanceof I.Line && (t.color !== void 0 && s.stroke(t.color), t.strokeWidth !== void 0 && s.strokeWidth(t.strokeWidth), t.opacity !== void 0 && s.opacity(t.opacity));
      });
      const i = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (i.color = t.color), this.setChanged(n, i);
    }
  }
}
class Ss extends Te {
  line;
  // 当前正在绘制的自由曲线
  constructor(e) {
    super({ ...e, editorType: k.FREE_HIGHLIGHT }), this.line = null;
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
    t && (this.line = new I.Line({
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
    const t = 2, n = e[0], r = e[1], i = e[e.length - 2], s = e[e.length - 1], a = i - n, l = s - r;
    if (a === 0 && l !== 0)
      return e.map((p, g) => g % 2 === 0 ? n : p);
    if (l === 0 && a !== 0)
      return e.map((p, g) => g % 2 === 0 ? p : r);
    if (a === 0 && l === 0)
      return e;
    const h = Math.atan2(l, a), d = Math.abs(h * (180 / Math.PI)), u = d <= t || d >= 180 - t || d >= 90 - t && d <= 90 + t && Math.abs(a) > Math.abs(l), f = d >= 90 - t && d <= 90 + t && Math.abs(l) > Math.abs(a) || d >= 180 - t || d <= t;
    return u ? e.map((p, g) => g % 2 === 0 ? p : r) : f ? e.map((p, g) => g % 2 === 0 ? n : p) : e;
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
      r.getChildren().forEach((s) => {
        s instanceof I.Line && (t.color !== void 0 && s.stroke(t.color), t.strokeWidth !== void 0 && s.strokeWidth(t.strokeWidth), t.opacity !== void 0 && s.opacity(t.opacity));
      });
      const i = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (i.color = t.color), this.setChanged(n, i);
    }
  }
}
const ws = {
  placement: "bottom-start",
  middleware: [wo()]
}, An = 200;
class Cs {
  resolveFunction = null;
  container = null;
  inputElement = null;
  isActive = !1;
  isCleaningUp = !1;
  show(e, t, n, r) {
    return this.isActive && this.handleConfirm(), this.isActive = !0, this.isCleaningUp = !1, new Promise((i) => {
      this.resolveFunction = i, this.container = document.createElement("div"), this.container.id = Go, Object.assign(this.container.style, {
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: "1000"
      }), document.body.appendChild(this.container), $t({
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
      }, this.container, ws).then(({ x: a, y: l }) => {
        Object.assign(this.container.style, {
          left: `${a}px`,
          top: `${l}px`
        }), this.renderInputComponent(t, n, r);
      });
    });
  }
  renderInputComponent(e, t, n) {
    if (!this.container) return;
    const r = document.createElement("div"), i = document.createElement("textarea");
    i.placeholder = we.t("annotator:editor.text.startTyping"), Object.assign(i.style, {
      minHeight: "40px",
      width: `${An}px`,
      padding: "8px",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      border: "none !important",
      borderRadius: "4px",
      resize: "vertical",
      fontFamily: "inherit",
      fontSize: `${e}px`,
      color: t
    }), i.addEventListener("focus", () => {
      Object.assign(i.style, {
        outline: t,
        boxShadow: `0 0 0 1px ${n}`
      });
    }), i.addEventListener("blur", () => {
      Object.assign(i.style, {
        boxShadow: "none"
      });
    }), i.addEventListener("keydown", (s) => {
      s.key === "Enter" && !s.shiftKey ? (s.preventDefault(), this.handleConfirm()) : s.key === "Escape" && (s.preventDefault(), this.handleCancel());
    }), i.addEventListener("blur", () => {
      this.isCleaningUp || (this.inputElement && this.inputElement.value.trim() !== "" ? this.handleConfirm() : this.handleCancel());
    }), this.inputElement = i, r.appendChild(i), this.container.appendChild(r), setTimeout(() => {
      i && i.focus();
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
const As = new Cs();
async function Ts(o, e, t, n) {
  return As.show(o, e, t, n);
}
class xs extends Te {
  /**
   * 创建一个 EditorFreeText 实例。
   * @param EditorOptions 初始化编辑器的选项
   */
  constructor(e) {
    super({ ...e, editorType: k.FREETEXT });
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
    const i = r.getBoundingClientRect(), s = i.left + t.x * n.x, a = i.top + t.y * n.y, l = await Ts(
      { x: s, y: a },
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
  async inputDoneHandler(e, t, n, r, i) {
    const s = e.trim();
    if (s === "") {
      this.delShapeGroup(this.currentShapeGroup.id), this.currentShapeGroup = null;
      return;
    }
    const l = new I.Text({
      text: s,
      fontSize: i,
      padding: 2
    }).width(), h = l > An ? An : l, d = new I.Text({
      x: n.x,
      y: n.y + 2,
      text: s,
      width: h,
      fontSize: i,
      fill: r,
      wrap: "word"
    });
    this.currentShapeGroup?.konvaGroup.add(d);
    const u = this.currentShapeGroup?.konvaGroup.id();
    u && this.setShapeGroupDone({
      id: u,
      contentsObj: {
        text: s
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
      r.getChildren().forEach((s) => {
        s instanceof I.Text && (t.color !== void 0 && s.fill(t.color), t.opacity !== void 0 && s.opacity(t.opacity));
      });
      const i = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (i.color = t.color), this.setChanged(n, i);
    }
  }
}
class jn extends Te {
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
    const n = t.getBoundingClientRect(), r = e.map((s) => {
      const a = s.getBoundingClientRect();
      return this.calculateRelativePosition(a, n);
    });
    this.mergeSpanRectsByRow(r).forEach((s) => {
      const a = this.createShape(s.x, s.y, s.width, s.height);
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
    const t = 2, n = 1, r = [...e].sort((h, d) => h.y - d.y), i = [];
    let s = [r[0]], a = r[0].y;
    for (let h = 1; h < r.length; h++)
      Math.abs(r[h].y - a) < t ? s.push(r[h]) : (i.push(s), s = [r[h]], a = r[h].y);
    i.push(s);
    const l = [];
    for (const h of i) {
      h.sort((u, f) => u.x - f.x);
      let d = { ...h[0] };
      for (let u = 1; u < h.length; u++) {
        const f = h[u], p = d.x + d.width;
        if (f.x - p <= n) {
          const m = f.x + f.width;
          d.width = Math.max(p, m) - d.x, d.height = Math.max(d.height, f.height), d.y = Math.min(d.y, f.y);
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
    const n = this.konvaStage.scale(), r = (e.x - t.x) / n.x, i = (e.y - t.y) / n.y, s = e.width / n.x, a = e.height / n.y;
    return { x: r, y: i, width: s, height: a };
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
      case k.HIGHLIGHT:
        return this.createHighlightShape(e, t, n, r);
      case k.UNDERLINE:
        return this.createUnderlineShape(e, t, n, r);
      case k.STRIKEOUT:
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
    return new I.Rect({
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
    return new I.Rect({
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
    return new I.Rect({
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
      r.getChildren().forEach((s) => {
        e.type === k.HIGHLIGHT && s instanceof I.Rect && (t.color !== void 0 && s.fill(t.color), t.strokeWidth !== void 0 && s.strokeWidth(t.strokeWidth), t.opacity !== void 0 && s.opacity(t.opacity)), e.type === k.UNDERLINE && s instanceof I.Rect && (t.color !== void 0 && s.fill(t.color), t.strokeWidth !== void 0 && s.strokeWidth(t.strokeWidth), t.opacity !== void 0 && s.opacity(t.opacity)), e.type === k.STRIKEOUT && s instanceof I.Rect && (t.color !== void 0 && s.stroke(t.color), t.strokeWidth !== void 0 && s.strokeWidth(t.strokeWidth), t.opacity !== void 0 && s.opacity(t.opacity));
      });
      const i = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (i.color = t.color), this.setChanged(n, i);
    }
  }
}
class ks extends Te {
  rect;
  // 当前正在绘制的矩形对象
  vertex;
  // 矩形的起始顶点坐标
  /**
   * 创建一个 EditorRectangle 实例。
   * @param EditorOptions 初始化编辑器的选项
   */
  constructor(e) {
    super({ ...e, editorType: k.RECTANGLE }), this.rect = null, this.vertex = { x: 0, y: 0 };
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
    t && (this.vertex = { x: t.x, y: t.y }, this.rect = new I.Rect({
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
    return Math.max(e, t) < Te.MinSize;
  }
  /**
   * @description 更改注释样式
   * @param annotationStore
   * @param styles
   */
  changeStyle(e, t) {
    const n = e.id, r = this.getShapeGroupById(n);
    if (r) {
      r.getChildren().forEach((s) => {
        s instanceof I.Rect && (t.color !== void 0 && s.stroke(t.color), t.strokeWidth !== void 0 && s.strokeWidth(t.strokeWidth), t.opacity !== void 0 && s.opacity(t.opacity));
      });
      const i = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (i.color = t.color), this.setChanged(n, i);
    }
  }
}
class Wn extends Te {
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
    super({ ...e, editorType: k.SIGNATURE }), this.signatureUrl = t, this.signatureImage = null, t && this.createCursorImg();
  }
  /**
   * 创建光标图像，并设置 CSS 自定义属性。
   */
  createCursorImg() {
    const e = new I.Group({
      draggable: !1
    });
    this.signatureUrl && I.Image.fromURL(this.signatureUrl, (t) => {
      const { width: n, height: r } = t.getClientRect(), { newWidth: i, newHeight: s } = Kt(n, r, 96), a = { x: i / 2, y: s / 2 }, l = new I.Rect({
        x: 0,
        y: 0,
        width: i,
        height: s,
        stroke: this.primaryColor,
        strokeWidth: 2,
        cornerRadius: 2
      }), h = new I.Rect({
        x: 0,
        y: 0,
        width: i,
        height: s,
        cornerRadius: 6,
        shadowColor: "rgba(0,0,0,0.25)",
        shadowBlur: 12,
        shadowOffset: { x: 0, y: 2 },
        shadowOpacity: 0.35
      });
      t.setAttrs({
        x: 0,
        y: 0,
        width: i,
        height: s,
        opacity: 0.92
      });
      const d = new I.Circle({
        x: a.x,
        y: a.y,
        radius: 7,
        strokeWidth: 0,
        fill: "rgba(255,255,255,0.8)"
      }), u = new I.Circle({
        x: a.x,
        y: a.y,
        radius: 4,
        fill: this.primaryColor,
        opacity: 0.9
      });
      e.add(h), e.add(l), e.add(t), e.add(d), e.add(u);
      const f = e.toDataURL();
      e.destroy(), Oo(
        Nt,
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
    this.signatureUrl && t && I.Image.fromURL(this.signatureUrl, async (n) => {
      const { width: r, height: i } = n.getClientRect(), { newWidth: s, newHeight: a } = Kt(r, i, 120), l = { x: s / 2, y: a / 2 };
      this.signatureImage = n, this.signatureImage.setAttrs({
        x: t.x - l.x,
        y: t.y - l.y,
        width: s,
        height: a,
        base64: this.signatureUrl
      }), this.currentShapeGroup?.konvaGroup.add(this.signatureImage), this.konvaStage.draw();
      const h = this.currentShapeGroup?.konvaGroup.id();
      h && (this.setShapeGroupDone({
        id: h,
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
    const n = I.Node.create(t), { konvaGroup: r, added: i } = this.registerSerializedGroup(e, n);
    if (!i) return;
    const s = this.getGroupNodesByClassName(r, "Image")[0];
    if (!s) return;
    const a = s.getAttr("base64");
    a && I.Image.fromURL(a, (l) => {
      l.setAttrs(s.getAttrs()), s.destroy(), r.add(l), r.getLayer()?.batchDraw(), r.fire(nn);
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
class $n extends Te {
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
    super({ ...e, editorType: k.STAMP }), this.stampUrl = t, this.stampImage = null, t && this.createCursorImg();
  }
  /**
   * 创建光标图像，并设置 CSS 自定义属性。
   */
  createCursorImg() {
    const e = new I.Group({
      draggable: !1
    });
    this.stampUrl && I.Image.fromURL(this.stampUrl, (t) => {
      const { width: n, height: r } = t.getClientRect(), { newWidth: i, newHeight: s } = Kt(n, r, 96), a = { x: i / 2, y: s / 2 }, l = new I.Rect({
        x: 0,
        y: 0,
        width: i,
        height: s,
        stroke: this.primaryColor,
        strokeWidth: 2,
        cornerRadius: 2
      }), h = new I.Rect({
        x: 0,
        y: 0,
        width: i,
        height: s,
        cornerRadius: 6,
        shadowColor: "rgba(0,0,0,0.25)",
        shadowBlur: 12,
        shadowOffset: { x: 0, y: 2 },
        shadowOpacity: 0.35
      });
      t.setAttrs({
        x: 0,
        y: 0,
        width: i,
        height: s,
        opacity: 0.92
      });
      const d = new I.Circle({
        x: a.x,
        y: a.y,
        radius: 7,
        strokeWidth: 0,
        fill: "rgba(255,255,255,0.8)"
      }), u = new I.Circle({
        x: a.x,
        y: a.y,
        radius: 4,
        fill: this.primaryColor,
        opacity: 0.9
      });
      e.add(h), e.add(l), e.add(t), e.add(d), e.add(u);
      const f = e.toDataURL();
      e.destroy(), Oo(
        Nt,
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
    this.stampUrl && t && I.Image.fromURL(this.stampUrl, async (n) => {
      const { width: r, height: i } = n.getClientRect(), { newWidth: s, newHeight: a } = Kt(r, i, 120), l = { x: s / 2, y: a / 2 };
      this.stampImage = n, this.stampImage.setAttrs({
        x: t.x - l.x,
        y: t.y - l.y,
        width: s,
        height: a,
        base64: this.stampUrl
      }), this.currentShapeGroup?.konvaGroup.add(this.stampImage), this.konvaStage.draw();
      const h = this.currentShapeGroup?.konvaGroup.id();
      h && (this.setShapeGroupDone(
        {
          id: h,
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
    const n = I.Node.create(t), { konvaGroup: r, added: i } = this.registerSerializedGroup(e, n);
    if (!i) return;
    const s = this.getGroupNodesByClassName(r, "Image")[0];
    if (!s) return;
    const a = s.getAttr("base64"), l = this.getGroupNodesByClassName(r, "Text")[0];
    a && I.Image.fromURL(a, (h) => {
      h.setAttrs(s.getAttrs()), s.destroy(), r.add(h), l && l.moveToTop(), r.getLayer()?.batchDraw(), r.fire(nn);
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
function Uo({
  x: o,
  y: e,
  fill: t = "rgba(255, 221, 31, 1)",
  stroke: n = "#C0A042",
  strokeWidth: r = 0.8,
  cornerSize: i = 4
}) {
  const h = [], d = new I.Rect({
    x: o,
    y: e,
    width: 18,
    height: 20,
    cornerRadius: i,
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
  h.push(d);
  const u = new I.Line({
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
  h.push(u);
  const f = new I.Line({
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
  h.push(f);
  const p = 4, g = 4, m = (20 - p * 2) / (g + 1);
  for (let v = 1; v <= g; v++) {
    const y = e + p + v * m, T = new I.Line({
      points: [
        o + 3,
        y,
        o + 18 - (v === 1 ? 7 : 4),
        y
      ],
      stroke: "rgba(0,0,0,0.45)",
      strokeWidth: 0.7,
      lineCap: "round"
    });
    h.push(T);
  }
  return h;
}
class Es extends Te {
  constructor(e) {
    super({ ...e, editorType: k.NOTE });
  }
  mouseDownHandler() {
  }
  mouseMoveHandler() {
  }
  async mouseUpHandler(e) {
    const t = "rgb(255, 221, 31)", n = this.konvaStage.getRelativePointerPosition();
    if (e.currentTarget !== this.konvaStage || !n)
      return;
    const { x: r, y: i } = n;
    this.isPainting = !0, this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup);
    const s = Uo({ x: r, y: i, fill: t });
    this.currentShapeGroup.konvaGroup.add(...s);
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
function zo(o) {
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
class Rs {
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
    onDelete: i,
    onSelected: s,
    onDeselected: a,
    onSelectionChanged: l,
    onHoverStart: h,
    onHoverEnd: d,
    onCancel: u,
    onChanged: f
  }) {
    this.primaryColor = e, this.konvaCanvasStore = t, this.getAnnotationStore = n, this.canTransform = r, this.onDelete = i, this.onSelected = s, this.onDeselected = a, this.onSelectionChanged = l, this.onHoverStart = h, this.onHoverEnd = d, this.onCancel = u, this.onChanged = f;
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
    return this.getBackgroundLayer(e).getChildren((t) => t.name() === Le);
  }
  // 获取指定 id 的形状组
  getGroupById(e, t) {
    return this.getPageShapeGroups(e).find((r) => r.id() === t) || null;
  }
  getFirstShapeInGroup(e) {
    return e.getChildren().find((t) => t instanceof I.Shape) || null;
  }
  /**
   * 启用给定组中的所有形状的交互功能。
   * @param groups - 要启用的形状组。
   * @param konvaStage - 形状组所在的 Konva Stage。
   */
  enableShapeGroups(e, t) {
    e.forEach((n) => {
      this.removeGroupHoverEvents(n), this.bindGroupHoverEvents(n), n.getChildren().forEach((r) => {
        r instanceof I.Shape && (this.removeShapeEvents(r), this.bindShapeEvents(r, t));
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
        n instanceof I.Shape && this.removeShapeEvents(n);
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
    const r = e.findAncestor(`.${Le}`);
    if (!r) return;
    this.hoveredGroupId === r.id() && this.clearCanvasHover(), this.clearTransformers();
    const i = !n;
    if (this.createTransformer(r, t, i), !i) {
      const s = this.transformerStore.get(r.id());
      if (s) {
        const a = s.getClientRect();
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
    const r = e.children[0], i = e.id();
    this.currentTransformerId = i;
    const s = this.getAnnotationStore(i);
    if (e.off("dragend"), !s) return;
    const a = Me.find((f) => f.pdfjsAnnotationType === s.pdfjsType), l = this.canTransform(s), h = zo(l), d = new I.Transformer({
      resizeEnabled: l && a?.resizable,
      rotateEnabled: !1,
      borderStrokeWidth: h.borderStrokeWidth,
      borderStroke: this.primaryColor,
      borderDash: h.borderDash,
      anchorFill: h.anchorFill,
      anchorStroke: this.primaryColor,
      opacity: h.opacity,
      anchorCornerRadius: 5,
      anchorStrokeWidth: h.anchorStrokeWidth,
      anchorSize: h.anchorSize,
      padding: 2,
      boundBoxFunc: (f, p) => (p.width = Math.max(30, p.width), p)
    });
    r.attrs.id && r.attrs.id === "note" && d.resizeEnabled(!1), e.draggable(!!(l && a?.draggable)), d.off("transformend"), d.off("transformstart"), l && d.on("transformend", () => {
      this.onChanged(e.id(), e.toJSON(), { ...s }, I.Node.create(e.toJSON()).getClientRect(), d.getClientRect());
    }), l && d.on("transformstart", () => {
      this.onCancel();
    }), l && d.on("dragstart", () => {
      this.onCancel();
    }), l && d.on("dragend", () => {
      this.onChanged(e.id(), e.toJSON(), { ...s }, I.Node.create(e.toJSON()).getClientRect(), d.getClientRect());
    });
    let u = null;
    l && d.on("dragmove", () => {
      u && cancelAnimationFrame(u), u = requestAnimationFrame(() => {
        u = null;
        const f = d.nodes().map((g) => g.getClientRect()), p = this.getTotalBox(f);
        d.nodes().forEach((g) => {
          const m = g.getAbsolutePosition(), v = p.x - m.x, y = p.y - m.y, T = p.width / 2, S = p.height / 2, x = { ...m };
          p.x + T < 0 && (x.x = -v - T), p.y + S < 0 && (x.y = -y - S), p.x + T > t.width() && (x.x = t.width() - T - v), p.y + S > t.height() && (x.y = t.height() - S - y), g.setAbsolutePosition(x);
        });
      });
    }), d.nodes([e]), this.getBackgroundLayer(t).add(d), this.transformerStore.set(i, d), this.onSelectionChanged(i), n && this.flashNodeWithTransformer(e, d, () => {
      this.onSelected(e.id(), !1, d.getClientRect());
    });
  }
  flashNodeWithTransformer(e, t, n) {
    let r = 0;
    const i = 1, s = 0.1, a = e.id();
    this.cleanupTween(a);
    const l = t.borderStrokeWidth(), h = () => {
      if (!e.getLayer()) {
        this.tweenStore.delete(a);
        return;
      }
      const u = new I.Tween({
        node: e,
        duration: s,
        opacity: 0,
        onFinish: () => {
          try {
            t.getLayer() && (t.borderStrokeWidth(l + 2), t.getLayer()?.batchDraw()), d();
          } catch {
            this.cleanupTween(a);
          }
        }
      }), f = this.tweenStore.get(a) || { fadeOut: null, fadeIn: null };
      f.fadeOut = u, this.tweenStore.set(a, f), u.play();
    }, d = () => {
      if (!e.getLayer()) {
        this.tweenStore.delete(a);
        return;
      }
      const u = new I.Tween({
        node: e,
        duration: s,
        opacity: 1,
        onFinish: () => {
          try {
            t.getLayer() && (t.borderStrokeWidth(l), t.getLayer()?.batchDraw()), r++, r < i ? setTimeout(h, 100) : (this.cleanupTween(a), n && n());
          } catch {
            this.cleanupTween(a);
          }
        }
      }), f = this.tweenStore.get(a) || { fadeOut: null, fadeIn: null };
      f.fadeIn = u, this.tweenStore.set(a, f), u.play();
    };
    h();
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
    let t = 1 / 0, n = 1 / 0, r = -1 / 0, i = -1 / 0;
    return e.forEach((s) => {
      t = Math.min(t, s.x), n = Math.min(n, s.y), r = Math.max(r, s.x + s.width), i = Math.max(i, s.y + s.height);
    }), {
      x: t,
      y: n,
      width: r - t,
      height: i - n
    };
  }
  /**
   * 根据悬停状态切换光标样式。
   * @param add - 是否添加悬停样式。
   */
  toggleCursorStyle(e) {
    document.body.classList.toggle(vs, e);
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
        r instanceof I.Group && (r.draggable(!1), r.off("dragend"));
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
        n instanceof I.Group && n.draggable(!1);
      });
    }
  }
  selectedShape(e, t, n = !1) {
    const r = this.getGroupById(t, e);
    if (!r)
      return;
    const i = this.getFirstShapeInGroup(r);
    i && this.handleShapeClick(i, t, n);
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
    !(n instanceof I.Group) || !r || (t?.off("transformend transformstart dragstart dragend dragmove"), t?.nodes([]), t?.destroy(), this.cleanupTween(e), this.transformerStore.delete(e), this._currentTransformerId = null, this.createTransformer(n, r, !1));
  }
  delete() {
    this.clearTransformers();
  }
}
var Ve = /* @__PURE__ */ ((o) => (o.CANVAS = "canvas", o.SIDEBAR = "sidebar", o))(Ve || {});
const ce = Xr((o, e) => ({
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
    const i = new Map(r.annotations);
    if (i.set(t.id, t), n) {
      const s = new Map(r.originalAnnotations);
      return s.set(t.id, t), {
        annotations: i,
        originalAnnotations: s
      };
    }
    return { annotations: i };
  }), t),
  restoreAnnotation: (t, n) => e().annotations.has(t.id) ? !1 : (o((r) => {
    const i = Array.from(r.annotations.entries()), s = Math.max(0, Math.min(n, i.length));
    return i.splice(s, 0, [t.id, t]), { annotations: new Map(i) };
  }), !0),
  updateAnnotation: (t, n) => {
    let r = null;
    return o((i) => {
      const s = i.annotations.get(t);
      if (!s)
        return console.warn(`Annotation with id ${t} not found.`), i;
      r = {
        ...s,
        ...n
      };
      const a = new Map(i.annotations);
      a.set(t, r);
      const l = i.selectedAnnotation?.store?.id === t ? {
        ...i.selectedAnnotation,
        store: r
      } : i.selectedAnnotation;
      return { annotations: a, selectedAnnotation: l };
    }), r;
  },
  setAnnotationReferenceNumbers: (t) => o((n) => {
    const r = (d) => {
      let u = !1;
      const f = new Map(d);
      return t.forEach((p, g) => {
        const m = f.get(g);
        !m || m.referenceNumber === p || (f.set(g, { ...m, referenceNumber: p }), u = !0);
      }), u ? f : d;
    }, i = r(n.annotations), s = r(n.originalAnnotations), a = n.selectedAnnotation?.store, l = a ? t.get(a.id) : void 0, h = a && l !== void 0 && a.referenceNumber !== l ? {
      store: { ...a, referenceNumber: l },
      source: n.selectedAnnotation?.source ?? null
    } : n.selectedAnnotation;
    return i === n.annotations && s === n.originalAnnotations && h === n.selectedAnnotation ? n : { annotations: i, originalAnnotations: s, selectedAnnotation: h };
  }),
  removeAnnotation: (t) => o((n) => {
    const r = new Map(n.annotations);
    if (r.has(t)) {
      r.delete(t);
      const i = n.selectedAnnotation?.store?.id === t;
      return {
        annotations: r,
        selectedAnnotation: i ? null : n.selectedAnnotation,
        selectionRevision: i ? n.selectionRevision + 1 : n.selectionRevision
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
class Ps {
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
    const r = e.sources.flatMap((i) => t.getDoms(i.id)).reduce((i, s) => {
      const a = s.closest(".page")?.getAttribute("data-page-number") ?? "-1";
      return (i[a] ||= []).push(s), i;
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
    this.destroy(), this.root = e, this.highlighterObj = new qr({
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
class Ke {
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
    const r = n / t, [i, s, a, l] = e, h = i, d = r - l, u = a - i, f = l - s;
    return { x: h, y: d, width: u, height: f };
  }
  /**
   * @description pdfjs annotation quadPoint 转为 konva 的 rect
   * @param quadPoint  [左上，右上，左下，右下]
   * @param scale
   * @param height
   * @returns
   */
  convertQuadPoints(e, t, n) {
    const r = n / t, i = e[0].x, s = r - e[0].y, a = e[1].x - e[0].x, l = e[1].y - e[3].y;
    return { x: i, y: s, width: a, height: l };
  }
  convertPoint(e, t, n) {
    const r = n / t;
    return { x: e.x, y: r - e.y };
  }
  convertCoordinates(e, t, n) {
    const r = n / t, i = e[0], s = r - e[1], a = e[2], l = r - e[3];
    return { x: i, y: s, x1: a, y1: l };
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
class Ns extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Ye(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, { x: i, y: s, width: a, height: l } = this.convertRect(
      e.rect,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), h = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), d = new I.Ellipse({
      radiusX: a / 2,
      radiusY: l / 2,
      x: i + a / 2,
      y: s + l / 2,
      strokeScaleEnabled: !1,
      strokeWidth: r,
      stroke: n,
      dash: e.borderStyle.style === 2 ? e.borderStyle.dashArray : []
    });
    h.add(d);
    const u = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: h.toJSON(),
      konvaClientRect: h.getClientRect(),
      title: e.titleObj.str,
      type: k.CIRCLE,
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
    return h.destroy(), u;
  }
}
class Is extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Ye(e.defaultAppearanceData.fontColor), r = e.defaultAppearanceData.fontSize, i = e.contentsObj.str, { x: s, y: a } = this.convertRect(
      e.rect,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), l = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), h = new I.Text({
      x: s,
      y: a + 2,
      text: i,
      fontSize: r,
      fill: n
    });
    return l.add(h), {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: l.toJSON(),
      konvaClientRect: l.getClientRect(),
      title: e.titleObj.str,
      type: k.FREETEXT,
      color: n,
      pdfjsType: e.annotationType,
      subtype: e.subtype,
      date: e.modificationDate,
      contentsObj: {
        text: i
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
class un extends Ke {
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
  createHighlightShape(e, t, n, r, i) {
    return new I.Rect({
      x: e,
      y: t,
      width: n,
      height: r,
      opacity: 0.5,
      fill: i
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
  createUnderlineShape(e, t, n, r, i) {
    return new I.Rect({
      x: e,
      y: r + t - 1.5,
      width: n,
      stroke: i,
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
  createStrikeoutShape(e, t, n, r, i) {
    return new I.Rect({
      x: e,
      y: t + r / 2,
      width: n,
      stroke: i,
      strokeWidth: 0.5,
      hitStrokeWidth: 10,
      height: 0.5
    });
  }
  decodePdfAnnotation(e, t) {
    const n = Ye(e.color || [0, 0, 0]), i = {
      [oe.HIGHLIGHT]: k.HIGHLIGHT,
      [oe.UNDERLINE]: k.UNDERLINE,
      [oe.STRIKEOUT]: k.STRIKEOUT
    }[e.annotationType] || k.HIGHLIGHT, s = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), a = (h) => {
      const { x: d, y: u, width: f, height: p } = this.convertQuadPoints(h, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
      switch (e.annotationType) {
        case oe.HIGHLIGHT:
          return this.createHighlightShape(d, u, f, p, n);
        case oe.UNDERLINE:
          return this.createUnderlineShape(d, u, f, p, n);
        case oe.STRIKEOUT:
          return this.createStrikeoutShape(d, u, f, p, n);
        default:
          return null;
      }
    };
    e.quadPoints?.forEach((h) => {
      const d = a(h);
      d && s.add(d);
    });
    const l = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: s.toJSON(),
      konvaClientRect: s.getClientRect(),
      title: e.titleObj.str,
      type: i,
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
class Ms extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Ye(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, { x: i, y: s, width: a, height: l } = this.convertRect(
      e.rect,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), h = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), d = new I.Rect({
      x: i,
      y: s,
      width: a,
      height: l,
      strokeScaleEnabled: !1,
      stroke: n,
      strokeWidth: r,
      fill: e.borderStyle.width === 0 ? n : "",
      opacity: e.borderStyle.width === 0 ? 0.5 : 1
    });
    h.add(d);
    const u = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: h.toJSON(),
      konvaClientRect: h.getClientRect(),
      title: e.titleObj.str,
      type: k.RECTANGLE,
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
    return h.destroy(), u;
  }
}
class Ds extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    if (e.inkLists.length === 0)
      return null;
    const n = Ye(e.color || [0, 0, 0]), r = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), i = (a) => new I.Line({
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
        const { x: u, y: f } = this.convertPoint(d, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
        return [u, f];
      }).flat(), h = i(l);
      r.add(h);
    });
    const s = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: r.toJSON(),
      konvaClientRect: r.getClientRect(),
      title: e.titleObj.str,
      type: k.FREEHAND,
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
    return r.destroy(), s;
  }
}
class Ls extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Ye(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, i = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), s = (p, g) => new I.Line({
      strokeScaleEnabled: !1,
      stroke: n,
      strokeWidth: r,
      hitStrokeWidth: 20,
      dash: e.borderStyle.style === 2 ? e.borderStyle.dashArray : [],
      globalCompositeOperation: "source-over",
      points: p
    }), { x: a, y: l, x1: h, y1: d } = this.convertCoordinates(
      e.lineCoordinates,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), u = s([a, l, h, d], e.lineEndings);
    i.add(u);
    const f = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: i.toJSON(),
      konvaClientRect: i.getClientRect(),
      title: e.titleObj.str,
      type: k.FREEHAND,
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
    return i.destroy(), f;
  }
}
class _s extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Ye(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, i = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), a = ((h) => {
      const d = [];
      return h?.forEach((u) => {
        const { x: f, y: p } = this.convertPoint(u, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
        d.push(f), d.push(p);
      }), new I.Line({
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
    i.add(a);
    const l = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: i.toJSON(),
      konvaClientRect: i.getClientRect(),
      title: e.titleObj.str,
      type: k.FREEHAND,
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
class Os extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Ye(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, i = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), a = ((h) => {
      const d = [];
      return h?.forEach((u) => {
        const { x: f, y: p } = this.convertPoint(u, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
        d.push(f), d.push(p);
      }), new I.Line({
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
    i.add(a);
    const l = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: i.toJSON(),
      konvaClientRect: i.getClientRect(),
      title: e.titleObj.str,
      type: k.FREEHAND,
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
class Hs extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    if (e.inReplyTo) return null;
    const n = Ye(e.color || [0, 0, 0]), { x: r, y: i } = this.convertRect(e.rect, e.pageViewer.viewport.scale, e.pageViewer.viewport.height), s = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), a = Uo({ x: r, y: i, fill: n });
    s.add(...a);
    const l = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: s.toJSON(),
      konvaClientRect: s.getClientRect(),
      title: e.titleObj.str,
      type: k.NOTE,
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
function Tn(o, e = 15) {
  if (o.length < 2) return "";
  const t = e * 1.3, n = o.reduce(
    (i, s) => ({ x: i.x + s.x, y: i.y + s.y }),
    { x: 0, y: 0 }
  );
  n.x /= o.length, n.y /= o.length;
  let r = "";
  for (let i = 0; i < o.length - 1; i++) {
    const s = o[i], a = o[i + 1], l = a.x - s.x, h = a.y - s.y, d = Math.hypot(l, h), u = Math.atan2(h, l), f = Math.cos(u + Math.PI / 2), p = Math.sin(u + Math.PI / 2), g = (s.x + a.x) / 2, m = (s.y + a.y) / 2, v = n.x - g, y = n.y - m, T = f * v + p * y > 0 ? -1 : 1, S = Math.max(2, Math.floor(d / t));
    for (let x = 0; x < S; x++) {
      const N = x / S, F = (x + 1) / S, U = s.x + l * N, $ = s.y + h * N, j = s.x + l * F, _ = s.y + h * F, E = (U + j) / 2 + f * e * T, R = ($ + _) / 2 + p * e * T;
      i === 0 && x === 0 && (r += `M ${U} ${$} `), r += `Q ${E} ${R} ${j} ${_} `;
    }
  }
  return r;
}
class Gs extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Ye(e.color || [0, 0, 0]), i = ("inkLists" in e ? e.inkLists?.[0] ?? [] : e.vertices ?? []).map(
      (d) => this.convertPoint(
        d,
        e.pageViewer.viewport.scale,
        e.pageViewer.viewport.height
      )
    );
    if (i.length < 3) return null;
    const s = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), a = "inkLists" in e ? i.map((d, u) => `${u === 0 ? "M" : "L"} ${d.x} ${d.y}`).join(" ") : Tn([...i, i[0]]), l = new I.Path({
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
    s.add(l);
    const h = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: s.toJSON(),
      konvaClientRect: s.getClientRect(),
      title: e.titleObj.str,
      type: k.CLOUD,
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
    return s.destroy(), h;
  }
}
function Bn(o, e) {
  return Math.hypot(e.x - o.x, e.y - o.y);
}
class Us extends Ke {
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
    )), i = r[0], s = r[1], a = r[3], l = r[4], h = a && l ? { x: (a.x + l.x) / 2, y: (a.y + l.y) / 2 } : void 0, d = Ye(e.color || [0, 0, 0]), u = new I.Group({ draggable: !1, name: Le, id: e.id });
    u.add(new I.Arrow({
      points: [i.x, i.y, s.x, s.y],
      stroke: d,
      fill: d,
      strokeWidth: e.borderStyle.width || 1,
      opacity: this.inkLayerMetadata?.opacity ?? 1,
      pointerLength: h ? Bn(s, h) : 10,
      pointerWidth: a && l ? Bn(a, l) : 10,
      lineCap: "round",
      lineJoin: "round",
      hitStrokeWidth: 20,
      strokeScaleEnabled: !1
    }));
    const f = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: u.toJSON(),
      konvaClientRect: u.getClientRect(),
      title: e.titleObj.str,
      type: k.ARROW,
      color: d,
      pdfjsType: oe.LINE,
      subtype: "Arrow",
      date: e.modificationDate,
      contentsObj: { text: e.contentsObj.str },
      comments: this.getComments(e, t),
      user: { id: e.titleObj.str, name: e.titleObj.str },
      native: !0
    };
    return u.destroy(), f;
  }
}
class zs extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Ye(e.color || [0, 0, 0]), { x: r, y: i } = this.convertRect(
      e.rect,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), s = new I.Group({ draggable: !1, name: Le, id: e.id });
    s.add(new I.Text({
      x: r,
      y: i,
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
      konvaString: s.toJSON(),
      konvaClientRect: s.getClientRect(),
      title: e.titleObj.str,
      type: k.FREETEXT,
      color: n,
      pdfjsType: oe.FREETEXT,
      subtype: "FreeText",
      date: e.modificationDate,
      contentsObj: { text: e.contentsObj.str },
      comments: this.getComments(e, t),
      user: { id: e.titleObj.str, name: e.titleObj.str },
      native: !0
    };
    return s.destroy(), a;
  }
}
const Fs = "pdfjs_internal_editor_";
class js {
  pdfViewerApplication;
  constructor(e) {
    this.pdfViewerApplication = e;
  }
  async getAnnotations() {
    const e = this.pdfViewerApplication.pdfDocument, t = this.pdfViewerApplication, n = e.numPages, r = Array.from(
      { length: n },
      (s, a) => e.getPage(a + 1).then((l) => {
        const h = t.getPageView(a);
        return l.getAnnotations().then(
          (d) => d.map((u) => ({
            ...u,
            pageNumber: a + 1,
            pageViewer: h
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
      const n = await In.load(await t.getData());
      n.getPages().forEach((r) => {
        r.node.lookupMaybe(z.of("Annots"), So)?.asArray().forEach((s) => {
          const a = n.context.lookupMaybe(s, bn), l = a?.get(z.of("Subtype"))?.toString(), h = a?.lookupMaybe(z.of("BE"), bn), d = l === "/Polygon" && (h?.get(z.of("S"))?.toString() === "/C" || a?.get(z.of("IT"))?.toString() === "/PolygonCloud"), u = a?.get(z.of("InkLayerType"))?.toString().slice(1);
          if (!d && !(u === "Cloud" && l === "/Ink" || u === "FreeText" && l === "/Text" || u === "Arrow" && l === "/Ink")) return;
          const p = a?.get(z.of("NM")), g = p ? n.context.lookup(p) : void 0, m = g instanceof re || g instanceof bo ? g.decodeText() : s instanceof $r ? `${s.objectNumber}R` : void 0;
          if (!m) return;
          const v = d ? "Cloud" : u;
          if (v !== "Cloud" && v !== "FreeText" && v !== "Arrow") return;
          const y = a?.lookupMaybe(z.of("InkLayerFontSize"), Q)?.asNumber(), T = a?.lookupMaybe(z.of("InkLayerTextWidth"), Q)?.asNumber(), S = a?.lookupMaybe(z.of("CA"), Q)?.asNumber();
          e.set(m, { type: v, fontSize: y, textWidth: T, opacity: S });
        });
      });
    } catch (n) {
      console.warn("InkLayer could not inspect PDF annotation metadata.", n);
    }
    return e;
  }
  decodeAnnotation(e, t, n) {
    const r = {
      [oe.CIRCLE]: Ns,
      [oe.FREETEXT]: Is,
      [oe.HIGHLIGHT]: un,
      [oe.UNDERLINE]: un,
      [oe.STRIKEOUT]: un,
      [oe.SQUARE]: Ms,
      [oe.INK]: Ds,
      [oe.LINE]: Ls,
      [oe.POLYGON]: _s,
      [oe.POLYLINE]: Os,
      [oe.TEXT]: Hs
    }, i = n.get(e.id);
    let s = r[e.annotationType];
    return i?.type === "Cloud" && (e.annotationType === oe.POLYGON || e.annotationType === oe.INK) && (s = Gs), i?.type === "FreeText" && e.annotationType === oe.TEXT && (s = zs), i?.type === "Arrow" && e.annotationType === oe.INK && (s = Us), s ? new s({
      pdfViewerApplication: this.pdfViewerApplication,
      id: e.id,
      inkLayerMetadata: i
    }).decodePdfAnnotation(e, t) : null;
  }
  /**
   * 在 pdf store 中 清除原有 pdf 注释
   * @param annotation
   */
  cleanAnnotationStore(e) {
    this.pdfViewerApplication?.pdfDocument?.annotationStorage?.setValue(`${Fs}${e.id}`, {
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
      const i = this.decodeAnnotation(r, e, t);
      i && n.set(r.id, i);
    }), n;
  }
}
class Ws extends Te {
  arrow;
  // 当前正在绘制的箭头对象
  startPoint;
  // 起点坐标
  constructor(e) {
    super({ ...e, editorType: k.ARROW }), this.arrow = null, this.startPoint = { x: 0, y: 0 };
  }
  mouseDownHandler(e) {
    if (e.currentTarget !== this.konvaStage) return;
    this.arrow = null, this.isPainting = !0, this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup);
    const t = this.konvaStage.getRelativePointerPosition();
    t && (this.startPoint = { x: t.x, y: t.y }, this.arrow = new I.Arrow({
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
    return Math.hypot(t, n) < Te.MinSize;
  }
  /**
   * @description 更改注释样式
   * @param annotationStore
   * @param styles
   */
  changeStyle(e, t) {
    const n = e.id, r = this.getShapeGroupById(n);
    if (r) {
      r.getChildren().forEach((s) => {
        if (s instanceof I.Arrow) {
          if (t.color !== void 0 && (s.stroke(t.color), s.fill(t.color)), t.strokeWidth !== void 0) {
            const a = t.strokeWidth;
            s.strokeWidth(a);
            const u = Math.max(6, Math.min(30, a * 5));
            s.pointerLength(u), s.pointerWidth(u);
          }
          t.opacity !== void 0 && s.opacity(t.opacity);
        }
      });
      const i = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (i.color = t.color), this.setChanged(n, i);
    }
  }
}
class $s extends Te {
  cloudPath = null;
  points = [];
  startRect = null;
  startRectSize = 12;
  constructor(e) {
    super({ ...e, editorType: k.CLOUD }), this.konvaStage.on("dblclick", this.handleDoubleClick), window.addEventListener("keyup", this.handleKeyUp);
  }
  handleKeyUp = (e) => {
    e.key === "Escape" && this.isPainting && this.cancelDrawing();
  };
  cancelDrawing() {
    this.isPainting = !1, this.points = [], this.cloudPath && (this.cloudPath.destroy(), this.cloudPath = null), this.startRect && (this.startRect.destroy(), this.startRect = null), this.currentShapeGroup && (this.delShapeGroup(this.currentShapeGroup.konvaGroup.id()), this.currentShapeGroup = null), this.getBgLayer().batchDraw();
  }
  mouseDownHandler(e) {
    const t = this.konvaStage.getRelativePointerPosition();
    t && (this.points.push(t), this.isPainting || (this.isPainting = !0, this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup), this.cloudPath = new I.Path({
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
        const e = [...this.points, this.points[0]], t = Tn(e);
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
    const n = Tn(t);
    this.cloudPath.data(n);
  }
  /**
   * @description 绘制起点提示矩形
   * @param pos 起点位置
   */
  drawStartRect(e) {
    this.startRect = new I.Rect({
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
      r.getChildren().forEach((s) => {
        s instanceof I.Path && (t.color !== void 0 && s.stroke(t.color), t.strokeWidth !== void 0 && s.strokeWidth(t.strokeWidth), t.opacity !== void 0 && s.opacity(t.opacity));
      });
      const i = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (i.color = t.color), this.setChanged(n, i);
    }
  }
}
const Bs = {
  [k.NONE]: "note",
  [k.SELECT]: "note",
  // SELECT 不是真正的批注类型
  [k.HIGHLIGHT]: "text-markup",
  [k.STRIKEOUT]: "text-markup",
  [k.UNDERLINE]: "text-markup",
  [k.FREETEXT]: "note",
  [k.RECTANGLE]: "shape",
  [k.CIRCLE]: "shape",
  [k.FREEHAND]: "ink",
  [k.FREE_HIGHLIGHT]: "ink",
  [k.SIGNATURE]: "stamp",
  [k.STAMP]: "stamp",
  [k.NOTE]: "note",
  [k.ARROW]: "line",
  [k.CLOUD]: "shape"
}, Vs = {
  [k.NONE]: "rect",
  [k.SELECT]: "rect",
  [k.HIGHLIGHT]: "quad",
  [k.STRIKEOUT]: "quad",
  [k.UNDERLINE]: "quad",
  [k.FREETEXT]: "rect",
  [k.RECTANGLE]: "rect",
  [k.CIRCLE]: "rect",
  // 实际渲染用 rect 包围盒
  [k.FREEHAND]: "path",
  [k.FREE_HIGHLIGHT]: "path",
  [k.SIGNATURE]: "rect",
  [k.STAMP]: "rect",
  [k.NOTE]: "rect",
  [k.ARROW]: "line",
  [k.CLOUD]: "path"
}, Ys = {
  Highlight: "highlight",
  Underline: "underline",
  Squiggly: "squiggly",
  StrikeOut: "strikeout"
}, Ks = {
  highlight: "Highlight",
  underline: "Underline",
  squiggly: "Squiggly",
  strikeout: "StrikeOut"
}, Xs = {
  Square: "rect",
  Circle: "ellipse",
  Polygon: "polygon",
  PolyLine: "polygon",
  Cloud: "cloud"
};
function It(o) {
  const e = Bs[o.type] || "note", t = qs(o), n = {
    pageIndex: o.pageNumber - 1,
    // 转换为 0-based
    geometry: t,
    coordinateSystem: "pdf-user-space"
  }, r = Js(o, e), i = {
    strokeColor: o.color || void 0,
    fillColor: o.color ? Zs(o.color, 0.3) : void 0,
    opacity: 1
  }, s = {}, a = {
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
    appearance: i,
    relations: s,
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
function qs(o) {
  const e = Vs[o.type] || "rect", { x: t, y: n, width: r, height: i } = o.konvaClientRect;
  switch (e) {
    case "rect":
      return { type: "rect", rect: { x: t, y: n, width: r, height: i } };
    case "quad":
      return {
        type: "quad",
        quads: [{
          p1: { x: t, y: n },
          p2: { x: t + r, y: n },
          p3: { x: t, y: n + i },
          p4: { x: t + r, y: n + i }
        }]
      };
    case "line":
      return { type: "line", start: { x: t, y: n }, end: { x: t + r, y: n + i } };
    case "path":
      return {
        type: "path",
        points: [{ x: t, y: n }, { x: t + r, y: n }, { x: t + r, y: n + i }, { x: t, y: n + i }],
        closed: !0
      };
    case "poly":
      return {
        type: "poly",
        points: [{ x: t, y: n }, { x: t + r, y: n }, { x: t + r, y: n + i }, { x: t, y: n + i }],
        closed: !0
      };
  }
}
function Js(o, e) {
  const t = o.subtype;
  switch (e) {
    case "text-markup":
      return {
        kind: "text-markup",
        variant: Ys[t] || "highlight",
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
        shape: o.type === k.CLOUD ? "cloud" : Xs[t] || "rect"
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
function Zs(o, e) {
  if (o.startsWith("rgba")) return o;
  if (o.startsWith("#")) {
    const t = o.slice(1), n = parseInt(t.slice(0, 2), 16), r = parseInt(t.slice(2, 4), 16), i = parseInt(t.slice(4, 6), 16);
    return `rgba(${n}, ${r}, ${i}, ${e})`;
  }
  return o;
}
function Qs(o) {
  const e = o.kind, t = o.extensions, n = t?.legacy, r = t?.konva, i = o.target.geometry, s = t?.pdfjs?.subtype || oa(e, o.payload), a = na(t?.pdfjs?.type) ?? ta(e, o.payload), l = n?.annotationType ?? (e === "shape" && s === "PolyLine" ? k.CLOUD : ea(e, o.payload));
  return {
    id: o.id,
    referenceNumber: o.meta?.referenceNumber,
    pageNumber: o.target.pageIndex + 1,
    // 转换回 1-based
    konvaString: r?.serialized || "",
    konvaClientRect: r?.clientRect || aa(i),
    title: n?.title || ra(o.payload),
    type: l,
    color: o.appearance?.strokeColor || null,
    subtype: s,
    pdfjsType: a,
    date: o.meta?.createdAt || null,
    contentsObj: n?.contentsObj || ia(o.payload),
    comments: n?.comments || [],
    user: sa(o.meta),
    native: o.meta?.isNative || !1
  };
}
function ea(o, e) {
  if (o === "shape" && e?.kind === "shape") {
    if (e.shape === "cloud") return k.CLOUD;
    if (e.shape === "ellipse") return k.CIRCLE;
  }
  return {
    "text-markup": k.HIGHLIGHT,
    note: k.NOTE,
    ink: k.FREEHAND,
    shape: k.RECTANGLE,
    line: k.ARROW,
    stamp: k.STAMP,
    file: k.STAMP
  }[o] || k.NONE;
}
function ta(o, e) {
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
function na(o) {
  if (!o) return;
  const e = oe[o];
  return typeof e == "number" ? e : void 0;
}
function oa(o, e) {
  if (!e) return "None";
  switch (o) {
    case "text-markup":
      return e.kind !== "text-markup" ? "Highlight" : Ks[e.variant];
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
function ra(o) {
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
function ia(o) {
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
function sa(o) {
  return o?.authorId ? typeof o.authorId == "string" ? { id: o.authorId, name: o.authorId } : {
    id: o.authorId.id,
    name: o.authorId.name || o.authorId.id
  } : { id: "unknown", name: "Unknown" };
}
function aa(o) {
  switch (o.type) {
    case "rect":
      return {
        x: o.rect.x,
        y: o.rect.y,
        width: o.rect.width,
        height: o.rect.height
      };
    case "quad": {
      const e = o.quads.flatMap((s) => [s.p1, s.p2, s.p3, s.p4]), t = e.map((s) => s.x), n = e.map((s) => s.y), r = Math.min(...t), i = Math.min(...n);
      return {
        x: r,
        y: i,
        width: Math.max(...t) - r,
        height: Math.max(...n) - i
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
      const e = o.points.map((i) => i.x), t = o.points.map((i) => i.y), n = Math.min(...e), r = Math.min(...t);
      return {
        x: n,
        y: r,
        width: Math.max(...e) - n,
        height: Math.max(...t) - r
      };
    }
  }
}
function Mt(o) {
  return o.map((e) => It(e));
}
function ca(o) {
  return o.map((e) => Qs(e));
}
function Fo(o) {
  return !!(o?.id && o.id !== "null");
}
function Vn(o, e) {
  return Fo(o) && !!e?.id && o.id === e?.id;
}
class la {
  getCurrentUser;
  getPermissions;
  reportedResolvers = /* @__PURE__ */ new WeakSet();
  constructor({ getCurrentUser: e, getPermissions: t }) {
    this.getCurrentUser = e, this.getPermissions = t;
  }
  can(e, t, n) {
    const r = this.getCurrentUser(), i = this.getPermissions(), a = (i?.mode ?? "unrestricted") === "unrestricted" ? !0 : this.ownerOnlyDecision(e, r, t, n);
    if (!i?.can) return a;
    try {
      return i.can({
        action: e,
        currentUser: r,
        annotation: t ? It(t) : void 0,
        comment: n,
        defaultAllowed: a
      }) ?? a;
    } catch (l) {
      return this.reportedResolvers.has(i.can) || (this.reportedResolvers.add(i.can), console.error("InkLayer annotation permission resolver failed.", l)), !1;
    }
  }
  ownerOnlyDecision(e, t, n, r) {
    switch (e) {
      case "annotation.create":
      case "annotation.comment":
        return Fo(t);
      case "annotation.transform":
      case "annotation.edit":
      case "annotation.delete":
      case "annotation.change-status":
        return Vn(t, n?.user);
      case "comment.edit":
      case "comment.delete":
        return Vn(t, r?.user);
    }
  }
}
function pt(o) {
  return typeof o == "number" && Number.isSafeInteger(o) && o > 0;
}
function da(o) {
  const e = /^D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(?:([Zz])|([+-])(\d{2})'?(\d{2})?'?)?$/.exec(o);
  if (!e) return null;
  const [, t, n, r, i, s, a, l, h, d, u] = e, f = Number(t), p = Number(n), g = Number(r), m = Number(i), v = Number(s), y = Number(a);
  if (p < 1 || p > 12 || g < 1 || g > 31 || m > 23 || v > 59 || y > 59 || Number(d || 0) > 23 || Number(u || 0) > 59)
    return null;
  const T = Date.UTC(
    f,
    p - 1,
    g,
    m,
    v,
    y
  );
  if (!Number.isFinite(T)) return null;
  const S = new Date(T);
  if (S.getUTCFullYear() !== f || S.getUTCMonth() !== p - 1 || S.getUTCDate() !== g)
    return null;
  if (l || !h) return T;
  const x = (Number(d) * 60 + Number(u || 0)) * 60 * 1e3;
  return T - (h === "+" ? x : -x);
}
function Yn(o) {
  if (!o) return null;
  const e = da(o);
  if (e !== null) return e;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/.test(o))
    return null;
  const t = Date.parse(o);
  return Number.isFinite(t) ? t : null;
}
function ua(o, e) {
  const t = Yn(o.date), n = Yn(e.date);
  return t !== null && n !== null && t !== n ? t - n : t !== null && n === null ? -1 : t === null && n !== null ? 1 : o.pageNumber !== e.pageNumber ? o.pageNumber - e.pageNumber : o.id < e.id ? -1 : o.id > e.id ? 1 : 0;
}
function Xt(o) {
  let e = 0;
  for (const t of o)
    pt(t.referenceNumber) && t.referenceNumber > e && (e = t.referenceNumber);
  return e;
}
function xn(o) {
  if (o >= Number.MAX_SAFE_INTEGER)
    throw new RangeError("Annotation reference number limit reached.");
  return o + 1;
}
function Kn(o) {
  const e = [...o].sort(ua), t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), r = [];
  e.forEach((s) => {
    const a = s.referenceNumber;
    pt(a) && !t.has(a) ? (t.add(a), n.set(s.id, a)) : r.push(s);
  });
  let i = r.length > 0 ? xn(Xt(e)) : 1;
  return r.forEach((s, a) => {
    n.set(s.id, i), a < r.length - 1 && (i = xn(i));
  }), o.map((s) => {
    const a = n.get(s.id);
    return s.referenceNumber === a ? s : { ...s, referenceNumber: a };
  });
}
function ha(o, e, t = 1) {
  const n = Array.from(e), r = /* @__PURE__ */ new Set();
  for (const s of n)
    pt(s.referenceNumber) && r.add(s.referenceNumber);
  if (pt(o.referenceNumber) && !r.has(o.referenceNumber))
    return o;
  const i = Math.max(
    xn(Xt(n)),
    t
  );
  if (!pt(i))
    throw new RangeError("Annotation reference number limit reached.");
  return { ...o, referenceNumber: i };
}
const jo = 4;
function Wo(o) {
  const e = o.user?.name?.trim();
  return e || o.title?.trim() || null;
}
function pa(o) {
  const e = Wo(o), t = pt(o.referenceNumber);
  return t && e ? `#${o.referenceNumber} · ${e}` : t ? `#${o.referenceNumber}` : e;
}
function fa({
  selectionRect: o,
  labelWidth: e,
  labelHeight: t,
  stageWidth: n,
  stageHeight: r,
  gap: i = jo
}) {
  const s = Math.max(0, n - e), a = Math.max(0, r - t), l = Math.max(0, Math.min(s, o.x + o.width - e)), h = o.y - t - i, d = o.y + o.height + i, u = h >= 0 ? h : Math.max(0, Math.min(a, d));
  return { x: l, y: u };
}
function ga(o, e, t) {
  return o.x < e.x + e.width + t && o.x + o.width + t > e.x && o.y < e.y + e.height + t && o.y + o.height + t > e.y;
}
function ma(o, e, t = jo) {
  const n = /* @__PURE__ */ new Map(), r = [];
  return [...o].sort(
    (s, a) => s.y - a.y || s.x - a.x || s.id.localeCompare(a.id)
  ).forEach((s) => {
    const a = Math.max(0, e - s.height), l = Math.max(1, s.height + t), h = Math.ceil(e / l) + 1;
    let d = { ...s, y: Math.max(0, Math.min(a, s.y)) };
    for (let u = 0; u <= h; u += 1) {
      const p = (u === 0 ? [0] : [u * l, -u * l]).map((g) => ({ ...s, y: s.y + g })).find((g) => g.y >= 0 && g.y <= a && r.every((m) => !ga(g, m, t)));
      if (p) {
        d = p;
        break;
      }
    }
    r.push(d), n.set(d.id, { x: d.x, y: d.y });
  }), n;
}
function va() {
  return navigator.userAgentData?.platform || navigator.platform || navigator.userAgent;
}
function Xn(o, e) {
  return e ? o.key === "Meta" : o.key === "Alt";
}
class ya {
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
  constructor({ primaryColor: e, defaultVisible: t = !1, getAnnotationsByPage: n, getAnnotationGroup: r, canTransform: i }) {
    this.primaryColor = e, this.allVisible = t, this.getAnnotationsByPage = n, this.getAnnotationGroup = r, this.canTransform = i, this.isMac = /mac/i.test(va()), window.addEventListener("keydown", this.handleKeyDown), window.addEventListener("keyup", this.handleKeyUp), window.addEventListener("blur", this.clearShortcutReveal), document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }
  registerPage(e, t, n) {
    this.unregisterPage(e);
    const r = document.createElement("div");
    r.className = fs, r.setAttribute("aria-hidden", "true"), t.appendChild(r), this.pages.set(e, { stage: n, layer: r, labels: /* @__PURE__ */ new Map() }), this.refreshPage(e);
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
    const n = this.getAnnotationsByPage(e), r = new Set(n.map((s) => s.id));
    t.labels.forEach((s, a) => {
      r.has(a) || (this.unbindGroup(a), s.remove(), t.labels.delete(a));
    });
    const i = [];
    n.forEach((s) => {
      const a = this.syncAnnotation(t, s, !1);
      a && i.push(a);
    }), this.shouldRevealAll() ? this.positionVisibleLabels(t, i) : i.forEach(({ label: s, group: a }) => this.positionLabel(t, s, a));
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
    const r = pa(t), i = this.getAnnotationGroup(t, e.stage);
    if (!r || !i)
      return this.unbindGroup(t.id), e.labels.get(t.id)?.remove(), e.labels.delete(t.id), null;
    this.bindGroup(t.id, i);
    let s = e.labels.get(t.id);
    s || (s = document.createElement("div"), s.className = gs, s.dataset.annotationId = t.id, e.layer.appendChild(s), e.labels.set(t.id, s)), s.textContent !== r && (s.textContent = r), s.style.backgroundColor = this.primaryColor, s.style.opacity = String(zo(this.canTransform(t)).authorLabelOpacity);
    const a = this.shouldRevealAll() || t.id === this.selectedId || t.id === this.hoveredId;
    return s.style.display = a ? "block" : "none", a ? (n && this.positionLabel(e, s, i), { id: t.id, label: s, group: i }) : null;
  }
  getLabelPosition(e, t, n) {
    const r = n.getClientRect(), i = 2;
    return fa({
      selectionRect: {
        x: r.x - i,
        y: r.y - i,
        width: r.width + i * 2,
        height: r.height + i * 2
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
    const n = t.map(({ id: i, label: s, group: a }) => ({
      id: i,
      ...this.getLabelPosition(e, s, a),
      width: s.offsetWidth,
      height: s.offsetHeight
    })), r = ma(n, e.stage.height());
    t.forEach(({ id: i, label: s }) => {
      const a = r.get(i);
      a && (s.style.transform = `translate3d(${a.x}px, ${a.y}px, 0)`);
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
    if (!Xn(e, this.isMac)) return;
    const t = this.shouldRevealAll();
    this.pressedRevealKeys.add(e.code || e.key), t !== this.shouldRevealAll() && this.refreshAll();
  };
  handleKeyUp = (e) => {
    if (!Xn(e, this.isMac)) return;
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
const qn = Object.freeze({
  annotationId: null,
  source: null
});
class ba {
  entries = /* @__PURE__ */ new Map();
  listeners = /* @__PURE__ */ new Set();
  sequence = 0;
  snapshot = qn;
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
    for (const [r, i] of this.entries)
      (!t || i.sequence > t.sequence) && (e = r, t = i);
    const n = t?.annotationId ?? null;
    this.snapshot.annotationId === n && this.snapshot.source === e || (this.snapshot = n === null ? qn : { annotationId: n, source: e }, this.listeners.forEach((r) => r(this.snapshot)));
  }
}
class Sa {
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
    const r = this.getAnnotationGroup(t, n), i = r?.getLayer();
    if (!r || !i) return;
    const a = 2 / (Math.abs(n.scaleX()) || 1), l = r.getClientRect({ relativeTo: i });
    this.previewRect = new I.Rect({
      name: ms,
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
    }), i.add(this.previewRect), this.previewRect.moveToTop(), i.batchDraw(), r.on(
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
class wa {
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
      pointerMove: (i) => this.handlePointerMove(e, i),
      pointerLeave: (i) => this.handlePointerLeave(e, i),
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
    const i = {
      x: (n.clientX - r.left) * (t.stage.width() / r.width),
      y: (n.clientY - r.top) * (t.stage.height() / r.height)
    }, l = t.stage.getIntersection(i)?.findAncestor(`.${Le}`)?.id() || null;
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
const hn = 8e3;
function $o(o) {
  return typeof structuredClone == "function" ? structuredClone(o) : JSON.parse(JSON.stringify(o));
}
function pn(o) {
  return $o(o);
}
function Jn(o) {
  return $o(o);
}
class Ca {
  entries = [];
  snapshot = null;
  listeners = /* @__PURE__ */ new Set();
  timer = null;
  remainingMs = hn;
  paused = !1;
  subscribe(e) {
    return this.listeners.add(e), () => this.listeners.delete(e);
  }
  getSnapshot() {
    return this.snapshot;
  }
  add(e, t) {
    this.entries.push(t === void 0 ? e : { ...e, historyId: t }), this.remainingMs = hn, this.setSnapshot(Date.now() + this.remainingMs), this.clearTimer(), this.paused || this.scheduleExpiry();
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
    this.clearTimer(), this.entries = [], this.snapshot = null, this.remainingMs = hn, this.paused = !1, e && this.emit();
  }
  clearTimer() {
    this.timer !== null && (clearTimeout(this.timer), this.timer = null);
  }
  emit() {
    this.listeners.forEach((e) => e());
  }
}
class Zn {
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
function Aa(o) {
  return o == null ? o : typeof structuredClone == "function" ? structuredClone(o) : JSON.parse(JSON.stringify(o));
}
function fn(o) {
  return Object.fromEntries(
    Object.entries(o).map(([e, t]) => [e, Aa(t)])
  );
}
class Ta {
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
  annotationHover = new ba();
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
    defaultShowAnnotationAuthorLabels: i,
    PDFViewerApplication: s,
    onTextSelected: a,
    onAnnotationAdd: l,
    onAnnotationDelete: h,
    onAnnotationSelected: d,
    onAnnotationChanging: u,
    onAnnotationChanged: f
  }) {
    this.primaryColor = e, this.defaultOptions = t, this.currentUser = n, this.annotationPermissions = r, this.permissionController = new la({
      getCurrentUser: () => this.currentUser,
      getPermissions: () => this.annotationPermissions
    }), this.deleteUndoController = new Ca(), this.mutationHistory = new Zn(), this.authorLabels = new ya({
      primaryColor: this.primaryColor,
      defaultVisible: i,
      getAnnotationsByPage: (p) => ce.getState().getByPage(p),
      getAnnotationGroup: (p, g) => g.findOne((m) => m.getType() === "Group" && m.id() === p.id),
      canTransform: (p) => this.permissionController.can("annotation.transform", p)
    }), this.hoverPreview = new Sa({
      getAnnotation: (p) => ce.getState().getAnnotation(p),
      getStage: (p) => this.konvaCanvasStore.get(p)?.konvaStage,
      getAnnotationGroup: (p, g) => g.findOne((m) => m.getType() === "Group" && m.id() === p.id)
    }), this.unsubscribeAnnotationHover = this.annotationHover.subscribe((p) => {
      this.authorLabels.setHovered(p.annotationId), this.hoverPreview.setHovered(null);
    }), this.pdfViewerApplication = s, this.onTextSelected = a, this.onAnnotationAdd = l, this.onAnnotationDelete = h, this.onAnnotationSelected = d, this.onAnnotationChanging = u, this.onAnnotationChanged = f, this.selector = new Rs({
      primaryColor: this.primaryColor,
      // 初始化选择器实例
      konvaCanvasStore: this.konvaCanvasStore,
      getAnnotationStore: (p) => ce.getState().getAnnotation(p),
      canTransform: (p) => this.permissionController.can("annotation.transform", p),
      onSelected: (p, g, m) => {
        const v = ce.getState().getAnnotation(p);
        if (v) {
          const y = this.nextSelectionSource ?? (g ? Ve.CANVAS : Ve.SIDEBAR);
          this.nextSelectionSource = void 0, ce.getState().setSelectedAnnotation(v, y), this.onAnnotationSelected(v, g, m);
        }
      },
      onDeselected: () => {
        this.nextSelectionSource = void 0, ce.getState().clearSelectedAnnotation(), this.onAnnotationSelected(void 0, !1, { x: 0, y: 0, width: 0, height: 0 });
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
      onChanged: async (p, g, m, v, y) => {
        const S = this.findEditorForGroupId(p) ? this.updateStore(p, { konvaString: g, konvaClientRect: v }, !1, "annotation.transform", void 0, !0, `transform:${p}`) : void 0;
        S && this.onAnnotationChanged(S, y);
      },
      onCancel: () => {
        this.onAnnotationChanging();
      },
      onDelete: (p) => {
        this.delete(p, !0);
      }
    }), this.webSelection = new Ps({
      // 初始化 WebSelection 实例
      onSelect: (p) => {
        this.onTextSelected(p);
      },
      onHighlight: (p) => {
        if (!this.can("annotation.create")) return;
        const g = [];
        this.activeHighlightHistoryEntries = g, Object.keys(p).forEach((m) => {
          const v = Number(m), y = p[m], T = this.konvaCanvasStore.get(v);
          if (T) {
            const { konvaStage: S, wrapper: x } = T;
            let N = this.findEditor(v, this.currentAnnotation.type);
            N || (N = new jn(
              {
                primaryColor: this.primaryColor,
                defaultOptions: this.defaultOptions,
                currentUser: this.currentUser,
                pdfViewerApplication: this.pdfViewerApplication,
                konvaStage: S,
                pageNumber: v,
                annotation: this.currentAnnotation,
                onAdd: (F) => {
                  this.saveToStore(F, !1, this.activeHighlightHistoryEntries ?? void 0);
                },
                onChange: (F, U) => {
                  this.updateStore(F, U);
                }
              },
              this.currentAnnotation.type
            ), this.editorStore.set(N.id, N)), N.convertTextSelection(y, x);
          }
        }), this.activeHighlightHistoryEntries = null, g.length > 0 && this.recordHistory({
          undo: () => {
            let m = !0;
            return g.slice().reverse().forEach((v) => {
              m = this.deleteAnnotation(v.annotation.id, !0, !1) && m;
            }), m && this.selector.delete(), m;
          },
          redo: () => {
            let m = !0;
            return g.forEach((v) => {
              m = this.restoreDeletedAnnotation(v) && m;
            }), m;
          }
        });
      }
    }), this.passiveHover = new wa({
      shouldSuppress: () => !!(this.currentAnnotation && !this.currentAnnotation.webSelectionDependencies) || this.webSelection.isRangeSelectionActive(),
      onHoverStart: (p) => {
        this.annotationHover.set("canvas-passive", p);
      },
      onHoverEnd: (p) => {
        this.annotationHover.clear("canvas-passive", p);
      }
    }), this.transform = new js(s), this.bindGlobalEvents();
  }
  setPermissionContext(e, t) {
    const n = this.currentUser?.id !== e.id;
    this.currentUser = e, this.annotationPermissions = t, (n || !this.can("annotation.create")) && this.clearHistory(), this.editorStore.forEach((r) => r.setCurrentUser(e)), this.currentAnnotation?.type !== k.SELECT && !this.can("annotation.create") && this.setDefaultMode(), this.selector.refreshCurrentSelection(), this.authorLabels.refreshAll();
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
    this.activate(Me[0], null);
  }
  syncCurrentAnnotation(e) {
    this.currentAnnotation = e, ce.getState().setCurrentAnnotationType(e);
  }
  ensureMutationHistory() {
    return this.mutationHistory || (this.mutationHistory = new Zn()), this.mutationHistory;
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
    return !!this.updateStore(e, fn(t), !0, null, void 0, !1);
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
    e.code === "Escape" && (this.currentAnnotation?.type === k.SIGNATURE || this.currentAnnotation?.type === k.STAMP) && (ln(Nt), this.setDefaultMode());
  };
  /**
   * 创建绘图容器 (painterWrapper)
   * @param pageView - 当前 PDF 页面视图
   * @param pageNumber - 当前页码
   * @returns 绘图容器元素
   */
  createPainterWrapper(e, t) {
    const n = document.createElement("div");
    return n.id = `${Cn}_page_${t}`, n.classList.add(Cn), e.div.appendChild(n), n;
  }
  /**
   * 创建 Konva Stage
   * @param container - 绘图容器元素
   * @param viewport - 当前 PDF 页面视口
   * @returns Konva Stage
   */
  createKonvaStage(e, t) {
    const n = new I.Stage({
      container: e,
      width: t.width,
      height: t.height,
      scale: { x: t.scale, y: t.scale }
    }), r = new I.Layer();
    return n.add(r), n;
  }
  /**
   * 清理无效的 canvasStore
   */
  cleanUpInvalidStore() {
    this.konvaCanvasStore.forEach((e) => {
      ps(e.wrapper) || this.disposeCanvas(e.pageNumber);
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
    const { konvaStage: r } = n, { scale: i, width: s, height: a } = e.viewport;
    r.scale({ x: i, y: i }), r.width(s), r.height(a), this.authorLabels.refreshPage(t), this.hoverPreview.refresh();
  }
  /**
   * 设置当前模式 (绘画模式、默认模式)
   * @param mode - 模式类型 ('painting', 'default')
   */
  setMode(e) {
    const t = e === "painting";
    document.body.classList.toggle(`${Fn}`, t), Object.values(k).filter((r) => typeof r == "number").map((r) => `${dn}_${r}`).forEach((r) => document.body.classList.remove(r)), ln(Nt), this.currentAnnotation && document.body.classList.add(`${dn}_${this.currentAnnotation?.type}`);
  }
  /**
   * 保存到存储
   */
  saveToStore(e, t = !1, n) {
    if (!t && !this.can("annotation.create")) return;
    const r = t ? e : ha(
      e,
      ce.getState().annotations.values(),
      this.nextAnnotationReferenceNumber
    );
    t || (this.nextAnnotationReferenceNumber = r.referenceNumber + 1);
    const i = Me.find((a) => a.pdfjsAnnotationType === r.pdfjsType);
    if (ce.getState().addAnnotation(r, t), this.authorLabels.refreshAnnotation(r.id), t) return;
    const s = this.createDeletedAnnotationEntry(r);
    n ? n.push(s) : this.recordHistory({
      undo: () => {
        const a = this.deleteAnnotation(r.id, !0, !1);
        return a && this.selector.delete(), a;
      },
      redo: () => this.restoreDeletedAnnotation(s)
    }), i && (i.isOnce ? this.selectAnnotation(r.id, !1, Ve.CANVAS) : ce.getState().setSelectedAnnotation(r, Ve.CANVAS)), this.onAnnotationAdd(r, t, i);
  }
  /**
   * 更新存储
   */
  updateStore(e, t, n = !0, r = "annotation.edit", i, s = r !== null, a) {
    const l = ce.getState().getAnnotation(e);
    if (!l || r && !this.can(r, l, i)) return;
    const h = s ? fn(
      Object.fromEntries(
        Object.keys(t).map((u) => [u, l[u]])
      )
    ) : null, d = ce.getState().updateAnnotation(e, t);
    if (d && this.authorLabels.refreshAnnotation(e), d && n && this.onAnnotationChanged(d), d && h) {
      const u = fn(
        Object.fromEntries(
          Object.keys(t).map((f) => [f, d[f]])
        )
      );
      this.recordAnnotationPatchChange(e, h, u, a);
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
      if (r instanceof Wn) {
        r.activateWithSignature(e, n, this.tempDataTransfer);
        return;
      }
      if (r instanceof $n) {
        r.activateWithStamp(e, n, this.tempDataTransfer);
        return;
      }
      r.activate(e, n);
      return;
    }
    let i = null;
    switch (n.type) {
      case k.FREETEXT:
        i = new xs({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: n,
          onAdd: (s) => {
            this.saveToStore(s);
          },
          onChange: (s, a) => {
            this.updateStore(s, a);
          }
        });
        break;
      case k.RECTANGLE:
        i = new ks({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: n,
          onAdd: (s) => {
            this.saveToStore(s);
          },
          onChange: (s, a) => {
            this.updateStore(s, a);
          }
        });
        break;
      case k.ARROW:
        i = new Ws({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: n,
          onAdd: (s) => {
            this.saveToStore(s);
          },
          onChange: (s, a) => {
            this.updateStore(s, a);
          }
        });
        break;
      case k.CLOUD:
        i = new $s({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: n,
          onAdd: (s) => {
            this.saveToStore(s);
          },
          onChange: (s, a) => {
            this.updateStore(s, a);
          }
        });
        break;
      case k.CIRCLE:
        i = new ys({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: n,
          onAdd: (s) => {
            this.saveToStore(s);
          },
          onChange: (s, a) => {
            this.updateStore(s, a);
          }
        });
        break;
      case k.NOTE:
        i = new Es({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: n,
          onAdd: (s) => {
            this.saveToStore(s);
          },
          onChange: () => {
          }
        });
        break;
      case k.FREEHAND:
        i = new bs({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: n,
          onAdd: (s) => {
            this.saveToStore(s);
          },
          onChange: (s, a) => {
            this.updateStore(s, a);
          }
        });
        break;
      case k.FREE_HIGHLIGHT:
        i = new Ss({
          primaryColor: this.primaryColor,
          defaultOptions: this.defaultOptions,
          currentUser: this.currentUser,
          pdfViewerApplication: this.pdfViewerApplication,
          konvaStage: e,
          pageNumber: t,
          annotation: n,
          onAdd: (s) => {
            this.saveToStore(s);
          },
          onChange: (s, a) => {
            this.updateStore(s, a);
          }
        });
        break;
      case k.SIGNATURE:
        i = new Wn(
          {
            primaryColor: this.primaryColor,
            defaultOptions: this.defaultOptions,
            currentUser: this.currentUser,
            pdfViewerApplication: this.pdfViewerApplication,
            konvaStage: e,
            pageNumber: t,
            annotation: n,
            onAdd: (s) => {
              this.saveToStore(s);
            },
            onChange: () => {
            }
          },
          this.tempDataTransfer
        );
        break;
      case k.STAMP:
        i = new $n(
          {
            primaryColor: this.primaryColor,
            defaultOptions: this.defaultOptions,
            currentUser: this.currentUser,
            pdfViewerApplication: this.pdfViewerApplication,
            konvaStage: e,
            pageNumber: t,
            annotation: n,
            onAdd: (s) => {
              this.saveToStore(s);
            },
            onChange: () => {
            }
          },
          this.tempDataTransfer
        );
        break;
      case k.HIGHLIGHT:
      case k.UNDERLINE:
      case k.STRIKEOUT:
        i = new jn(
          {
            primaryColor: this.primaryColor,
            defaultOptions: this.defaultOptions,
            currentUser: this.currentUser,
            pdfViewerApplication: this.pdfViewerApplication,
            konvaStage: e,
            pageNumber: t,
            annotation: n,
            onAdd: (s) => {
              this.saveToStore(s);
            },
            onChange: (s, a) => {
              this.updateStore(s, a);
            }
          },
          n.type
        );
        break;
      case k.SELECT:
        this.selector.activate(t);
        break;
      default:
        console.warn(`未实现的批注类型: ${n.type}`);
        return;
    }
    i && this.editorStore.set(i.id, i);
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
    ce.getState().getByPage(e).forEach((r) => {
      let i = this.findEditor(e, r.type);
      if (!i) {
        const s = Me.find((a) => a.type === r.type);
        this.enableEditor({ konvaStage: t.konvaStage, pageNumber: e, annotation: s }), i = this.findEditor(e, r.type);
      }
      i && i.addSerializedGroupToLayer(t.konvaStage, r.konvaString);
    }), this.authorLabels.refreshPage(e), this.hoverPreview.refresh();
  }
  /**
   * 删除批注
   * @param id - 批注 ID
   */
  deleteAnnotation(e, t = !1, n = !0) {
    const r = ce.getState().getAnnotation(e);
    if (!r || n && !this.can("annotation.delete", r)) return !1;
    this.annotationHover.clearAnnotation(e), ce.getState().removeAnnotation(e), this.authorLabels.remove(e);
    const i = this.findEditor(r.pageNumber, r.type), s = this.konvaCanvasStore.get(r.pageNumber);
    return i && s && i.deleteGroup(e, s.konvaStage), t && this.onAnnotationDelete(e), !0;
  }
  createDeletedAnnotationEntry(e) {
    const t = Array.from(ce.getState().annotations.keys()), r = this.konvaCanvasStore?.get(e.pageNumber)?.konvaStage?.findOne((i) => i.getType() === "Group" && i.name() === Le && i.id() === e.id);
    return {
      kind: "annotation",
      annotation: pn(e),
      storeIndex: Math.max(0, t.indexOf(e.id)),
      konvaIndex: r?.zIndex() ?? null
    };
  }
  restoreDeletedAnnotation(e) {
    const t = pn(e.annotation);
    if (!ce.getState().restoreAnnotation(t, e.storeIndex))
      return console.warn(`Annotation with id ${t.id} already exists; delete undo was skipped.`), !1;
    const r = this.konvaCanvasStore.get(t.pageNumber);
    if (r) {
      let s = this.findEditor(t.pageNumber, t.type);
      if (!s) {
        const l = Me.find((h) => h.type === t.type);
        l && (this.enableEditor({
          konvaStage: r.konvaStage,
          pageNumber: t.pageNumber,
          annotation: l
        }), s = this.findEditor(t.pageNumber, t.type));
      }
      s?.addSerializedGroupToLayer(r.konvaStage, t.konvaString);
      const a = r.konvaStage.findOne((l) => l.getType() === "Group" && l.name() === Le && l.id() === t.id);
      if (a && e.konvaIndex !== null) {
        const l = a.getParent()?.getChildren().length ?? 1;
        a.zIndex(Math.min(e.konvaIndex, l - 1));
      }
      r.konvaStage.batchDraw();
    }
    this.authorLabels.refreshAnnotation(t.id), this.hoverPreview.refresh();
    const i = Me.find((s) => s.pdfjsAnnotationType === t.pdfjsType);
    return this.onAnnotationAdd(t, !1, i), !0;
  }
  restoreDeletedComment(e) {
    const t = ce.getState().getAnnotation(e.annotationId);
    if (!t || t.comments.some((i) => i.id === e.comment.id)) return !1;
    const n = [...t.comments], r = Math.max(0, Math.min(e.commentIndex, n.length));
    return n.splice(r, 0, Jn(e.comment)), !!this.updateStore(t.id, { comments: n }, !0, null);
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
    if (e?.type !== k.SELECT && e && !this.can("annotation.create")) {
      this.syncCurrentAnnotation(null), this.disablePainting(), this.setDefaultMode();
      return;
    }
    if (this.syncCurrentAnnotation(e), this.passiveHover.clear(), this.disablePainting(), this.saveTempDataTransfer(t || ""), !!e) {
      switch (e.type) {
        case k.FREETEXT:
        case k.RECTANGLE:
        case k.CIRCLE:
        case k.FREEHAND:
        case k.FREE_HIGHLIGHT:
        case k.SIGNATURE:
        case k.STAMP:
        case k.SELECT:
        case k.NOTE:
        case k.ARROW:
        case k.CLOUD:
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
  selectAnnotation(e, t, n = t ? Ve.CANVAS : Ve.SIDEBAR) {
    this.setDefaultMode(), this.nextSelectionSource = n, this.selector.select(e, t);
  }
  /**
   * @description 将annotation 存入 store, 包含外部 annotation 和 pdf 文件上的 annotation
   */
  async initAnnotationsOnce(e, t) {
    const n = Kn(e);
    if (this.nextAnnotationReferenceNumber = Math.min(
      Xt(n) + 1,
      Number.MAX_SAFE_INTEGER
    ), t) {
      const s = await this.transform.decodePdfAnnotation();
      s.forEach((a) => {
        this.saveToStore(a, !0);
      }), n.forEach((a) => {
        s.has(a.id) ? this.updateStore(a.id, a, !0, null) : this.saveToStore(a, !0);
      });
    } else
      n.forEach((s) => {
        this.saveToStore(s, !0);
      });
    const r = ce.getState(), i = Kn(
      Array.from(r.annotations.values())
    );
    r.setAnnotationReferenceNumbers(
      new Map(i.map((s) => [
        s.id,
        s.referenceNumber
      ]))
    ), this.nextAnnotationReferenceNumber = Math.min(
      Xt(i) + 1,
      Number.MAX_SAFE_INTEGER
    );
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
    const n = ce.getState().getAnnotation(e);
    if (!n || !this.can("annotation.delete", n)) return !1;
    const r = this.createDeletedAnnotationEntry(n), i = this.deleteAnnotation(e, t);
    if (i && this.selector.delete(), !i) return !1;
    const s = this.recordHistory({
      undo: () => this.restoreDeletedAnnotation(r),
      redo: () => {
        const a = this.deleteAnnotation(e, !0, !1);
        return a && this.selector.delete(), a;
      }
    });
    return t && this.deleteUndoController?.add(r, s ?? void 0), i;
  }
  deleteCommentWithoutHistory(e, t) {
    const n = ce.getState().getAnnotation(e);
    if (!n || !n.comments.some((i) => i.id === t)) return !1;
    const r = n.comments.filter((i) => i.id !== t);
    return !!this.updateStore(e, { comments: r }, !0, null, void 0, !1);
  }
  deleteComment(e, t) {
    const n = ce.getState().getAnnotation(e), r = n?.comments.findIndex((d) => d.id === t) ?? -1;
    if (!n || r < 0) return !1;
    const i = n.comments[r];
    if (!this.can("comment.delete", n, i)) return !1;
    const s = {
      kind: "comment",
      annotationId: e,
      annotationReferenceNumber: n.referenceNumber,
      previewAnnotation: pn(n),
      comment: Jn(i),
      commentIndex: r
    }, a = n.comments.filter((d) => d.id !== t);
    if (!this.updateStore(e, { comments: a }, !0, "comment.delete", i, !1)) return !1;
    const h = this.recordHistory({
      undo: () => this.restoreDeletedComment(s),
      redo: () => this.deleteCommentWithoutHistory(e, t)
    });
    return this.deleteUndoController?.add(s, h ?? void 0), !0;
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
      const i = r.historyId !== void 0 && this.mutationHistory ? this.mutationHistory.undoEntry(r.historyId) : r.kind === "annotation" ? this.restoreDeletedAnnotation(r) : this.restoreDeletedComment(r);
      r.kind === "annotation" && !i && n.add(r.annotation.id), i && (t += 1);
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
    const t = this.cancelHighlightRequest(), n = e.pageNumber - 1, r = this.pdfViewerApplication._pages?.[n] || this.pdfViewerApplication.getPageView(n), { x: i, y: s } = e.konvaClientRect;
    if (r?.viewport) {
      const h = i * r.viewport.scale, d = Math.max(0, s * r.viewport.scale - 200), [u, f] = r.viewport.convertToPdfPoint(h, d);
      this.pdfViewerApplication.scrollPageIntoView({
        pageNumber: e.pageNumber,
        destArray: [null, { name: "XYZ" }, u, f, null],
        allowNegativeOffset: !0
      });
    } else
      this.pdfViewerApplication.scrollPageIntoView({
        pageNumber: e.pageNumber
      });
    const a = 30, l = 100;
    return new Promise((h) => {
      this.resolveHighlightRequest = h;
      const d = (f) => {
        t === this.highlightRequestId && (this.highlightRetryTimer !== null && (window.clearTimeout(this.highlightRetryTimer), this.highlightRetryTimer = null), this.resolveHighlightRequest = null, h(f));
      }, u = (f) => {
        if (t !== this.highlightRequestId) return;
        if (this.findEditor(e.pageNumber, e.type)) {
          this.setDefaultMode(), this.selector.select(e.id), this.currentAnnotation && this.currentAnnotation.type === k.SELECT && this.selector.activate(e.pageNumber), d(!0);
          return;
        }
        if (f <= 0) {
          d(!1);
          return;
        }
        this.highlightRetryTimer = window.setTimeout(() => {
          this.highlightRetryTimer = null, u(f - 1);
        }, l);
      };
      u(a);
    });
  }
  getData() {
    return Array.from(ce.getState().annotations.values());
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
    }), this.konvaCanvasStore.clear(), this.editorStore.clear(), this.selector.delete(), this.clearTempDataTransfer(), this.currentAnnotation = null, document.body.classList.remove(`${Fn}`), Object.values(k).filter((t) => typeof t == "number").map((t) => `${dn}_${t}`).forEach((t) => document.body.classList.remove(t)), ln(Nt);
  }
}
const Bo = Qt(void 0), tt = () => {
  const o = _t(Bo);
  if (o === void 0)
    throw new Error("usePainter must be used within a PainterProvider");
  return o;
}, xa = {
  placement: "bottom",
  middleware: [wo()]
}, Vo = en(function(e, t) {
  const {
    buttons: n,
    renderButtons: r,
    positionOptions: i = xa,
    visible: s,
    onVisibleChange: a,
    children: l
  } = e, h = s !== void 0, [d, u] = V(!1), f = h ? s : d, p = Z((_) => {
    h ? a?.(_) : u(_);
  }, [h, a]), [g, m] = V(null), v = W(null), y = W(null), T = W(null), S = Z(() => {
    p(!1), y.current = null, T.current = null;
  }, [p]), x = Z((_) => {
    if (y.current = _, T.current = null, !_) {
      S();
      return;
    }
    p(!0);
    const E = _.getBoundingClientRect();
    let R = E;
    if (E.top < 0 || E.left < 0) {
      const H = window.getSelection();
      if (H && H.rangeCount > 0) {
        const Y = H.focusNode, ee = H.anchorNode;
        if (Y && ee) {
          const J = document.createRange(), K = document.createRange();
          H.anchorOffset <= H.focusOffset ? (J.setStart(H.anchorNode, H.anchorOffset), J.setEnd(H.anchorNode, Math.min(H.anchorOffset + 1, H.anchorNode.textContent?.length || 0)), K.setStart(H.focusNode, Math.max(H.focusOffset - 1, 0)), K.setEnd(H.focusNode, H.focusOffset)) : (J.setStart(H.focusNode, H.focusOffset), J.setEnd(H.focusNode, Math.min(H.focusOffset + 1, H.focusNode.textContent?.length || 0)), K.setStart(H.anchorNode, Math.max(H.anchorOffset - 1, 0)), K.setEnd(H.anchorNode, H.anchorOffset));
          const b = J.getBoundingClientRect(), G = K.getBoundingClientRect();
          R = {
            top: Math.max(0, Math.min(b.top, G.top)),
            left: Math.max(0, Math.min(b.left, G.left)),
            bottom: Math.max(b.bottom, G.bottom),
            right: Math.max(b.right, G.right),
            width: Math.abs(G.right - b.left),
            height: Math.max(b.height, G.height),
            x: Math.max(0, Math.min(b.x, G.x)),
            y: Math.max(0, Math.min(b.y, G.y)),
            toJSON: E.toJSON
          };
        }
      }
    }
    const D = {
      getBoundingClientRect: () => R
    };
    requestAnimationFrame(() => {
      v.current && $t(D, v.current, i).then(({ x: H, y: Y }) => {
        v.current && Object.assign(v.current.style, {
          left: `${H}px`,
          top: `${Y}px`
        });
      }).catch((H) => {
        console.warn("Failed to compute popover position:", H);
      });
    });
  }, [S, i, p]), N = Ae(() => (r ? r({ range: y.current, rect: T.current, close: S }) : n || []).map((E) => /* @__PURE__ */ w(
    ve,
    {
      size: "2",
      variant: "ghost",
      color: "gray",
      highContrast: !0,
      style: {
        opacity: E.disabled ? 0.5 : 1,
        boxShadow: "none",
        margin: "0"
      },
      onMouseDown: () => {
        E.onClick(y.current, T.current);
      },
      disabled: E.disabled,
      children: [
        E.icon,
        E.title
      ]
    },
    E.key
  )), [n, S, r]), F = N.length > 0 || !!l;
  ne(() => {
    if (!F) {
      f && T.current && g === null && m(T.current);
      return;
    }
    f && v.current && g && ($t({
      getBoundingClientRect: () => g
    }, v.current, i).then(({ x: E, y: R }) => {
      v.current && Object.assign(v.current.style, {
        left: `${E}px`,
        top: `${R}px`
      });
    }).catch((E) => {
      console.warn("Failed to compute popover position:", E);
    }), m(null));
  }, [F, f, g, i]);
  const U = Z((_) => {
    if (y.current = null, T.current = _, v.current || m(_), p(!0), v.current) {
      const E = {
        getBoundingClientRect: () => _
      };
      requestAnimationFrame(() => {
        v.current && $t(E, v.current, i).then(({ x: R, y: D }) => {
          v.current && Object.assign(v.current.style, {
            left: `${R}px`,
            top: `${D}px`
          });
        }).catch((R) => {
          console.warn("Failed to compute popover position:", R);
        });
      });
    }
  }, [i, p]);
  Pn(t, () => ({
    open: x,
    openWithRect: U,
    close: S
  }), [x, U, S]);
  const { appearance: $ } = tn(), j = {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 999,
    display: f ? "block" : "none",
    width: "max-content",
    backgroundColor: $ === "light" ? "#fff" : "#242430",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: 4,
    padding: "2px"
  };
  return F ? /* @__PURE__ */ c(
    "div",
    {
      ref: v,
      style: j,
      children: l || /* @__PURE__ */ c(X, { gap: "1", align: "center", children: N })
    }
  ) : null;
}), ka = en(function(e, t) {
  const { t: n } = me(["annotator"], { useSuspense: !1 }), {
    popoverBarProps: r = {}
  } = e, i = Lt.useRef(null), { painter: s } = tt();
  return Pn(t, () => ({
    open: (a) => {
      i.current?.open(a);
    },
    close: () => {
      i.current?.close();
    }
  }), []), /* @__PURE__ */ c(
    Vo,
    {
      ref: i,
      renderButtons: () => [
        {
          key: "highlight",
          icon: /* @__PURE__ */ c(Io, {}),
          onClick: (a) => {
            const l = Me.find((h) => h.name === "highlight");
            s?.highlightRange(a, l), i.current?.close();
          },
          title: n("annotator:tool.highlight")
        },
        {
          key: "underline",
          icon: /* @__PURE__ */ c(Do, {}),
          onClick: (a) => {
            const l = Me.find((h) => h.name === "underline");
            s?.highlightRange(a, l), i.current?.close();
          },
          title: n("annotator:tool.underline")
        },
        {
          key: "strikeout",
          icon: /* @__PURE__ */ c(Mo, {}),
          onClick: (a) => {
            const l = Me.find((h) => h.name === "strikeout");
            s?.highlightRange(a, l), i.current?.close();
          },
          title: n("annotator:tool.strikeout")
        }
      ],
      ...r
    }
  );
}), Yo = Qt(null), Ot = () => {
  const o = _t(Yo);
  if (!o)
    throw new Error("useOptionsContext must be used within a OptionsProvider");
  return o;
}, Ea = "_ColorPicker_18032_1", Ra = "_cell_18032_1", Pa = "_active_18032_21", gn = {
  ColorPicker: Ea,
  cell: Ra,
  active: Pa
};
function Ko(o, e) {
  if (!Ut(o) || !Ut(e))
    return e !== void 0 ? e : o;
  const t = { ...o }, n = e, r = o;
  return Object.keys(n).forEach((i) => {
    const s = n[i], a = r[i];
    if (Array.isArray(s)) {
      t[i] = s;
      return;
    }
    if (Ut(s) && Ut(a)) {
      t[i] = Ko(a, s);
      return;
    }
    s !== void 0 && (t[i] = s);
  }), t;
}
function Ut(o) {
  return o !== null && typeof o == "object" && Object.prototype.toString.call(o) === "[object Object]";
}
function Na(o) {
  const e = document.createElement("canvas");
  e.width = e.height = 1;
  const t = e.getContext("2d", { colorSpace: "srgb" });
  if (!t)
    return o;
  t.fillStyle = o, t.fillRect(0, 0, 1, 1);
  const n = t.getImageData(0, 0, 1, 1).data;
  return `rgb(${n[0]}, ${n[1]}, ${n[2]})`;
}
function Qn() {
  const o = document.getElementById("InkLayer");
  if (o) {
    const t = getComputedStyle(o).getPropertyValue("--accent-9").trim();
    return Na(t);
  }
  return "#1677ff";
}
function eo(o) {
  const e = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, t = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  if (o = o.trim().toLowerCase(), e.test(o))
    return o.length === 4 ? "#" + o.slice(1).split("").map((r) => r + r).join("") : o;
  const n = o.match(t);
  if (n) {
    const r = Number(n[1]), i = Number(n[2]), s = Number(n[3]), a = (l) => Math.max(0, Math.min(255, l));
    return "#" + [r, i, s].map((l) => a(l).toString(16).padStart(2, "0")).join("");
  }
  throw new Error(`Unsupported color format: ${o}`);
}
function Ia(o, e) {
  try {
    return eo(o) === eo(e);
  } catch {
    return !1;
  }
}
function Ma(o, e, t = !1) {
  let n = null;
  return function(...r) {
    const i = t && !n;
    n && clearTimeout(n), n = setTimeout(() => {
      n = null, t || o.apply(this, r);
    }, e), i && o.apply(this, r);
  };
}
const Dt = ({
  value: o = "#000000",
  onChange: e,
  presets: t = [],
  transparent: n = !1,
  popover: r = !1,
  custom: i = !0,
  trigger: s
}) => {
  const { t: a } = me("common", { useSuspense: !1 }), [l, h] = V(o), d = (p) => {
    h(p), e?.(p);
  }, u = (p) => {
    d(p);
  }, f = () => /* @__PURE__ */ c(at, { maxWidth: "240px", className: gn.ColorPicker, children: /* @__PURE__ */ c(Sr, { size: "2", variant: "ghost", children: /* @__PURE__ */ w(X, { direction: "column", gap: "3", children: [
    i && /* @__PURE__ */ c(Jr, { color: l, onChange: d }),
    /* @__PURE__ */ c(Wt, { columns: "5", gap: "2", children: t?.map((p) => /* @__PURE__ */ c(
      "div",
      {
        className: `${gn.cell} ${Ia(l, p) ? gn.active : ""}`,
        onMouseDown: () => u(p),
        children: /* @__PURE__ */ c("span", { style: { backgroundColor: p } })
      },
      p
    )) }),
    n && /* @__PURE__ */ c(Qe, { variant: "ghost", onClick: () => u("transparent"), children: a("transparent") })
  ] }) }) });
  return /* @__PURE__ */ c(Se, { children: r ? /* @__PURE__ */ w(Ce.Root, { children: [
    /* @__PURE__ */ c(Ce.Trigger, { children: s || /* @__PURE__ */ c(Qe, { variant: "outline", color: "gray", children: /* @__PURE__ */ w("svg", { viewBox: "0 0 1024 1024", style: { width: "1em", height: "1em", color: l }, children: [
      /* @__PURE__ */ c("path", { d: "M96 837.68888888h832v160H96z", fill: "currentColor" }),
      /* @__PURE__ */ c("path", { d: "M429.30646525 163.315053m54.92260742 54.92260743l164.76782227 164.76782227q54.92260742 54.92260742 0 109.84521486l-164.76782227 164.76782228q-54.92260742 54.92260742-109.84521486 0l-164.76782228-164.76782228q-54.92260742-54.92260742 0-109.84521486l164.76782228-164.76782227q54.92260742-54.92260742 109.84521486 0Z", fill: "#FFFFFF" }),
      /* @__PURE__ */ c("path", { d: "M364.65047577 163.33699097L262.12304466 60.85098508 320.69831237 2.23429214l153.14905568 153.10763046c2.94119095 2.27838736 5.79953147 4.76390083 8.5335963 7.45654045l234.34249608 234.34249608a82.85044939 82.85044939 0 0 1 0 117.15053543l-234.34249608 234.34249607a82.85044939 82.85044939 0 0 1-117.19196065 0L130.88793283 514.29149456a82.85044939 82.85044939 0 0 1 0-117.15053543l233.76254294-233.80396816z m220.2579197 219.13943862l-0.57995316 0.53852791-161.0612736-161.0612736-226.72025474 226.67882952h454.51756532L584.90839547 382.47642959zM822.68918518 783.3069037a103.56306173 103.56306173 0 0 1-103.56306171-103.56306173c0-57.16681008 87.61435022-161.39267539 103.56306171-161.3926754 15.9487115 0 103.56306173 104.1844401 103.56306173 161.3926754a103.56306173 103.56306173 0 0 1-103.56306173 103.56306173z", fill: "#000000d6" })
    ] }) }) }),
    /* @__PURE__ */ c(Ce.Content, { children: /* @__PURE__ */ c(f, {}) })
  ] }) : /* @__PURE__ */ c(f, {}) });
};
function Da(o) {
  return I.Node.create(o).children[0];
}
const La = en(function(e, t) {
  const { t: n } = me(["common", "annotator"], { useSuspense: !1 }), { openSidebar: r, activeSidebarPanel: i, viewerContainerRef: s } = je(), { painter: a } = tt(), { defaultOptions: l } = Ot(), { popoverBarProps: h = {} } = e, d = W(null), [u, f] = V(null), [p, g] = V(2), [m, v] = V(1), [y, T] = V(!1), S = W(null), x = Z((R, D) => {
    const H = `${Cn}_page_${R.pageNumber}`, Y = s?.current?.querySelector(
      `#${H} .konvajs-content`
    );
    if (Y) {
      const ee = Y.getBoundingClientRect(), J = D.x + ee.left, K = D.y + ee.top, b = {
        x: J,
        y: K,
        width: D.width,
        height: D.height,
        top: K,
        left: J,
        right: J + D.width,
        bottom: K + D.height,
        toJSON: () => ({})
      };
      d.current?.openWithRect(b);
    }
  }, [s]);
  st(() => {
    const R = S.current;
    !u || !R || x(u, R);
  }, [x, u, y]), Pn(t, () => ({
    open: (R, D) => {
      f(R), S.current = D;
      const H = Da(R.konvaString);
      g(H.strokeWidth()), v(H.opacity() * 100), x(R, D);
    },
    close: () => {
      d.current?.close(), f(null), T(!1), S.current = null;
    }
  }));
  const N = u && Me.find((R) => R.type === u.type)?.styleEditable, F = !!(u && a?.can("annotation.comment", u)), U = !!(u && a?.can("annotation.edit", u)), $ = !!(u && a?.can("annotation.delete", u)), j = (R) => {
    !u || !a?.can("annotation.edit", u) || a?.updateAnnotationStyle(u, R);
  }, _ = () => {
    !u || !a?.can("annotation.delete", u) || a?.delete(u.id, !0);
  }, E = (R) => {
    r("annotator-sidebar-toggle"), ce.getState().setSelectedAnnotation(R, Ve.CANVAS);
  };
  return /* @__PURE__ */ c(
    Vo,
    {
      ref: d,
      renderButtons: () => u ? [
        ...F && i !== "annotator-sidebar-toggle" ? [
          {
            key: "comment",
            icon: /* @__PURE__ */ c(Lo, {}),
            onClick: () => {
              E(u), d.current?.close();
            },
            title: n("comment")
          }
        ] : [],
        ...U && N ? [
          {
            key: "palette",
            icon: /* @__PURE__ */ c(cs, {}),
            onClick: () => {
              T(!y);
            },
            title: n("color")
          }
        ] : [],
        ...$ ? [{
          key: "delete",
          icon: /* @__PURE__ */ c(hs, {}),
          onClick: () => {
            _(), d.current?.close();
          },
          title: n("delete")
        }] : []
      ] : [],
      ...h,
      children: y && u && U && N && /* @__PURE__ */ w("div", { style: { margin: 8 }, children: [
        /* @__PURE__ */ w(
          ve,
          {
            size: "2",
            variant: "ghost",
            color: "gray",
            highContrast: !0,
            onMouseDown: (R) => {
              R.preventDefault(), T(!1);
            },
            children: [
              /* @__PURE__ */ c(xr, {}),
              n("back")
            ]
          }
        ),
        /* @__PURE__ */ c(et, { my: "2", size: "4" }),
        N?.color && /* @__PURE__ */ c(
          Dt,
          {
            value: u.color ?? void 0,
            onChange: (R) => {
              j({ color: R });
            },
            popover: !1,
            custom: !1,
            presets: l.colors
          }
        ),
        (N?.opacity || N?.strokeWidth) && /* @__PURE__ */ w(Se, { children: [
          /* @__PURE__ */ c(et, { my: "3", size: "4" }),
          /* @__PURE__ */ c(at, { style: { margin: 8 }, children: /* @__PURE__ */ w(X, { gap: "3", direction: "column", children: [
            N.strokeWidth && /* @__PURE__ */ w(Se, { children: [
              /* @__PURE__ */ w(ae, { as: "div", size: "2", weight: "bold", children: [
                n("strokeWidth"),
                " (",
                p,
                ")"
              ] }),
              /* @__PURE__ */ c(
                On,
                {
                  variant: "soft",
                  size: "1",
                  min: 1,
                  max: 20,
                  defaultValue: [p || 1],
                  onValueChange: (R) => {
                    j({ strokeWidth: R[0] }), g(R[0]);
                  }
                }
              )
            ] }),
            N.opacity && /* @__PURE__ */ w(Se, { children: [
              /* @__PURE__ */ w(ae, { as: "div", size: "2", weight: "bold", children: [
                n("opacity"),
                " (",
                m,
                "%)"
              ] }),
              /* @__PURE__ */ c(
                On,
                {
                  variant: "soft",
                  size: "1",
                  min: 1,
                  max: 100,
                  defaultValue: [m || 100],
                  onValueChange: (R) => {
                    j({ opacity: R[0] / 100 }), v(R[0]);
                  }
                }
              )
            ] })
          ] }) })
        ] })
      ] })
    }
  );
}), to = 500;
function mn(o) {
  const e = o?.replace(/\s+/g, " ").trim() ?? "";
  return e.length <= to ? e : `${e.slice(0, to).trimEnd()}…`;
}
const _a = "_card_ijigf_1", Oa = "_header_ijigf_7", Ha = "_identity_ijigf_15", Ga = "_referenceLabel_ijigf_23", Ua = "_referenceLabelStatic_ijigf_44", za = "_separator_ijigf_50", Fa = "_author_ijigf_54", ja = "_page_ijigf_61", Wa = "_selectedText_ijigf_67", $a = "_preview_ijigf_68", Ba = "_empty_ijigf_69", Va = "_footer_ijigf_93", Ya = "_deletedComments_ijigf_98", Ka = "_deletedCommentsTitle_ijigf_105", Xa = "_deletedCommentAuthor_ijigf_106", qa = "_deletedCommentsMore_ijigf_107", Ja = "_deletedComment_ijigf_98", Za = "_deletedCommentContent_ijigf_117", Ie = {
  card: _a,
  header: Oa,
  identity: Ha,
  referenceLabel: Ga,
  referenceLabelStatic: Ua,
  separator: za,
  author: Fa,
  page: ja,
  selectedText: Wa,
  preview: $a,
  empty: Ba,
  footer: Va,
  deletedComments: Ya,
  deletedCommentsTitle: Ka,
  deletedCommentAuthor: Xa,
  deletedCommentsMore: qa,
  deletedComment: Ja,
  deletedCommentContent: Za
}, Xo = ({
  annotation: o,
  children: e,
  onActivate: t,
  onOpenChange: n,
  previewComments: r = []
}) => {
  const { t: i } = me("annotator", { useSuspense: !1 }), [s, a] = V(!1), l = mn(o.contentsObj?.text), h = mn(o.contentsObj?.selectedText), d = r.length > 0, u = !!(l || h || d), f = o.user?.name || o.title, p = o.comments?.length ?? 0, g = o.referenceNumber === void 0 ? o.title : `#${o.referenceNumber}`, m = () => {
    t && (a(!1), t(o.id));
  }, v = (y) => {
    a(y), n?.(y);
  };
  return /* @__PURE__ */ w(
    cn.Root,
    {
      open: s,
      onOpenChange: v,
      openDelay: 350,
      closeDelay: 150,
      children: [
        /* @__PURE__ */ c(cn.Trigger, { children: e }),
        /* @__PURE__ */ w(
          cn.Content,
          {
            align: "center",
            size: "2",
            className: Ie.card,
            onClick: (y) => y.stopPropagation(),
            children: [
              /* @__PURE__ */ w("div", { className: Ie.header, children: [
                /* @__PURE__ */ w("span", { className: Ie.identity, children: [
                  t ? /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      className: Ie.referenceLabel,
                      "aria-label": i("comment.reference.open", {
                        value: g
                      }),
                      onClick: m,
                      children: g
                    }
                  ) : /* @__PURE__ */ c("span", { className: Ie.referenceLabelStatic, children: g }),
                  /* @__PURE__ */ c("span", { className: Ie.separator, "aria-hidden": "true", children: "·" }),
                  /* @__PURE__ */ c("span", { className: Ie.author, children: f })
                ] }),
                /* @__PURE__ */ c("span", { className: Ie.page, children: i("comment.reference.previewPage", {
                  value: o.pageNumber
                }) })
              ] }),
              h ? /* @__PURE__ */ c("blockquote", { className: Ie.selectedText, children: h }) : null,
              !d && l ? /* @__PURE__ */ c("p", { className: Ie.preview, children: l }) : null,
              d ? /* @__PURE__ */ w("section", { className: Ie.deletedComments, children: [
                /* @__PURE__ */ c("div", { className: Ie.deletedCommentsTitle, children: i("deleteUndo.deletedCommentPreview") }),
                r.slice(0, 3).map((y) => /* @__PURE__ */ w("div", { className: Ie.deletedComment, children: [
                  /* @__PURE__ */ c("span", { className: Ie.deletedCommentAuthor, children: y.user?.name || y.title }),
                  /* @__PURE__ */ c("p", { className: Ie.deletedCommentContent, children: mn(y.content) || i("comment.reference.previewNoContent") })
                ] }, y.id)),
                r.length > 3 ? /* @__PURE__ */ c("div", { className: Ie.deletedCommentsMore, children: i("deleteUndo.deletedCommentsMore", {
                  count: r.length - 3
                }) }) : null
              ] }) : null,
              u ? null : /* @__PURE__ */ c("p", { className: Ie.empty, children: i("comment.reference.previewNoContent") }),
              p > 0 && !d ? /* @__PURE__ */ c("div", { className: Ie.footer, children: i("comment.reference.replyCount", {
                count: p
              }) }) : null
            ]
          }
        )
      ]
    }
  );
}, Qa = "_overlay_1ya7e_1", ec = "_snackbar_1ya7e_13", tc = "_content_1ya7e_18", nc = "_message_1ya7e_22", oc = "_reference_1ya7e_29", Rt = {
  overlay: Qa,
  snackbar: ec,
  content: tc,
  message: nc,
  reference: oc
}, no = 24, rc = /#(\d+)/g;
function ic(o) {
  const e = o?.replace(/\s+/g, " ").trim() ?? "", t = Array.from(e);
  return t.length <= no ? e : `${t.slice(0, no).join("")}…`;
}
function sc(o) {
  return o.annotationReferenceNumber === void 0 ? "" : ` #${o.annotationReferenceNumber}`;
}
function oo(o) {
  return `“${o}”`;
}
function ac(o, e, t) {
  const n = Array.from(new Set(o.map((s) => s.annotationReferenceNumber).filter((s) => s !== void 0))), r = t.startsWith("zh") ? "、" : ", ", i = n.slice(0, 3).map((s) => `#${s}`).join(r);
  return n.length > 3 ? e("annotator:deleteUndo.referencesMore", { references: i }) : i;
}
function cc(o, e, t) {
  if (o.totalCount === 1) {
    const r = o.items[0], i = sc(r), s = ic(r.content);
    if (r.kind === "annotation") {
      if (s)
        return e("annotator:deleteUndo.annotationDeletedDetailed", {
          reference: i,
          detail: oo(s)
        });
      const a = Me.find((d) => d.type === r.annotationType), l = a ? e(`annotator:tool.${a.name}`) : "", h = l && r.pageNumber ? e("annotator:deleteUndo.typeAndPage", { type: l, page: r.pageNumber }) : l || (r.pageNumber ? e("annotator:deleteUndo.page", { page: r.pageNumber }) : "");
      return h ? e("annotator:deleteUndo.annotationDeletedDetailed", { reference: i, detail: h }) : e("annotator:deleteUndo.annotationDeleted", { reference: i });
    }
    return s ? e("annotator:deleteUndo.commentDeletedDetailed", {
      reference: i,
      detail: oo(s)
    }) : r.author ? e("annotator:deleteUndo.commentDeletedByAuthor", { reference: i, author: r.author }) : e("annotator:deleteUndo.commentDeleted", { reference: i });
  }
  const n = ac(o.items, e, t);
  return o.annotationCount === o.totalCount ? n ? e("annotator:deleteUndo.annotationsDeletedDetailed", { count: o.totalCount, references: n }) : e("annotator:deleteUndo.annotationsDeleted", { count: o.totalCount }) : o.commentCount === o.totalCount ? n ? e("annotator:deleteUndo.commentsDeletedDetailed", { count: o.totalCount, references: n }) : e("annotator:deleteUndo.commentsDeleted", { count: o.totalCount }) : n ? e("annotator:deleteUndo.itemsDeletedDetailed", { count: o.totalCount, references: n }) : e("annotator:deleteUndo.itemsDeleted", { count: o.totalCount });
}
function lc(o, e) {
  const t = /* @__PURE__ */ new Map();
  e.forEach((i) => {
    if (i.annotationReferenceNumber === void 0) return;
    const s = t.get(i.annotationReferenceNumber) ?? {
      annotation: i.previewAnnotation,
      comments: []
    };
    i.previewComment && s.comments.push(i.previewComment), t.set(i.annotationReferenceNumber, s);
  });
  const n = [];
  let r = 0;
  for (const i of o.matchAll(rc)) {
    const s = i.index;
    s > r && n.push({ kind: "text", value: o.slice(r, s) });
    const a = t.get(Number(i[1]));
    a ? n.push({
      kind: "reference",
      value: i[0],
      annotation: a.annotation,
      comments: a.comments
    }) : n.push({ kind: "text", value: i[0] }), r = s + i[0].length;
  }
  return r < o.length && n.push({ kind: "text", value: o.slice(r) }), n;
}
function dc() {
  const { painter: o } = tt(), { t: e, i18n: t } = me(["common", "annotator"], { useSuspense: !1 }), n = W(null), r = W(!1), i = W(!1), s = W(/* @__PURE__ */ new Set()), a = Z(
    (p) => o?.subscribeDeleteUndo(p) ?? (() => {
    }),
    [o]
  ), l = Z(
    () => o?.getDeleteUndoSnapshot() ?? null,
    [o]
  ), h = sr(a, l, () => null);
  if (!h) return null;
  const d = cc(h, e, t.resolvedLanguage ?? t.language), u = lc(d, h.items), f = (p, g) => {
    if (g) {
      s.current.add(p), o?.pauseDeleteUndo();
      return;
    }
    s.current.delete(p), !r.current && !i.current && s.current.size === 0 && o?.resumeDeleteUndo();
  };
  return /* @__PURE__ */ c("div", { className: Rt.overlay, children: /* @__PURE__ */ c(
    ct.Root,
    {
      ref: n,
      className: Rt.snackbar,
      size: "1",
      role: "status",
      "aria-live": "polite",
      onMouseEnter: () => {
        r.current = !0, o?.pauseDeleteUndo();
      },
      onMouseLeave: () => {
        r.current = !1, !i.current && s.current.size === 0 && o?.resumeDeleteUndo();
      },
      onFocusCapture: () => {
        i.current = !0, o?.pauseDeleteUndo();
      },
      onBlurCapture: (p) => {
        n.current?.contains(p.relatedTarget) || (i.current = !1, !r.current && s.current.size === 0 && o?.resumeDeleteUndo());
      },
      children: /* @__PURE__ */ w(X, { className: Rt.content, align: "center", gap: "2", children: [
        /* @__PURE__ */ c(ct.Text, { className: Rt.message, children: u.map((p, g) => {
          if (p.kind === "text")
            return /* @__PURE__ */ c(Lt.Fragment, { children: p.value }, `text-${g}`);
          const m = `${p.annotation.id}-${g}`;
          return /* @__PURE__ */ c(
            Xo,
            {
              annotation: p.annotation,
              previewComments: p.comments,
              onOpenChange: (v) => f(m, v),
              children: /* @__PURE__ */ c("button", { className: Rt.reference, type: "button", children: p.value })
            },
            m
          );
        }) }),
        /* @__PURE__ */ c(
          ve,
          {
            size: "1",
            onClick: () => o?.undoDelete(),
            children: e(h.totalCount === 1 ? "common:restore" : "common:restoreAll")
          }
        )
      ] })
    }
  ) });
}
const ro = "inklayer-annotator", io = "annotator-sidebar-toggle", uc = ({
  enableNativeAnnotations: o,
  annotations: e,
  annotationPermissions: t,
  defaultShowAnnotationAuthorLabels: n = !1,
  onLoad: r,
  onAnnotationAdd: i,
  onAnnotationDelete: s,
  onAnnotationSelected: a,
  onAnnotationChanged: l
}) => {
  const {
    isReady: h,
    pdfViewer: d,
    eventBus: u,
    isSidebarCollapsed: f,
    activeSidebarPanel: p,
    openSidebar: g
  } = je(), { user: m } = xo(), { refreshPainter: v, setPainter: y } = tt(), { defaultOptions: T, primaryColor: S } = Ot(), x = ce((Y) => Y.clearAnnotations), N = W({
    annotations: e ?? [],
    enableNativeAnnotations: o,
    onLoad: r,
    onAnnotationAdd: i,
    onAnnotationDelete: s,
    onAnnotationSelected: a,
    onAnnotationChanged: l
  });
  N.current = {
    annotations: e ?? [],
    enableNativeAnnotations: o,
    onLoad: r,
    onAnnotationAdd: i,
    onAnnotationDelete: s,
    onAnnotationSelected: a,
    onAnnotationChanged: l
  };
  const F = W(null), U = W(null), $ = W(null), j = W(m), _ = W(t), E = W({ activeSidebarPanel: p, openSidebar: g }), R = W(n);
  j.current = m, _.current = t, E.current = { activeSidebarPanel: p, openSidebar: g };
  const D = W(
    Ma(
      () => {
        U.current?.close(), F.current?.close();
        const Y = document.querySelector(`#${Go}`);
        if (Y?.parentNode)
          try {
            Y.parentNode.removeChild(Y);
          } catch {
          }
      },
      100,
      !0
    )
  ).current, H = Z(() => {
    D();
  }, [D]);
  return ne(() => {
    if (x(), !h || !d || !u || !j.current) return;
    let Y = !1, ee = !1, J = null;
    const K = new Ta({
      primaryColor: S,
      defaultOptions: T,
      currentUser: j.current,
      annotationPermissions: _.current,
      defaultShowAnnotationAuthorLabels: R.current,
      PDFViewerApplication: d,
      onTextSelected: (B) => {
        F.current?.open(B);
      },
      onAnnotationAdd: (B) => {
        N.current.onAnnotationAdd(B);
      },
      onAnnotationDelete: (B) => {
        N.current.onAnnotationDelete(B);
      },
      onAnnotationSelected: (B, L, q) => {
        const le = E.current;
        L && B && le.activeSidebarPanel !== io && le.openSidebar?.(io), L && B && U.current?.open(B, q), N.current.onAnnotationSelected(B ?? null, L);
      },
      onAnnotationChanging: () => {
        U.current?.close();
      },
      onAnnotationChanged: (B, L) => {
        B && L && U.current?.open(B, L), B && N.current.onAnnotationChanged(B);
      }
    });
    $.current = K, y(K);
    const b = ({ source: B, cssTransform: L, pageNumber: q }) => {
      K.initCanvas({
        pageView: B,
        cssTransform: L,
        pageNumber: q
      });
    };
    u.on("pagerendered", b), u._on("updateviewarea", H), K.initWebSelection(d.viewer);
    const G = async () => {
      if (!(Y || ee)) {
        ee = !0;
        try {
          const { annotations: B, enableNativeAnnotations: L } = N.current;
          await K.initAnnotationsOnce(B, L);
        } catch (B) {
          Y || console.error("[Annotator] Failed to initialize annotations", B);
          return;
        }
        Y || (J = setTimeout(() => {
          if (J = null, !Y)
            for (let B = 0; B < d.pagesCount; B++) {
              const L = d.getPageView(B);
              if (L && L.div && L.canvas) {
                const q = K.getKonvaCanvasStore();
                q && q.has(B + 1) && K.reRenderAnnotations(B + 1);
              }
            }
        }, 0), N.current.onLoad?.());
      }
    };
    return d.pdfDocument ? G() : u.on("documentloaded", G), () => {
      Y = !0, J && (clearTimeout(J), J = null), u.off("pagerendered", b), u.off("updateviewarea", H), u.off("documentloaded", G), K.destroy(), $.current === K && ($.current = null), y(null);
    };
  }, [x, T, u, H, h, d, S, y]), st(() => {
    j.current && (U.current?.close(), $.current?.setPermissionContext(j.current, _.current), $.current && v());
  }, [t, v, m]), ne(() => {
    if (!u) return;
    const Y = (J) => {
      const K = /* @__PURE__ */ new Map();
      J.forEach((b) => {
        K.set(b.pageNumber, (K.get(b.pageNumber) ?? 0) + 1);
      }), u.dispatch(Yt, {
        source: ro,
        markers: K
      });
    };
    Y(ce.getState().annotations);
    const ee = ce.subscribe((J, K) => {
      J.annotations !== K.annotations && Y(J.annotations);
    });
    return () => {
      ee(), u.dispatch(Yt, {
        source: ro,
        markers: /* @__PURE__ */ new Map()
      });
    };
  }, [u]), ne(() => {
    H();
  }, [H, f]), /* @__PURE__ */ w(Se, { children: [
    /* @__PURE__ */ c(ka, { ref: F }),
    /* @__PURE__ */ c(La, { ref: U }),
    /* @__PURE__ */ c(dc, {})
  ] });
}, hc = {
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
}, pc = {
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
}, fc = ["common", "viewer", "annotator"];
we.use(Ar).init({
  resources: {
    "zh-CN": hc,
    "en-US": pc
  },
  lng: "zh-CN",
  fallbackLng: "en-US",
  ns: fc,
  defaultNS: "common",
  interpolation: { escapeValue: !1 }
});
const St = en(({
  icon: o,
  selected: e,
  onClick: t,
  disabled: n = !1,
  title: r,
  label: i,
  tooltip: s = "auto",
  tooltipSide: a = "bottom",
  className: l,
  buttonProps: h = {}
}, d) => {
  const [u, f] = V(!1);
  ne(() => {
    if (!r || s === "none" || typeof window > "u") return;
    const m = () => f(!1);
    return window.addEventListener("inklayer:close-toolbar-tooltips", m), window.addEventListener("scroll", m, !0), () => {
      window.removeEventListener("inklayer:close-toolbar-tooltips", m), window.removeEventListener("scroll", m, !0);
    };
  }, [r, s]), ne(() => {
    e === void 0 || typeof window > "u" || window.dispatchEvent(new Event("inklayer:close-toolbar-tooltips"));
  }, [e]);
  const g = /* @__PURE__ */ w(
    Qe,
    {
      ref: d,
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
      ...h,
      onPointerDown: () => {
        f(!1), typeof window < "u" && window.dispatchEvent(new Event("inklayer:close-toolbar-tooltips"));
      },
      children: [
        o,
        i
      ]
    }
  );
  return r && s !== "none" ? /* @__PURE__ */ c(xt, { content: r, side: a, open: u, onOpenChange: f, children: g }) : g;
}), mt = {
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
  const { t: o } = me("viewer", { useSuspense: !1 }), { pdfViewer: e, eventBus: t } = je(), [n, r] = V("auto");
  ne(() => {
    if (!t || !e) return;
    const f = () => {
      const p = e.currentScaleValue;
      r(p || "auto");
    };
    return t.on("scalechanging", f), t.on("pagesloaded", f), () => {
      t.off("scalechanging", f), t.off("pagesloaded", f);
    };
  }, [t, e]);
  const i = (f) => {
    if (["auto", "page-actual", "page-fit", "page-width"].includes(f))
      return null;
    const p = parseFloat(f);
    return isNaN(p) ? null : p;
  }, s = (f) => {
    r(f), e && (e.currentScaleValue = f);
  }, a = () => {
    let f = i(n);
    f === null && (f = e ? e.currentScale : 1);
    const p = Math.min(f + mt.ZOOM_STEP, mt.MAX_SCALE), g = Math.round(p * 100) / 100;
    s(g.toString());
  }, l = () => {
    let f = i(n);
    f === null && (f = e ? e.currentScale : 1);
    const p = Math.max(f - mt.ZOOM_STEP, mt.MIN_SCALE), g = Math.round(p * 100) / 100;
    s(g.toString());
  }, h = () => (i(n) ?? (e?.currentScale || 1)) >= mt.MAX_SCALE, d = () => (i(n) ?? (e?.currentScale || 1)) <= mt.MIN_SCALE, u = (() => {
    const f = mt.ZOOM_OPTIONS.find((g) => g.value === n);
    if (f)
      return "labelKey" in f && f.labelKey ? o(f.labelKey) : "label" in f ? f.label : n;
    const p = parseFloat(n);
    return isNaN(p) ? o("viewer:zoom.auto") : `${Math.round(p * 100)}%`;
  })();
  return /* @__PURE__ */ w(X, { gap: "2", align: "center", children: [
    /* @__PURE__ */ c(
      St,
      {
        title: "缩小",
        tooltipSide: "top",
        buttonProps: {
          size: "1",
          disabled: d()
        },
        icon: /* @__PURE__ */ c(kr, {}),
        onClick: l
      }
    ),
    /* @__PURE__ */ w(ge.Root, { onOpenChange: (f) => {
      f && window.dispatchEvent(new Event("inklayer:close-toolbar-tooltips"));
    }, children: [
      /* @__PURE__ */ c(ge.Trigger, { children: /* @__PURE__ */ w(ve, { "aria-label": "选择缩放比例", variant: "ghost", size: "2", color: "gray", style: { width: 80 }, children: [
        u,
        /* @__PURE__ */ c(ge.TriggerIcon, {})
      ] }) }),
      /* @__PURE__ */ c(ge.Content, { children: mt.ZOOM_OPTIONS.map((f) => /* @__PURE__ */ c(
        ge.Item,
        {
          onSelect: () => s(f.value),
          children: "labelKey" in f ? o(f.labelKey) : f.label
        },
        f.key
      )) })
    ] }),
    /* @__PURE__ */ c(
      St,
      {
        title: "放大",
        tooltipSide: "top",
        buttonProps: {
          size: "1",
          disabled: h()
        },
        icon: /* @__PURE__ */ c(Er, {}),
        onClick: a
      }
    )
  ] });
}, gc = "_SignatureTool_mpyjt_1", mc = "_container_mpyjt_1", vc = "_info_mpyjt_23", yc = "_imagePreview_mpyjt_34", bc = "_toolbar_mpyjt_48", Sc = "_colorPalette_mpyjt_53", wc = "_cell_mpyjt_58", Cc = "_active_mpyjt_75", Ac = "_toolbarDark_mpyjt_84", Tc = "_SignaturePop_mpyjt_94", Ze = {
  SignatureTool: gc,
  container: mc,
  info: vc,
  imagePreview: yc,
  toolbar: bc,
  colorPalette: Sc,
  cell: wc,
  active: Cc,
  toolbarDark: Ac,
  SignaturePop: Tc
}, Jt = /* @__PURE__ */ new Set();
function xc(o) {
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
async function kc(o) {
  if (!(!o.external || !o.url || Jt.has(o.value)))
    try {
      const e = new FontFace(o.value, `url(${o.url})`);
      await e.load(), document.fonts.add(e), Jt.add(o.value);
    } catch {
      xc(o);
    }
}
const zt = 80, Ec = ({ annotation: o, disabled: e = !1, onAdd: t, default_signatures: n, presentation: r = "toolbar-icon", label: i, selected: s }) => {
  const { defaultOptions: a } = Ot(), l = a.signature.colors, h = 420, d = 200, u = a.signature.type, f = a.signature.maxSize, p = a.signature.accept, g = 600, m = a.signature.defaultFont, { t: v } = me(["common", "annotator"], { useSuspense: !1 }), y = W(null), T = W(null), S = W(l[0]), x = W(null), [N, F] = V(!1), [U, $] = V(S.current), [j, _] = V(!0), [E, R] = V([]), [D, H] = V(null), [Y, ee] = V(""), [J, K] = V(m[0]?.value || "Arial"), [b, G] = V(null), [B, L] = V(!1), { appearance: q } = tn(), le = n ?? a.signature.defaultSignature, O = f;
  ne(() => {
    S.current = U;
  }, [U]);
  const te = (A) => {
    t(A);
  }, de = async (A) => {
    const P = m.find((se) => se.value === A);
    P && P.external && await kc(P), K(A);
  }, he = W({ fontFamily: J, signatureTypeDefault: u, loadFont: de });
  he.current = { fontFamily: J, signatureTypeDefault: u, loadFont: de };
  const Ee = () => {
    if (!Y.trim()) return null;
    const A = document.createElement("canvas");
    A.width = h / 1.1, A.height = d;
    const P = A.getContext("2d");
    if (!P) return null;
    const se = 20;
    P.clearRect(0, 0, A.width, A.height), P.font = `${zt}px "${J}", cursive, sans-serif`;
    const ue = P.measureText(Y).width, pe = ue + se * 2 > A.width ? (A.width - se * 2) / ue : 1;
    return P.font = `${zt * pe}px "${J}", cursive, sans-serif`, P.textAlign = "center", P.textBaseline = "middle", P.imageSmoothingEnabled = !0, P.shadowColor = "rgba(0, 0, 0, 0.1)", P.shadowBlur = 2, P.shadowOffsetX = 1, P.shadowOffsetY = 1, P.fillStyle = U, P.fillText(Y, A.width / 2, A.height / 2), A.toDataURL("image/png");
  }, xe = () => {
    if (D === "Upload") {
      b && (R((A) => [...A, b]), te(b), F(!1));
      return;
    }
    if (D === "Enter") {
      const A = Ee();
      A && (R((P) => [...P, A]), te(A), F(!1));
      return;
    }
    if (D === "Draw") {
      const A = T.current?.toDataURL();
      A && (R((P) => [...P, A]), te(A), F(!1));
      return;
    }
  }, $e = () => {
    const A = T.current;
    A && (A.clear(), A.getLayers().forEach((P) => P.destroyChildren()), _(!0)), ee(""), G(null);
  }, He = () => {
    if (!y.current) return;
    const A = new I.Stage({
      container: y.current,
      width: h,
      height: d
    }), P = new I.Layer();
    A.add(P), T.current = A;
    let se = !1, ue = null;
    const pe = () => {
      se = !0;
      const Fe = A.getPointerPosition();
      Fe && (ue = new I.Line({
        stroke: S.current,
        strokeWidth: 3,
        globalCompositeOperation: "source-over",
        lineCap: "round",
        lineJoin: "round",
        points: [Fe.x, Fe.y]
      }), P.add(ue));
    }, ze = (Fe) => {
      if (!se || !ue) return;
      Fe.evt.preventDefault();
      const Be = A.getPointerPosition();
      if (!Be) return;
      const nt = ue.points().concat([Be.x, Be.y]);
      ue.points(nt), _(!1);
    }, vt = () => {
      se = !1, ue = null;
    };
    A.on("mousedown touchstart", pe), A.on("mouseup touchend", vt), A.on("mousemove touchmove", ze);
  }, C = (A) => {
    $(A), (T.current?.getLayers()[0].getChildren((se) => se.getClassName() === "Line") || []).forEach((se) => se.stroke(A));
  }, M = (A) => {
    const P = A.target, se = P.files;
    if (!se?.length) return;
    const ue = se[0];
    if (ue.size > O) {
      L(!0), setTimeout(() => L(!1), 3e3), P && (P.value = "");
      return;
    }
    const pe = new FileReader();
    pe.onload = async (ze) => {
      const vt = ze.target?.result, Fe = new Image();
      Fe.src = vt, Fe.onload = () => {
        const Be = g, nt = g;
        let { width: qe, height: Oe } = Fe;
        qe > Oe && qe > Be ? (Oe = Math.round(Oe * Be / qe), qe = Be) : Oe > nt && (qe = Math.round(qe * nt / Oe), Oe = nt);
        const _e = document.createElement("canvas"), dt = _e.getContext("2d");
        if (_e.width = qe, _e.height = Oe, dt) {
          dt.drawImage(Fe, 0, 0, qe, Oe);
          const Ct = _e.toDataURL("image/png");
          P.value = "", G(Ct), _(!1);
        }
      };
    }, pe.readAsDataURL(ue);
  };
  return ne(() => {
    ee(""), G(null), (D === "Enter" || D === "Draw" || D === "Upload") && _(!0);
  }, [D]), ne(() => {
    _(Y.trim().length === 0);
  }, [Y]), ne(() => {
    if (N) {
      const A = he.current;
      A.loadFont(A.fontFamily), ee(""), G(null), H(A.signatureTypeDefault);
    }
  }, [N]), ne(() => {
    N && D === "Draw" ? setTimeout(() => {
      He();
    }, 300) : (T.current?.destroy(), T.current = null);
  }, [D, N]), /* @__PURE__ */ w(Se, { children: [
    /* @__PURE__ */ w(Ce.Root, { children: [
      /* @__PURE__ */ c(Ce.Trigger, { children: /* @__PURE__ */ c(
        St,
        {
          disabled: e,
          selected: s,
          tooltip: r === "menu-item" ? "none" : "auto",
          title: v(`annotator:tool.${o.name}`),
          label: r === "menu-item" ? i : void 0,
          buttonProps: r === "menu-item" ? { variant: "ghost", size: "2", style: { width: "100%", justifyContent: "flex-start", gap: 8 } } : void 0,
          icon: o.icon
        }
      ) }),
      /* @__PURE__ */ c(Ce.Content, { size: "1", style: { width: 180 }, onCloseAutoFocus: (A) => A.preventDefault(), children: /* @__PURE__ */ w("div", { className: Ze.SignaturePop, children: [
        /* @__PURE__ */ w("ul", { className: Ze.container, children: [
          le.map((A, P) => /* @__PURE__ */ c(Ce.Close, { children: /* @__PURE__ */ c("li", { onClick: () => te(A), children: /* @__PURE__ */ c("img", { src: A }) }, P) }, P)),
          E.map((A, P) => /* @__PURE__ */ c(Ce.Close, { children: /* @__PURE__ */ c("li", { onClick: () => te(A), children: /* @__PURE__ */ c("img", { src: A }) }, P) }, P))
        ] }),
        /* @__PURE__ */ c(Ce.Close, { children: /* @__PURE__ */ w(ve, { style: { width: "100%" }, variant: "soft", onClick: () => {
          F(!0);
        }, children: [
          /* @__PURE__ */ c(vo, {}),
          " ",
          v("annotator:common.createSignature")
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ c(it.Root, { open: N, onOpenChange: F, children: /* @__PURE__ */ w(it.Content, { style: { width: "550px" }, children: [
      /* @__PURE__ */ c(it.Title, { children: v("annotator:common.createSignature") }),
      /* @__PURE__ */ c(X, { as: "span", justify: "center", mb: "4", children: /* @__PURE__ */ w(ht.Root, { size: "3", defaultValue: u, onValueChange: (A) => H(A), radius: "full", children: [
        /* @__PURE__ */ c(ht.Item, { value: "Enter", children: v("enter") }),
        /* @__PURE__ */ c(ht.Item, { value: "Draw", children: v("draw") }),
        /* @__PURE__ */ c(ht.Item, { value: "Upload", children: v("annotator:editor.signature.upload") })
      ] }) }),
      /* @__PURE__ */ w("div", { className: Ze.SignatureTool, children: [
        /* @__PURE__ */ w("div", { className: Ze.container, style: { width: h }, children: [
          D === "Enter" && /* @__PURE__ */ c(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: Y,
              onChange: (A) => ee(A.target.value),
              placeholder: v("annotator:editor.signature.area"),
              style: {
                height: d - 2,
                width: h / 1.1,
                color: U,
                fontFamily: `${J}`,
                fontSize: zt,
                lineHeight: `${zt}px`
              }
            }
          ),
          D === "Draw" && /* @__PURE__ */ w(Se, { children: [
            /* @__PURE__ */ c("div", { className: Ze.info, children: v("annotator:editor.signature.area") }),
            /* @__PURE__ */ c(
              "div",
              {
                ref: y,
                style: {
                  height: d,
                  width: h
                }
              }
            )
          ] }),
          D === "Upload" && /* @__PURE__ */ c("div", { style: {
            height: d,
            width: h
          }, children: b ? /* @__PURE__ */ c("div", { className: Ze.imagePreview, style: {
            height: d,
            width: h
          }, children: /* @__PURE__ */ c("img", { src: b, alt: "preview" }) }) : /* @__PURE__ */ w("div", { style: {
            height: d,
            width: h
          }, children: [
            /* @__PURE__ */ c("input", { style: { display: "none" }, type: "file", ref: x, accept: p, onChange: M }),
            /* @__PURE__ */ w(X, { height: `${d}px`, direction: "column", gap: "3", justify: "center", align: "center", children: [
              /* @__PURE__ */ w(ve, { size: "3", onClick: () => {
                x.current?.click();
              }, children: [
                /* @__PURE__ */ c(yo, {}),
                " ",
                v("annotator:editor.signature.choose")
              ] }),
              /* @__PURE__ */ c(ae, { color: "gray", size: "2", style: { textAlign: "center" }, children: v("annotator:editor.signature.uploadHint", { format: p, maxSize: Sn(f) }) }),
              B && /* @__PURE__ */ c(ct.Root, { color: "red", mt: "3", children: /* @__PURE__ */ c(ct.Text, { children: v("fileSizeLimit", { value: Sn(O) }) }) })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ c("div", { className: `${Ze.toolbar} ${q === "dark" ? Ze.toolbarDark : ""}`, style: { width: h }, children: /* @__PURE__ */ w(X, { justify: "between", align: "center", gap: "2", children: [
          /* @__PURE__ */ w("div", { className: Ze.colorPalette, children: [
            D !== "Upload" && /* @__PURE__ */ c(Se, { children: l.map((A) => /* @__PURE__ */ c("div", { onClick: () => C(A), className: `${Ze.cell} ${A === U ? Ze.active : ""}`, children: /* @__PURE__ */ c("span", { style: { backgroundColor: A } }) }, A)) }),
            D === "Enter" && /* @__PURE__ */ c(Se, { children: /* @__PURE__ */ w(ke.Root, { onValueChange: async (A) => {
              await de(A);
            }, defaultValue: J, size: "1", children: [
              /* @__PURE__ */ c(ke.Trigger, {}),
              /* @__PURE__ */ c(ke.Content, { children: m.map((A) => /* @__PURE__ */ c(ke.Item, { value: A.value, children: A.label }, A.value)) })
            ] }) })
          ] }),
          /* @__PURE__ */ c(ve, { variant: "ghost", mr: "3", onClick: $e, children: v("clear") })
        ] }) }),
        /* @__PURE__ */ w(X, { gap: "3", mt: "4", justify: "end", children: [
          /* @__PURE__ */ c(it.Close, { children: /* @__PURE__ */ c(ve, { style: { width: 100 }, variant: "soft", color: "gray", children: v("cancel") }) }),
          /* @__PURE__ */ c(it.Close, { children: /* @__PURE__ */ c(ve, { disabled: j, style: { width: 100 }, onClick: xe, children: v("ok") }) })
        ] })
      ] })
    ] }) })
  ] });
}, Rc = "_StampPop_1pr7b_1", Pc = "_container_1pr7b_4", Nc = "_StampTool_1pr7b_38", Ic = "_imagePreview_1pr7b_45", Mc = "_imagePreviewDark_1pr7b_54", Dc = "_formItem_1pr7b_58", Ge = {
  StampPop: Rc,
  container: Pc,
  StampTool: Nc,
  imagePreview: Ic,
  imagePreviewDark: Mc,
  formItem: Dc
};
Co.extend(Zr);
const so = "StampGroup", Ft = 470, Pt = 120, Lc = [
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
], _c = ({ annotation: o, disabled: e = !1, default_stamps: t, onAdd: n, presentation: r = "toolbar-icon", label: i, selected: s }) => {
  const { defaultOptions: a } = Ot(), l = a.stamp.maxSize, h = a.stamp.accept, d = 600, u = a.stamp.editor.defaultFont, f = a.stamp.editor.defaultTextColor, p = a.stamp.editor.defaultBorderStyle, g = a.stamp.editor.defaultBackgroundColor, m = a.stamp.editor.defaultBorderColor, v = a.colors, { t: y } = me(["common", "annotator"]), T = W(null), S = W(null), x = W(null), { user: N } = xo(), [F, U] = V([]), { appearance: $ } = tn(), j = t ?? a.stamp.defaultStamp, [_, E] = V(!1), [R, D] = V(j.length === 0 ? "custom" : "default"), [H, Y] = V({
    stampText: y("annotator:editor.stamp.defaultText"),
    fontStyle: [],
    fontFamily: u[0].value,
    textColor: f,
    backgroundColor: g,
    borderColor: m,
    borderStyle: p,
    timestamp: ["username", "date"],
    customTimestampText: "",
    dateFormat: "YYYY-MM-DD"
  });
  st(() => {
    Y((O) => ({
      ...O,
      stampText: y("annotator:editor.stamp.defaultText")
    }));
  }, [y]);
  const [ee, J] = V(null), K = (O) => {
    n(O);
  }, b = () => {
    const O = S.current?.getLayers()[0];
    if (!O) return;
    const te = O.getChildren((he) => he.name() === so)[0];
    if (!te) return;
    const de = S.current?.toDataURL({
      x: te.x(),
      y: te.y(),
      width: te.width(),
      height: te.height()
    });
    de && (U((he) => [...he, de]), K(de), E(!1));
  }, G = (O) => {
    const te = O.target, de = te.files;
    if (!de?.length) return;
    const he = de[0];
    if (he.size > l) {
      alert(y("fileSizeLimit", { value: Sn(l) })), te && (te.value = "");
      return;
    }
    const Ee = new FileReader();
    Ee.onload = async (xe) => {
      const $e = xe.target?.result, He = new Image();
      He.src = $e, He.onload = () => {
        const C = d, M = d;
        let { width: A, height: P } = He;
        A > P && A > C ? (P = Math.round(P * C / A), A = C) : P > M && (A = Math.round(A * M / P), P = M);
        const se = document.createElement("canvas"), ue = se.getContext("2d");
        if (se.width = A, se.height = P, ue) {
          ue.drawImage(He, 0, 0, A, P);
          const pe = se.toDataURL("image/png");
          te.value = "", U((ze) => [...ze, pe]);
        }
      };
    }, Ee.readAsDataURL(he);
  }, B = (O, te) => {
    const de = {
      ...H,
      [O]: te
    };
    Y(de), J(de), L(de);
  }, L = (O) => {
    if (!T.current) return;
    const { stampText: te, fontStyle: de, textColor: he, backgroundColor: Ee, borderColor: xe, borderStyle: $e, timestamp: He, dateFormat: C, fontFamily: M } = O;
    S.current?.destroy();
    const A = new I.Stage({
      container: T.current,
      width: Ft,
      height: Pt
    }), P = new I.Layer(), se = [];
    de.includes("italic") && se.push("italic"), de.includes("bold") && se.push("bold");
    const ue = se.join(" ") || "normal", pe = de.includes("underline"), ze = de.includes("strikeout"), vt = Co(), Fe = N?.name, Be = C ? vt.format(C) : "", nt = O.customTimestampText?.trim(), Oe = [
      He.includes("username") ? Fe : null,
      He.includes("date") ? Be : null,
      nt || null
    ].filter(Boolean).join(" · ");
    let _e = 30;
    const dt = 16, Ct = 10, on = new I.Text({
      text: te,
      fontSize: _e,
      fontStyle: ue,
      fontFamily: M
    }), be = new I.Text({
      text: Oe,
      fontSize: dt,
      fontFamily: M
    }), ft = Math.max(on.width(), be.width()) + 60, Ht = _e + Ct + dt + 25, kt = Math.max(ft, 180), Je = Math.max(Ht, 60), yt = new I.Rect({
      name: so,
      width: kt,
      height: Je,
      x: (Ft - kt) / 2,
      y: (Pt - Je) / 2,
      fill: Ee,
      strokeWidth: $e === "none" ? 0 : 5,
      stroke: xe,
      dash: $e === "dashed" ? [5, 5] : void 0,
      cornerRadius: 10
    });
    P.add(yt), Oe || (_e = _e * 1.2);
    let Gt;
    Oe ? Gt = (Pt - Je) / 2 + 15 : Gt = (Pt - Je) / 2 + Je / 2 - _e / 2;
    const rn = new I.Text({
      text: te,
      x: 0,
      y: Gt,
      width: Ft,
      align: "center",
      fontSize: _e,
      fontStyle: ue,
      fontFamily: M,
      fill: he
    });
    if (P.add(rn), pe) {
      const Et = rn.y() + _e + 4, sn = new I.Line({
        points: [yt.x(), Et, yt.x() + yt.width(), Et],
        stroke: he,
        strokeWidth: 2
      });
      P.add(sn);
    }
    if (ze) {
      const Et = rn.y() + _e / 2, sn = new I.Line({
        points: [yt.x(), Et, yt.x() + yt.width(), Et],
        stroke: he,
        strokeWidth: 2
      });
      P.add(sn);
    }
    const ir = new I.Text({
      text: Oe,
      x: 0,
      y: Gt + _e + Ct,
      width: Ft,
      align: "center",
      fontSize: dt,
      fontFamily: M,
      fill: he
    });
    Oe && P.add(ir), A.add(P), S.current = A;
  }, q = W(H);
  q.current = ee ?? H;
  const le = W(L);
  return le.current = L, st(() => {
    if (_) {
      const te = requestAnimationFrame(() => {
        T.current && le.current(q.current);
      });
      return () => cancelAnimationFrame(te);
    }
    const O = S.current;
    O && (O.destroy(), S.current = null);
  }, [_]), /* @__PURE__ */ w(Se, { children: [
    /* @__PURE__ */ w(Ce.Root, { children: [
      /* @__PURE__ */ c(Ce.Trigger, { children: /* @__PURE__ */ c(
        St,
        {
          disabled: e,
          selected: s,
          tooltip: r === "menu-item" ? "none" : "auto",
          title: y(`annotator:tool.${o.name}`),
          label: r === "menu-item" ? i : void 0,
          buttonProps: r === "menu-item" ? { variant: "ghost", size: "2", style: { width: "100%", justifyContent: "flex-start", gap: 8 } } : void 0,
          icon: o.icon
        }
      ) }),
      /* @__PURE__ */ c(
        Ce.Content,
        {
          size: "1",
          onCloseAutoFocus: (O) => {
            O.preventDefault(), D(j.length === 0 ? "custom" : "default");
          },
          children: /* @__PURE__ */ w("div", { className: Ge.StampPop, children: [
            /* @__PURE__ */ c(X, { align: "center", justify: "center", mb: "4", children: /* @__PURE__ */ c(
              ht.Root,
              {
                radius: "full",
                defaultValue: j.length === 0 ? "custom" : "default",
                onValueChange: (O) => D(O),
                children: j.length === 0 ? /* @__PURE__ */ w(Se, { children: [
                  /* @__PURE__ */ c(ht.Item, { value: "custom", children: y("custom") }),
                  /* @__PURE__ */ c(ht.Item, { value: "default", children: y("default") })
                ] }) : /* @__PURE__ */ w(Se, { children: [
                  /* @__PURE__ */ c(ht.Item, { value: "default", children: y("default") }),
                  /* @__PURE__ */ c(ht.Item, { value: "custom", children: y("custom") })
                ] })
              }
            ) }),
            R === "default" && /* @__PURE__ */ w(Se, { children: [
              j.length === 0 && /* @__PURE__ */ c(X, { align: "center", justify: "center", gap: "2", children: /* @__PURE__ */ w(ct.Root, { variant: "soft", color: "gray", size: "1", style: { width: "100%" }, children: [
                /* @__PURE__ */ c(ct.Icon, { children: /* @__PURE__ */ c(Rr, {}) }),
                /* @__PURE__ */ c(ct.Text, { children: y("annotator:editor.stamp.defaultStampNotSet") })
              ] }) }),
              /* @__PURE__ */ c("ul", { className: Ge.container, children: j.map((O, te) => /* @__PURE__ */ c(Ce.Close, { children: /* @__PURE__ */ c("li", { onClick: () => K(O), children: /* @__PURE__ */ c("img", { src: O }) }, te) }, te)) })
            ] }),
            /* @__PURE__ */ c("div", { children: R === "custom" && /* @__PURE__ */ w(Se, { children: [
              /* @__PURE__ */ c("ul", { className: Ge.container, children: F.map((O, te) => /* @__PURE__ */ c(Ce.Close, { children: /* @__PURE__ */ c("li", { onClick: () => K(O), children: /* @__PURE__ */ c("img", { src: O }) }, te) }, te)) }),
              /* @__PURE__ */ c(X, { gap: "4", p: "1", children: /* @__PURE__ */ c(Ce.Close, { children: /* @__PURE__ */ w(
                ve,
                {
                  variant: "soft",
                  style: { width: "100%" },
                  onClick: () => {
                    E(!0);
                  },
                  children: [
                    /* @__PURE__ */ c(vo, {}),
                    " ",
                    y("annotator:common.createStamp")
                  ]
                }
              ) }) }),
              /* @__PURE__ */ c(et, { my: "3", size: "4" }),
              /* @__PURE__ */ c("input", { style: { display: "none" }, type: "file", ref: x, accept: h, onChange: G }),
              /* @__PURE__ */ c(X, { gap: "2", justify: "end", children: /* @__PURE__ */ w(
                ve,
                {
                  variant: "ghost",
                  mr: "3",
                  onClick: () => {
                    x.current?.click();
                  },
                  children: [
                    /* @__PURE__ */ c(yo, {}),
                    y("annotator:editor.stamp.upload")
                  ]
                }
              ) })
            ] }) })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ c(it.Root, { open: _, onOpenChange: E, children: /* @__PURE__ */ w(it.Content, { style: { width: "550px" }, children: [
      /* @__PURE__ */ c(it.Title, { children: y("annotator:common.createStamp") }),
      /* @__PURE__ */ w("div", { className: Ge.StampTool, children: [
        /* @__PURE__ */ w("div", { className: Ge.container, children: [
          /* @__PURE__ */ c(
            "div",
            {
              className: `${Ge.imagePreview} ${$ === "dark" ? Ge.imagePreviewDark : ""}`,
              ref: T,
              style: {
                height: Pt
              }
            }
          ),
          /* @__PURE__ */ w(Wt, { align: "center", columns: "22", gap: "5", mt: "3", children: [
            /* @__PURE__ */ c(X, { direction: "column", gridColumn: "span 22", children: /* @__PURE__ */ w(ae, { as: "label", size: "2", children: [
              y("annotator:editor.stamp.stampText"),
              /* @__PURE__ */ c(Tt.Root, { value: H.stampText, onChange: (O) => B("stampText", O.target.value) })
            ] }) }),
            /* @__PURE__ */ w(X, { direction: "column", gridColumn: "span 9", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: y("annotator:editor.stamp.textColor") }),
              /* @__PURE__ */ c("div", { className: Ge.formItem, children: /* @__PURE__ */ c(
                Dt,
                {
                  transparent: !0,
                  value: H.textColor,
                  onChange: (O) => B("textColor", O),
                  presets: v,
                  popover: !0
                }
              ) })
            ] }),
            /* @__PURE__ */ w(X, { direction: "column", gridColumn: "span 8", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: y("annotator:editor.stamp.backgroundColor") }),
              /* @__PURE__ */ c("div", { className: Ge.formItem, children: /* @__PURE__ */ c(
                Dt,
                {
                  value: H.backgroundColor,
                  onChange: (O) => B("backgroundColor", O),
                  presets: v,
                  popover: !0,
                  transparent: !0
                }
              ) })
            ] }),
            /* @__PURE__ */ w(X, { direction: "column", gridColumn: "span 5", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: y("annotator:editor.stamp.borderColor") }),
              /* @__PURE__ */ c("div", { className: Ge.formItem, children: /* @__PURE__ */ c(
                Dt,
                {
                  value: H.borderColor,
                  onChange: (O) => B("borderColor", O),
                  presets: v,
                  transparent: !0,
                  popover: !0
                }
              ) })
            ] }),
            /* @__PURE__ */ w(X, { direction: "column", gridColumn: "span 9", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: y("annotator:editor.stamp.fontStyle") }),
              /* @__PURE__ */ c("div", { className: Ge.formItem, children: /* @__PURE__ */ c(
                gt.Root,
                {
                  value: H.fontStyle,
                  onValueChange: (O) => B("fontStyle", O),
                  children: /* @__PURE__ */ w(X, { direction: "row", gap: "2", children: [
                    /* @__PURE__ */ c(gt.Item, { value: "bold", children: /* @__PURE__ */ c(Pr, {}) }),
                    /* @__PURE__ */ c(gt.Item, { value: "italic", children: /* @__PURE__ */ c(Nr, {}) }),
                    /* @__PURE__ */ c(gt.Item, { value: "underline", children: /* @__PURE__ */ c(Ir, {}) }),
                    /* @__PURE__ */ c(gt.Item, { value: "strikeout", children: /* @__PURE__ */ c(Mr, {}) })
                  ] })
                }
              ) })
            ] }),
            /* @__PURE__ */ w(X, { direction: "column", gridColumn: "span 8", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: y("annotator:editor.stamp.fontFamily") }),
              /* @__PURE__ */ c("div", { className: Ge.formItem, children: /* @__PURE__ */ w(ke.Root, { value: H.fontFamily, onValueChange: (O) => B("fontFamily", O), children: [
                /* @__PURE__ */ c(ke.Trigger, {}),
                /* @__PURE__ */ c(ke.Content, { children: u.map((O) => /* @__PURE__ */ c(ke.Item, { value: O.value, children: O.label }, O.value)) })
              ] }) })
            ] }),
            /* @__PURE__ */ w(X, { direction: "column", gridColumn: "span 5", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: y("annotator:editor.stamp.borderStyle") }),
              /* @__PURE__ */ c("div", { className: Ge.formItem, children: /* @__PURE__ */ w(
                ke.Root,
                {
                  value: H.borderStyle,
                  onValueChange: (O) => B("borderStyle", O),
                  children: [
                    /* @__PURE__ */ c(ke.Trigger, {}),
                    /* @__PURE__ */ w(ke.Content, { children: [
                      /* @__PURE__ */ c(ke.Item, { value: "none", children: y("annotator:editor.stamp.none") }),
                      /* @__PURE__ */ c(ke.Item, { value: "solid", children: y("annotator:editor.stamp.solid") }),
                      /* @__PURE__ */ c(ke.Item, { value: "dashed", children: y("annotator:editor.stamp.dashed") })
                    ] })
                  ]
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ c(et, { my: "3", size: "4" }),
          /* @__PURE__ */ w(Wt, { align: "center", columns: "2", gap: "3", children: [
            /* @__PURE__ */ w(X, { direction: "column", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: y("annotator:editor.stamp.timestampText") }),
              /* @__PURE__ */ c("div", { className: Ge.formItem, children: /* @__PURE__ */ c(
                gt.Root,
                {
                  value: H.timestamp,
                  onValueChange: (O) => B("timestamp", O),
                  children: /* @__PURE__ */ w(X, { direction: "row", gap: "2", children: [
                    /* @__PURE__ */ c(gt.Item, { value: "username", children: y("annotator:editor.stamp.username") }),
                    /* @__PURE__ */ c(gt.Item, { value: "date", children: y("annotator:editor.stamp.date") })
                  ] })
                }
              ) })
            ] }),
            /* @__PURE__ */ w(X, { direction: "column", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: y("annotator:editor.stamp.dateFormat") }),
              /* @__PURE__ */ c("div", { className: Ge.formItem, children: /* @__PURE__ */ w(ke.Root, { value: H.dateFormat, onValueChange: (O) => B("dateFormat", O), children: [
                /* @__PURE__ */ c(ke.Trigger, {}),
                /* @__PURE__ */ c(ke.Content, { children: Lc?.map((O) => /* @__PURE__ */ w(ke.Group, { children: [
                  /* @__PURE__ */ c(ke.Label, { children: O.label }),
                  O.options.map((te) => /* @__PURE__ */ c(ke.Item, { value: te.value, children: te.label }, te.value))
                ] }, O.label)) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ c(Wt, { align: "center", columns: "1", gap: "3", mt: "3", children: /* @__PURE__ */ w(ae, { as: "label", size: "2", children: [
            y("annotator:editor.stamp.customTimestamp"),
            /* @__PURE__ */ c(
              Tt.Root,
              {
                value: H.customTimestampText,
                onChange: (O) => B("customTimestampText", O.target.value)
              }
            )
          ] }) }),
          /* @__PURE__ */ w(X, { gap: "3", mt: "4", justify: "end", children: [
            /* @__PURE__ */ c(it.Close, { children: /* @__PURE__ */ c(ve, { style: { width: 100 }, variant: "soft", color: "gray", children: y("cancel") }) }),
            /* @__PURE__ */ c(it.Close, { children: /* @__PURE__ */ c(ve, { style: { width: 100 }, onClick: b, children: y("ok") }) })
          ] })
        ] }),
        /* @__PURE__ */ c("div", { className: "StampTool-Toolbar" })
      ] })
    ] }) })
  ] });
}, qo = {
  select: k.SELECT,
  rectangle: k.RECTANGLE,
  circle: k.CIRCLE,
  note: k.NOTE,
  arrow: k.ARROW,
  cloud: k.CLOUD,
  freehand: k.FREEHAND,
  freeHighlight: k.FREE_HIGHLIGHT,
  freeText: k.FREETEXT,
  signature: k.SIGNATURE,
  stamp: k.STAMP
};
function Oc(o) {
  const e = Me.find((t) => t.type === qo[o]);
  if (!e) throw new Error(`UNKNOWN_ANNOTATION_TOOL:${o}`);
  return e;
}
function Hc(o) {
  return o === void 0 ? null : Object.entries(qo).find(([, t]) => t === o)?.[0] ?? null;
}
function Ln(o) {
  return o !== "menu-item" ? {} : {
    variant: "ghost",
    size: "2",
    style: { width: "100%", justifyContent: "flex-start", gap: 8 }
  };
}
const kn = ({
  tool: o,
  presentation: e = "toolbar-icon",
  label: t,
  default_signatures: n,
  default_stamps: r
}) => {
  const { t: i } = me(["annotator"], { useSuspense: !1 }), { painter: s } = tt(), a = ce((g) => g.currentAnnotationType), l = Ae(() => Oc(o), [o]), h = s?.can("annotation.create") ?? !1, d = a?.type === l.type, u = t ?? i(`annotator:tool.${l.name}`), f = Ln(e), p = Z((g = null) => {
    const m = d ? null : l;
    s?.activate(m, m && [k.SIGNATURE, k.STAMP].includes(m.type) ? g : null);
  }, [l, s, d]);
  return o === "signature" ? /* @__PURE__ */ c(
    Ec,
    {
      annotation: l,
      disabled: !h,
      selected: d,
      presentation: e,
      label: u,
      default_signatures: n,
      onAdd: (g) => p(g)
    }
  ) : o === "stamp" ? /* @__PURE__ */ c(
    _c,
    {
      annotation: l,
      disabled: !h,
      selected: d,
      presentation: e,
      label: u,
      default_stamps: r,
      onAdd: (g) => p(g)
    }
  ) : /* @__PURE__ */ c(
    St,
    {
      disabled: o !== "select" && !h,
      selected: d,
      tooltip: e === "menu-item" ? "none" : "auto",
      title: String(u),
      label: e === "menu-item" ? u : void 0,
      icon: l.icon,
      buttonProps: f,
      onClick: () => p()
    }
  );
}, Jo = ({ presentation: o = "toolbar-icon" }) => {
  const { defaultOptions: e } = Ot(), { painter: t } = tt(), n = ce((a) => a.currentAnnotationType), r = !n?.styleEditable?.color, i = Ln(o), s = (a) => {
    if (!n) return;
    const l = {
      ...n,
      style: { ...n.style, color: a }
    };
    t?.activate(l, null);
  };
  return /* @__PURE__ */ c(
    Dt,
    {
      value: n?.style?.color || e.colors[0],
      onChange: s,
      presets: e.colors,
      popover: !0,
      trigger: /* @__PURE__ */ c(
        St,
        {
          disabled: r || !t?.can("annotation.create"),
          tooltip: o === "menu-item" ? "none" : "auto",
          title: "Color",
          label: o === "menu-item" ? "Color" : void 0,
          buttonProps: i,
          icon: /* @__PURE__ */ c(
            ss,
            {
              style: { "--palette-preview-color": n?.style?.color }
            }
          )
        }
      )
    }
  );
}, Zo = ({ presentation: o = "toolbar-icon" }) => {
  const { t: e } = me(["annotator"], { useSuspense: !1 }), { painter: t } = tt(), [n, r] = V(!1), i = Ln(o);
  return st(() => {
    r(t?.areAnnotationAuthorLabelsVisible() ?? !1);
  }, [t]), /* @__PURE__ */ c(
    St,
    {
      disabled: !t,
      selected: n,
      tooltip: o === "menu-item" ? "none" : "auto",
      title: n ? e("annotator:authorLabels.hide") : e("annotator:authorLabels.show", { shortcut: "Alt" }),
      label: o === "menu-item" ? "作者标签" : void 0,
      buttonProps: i,
      icon: /* @__PURE__ */ c(as, {}),
      onClick: () => {
        if (!t) return;
        const s = !t.areAnnotationAuthorLabelsVisible();
        t.setAnnotationAuthorLabelsVisible(s), r(s);
      }
    }
  );
}, Gc = ({ defaultAnnotationName: o = "", stamps: e, signatures: t }) => {
  const n = o ? Me.find((i) => i.name === o) ?? null : null, { painter: r } = tt();
  return Lt.useEffect(() => {
    if (n)
      return r?.activate(n, null), () => {
        r?.activate(null, null);
      };
  }, [n, r]), /* @__PURE__ */ w(X, { gap: "3", align: "center", children: [
    /* @__PURE__ */ c(qt, {}),
    /* @__PURE__ */ c(et, { orientation: "vertical" }),
    /* @__PURE__ */ c(kn, { tool: "select" }),
    Me.filter((i) => i.webSelectionDependencies === !1 && i.type !== k.SELECT).map((i) => /* @__PURE__ */ c(
      kn,
      {
        tool: i.name,
        default_stamps: i.type === k.STAMP ? e : void 0,
        default_signatures: i.type === k.SIGNATURE ? t : void 0
      },
      i.name
    )),
    /* @__PURE__ */ c(et, { orientation: "vertical" }),
    /* @__PURE__ */ c(Jo, {}),
    /* @__PURE__ */ c(et, { orientation: "vertical" }),
    /* @__PURE__ */ c(Zo, {})
  ] });
}, Uc = ({ defaultAnnotationName: o, stamps: e, signatures: t }) => /* @__PURE__ */ c(
  Gc,
  {
    defaultAnnotationName: o,
    stamps: e,
    signatures: t
  }
), zc = {
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
}, Fc = ({ children: o }) => {
  const [e, t] = V(null), [n, r] = V(0), i = Z(() => r((a) => a + 1), []), s = Ae(
    () => ({ painter: e, setPainter: t, refreshPainter: i, revision: n }),
    [e, i, n]
  );
  return /* @__PURE__ */ c(Bo.Provider, { value: s, children: o });
}, jc = "_filter_xc5y0_1", Wc = "_sidebar_xc5y0_19", $c = "_list_xc5y0_19", Bc = "_group_xc5y0_23", Vc = "_comment_xc5y0_26", Yc = "_title_xc5y0_39", Kc = "_annotationHeader_xc5y0_52", Xc = "_annotationHeading_xc5y0_56", qc = "_annotationHeadingActive_xc5y0_60", Jc = "_annotationMeta_xc5y0_63", Zc = "_annotationAuthor_xc5y0_68", Qc = "_annotationDateTime_xc5y0_74", el = "_toolButton_xc5y0_78", tl = "_reply_xc5y0_81", nl = "_replyMeta_xc5y0_91", ol = "_selected_xc5y0_100", rl = "_annotationTypeIcon_xc5y0_111", il = "_commentEditor_xc5y0_122", sl = "_replyEditor_xc5y0_127", fe = {
  filter: jc,
  sidebar: Wc,
  list: $c,
  group: Bc,
  comment: Vc,
  title: Yc,
  annotationHeader: Kc,
  annotationHeading: Xc,
  annotationHeadingActive: qc,
  annotationMeta: Jc,
  annotationAuthor: Zc,
  annotationDateTime: Qc,
  toolButton: el,
  reply: tl,
  replyMeta: nl,
  selected: ol,
  annotationTypeIcon: rl,
  commentEditor: il,
  replyEditor: sl
}, al = /^#([1-9]\d*)$/;
function cl(o) {
  if (!o || typeof o != "object") return !1;
  const e = o;
  if (e.type !== "annotation" || typeof e.annotationId != "string" || e.annotationId.length === 0 || typeof e.label != "string")
    return !1;
  const t = al.exec(e.label);
  return !!(t && Number.isSafeInteger(Number(t[1])));
}
function ll(o, e) {
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
  e.forEach((s) => {
    if (!cl(s) || r.has(s.label)) return;
    const a = ll(o, s.label);
    if (a === -1) return;
    const l = n.get(s.label);
    if (l && l !== s.annotationId) {
      r.add(s.label), n.delete(s.label), Array.from(t.entries()).forEach(([d, u]) => {
        u.reference.label === s.label && t.delete(d);
      });
      return;
    }
    n.set(s.label, s.annotationId);
    const h = `${s.annotationId}\0${s.label}`;
    t.has(h) || t.set(h, { reference: s, index: a });
  });
  const i = Array.from(t.values()).sort((s, a) => s.index - a.index).map(({ reference: s }) => ({ ...s }));
  return i.length > 0 ? i : void 0;
}
function En(o, e, t) {
  const n = Zt(o, e);
  if (!n) return { content: o };
  const r = new Map(
    t.map((u) => [u.id, u])
  ), i = /* @__PURE__ */ new Map(), s = n.map((u) => {
    const f = r.get(u.annotationId)?.referenceNumber;
    if (f === void 0) return u;
    const p = `#${f}`;
    return i.set(u.label, p), p === u.label ? u : { ...u, label: p };
  }), a = Array.from(i.entries()).filter(([u, f]) => u !== f);
  if (a.length === 0)
    return { content: o, references: n };
  const l = a.map(([u]) => u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).sort((u, f) => f.length - u.length), h = new RegExp(`(?:${l.join("|")})(?!\\d)`, "g"), d = o.replace(
    h,
    (u) => i.get(u) ?? u
  );
  return {
    content: d,
    references: Zt(
      d,
      s
    )
  };
}
const dl = 20, ul = /^[\p{L}\p{N}_-]*$/u, hl = /[\s([{'",.!?;:“‘，。！？、：；]/;
function pl(o, e) {
  const t = o.slice(0, e), n = t.lastIndexOf("#");
  if (n === -1) return null;
  const r = o[n - 1];
  if (r && !hl.test(r)) return null;
  const i = t.slice(n + 1);
  return ul.test(i) ? {
    start: n,
    end: e,
    query: i
  } : null;
}
function fl(o, e, t) {
  const n = e.trim().toLocaleLowerCase();
  return o.filter((r) => r.id === t || r.referenceNumber === void 0 ? !1 : n ? [
    r.referenceNumber,
    `#${r.referenceNumber}`,
    r.title,
    r.pageNumber,
    r.subtype,
    r.contentsObj?.text
  ].filter((s) => s != null).join(" ").toLocaleLowerCase().includes(n) : !0).sort((r, i) => r.referenceNumber - i.referenceNumber).slice(0, dl);
}
const gl = new Map(
  Me.map((o) => [o.type, o.icon])
), Qo = ({
  type: o,
  label: e,
  className: t,
  decorative: n = !1,
  showTooltip: r = !0
}) => {
  const i = gl.get(o);
  if (!i) return null;
  const s = /* @__PURE__ */ c(
    "span",
    {
      className: t,
      role: n ? void 0 : "img",
      "aria-hidden": n || void 0,
      "aria-label": n ? void 0 : e,
      children: i
    }
  );
  return r ? /* @__PURE__ */ c(xt, { content: e, children: s }) : s;
}, ml = "_referenceInput_dfggt_1", vl = "_editor_dfggt_5", yl = "_referenceMenu_dfggt_9", bl = "_referenceOption_dfggt_17", Sl = "_referenceOptionHeader_dfggt_49", wl = "_referenceTypeIcon_dfggt_53", Cl = "_referencePage_dfggt_71", Al = "_referenceSummary_dfggt_77", Tl = "_referenceMeta_dfggt_87", xl = "_referenceAuthor_dfggt_97", kl = "_referenceDate_dfggt_103", El = "_referenceEmpty_dfggt_107", Rl = "_submit_dfggt_112", We = {
  referenceInput: ml,
  editor: vl,
  referenceMenu: yl,
  referenceOption: bl,
  referenceOptionHeader: Sl,
  referenceTypeIcon: wl,
  referencePage: Cl,
  referenceSummary: Al,
  referenceMeta: Tl,
  referenceAuthor: xl,
  referenceDate: kl,
  referenceEmpty: El,
  submit: Rl
}, Pl = /^[\s.,!?;:'"<>/\\，。！？；：、“”‘’《》（）()[\]{}]/, Nl = new Map(
  Me.map((o) => [o.type, o.name])
);
function Il(o) {
  const e = o.contentsObj;
  return (e?.text || e?.selectedText || "").replace(/\s+/g, " ").trim();
}
const vn = ({
  annotations: o,
  excludeAnnotationId: e,
  initialContent: t = "",
  initialReferences: n,
  className: r,
  placeholder: i,
  onSubmit: s,
  onCancel: a
}) => {
  const { t: l } = me(["annotator", "common"], { useSuspense: !1 }), h = W(null);
  h.current === null && (h.current = En(
    t,
    n,
    o
  ));
  const [d, u] = V(h.current.content), [f, p] = V(
    () => h.current?.references ?? []
  ), [g, m] = V(null), [v, y] = V(0), T = W(null), S = W(null), x = W(null), N = W(null), F = W(!1), U = W(null), $ = W([]), j = ar(), _ = Ae(
    () => fl(
      o,
      g?.query ?? "",
      e
    ),
    [o, e, g?.query]
  ), E = g !== null, R = _.length > 0 ? Math.min(v, _.length - 1) : 0;
  st(() => {
    const b = requestAnimationFrame(() => {
      T.current?.focus();
    });
    return () => cancelAnimationFrame(b);
  }, []), st(() => {
    const b = N.current;
    b !== null && (N.current = null, T.current?.focus(), T.current?.setSelectionRange(b, b));
  }, [d]), st(() => () => {
    U.current !== null && cancelAnimationFrame(U.current);
  }, []), st(() => {
    E && $.current[R]?.scrollIntoView?.({
      block: "nearest"
    });
  }, [R, E]);
  const D = (b, G) => {
    const B = pl(b, G);
    m(B), y(0);
  }, H = (b) => {
    const G = b.target.value;
    u(G), p(Zt(G, f) ?? []), F.current || D(G, b.target.selectionStart);
  }, Y = (b) => {
    if (!g || b.referenceNumber === void 0) return;
    const G = `#${b.referenceNumber}`, B = d.slice(0, g.start), L = d.slice(g.end), q = L.length === 0 || !Pl.test(L) ? " " : "", le = `${B}${G}${q}${L}`, O = [
      ...f.filter((te) => te.label !== G),
      {
        type: "annotation",
        annotationId: b.id,
        label: G
      }
    ];
    N.current = B.length + G.length + q.length, u(le), p(Zt(le, O) ?? []), m(null), y(0);
  }, ee = () => {
    s(En(
      d,
      f,
      o
    ));
  }, J = (b) => {
    if (!(b.nativeEvent.isComposing || F.current || b.keyCode === 229)) {
      if (E) {
        if (b.key === "ArrowDown") {
          b.preventDefault(), _.length > 0 && y((R + 1) % _.length);
          return;
        }
        if (b.key === "ArrowUp") {
          b.preventDefault(), _.length > 0 && y((R - 1 + _.length) % _.length);
          return;
        }
        if (b.key === "Enter") {
          b.preventDefault();
          const G = _[R];
          G && Y(G);
          return;
        }
        if (b.key === "Escape") {
          b.preventDefault(), m(null);
          return;
        }
      }
      if (b.key === "Escape") {
        b.preventDefault(), a();
        return;
      }
      b.key === "Enter" && !b.shiftKey && (b.preventDefault(), ee());
    }
  }, K = (b) => {
    b.relatedTarget instanceof Node && (S.current?.contains(b.relatedTarget) || x.current?.contains(b.relatedTarget)) || (U.current !== null && cancelAnimationFrame(U.current), U.current = requestAnimationFrame(() => {
      U.current = null, !S.current?.contains(document.activeElement) && !x.current?.contains(document.activeElement) && a();
    }));
  };
  return /* @__PURE__ */ w(
    "div",
    {
      ref: S,
      "data-annotation-editor": !0,
      className: `${We.referenceInput} ${r ?? ""}`,
      onBlurCapture: K,
      onClick: (b) => b.stopPropagation(),
      children: [
        /* @__PURE__ */ c("div", { className: We.editor, children: /* @__PURE__ */ w(
          Ce.Root,
          {
            open: E,
            onOpenChange: (b) => {
              b || m(null);
            },
            children: [
              /* @__PURE__ */ c(Ce.Trigger, { children: /* @__PURE__ */ c(
                wr,
                {
                  ref: T,
                  value: d,
                  rows: 4,
                  size: "1",
                  placeholder: i,
                  role: "combobox",
                  "aria-label": l("annotator:comment.reference.inputLabel"),
                  "aria-autocomplete": "list",
                  "aria-haspopup": "listbox",
                  "aria-expanded": E,
                  "aria-controls": E ? j : void 0,
                  "aria-activedescendant": E && _.length > 0 ? `${j}-option-${R}` : void 0,
                  onChange: H,
                  onClick: (b) => D(b.currentTarget.value, b.currentTarget.selectionStart),
                  onKeyDown: J,
                  onKeyUp: (b) => {
                    !F.current && !["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(b.key) && D(b.currentTarget.value, b.currentTarget.selectionStart);
                  },
                  onCompositionStart: () => {
                    F.current = !0;
                  },
                  onCompositionEnd: (b) => {
                    F.current = !1, D(b.currentTarget.value, b.currentTarget.selectionStart);
                  }
                }
              ) }),
              /* @__PURE__ */ c(
                Ce.Content,
                {
                  ref: x,
                  container: S.current,
                  id: j,
                  className: We.referenceMenu,
                  role: "listbox",
                  size: "1",
                  side: "bottom",
                  align: "start",
                  sideOffset: 4,
                  collisionPadding: 8,
                  onOpenAutoFocus: (b) => b.preventDefault(),
                  onCloseAutoFocus: (b) => {
                    b.preventDefault(), T.current?.focus();
                  },
                  children: _.length > 0 ? _.map((b, G) => {
                    const B = Il(b), L = Nl.get(b.type), q = L ? l(`annotator:tool.${L}`) : b.subtype, le = wn(b.date);
                    return /* @__PURE__ */ w(
                      "div",
                      {
                        id: `${j}-option-${G}`,
                        ref: (O) => {
                          $.current[G] = O;
                        },
                        role: "option",
                        "aria-selected": G === R,
                        className: We.referenceOption,
                        onMouseEnter: () => y(G),
                        onMouseDown: (O) => O.preventDefault(),
                        onClick: () => Y(b),
                        children: [
                          /* @__PURE__ */ w(X, { align: "center", gap: "2", className: We.referenceOptionHeader, children: [
                            /* @__PURE__ */ w(Cr, { size: "1", radius: "full", variant: "soft", children: [
                              "#",
                              b.referenceNumber
                            ] }),
                            /* @__PURE__ */ c(ae, { as: "span", size: "1", color: "gray", className: We.referencePage, children: l("annotator:comment.page", { value: b.pageNumber }) })
                          ] }),
                          /* @__PURE__ */ c(ae, { as: "span", size: "2", className: We.referenceSummary, children: B || l("annotator:comment.reference.noContent") }),
                          /* @__PURE__ */ w(ae, { as: "span", size: "1", color: "gray", className: We.referenceMeta, children: [
                            /* @__PURE__ */ c(
                              Qo,
                              {
                                type: b.type,
                                label: q,
                                className: We.referenceTypeIcon,
                                decorative: !0,
                                showTooltip: !1
                              }
                            ),
                            /* @__PURE__ */ c("span", { className: We.referenceAuthor, children: b.title }),
                            le && /* @__PURE__ */ w(Se, { children: [
                              /* @__PURE__ */ c("span", { "aria-hidden": "true", children: "·" }),
                              /* @__PURE__ */ c("span", { className: We.referenceDate, children: le })
                            ] })
                          ] })
                        ]
                      },
                      b.id
                    );
                  }) : /* @__PURE__ */ c(ae, { as: "div", size: "2", color: "gray", className: We.referenceEmpty, children: l("annotator:comment.reference.empty") })
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ c(
          ve,
          {
            type: "button",
            className: We.submit,
            onMouseDown: (b) => b.preventDefault(),
            onClick: ee,
            children: l("common:confirm")
          }
        )
      ]
    }
  );
};
function Ml(o) {
  return o.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Dl(o, e) {
  if (!o || !e?.length)
    return [{ kind: "text", value: o }];
  const t = new Map(
    e.map((a) => [a.label, a])
  ), n = Array.from(t.keys()).sort((a, l) => l.length - a.length), r = new RegExp(
    `(${n.map(Ml).join("|")})(?!\\d)`,
    "g"
  ), i = [];
  let s = 0;
  return o.replace(r, (a, l, h) => {
    h > s && i.push({
      kind: "text",
      value: o.slice(s, h)
    });
    const d = t.get(a);
    return d && i.push({
      kind: "reference",
      value: a,
      annotationId: d.annotationId
    }), s = h + a.length, a;
  }), s < o.length && i.push({
    kind: "text",
    value: o.slice(s)
  }), i.length > 0 ? i : [{ kind: "text", value: o }];
}
const Ll = "_content_1x9x1_1", _l = "_reference_1x9x1_6", Ol = "_unavailable_1x9x1_29", yn = {
  content: Ll,
  reference: _l,
  unavailable: Ol
}, ao = ({
  annotations: o,
  content: e = "",
  references: t,
  onActivate: n
}) => {
  const { t: r } = me("annotator", { useSuspense: !1 }), i = Ae(
    () => new Map(o.map((l) => [l.id, l])),
    [o]
  ), s = Ae(
    () => En(e, t, o),
    [o, e, t]
  ), a = Ae(
    () => Dl(
      s.content,
      s.references
    ),
    [s]
  );
  return /* @__PURE__ */ c("span", { className: yn.content, children: a.map((l, h) => {
    if (l.kind === "text")
      return /* @__PURE__ */ c(Lt.Fragment, { children: l.value }, `text-${h}`);
    const d = i.get(l.annotationId);
    return d ? /* @__PURE__ */ c(
      Xo,
      {
        annotation: d,
        onActivate: n,
        children: /* @__PURE__ */ c(
          "button",
          {
            className: yn.reference,
            type: "button",
            "aria-label": r("comment.reference.open", {
              value: l.value
            }),
            onClick: (u) => {
              u.stopPropagation(), n(l.annotationId);
            },
            children: l.value
          }
        )
      },
      `reference-${l.annotationId}-${h}`
    ) : /* @__PURE__ */ c(
      "span",
      {
        className: yn.unavailable,
        "aria-label": r("comment.reference.unavailable", {
          value: l.value
        }),
        title: r("comment.reference.unavailable", {
          value: l.value
        }),
        children: l.value
      },
      `reference-${l.annotationId}-${h}`
    );
  }) });
};
function Hl(o, e) {
  return {
    ...o || { text: "" },
    text: e.content,
    references: e.references
  };
}
function Gl({
  id: o,
  title: e,
  date: t,
  draft: n,
  status: r,
  user: i
}) {
  return {
    id: o,
    title: e,
    date: t,
    content: n.content,
    references: n.references,
    status: r,
    user: i
  };
}
function Ul(o, e, t, n, r) {
  return o.map((i) => i.id === e ? {
    ...i,
    content: t.content,
    references: t.references,
    date: n,
    title: r
  } : i);
}
const co = new Map(
  Me.map((o) => [o.type, o.name])
), jt = {
  [rt.Accepted]: {
    labelKey: "annotator:comment.status.accepted",
    icon: /* @__PURE__ */ c(zr, {})
  },
  [rt.Rejected]: {
    labelKey: "annotator:comment.status.rejected",
    icon: /* @__PURE__ */ c(Ur, {})
  },
  [rt.Cancelled]: {
    labelKey: "annotator:comment.status.cancelled",
    icon: /* @__PURE__ */ c(Gr, {})
  },
  [rt.Completed]: {
    labelKey: "annotator:comment.status.completed",
    icon: /* @__PURE__ */ c(Hr, {})
  },
  [rt.Closed]: {
    labelKey: "annotator:comment.status.closed",
    icon: /* @__PURE__ */ c(Or, {})
  },
  [rt.None]: {
    labelKey: "annotator:comment.status.none",
    icon: /* @__PURE__ */ c(_r, {})
  }
}, zl = () => {
  const o = ce((C) => C.annotations), e = _t(Mn), { isSidebarCollapsed: t } = je(), { painter: n } = tt(), r = ce((C) => C.selectedAnnotation), i = ce((C) => C.selectionRevision), s = ce((C) => C.setSelectedAnnotation), [a, l] = V(null), [h, d] = V([]), [u, f] = V([]), [p, g] = V(null), m = W(null), v = W(null), y = W(null), T = W(null), { t: S } = me(["common", "annotator"], { useSuspense: !1 }), x = a?.annotationId ?? null;
  ne(() => {
    const C = r?.store?.id;
    if (!C || r.source !== Ve.CANVAS || t)
      return;
    const M = ce.getState().getAnnotation(C);
    if (!M) return;
    const A = !!n?.can("annotation.edit", M), P = M.contentsObj?.text === "", se = M.comments?.length === 0;
    l(
      A && P && se ? { kind: "annotation-edit", annotationId: M.id } : n?.can("annotation.comment", M) ? { kind: "annotation-reply", annotationId: M.id } : null
    );
  }, [
    r?.source,
    r?.store?.id,
    t,
    n,
    i
  ]);
  const N = W({});
  st(() => {
    if (!a) return;
    const C = requestAnimationFrame(() => {
      N.current[a.annotationId]?.querySelector("[data-annotation-editor]")?.scrollIntoView?.({
        behavior: "auto",
        block: "nearest",
        inline: "nearest"
      });
    });
    return () => cancelAnimationFrame(C);
  }, [a]);
  const F = Ae(() => {
    const C = /* @__PURE__ */ new Map();
    return o.forEach((M) => {
      C.set(M.title, (C.get(M.title) || 0) + 1);
    }), Array.from(C.entries());
  }, [o]), U = Ae(() => {
    const C = /* @__PURE__ */ new Map();
    return o.forEach((M) => {
      const A = C.get(M.type);
      C.set(M.type, {
        count: (A?.count || 0) + 1,
        fallbackLabel: A?.fallbackLabel || M.subtype
      });
    }), Array.from(C.entries());
  }, [o]);
  ne(() => {
    const C = new Set(F.map(([A]) => A)), M = m.current;
    m.current = C, d((A) => {
      if (M === null) return Array.from(C);
      const P = A.filter((pe) => C.has(pe)), se = Array.from(C).filter((pe) => !M.has(pe)), ue = [...P, ...se];
      return ue.length === A.length && ue.every((pe, ze) => pe === A[ze]) ? A : ue;
    });
  }, [F]), ne(() => {
    const C = new Set(U.map(([A]) => A)), M = v.current;
    v.current = C, f((A) => {
      if (M === null) return Array.from(C);
      const P = A.filter((pe) => C.has(pe)), se = Array.from(C).filter((pe) => !M.has(pe)), ue = [...P, ...se];
      return ue.length === A.length && ue.every((pe, ze) => pe === A[ze]) ? A : ue;
    });
  }, [U]), ne(() => () => {
    T.current !== null && cancelAnimationFrame(T.current), y.current = null;
  }, []);
  const $ = Ae(() => h.length === 0 || u.length === 0 ? [] : Array.from(o.values()).filter((C) => h.includes(C.title) && u.includes(C.type)), [o, h, u]);
  ne(() => {
    if (!a) return;
    const C = r?.store?.id, M = $.some(
      (P) => P.id === a.annotationId
    ), A = !!(C && C !== a.annotationId && r?.source === Ve.CANVAS);
    M && !t && (C === a.annotationId || A) || l(null);
  }, [
    r?.source,
    r?.store?.id,
    a,
    $,
    t
  ]);
  const j = Ae(
    () => Array.from(o.values()),
    [o]
  ), _ = Ae(() => $.reduce(
    (C, M) => (C[M.pageNumber] || (C[M.pageNumber] = []), C[M.pageNumber].push(M), C),
    {}
  ), [$]);
  ne(() => {
    if (!p) return;
    const C = window.requestAnimationFrame(() => {
      const M = N.current[p];
      M && (M.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      }), g(null));
    });
    return () => window.cancelAnimationFrame(C);
  }, [_, p]);
  const E = (C) => {
    d((M) => M.includes(C) ? M.filter((A) => A !== C) : [...M, C]);
  }, R = (C) => {
    f((M) => M.includes(C) ? M.filter((A) => A !== C) : [...M, C]);
  }, D = /* @__PURE__ */ w("div", { className: fe.filter, children: [
    /* @__PURE__ */ c(ae, { as: "div", children: S("author") }),
    /* @__PURE__ */ c("ul", { children: F.map(([C, M]) => /* @__PURE__ */ c("li", { children: /* @__PURE__ */ c(ae, { as: "label", size: "2", children: /* @__PURE__ */ w(X, { gap: "2", children: [
      /* @__PURE__ */ c(Vt, { checked: h.includes(C), onCheckedChange: () => E(C) }),
      C,
      " (",
      M,
      ")"
    ] }) }) }, C)) }),
    /* @__PURE__ */ c(ae, { as: "div", children: S("type") }),
    /* @__PURE__ */ c("ul", { children: U.map(([C, { count: M, fallbackLabel: A }]) => {
      const P = co.get(C), se = P ? S(`annotator:tool.${P}`) : A;
      return /* @__PURE__ */ c("li", { children: /* @__PURE__ */ c(ae, { as: "label", size: "2", children: /* @__PURE__ */ w(X, { gap: "2", children: [
        /* @__PURE__ */ c(Vt, { checked: u.includes(C), onCheckedChange: () => R(C) }),
        se,
        " (",
        M,
        ")"
      ] }) }) }, C);
    }) }),
    /* @__PURE__ */ w(X, { gap: "3", mt: "2", justify: "between", children: [
      /* @__PURE__ */ c(
        ve,
        {
          variant: "ghost",
          onClick: () => {
            d(F.map(([C]) => C)), f(U.map(([C]) => C));
          },
          children: S("selectAll")
        }
      ),
      /* @__PURE__ */ c(
        ve,
        {
          variant: "ghost",
          onClick: () => {
            d([]), f([]);
          },
          children: S("clear")
        }
      )
    ] })
  ] }), H = (C) => [...C.comments || []].reverse().find((A) => A.status !== void 0 && A.status !== null)?.status ?? rt.None, Y = (C) => {
    const M = H(C);
    return jt[M]?.icon ?? jt[rt.None].icon;
  }, ee = (C) => {
    x && x !== C.id && l(null), s(C, Ve.SIDEBAR), n?.highlight(C);
  }, J = (C) => {
    x && (C.preventDefault(), C.stopPropagation(), l(null));
  }, K = (C) => {
    ee(C), l({
      kind: "annotation-reply",
      annotationId: C.id
    });
  }, b = (C) => {
    ee(C), l({
      kind: "annotation-edit",
      annotationId: C.id
    });
  }, G = (C, M) => {
    ee(C), l({
      kind: "reply-edit",
      annotationId: C.id,
      replyId: M.id
    });
  }, B = (C) => {
    y.current = C;
  }, L = (C) => {
    C.preventDefault();
    const M = y.current;
    y.current = null, M && (T.current !== null && cancelAnimationFrame(T.current), T.current = requestAnimationFrame(() => {
      T.current = null, M();
    }));
  }, q = (C) => {
    const M = o.get(C);
    M && (d((A) => A.includes(M.title) ? A : [...A, M.title]), f((A) => A.includes(M.type) ? A : [...A, M.type]), g(M.id), s(M, Ve.SIDEBAR), n?.highlight(M));
  }, le = (C, M) => {
    const A = ce.getState().getAnnotation(C.id);
    !A || !n?.can("annotation.edit", A) || (n.update(A.id, {
      contentsObj: Hl(A.contentsObj, M),
      date: Bt(Date.now())
    }, "annotation.edit"), l(null));
  }, O = (C, M, A) => {
    const P = ce.getState().getAnnotation(C.id);
    if (!P) return;
    const se = A === void 0 ? "annotation.comment" : "annotation.change-status";
    if (!n?.can(se, P)) return;
    const ue = e?.user ?? void 0, pe = Gl({
      id: _o(),
      title: ue?.name ?? "Anonymous",
      date: Bt(Date.now()),
      draft: M,
      status: A,
      user: ue
    });
    n.update(P.id, {
      comments: [...P.comments || [], pe]
    }, se), l(null);
  }, te = (C, M, A) => {
    const P = ce.getState().getAnnotation(C.id), se = P?.comments?.find((pe) => pe.id === M.id);
    if (!P || !se || !n?.can("comment.edit", P, se))
      return;
    const ue = Ul(
      P.comments || [],
      se.id,
      A,
      Bt(Date.now()),
      e?.user?.name || se.title
    );
    n.update(P.id, {
      comments: ue
    }, "comment.edit", se), l(null);
  }, de = (C) => {
    n?.can("annotation.delete", C) && n?.delete(C.id, !0);
  }, he = (C, M) => {
    n?.deleteComment(C.id, M.id) && a?.kind === "reply-edit" && a.replyId === M.id && l(null);
  }, Ee = (C) => {
    if (a?.kind === "annotation-edit" && a.annotationId === C.id && r?.store?.id === C.id)
      return /* @__PURE__ */ c(
        vn,
        {
          annotations: j,
          excludeAnnotationId: C.id,
          initialContent: C.contentsObj?.text,
          initialReferences: C.contentsObj?.references,
          className: fe.commentEditor,
          placeholder: S("annotator:comment.reference.commentPlaceholder"),
          onSubmit: (A) => le(C, A),
          onCancel: () => {
            l(null);
          }
        }
      );
    const M = C.contentsObj?.text;
    return M?.trim() ? /* @__PURE__ */ c(X, { gap: "3", pl: "4", children: /* @__PURE__ */ c(ae, { as: "p", size: "2", children: /* @__PURE__ */ c(
      ao,
      {
        annotations: j,
        content: M,
        references: C.contentsObj?.references,
        onActivate: q
      }
    ) }) }) : null;
  }, xe = (C) => a?.kind === "annotation-reply" && a.annotationId === C.id && r?.store?.id === C.id ? /* @__PURE__ */ c(
    vn,
    {
      annotations: j,
      excludeAnnotationId: C.id,
      className: fe.commentEditor,
      placeholder: S("annotator:comment.reference.replyPlaceholder"),
      onSubmit: (M) => O(C, M),
      onCancel: () => {
        l(null);
      }
    }
  ) : null, $e = (C, M) => a?.kind === "reply-edit" && a.annotationId === C.id && a.replyId === M.id ? /* @__PURE__ */ c(
    vn,
    {
      annotations: j,
      excludeAnnotationId: C.id,
      initialContent: M.content,
      initialReferences: M.references,
      className: fe.replyEditor,
      placeholder: S("annotator:comment.reference.replyPlaceholder"),
      onSubmit: (A) => te(C, M, A),
      onCancel: () => {
        l(null);
      }
    }
  ) : /* @__PURE__ */ c(X, { gap: "3", children: /* @__PURE__ */ c(ae, { as: "p", size: "2", children: /* @__PURE__ */ c(
    ao,
    {
      annotations: j,
      content: M.content,
      references: M.references,
      onActivate: q
    }
  ) }) }), He = Object.entries(_).map(([C, M]) => {
    const A = M.sort((P, se) => P.konvaClientRect.y - se.konvaClientRect.y);
    return /* @__PURE__ */ w("div", { className: fe.group, children: [
      /* @__PURE__ */ w(X, { gap: "2", justify: "between", p: "1", children: [
        /* @__PURE__ */ c(ae, { size: "1", children: S("annotator:comment.page", { value: C }) }),
        /* @__PURE__ */ c(ae, { size: "1", children: S("annotator:comment.total", { value: M.length }) })
      ] }),
      A.map((P) => {
        const se = P.id === r?.store?.id, ue = !!n?.can("annotation.comment", P), pe = !!n?.can("annotation.edit", P), ze = !!n?.can("annotation.delete", P), vt = !!n?.can("annotation.change-status", P), Fe = H(P), Be = Wo(P) ?? P.title, nt = pt(P.referenceNumber), qe = nt ? `#${P.referenceNumber}` : Be, Oe = nt && se, _e = Un(P.date), dt = co.get(P.type), Ct = dt ? S(`annotator:tool.${dt}`) : P.subtype, on = {
          className: [
            fe.comment,
            se ? fe.selected : ""
          ].filter(Boolean).join(" "),
          id: `annotation-${P.id}`
        };
        return /* @__PURE__ */ cr(
          "div",
          {
            ...on,
            key: P.id,
            onClick: () => ee(P),
            ref: (be) => N.current[P.id] = be
          },
          /* @__PURE__ */ w("div", { className: `${fe.title} ${fe.annotationHeader}`, children: [
            /* @__PURE__ */ w(
              ae,
              {
                as: "div",
                size: "2",
                weight: "medium",
                highContrast: !0,
                className: [
                  fe.annotationHeading,
                  Oe ? fe.annotationHeadingActive : ""
                ].filter(Boolean).join(" "),
                children: [
                  qe,
                  P.native && /* @__PURE__ */ c(xt, { content: S("annotator:comment.nativeAnnotation"), children: /* @__PURE__ */ c("span", { children: /* @__PURE__ */ c(Dr, {}) }) })
                ]
              }
            ),
            /* @__PURE__ */ w(
              X,
              {
                align: "center",
                gap: "1",
                ml: "auto",
                onClick: (be) => be.stopPropagation(),
                children: [
                  vt && /* @__PURE__ */ w(ge.Root, { children: [
                    /* @__PURE__ */ c(ge.Trigger, { children: /* @__PURE__ */ c(
                      Qe,
                      {
                        variant: "ghost",
                        color: "gray",
                        size: "1",
                        className: fe.toolButton,
                        "aria-label": S(jt[Fe].labelKey),
                        onPointerDown: J,
                        style: {
                          boxShadow: "none"
                        },
                        children: Y(P)
                      }
                    ) }),
                    /* @__PURE__ */ c(
                      ge.Content,
                      {
                        onCloseAutoFocus: L,
                        children: Object.entries(jt).map(([be, ft]) => /* @__PURE__ */ w(
                          ge.Item,
                          {
                            onSelect: () => {
                              O(
                                P,
                                {
                                  content: S("annotator:comment.statusText", { value: S(ft.labelKey) })
                                },
                                be
                              );
                            },
                            children: [
                              ft.icon,
                              " ",
                              S(ft.labelKey)
                            ]
                          },
                          be
                        ))
                      }
                    )
                  ] }),
                  (ue || pe || ze) && /* @__PURE__ */ w(ge.Root, { children: [
                    /* @__PURE__ */ c(ge.Trigger, { children: /* @__PURE__ */ c(
                      Qe,
                      {
                        variant: "ghost",
                        color: "gray",
                        size: "1",
                        className: fe.toolButton,
                        "aria-label": S("more"),
                        onPointerDown: J,
                        style: {
                          boxShadow: "none"
                        },
                        children: /* @__PURE__ */ c(Hn, {})
                      }
                    ) }),
                    /* @__PURE__ */ w(
                      ge.Content,
                      {
                        onCloseAutoFocus: L,
                        children: [
                          ue && /* @__PURE__ */ c(
                            ge.Item,
                            {
                              onSelect: (be) => {
                                be.stopPropagation(), B(() => K(P));
                              },
                              children: S("reply")
                            }
                          ),
                          pe && /* @__PURE__ */ c(
                            ge.Item,
                            {
                              onSelect: (be) => {
                                be.stopPropagation(), B(() => b(P));
                              },
                              children: S("edit")
                            }
                          ),
                          ze && /* @__PURE__ */ c(
                            ge.Item,
                            {
                              onSelect: (be) => {
                                be.stopPropagation(), de(P);
                              },
                              children: S("delete")
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
          /* @__PURE__ */ w(X, { align: "center", gap: "1", className: fe.annotationMeta, children: [
            /* @__PURE__ */ c(
              Qo,
              {
                type: P.type,
                label: Ct,
                className: fe.annotationTypeIcon
              }
            ),
            /* @__PURE__ */ c(
              ae,
              {
                as: "span",
                size: "1",
                color: "gray",
                className: fe.annotationAuthor,
                children: Be
              }
            ),
            _e && /* @__PURE__ */ w(Se, { children: [
              /* @__PURE__ */ c(ae, { as: "span", size: "1", color: "gray", "aria-hidden": "true", children: "·" }),
              /* @__PURE__ */ c(
                ae,
                {
                  as: "span",
                  size: "1",
                  color: "gray",
                  className: fe.annotationDateTime,
                  children: _e
                }
              )
            ] })
          ] }),
          Ee(P),
          P.comments?.map((be) => {
            const ft = Un(be.date), Ht = !!n?.can("comment.edit", P, be), kt = !!n?.can("comment.delete", P, be);
            return /* @__PURE__ */ w("div", { className: fe.reply, children: [
              /* @__PURE__ */ w("div", { className: `${fe.title} ${fe.annotationHeader}`, children: [
                /* @__PURE__ */ c(
                  ae,
                  {
                    truncate: !0,
                    size: "1",
                    weight: "medium",
                    as: "div",
                    className: fe.annotationHeading,
                    children: be.title
                  }
                ),
                (Ht || kt) && /* @__PURE__ */ c(
                  X,
                  {
                    align: "center",
                    gap: "1",
                    ml: "auto",
                    onClick: (Je) => Je.stopPropagation(),
                    children: /* @__PURE__ */ w(ge.Root, { children: [
                      /* @__PURE__ */ c(ge.Trigger, { children: /* @__PURE__ */ c(
                        Qe,
                        {
                          variant: "ghost",
                          color: "gray",
                          highContrast: !0,
                          size: "1",
                          className: fe.toolButton,
                          "aria-label": S("more"),
                          onPointerDown: J,
                          style: {
                            boxShadow: "none"
                          },
                          children: /* @__PURE__ */ c(Hn, {})
                        }
                      ) }),
                      /* @__PURE__ */ w(
                        ge.Content,
                        {
                          onCloseAutoFocus: L,
                          children: [
                            Ht && /* @__PURE__ */ c(
                              ge.Item,
                              {
                                onSelect: (Je) => {
                                  Je.stopPropagation(), B(() => G(P, be));
                                },
                                children: S("edit")
                              }
                            ),
                            kt && /* @__PURE__ */ c(
                              ge.Item,
                              {
                                onSelect: (Je) => {
                                  Je.stopPropagation(), he(P, be);
                                },
                                children: S("delete")
                              }
                            )
                          ]
                        }
                      )
                    ] })
                  }
                )
              ] }),
              ft && /* @__PURE__ */ c(X, { align: "center", className: `${fe.annotationMeta} ${fe.replyMeta}`, children: /* @__PURE__ */ c(ae, { as: "span", size: "1", color: "gray", children: ft }) }),
              $e(P, be)
            ] }, be.id);
          }),
          /* @__PURE__ */ w("div", { children: [
            xe(P),
            ue && !a && r?.store?.id === P.id && /* @__PURE__ */ c(ve, { mt: "2", style: { width: "100%" }, onClick: () => K(P), children: S("reply") })
          ] })
        );
      })
    ] }, C);
  });
  return /* @__PURE__ */ w("div", { className: fe.sidebar, children: [
    /* @__PURE__ */ c(X, { align: "center", justify: "start", p: "1", children: /* @__PURE__ */ w(Ce.Root, { children: [
      /* @__PURE__ */ c(Ce.Trigger, { children: /* @__PURE__ */ c(
        ve,
        {
          variant: "outline",
          size: "2",
          color: "gray",
          highContrast: !0,
          style: {
            boxShadow: "none",
            fontSize: "16px"
          },
          children: /* @__PURE__ */ c(Lr, {})
        }
      ) }),
      /* @__PURE__ */ c(Ce.Content, { children: D })
    ] }) }),
    /* @__PURE__ */ c("div", { className: fe.list, children: He })
  ] });
};
function wt(o) {
  const e = JSON.parse(o);
  if (!e || typeof e != "object")
    throw new Error("Invalid serialized Konva node");
  return e;
}
class Xe {
  annotation;
  page;
  pdfDoc;
  pageView;
  constructor(e, t, n, r) {
    this.pdfDoc = e, this.page = t, this.annotation = n, this.pageView = r;
  }
  addAnnotationToPage(e, t) {
    const n = e.node.lookup(z.of("Annots"));
    n ? n.push(t) : e.node.set(z.of("Annots"), e.doc.context.obj([t]));
  }
  getExportTitle(e) {
    const t = this.annotation.user?.name?.trim() || this.annotation.title?.trim() || e;
    return pt(this.annotation.referenceNumber) ? `${t} · #${this.annotation.referenceNumber}` : t;
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
class Fl extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, [i, s] = Re(e.konvaClientRect, r), a = n.context, l = 32, h = [Q.of(i), Q.of(s), Q.of(i + l), Q.of(s + l)], d = a.obj({
      Type: z.of("Annot"),
      Subtype: z.of("Text"),
      Rect: h,
      NM: re.of(e.id),
      // 唯一标识
      Contents: ie(e.contentsObj?.text || ""),
      Name: z.of("Comment"),
      T: ie(this.getExportTitle(ye("normal.unknownUser"))),
      M: re.of(e.date || ""),
      C: De(e.color || "#000000"),
      F: Q.of(4),
      P: t.ref,
      Open: !1
    }), u = a.register(d);
    this.addAnnotationToPage(t, u);
    for (const f of e.comments || []) {
      const p = a.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: h,
        Contents: ie(f.content),
        T: ie(f.title || ye("normal.unknownUser")),
        M: re.of(f.date || ""),
        C: De(e.color || "#000000"),
        IRT: u,
        RT: z.of("R"),
        NM: re.of(f.id),
        // 唯一标识
        Open: !1
      }), g = a.register(p);
      this.addAnnotationToPage(t, g);
    }
  }
}
function bt(o, e) {
  const t = e.attrs ?? {}, n = t.scaleX ?? 1, r = t.scaleY ?? 1, i = t.offsetX ?? 0, s = t.offsetY ?? 0, a = (o.x - i) * n, l = (o.y - s) * r, h = (t.rotation ?? 0) * Math.PI / 180, d = Math.cos(h), u = Math.sin(h);
  return {
    x: (t.x ?? 0) + a * d - l * u,
    y: (t.y ?? 0) + a * u + l * d
  };
}
function _n(o, e) {
  const t = o.x ?? 0, n = o.y ?? 0, r = o.width ?? 0, i = o.height ?? 0, s = [
    bt({ x: t, y: n }, e),
    bt({ x: t + r, y: n }, e),
    bt({ x: t, y: n + i }, e),
    bt({ x: t + r, y: n + i }, e)
  ], a = s.map((p) => p.x), l = s.map((p) => p.y), h = Math.min(...a), d = Math.max(...a), u = Math.min(...l), f = Math.max(...l);
  return { x: h, y: u, width: d - h, height: f - u };
}
function Rn(o, e) {
  const { viewport: t } = e;
  return t.convertToPdfPoint(o.x * t.scale, o.y * t.scale);
}
class jl extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, i = n.context, s = wt(e.konvaString), a = (s.children ?? []).filter((u) => u.className === "Rect"), l = [];
    for (const u of a) {
      const f = _n(u.attrs ?? {}, s), [p, g, m, v] = Re(f, r);
      l.push(
        p,
        v,
        // 左上
        m,
        v,
        // 右上
        p,
        g,
        // 左下
        m,
        g
        // 右下
      );
    }
    const h = i.obj({
      Type: z.of("Annot"),
      Subtype: z.of("Highlight"),
      Rect: Re(e.konvaClientRect, r),
      QuadPoints: l,
      C: De(e.color || "#000000"),
      // 批注颜色
      T: ie(this.getExportTitle(ye("normal.unknownUser"))),
      // 编号与作者
      // QuadPoints anchor the source text; Contents is only the user-authored note.
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      // 日期
      NM: re.of(e.id),
      // 唯一标识
      F: Q.of(4)
    }), d = i.register(h);
    this.addAnnotationToPage(t, d);
    for (const u of e.comments || []) {
      const f = i.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: [0, 0, 0, 0],
        Contents: ie(u.content),
        T: ie(u.title || ye("normal.unknownUser")),
        M: re.of(u.date || ""),
        C: De(e.color || "#000000"),
        IRT: d,
        RT: z.of("R"),
        NM: re.of(u.id),
        // 唯一标识
        Open: !1
      }), p = i.register(f);
      this.addAnnotationToPage(t, p);
    }
  }
}
class Wl extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, i = n.context, s = wt(e.konvaString), a = (s.children ?? []).filter((u) => u.className === "Rect"), l = [];
    for (const u of a) {
      const f = _n(u.attrs ?? {}, s), [p, g, m, v] = Re(f, r);
      l.push(
        p,
        v,
        // 左上
        m,
        v,
        // 右上
        p,
        g,
        // 左下
        m,
        g
        // 右下
      );
    }
    const h = i.obj({
      Type: z.of("Annot"),
      Subtype: z.of("Underline"),
      Rect: Re(e.konvaClientRect, r),
      QuadPoints: l,
      C: De(e.color || "#000000"),
      T: ie(this.getExportTitle(ye("normal.unknownUser"))),
      // QuadPoints anchor the source text; Contents is only the user-authored note.
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      F: Q.of(4)
    }), d = i.register(h);
    this.addAnnotationToPage(t, d);
    for (const u of e.comments || []) {
      const f = i.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: Re(e.konvaClientRect, r),
        Contents: ie(u.content),
        T: ie(u.title || ye("normal.unknownUser")),
        M: re.of(u.date || ""),
        C: De(e.color || "#000000"),
        IRT: d,
        RT: z.of("R"),
        NM: re.of(u.id),
        Open: !1
      }), p = i.register(f);
      this.addAnnotationToPage(t, p);
    }
  }
}
class $l extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, i = n.context, s = wt(e.konvaString), a = (s.children ?? []).filter((u) => u.className === "Rect"), l = [];
    for (const u of a) {
      const f = _n(u.attrs ?? {}, s), [p, g, m, v] = Re(f, r);
      l.push(
        p,
        v,
        // 左上
        m,
        v,
        // 右上
        p,
        g,
        // 左下
        m,
        g
        // 右下
      );
    }
    const h = i.obj({
      Type: z.of("Annot"),
      Subtype: z.of("StrikeOut"),
      Rect: Re(e.konvaClientRect, r),
      QuadPoints: l,
      C: De(e.color || "#000000"),
      T: ie(this.getExportTitle(ye("normal.unknownUser"))),
      // QuadPoints anchor the source text; Contents is only the user-authored note.
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      F: Q.of(4)
    }), d = i.register(h);
    this.addAnnotationToPage(t, d);
    for (const u of e.comments || []) {
      const f = i.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: Re(e.konvaClientRect, r),
        Contents: ie(u.content),
        T: ie(u.title || ye("normal.unknownUser")),
        M: re.of(u.date || ""),
        C: De(e.color || "#000000"),
        IRT: d,
        RT: z.of("R"),
        NM: re.of(u.id),
        Open: !1
      }), p = i.register(f);
      this.addAnnotationToPage(t, p);
    }
  }
}
class Bl extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, i = n.context, s = wt(e.konvaString), l = (s.children?.[0] ?? s).attrs ?? s.attrs ?? {}, h = l.strokeWidth ?? 2, d = l.dash ?? [], u = l.opacity ?? 1, f = {
      W: Q.of(h),
      S: z.of(d.length > 0 ? "D" : "S"),
      ...d.length > 0 ? { D: i.obj(d) } : {}
    }, p = i.obj({
      Type: z.of("Annot"),
      Subtype: z.of("Square"),
      Rect: Re(e.konvaClientRect, r),
      C: De(e.color || "#000000"),
      // 边框颜色
      T: ie(this.getExportTitle(ye("normal.unknownUser"))),
      // 编号与作者
      Contents: ie(e.contentsObj?.text || ""),
      // 说明文字
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      // 唯一标识
      F: Q.of(4),
      P: t.ref,
      BS: i.obj(f),
      CA: Q.of(u)
    }), g = i.register(p);
    this.addAnnotationToPage(t, g);
    for (const m of e.comments || []) {
      const v = i.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: Re(e.konvaClientRect, r),
        Contents: ie(m.content),
        T: ie(m.title || ye("normal.unknownUser")),
        M: re.of(m.date || ""),
        C: De(e.color || "#000000"),
        IRT: g,
        RT: z.of("R"),
        NM: re.of(m.id),
        Open: !1
      }), y = i.register(v);
      this.addAnnotationToPage(t, y);
    }
  }
}
class Vl extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, i = n.context, a = wt(e.konvaString).children?.find((v) => v.className === "Ellipse");
    if (!a) throw new Error(`Annotation ${e.id} is missing its ellipse geometry.`);
    const l = a.attrs ?? {}, h = l.strokeWidth ?? 2, d = l.dash ?? [], u = l.opacity ?? 1, f = {
      W: Q.of(h),
      S: z.of(d.length > 0 ? "D" : "S"),
      ...d.length > 0 ? { D: i.obj(d) } : {}
    }, p = Re(e.konvaClientRect, r), g = i.obj({
      Type: z.of("Annot"),
      Subtype: z.of("Circle"),
      Rect: p,
      C: De(e.color || "#000000"),
      T: ie(this.getExportTitle(ye("normal.unknownUser"))),
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      F: Q.of(4),
      P: t.ref,
      BS: i.obj(f),
      CA: Q.of(u)
    }), m = i.register(g);
    this.addAnnotationToPage(t, m);
    for (const v of e.comments || []) {
      const y = i.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: p,
        Contents: ie(v.content),
        T: ie(v.title || ye("normal.unknownUser")),
        M: re.of(v.date || ""),
        C: De(e.color || "#000000"),
        IRT: m,
        RT: z.of("R"),
        NM: re.of(v.id),
        Open: !1
      }), T = i.register(y);
      this.addAnnotationToPage(t, T);
    }
  }
}
class Yl extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, i = n.context, s = wt(e.konvaString), a = (s.children ?? []).filter((j) => j.className === "Line"), { groupX: l, groupY: h, scaleX: d, scaleY: u } = this.extractGroupTransform(s), f = r.viewport, p = i.obj(
      a.map((j) => {
        const _ = j.attrs?.points ?? [], E = [];
        for (let R = 0; R < _.length; R += 2) {
          const D = l + _[R] * d, H = h + _[R + 1] * u, Y = D * f.scale, ee = H * f.scale, [J, K] = f.convertToPdfPoint(Y, ee);
          E.push(J, K);
        }
        return i.obj(E);
      })
    ), g = a[0]?.attrs ?? {}, m = g.strokeWidth ?? 1, v = g.opacity ?? 1, y = g.stroke ?? e.color ?? "rgb(255, 0, 0)", [T, S, x] = De(y), N = i.obj({
      W: Q.of(m),
      S: z.of("S")
      // Solid border style
    }), F = Re(e.konvaClientRect, r), U = i.obj({
      Type: z.of("Annot"),
      Subtype: z.of("Ink"),
      Rect: F,
      InkList: p,
      C: i.obj([Q.of(T), Q.of(S), Q.of(x)]),
      T: ie(this.getExportTitle(ye("normal.unknownUser"))),
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      Border: i.obj([0, 0, 0]),
      BS: N,
      F: Q.of(4),
      P: t.ref,
      CA: Q.of(v)
      // Non-stroking opacity (used for drawing)
    }), $ = i.register(U);
    this.addAnnotationToPage(t, $);
    for (const j of e.comments || []) {
      const _ = i.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: F,
        Contents: ie(j.content),
        T: ie(j.title || ye("normal.unknownUser")),
        M: re.of(j.date || ""),
        C: i.obj([Q.of(T), Q.of(S), Q.of(x)]),
        IRT: $,
        RT: z.of("R"),
        NM: re.of(j.id),
        Open: !1
      }), E = i.register(_);
      this.addAnnotationToPage(t, E);
    }
  }
}
class Kl extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, [i, , , s] = Re(e.konvaClientRect, r), a = n.context, l = 20, h = t.getWidth(), d = t.getHeight(), u = Math.max(0, Math.min(i, h - l)), f = Math.max(l, Math.min(s, d)), p = [
      Q.of(u),
      Q.of(f - l),
      Q.of(u + l),
      Q.of(f)
    ], g = JSON.parse(e.konvaString), m = g.children?.find((N) => N.className === "Text"), v = Math.abs(g.attrs?.scaleY ?? 1), y = (m?.attrs?.fontSize ?? 14) * v, T = m?.attrs?.opacity ?? 1, S = a.obj({
      Type: z.of("Annot"),
      Subtype: z.of("Text"),
      InkLayerType: z.of("FreeText"),
      InkLayerFontSize: Q.of(y),
      InkLayerTextWidth: Q.of(e.konvaClientRect.width),
      Rect: p,
      NM: re.of(e.id),
      // 唯一标识
      Contents: ie(e.contentsObj?.text || ""),
      Name: z.of("Comment"),
      T: ie(this.getExportTitle(ye("normal.unknownUser"))),
      M: re.of(e.date || ""),
      C: De(e.color || "#000000"),
      CA: Q.of(T),
      F: Q.of(4),
      P: t.ref,
      Open: !1
    }), x = a.register(S);
    this.addAnnotationToPage(t, x);
    for (const N of e.comments || []) {
      const F = a.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: p,
        Contents: ie(N.content),
        T: ie(N.title || ye("normal.unknownUser")),
        M: re.of(N.date || ""),
        C: De(e.color || "#000000"),
        IRT: x,
        RT: z.of("R"),
        NM: re.of(N.id),
        // 唯一标识
        Open: !1
      }), U = a.register(F);
      this.addAnnotationToPage(t, U);
    }
  }
}
function Xl(o, e, t) {
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
function ql(o, e, t) {
  const n = o % 360;
  return n === 90 || n === 270 ? [0, 0, t, e] : [0, 0, e, t];
}
class Jl extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, i = n.context, [s, a, l, h] = Re(e.konvaClientRect, r), d = l - s, u = h - a, f = [Q.of(s), Q.of(a), Q.of(l), Q.of(h)], p = r.pdfPageRotate || 0;
    let g;
    if (e.contentsObj?.image) {
      const T = e.contentsObj.image.replace(/^data:image\/png;base64,/, ""), S = await n.embedPng(T), x = ql(p, d, u), N = i.obj({
        Type: "XObject",
        Subtype: "Form",
        BBox: x,
        Resources: i.obj({
          XObject: {
            Im1: S.ref
          }
        })
      }), F = `q ${Xl(p, d, u)} ${d} 0 0 ${u} 0 0 cm /Im1 Do Q`, U = Br.of(N, new TextEncoder().encode(F)), $ = i.register(U);
      g = i.obj({
        N: $
      });
    }
    const m = {
      Type: z.of("Annot"),
      Subtype: z.of("Stamp"),
      Rect: f,
      NM: re.of(e.id),
      Contents: ie(e.contentsObj?.text || ""),
      T: ie(this.getExportTitle(ye("normal.unknownUser"))),
      M: re.of(e.date || ""),
      Open: !1,
      P: t.ref,
      F: Q.of(132),
      ...g ? { AP: g } : {}
    }, v = i.obj(m), y = i.register(v);
    this.addAnnotationToPage(t, y);
    for (const T of e.comments || []) {
      const S = i.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: f,
        Contents: ie(T.content),
        T: ie(T.title || ye("normal.unknownUser")),
        M: re.of(T.date || ""),
        IRT: y,
        RT: z.of("R"),
        NM: re.of(T.id),
        Open: !1
      }), x = i.register(S);
      this.addAnnotationToPage(t, x);
    }
  }
}
function Zl(o, e, t, n, r = 10, i = 10) {
  const s = t - o, a = n - e, l = Math.hypot(s, a) || 1, h = s / l, d = a / l, u = -d, f = h, p = t - h * r + u * (i / 2), g = n - d * r + f * (i / 2), m = t - h * r - u * (i / 2), v = n - d * r - f * (i / 2);
  return [t, n, p, g, m, v, t, n];
}
class Ql extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, i = n.context, s = JSON.parse(e.konvaString), a = s.children.filter((S) => S.className === "Arrow");
    if (a.length === 0) throw new Error(`Arrow annotation ${e.id} has no arrow shape.`);
    const l = i.obj(
      a.map((S) => {
        const x = S.attrs.points;
        if (!x || x.length < 4)
          throw new Error(`Arrow annotation ${e.id} needs at least two points.`);
        const N = [];
        for (let $ = 0; $ < x.length; $ += 2) {
          const j = bt({ x: x[$], y: x[$ + 1] }, s), [_, E] = Rn(j, r);
          N.push(_, E);
        }
        const F = x.length, U = Zl(
          x[F - 4],
          x[F - 3],
          x[F - 2],
          x[F - 1],
          typeof S.attrs.pointerLength == "number" ? S.attrs.pointerLength : 10,
          typeof S.attrs.pointerWidth == "number" ? S.attrs.pointerWidth : 10
        );
        for (let $ = 0; $ < U.length; $ += 2) {
          const j = bt({ x: U[$], y: U[$ + 1] }, s), [_, E] = Rn(j, r);
          N.push(_, E);
        }
        return i.obj(N);
      })
    ), h = a[0]?.attrs || {}, d = h.strokeWidth ?? 1, u = h.opacity ?? 1, f = h.stroke ?? e.color ?? "rgb(255, 0, 0)", [p, g, m] = De(f), v = i.obj({
      W: Q.of(d),
      S: z.of("S")
      // Solid border style
    }), y = i.obj({
      Type: z.of("Annot"),
      // Ink is intentional: the sampled arrowhead renders consistently in PDF viewers.
      Subtype: z.of("Ink"),
      InkLayerType: z.of("Arrow"),
      Rect: Re(e.konvaClientRect, r),
      InkList: l,
      C: i.obj([Q.of(p), Q.of(g), Q.of(m)]),
      T: ie(this.getExportTitle(ye("normal.unknownUser"))),
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      BS: v,
      F: Q.of(4),
      P: t.ref,
      CA: Q.of(u)
      // Constant opacity for the Ink stroke.
    }), T = i.register(y);
    this.addAnnotationToPage(t, T);
    for (const S of e.comments || []) {
      const x = i.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: Re(e.konvaClientRect, r),
        Contents: ie(S.content),
        T: ie(S.title || ye("normal.unknownUser")),
        M: re.of(S.date || ""),
        C: i.obj([Q.of(p), Q.of(g), Q.of(m)]),
        IRT: T,
        RT: z.of("R"),
        NM: re.of(S.id),
        Open: !1
      }), N = i.register(x);
      this.addAnnotationToPage(t, N);
    }
  }
}
function ed(o, e, t, n = 12) {
  const r = [];
  for (let i = 1; i <= n; i++) {
    const s = i / n, a = (1 - s) * (1 - s) * o[0] + 2 * (1 - s) * s * e[0] + s * s * t[0], l = (1 - s) * (1 - s) * o[1] + 2 * (1 - s) * s * e[1] + s * s * t[1];
    r.push(a, l);
  }
  return r;
}
function td(o, e, t, n, r = 16) {
  const i = [];
  for (let s = 1; s <= r; s++) {
    const a = s / r, l = Math.pow(1 - a, 3) * o[0] + 3 * Math.pow(1 - a, 2) * a * e[0] + 3 * (1 - a) * a * a * t[0] + a * a * a * n[0], h = Math.pow(1 - a, 3) * o[1] + 3 * Math.pow(1 - a, 2) * a * e[1] + 3 * (1 - a) * a * a * t[1] + a * a * a * n[1];
    i.push(l, h);
  }
  return i;
}
function nd(o) {
  const e = o.match(/[a-zA-Z][^a-zA-Z]*/g) || [], t = [];
  let n = [0, 0];
  for (const r of e) {
    const i = r[0], s = r.slice(1).trim().split(/[\s,]+/).map(parseFloat);
    if (i === "M" && (n = [s[0], s[1]], t.push(...n)), i === "L")
      for (let a = 0; a < s.length; a += 2)
        n = [s[a], s[a + 1]], t.push(...n);
    if (i === "Q") {
      const a = n, l = [s[0], s[1]], h = [s[2], s[3]];
      t.push(...ed(a, l, h)), n = h;
    }
    if (i === "C") {
      const a = n, l = [s[0], s[1]], h = [s[2], s[3]], d = [s[4], s[5]];
      t.push(...td(a, l, h, d)), n = d;
    }
  }
  return t;
}
class od extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, i = n.context, s = wt(e.konvaString), a = (s.children ?? []).filter((j) => j.className === "Path"), { groupX: l, groupY: h, scaleX: d, scaleY: u } = this.extractGroupTransform(s), f = r.viewport, p = i.obj(
      a.map((j) => {
        const _ = nd(j.attrs?.data ?? ""), E = [];
        for (let R = 0; R < _.length; R += 2) {
          const D = l + _[R] * d, H = h + _[R + 1] * u, Y = D * f.scale, ee = H * f.scale, [J, K] = f.convertToPdfPoint(Y, ee);
          E.push(J, K);
        }
        return i.obj(E);
      })
    ), g = a[0]?.attrs ?? {}, m = g.strokeWidth ?? 1, v = g.opacity ?? 1, y = g.stroke ?? e.color ?? "rgb(255, 0, 0)", [T, S, x] = De(y), N = i.obj({
      W: Q.of(m),
      S: z.of("S")
      // Solid border style
    }), F = Re(e.konvaClientRect, r), U = i.obj({
      Type: z.of("Annot"),
      Subtype: z.of("Ink"),
      Rect: F,
      InkList: p,
      C: i.obj([Q.of(T), Q.of(S), Q.of(x)]),
      T: ie(this.getExportTitle(ye("normal.unknownUser"))),
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      Border: i.obj([0, 0, 0]),
      BS: N,
      F: Q.of(4),
      P: t.ref,
      CA: Q.of(v)
      // Non-stroking opacity (used for drawing)
    }), $ = i.register(U);
    this.addAnnotationToPage(t, $);
    for (const j of e.comments || []) {
      const _ = i.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: F,
        Contents: ie(j.content),
        T: ie(j.title || ye("normal.unknownUser")),
        M: re.of(j.date || ""),
        C: i.obj([Q.of(T), Q.of(S), Q.of(x)]),
        IRT: $,
        RT: z.of("R"),
        NM: re.of(j.id),
        Open: !1
      }), E = i.register(_);
      this.addAnnotationToPage(t, E);
    }
  }
}
function rd(o) {
  return (o.match(/[a-zA-Z][^a-zA-Z]*/g) ?? []).map((t) => ({
    type: t[0].toUpperCase(),
    values: t.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(Number)
  }));
}
function id(o, e, t, n) {
  const r = 1 - n;
  return {
    x: r * r * o.x + 2 * r * n * e.x + n * n * t.x,
    y: r * r * o.y + 2 * r * n * e.y + n * n * t.y
  };
}
function sd(o, e, t, n, r) {
  const i = 1 - r;
  return {
    x: i ** 3 * o.x + 3 * i ** 2 * r * e.x + 3 * i * r ** 2 * t.x + r ** 3 * n.x,
    y: i ** 3 * o.y + 3 * i ** 2 * r * e.y + 3 * i * r ** 2 * t.y + r ** 3 * n.y
  };
}
function ad(o) {
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
      const r = t, i = { x: n.values[0], y: n.values[1] }, s = { x: n.values[2], y: n.values[3] };
      for (let a = 1; a <= 12; a++)
        e.push(id(r, i, s, a / 12));
      t = s;
      return;
    }
    if (n.type === "C" && t && n.values.length >= 6) {
      const r = t, i = { x: n.values[0], y: n.values[1] }, s = { x: n.values[2], y: n.values[3] }, a = { x: n.values[4], y: n.values[5] };
      for (let l = 1; l <= 16; l++)
        e.push(sd(r, i, s, a, l / 16));
      t = a;
    }
  }), e;
}
class cd extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, i = n.context, s = JSON.parse(e.konvaString), a = s.children?.find((S) => S.className === "Path");
    if (!a?.attrs?.data) throw new Error(`Cloud annotation ${e.id} has no path data.`);
    const l = ad(rd(a.attrs.data));
    if (l.length < 2) throw new Error(`Cloud annotation ${e.id} needs at least two points.`);
    const h = l.flatMap((S) => {
      const x = bt(S, s);
      return Rn(x, r);
    }), d = a.attrs.strokeWidth ?? 2, u = a.attrs.opacity ?? 1, f = a.attrs.stroke ?? e.color ?? "#000000", [p, g, m] = De(f), v = Re(e.konvaClientRect, r), y = i.obj({
      Type: z.of("Annot"),
      Subtype: z.of("Ink"),
      InkLayerType: z.of("Cloud"),
      Rect: v,
      InkList: i.obj([h]),
      C: i.obj([p, g, m]),
      T: ie(this.getExportTitle(ye("normal.unknownUser"))),
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      Border: i.obj([0, 0, 0]),
      BS: i.obj({ W: d, S: z.of("S") }),
      F: Q.of(4),
      P: t.ref,
      CA: Q.of(u)
    }), T = i.register(y);
    this.addAnnotationToPage(t, T);
    for (const S of e.comments || []) {
      const x = i.obj({
        Type: z.of("Annot"),
        Subtype: z.of("Text"),
        Rect: v,
        Contents: ie(S.content),
        T: ie(S.title || ye("normal.unknownUser")),
        M: re.of(S.date || ""),
        C: i.obj([p, g, m]),
        IRT: T,
        RT: z.of("R"),
        NM: re.of(S.id),
        Open: !1
      });
      this.addAnnotationToPage(t, i.register(x));
    }
  }
}
const ld = {
  [oe.TEXT]: Fl,
  [oe.HIGHLIGHT]: jl,
  [oe.UNDERLINE]: Wl,
  [oe.STRIKEOUT]: $l,
  [oe.SQUARE]: Bl,
  [oe.CIRCLE]: Vl,
  [oe.INK]: Yl,
  [oe.POLYLINE]: od,
  [oe.FREETEXT]: Kl,
  [oe.STAMP]: Jl,
  [oe.LINE]: Ql
  // 你可以在这里扩展其他类型的解析器
}, dd = /* @__PURE__ */ new Set([
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
function er(o) {
  return o.type === k.CLOUD ? cd : ld[o.pdfjsType];
}
async function ud(o, e, t, n) {
  const r = er(o);
  r ? await new r(t, e, o, n).parse() : console.warn("Unsupported annotation type:", o.pdfjsType);
}
function hd(o, e) {
  const t = new ArrayBuffer(o.byteLength);
  new Uint8Array(t).set(o);
  const n = new Blob([t], { type: "application/pdf" });
  Ao(n, `${e}.pdf`);
}
function pd(o, e) {
  const t = new Blob([o], { type: "application/octet-stream" });
  Ao(t, `${e}.xlsx`);
}
function fd(o) {
  for (const e of o.getPages()) {
    const t = z.of("Annots"), n = e.node.lookupMaybe(t, So);
    if (!n) continue;
    const r = n.asArray().filter((i) => {
      const a = o.context.lookupMaybe(i, bn)?.get(z.of("Subtype"))?.toString();
      return !a || !dd.has(a);
    });
    e.node.set(t, o.context.obj(r));
  }
}
async function gd(o, e) {
  const t = o.pdfDocument;
  if (!t) throw new Error("Cannot export annotations before the PDF document is ready.");
  const n = await t.getData(), r = await In.load(n), i = r.getPages(), s = e.map((a) => {
    if (!er(a))
      throw new Error(`Unsupported annotation type: ${a.pdfjsType}`);
    const l = i[a.pageNumber - 1];
    if (!l) throw new Error(`Annotation ${a.id} references missing page ${a.pageNumber}.`);
    const h = o.getPageView(a.pageNumber - 1);
    if (!h?.viewport)
      throw new Error(`Page view ${a.pageNumber} is not ready for annotation export.`);
    return { annotation: a, page: l, pageView: h };
  });
  fd(r);
  for (const { annotation: a, page: l, pageView: h } of s)
    await ud(a, l, r, h);
  return r.save();
}
async function tr(o, e, t) {
  const n = await gd(o, e), r = t || `annotated_${Ho()}`;
  hd(n, r);
}
function md(o) {
  const e = [], t = [...o].sort((s, a) => s.pageNumber !== a.pageNumber ? s.pageNumber - a.pageNumber : zn(a.date) - zn(s.date)), n = (s) => {
    const l = [...s.comments || []].reverse().find((h) => h.status !== void 0 && h.status !== null)?.status ?? rt.None;
    return we.t(`annotator:comment.status.${l.toLowerCase()}`);
  };
  let r = 1, i = 0;
  return t.forEach((s) => {
    const a = Me.find((d) => d.type === s.type)?.name, l = we.t(`annotator:tool.${a}`), h = pt(s.referenceNumber) ? `#${s.referenceNumber}` : `#${r}`;
    e.push({
      index: h,
      id: s.id,
      page: s.pageNumber,
      annotationType: l,
      recordType: we.t("annotator:export.recordType.annotation"),
      author: s.title,
      content: s.contentsObj?.text || "",
      date: wn(s.date, !0),
      status: n(s)
    }), i = 0, s.comments.forEach((d) => {
      i++, e.push({
        index: `${h}.${i}`,
        id: d.id,
        page: "",
        annotationType: "--",
        recordType: we.t("annotator:export.recordType.reply"),
        author: d.title,
        content: d.content,
        date: wn(d.date, !0),
        status: ""
      });
    }), r++;
  }), e;
}
async function nr(o, e, t) {
  const n = md(e), r = await import("exceljs"), i = new r.Workbook(), s = i.addWorksheet("sheet1");
  s.columns = [
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
      header: we.t("annotator:export.fields.id"),
      width: 20,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    },
    {
      key: "page",
      header: we.t("annotator:export.fields.page"),
      width: 10,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    },
    {
      key: "annotationType",
      header: we.t("annotator:export.fields.annotationType"),
      width: 18,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    },
    {
      key: "recordType",
      header: we.t("annotator:export.fields.recordType"),
      width: 12,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    },
    {
      key: "author",
      header: we.t("annotator:export.fields.author"),
      width: 16,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    },
    {
      key: "content",
      header: we.t("annotator:export.fields.content"),
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
      header: we.t("annotator:export.fields.date"),
      width: 22,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    },
    {
      key: "status",
      header: we.t("annotator:export.fields.status"),
      width: 14,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    }
  ], n.forEach((h) => {
    const d = s.addRow(h), u = h.recordType === we.t("annotator:export.recordType.reply");
    d.font = {
      size: 12,
      color: { argb: u ? "389e0d" : "000000" }
    };
  }), s.getRow(1).eachCell((h) => {
    h.font = { bold: !0, size: 12 }, h.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D9E1F2" }
    };
  }), s.eachRow((h) => {
    h.eachCell((d) => {
      d.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } }
      };
    });
  });
  const a = await i.xlsx.writeBuffer(), l = t || `annotated_${Ho()}`;
  pd(a, l);
}
async function vd(o, e, t) {
  if (t.has(e)) return t.get(e);
  const n = o.getPageView(e);
  if (!n?.pdfPage) return "";
  const i = (await n.pdfPage.getTextContent()).items.map((s) => "str" in s ? s.str : "").join("");
  return t.set(e, i), i;
}
function yd({ pdfViewer: o }) {
  const [e, t] = V(""), [n, r] = V([]), [i, s] = V(!1), [a, l] = V({
    caseSensitive: !1,
    entireWord: !1,
    matchDiacritics: !1
  }), h = W(/* @__PURE__ */ new Map()), d = W(a), u = W(0), f = W(null), p = Z(() => {
    f.current?.(), f.current = null;
  }, []);
  ne(() => (h.current.clear(), () => {
    u.current += 1, p();
  }), [o, p]);
  const g = Z(({ pageNumber: y, matchIndex: T }) => {
    if (!o || !e) return;
    const S = o.findController;
    if (!S || !o.pdfDocument) return;
    o.scrollPageIntoView({ pageNumber: y });
    const N = S;
    N._selected = { pageIdx: y - 1, matchIdx: T }, N._offset = { pageIdx: y - 1, matchIdx: T - 1, wrapped: !1 }, N._highlightMatches = !0, o.eventBus.dispatch("find", {
      type: "again",
      query: e,
      caseSensitive: a.caseSensitive,
      entireWord: a.entireWord,
      findPrevious: !1,
      matchDiacritics: a.matchDiacritics,
      highlightAll: !0
    });
  }, [o, e, a]), m = Z(
    async (y, T) => {
      if (!o) return;
      const S = u.current + 1;
      u.current = S, p();
      const x = {
        ...d.current,
        ...T
      };
      d.current = x, s(!0), t(y), l(x);
      try {
        const N = await new Promise((F, U) => {
          const $ = o.pagesCount;
          let j = 0;
          const _ = 60, E = 200;
          let R = null, D = !1, H = null;
          const Y = () => {
            R && (clearTimeout(R), R = null), o.eventBus.off("updatefindcontrolstate", b);
          }, ee = (G) => {
            D || (D = !0, Y(), F(G));
          }, J = (G) => {
            D || (D = !0, Y(), U(G));
          }, K = async () => {
            if (D || S !== u.current) {
              ee(null);
              return;
            }
            try {
              const G = H?._pageMatches;
              if (Array.isArray(G) && G.length === $) {
                const B = [];
                for (let L = 0; L < G.length; L++) {
                  const q = G[L];
                  if (!q || q.length === 0) continue;
                  const le = await vd(o, L, h.current);
                  if (D || S !== u.current) {
                    ee(null);
                    return;
                  }
                  const O = q.map((te, de) => {
                    const Ee = Math.max(0, te - 5), xe = Math.min(le.length, te + y.length + 30);
                    return {
                      matchIndex: de,
                      charIndex: te,
                      snippet: le.slice(Ee, xe)
                    };
                  });
                  B.push({
                    pageNumber: L + 1,
                    countTotal: q.length,
                    matches: O
                  });
                }
                ee({
                  query: y,
                  countTotal: H?._matchesCountTotal ?? 0,
                  pageMatches: B
                });
              } else j < _ ? (j += 1, R = setTimeout(() => {
                R = null, K();
              }, E)) : ee({
                query: y,
                countTotal: 0,
                pageMatches: []
              });
            } catch (G) {
              J(G);
            }
          }, b = ({ source: G, rawQuery: B }) => {
            const L = Array.isArray(B) ? B.join("") : B;
            L != null && L !== y || (H = G ?? null, R && (clearTimeout(R), R = null), K());
          };
          f.current = () => ee(null), o.eventBus.on("updatefindcontrolstate", b), o.eventBus.dispatch("find", {
            type: "highlightallchange",
            query: y,
            caseSensitive: x.caseSensitive ?? !1,
            entireWord: x.entireWord ?? !1,
            findPrevious: !1,
            matchDiacritics: x.matchDiacritics ?? !1,
            highlightAll: !0
          });
        });
        N && S === u.current && r([N]);
      } catch (N) {
        console.error(N), S === u.current && r([{ query: y, countTotal: 0, pageMatches: [] }]);
      } finally {
        S === u.current && (f.current = null, s(!1));
      }
    },
    [o, p]
  ), v = Z(() => {
    u.current += 1, p(), o?.eventBus.dispatch("find", { query: "" }), t(""), r([]), s(!1);
  }, [o, p]);
  return { query: e, setQuery: t, results: n, searching: i, search: m, clearSearch: v, jumpToMatch: g, searchOptions: a };
}
function bd(o, e, t) {
  if (!e) return [{ text: o, highlighted: !1 }];
  const n = e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), r = new RegExp(
    `(${n})`,
    t ? "g" : "gi"
  ), i = new RegExp(
    `^${n}$`,
    t ? "" : "i"
  );
  return o.split(r).map((s) => ({
    text: s,
    highlighted: i.test(s)
  }));
}
const Sd = ({ text: o, query: e, caseSensitive: t }) => /* @__PURE__ */ c(Se, { children: bd(o, e, t).map(
  (n, r) => n.highlighted ? /* @__PURE__ */ c("mark", { style: { backgroundColor: "rgba(255, 255, 0, 0.2)", padding: "0 2px" }, children: n.text }, `${r}-${n.text}`) : n.text
) }), or = ({ pdfViewer: o }) => {
  const { query: e, setQuery: t, results: n, searching: r, search: i, clearSearch: s, jumpToMatch: a } = yd({ pdfViewer: o }), { t: l } = me("viewer", { useSuspense: !1 }), [h, d] = V({
    caseSensitive: !1,
    entireWord: !1
  }), [u, f] = V(null), p = W({}), g = W(n), m = W(e);
  m.current = e;
  const v = Z(
    (E) => {
      E.trim() && o && (s(), f(null), i(E.trim(), {
        caseSensitive: h.caseSensitive,
        entireWord: h.entireWord
      }));
    },
    [o, i, s, h]
  ), y = Z(
    (E) => {
      switch (E.key) {
        case "Escape":
          (n.length > 0 || e.trim() !== "") && s();
          break;
        case "Enter":
          e.trim() === "" && n.length > 0 && s(), e.trim() && (s(), v(e));
          break;
      }
    },
    [e, n, s, v]
  ), T = Z(
    (E, R) => {
      f({ pageNumber: E, matchIndex: R }), a({
        pageNumber: E,
        matchIndex: R
      });
    },
    [a]
  ), S = Z((E, R) => {
    d((D) => ({
      ...D,
      [E]: R
    }));
  }, []), x = Z(() => {
    const E = [];
    return n.forEach((R) => {
      R.pageMatches.forEach((D) => {
        D.matches.forEach((H) => {
          E.push({
            pageNumber: D.pageNumber,
            matchIndex: H.matchIndex,
            query: R.query
          });
        });
      });
    }), E;
  }, [n]), N = Z((E, R) => {
    const D = p.current[`${E}-${R}`];
    D && D.scrollIntoView({
      block: "center",
      inline: "center"
    });
  }, []), F = Z(() => u ? x().findIndex((R) => R.pageNumber === u.pageNumber && R.matchIndex === u.matchIndex) : -1, [u, x]), U = Z(() => {
    if (!n.length) return;
    const E = x();
    if (!E.length) return;
    let R = 0;
    u && (R = (F() + 1) % E.length);
    const D = E[R];
    f({
      pageNumber: D.pageNumber,
      matchIndex: D.matchIndex
    }), a({
      pageNumber: D.pageNumber,
      matchIndex: D.matchIndex
    }), N(D.pageNumber, D.matchIndex);
  }, [n, u, x, F, a, N]), $ = Z(() => {
    if (!n.length) return;
    const E = x();
    if (!E.length) return;
    let R = E.length - 1;
    u && (R = (F() - 1 + E.length) % E.length);
    const D = E[R];
    f({
      pageNumber: D.pageNumber,
      matchIndex: D.matchIndex
    }), a({
      pageNumber: D.pageNumber,
      matchIndex: D.matchIndex
    }), N(D.pageNumber, D.matchIndex);
  }, [n, u, x, F, a, N]);
  ne(() => {
    g.current = n;
  }, [n]), ne(() => {
    const E = m.current.trim();
    E && v(E);
  }, [h, v]), ne(() => () => {
    g.current.length > 0 && s(), f(null), t("");
  }, [s, t]);
  const j = () => !n.length || r ? null : n.map((E) => /* @__PURE__ */ w(at, { children: [
    /* @__PURE__ */ w(
      X,
      {
        pb: "2",
        justify: "between",
        align: "center",
        style: { position: "sticky", top: 89, backgroundColor: "var(--bg-color-tertiary)", zIndex: 1 },
        children: [
          /* @__PURE__ */ c(ae, { size: "2", children: l("viewer:search.resultTotal", {
            total: E.countTotal
          }) }),
          E.countTotal > 0 && /* @__PURE__ */ w("div", { children: [
            /* @__PURE__ */ c(Qe, { onClick: $, variant: "soft", color: "gray", size: "1", mr: "1", children: /* @__PURE__ */ c(go, {}) }),
            /* @__PURE__ */ c(Qe, { onClick: U, variant: "soft", color: "gray", size: "1", mr: "1", children: /* @__PURE__ */ c(mo, {}) })
          ] })
        ]
      }
    ),
    E.pageMatches.map((R) => /* @__PURE__ */ w(at, { mt: "1", mb: "3", pl: "2", children: [
      /* @__PURE__ */ w(ae, { size: "2", children: [
        l("viewer:search.page", { value: R.pageNumber }),
        " (",
        R.countTotal,
        ")"
      ] }),
      R.matches.map((D) => {
        const H = u && u.pageNumber === R.pageNumber && u.matchIndex === D.matchIndex, Y = `${R.pageNumber}-${D.matchIndex}`;
        return /* @__PURE__ */ c(at, { mt: "2", pl: "0", children: /* @__PURE__ */ c(
          ve,
          {
            ref: (ee) => p.current[Y] = ee,
            variant: H ? "soft" : "outline",
            color: H ? void 0 : "gray",
            type: "button",
            onClick: () => T(R.pageNumber, D.matchIndex),
            style: {
              width: "100%",
              textAlign: "left",
              justifyContent: "flex-start"
            },
            children: /* @__PURE__ */ c(ae, { truncate: !0, children: /* @__PURE__ */ c(
              Sd,
              {
                text: D.snippet,
                query: E.query,
                caseSensitive: h.caseSensitive
              }
            ) })
          }
        ) }, D.matchIndex);
      })
    ] }, R.pageNumber))
  ] }, E.query)), _ = Ae(() => r ? /* @__PURE__ */ w(X, { mt: "2", align: "center", gap: "2", children: [
    /* @__PURE__ */ c(po, {}),
    /* @__PURE__ */ c(ae, { size: "2", children: l("viewer:search.searching") })
  ] }) : null, [r, l]);
  return /* @__PURE__ */ w(at, { p: "2", pt: "0", children: [
    /* @__PURE__ */ w(X, { direction: "column", style: { position: "sticky", top: 0, backgroundColor: "var(--bg-color-tertiary)", zIndex: 1 }, children: [
      /* @__PURE__ */ w(
        Tt.Root,
        {
          placeholder: l("viewer:search.placeholder"),
          value: e,
          onChange: (E) => t(E.currentTarget.value),
          onKeyDown: y,
          "aria-label": l("viewer:search.placeholder"),
          mt: "3",
          children: [
            /* @__PURE__ */ c(Tt.Slot, { children: /* @__PURE__ */ c(Nn, {}) }),
            /* @__PURE__ */ c(Tt.Slot, { children: e.trim() && /* @__PURE__ */ c(
              Qe,
              {
                size: "1",
                variant: "ghost",
                onClick: () => {
                  t(""), n.length > 0 && (s(), f(null));
                },
                children: /* @__PURE__ */ c(Fr, {})
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ w(X, { mt: "2", align: "center", gap: "2", children: [
        /* @__PURE__ */ c(ae, { as: "label", size: "2", children: /* @__PURE__ */ w(X, { gap: "2", children: [
          /* @__PURE__ */ c(
            Vt,
            {
              checked: h.caseSensitive,
              onCheckedChange: (E) => S("caseSensitive", !!E),
              "aria-label": l("viewer:search.caseSensitive")
            }
          ),
          l("viewer:search.caseSensitive")
        ] }) }),
        /* @__PURE__ */ c(ae, { as: "label", size: "2", children: /* @__PURE__ */ w(X, { gap: "2", children: [
          /* @__PURE__ */ c(
            Vt,
            {
              checked: h.entireWord,
              onCheckedChange: (E) => S("entireWord", !!E),
              "aria-label": l("viewer:search.entireWord")
            }
          ),
          l("viewer:search.entireWord")
        ] }) })
      ] }),
      /* @__PURE__ */ c(et, { my: "2", size: "4" })
    ] }),
    _,
    j()
  ] });
}, rr = () => {
  const [o, e] = V(() => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  return ne(() => {
    const t = window.matchMedia("(prefers-color-scheme: dark)"), n = (r) => {
      e(r.matches ? "dark" : "light");
    };
    return t.addEventListener ? t.addEventListener("change", n) : t.addListener(n), () => {
      t.removeEventListener ? t.removeEventListener("change", n) : t.removeListener(n);
    };
  }, []), o;
}, wd = () => /* @__PURE__ */ w(X, { align: "center", gap: "2", "data-inklayer-page-zoom-control": "true", children: [
  /* @__PURE__ */ c(ko, { persistent: !0 }),
  /* @__PURE__ */ c(et, { orientation: "vertical" }),
  /* @__PURE__ */ c(qt, {})
] }), lo = "search-sidebar", uo = "annotator-sidebar-toggle", Cd = ({
  Chrome: o,
  onSave: e,
  searchAvailable: t
}) => {
  const { painter: n } = tt(), r = ce((g) => g.currentAnnotationType), {
    activeSidebarPanel: i,
    closeSidebar: s,
    openSidebar: a,
    isNavigationSidebarOpen: l,
    toggleNavigationSidebar: h,
    pdfViewer: d
  } = je(), u = n?.can("annotation.create") ?? !1;
  ne(() => {
    u || r && r.type !== k.SELECT && n?.activate(null, null);
  }, [u, r, n]), ne(() => () => {
    n?.activate(null, null);
  }, [n]);
  const f = (g) => {
    i === g ? s() : a(g);
  }, p = {
    save: () => {
      n && e?.(Mt(n.getData()));
    },
    getAnnotations: () => Mt(n?.getData() ?? []),
    exportToExcel: (g) => {
      n && d && nr(d, n.getData(), g);
    },
    exportToPdf: (g) => {
      n && d && tr(d, n.getData(), g);
    }
  };
  return /* @__PURE__ */ c(
    o,
    {
      activeTool: Hc(r?.type),
      canCreate: u,
      ToolControl: kn,
      ColorControl: Jo,
      AuthorLabelsControl: Zo,
      PageZoomControl: wd,
      history: n?.getHistory(),
      panels: {
        navigation: {
          open: l,
          toggle: h
        },
        search: {
          open: i === lo,
          available: t,
          toggle: () => f(lo)
        },
        annotations: {
          open: i === uo,
          toggle: () => f(uo)
        }
      },
      actions: p
    }
  );
}, Yd = ({
  appearance: o = "auto",
  enableRange: e = "auto",
  theme: t = "violet",
  title: n = "PDF ANNOTATOR",
  data: r,
  url: i,
  locale: s = "zh-CN",
  pdfjsOptions: a,
  user: l = { id: "null", name: "unknown" },
  annotationPermissions: h,
  defaultShowAnnotationAuthorLabels: d = !1,
  defaultOptions: u,
  initialScale: f,
  enableNativeAnnotations: p = !1,
  initialAnnotations: g = [],
  defaultShowAnnotationsSidebar: m = !1,
  onSave: v,
  onLoad: y,
  onAnnotationAdded: T,
  onAnnotationDeleted: S,
  onAnnotationSelected: x,
  onAnnotationUpdated: N,
  layoutStyle: F,
  actions: U,
  chrome: $,
  searchAvailable: j = !0
}) => {
  const _ = Ae(
    () => ca(g),
    [g]
  ), E = Ae(
    () => ({ textLayerMode: 1, annotationMode: 0, externalLinkTarget: 0, enableRange: e, pdfjsOptions: a }),
    [e, a]
  ), { t: R } = me(["annotator", "common"], { useSuspense: !1 }), D = Ae(() => Ko(zc, u || {}), [u]), [H, Y] = V(() => Qn()), ee = rr(), J = o === "auto" ? ee : o;
  ne(() => {
    const b = setTimeout(() => {
      const G = Qn();
      Y(G);
    }, 0);
    return () => clearTimeout(b);
  }, []), ne(() => {
    we.changeLanguage(s);
  }, [s]);
  const K = () => {
    const { painter: b } = tt(), { pdfViewer: G } = je(), B = () => {
      if (b) {
        const le = b.getData();
        v?.(Mt(le));
      }
    }, L = async (le) => {
      if (b && G) {
        const O = b.getData();
        await tr(G, O, le);
      }
    }, q = async (le) => {
      if (b && G) {
        const O = b.getData();
        await nr(G, O, le);
      }
    };
    return U ? typeof U == "function" ? /* @__PURE__ */ c(
      U,
      {
        save: B,
        getAnnotations: () => Mt(b?.getData() || []),
        exportToExcel: (O) => {
          q(O);
        },
        exportToPdf: (O) => {
          L(O);
        }
      }
    ) : Lt.cloneElement(U, {
      save: B,
      getAnnotations: () => Mt(b?.getData() || []),
      exportToExcel: (le) => {
        q(le);
      },
      exportToPdf: (le) => {
        L(le);
      }
    }) : /* @__PURE__ */ w(Se, { children: [
      /* @__PURE__ */ c(et, { orientation: "vertical" }),
      /* @__PURE__ */ w(ge.Root, { children: [
        /* @__PURE__ */ c(ge.Trigger, { children: /* @__PURE__ */ w(ve, { variant: "soft", children: [
          R("common:export"),
          /* @__PURE__ */ c(ge.TriggerIcon, {})
        ] }) }),
        /* @__PURE__ */ w(ge.Content, { children: [
          /* @__PURE__ */ w(ge.Item, { onClick: () => L(), children: [
            R("common:export"),
            " PDF"
          ] }),
          /* @__PURE__ */ w(ge.Item, { onClick: () => q(), children: [
            R("common:export"),
            " Excel"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ w(ve, { onClick: B, children: [
        /* @__PURE__ */ c(jr, {}),
        R("common:save")
      ] })
    ] });
  };
  return /* @__PURE__ */ c(fo, { accentColor: t, appearance: J, children: /* @__PURE__ */ c(Fc, { children: /* @__PURE__ */ c(
    Yo.Provider,
    {
      value: {
        defaultOptions: D,
        primaryColor: H
      },
      children: /* @__PURE__ */ w(
        No,
        {
          title: n,
          url: i,
          data: r,
          initialScale: f,
          user: l,
          ...E,
          toolbar: $ ? void 0 : /* @__PURE__ */ c(Uc, { defaultAnnotationName: "" }),
          hideHeader: !!$,
          hidePageIndicator: !!$,
          defaultActiveSidebarKey: m ? "annotator-sidebar-toggle" : null,
          sidebar: [
            {
              key: "search-sidebar",
              title: R("viewer:search.search"),
              icon: /* @__PURE__ */ c(Nn, { style: { width: 18, height: 18 } }),
              render: (b) => /* @__PURE__ */ c(or, { pdfViewer: b.pdfViewer })
            },
            {
              title: R("annotator:sidebar.toggle"),
              key: "annotator-sidebar-toggle",
              icon: /* @__PURE__ */ c(Lo, { style: { width: 18, height: 18 } }),
              render: () => /* @__PURE__ */ c(zl, {})
            }
          ],
          actions: $ ? void 0 : /* @__PURE__ */ c(K, {}),
          style: F,
          children: [
            $ ? /* @__PURE__ */ c(
              Cd,
              {
                Chrome: $,
                onSave: v,
                searchAvailable: j
              }
            ) : null,
            /* @__PURE__ */ c(
              uc,
              {
                onLoad: () => {
                  y?.();
                },
                onAnnotationAdd: (b) => T?.(It(b)),
                onAnnotationDelete: (b) => {
                  S?.(b);
                },
                onAnnotationSelected: (b, G) => x?.(b ? It(b) : null, G),
                onAnnotationChanged: (b) => N?.(It(b)),
                enableNativeAnnotations: p,
                annotations: _,
                annotationPermissions: h,
                defaultShowAnnotationAuthorLabels: d
              }
            )
          ]
        }
      )
    }
  ) }) });
}, Ad = ({
  onDocumentLoaded: o,
  onEventBusReady: e
}) => {
  const { isReady: t, pdfViewer: n, eventBus: r, isSidebarCollapsed: i } = je();
  return ne(() => {
    if (!t || !n || !r) return;
    e?.(r);
    const s = async () => {
      o?.(n);
    };
    return n.pdfDocument ? s() : r.on("documentloaded", s), () => {
      r.off("documentloaded", s);
    };
  }, [t, n, r, o, e]), ne(() => {
    r && n && r.dispatch("updateviewarea", { pdfViewer: n });
  }, [i, r, n]), /* @__PURE__ */ c(Se, {});
}, Td = () => {
  const { t: o } = me("common", { useSuspense: !1 }), { pdfDocument: e } = je(), { printClean: t } = Ro(e);
  return /* @__PURE__ */ c(xt, { content: o("common:print"), children: /* @__PURE__ */ c(
    ve,
    {
      variant: "outline",
      size: "2",
      color: "gray",
      highContrast: !0,
      style: {
        boxShadow: "none"
      },
      onClick: () => t(),
      children: /* @__PURE__ */ c(Wr, { style: { width: 18, height: 18 } })
    }
  ) });
}, xd = ({ actions: o }) => {
  const e = je();
  return o ? typeof o == "function" ? o(e) : o : /* @__PURE__ */ c(Se, { children: /* @__PURE__ */ c(X, { gap: "3", align: "center", children: /* @__PURE__ */ c(Td, {}) }) });
}, kd = ({ toolbar: o }) => {
  const e = je();
  return o ? typeof o == "function" ? /* @__PURE__ */ w(X, { gap: "3", align: "center", children: [
    /* @__PURE__ */ c(qt, {}),
    /* @__PURE__ */ c(et, { orientation: "vertical" }),
    o(e)
  ] }) : o : /* @__PURE__ */ c(X, { gap: "3", align: "center", children: /* @__PURE__ */ c(qt, {}) });
}, Kd = ({
  appearance: o = "auto",
  enableRange: e = "auto",
  title: t = "PDF VIEWER",
  url: n,
  data: r,
  locale: i = "zh-CN",
  pdfjsOptions: s,
  initialScale: a,
  layoutStyle: l,
  theme: h = "violet",
  actions: d,
  sidebar: u,
  toolbar: f,
  showTextLayer: p = !0,
  showAnnotations: g = !1,
  defaultActiveSidebarKey: m,
  onDocumentLoaded: v,
  onEventBusReady: y
}) => {
  const { t: T } = me(["viewer"], { useSuspense: !1 }), S = Ae(
    () => ({
      textLayerMode: p ? 1 : 0,
      annotationMode: g ? 1 : 0,
      externalLinkTarget: 0,
      enableRange: e,
      pdfjsOptions: s
    }),
    [p, g, e, s]
  );
  ne(() => {
    we.changeLanguage(i);
  }, [i]);
  const x = rr();
  return /* @__PURE__ */ c(fo, { accentColor: h, appearance: o === "auto" ? x : o, children: /* @__PURE__ */ c(
    No,
    {
      title: t,
      url: n,
      data: r,
      sidebar: [{
        key: "search-sidebar",
        title: T("viewer:search.search"),
        icon: /* @__PURE__ */ c(Nn, { style: { width: 18, height: 18 } }),
        render: (F) => /* @__PURE__ */ c(or, { pdfViewer: F.pdfViewer })
      }, ...u || []],
      defaultActiveSidebarKey: m,
      toolbar: /* @__PURE__ */ c(kd, { toolbar: f }),
      initialScale: a,
      ...S,
      style: l,
      actions: /* @__PURE__ */ c(xd, { actions: d }),
      children: /* @__PURE__ */ c(Ad, { onEventBusReady: y, onDocumentLoaded: v })
    }
  ) });
};
export {
  Yd as PdfAnnotator,
  Kd as PdfViewer
};
