import { jsxs as T, Fragment as ye, jsx as c } from "react/jsx-runtime";
import Pt, { useRef as j, useState as Y, useCallback as X, useEffect as ne, createContext as en, useContext as Ht, memo as mo, useMemo as ke, forwardRef as tn, useImperativeHandle as Nn, useLayoutEffect as Qe, useSyncExternalStore as hr, useId as pr, createElement as fr } from "react";
import * as gr from "pdfjs-dist/legacy/build/pdf.mjs";
import { AnnotationMode as mr, AnnotationEditorType as vr, getDocument as ln, PDFDataRangeTransport as yr } from "pdfjs-dist/legacy/build/pdf.mjs";
import { EventBus as br, PDFLinkService as Sr, DownloadManager as wr, PDFFindController as Cr, PDFViewer as xr } from "pdfjs-dist/legacy/web/pdf_viewer.mjs";
import "pdfjs-dist/legacy/web/pdf_viewer.css";
import { useThemeContext as nn, Flex as Q, Spinner as vo, Box as lt, Text as ae, Progress as Tr, Callout as dt, Strong as Ar, IconButton as tt, TextField as kt, Tabs as At, Tooltip as Rt, Button as be, Popover as Ae, Card as kr, Grid as Bt, Separator as nt, Slider as Un, HoverCard as dn, DropdownMenu as me, Dialog as ct, SegmentedControl as gt, Select as Re, CheckboxGroup as bt, TextArea as Er, Badge as Rr, Checkbox as $t, Theme as yo } from "@radix-ui/themes";
import { useTranslation as ve, initReactI18next as Pr } from "react-i18next";
import { AiOutlineWarning as Ir, AiOutlineLeft as bo, AiOutlineRight as So, AiOutlineArrowLeft as Nr, AiOutlineLine as Mr, AiOutlinePlus as Dr, AiOutlinePlusCircle as wo, AiOutlineImport as Co, AiOutlineExclamationCircle as Lr, AiOutlineBold as _r, AiOutlineItalic as Or, AiOutlineUnderline as Hr, AiOutlineStrikethrough as Gr, AiOutlineExclamation as Ur, AiOutlineEllipsis as zn, AiOutlineFilter as zr, AiOutlineMinusSquare as Fr, AiOutlineStop as jr, AiOutlineCheckCircle as Br, AiOutlineMinusCircle as Wr, AiOutlineDislike as Vr, AiOutlineLike as $r, AiOutlineSearch as Mn, AiFillCloseCircle as Yr, AiOutlineSave as Kr, AiOutlinePrinter as Xr } from "react-icons/ai";
import { PDFDocument as Dn, PDFName as F, PDFHexString as xo, PDFArray as To, PDFDict as wn, PDFString as re, PDFRef as qr, PDFNumber as ee, PDFRawStream as Jr } from "pdf-lib";
import { GoSidebarExpand as Zr, GoSidebarCollapse as Qr } from "react-icons/go";
import M from "konva";
import { nanoid as ei } from "nanoid";
import Te, { t as Se } from "i18next";
import { computePosition as Wt, flip as Ao } from "@floating-ui/dom";
import { create as ti } from "zustand";
import ni from "web-highlighter";
import { HexColorPicker as oi } from "react-colorful";
import ko from "dayjs";
import ri from "dayjs/plugin/customParseFormat.js";
import { saveAs as Eo } from "file-saver";
import { createPortal as ii } from "react-dom";
const si = new URL("pdf.worker.min.mjs", import.meta.url).href;
gr.GlobalWorkerOptions.workerSrc = si;
function ai(n) {
  if (!(n instanceof Error)) return !1;
  const e = n.message.toLowerCase();
  return e.includes("range") || e.includes("content-length") || e.includes("unexpected server response") || e.includes("cors");
}
function ci(n) {
  if (n === void 0 || typeof n == "string" || Array.isArray(n)) return n;
  if (n instanceof ArrayBuffer) return n.slice(0);
  if (ArrayBuffer.isView(n)) {
    const e = new Uint8Array(n.byteLength);
    return e.set(new Uint8Array(n.buffer, n.byteOffset, n.byteLength)), e;
  }
  return n;
}
function li(n, e) {
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
    annotationMode: h = mr.DISABLE,
    externalLinkTarget: p = 2,
    pdfjsOptions: f
  } = e, m = j(s), g = j(i), y = j(a), b = j(l);
  m.current = s, g.current = i, y.current = a, b.current = l;
  const S = j(null), w = j(null), C = j(null), E = j(null), I = j(0), [H, B] = Y(!0), [W, D] = Y(0), [k, L] = Y(null), [$, G] = Y(null), [O, N] = Y(null), Z = X(() => {
    if (E.current && (E.current(), E.current = null), !n.current) throw new Error("PDF container not ready");
    const P = u || new br();
    C.current = P;
    const K = new Sr({ eventBus: P, externalLinkTarget: p }), ce = new wr(), le = new Cr({ linkService: K, eventBus: P }), _ = new xr({
      container: n.current,
      eventBus: P,
      textLayerMode: d,
      annotationMode: h,
      annotationEditorMode: vr.DISABLE,
      linkService: K,
      downloadManager: ce,
      findController: le
    });
    return K.setViewer(_), S.current = _, w.current = K, E.current = () => {
      S.current && (S.current.cleanup(), S.current = null), w.current && (w.current = null), !u && C.current && (C.current = null);
    }, b.current?.(_), { bus: P, linkService: K, viewer: _ };
  }, [n, u, d, h, p]), q = X(async (P) => {
    const K = await fetch(P, { method: "HEAD" }), ce = Number(K.headers.get("Content-Length"));
    if (isNaN(ce)) throw new Error("Cannot get PDF length for range loading");
    class le extends yr {
      async requestDataRange(te, de) {
        const xe = await (await fetch(P, { headers: { Range: `bytes=${te}-${de - 1}` } })).arrayBuffer();
        this.onDataRange(te, new Uint8Array(xe));
      }
    }
    return new le(ce, null);
  }, []), A = X(
    async (P) => {
      if (o)
        return ln({
          ...f,
          // PDF.js transfers the input buffer to its worker. Keep
          // the caller-owned bytes reusable when a viewer reloads
          // (for example after a text-layer mode change).
          data: ci(o),
          disableRange: !0,
          disableStream: !0
        });
      if (t && P) {
        const K = await q(t);
        return ln({ ...f, range: K });
      } else {
        if (t)
          return ln({ ...f, url: t, disableRange: !0, disableStream: !0 });
        throw new Error("Either url or data must be provided");
      }
    },
    [t, q, o, f]
  ), U = j(null), J = X(async () => {
    const P = I.current + 1;
    I.current = P;
    const K = () => I.current === P;
    if (!t && !o) {
      const te = new Error("Either url or data must be provided");
      K() && (N(te), B(!1), g.current?.(te), y.current?.());
      return;
    }
    B(!0), D(0), N(null), L(null);
    let ce = !1, le = null, _ = null;
    try {
      _ = Z();
      const { linkService: te, viewer: de } = _;
      if (r === !0 || r === "auto" ? (ce = !0, le = await A(!0)) : le = await A(!1), !K()) {
        await le.destroy();
        return;
      }
      U.current = le, le.onProgress = ({ loaded: Ve, total: He }) => {
        K() && He > 0 && D(Math.min(100, Math.round(Ve / He * 100)));
      };
      const xe = await le.promise;
      if (!K()) {
        await xe.destroy();
        return;
      }
      L(xe), te.setDocument(xe), de.setDocument(xe);
      const Je = await xe.getMetadata();
      if (!K()) return;
      G(Je), m.current?.(xe);
    } catch (te) {
      if (!K()) return;
      if (r === "auto" && ce && ai(te)) {
        console.warn("[PDF] Range failed, fallback to full loading"), await le?.destroy(), U.current === le && (U.current = null);
        try {
          if (!_)
            throw new Error("PDF viewer was not initialized");
          const de = await A(!1);
          if (le = de, !K()) {
            await de.destroy();
            return;
          }
          U.current = de, de.onProgress = ({ loaded: He, total: je }) => {
            K() && je > 0 && D(Math.min(100, Math.round(He / je * 100)));
          };
          const fe = await de.promise;
          if (!K()) {
            await fe.destroy();
            return;
          }
          const { linkService: xe, viewer: Je } = _;
          L(fe), xe.setDocument(fe), Je.setDocument(fe);
          const Ve = await fe.getMetadata();
          if (!K()) return;
          G(Ve), m.current?.(fe);
          return;
        } catch (de) {
          if (!K()) return;
          N(de), g.current?.(de);
          return;
        }
      }
      N(te), g.current?.(te);
    } finally {
      K() && (B(!1), y.current?.());
    }
  }, [t, o, r, Z, A]);
  return ne(() => (J(), () => {
    I.current += 1, E.current && (E.current(), E.current = null), U.current && (U.current.destroy(), U.current = null);
  }), [J]), {
    /** 是否加载中 */
    loading: H,
    /** 加载进度 */
    progress: W,
    /** PDF 文档对象 */
    pdfDocument: k,
    /** PDFViewer 实例 */
    pdfViewer: S.current,
    /** EventBus 引用 */
    eventBus: C.current,
    /** PDF 元数据 */
    metadata: $,
    /** 加载错误 */
    loadError: O
  };
}
const Ro = en(null), Fe = () => {
  const n = Ht(Ro);
  if (!n)
    throw new Error("usePdfViewerContext must be used within a PdfViewerProvider");
  return n;
}, Ln = en(null), Po = () => {
  const n = Ht(Ln);
  if (!n)
    throw new Error("useUserContext must be used within a UserProvider");
  return n;
}, di = "_InkLayerViewer_1ief7_1", ui = "_viewerHeader_1ief7_91", hi = "_viewerBody_1ief7_130", pi = "_navigationSidebarTriggerIcon_1ief7_136", fi = "_viewerWrapper_1ief7_142", gi = "_viewerContainer_1ief7_150", mi = "_pdfjsViewerContainer_1ief7_167", vi = "_viewerSidebar_1ief7_197", yi = "_sidebarOverlay_1ief7_225", Ne = {
  InkLayerViewer: di,
  viewerHeader: ui,
  "viewerHeader-title": "_viewerHeader-title_1ief7_102",
  "viewerHeader-title-left": "_viewerHeader-title-left_1ief7_109",
  "viewerHeader-title-name": "_viewerHeader-title-name_1ief7_115",
  "viewerHeader-title-actions": "_viewerHeader-title-actions_1ief7_124",
  viewerBody: hi,
  navigationSidebarTriggerIcon: pi,
  viewerWrapper: fi,
  viewerContainer: gi,
  "viewerContainer-header": "_viewerContainer-header_1ief7_156",
  pdfjsViewerContainer: mi,
  viewerSidebar: vi,
  "viewerSidebar--hidden": "_viewerSidebar--hidden_1ief7_209",
  "viewerSidebar-container": "_viewerSidebar-container_1ief7_215",
  sidebarOverlay: yi
};
function bi(n, e) {
  const [t, o] = Y(!1), r = j(null);
  return ne(() => (n ? r.current = setTimeout(() => {
    o(!0);
  }, e) : (r.current && (clearTimeout(r.current), r.current = null), o(!1)), () => {
    r.current && (clearTimeout(r.current), r.current = null);
  }), [n, e]), t;
}
function Si(n, e) {
  const [t, o] = Y(!1), [r, s] = Y(n), i = j(null), a = j(n);
  return ne(() => {
    n !== a.current && (a.current = n, s(n), t || o(!0), i.current && clearTimeout(i.current), i.current = setTimeout(() => {
      o(!1), i.current = null;
    }, e));
  }, [n, e, t]), {
    visible: t,
    value: r
  };
}
const wi = ({ loading: n, progress: e, loadingDelay: t = 500, progressHideDelay: o = 1500 }) => {
  const r = bi(n, t), s = Si(e, o), { t: i } = ve(["common"]), { appearance: a } = nn();
  return /* @__PURE__ */ T(ye, { children: [
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
          /* @__PURE__ */ c(vo, { size: "3" }),
          /* @__PURE__ */ c(lt, { mt: "4", children: /* @__PURE__ */ T(ae, { weight: "medium", style: { fontSize: "1.1em" }, children: [
            i("common:loading"),
            " ",
            e,
            "%"
          ] }) })
        ]
      }
    ),
    s.visible && /* @__PURE__ */ c(
      Tr,
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
}, Ci = ({ error: n }) => {
  const { t: e } = ve(["common"]);
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
        /* @__PURE__ */ c(dt.Icon, { children: /* @__PURE__ */ c(Ir, {}) }),
        /* @__PURE__ */ T(dt.Text, { children: [
          /* @__PURE__ */ c(ae, { children: /* @__PURE__ */ T(Ar, { children: [
            e("common:error"),
            " ",
            n.name
          ] }) }),
          /* @__PURE__ */ c("br", {}),
          /* @__PURE__ */ c(ae, { children: n.message })
        ] })
      ] })
    }
  );
}, xi = 3e3, Io = ({ persistent: n = !1 }) => {
  const { t: e } = ve(["viewer"], { useSuspense: !1 }), { pdfViewer: t, isReady: o } = Fe(), [r, s] = Y(1), [i, a] = Y(1), [l, u] = Y("1"), [d, h] = Y(!1), [p, f] = Y(!1), [m, g] = Y(!0), y = j(null), b = j({
    hovered: !1,
    inputFocused: !1
  }), S = X(() => {
    y.current && (window.clearTimeout(y.current), y.current = null);
  }, []), w = X(() => {
    S(), !(b.current.hovered || b.current.inputFocused) && (y.current = window.setTimeout(() => {
      y.current = null, g(!1);
    }, xi));
  }, [S]), C = X(() => {
    g(!0), n || w();
  }, [n, w]), E = X(() => {
    b.current.hovered = !0, S(), g(!0);
  }, [S]), I = X(() => {
    b.current.hovered = !1, w();
  }, [w]), H = X(() => {
    b.current.inputFocused = !0, S(), g(!0);
  }, [S]), B = X((A) => {
    A.currentTarget.select(), C();
  }, [C]), W = X((A) => {
    s(A), u(A.toString());
  }, []), D = X(
    (A) => !isNaN(A) && A >= 1 && A <= i,
    [i]
  ), k = X(
    (A) => {
      if (!(!t || !D(A))) {
        C(), h(!0);
        try {
          t.currentPageNumber = A, s(A), u(A.toString());
        } catch (U) {
          console.error("Error changing page:", U);
        } finally {
          h(!1);
        }
      }
    },
    [t, D, C]
  ), L = (A) => {
    C();
    const U = A.target.value;
    (U === "" || /^\d+$/.test(U)) && u(U);
  }, $ = X(() => {
    C();
    const A = parseInt(l, 10);
    D(A) ? k(A) : u(r.toString());
  }, [l, r, k, D, C]), G = X(() => {
    C(), r > 1 && k(r - 1);
  }, [r, k, C]), O = X(() => {
    C(), r < i && k(r + 1);
  }, [r, i, k, C]);
  ne(() => {
    if (!t) return;
    const A = ({ pageNumber: U }) => {
      W(U), h(!1), C();
    };
    if (o) {
      const U = t.currentPageNumber || 1, J = t.pagesCount || 1;
      s(U), u(U.toString()), a(J), f(!0), C();
    }
    return t.eventBus.on("pagechanging", A), () => {
      t.eventBus.off("pagechanging", A);
    };
  }, [t, o, W, C]), ne(() => {
    n && (S(), g(!0));
  }, [S, n]), ne(() => {
    if (!t?.container) return;
    const A = t.container, U = () => {
      C();
    };
    return A.addEventListener("scroll", U, { passive: !0 }), A.addEventListener("wheel", U, { passive: !0 }), () => {
      A.removeEventListener("scroll", U), A.removeEventListener("wheel", U);
    };
  }, [t, C]), ne(() => S, [S]);
  const N = (A) => {
    A.key === "Enter" ? $() : A.key === "Escape" && u(r.toString());
  }, Z = () => {
    b.current.inputFocused = !1, $(), w();
  }, q = l === "" || D(parseInt(l, 10));
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
        opacity: p && (n || m) ? 1 : 0,
        pointerEvents: p && (n || m) ? "auto" : "none",
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
            onClick: G,
            size: "1",
            disabled: r <= 1 || d,
            "aria-label": e("viewer:navigation.previousPage"),
            children: /* @__PURE__ */ c(bo, {})
          }
        ),
        /* @__PURE__ */ T(Q, { align: "center", gap: "1", pr: "2", children: [
          /* @__PURE__ */ c(
            kt.Root,
            {
              size: "1",
              value: l,
              onChange: L,
              onFocus: H,
              onBlur: Z,
              onDoubleClick: B,
              onKeyDown: N,
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
                borderColor: q ? void 0 : "red"
              }
            }
          ),
          /* @__PURE__ */ T(
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
          tt,
          {
            color: "gray",
            variant: "ghost",
            disabled: r >= i || d,
            onClick: O,
            size: "1",
            "aria-label": e("viewer:navigation.nextPage"),
            style: {
              color: `var(--inklayer-page-indicator-button-color, ${r >= i || d ? "#aaa" : "#fff"})`,
              transition: "var(--inklayer-page-indicator-button-transition, background-color 0.2s ease)",
              cursor: "pointer"
            },
            children: /* @__PURE__ */ c(So, {})
          }
        )
      ] })
    }
  );
};
function Ti(n) {
  for (const e of n.getPages()) {
    const t = F.of("Annots");
    e.node.has(t) && e.node.set(t, n.context.obj([]));
  }
}
async function Fn(n, e = !1) {
  const t = await n.getData(), o = await Dn.load(t);
  return e && Ti(o), o.save();
}
function No(n) {
  const e = new ArrayBuffer(n.byteLength);
  return new Uint8Array(e).set(n), e;
}
function Ai(n, e) {
  const t = new Blob([No(n)], { type: "application/pdf" }), o = document.createElement("a");
  o.href = URL.createObjectURL(t), o.download = e, o.click(), URL.revokeObjectURL(o.href);
}
function ki(n) {
  const e = new Blob([No(n)], { type: "application/pdf" }), t = URL.createObjectURL(e), o = document.createElement("iframe");
  o.style.position = "fixed", o.style.width = "0", o.style.height = "0", o.style.border = "none", o.src = t, document.body.appendChild(o), o.onload = () => {
    o.contentWindow?.focus(), o.contentWindow?.print(), setTimeout(() => {
      document.body.removeChild(o), URL.revokeObjectURL(t);
    }, 1e3);
  };
}
function Mo(n) {
  const e = X(
    async (o) => {
      if (!n) return;
      const r = await Fn(n, !0), s = o || `file_${Date.now()}.pdf`;
      Ai(r, s);
    },
    [n]
  ), t = X(async () => {
    if (!n) return;
    const o = await Fn(n, !0);
    ki(o);
  }, [n]);
  return {
    downloadClean: e,
    printClean: t
  };
}
const Ei = (n, e, t) => {
  if (e === 1) return 1;
  const o = t.current;
  (o > 1 && e < 1 || o < 1 && e > 1) && (t.current = 1);
  const r = Math.floor(n * e * t.current * 100) / (100 * n);
  return t.current = e / r, r;
};
function Ri({
  pdfViewer: n,
  containerRef: e,
  minScale: t = 0.1,
  maxScale: o = 10
}) {
  const r = j(1), s = j(1), i = j(!1), a = j(null), l = X((d, h, p) => {
    const f = e.current;
    if (!f || !n) return;
    const g = n.currentScale / d - 1;
    if (g === 0) return;
    const { left: y, top: b } = f.getBoundingClientRect();
    f.scrollLeft += (h - y) * g, f.scrollTop += (p - b) * g;
  }, [e, n]), u = X((d, h, p, f, m) => {
    const g = Ei(d, h, m);
    if (g === 1) return;
    let y = Math.round(d * g * 100) / 100;
    y = Math.min(o, Math.max(t, y)), !(!n || !n.pdfDocument) && (n.currentScale = y, l(d, p, f));
  }, [l, o, t, n]);
  ne(() => {
    const d = e.current;
    if (!d || !n) return;
    const h = (m) => {
      if (!m.ctrlKey && !m.metaKey) return;
      m.preventDefault();
      const g = Math.exp(-m.deltaY / 100), y = n.currentScale;
      u(
        y,
        g,
        m.clientX,
        m.clientY,
        r
      );
    }, p = (m) => {
      (m.key === "Control" || m.key === "Meta") && (i.current = !0);
    }, f = (m) => {
      (m.key === "Control" || m.key === "Meta") && (i.current = !1);
    };
    return d.addEventListener("wheel", h, { passive: !1 }), window.addEventListener("keydown", p), window.addEventListener("keyup", f), () => {
      d.removeEventListener("wheel", h), window.removeEventListener("keydown", p), window.removeEventListener("keyup", f);
    };
  }, [n, e, u]), ne(() => {
    const d = e.current;
    if (!d || !n) return;
    const h = (m) => {
      if (m.touches.length !== 2) {
        a.current = null;
        return;
      }
      m.preventDefault();
      let [g, y] = [m.touches[0], m.touches[1]];
      g.identifier > y.identifier && ([g, y] = [y, g]), a.current = {
        touch0X: g.pageX,
        touch0Y: g.pageY,
        touch1X: y.pageX,
        touch1Y: y.pageY
      };
    }, p = (m) => {
      const g = a.current;
      if (!g || m.touches.length !== 2) return;
      let [y, b] = [m.touches[0], m.touches[1]];
      y.identifier > b.identifier && ([y, b] = [b, y]);
      const { pageX: S, pageY: w } = y, { pageX: C, pageY: E } = b, {
        touch0X: I,
        touch0Y: H,
        touch1X: B,
        touch1Y: W
      } = g;
      if (Math.abs(I - S) <= 1 && Math.abs(H - w) <= 1 && Math.abs(B - C) <= 1 && Math.abs(W - E) <= 1)
        return;
      if (g.touch0X = S, g.touch0Y = w, g.touch1X = C, g.touch1Y = E, I === S && H === w) {
        const O = B - S, N = W - w, Z = C - S, q = E - w, A = O * q - N * Z;
        if (Math.abs(A) > 0.02 * Math.hypot(O, N) * Math.hypot(Z, q))
          return;
      } else if (B === C && W === E) {
        const O = I - C, N = H - E, Z = S - C, q = w - E, A = O * q - N * Z;
        if (Math.abs(A) > 0.02 * Math.hypot(O, N) * Math.hypot(Z, q))
          return;
      } else {
        const O = S - I, N = C - B, Z = w - H, q = E - W;
        if (O * N + Z * q >= 0) return;
      }
      m.preventDefault();
      const D = Math.hypot(S - C, w - E) || 1, k = Math.hypot(I - B, H - W) || 1, L = n.currentScale, $ = (y.clientX + b.clientX) / 2, G = (y.clientY + b.clientY) / 2;
      u(
        L,
        D / k,
        $,
        G,
        s
      );
    }, f = (m) => {
      a.current && (m.preventDefault(), a.current = null, s.current = 1);
    };
    return d.addEventListener("touchstart", h, {
      passive: !1
    }), d.addEventListener("touchmove", p, {
      passive: !1
    }), d.addEventListener("touchend", f, {
      passive: !1
    }), d.addEventListener("touchcancel", f), () => {
      d.removeEventListener("touchstart", h), d.removeEventListener("touchmove", p), d.removeEventListener("touchend", f), d.removeEventListener("touchcancel", f);
    };
  }, [n, e, u]);
}
const Pi = "_thumbnailList_vmgds_1", Ii = "_thumbnail_vmgds_1", Ni = "_thumbnailCanvasWrapper_vmgds_19", Mi = "_thumbnailCanvas_vmgds_19", Di = "_thumbnailPlaceholder_vmgds_51", Li = "_thumbnailError_vmgds_58", _i = "_thumbnailPageNumber_vmgds_71", Oi = "_thumbnailMarker_vmgds_93", ft = {
  thumbnailList: Pi,
  thumbnail: Ii,
  thumbnailCanvasWrapper: Ni,
  "thumbnail--selected": "_thumbnail--selected_vmgds_27",
  thumbnailCanvas: Mi,
  thumbnailPlaceholder: Di,
  thumbnailError: Li,
  thumbnailPageNumber: _i,
  thumbnailMarker: Oi
}, Hi = 132, Gi = "320px 0px", Do = mo(({
  pdfDocument: n,
  pageNumber: e,
  selected: t,
  markerCount: o,
  onSelect: r,
  onLayoutChange: s,
  registerElement: i
}) => {
  const { t: a } = ve(["viewer"], { useSuspense: !1 }), l = j(null), u = j(null), d = j(null), [h, p] = Y(!1), [f, m] = Y(!1), [g, y] = Y(!1), b = o > 0 ? a("viewer:navigation.pageWithMarkers", {
    value: e,
    count: o
  }) : a("viewer:navigation.page", { value: e }), S = X((w) => {
    l.current = w, i(e, w);
  }, [e, i]);
  return ne(() => {
    const w = l.current;
    if (!w || h) return;
    if (typeof IntersectionObserver > "u") {
      p(!0);
      return;
    }
    const C = new IntersectionObserver(
      ([E]) => {
        E.isIntersecting && (p(!0), C.disconnect());
      },
      { rootMargin: Gi }
    );
    return C.observe(w), () => C.disconnect();
  }, [h]), ne(() => {
    if (!h) return;
    let w = !1;
    return (async () => {
      let E = null;
      try {
        m(!1), y(!1);
        const I = await n.getPage(e);
        if (w) return;
        const H = u.current, B = H?.getContext("2d");
        if (!H || !B) return;
        const W = I.getViewport({ scale: 1 }), D = I.getViewport({ scale: Hi / W.width }), k = Math.min(window.devicePixelRatio || 1, 2);
        H.width = Math.floor(D.width * k), H.height = Math.floor(D.height * k), H.style.width = `${Math.floor(D.width)}px`, H.style.height = `${Math.floor(D.height)}px`, s(), E = I.render({
          canvasContext: B,
          viewport: D,
          transform: k === 1 ? void 0 : [k, 0, 0, k, 0, 0]
        }), d.current = E, await E.promise, w || m(!0);
      } catch (I) {
        !w && I.name !== "RenderingCancelledException" && y(!0);
      } finally {
        d.current === E && (d.current = null);
      }
    })(), () => {
      w = !0, d.current?.cancel(), d.current = null;
    };
  }, [s, n, e, h]), /* @__PURE__ */ c(
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
      children: /* @__PURE__ */ T("span", { className: ft.thumbnailCanvasWrapper, children: [
        /* @__PURE__ */ c("canvas", { ref: u, className: ft.thumbnailCanvas }),
        !f && !g && /* @__PURE__ */ c("span", { className: ft.thumbnailPlaceholder }),
        g && /* @__PURE__ */ c("span", { className: ft.thumbnailError, children: a("viewer:navigation.thumbnailError") }),
        o > 0 && /* @__PURE__ */ c("span", { className: ft.thumbnailMarker, "aria-hidden": "true", children: o > 99 ? "99+" : o }),
        /* @__PURE__ */ c("span", { className: ft.thumbnailPageNumber, children: e })
      ] })
    }
  );
});
Do.displayName = "PdfThumbnail";
const Ui = ({ pageMarkerCounts: n }) => {
  const { pdfDocument: e, pdfViewer: t, eventBus: o } = Fe(), [r, s] = Y(() => t?.currentPageNumber || 1), i = j(r), a = j(/* @__PURE__ */ new Map()), l = j(null), u = j(!0), d = X((g, y) => {
    y ? a.current.set(g, y) : a.current.delete(g);
  }, []), h = X(() => {
    l.current !== null && (window.cancelAnimationFrame(l.current), l.current = null);
  }, []), p = X(() => {
    u.current && (h(), l.current = window.requestAnimationFrame(() => {
      l.current = null, a.current.get(i.current)?.scrollIntoView({
        block: "nearest"
      });
    }));
  }, [h]), f = X(() => {
    u.current = !1, h();
  }, [h]), m = X((g) => {
    t && (u.current = !0, i.current = g, s(g), t.currentPageNumber = g);
  }, [t]);
  return ne(() => {
    if (!t || !o) return;
    const g = t.currentPageNumber || 1;
    u.current = !0, i.current = g, s(g);
    const y = ({ pageNumber: b }) => {
      u.current = !0, i.current = b, s(b);
    };
    return o.on("pagechanging", y), () => o.off("pagechanging", y);
  }, [o, t]), ne(() => {
    u.current = !0, i.current = r, p();
  }, [r, p, e]), ne(() => h, [h]), e ? /* @__PURE__ */ c(
    "div",
    {
      className: ft.thumbnailList,
      onPointerDown: f,
      onTouchStart: f,
      onWheel: f,
      children: Array.from({ length: e.numPages }, (g, y) => {
        const b = y + 1;
        return /* @__PURE__ */ c(
          Do,
          {
            pdfDocument: e,
            pageNumber: b,
            selected: b === r,
            markerCount: n.get(b) ?? 0,
            onSelect: m,
            onLayoutChange: p,
            registerElement: d
          },
          b
        );
      })
    }
  ) : null;
}, zi = "_outline_fpevi_1", Fi = "_outlineTree_fpevi_5", ji = "_outlineItem_fpevi_11", Bi = "_outlineRow_fpevi_16", Wi = "_outlineTitle_fpevi_26", Vi = "_outlineToggle_fpevi_33", $i = "_outlineToggleSpacer_fpevi_60", Yi = "_outlineChevron_fpevi_64", Ki = "_outlineState_fpevi_100", ze = {
  outline: zi,
  outlineTree: Fi,
  outlineItem: ji,
  outlineRow: Bi,
  "outlineRow--selected": "_outlineRow--selected_fpevi_26",
  outlineTitle: Wi,
  outlineToggle: Vi,
  outlineToggleSpacer: $i,
  outlineChevron: Yi,
  "outlineChevron--expanded": "_outlineChevron--expanded_fpevi_73",
  outlineState: Ki
}, Xi = (n) => {
  if (!n || typeof n != "object") return !1;
  const e = n;
  return Number.isInteger(e.num) && Number.isInteger(e.gen);
}, _n = mo(({
  depth: n,
  item: e,
  itemKey: t,
  selectedItemKey: o,
  onNavigate: r
}) => {
  const { t: s } = ve(["viewer"], { useSuspense: !1 }), i = e.items.length > 0, [a, l] = Y(() => e.count === void 0 || e.count >= 0), u = e.title.trim() || s("viewer:navigation.untitledOutlineItem"), d = e.dest !== null, h = o === t, p = () => {
    d ? r(e, t) : i && l((f) => !f);
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
                  onClick: () => l((f) => !f),
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
        i && a && /* @__PURE__ */ c("ul", { id: `${t}-children`, role: "group", className: ze.outlineTree, children: e.items.map((f, m) => /* @__PURE__ */ c(
          _n,
          {
            itemKey: `${t}-${m}`,
            item: f,
            depth: n + 1,
            selectedItemKey: o,
            onNavigate: r
          },
          `${t}-${m}`
        )) })
      ]
    }
  );
});
_n.displayName = "OutlineItem";
const qi = ({ onNavigate: n }) => {
  const { t: e } = ve(["viewer"], { useSuspense: !1 }), { pdfDocument: t, pdfViewer: o } = Fe(), r = j(0), [s, i] = Y(null), [a, l] = Y({
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
        const f = typeof d.dest == "string" ? await t.getDestination(d.dest) : d.dest;
        if (r.current !== p || o.pdfDocument !== t || !Array.isArray(f))
          return;
        const m = f[0];
        let g = null;
        if (Xi(m) ? (g = t.cachedPageNumber(m), g || (g = await t.getPageIndex(m) + 1)) : Number.isInteger(m) && (g = m + 1), r.current !== p || o.pdfDocument !== t || !g || g < 1 || g > t.numPages)
          return;
        o.scrollPageIntoView({
          pageNumber: g,
          destArray: f
        }), i(h), n?.();
      } catch {
      }
  }, [n, t, o]);
  return !t || a.document !== t || a.status === "loading" ? /* @__PURE__ */ c("div", { className: ze.outlineState, children: e("viewer:navigation.outlineLoading") }) : a.status === "error" ? /* @__PURE__ */ c("div", { className: ze.outlineState, children: e("viewer:navigation.outlineError") }) : a.items.length === 0 ? /* @__PURE__ */ c("div", { className: ze.outlineState, children: e("viewer:navigation.outlineEmpty") }) : /* @__PURE__ */ c("nav", { className: ze.outline, "aria-label": e("viewer:navigation.outline"), children: /* @__PURE__ */ c("ul", { role: "tree", className: ze.outlineTree, children: a.items.map((d, h) => /* @__PURE__ */ c(
    _n,
    {
      itemKey: `outline-${h}`,
      item: d,
      depth: 0,
      selectedItemKey: s,
      onNavigate: u
    },
    `outline-${h}`
  )) }) });
}, Yt = "inklayer:navigation-page-markers-changed", Ji = "_navigationSidebar_13vi9_1", Zi = "_navigationSidebarContainer_13vi9_19", Qi = "_navigationTabs_13vi9_29", es = "_navigationTabsList_13vi9_36", ts = "_navigationTabsTrigger_13vi9_47", ns = "_navigationTabsContent_13vi9_56", os = "_navigationSidebarOverlay_13vi9_63", st = {
  navigationSidebar: Ji,
  "navigationSidebar--hidden": "_navigationSidebar--hidden_13vi9_14",
  navigationSidebarContainer: Zi,
  navigationTabs: Qi,
  navigationTabsList: es,
  navigationTabsTrigger: ts,
  navigationTabsContent: ns,
  navigationSidebarOverlay: os
}, rs = ({
  open: n,
  onClose: e,
  onTransitionEnd: t
}) => {
  const { t: o } = ve(["viewer"], { useSuspense: !1 }), { eventBus: r } = Fe(), [s, i] = Y("thumbnails"), [a, l] = Y(() => /* @__PURE__ */ new Map()), u = X((p) => {
    (p === "thumbnails" || p === "outline") && i(p);
  }, []);
  ne(() => {
    if (l(/* @__PURE__ */ new Map()), !r) return;
    const p = ({
      source: f,
      markers: m
    }) => {
      l((g) => {
        const y = new Map(g);
        return m.size > 0 ? y.set(f, m) : y.delete(f), y;
      });
    };
    return r.on(Yt, p), () => {
      r.off(Yt, p);
    };
  }, [r]), ne(() => {
    if (!n) return;
    const p = (f) => {
      f.key === "Escape" && e();
    };
    return document.addEventListener("keydown", p), () => document.removeEventListener("keydown", p);
  }, [e, n]);
  const d = ke(() => {
    const p = /* @__PURE__ */ new Map();
    return a.forEach((f) => {
      f.forEach((m, g) => {
        p.set(g, (p.get(g) ?? 0) + m);
      });
    }), p;
  }, [a]), h = X(() => {
    window.matchMedia("(max-width: 840px)").matches && e();
  }, [e]);
  return /* @__PURE__ */ T(ye, { children: [
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
                  children: /* @__PURE__ */ c(Ui, { pageMarkerCounts: d })
                }
              ),
              /* @__PURE__ */ c(
                At.Content,
                {
                  value: "outline",
                  className: st.navigationTabsContent,
                  children: /* @__PURE__ */ c(qi, { onNavigate: h })
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
}, is = /* @__PURE__ */ new Set(["auto", "page-fit", "page-width"]), Lo = ({
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
  const { t: p } = ve(["viewer"], { useSuspense: !1 }), f = j(null), { loading: m, progress: g, pdfDocument: y, pdfViewer: b, eventBus: S, loadError: w } = li(f, h), [C, E] = Y(!1), I = X(() => {
    E((P) => !P);
  }, []), [H, B] = Y(() => o || null), W = H === null;
  ne(() => {
    if (!b || !S) return;
    const P = () => {
      b.currentScaleValue = a;
    };
    return S.on("pagesloaded", P), () => {
      S.off("pagesloaded", P);
    };
  }, [b, S, a]);
  const D = X(() => {
    B((P) => P ? null : t?.[0]?.key ?? null);
  }, [t]), k = X((P) => {
    B(P);
  }, []), L = X(() => {
    B(null);
  }, []), $ = X(() => {
    if (!b) return;
    const P = b.currentScaleValue;
    is.has(P) && (b.currentScaleValue = P, b.update());
  }, [b]), G = X(
    (P) => {
      P.target !== P.currentTarget || P.propertyName !== "width" || $();
    },
    [$]
  ), O = !!(b && S && f.current && !m), { printClean: N, downloadClean: Z } = Mo(y);
  Ri({
    pdfViewer: b ?? null,
    containerRef: f,
    minScale: 0.1,
    maxScale: 10
  });
  const q = ke(
    () => ({
      pdfDocument: y,
      pdfViewer: b,
      eventBus: S,
      viewerContainerRef: f,
      isReady: O,
      activeSidebarPanel: H,
      isNavigationSidebarOpen: C,
      toggleNavigationSidebar: I,
      toggleSidebar: D,
      openSidebar: k,
      closeSidebar: L,
      isSidebarCollapsed: W,
      print: N,
      download: Z
    }),
    [
      y,
      b,
      S,
      O,
      D,
      W,
      k,
      L,
      H,
      C,
      I,
      N,
      Z
    ]
  ), A = ke(
    () => ({
      user: l || null
    }),
    [l]
  );
  ne(() => {
    if (!b || !S)
      return;
    const P = () => {
      const K = b.currentScaleValue;
      (K === "auto" || K === "page-fit" || K === "page-width") && (b.currentScaleValue = K), b.update();
    };
    return window.addEventListener("resize", P), P(), () => {
      window.removeEventListener("resize", P);
    };
  }, [b, S]);
  const U = t && /* @__PURE__ */ c(Q, { gap: "2", children: t.map((P) => /* @__PURE__ */ c(Rt, { content: P.title, children: /* @__PURE__ */ c(
    be,
    {
      variant: H === P.key ? "soft" : "outline",
      size: "2",
      color: "gray",
      highContrast: !0,
      style: {
        boxShadow: "none"
      },
      onClick: () => B((K) => K === P.key ? null : P.key),
      children: P.icon
    }
  ) }, P.key)) }), J = ke(() => !t || !H ? null : t.find((P) => P.key === H) || null, [t, H]);
  return ne(() => {
    if (!t || !H) return;
    t.some((K) => K.key === H) || B(null);
  }, [t, H]), /* @__PURE__ */ c(Ln.Provider, { value: A, children: /* @__PURE__ */ c(Ro.Provider, { value: q, children: /* @__PURE__ */ T(Q, { id: "InkLayer", className: Ne.InkLayerViewer, style: i, direction: "column", width: "100%", position: "relative", children: [
    /* @__PURE__ */ c(wi, { progress: g, loading: m }),
    w && /* @__PURE__ */ c(Ci, { error: w }),
    !u && /* @__PURE__ */ c(Q, { pl: "2", pr: "2", className: Ne.viewerHeader, children: /* @__PURE__ */ T("div", { className: Ne["viewerHeader-title"], children: [
      /* @__PURE__ */ T(Q, { align: "center", gap: "2", className: Ne["viewerHeader-title-left"], children: [
        /* @__PURE__ */ c(Rt, { content: p("viewer:navigation.toggle"), children: /* @__PURE__ */ c(
          be,
          {
            variant: "outline",
            size: "2",
            color: "gray",
            highContrast: !0,
            style: { boxShadow: "none" },
            "aria-controls": "InkLayer-navigation-sidebar",
            "aria-expanded": C,
            "aria-label": p("viewer:navigation.toggle"),
            onClick: () => E((P) => !P),
            children: C ? /* @__PURE__ */ c(Zr, { className: Ne.navigationSidebarTriggerIcon }) : /* @__PURE__ */ c(Qr, { className: Ne.navigationSidebarTriggerIcon })
          }
        ) }),
        /* @__PURE__ */ c("div", { className: Ne["viewerHeader-title-name"], children: r || "PDF Viewer" })
      ] }),
      /* @__PURE__ */ c("div", { className: Ne["viewerHeader-title-actions"], children: /* @__PURE__ */ T(Q, { direction: "row", gap: "3", justify: "between", align: "center", children: [
        U,
        s
      ] }) })
    ] }) }),
    /* @__PURE__ */ T(Q, { flexGrow: "1", minHeight: "0", className: Ne.viewerBody, children: [
      /* @__PURE__ */ c(
        rs,
        {
          open: C,
          onClose: () => E(!1),
          onTransitionEnd: G
        }
      ),
      /* @__PURE__ */ T(Q, { flexGrow: "1", minHeight: "0", className: Ne.viewerWrapper, children: [
        /* @__PURE__ */ T(Q, { className: Ne.viewerContainer, direction: "column", flexGrow: "1", children: [
          e && /* @__PURE__ */ c(Q, { align: "center", justify: "center", className: Ne["viewerContainer-header"], children: e }),
          /* @__PURE__ */ T(lt, { position: "relative", flexGrow: "1", className: Ne["viewerContainer-content"], children: [
            !d && /* @__PURE__ */ c(Io, {}),
            /* @__PURE__ */ c("div", { ref: f, className: Ne.pdfjsViewerContainer, children: /* @__PURE__ */ c("div", { className: "pdfViewer" }) })
          ] })
        ] }),
        /* @__PURE__ */ c(
          lt,
          {
            id: "InkLayer-viewer-sidebar",
            className: [
              Ne.viewerSidebar,
              J ? "" : Ne["viewerSidebar--hidden"]
            ].join(" "),
            pl: "1",
            pr: "1",
            onTransitionEnd: G,
            children: J && /* @__PURE__ */ c("div", { className: Ne["viewerSidebar-container"], children: J.render(q) })
          }
        ),
        J && /* @__PURE__ */ c(
          "div",
          {
            className: Ne.sidebarOverlay,
            onClick: () => B(null)
          }
        )
      ] })
    ] }),
    n
  ] }) }) });
}, Ie = ({ children: n, style: e, ...t }) => /* @__PURE__ */ c("svg", { ...t, style: { width: "1em", height: "1em", ...e }, children: n }), ss = ({ style: n }) => /* @__PURE__ */ c(Ie, { viewBox: "0 0 320 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M0 55.2V426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320H297.9c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"
  }
) }), _o = ({ style: n }) => /* @__PURE__ */ c(Ie, { fill: "currentColor", viewBox: "0 0 576 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M315 315l158.4-215L444.1 70.6 229 229 315 315zm-187 5l0 0V248.3c0-15.3 7.2-29.6 19.5-38.6L420.6 8.4C428 2.9 437 0 446.2 0c11.4 0 22.4 4.5 30.5 12.6l54.8 54.8c8.1 8.1 12.6 19 12.6 30.5c0 9.2-2.9 18.2-8.4 25.6L334.4 396.5c-9 12.3-23.4 19.5-38.6 19.5H224l-25.4 25.4c-12.5 12.5-32.8 12.5-45.3 0l-50.7-50.7c-12.5-12.5-12.5-32.8 0-45.3L128 320zM7 466.3l63-63 70.6 70.6-31 31c-4.5 4.5-10.6 7-17 7H24c-13.3 0-24-10.7-24-24v-4.7c0-6.4 2.5-12.5 7-17z"
  }
) }), Oo = ({ style: n }) => /* @__PURE__ */ c(Ie, { fill: "currentColor", viewBox: "0 0 512 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M161.3 144c3.2-17.2 14-30.1 33.7-38.6c21.1-9 51.8-12.3 88.6-6.5c11.9 1.9 48.8 9.1 60.1 12c17.1 4.5 34.6-5.6 39.2-22.7s-5.6-34.6-22.7-39.2c-14.3-3.8-53.6-11.4-66.6-13.4c-44.7-7-88.3-4.2-123.7 10.9c-36.5 15.6-64.4 44.8-71.8 87.3c-.1 .6-.2 1.1-.2 1.7c-2.8 23.9 .5 45.6 10.1 64.6c4.5 9 10.2 16.9 16.7 23.9H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H270.1c-.1 0-.3-.1-.4-.1l-1.1-.3c-36-10.8-65.2-19.6-85.2-33.1c-9.3-6.3-15-12.6-18.2-19.1c-3.1-6.1-5.2-14.6-3.8-27.4zM348.9 337.2c2.7 6.5 4.4 15.8 1.9 30.1c-3 17.6-13.8 30.8-33.9 39.4c-21.1 9-51.7 12.3-88.5 6.5c-18-2.9-49.1-13.5-74.4-22.1c-5.6-1.9-11-3.7-15.9-5.4c-16.8-5.6-34.9 3.5-40.5 20.3s3.5 34.9 20.3 40.5c3.6 1.2 7.9 2.7 12.7 4.3l0 0 0 0c24.9 8.5 63.6 21.7 87.6 25.6l0 0 .2 0c44.7 7 88.3 4.2 123.7-10.9c36.5-15.6 64.4-44.8 71.8-87.3c3.6-21 2.7-40.4-3.1-58.1H335.1c7 5.6 11.4 11.2 13.9 17.2z"
  }
) }), Ho = ({ style: n }) => /* @__PURE__ */ c(Ie, { fill: "currentColor", viewBox: "0 0 448 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M16 64c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H128V224c0 53 43 96 96 96s96-43 96-96V96H304c-17.7 0-32-14.3-32-32s14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H384V224c0 88.4-71.6 160-160 160s-160-71.6-160-160V96H48C30.3 96 16 81.7 16 64zM0 448c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32z"
  }
) }), as = ({ style: n }) => /* @__PURE__ */ c(Ie, { fill: "currentColor", viewBox: "0 0 384 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M32 32C14.3 32 0 46.3 0 64S14.3 96 32 96H160V448c0 17.7 14.3 32 32 32s32-14.3 32-32V96H352c17.7 0 32-14.3 32-32s-14.3-32-32-32H192 32z"
  }
) }), cs = ({ style: n }) => /* @__PURE__ */ c(Ie, { fill: "currentColor", viewBox: "0 0 512 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M384 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H384zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"
  }
) }), ls = ({ style: n }) => /* @__PURE__ */ c(Ie, { fill: "currentColor", viewBox: "0 0 512 512", style: n, children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" }) }), ds = ({ style: n }) => /* @__PURE__ */ c(Ie, { fill: "currentColor", viewBox: "0 0 512 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
  }
) }), us = ({ style: n }) => /* @__PURE__ */ c(Ie, { fill: "currentColor", viewBox: "0 0 576 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M315 315l158.4-215L444.1 70.6 229 229 315 315zm-187 5l0 0V248.3c0-15.3 7.2-29.6 19.5-38.6L420.6 8.4C428 2.9 437 0 446.2 0c11.4 0 22.4 4.5 30.5 12.6l54.8 54.8c8.1 8.1 12.6 19 12.6 30.5c0 9.2-2.9 18.2-8.4 25.6L334.4 396.5c-9 12.3-23.4 19.5-38.6 19.5H224l-25.4 25.4c-12.5 12.5-32.8 12.5-45.3 0l-50.7-50.7c-12.5-12.5-12.5-32.8 0-45.3L128 320zM7 466.3l63-63 70.6 70.6-31 31c-4.5 4.5-10.6 7-17 7H24c-13.3 0-24-10.7-24-24v-4.7c0-6.4 2.5-12.5 7-17z"
  }
) }), hs = ({ style: n }) => /* @__PURE__ */ c(Ie, { fill: "currentColor", viewBox: "0 0 640 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M192 128c0-17.7 14.3-32 32-32s32 14.3 32 32v7.8c0 27.7-2.4 55.3-7.1 82.5l-84.4 25.3c-40.6 12.2-68.4 49.6-68.4 92v71.9c0 40 32.5 72.5 72.5 72.5c26 0 50-13.9 62.9-36.5l13.9-24.3c26.8-47 46.5-97.7 58.4-150.5l94.4-28.3-12.5 37.5c-3.3 9.8-1.6 20.5 4.4 28.8s15.7 13.3 26 13.3H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H460.4l18-53.9c3.8-11.3 .9-23.8-7.4-32.4s-20.7-11.8-32.2-8.4L316.4 198.1c2.4-20.7 3.6-41.4 3.6-62.3V128c0-53-43-96-96-96s-96 43-96 96v32c0 17.7 14.3 32 32 32s32-14.3 32-32V128zm-9.2 177l49-14.7c-10.4 33.8-24.5 66.4-42.1 97.2l-13.9 24.3c-1.5 2.6-4.3 4.3-7.4 4.3c-4.7 0-8.5-3.8-8.5-8.5V335.6c0-14.1 9.3-26.6 22.8-30.7zM24 368c-13.3 0-24 10.7-24 24s10.7 24 24 24H64.3c-.2-2.8-.3-5.6-.3-8.5V368H24zm592 48c13.3 0 24-10.7 24-24s-10.7-24-24-24H305.9c-6.7 16.3-14.2 32.3-22.3 48H616z"
  }
) }), ps = ({ style: n }) => /* @__PURE__ */ c(Ie, { fill: "currentColor", viewBox: "0 0 512 512", style: n, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M312 201.8c0-17.4 9.2-33.2 19.9-47C344.5 138.5 352 118.1 352 96c0-53-43-96-96-96s-96 43-96 96c0 22.1 7.5 42.5 20.1 58.8c10.7 13.8 19.9 29.6 19.9 47c0 29.9-24.3 54.2-54.2 54.2H112C50.1 256 0 306.1 0 368c0 20.9 13.4 38.7 32 45.3V464c0 26.5 21.5 48 48 48H432c26.5 0 48-21.5 48-48V413.3c18.6-6.6 32-24.4 32-45.3c0-61.9-50.1-112-112-112H366.2c-29.9 0-54.2-24.3-54.2-54.2zM416 416v32H96V416H416z"
  }
) }), fs = ({ style: n }) => /* @__PURE__ */ T(Ie, { viewBox: "0 0 1024 1024", style: n, children: [
  /* @__PURE__ */ c("path", { d: "M96 837.68888888h832v160H96z", fill: "var(--palette-preview-color, currentColor)" }),
  /* @__PURE__ */ c("path", { d: "M429.30646525 163.315053m54.92260742 54.92260743l164.76782227 164.76782227q54.92260742 54.92260742 0 109.84521486l-164.76782227 164.76782228q-54.92260742 54.92260742-109.84521486 0l-164.76782228-164.76782228q-54.92260742-54.92260742 0-109.84521486l164.76782228-164.76782227q54.92260742-54.92260742 109.84521486 0Z", fill: "var(--palette-preview-color, currentColor)" }),
  /* @__PURE__ */ c("path", { d: "M364.65047577 163.33699097L262.12304466 60.85098508 320.69831237 2.23429214l153.14905568 153.10763046c2.94119095 2.27838736 5.79953147 4.76390083 8.5335963 7.45654045l234.34249608 234.34249608a82.85044939 82.85044939 0 0 1 0 117.15053543l-234.34249608 234.34249607a82.85044939 82.85044939 0 0 1-117.19196065 0L130.88793283 514.29149456a82.85044939 82.85044939 0 0 1 0-117.15053543l233.76254294-233.80396816z m220.2579197 219.13943862l-0.57995316 0.53852791-161.0612736-161.0612736-226.72025474 226.67882952h454.51756532L584.90839547 382.47642959zM822.68918518 783.3069037a103.56306173 103.56306173 0 0 1-103.56306171-103.56306173c0-57.16681008 87.61435022-161.39267539 103.56306171-161.3926754 15.9487115 0 103.56306173 104.1844401 103.56306173 161.3926754a103.56306173 103.56306173 0 0 1-103.56306173 103.56306173z", fill: "currentColor" })
] }), gs = ({ style: n }) => /* @__PURE__ */ T(
  Ie,
  {
    viewBox: "0 0 1024 1024",
    style: n,
    children: [
      /* @__PURE__ */ c("path", { fill: "currentColor", stroke: "currentColor", strokeWidth: "16", strokeLinejoin: "round", d: "M542.04 141.43c-68.07-39.3-151.95-39.3-220.03 0-68.07 39.31-110.01 111.95-110 190.56C212.02 453.5 310.52 552 432.03 552s220.01-98.5 220.02-220.01c0.01-78.61-41.93-151.25-110.01-190.56zM432.03 472c-77.33 0-140.01-62.69-140.01-140.01s62.68-140.02 140.01-140.02c77.33 0 140.02 62.69 140.02 140.02S509.36 472 432.03 472zM325.06 612.02h186.98c22.09 0 40 17.91 40 40s-17.91 40-40 40H332.02c-58.73 0-79.21 0.4-94.81 5.2a120.03 120.03 0 0 0-80.01 80c-4.79 15.6-5.2 36.09-5.2 94.82 0 14.29-7.62 27.5-19.99 34.65a40.044 40.044 0 0 1-40.01 0 40.013 40.013 0 0 1-20-34.65v-6.97c0-49.08 0-82.61 8.6-111.09C99.99 690.04 150.03 640 213.98 620.62c28.48-8.65 62-8.65 111.08-8.6z" }),
      /* @__PURE__ */ c("path", { fill: "currentColor", stroke: "currentColor", strokeWidth: "24", strokeLinecap: "round", strokeLinejoin: "round", d: "M720.72 551.99c4.72 0 9.24 1.87 12.58 5.21 3.34 3.33 5.21 7.86 5.21 12.58v71.16h106.74v-71.16c0-6.36 3.39-12.23 8.9-15.41a17.78 17.78 0 0 1 17.79 0c5.5 3.18 8.89 9.05 8.89 15.41v71.16h53.37c6.36 0 12.23 3.39 15.41 8.89a17.78 17.78 0 0 1 0 17.79c-3.18 5.5-9.05 8.89-15.41 8.89h-53.37v106.74h53.37c6.36 0 12.23 3.39 15.41 8.9a17.78 17.78 0 0 1 0 17.79c-3.18 5.5-9.05 8.9-15.41 8.89h-53.37v71.16c0 6.36-3.39 12.23-8.89 15.41a17.78 17.78 0 0 1-17.79 0c-5.51-3.18-8.9-9.05-8.9-15.41v-71.16H738.51v71.16c0 6.36-3.39 12.23-8.9 15.41a17.78 17.78 0 0 1-17.79 0c-5.51-3.18-8.9-9.05-8.89-15.41v-71.16h-53.37c-6.36 0-12.23-3.39-15.41-8.89a17.78 17.78 0 0 1 0-17.79c3.18-5.51 9.05-8.9 15.41-8.9h53.37V676.53h-53.37c-9.82 0-17.79-7.96-17.79-17.79 0-9.82 7.96-17.79 17.79-17.79h53.37v-71.16c0-9.83 7.96-17.8 17.79-17.8z m17.79 124.54v106.74h106.74V676.53H738.51z m0 0" })
    ]
  }
), ms = ({ style: n }) => /* @__PURE__ */ c(Ie, { viewBox: "0 0 1024 1024", style: n, children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M766.4 744.3c43.7 0 79.4-36.2 79.4-80.5 0-53.5-79.4-140.8-79.4-140.8S687 610.3 687 663.8c0 44.3 35.7 80.5 79.4 80.5zm-377.1-44.1c7.1 7.1 18.6 7.1 25.6 0l256.1-256c7.1-7.1 7.1-18.6 0-25.6l-256-256c-.6-.6-1.3-1.2-2-1.7l-78.2-78.2a9.11 9.11 0 00-12.8 0l-48 48a9.11 9.11 0 000 12.8l67.2 67.2-207.8 207.9c-7.1 7.1-7.1 18.6 0 25.6l255.9 256zm12.9-448.6l178.9 178.9H223.4l178.8-178.9zM904 816H120c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8z" }) }), vs = ({ style: n }) => /* @__PURE__ */ T(Ie, { viewBox: "0 0 1024 1024", style: n, children: [
  /* @__PURE__ */ c("path", { d: "M66.782609 772.541217h196.051478a58.835478 58.835478 0 0 1 58.768696 58.768696v117.359304l235.78713-165.442782c9.928348-6.989913 21.615304-10.685217 33.747478-10.685218H957.217391V89.043478H66.782609v683.475479zM313.61113 1022.886957a58.768696 58.768696 0 0 1-58.768695-58.768696v-124.794435H58.724174A58.813217 58.813217 0 0 1 0 780.55513V81.029565A58.835478 58.835478 0 0 1 58.768696 22.26087h906.462608A58.835478 58.835478 0 0 1 1024 81.029565v699.503305a58.835478 58.835478 0 0 1-58.768696 58.768695H593.697391L347.336348 1012.201739c-10.106435 7.101217-21.904696 10.685217-33.725218 10.685218z", fill: "currentColor" }),
  /* @__PURE__ */ c("path", { d: "M761.878261 326.032696h-499.756522a33.391304 33.391304 0 0 1 0-66.782609h499.756522a33.391304 33.391304 0 1 1 0 66.782609M761.878261 567.652174h-499.756522a33.391304 33.391304 0 0 1 0-66.782609h499.756522a33.391304 33.391304 0 1 1 0 66.782609", fill: "currentColor" })
] }), Go = ({ style: n }) => /* @__PURE__ */ c(Ie, { viewBox: "0 0 1024 1024", style: n, children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M464 512a48 48 0 1096 0 48 48 0 10-96 0zm200 0a48 48 0 1096 0 48 48 0 10-96 0zm-400 0a48 48 0 1096 0 48 48 0 10-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 00-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 00-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 00112 714v152a46 46 0 0046 46h152.1A449.4 449.4 0 00510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 00142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z" }) }), ys = ({ style: n }) => /* @__PURE__ */ c(Ie, { style: n, viewBox: "0 0 1024 1024", children: /* @__PURE__ */ c("path", { d: "M820.35259846 337.71374951V646.0663464h134.06634641V109.8009592h-536.2653872v134.06634641h308.35259689L109.8009592 860.57250255l93.84644234 93.84644232 616.70519692-616.70519536z", fill: "currentColor" }) }), bs = ({ style: n }) => /* @__PURE__ */ c(Ie, { style: n, viewBox: "0 0 1365 1024", children: /* @__PURE__ */ c("path", { d: "M992 992H392v-2.71999969A319.75999969 319.75999969 0 0 1 193.92000031 393.99999969a400.00000031 400.00000031 0 0 1 790.11999938-41.47999969c2.68000031 0 5.28-0.52000031 8.00000062-0.52000031A319.99999969 319.99999969 0 0 1 992 992z m0-480h-7.99999969a247.99999969 247.99999969 0 0 1-77.28 0H831.99999969v-79.99999969a240 240 0 0 0-480 0v79.99999969a202.87999969 202.87999969 0 0 0-79.99999969 22.56L247.23999969 552.00000031a157.39999969 157.39999969 0 0 0-15.24 15.31999969 54.28000031 54.28000031 0 0 0-9.96 12.48A157.44 157.44 0 0 0 192.00000031 672.00000031a166.36000031 166.36000031 0 0 0 120 159.99999938h679.99999969a160.00000031 160.00000031 0 0 0 0-319.99999969z", fill: "currentColor" }) }), Ss = ({ style: n }) => /* @__PURE__ */ c(Ie, { style: n, viewBox: "0 0 1024 1024", children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" }) });
var oe = /* @__PURE__ */ ((n) => (n[n.NONE = 0] = "NONE", n[n.TEXT = 1] = "TEXT", n[n.LINK = 2] = "LINK", n[n.FREETEXT = 3] = "FREETEXT", n[n.LINE = 4] = "LINE", n[n.SQUARE = 5] = "SQUARE", n[n.CIRCLE = 6] = "CIRCLE", n[n.POLYGON = 7] = "POLYGON", n[n.POLYLINE = 8] = "POLYLINE", n[n.HIGHLIGHT = 9] = "HIGHLIGHT", n[n.UNDERLINE = 10] = "UNDERLINE", n[n.SQUIGGLY = 11] = "SQUIGGLY", n[n.STRIKEOUT = 12] = "STRIKEOUT", n[n.STAMP = 13] = "STAMP", n[n.CARET = 14] = "CARET", n[n.INK = 15] = "INK", n[n.POPUP = 16] = "POPUP", n[n.FILEATTACHMENT = 17] = "FILEATTACHMENT", n[n.SOUND = 18] = "SOUND", n[n.MOVIE = 19] = "MOVIE", n[n.WIDGET = 20] = "WIDGET", n[n.SCREEN = 21] = "SCREEN", n[n.PRINTERMARK = 22] = "PRINTERMARK", n[n.TRAPNET = 23] = "TRAPNET", n[n.WATERMARK = 24] = "WATERMARK", n[n.THREED = 25] = "THREED", n[n.REDACT = 26] = "REDACT", n[n.NOTE = 27] = "NOTE", n))(oe || {}), R = /* @__PURE__ */ ((n) => (n[n.NONE = -1] = "NONE", n[n.SELECT = 0] = "SELECT", n[n.HIGHLIGHT = 1] = "HIGHLIGHT", n[n.STRIKEOUT = 2] = "STRIKEOUT", n[n.UNDERLINE = 3] = "UNDERLINE", n[n.FREETEXT = 4] = "FREETEXT", n[n.RECTANGLE = 5] = "RECTANGLE", n[n.CIRCLE = 6] = "CIRCLE", n[n.FREEHAND = 7] = "FREEHAND", n[n.FREE_HIGHLIGHT = 8] = "FREE_HIGHLIGHT", n[n.SIGNATURE = 9] = "SIGNATURE", n[n.STAMP = 10] = "STAMP", n[n.NOTE = 11] = "NOTE", n[n.ARROW = 12] = "ARROW", n[n.CLOUD = 13] = "CLOUD", n))(R || {}), at = /* @__PURE__ */ ((n) => (n.Accepted = "Accepted", n.Rejected = "Rejected", n.Cancelled = "Cancelled", n.Completed = "Completed", n.None = "None", n.Closed = "Closed", n))(at || {});
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
    icon: /* @__PURE__ */ c(ss, {})
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
    icon: /* @__PURE__ */ c(_o, {}),
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
    icon: /* @__PURE__ */ c(Oo, {}),
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
    icon: /* @__PURE__ */ c(Ho, {}),
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
    icon: /* @__PURE__ */ c(cs, {}),
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
    icon: /* @__PURE__ */ c(ls, {}),
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
    icon: /* @__PURE__ */ c(vs, {})
  },
  {
    name: "arrow",
    type: 12,
    pdfjsAnnotationType: 4,
    subtype: "Arrow",
    webSelectionDependencies: !1,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(ys, {}),
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
    icon: /* @__PURE__ */ c(bs, {}),
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
    name: "freeHighlight",
    type: 8,
    pdfjsAnnotationType: 15,
    subtype: "Highlight",
    webSelectionDependencies: !1,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(us, {}),
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
    icon: /* @__PURE__ */ c(as, {}),
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
    icon: /* @__PURE__ */ c(hs, {})
  },
  {
    name: "stamp",
    type: 10,
    pdfjsAnnotationType: 13,
    subtype: "Stamp",
    webSelectionDependencies: !1,
    resizable: !0,
    draggable: !0,
    icon: /* @__PURE__ */ c(ps, {})
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
function ws(n) {
  return document.body.contains(n);
}
function Uo() {
  return ei();
}
function zo(n, e) {
  document.documentElement.style.setProperty(n, e);
}
function un(n) {
  document.documentElement.style.removeProperty(n);
}
function Cn(n) {
  if (n < 1024) return `${n} B`;
  const e = ["KB", "MB", "GB", "TB"];
  let t = -1, o = n;
  do
    o /= 1024, t++;
  while (o >= 1024 && t < e.length - 1);
  return `${o.toFixed(2)} ${e[t]}`;
}
function Kt(n, e, t) {
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
function Vt(n) {
  const e = new Date(n), t = e.getFullYear(), o = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getDate()).padStart(2, "0"), s = String(e.getHours()).padStart(2, "0"), i = String(e.getMinutes()).padStart(2, "0"), a = String(e.getSeconds()).padStart(2, "0"), l = -e.getTimezoneOffset(), u = String(Math.floor(Math.abs(l) / 60)).padStart(2, "0"), d = String(Math.abs(l) % 60).padStart(2, "0"), h = l >= 0 ? "+" : "-";
  return `D:${t}${o}${r}${s}${i}${a}${h}${u}'${d}'`;
}
function xn(n, e = !1) {
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
function jn(n) {
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
function Bn(n) {
  const e = n.slice(2, 16), t = parseInt(e.slice(0, 4), 10), o = parseInt(e.slice(4, 6), 10) - 1, r = parseInt(e.slice(6, 8), 10), s = parseInt(e.slice(8, 10), 10), i = parseInt(e.slice(10, 12), 10), a = parseInt(e.slice(12, 14), 10) || 0, l = n.slice(16).match(/([+-])(\d{2})'?(\d{2})?'/);
  let u = 0;
  if (l) {
    const h = l[1] === "+" ? 1 : -1, p = parseInt(l[2], 10) || 0, f = parseInt(l[3] || "0", 10) || 0;
    u = h * (p * 60 + f);
  }
  return new Date(Date.UTC(t, o, r, s, i, a)).getTime() - u * 60 * 1e3;
}
function Pe(n, e) {
  const { viewport: t } = e, o = t.scale, r = n.x * o, s = n.y * o, i = n.width * o, a = n.height * o, [l, u] = t.convertToPdfPoint(r, s), [d, h] = t.convertToPdfPoint(r + i, s + a);
  return [Math.min(l, d), Math.min(u, h), Math.max(l, d), Math.max(u, h)];
}
function ie(n) {
  const t = [...[254, 255]];
  for (let r = 0; r < n.length; r++) {
    const s = n.charCodeAt(r);
    t.push(s >> 8 & 255, s & 255);
  }
  const o = t.map((r) => r.toString(16).padStart(2, "0")).join("").toUpperCase();
  return xo.of(o);
}
function Fo(n = /* @__PURE__ */ new Date()) {
  const e = (l) => l.toString().padStart(2, "0"), t = n.getFullYear(), o = e(n.getMonth() + 1), r = e(n.getDate()), s = e(n.getHours()), i = e(n.getMinutes()), a = e(n.getSeconds());
  return `${t}${o}${r}_${s}${i}${a}`;
}
const ut = "InkLayer_Annotator", Tn = `${ut}_painter_wrapper`, Cs = `${ut}_annotation_author_labels_layer`, xs = `${ut}_annotation_author_label`, on = "annotationAuthorLabelBoundsChange", Ts = `${ut}_annotation_hover_preview`, Wn = `${ut}_is_painting`, hn = `${ut}_painting_type`, _e = `${ut}_shape_group`, As = `${ut}_selector_hover`, Lt = `--${ut}-image-cursor`, jo = `${ut}_free_text_editor`;
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
        date: Vt(Date.now()),
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
    const e = Uo(), t = new M.Group({
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
class ks extends Ee {
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
class Es extends Ee {
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
class Rs extends Ee {
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
      return e.map((f, m) => m % 2 === 0 ? o : f);
    if (l === 0 && a !== 0)
      return e.map((f, m) => m % 2 === 0 ? f : r);
    if (a === 0 && l === 0)
      return e;
    const u = Math.atan2(l, a), d = Math.abs(u * (180 / Math.PI)), h = d <= t || d >= 180 - t || d >= 90 - t && d <= 90 + t && Math.abs(a) > Math.abs(l), p = d >= 90 - t && d <= 90 + t && Math.abs(l) > Math.abs(a) || d >= 180 - t || d <= t;
    return h ? e.map((f, m) => m % 2 === 0 ? f : r) : p ? e.map((f, m) => m % 2 === 0 ? o : f) : e;
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
const Ps = {
  placement: "bottom-start",
  middleware: [Ao()]
}, An = 200;
class Is {
  resolveFunction = null;
  container = null;
  inputElement = null;
  isActive = !1;
  isCleaningUp = !1;
  show(e, t, o, r) {
    return this.isActive && this.handleConfirm(), this.isActive = !0, this.isCleaningUp = !1, new Promise((s) => {
      this.resolveFunction = s, this.container = document.createElement("div"), this.container.id = jo, Object.assign(this.container.style, {
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: "1000"
      }), document.body.appendChild(this.container), Wt({
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
      }, this.container, Ps).then(({ x: a, y: l }) => {
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
      width: `${An}px`,
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
const Ns = new Is();
async function Ms(n, e, t, o) {
  return Ns.show(n, e, t, o);
}
class Ds extends Ee {
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
    const s = r.getBoundingClientRect(), i = s.left + t.x * o.x, a = s.top + t.y * o.y, l = await Ms(
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
    }).width(), u = l > An ? An : l, d = new M.Text({
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
class Vn extends Ee {
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
    const o = t.getBoundingClientRect(), r = e.map((i) => {
      const a = i.getBoundingClientRect();
      return this.calculateRelativePosition(a, o);
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
        const p = u[h], f = d.x + d.width;
        if (p.x - f <= o) {
          const g = p.x + p.width;
          d.width = Math.max(f, g) - d.x, d.height = Math.max(d.height, p.height), d.y = Math.min(d.y, p.y);
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
class Ls extends Ee {
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
      const { width: o, height: r } = t.getClientRect(), { newWidth: s, newHeight: i } = Kt(o, r, 96), a = { x: s / 2, y: i / 2 }, l = new M.Rect({
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
      e.destroy(), zo(
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
      const { width: r, height: s } = o.getClientRect(), { newWidth: i, newHeight: a } = Kt(r, s, 120), l = { x: i / 2, y: a / 2 };
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
      l.setAttrs(i.getAttrs()), i.destroy(), r.add(l), r.getLayer()?.batchDraw(), r.fire(on);
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
class Yn extends Ee {
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
      const { width: o, height: r } = t.getClientRect(), { newWidth: s, newHeight: i } = Kt(o, r, 96), a = { x: s / 2, y: i / 2 }, l = new M.Rect({
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
      e.destroy(), zo(
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
      const { width: r, height: s } = o.getClientRect(), { newWidth: i, newHeight: a } = Kt(r, s, 120), l = { x: i / 2, y: a / 2 };
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
      u.setAttrs(i.getAttrs()), i.destroy(), r.add(u), l && l.moveToTop(), r.getLayer()?.batchDraw(), r.fire(on);
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
function Bo({
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
  const f = 4, m = 4, g = (20 - f * 2) / (m + 1);
  for (let y = 1; y <= m; y++) {
    const b = e + f + y * g, S = new M.Line({
      points: [
        n + 3,
        b,
        n + 18 - (y === 1 ? 7 : 4),
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
class _s extends Ee {
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
    const i = Bo({ x: r, y: s, fill: t });
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
function Wo(n) {
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
class Os {
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
    const a = De.find((p) => p.pdfjsAnnotationType === i.pdfjsType), l = this.canTransform(i), u = Wo(l), d = new M.Transformer({
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
      boundBoxFunc: (p, f) => (f.width = Math.max(30, f.width), f)
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
        const p = d.nodes().map((m) => m.getClientRect()), f = this.getTotalBox(p);
        d.nodes().forEach((m) => {
          const g = m.getAbsolutePosition(), y = f.x - g.x, b = f.y - g.y, S = f.width / 2, w = f.height / 2, C = { ...g };
          f.x + S < 0 && (C.x = -y - S), f.y + w < 0 && (C.y = -b - w), f.x + S > t.width() && (C.x = t.width() - S - y), f.y + w > t.height() && (C.y = t.height() - w - b), m.setAbsolutePosition(C);
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
    document.body.classList.toggle(As, e);
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
const se = ti((n, e) => ({
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
      return t.forEach((f, m) => {
        const g = p.get(m);
        !g || g.referenceNumber === f || (p.set(m, { ...g, referenceNumber: f }), h = !0);
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
}));
class Hs {
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
      const o = e.getRangeAt(0).commonAncestorContainer;
      if (this.root?.contains(o)) {
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
      const a = i.closest("[data-inklayer-positioned-text-page]")?.getAttribute("data-inklayer-positioned-text-page") ?? i.closest(".page")?.getAttribute("data-page-number") ?? "-1";
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
    this.destroy(), this.root = e, this.highlighterObj = new ni({
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
      r.annotationType === oe.TEXT && r.inReplyTo === e.id && o.push({
        id: r.id,
        title: r.titleObj.str,
        date: r.modificationDate,
        content: r.contentsObj.str
      });
    }), o;
  }
}
class Gs extends Xe {
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
class Us extends Xe {
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
class pn extends Xe {
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
      [oe.HIGHLIGHT]: R.HIGHLIGHT,
      [oe.UNDERLINE]: R.UNDERLINE,
      [oe.STRIKEOUT]: R.STRIKEOUT
    }[e.annotationType] || R.HIGHLIGHT, i = new M.Group({
      draggable: !1,
      name: _e,
      id: e.id
    }), a = (u) => {
      const { x: d, y: h, width: p, height: f } = this.convertQuadPoints(u, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
      switch (e.annotationType) {
        case oe.HIGHLIGHT:
          return this.createHighlightShape(d, h, p, f, o);
        case oe.UNDERLINE:
          return this.createUnderlineShape(d, h, p, f, o);
        case oe.STRIKEOUT:
          return this.createStrikeoutShape(d, h, p, f, o);
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
class zs extends Xe {
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
class Fs extends Xe {
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
class js extends Xe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const o = Ke(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, s = new M.Group({
      draggable: !1,
      name: _e,
      id: e.id
    }), i = (f, m) => new M.Line({
      strokeScaleEnabled: !1,
      stroke: o,
      strokeWidth: r,
      hitStrokeWidth: 20,
      dash: e.borderStyle.style === 2 ? e.borderStyle.dashArray : [],
      globalCompositeOperation: "source-over",
      points: f
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
class Bs extends Xe {
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
        const { x: p, y: f } = this.convertPoint(h, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
        d.push(p), d.push(f);
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
class Ws extends Xe {
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
        const { x: p, y: f } = this.convertPoint(h, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
        d.push(p), d.push(f);
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
class Vs extends Xe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    if (e.inReplyTo) return null;
    const o = Ke(e.color || [0, 0, 0]), { x: r, y: s } = this.convertRect(e.rect, e.pageViewer.viewport.scale, e.pageViewer.viewport.height), i = new M.Group({
      draggable: !1,
      name: _e,
      id: e.id
    }), a = Bo({ x: r, y: s, fill: o });
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
function kn(n, e = 15) {
  if (n.length < 2) return "";
  const t = e * 1.3, o = n.reduce(
    (s, i) => ({ x: s.x + i.x, y: s.y + i.y }),
    { x: 0, y: 0 }
  );
  o.x /= n.length, o.y /= n.length;
  let r = "";
  for (let s = 0; s < n.length - 1; s++) {
    const i = n[s], a = n[s + 1], l = a.x - i.x, u = a.y - i.y, d = Math.hypot(l, u), h = Math.atan2(u, l), p = Math.cos(h + Math.PI / 2), f = Math.sin(h + Math.PI / 2), m = (i.x + a.x) / 2, g = (i.y + a.y) / 2, y = o.x - m, b = o.y - g, S = p * y + f * b > 0 ? -1 : 1, w = Math.max(2, Math.floor(d / t));
    for (let C = 0; C < w; C++) {
      const E = C / w, I = (C + 1) / w, H = i.x + l * E, B = i.y + u * E, W = i.x + l * I, D = i.y + u * I, k = (H + W) / 2 + p * e * S, L = (B + D) / 2 + f * e * S;
      s === 0 && C === 0 && (r += `M ${H} ${B} `), r += `Q ${k} ${L} ${W} ${D} `;
    }
  }
  return r;
}
class $s extends Xe {
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
    }), a = "inkLists" in e ? s.map((d, h) => `${h === 0 ? "M" : "L"} ${d.x} ${d.y}`).join(" ") : kn([...s, s[0]]), l = new M.Path({
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
function Kn(n, e) {
  return Math.hypot(e.x - n.x, e.y - n.y);
}
class Ys extends Xe {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const o = e.inkLists?.[0] ?? [];
    if (o.length < 2) return null;
    const r = o.map((f) => this.convertPoint(
      f,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    )), s = r[0], i = r[1], a = r[3], l = r[4], u = a && l ? { x: (a.x + l.x) / 2, y: (a.y + l.y) / 2 } : void 0, d = Ke(e.color || [0, 0, 0]), h = new M.Group({ draggable: !1, name: _e, id: e.id });
    h.add(new M.Arrow({
      points: [s.x, s.y, i.x, i.y],
      stroke: d,
      fill: d,
      strokeWidth: e.borderStyle.width || 1,
      opacity: this.inkLayerMetadata?.opacity ?? 1,
      pointerLength: u ? Kn(i, u) : 10,
      pointerWidth: a && l ? Kn(a, l) : 10,
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
      pdfjsType: oe.LINE,
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
class Ks extends Xe {
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
const Xs = "pdfjs_internal_editor_";
class qs {
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
      const o = await Dn.load(await t.getData());
      o.getPages().forEach((r) => {
        r.node.lookupMaybe(F.of("Annots"), To)?.asArray().forEach((i) => {
          const a = o.context.lookupMaybe(i, wn), l = a?.get(F.of("Subtype"))?.toString(), u = a?.lookupMaybe(F.of("BE"), wn), d = l === "/Polygon" && (u?.get(F.of("S"))?.toString() === "/C" || a?.get(F.of("IT"))?.toString() === "/PolygonCloud"), h = a?.get(F.of("InkLayerType"))?.toString().slice(1);
          if (!d && !(h === "Cloud" && l === "/Ink" || h === "FreeText" && l === "/Text" || h === "Arrow" && l === "/Ink")) return;
          const f = a?.get(F.of("NM")), m = f ? o.context.lookup(f) : void 0, g = m instanceof re || m instanceof xo ? m.decodeText() : i instanceof qr ? `${i.objectNumber}R` : void 0;
          if (!g) return;
          const y = d ? "Cloud" : h;
          if (y !== "Cloud" && y !== "FreeText" && y !== "Arrow") return;
          const b = a?.lookupMaybe(F.of("InkLayerFontSize"), ee)?.asNumber(), S = a?.lookupMaybe(F.of("InkLayerTextWidth"), ee)?.asNumber(), w = a?.lookupMaybe(F.of("CA"), ee)?.asNumber();
          e.set(g, { type: y, fontSize: b, textWidth: S, opacity: w });
        });
      });
    } catch (o) {
      console.warn("InkLayer could not inspect PDF annotation metadata.", o);
    }
    return e;
  }
  decodeAnnotation(e, t, o) {
    const r = {
      [oe.CIRCLE]: Gs,
      [oe.FREETEXT]: Us,
      [oe.HIGHLIGHT]: pn,
      [oe.UNDERLINE]: pn,
      [oe.STRIKEOUT]: pn,
      [oe.SQUARE]: zs,
      [oe.INK]: Fs,
      [oe.LINE]: js,
      [oe.POLYGON]: Bs,
      [oe.POLYLINE]: Ws,
      [oe.TEXT]: Vs
    }, s = o.get(e.id);
    let i = r[e.annotationType];
    return s?.type === "Cloud" && (e.annotationType === oe.POLYGON || e.annotationType === oe.INK) && (i = $s), s?.type === "FreeText" && e.annotationType === oe.TEXT && (i = Ks), s?.type === "Arrow" && e.annotationType === oe.INK && (i = Ys), i ? new i({
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
    this.pdfViewerApplication?.pdfDocument?.annotationStorage?.setValue(`${Xs}${e.id}`, {
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
class Js extends Ee {
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
class Zs extends Ee {
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
        const e = [...this.points, this.points[0]], t = kn(e);
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
    const o = kn(t);
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
const Qs = {
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
}, ea = {
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
}, ta = {
  Highlight: "highlight",
  Underline: "underline",
  Squiggly: "squiggly",
  StrikeOut: "strikeout"
}, na = {
  highlight: "Highlight",
  underline: "Underline",
  squiggly: "Squiggly",
  strikeout: "StrikeOut"
}, oa = {
  Square: "rect",
  Circle: "ellipse",
  Polygon: "polygon",
  PolyLine: "polygon",
  Cloud: "cloud"
};
function _t(n) {
  const e = Qs[n.type] || "note", t = ra(n), o = {
    pageIndex: n.pageNumber - 1,
    // 转换为 0-based
    geometry: t,
    coordinateSystem: "pdf-user-space"
  }, r = ia(n, e), s = {
    strokeColor: n.color || void 0,
    fillColor: n.color ? sa(n.color, 0.3) : void 0,
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
        type: oe[n.pdfjsType],
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
function ra(n) {
  const e = ea[n.type] || "rect", { x: t, y: o, width: r, height: s } = n.konvaClientRect;
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
function ia(n, e) {
  const t = n.subtype;
  switch (e) {
    case "text-markup":
      return {
        kind: "text-markup",
        variant: ta[t] || "highlight",
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
        shape: n.type === R.CLOUD ? "cloud" : oa[t] || "rect"
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
function sa(n, e) {
  if (n.startsWith("rgba")) return n;
  if (n.startsWith("#")) {
    const t = n.slice(1), o = parseInt(t.slice(0, 2), 16), r = parseInt(t.slice(2, 4), 16), s = parseInt(t.slice(4, 6), 16);
    return `rgba(${o}, ${r}, ${s}, ${e})`;
  }
  return n;
}
function aa(n) {
  const e = n.kind, t = n.extensions, o = t?.legacy, r = t?.konva, s = n.target.geometry, i = t?.pdfjs?.subtype || ua(e, n.payload), a = da(t?.pdfjs?.type) ?? la(e, n.payload), l = o?.annotationType ?? (e === "shape" && i === "PolyLine" ? R.CLOUD : ca(e, n.payload));
  return {
    id: n.id,
    referenceNumber: n.meta?.referenceNumber,
    pageNumber: n.target.pageIndex + 1,
    // 转换回 1-based
    konvaString: r?.serialized || "",
    konvaClientRect: r?.clientRect || ga(s),
    title: o?.title || ha(n.payload),
    type: l,
    color: n.appearance?.strokeColor || null,
    subtype: i,
    pdfjsType: a,
    date: n.meta?.createdAt || null,
    contentsObj: o?.contentsObj || pa(n.payload),
    comments: o?.comments || [],
    user: fa(n.meta),
    native: n.meta?.isNative || !1
  };
}
function ca(n, e) {
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
function la(n, e) {
  if (n === "shape" && e?.kind === "shape") {
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
  }[n] || oe.NONE;
}
function da(n) {
  if (!n) return;
  const e = oe[n];
  return typeof e == "number" ? e : void 0;
}
function ua(n, e) {
  if (!e) return "None";
  switch (n) {
    case "text-markup":
      return e.kind !== "text-markup" ? "Highlight" : na[e.variant];
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
function ha(n) {
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
function pa(n) {
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
function fa(n) {
  return n?.authorId ? typeof n.authorId == "string" ? { id: n.authorId, name: n.authorId } : {
    id: n.authorId.id,
    name: n.authorId.name || n.authorId.id
  } : { id: "unknown", name: "Unknown" };
}
function ga(n) {
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
function Vo(n) {
  return n.map((e) => aa(e));
}
function $o(n) {
  return !!(n?.id && n.id !== "null");
}
function Xn(n, e) {
  return $o(n) && !!e?.id && n.id === e?.id;
}
class ma {
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
        return $o(t);
      case "annotation.transform":
      case "annotation.edit":
      case "annotation.delete":
      case "annotation.change-status":
        return Xn(t, o?.user);
      case "comment.edit":
      case "comment.delete":
        return Xn(t, r?.user);
    }
  }
}
function mt(n) {
  return typeof n == "number" && Number.isSafeInteger(n) && n > 0;
}
function va(n) {
  const e = /^D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(?:([Zz])|([+-])(\d{2})'?(\d{2})?'?)?$/.exec(n);
  if (!e) return null;
  const [, t, o, r, s, i, a, l, u, d, h] = e, p = Number(t), f = Number(o), m = Number(r), g = Number(s), y = Number(i), b = Number(a);
  if (f < 1 || f > 12 || m < 1 || m > 31 || g > 23 || y > 59 || b > 59 || Number(d || 0) > 23 || Number(h || 0) > 59)
    return null;
  const S = Date.UTC(
    p,
    f - 1,
    m,
    g,
    y,
    b
  );
  if (!Number.isFinite(S)) return null;
  const w = new Date(S);
  if (w.getUTCFullYear() !== p || w.getUTCMonth() !== f - 1 || w.getUTCDate() !== m)
    return null;
  if (l || !u) return S;
  const C = (Number(d) * 60 + Number(h || 0)) * 60 * 1e3;
  return S - (u === "+" ? C : -C);
}
function qn(n) {
  if (!n) return null;
  const e = va(n);
  if (e !== null) return e;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/.test(n))
    return null;
  const t = Date.parse(n);
  return Number.isFinite(t) ? t : null;
}
function ya(n, e) {
  const t = qn(n.date), o = qn(e.date);
  return t !== null && o !== null && t !== o ? t - o : t !== null && o === null ? -1 : t === null && o !== null ? 1 : n.pageNumber !== e.pageNumber ? n.pageNumber - e.pageNumber : n.id < e.id ? -1 : n.id > e.id ? 1 : 0;
}
function Xt(n) {
  let e = 0;
  for (const t of n)
    mt(t.referenceNumber) && t.referenceNumber > e && (e = t.referenceNumber);
  return e;
}
function En(n) {
  if (n >= Number.MAX_SAFE_INTEGER)
    throw new RangeError("Annotation reference number limit reached.");
  return n + 1;
}
function Jn(n) {
  const e = [...n].sort(ya), t = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map(), r = [];
  e.forEach((i) => {
    const a = i.referenceNumber;
    mt(a) && !t.has(a) ? (t.add(a), o.set(i.id, a)) : r.push(i);
  });
  let s = r.length > 0 ? En(Xt(e)) : 1;
  return r.forEach((i, a) => {
    o.set(i.id, s), a < r.length - 1 && (s = En(s));
  }), n.map((i) => {
    const a = o.get(i.id);
    return i.referenceNumber === a ? i : { ...i, referenceNumber: a };
  });
}
function ba(n, e, t = 1) {
  const o = Array.from(e), r = /* @__PURE__ */ new Set();
  for (const i of o)
    mt(i.referenceNumber) && r.add(i.referenceNumber);
  if (mt(n.referenceNumber) && !r.has(n.referenceNumber))
    return n;
  const s = Math.max(
    En(Xt(o)),
    t
  );
  if (!mt(s))
    throw new RangeError("Annotation reference number limit reached.");
  return { ...n, referenceNumber: s };
}
const Yo = 4;
function Ko(n) {
  const e = n.user?.name?.trim();
  return e || n.title?.trim() || null;
}
function Sa(n) {
  const e = Ko(n), t = mt(n.referenceNumber);
  return t && e ? `#${n.referenceNumber} · ${e}` : t ? `#${n.referenceNumber}` : e;
}
function wa({
  selectionRect: n,
  labelWidth: e,
  labelHeight: t,
  stageWidth: o,
  stageHeight: r,
  gap: s = Yo
}) {
  const i = Math.max(0, o - e), a = Math.max(0, r - t), l = Math.max(0, Math.min(i, n.x + n.width - e)), u = n.y - t - s, d = n.y + n.height + s, h = u >= 0 ? u : Math.max(0, Math.min(a, d));
  return { x: l, y: h };
}
function Ca(n, e, t) {
  return n.x < e.x + e.width + t && n.x + n.width + t > e.x && n.y < e.y + e.height + t && n.y + n.height + t > e.y;
}
function xa(n, e, t = Yo) {
  const o = /* @__PURE__ */ new Map(), r = [];
  return [...n].sort(
    (i, a) => i.y - a.y || i.x - a.x || i.id.localeCompare(a.id)
  ).forEach((i) => {
    const a = Math.max(0, e - i.height), l = Math.max(1, i.height + t), u = Math.ceil(e / l) + 1;
    let d = { ...i, y: Math.max(0, Math.min(a, i.y)) };
    for (let h = 0; h <= u; h += 1) {
      const f = (h === 0 ? [0] : [h * l, -h * l]).map((m) => ({ ...i, y: i.y + m })).find((m) => m.y >= 0 && m.y <= a && r.every((g) => !Ca(m, g, t)));
      if (f) {
        d = f;
        break;
      }
    }
    r.push(d), o.set(d.id, { x: d.x, y: d.y });
  }), o;
}
function Ta() {
  return navigator.userAgentData?.platform || navigator.platform || navigator.userAgent;
}
function Zn(n, e) {
  return e ? n.key === "Meta" : n.key === "Alt";
}
class Aa {
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
    this.primaryColor = e, this.allVisible = t, this.getAnnotationsByPage = o, this.getAnnotationGroup = r, this.canTransform = s, this.isMac = /mac/i.test(Ta()), window.addEventListener("keydown", this.handleKeyDown), window.addEventListener("keyup", this.handleKeyUp), window.addEventListener("blur", this.clearShortcutReveal), document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }
  registerPage(e, t, o) {
    this.unregisterPage(e);
    const r = document.createElement("div");
    r.className = Cs, r.setAttribute("aria-hidden", "true"), t.appendChild(r), this.pages.set(e, { stage: o, layer: r, labels: /* @__PURE__ */ new Map() }), this.refreshPage(e);
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
    const r = Sa(t), s = this.getAnnotationGroup(t, e.stage);
    if (!r || !s)
      return this.unbindGroup(t.id), e.labels.get(t.id)?.remove(), e.labels.delete(t.id), null;
    this.bindGroup(t.id, s);
    let i = e.labels.get(t.id);
    i || (i = document.createElement("div"), i.className = xs, i.dataset.annotationId = t.id, e.layer.appendChild(i), e.labels.set(t.id, i)), i.textContent !== r && (i.textContent = r), i.style.backgroundColor = this.primaryColor, i.style.opacity = String(Wo(this.canTransform(t)).authorLabelOpacity);
    const a = this.shouldRevealAll() || t.id === this.selectedId || t.id === this.hoveredId;
    return i.style.display = a ? "block" : "none", a ? (o && this.positionLabel(e, i, s), { id: t.id, label: i, group: s }) : null;
  }
  getLabelPosition(e, t, o) {
    const r = o.getClientRect(), s = 2;
    return wa({
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
    })), r = xa(o, e.stage.height());
    t.forEach(({ id: s, label: i }) => {
      const a = r.get(s);
      a && (i.style.transform = `translate3d(${a.x}px, ${a.y}px, 0)`);
    });
  }
  bindGroup(e, t) {
    const o = this.boundGroups.get(e);
    o !== t && (o?.off(".annotationAuthorLabels"), t.on(
      `dragmove.annotationAuthorLabels transform.annotationAuthorLabels ${on}.annotationAuthorLabels`,
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
    if (!Zn(e, this.isMac)) return;
    const t = this.shouldRevealAll();
    this.pressedRevealKeys.add(e.code || e.key), t !== this.shouldRevealAll() && this.refreshAll();
  };
  handleKeyUp = (e) => {
    if (!Zn(e, this.isMac)) return;
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
const Qn = Object.freeze({
  annotationId: null,
  source: null
});
class ka {
  entries = /* @__PURE__ */ new Map();
  listeners = /* @__PURE__ */ new Set();
  sequence = 0;
  snapshot = Qn;
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
    this.snapshot.annotationId === o && this.snapshot.source === e || (this.snapshot = o === null ? Qn : { annotationId: o, source: e }, this.listeners.forEach((r) => r(this.snapshot)));
  }
}
class Ea {
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
      name: Ts,
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
      `dragmove.annotationHoverPreview transform.annotationHoverPreview ${on}.annotationHoverPreview`,
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
class Ra {
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
const fn = 8e3;
function Xo(n) {
  return typeof structuredClone == "function" ? structuredClone(n) : JSON.parse(JSON.stringify(n));
}
function gn(n) {
  return Xo(n);
}
function eo(n) {
  return Xo(n);
}
class Pa {
  entries = [];
  snapshot = null;
  listeners = /* @__PURE__ */ new Set();
  timer = null;
  remainingMs = fn;
  paused = !1;
  subscribe(e) {
    return this.listeners.add(e), () => this.listeners.delete(e);
  }
  getSnapshot() {
    return this.snapshot;
  }
  add(e, t) {
    this.entries.push(t === void 0 ? e : { ...e, historyId: t }), this.remainingMs = fn, this.setSnapshot(Date.now() + this.remainingMs), this.clearTimer(), this.paused || this.scheduleExpiry();
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
    this.clearTimer(), this.entries = [], this.snapshot = null, this.remainingMs = fn, this.paused = !1, e && this.emit();
  }
  clearTimer() {
    this.timer !== null && (clearTimeout(this.timer), this.timer = null);
  }
  emit() {
    this.listeners.forEach((e) => e());
  }
}
class to {
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
function Ia(n) {
  return n == null ? n : typeof structuredClone == "function" ? structuredClone(n) : JSON.parse(JSON.stringify(n));
}
function mn(n) {
  return Object.fromEntries(
    Object.entries(n).map(([e, t]) => [e, Ia(t)])
  );
}
class Na {
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
  annotationHover = new ka();
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
    onTextSelected: a,
    onAnnotationAdd: l,
    onAnnotationDelete: u,
    onAnnotationSelected: d,
    onAnnotationChanging: h,
    onAnnotationChanged: p
  }) {
    this.primaryColor = e, this.defaultOptions = t, this.currentUser = o, this.annotationPermissions = r, this.permissionController = new ma({
      getCurrentUser: () => this.currentUser,
      getPermissions: () => this.annotationPermissions
    }), this.deleteUndoController = new Pa(), this.mutationHistory = new to(), this.authorLabels = new Aa({
      primaryColor: this.primaryColor,
      defaultVisible: s,
      getAnnotationsByPage: (f) => se.getState().getByPage(f),
      getAnnotationGroup: (f, m) => m.findOne((g) => g.getType() === "Group" && g.id() === f.id),
      canTransform: (f) => this.permissionController.can("annotation.transform", f)
    }), this.hoverPreview = new Ea({
      getAnnotation: (f) => se.getState().getAnnotation(f),
      getStage: (f) => this.konvaCanvasStore.get(f)?.konvaStage,
      getAnnotationGroup: (f, m) => m.findOne((g) => g.getType() === "Group" && g.id() === f.id)
    }), this.unsubscribeAnnotationHover = this.annotationHover.subscribe((f) => {
      this.authorLabels.setHovered(f.annotationId), this.hoverPreview.setHovered(null);
    }), this.pdfViewerApplication = i, this.onTextSelected = a, this.onAnnotationAdd = l, this.onAnnotationDelete = u, this.onAnnotationSelected = d, this.onAnnotationChanging = h, this.onAnnotationChanged = p, this.selector = new Os({
      primaryColor: this.primaryColor,
      // 初始化选择器实例
      konvaCanvasStore: this.konvaCanvasStore,
      getAnnotationStore: (f) => se.getState().getAnnotation(f),
      canTransform: (f) => this.permissionController.can("annotation.transform", f),
      onSelected: (f, m, g) => {
        const y = se.getState().getAnnotation(f);
        if (y) {
          const b = this.nextSelectionSource ?? (m ? et.CANVAS : et.SIDEBAR);
          this.nextSelectionSource = void 0, se.getState().setSelectedAnnotation(y, b), this.onAnnotationSelected(y, m, g);
        }
      },
      onDeselected: () => {
        this.nextSelectionSource = void 0, se.getState().clearSelectedAnnotation(), this.onAnnotationSelected(void 0, !1, { x: 0, y: 0, width: 0, height: 0 });
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
      onChanged: async (f, m, g, y, b) => {
        const w = this.findEditorForGroupId(f) ? this.updateStore(f, { konvaString: m, konvaClientRect: y }, !1, "annotation.transform", void 0, !0, `transform:${f}`) : void 0;
        w && this.onAnnotationChanged(w, b);
      },
      onCancel: () => {
        this.onAnnotationChanging();
      },
      onDelete: (f) => {
        this.delete(f, !0);
      }
    }), this.webSelection = new Hs({
      // 初始化 WebSelection 实例
      onSelect: (f) => {
        this.onTextSelected(f);
      },
      onHighlight: (f) => {
        if (!this.can("annotation.create")) return;
        const m = [];
        this.activeHighlightHistoryEntries = m, Object.keys(f).forEach((g) => {
          const y = Number(g), b = f[g], S = this.konvaCanvasStore.get(y);
          if (S) {
            const { konvaStage: w, wrapper: C } = S;
            let E = this.findEditor(y, this.currentAnnotation.type);
            E || (E = new Vn(
              {
                primaryColor: this.primaryColor,
                defaultOptions: this.defaultOptions,
                currentUser: this.currentUser,
                pdfViewerApplication: this.pdfViewerApplication,
                konvaStage: w,
                pageNumber: y,
                annotation: this.currentAnnotation,
                onAdd: (I) => {
                  this.saveToStore(I, !1, this.activeHighlightHistoryEntries ?? void 0);
                },
                onChange: (I, H) => {
                  this.updateStore(I, H);
                }
              },
              this.currentAnnotation.type
            ), this.editorStore.set(E.id, E)), E.convertTextSelection(b, C);
          }
        }), this.activeHighlightHistoryEntries = null, m.length > 0 && this.recordHistory({
          undo: () => {
            let g = !0;
            return m.slice().reverse().forEach((y) => {
              g = this.deleteAnnotation(y.annotation.id, !0, !1) && g;
            }), g && this.selector.delete(), g;
          },
          redo: () => {
            let g = !0;
            return m.forEach((y) => {
              g = this.restoreDeletedAnnotation(y) && g;
            }), g;
          }
        });
      }
    }), this.passiveHover = new Ra({
      shouldSuppress: () => !!(this.currentAnnotation && !this.currentAnnotation.webSelectionDependencies) || this.webSelection.isRangeSelectionActive(),
      onHoverStart: (f) => {
        this.annotationHover.set("canvas-passive", f);
      },
      onHoverEnd: (f) => {
        this.annotationHover.clear("canvas-passive", f);
      }
    }), this.transform = new qs(i), this.bindGlobalEvents();
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
    this.currentAnnotation = e, se.getState().setCurrentAnnotationType(e);
  }
  ensureMutationHistory() {
    return this.mutationHistory || (this.mutationHistory = new to()), this.mutationHistory;
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
    return !!this.updateStore(e, mn(t), !0, null, void 0, !1);
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
    e.code === "Escape" && (this.currentAnnotation?.type === R.SIGNATURE || this.currentAnnotation?.type === R.STAMP) && (un(Lt), this.setDefaultMode());
  };
  /**
   * 创建绘图容器 (painterWrapper)
   * @param pageView - 当前 PDF 页面视图
   * @param pageNumber - 当前页码
   * @returns 绘图容器元素
   */
  createPainterWrapper(e, t) {
    const o = document.createElement("div");
    return o.id = `${Tn}_page_${t}`, o.classList.add(Tn), e.div.appendChild(o), o;
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
      ws(e.wrapper) || this.disposeCanvas(e.pageNumber);
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
    document.body.classList.toggle(`${Wn}`, t), Object.values(R).filter((r) => typeof r == "number").map((r) => `${hn}_${r}`).forEach((r) => document.body.classList.remove(r)), un(Lt), this.currentAnnotation && document.body.classList.add(`${hn}_${this.currentAnnotation?.type}`);
  }
  /**
   * 保存到存储
   */
  saveToStore(e, t = !1, o) {
    if (!t && !this.can("annotation.create")) return;
    const r = t ? e : ba(
      e,
      se.getState().annotations.values(),
      this.nextAnnotationReferenceNumber
    );
    t || (this.nextAnnotationReferenceNumber = r.referenceNumber + 1);
    const s = De.find((a) => a.pdfjsAnnotationType === r.pdfjsType);
    if (se.getState().addAnnotation(r, t), this.authorLabels.refreshAnnotation(r.id), t) return;
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
    const l = se.getState().getAnnotation(e);
    if (!l || r && !this.can(r, l, s)) return;
    const u = i ? mn(
      Object.fromEntries(
        Object.keys(t).map((h) => [h, l[h]])
      )
    ) : null, d = se.getState().updateAnnotation(e, t);
    if (d && this.authorLabels.refreshAnnotation(e), d && o && this.onAnnotationChanged(d), d && u) {
      const h = mn(
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
      if (r instanceof $n) {
        r.activateWithSignature(e, o, this.tempDataTransfer);
        return;
      }
      if (r instanceof Yn) {
        r.activateWithStamp(e, o, this.tempDataTransfer);
        return;
      }
      r.activate(e, o);
      return;
    }
    let s = null;
    switch (o.type) {
      case R.FREETEXT:
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
      case R.RECTANGLE:
        s = new Ls({
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
        s = new Js({
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
        s = new Zs({
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
        s = new ks({
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
        s = new _s({
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
        s = new Es({
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
        s = new Rs({
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
        s = new $n(
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
            onChange: () => {
            }
          },
          this.tempDataTransfer
        );
        break;
      case R.HIGHLIGHT:
      case R.UNDERLINE:
      case R.STRIKEOUT:
        s = new Vn(
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
  deleteAnnotation(e, t = !1, o = !0) {
    const r = se.getState().getAnnotation(e);
    if (!r || o && !this.can("annotation.delete", r)) return !1;
    this.annotationHover.clearAnnotation(e), se.getState().removeAnnotation(e), this.authorLabels.remove(e);
    const s = this.findEditor(r.pageNumber, r.type), i = this.konvaCanvasStore.get(r.pageNumber);
    return s && i && s.deleteGroup(e, i.konvaStage), t && this.onAnnotationDelete(e), !0;
  }
  createDeletedAnnotationEntry(e) {
    const t = Array.from(se.getState().annotations.keys()), r = this.konvaCanvasStore?.get(e.pageNumber)?.konvaStage?.findOne((s) => s.getType() === "Group" && s.name() === _e && s.id() === e.id);
    return {
      kind: "annotation",
      annotation: gn(e),
      storeIndex: Math.max(0, t.indexOf(e.id)),
      konvaIndex: r?.zIndex() ?? null
    };
  }
  restoreDeletedAnnotation(e) {
    const t = gn(e.annotation);
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
    const t = se.getState().getAnnotation(e.annotationId);
    if (!t || t.comments.some((s) => s.id === e.comment.id)) return !1;
    const o = [...t.comments], r = Math.max(0, Math.min(e.commentIndex, o.length));
    return o.splice(r, 0, eo(e.comment)), !!this.updateStore(t.id, { comments: o }, !0, null);
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
    const o = Jn(e);
    if (this.nextAnnotationReferenceNumber = Math.min(
      Xt(o) + 1,
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
    const r = se.getState(), s = Jn(
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
    this.disablePainting(), this.clearHistory(), this.editorStore.forEach((o) => {
      o.shapeGroupStore.forEach((r) => r.konvaGroup.destroy());
    }), this.editorStore.clear(), se.getState().clearAnnotations(), await this.initAnnotationsOnce(e, t), this.konvaCanvasStore.forEach(({ pageNumber: o }) => this.reDrawAnnotation(o));
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
    const o = se.getState().getAnnotation(e);
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
    const o = se.getState().getAnnotation(e);
    if (!o || !o.comments.some((s) => s.id === t)) return !1;
    const r = o.comments.filter((s) => s.id !== t);
    return !!this.updateStore(e, { comments: r }, !0, null, void 0, !1);
  }
  deleteComment(e, t) {
    const o = se.getState().getAnnotation(e), r = o?.comments.findIndex((d) => d.id === t) ?? -1;
    if (!o || r < 0) return !1;
    const s = o.comments[r];
    if (!this.can("comment.delete", o, s)) return !1;
    const i = {
      kind: "comment",
      annotationId: e,
      annotationReferenceNumber: o.referenceNumber,
      previewAnnotation: gn(o),
      comment: eo(s),
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
    return Array.from(se.getState().annotations.values());
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
    }), this.konvaCanvasStore.clear(), this.editorStore.clear(), this.selector.delete(), this.clearTempDataTransfer(), this.currentAnnotation = null, document.body.classList.remove(`${Wn}`), Object.values(R).filter((t) => typeof t == "number").map((t) => `${hn}_${t}`).forEach((t) => document.body.classList.remove(t)), un(Lt);
  }
}
const qo = en(void 0), ot = () => {
  const n = Ht(qo);
  if (n === void 0)
    throw new Error("usePainter must be used within a PainterProvider");
  return n;
}, Ma = {
  placement: "bottom",
  middleware: [Ao()]
}, Jo = tn(function(e, t) {
  const {
    buttons: o,
    renderButtons: r,
    positionOptions: s = Ma,
    visible: i,
    onVisibleChange: a,
    children: l
  } = e, u = i !== void 0, [d, h] = Y(!1), p = u ? i : d, f = X((D) => {
    u ? a?.(D) : h(D);
  }, [u, a]), [m, g] = Y(null), y = j(null), b = j(null), S = j(null), w = X(() => {
    f(!1), b.current = null, S.current = null;
  }, [f]), C = X((D) => {
    if (b.current = D, S.current = null, !D) {
      w();
      return;
    }
    f(!0);
    const k = D.getBoundingClientRect();
    let L = k;
    if (k.top < 0 || k.left < 0) {
      const G = window.getSelection();
      if (G && G.rangeCount > 0) {
        const O = G.focusNode, N = G.anchorNode;
        if (O && N) {
          const Z = document.createRange(), q = document.createRange();
          G.anchorOffset <= G.focusOffset ? (Z.setStart(G.anchorNode, G.anchorOffset), Z.setEnd(G.anchorNode, Math.min(G.anchorOffset + 1, G.anchorNode.textContent?.length || 0)), q.setStart(G.focusNode, Math.max(G.focusOffset - 1, 0)), q.setEnd(G.focusNode, G.focusOffset)) : (Z.setStart(G.focusNode, G.focusOffset), Z.setEnd(G.focusNode, Math.min(G.focusOffset + 1, G.focusNode.textContent?.length || 0)), q.setStart(G.anchorNode, Math.max(G.anchorOffset - 1, 0)), q.setEnd(G.anchorNode, G.anchorOffset));
          const A = Z.getBoundingClientRect(), U = q.getBoundingClientRect();
          L = {
            top: Math.max(0, Math.min(A.top, U.top)),
            left: Math.max(0, Math.min(A.left, U.left)),
            bottom: Math.max(A.bottom, U.bottom),
            right: Math.max(A.right, U.right),
            width: Math.abs(U.right - A.left),
            height: Math.max(A.height, U.height),
            x: Math.max(0, Math.min(A.x, U.x)),
            y: Math.max(0, Math.min(A.y, U.y)),
            toJSON: k.toJSON
          };
        }
      }
    }
    const $ = {
      getBoundingClientRect: () => L
    };
    requestAnimationFrame(() => {
      y.current && Wt($, y.current, s).then(({ x: G, y: O }) => {
        y.current && Object.assign(y.current.style, {
          left: `${G}px`,
          top: `${O}px`
        });
      }).catch((G) => {
        console.warn("Failed to compute popover position:", G);
      });
    });
  }, [w, s, f]), E = ke(() => (r ? r({ range: b.current, rect: S.current, close: w }) : o || []).map((k) => /* @__PURE__ */ T(
    be,
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
  )), [o, w, r]), I = E.length > 0 || !!l;
  ne(() => {
    if (!I) {
      p && S.current && m === null && g(S.current);
      return;
    }
    p && y.current && m && (Wt({
      getBoundingClientRect: () => m
    }, y.current, s).then(({ x: k, y: L }) => {
      y.current && Object.assign(y.current.style, {
        left: `${k}px`,
        top: `${L}px`
      });
    }).catch((k) => {
      console.warn("Failed to compute popover position:", k);
    }), g(null));
  }, [I, p, m, s]);
  const H = X((D) => {
    if (b.current = null, S.current = D, y.current || g(D), f(!0), y.current) {
      const k = {
        getBoundingClientRect: () => D
      };
      requestAnimationFrame(() => {
        y.current && Wt(k, y.current, s).then(({ x: L, y: $ }) => {
          y.current && Object.assign(y.current.style, {
            left: `${L}px`,
            top: `${$}px`
          });
        }).catch((L) => {
          console.warn("Failed to compute popover position:", L);
        });
      });
    }
  }, [s, f]);
  Nn(t, () => ({
    open: C,
    openWithRect: H,
    close: w
  }), [C, H, w]);
  const { appearance: B } = nn(), W = {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 999,
    display: p ? "block" : "none",
    width: "max-content",
    backgroundColor: B === "light" ? "#fff" : "#242430",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: 4,
    padding: "2px"
  };
  return I ? /* @__PURE__ */ c(
    "div",
    {
      ref: y,
      style: W,
      children: l || /* @__PURE__ */ c(Q, { gap: "1", align: "center", children: E })
    }
  ) : null;
}), Da = tn(function(e, t) {
  const { t: o } = ve(["annotator"], { useSuspense: !1 }), {
    popoverBarProps: r = {}
  } = e, s = Pt.useRef(null), { painter: i } = ot();
  return Nn(t, () => ({
    open: (a) => {
      s.current?.open(a);
    },
    close: () => {
      s.current?.close();
    }
  }), []), /* @__PURE__ */ c(
    Jo,
    {
      ref: s,
      renderButtons: () => [
        {
          key: "highlight",
          icon: /* @__PURE__ */ c(_o, {}),
          onClick: (a) => {
            const l = De.find((u) => u.name === "highlight");
            i?.highlightRange(a, l), s.current?.close();
          },
          title: o("annotator:tool.highlight")
        },
        {
          key: "underline",
          icon: /* @__PURE__ */ c(Ho, {}),
          onClick: (a) => {
            const l = De.find((u) => u.name === "underline");
            i?.highlightRange(a, l), s.current?.close();
          },
          title: o("annotator:tool.underline")
        },
        {
          key: "strikeout",
          icon: /* @__PURE__ */ c(Oo, {}),
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
}), Zo = en(null), It = () => {
  const n = Ht(Zo);
  if (!n)
    throw new Error("useOptionsContext must be used within a OptionsProvider");
  return n;
}, La = "_ColorPicker_18032_1", _a = "_cell_18032_1", Oa = "_active_18032_21", vn = {
  ColorPicker: La,
  cell: _a,
  active: Oa
};
function Qo(n, e) {
  if (!Ut(n) || !Ut(e))
    return e !== void 0 ? e : n;
  const t = { ...n }, o = e, r = n;
  return Object.keys(o).forEach((s) => {
    const i = o[s], a = r[s];
    if (Array.isArray(i)) {
      t[s] = i;
      return;
    }
    if (Ut(i) && Ut(a)) {
      t[s] = Qo(a, i);
      return;
    }
    i !== void 0 && (t[s] = i);
  }), t;
}
function Ut(n) {
  return n !== null && typeof n == "object" && Object.prototype.toString.call(n) === "[object Object]";
}
function Ha(n) {
  const e = document.createElement("canvas");
  e.width = e.height = 1;
  const t = e.getContext("2d", { colorSpace: "srgb" });
  if (!t)
    return n;
  t.fillStyle = n, t.fillRect(0, 0, 1, 1);
  const o = t.getImageData(0, 0, 1, 1).data;
  return `rgb(${o[0]}, ${o[1]}, ${o[2]})`;
}
function no() {
  const n = document.getElementById("InkLayer");
  if (n) {
    const t = getComputedStyle(n).getPropertyValue("--accent-9").trim();
    return Ha(t);
  }
  return "#1677ff";
}
function oo(n) {
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
function Ga(n, e) {
  try {
    return oo(n) === oo(e);
  } catch {
    return !1;
  }
}
function Ua(n, e, t = !1) {
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
  const { t: f } = ve("common", { useSuspense: !1 }), [m, g] = Y(n);
  Pt.useEffect(() => {
    g(n);
  }, [n]);
  const y = (w) => {
    g(w), e?.(w);
  }, b = (w) => {
    y(w);
  }, S = () => /* @__PURE__ */ c(lt, { maxWidth: "240px", className: vn.ColorPicker, children: /* @__PURE__ */ c(kr, { size: "2", variant: "ghost", children: /* @__PURE__ */ T(Q, { direction: "column", gap: "3", children: [
    s && /* @__PURE__ */ c(oi, { color: m, onChange: y }),
    /* @__PURE__ */ c(Bt, { columns: "5", gap: "2", children: t?.map((w) => /* @__PURE__ */ c(
      "div",
      {
        className: `${vn.cell} ${Ga(m, w) ? vn.active : ""}`,
        onMouseDown: () => b(w),
        children: /* @__PURE__ */ c("span", { style: { backgroundColor: w } })
      },
      w
    )) }),
    o && /* @__PURE__ */ c(tt, { variant: "ghost", onClick: () => b("transparent"), children: f("transparent") })
  ] }) }) });
  return /* @__PURE__ */ c(ye, { children: r ? /* @__PURE__ */ T(Ae.Root, { open: a, onOpenChange: l, children: [
    /* @__PURE__ */ c(Ae.Trigger, { children: i || /* @__PURE__ */ c(tt, { variant: "outline", color: "gray", children: /* @__PURE__ */ T("svg", { viewBox: "0 0 1024 1024", style: { width: "1em", height: "1em", color: m }, children: [
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
        children: /* @__PURE__ */ c(S, {})
      }
    )
  ] }) : /* @__PURE__ */ c(S, {}) });
};
function za(n) {
  return M.Node.create(n).children[0];
}
const Fa = tn(function(e, t) {
  const { t: o } = ve(["common", "annotator"], { useSuspense: !1 }), { openSidebar: r, activeSidebarPanel: s, viewerContainerRef: i } = Fe(), { painter: a, requestWrite: l } = ot(), { defaultOptions: u } = It(), { popoverBarProps: d = {} } = e, h = j(null), [p, f] = Y(null), [m, g] = Y(2), [y, b] = Y(1), [S, w] = Y(!1), C = j(null), E = X((O, N) => {
    const Z = `${Tn}_page_${O.pageNumber}`, q = i?.current?.querySelector(
      `#${Z} .konvajs-content`
    );
    if (q) {
      const A = q.getBoundingClientRect(), U = N.x + A.left, J = N.y + A.top, P = {
        x: U,
        y: J,
        width: N.width,
        height: N.height,
        top: J,
        left: U,
        right: U + N.width,
        bottom: J + N.height,
        toJSON: () => ({})
      };
      h.current?.openWithRect(P);
    }
  }, [i]);
  Qe(() => {
    const O = C.current;
    !p || !O || E(p, O);
  }, [E, p, S]), Nn(t, () => ({
    open: (O, N) => {
      f(O), C.current = N;
      const Z = za(O.konvaString);
      g(Z.strokeWidth()), b(Z.opacity() * 100), E(O, N);
    },
    close: () => {
      h.current?.close(), f(null), w(!1), C.current = null;
    }
  }));
  const I = p && De.find((O) => O.type === p.type)?.styleEditable, H = !!l, B = !!(p && (a?.can("annotation.comment", p) || H)), W = !!(p && (a?.can("annotation.edit", p) || H)), D = !!(p && (a?.can("annotation.delete", p) || H)), k = async (O, N) => a?.can(O, N) ? N : !l || !await l({ kind: "mutation", action: O, annotationId: N.id }) ? null : se.getState().getAnnotation(N.id) ?? N, L = (O) => {
    !p || !a || k("annotation.edit", p).then((N) => {
      N && a.updateAnnotationStyle(N, O);
    });
  }, $ = () => {
    !p || !a || k("annotation.delete", p).then((O) => {
      O && a.delete(O.id, !0);
    });
  }, G = (O) => {
    if (a?.can("annotation.comment", O)) {
      r("annotator-sidebar-toggle"), se.getState().setSelectedAnnotation(O, et.CANVAS);
      return;
    }
    k("annotation.comment", O).then((N) => {
      N && (r("annotator-sidebar-toggle"), se.getState().setSelectedAnnotation(N, et.CANVAS));
    });
  };
  return /* @__PURE__ */ c(
    Jo,
    {
      ref: h,
      renderButtons: () => p ? [
        ...B && s !== "annotator-sidebar-toggle" ? [
          {
            key: "comment",
            icon: /* @__PURE__ */ c(Go, {}),
            onClick: () => {
              G(p), h.current?.close();
            },
            title: o("comment")
          }
        ] : [],
        ...W && I ? [
          {
            key: "palette",
            icon: /* @__PURE__ */ c(ms, {}),
            onClick: () => {
              w(!S);
            },
            title: o("color")
          }
        ] : [],
        ...D ? [{
          key: "delete",
          icon: /* @__PURE__ */ c(Ss, {}),
          onClick: () => {
            $(), h.current?.close();
          },
          title: o("delete")
        }] : []
      ] : [],
      ...d,
      children: S && p && W && I && /* @__PURE__ */ T("div", { style: { margin: 8 }, children: [
        /* @__PURE__ */ T(
          be,
          {
            size: "2",
            variant: "ghost",
            color: "gray",
            highContrast: !0,
            onMouseDown: (O) => {
              O.preventDefault(), w(!1);
            },
            children: [
              /* @__PURE__ */ c(Nr, {}),
              o("back")
            ]
          }
        ),
        /* @__PURE__ */ c(nt, { my: "2", size: "4" }),
        I?.color && /* @__PURE__ */ c(
          Et,
          {
            value: p.color ?? void 0,
            onChange: (O) => {
              L({ color: O });
            },
            popover: !1,
            custom: !1,
            presets: u.colors
          }
        ),
        (I?.opacity || I?.strokeWidth) && /* @__PURE__ */ T(ye, { children: [
          /* @__PURE__ */ c(nt, { my: "3", size: "4" }),
          /* @__PURE__ */ c(lt, { style: { margin: 8 }, children: /* @__PURE__ */ T(Q, { gap: "3", direction: "column", children: [
            I.strokeWidth && /* @__PURE__ */ T(ye, { children: [
              /* @__PURE__ */ T(ae, { as: "div", size: "2", weight: "bold", children: [
                o("strokeWidth"),
                " (",
                m,
                ")"
              ] }),
              /* @__PURE__ */ c(
                Un,
                {
                  variant: "soft",
                  size: "1",
                  min: 1,
                  max: 20,
                  defaultValue: [m || 1],
                  onValueChange: (O) => {
                    L({ strokeWidth: O[0] }), g(O[0]);
                  }
                }
              )
            ] }),
            I.opacity && /* @__PURE__ */ T(ye, { children: [
              /* @__PURE__ */ T(ae, { as: "div", size: "2", weight: "bold", children: [
                o("opacity"),
                " (",
                y,
                "%)"
              ] }),
              /* @__PURE__ */ c(
                Un,
                {
                  variant: "soft",
                  size: "1",
                  min: 1,
                  max: 100,
                  defaultValue: [y || 100],
                  onValueChange: (O) => {
                    L({ opacity: O[0] / 100 }), b(O[0]);
                  }
                }
              )
            ] })
          ] }) })
        ] })
      ] })
    }
  );
}), ro = 500;
function yn(n) {
  const e = n?.replace(/\s+/g, " ").trim() ?? "";
  return e.length <= ro ? e : `${e.slice(0, ro).trimEnd()}…`;
}
const ja = "_card_ijigf_1", Ba = "_header_ijigf_7", Wa = "_identity_ijigf_15", Va = "_referenceLabel_ijigf_23", $a = "_referenceLabelStatic_ijigf_44", Ya = "_separator_ijigf_50", Ka = "_author_ijigf_54", Xa = "_page_ijigf_61", qa = "_selectedText_ijigf_67", Ja = "_preview_ijigf_68", Za = "_empty_ijigf_69", Qa = "_footer_ijigf_93", ec = "_deletedComments_ijigf_98", tc = "_deletedCommentsTitle_ijigf_105", nc = "_deletedCommentAuthor_ijigf_106", oc = "_deletedCommentsMore_ijigf_107", rc = "_deletedComment_ijigf_98", ic = "_deletedCommentContent_ijigf_117", Me = {
  card: ja,
  header: Ba,
  identity: Wa,
  referenceLabel: Va,
  referenceLabelStatic: $a,
  separator: Ya,
  author: Ka,
  page: Xa,
  selectedText: qa,
  preview: Ja,
  empty: Za,
  footer: Qa,
  deletedComments: ec,
  deletedCommentsTitle: tc,
  deletedCommentAuthor: nc,
  deletedCommentsMore: oc,
  deletedComment: rc,
  deletedCommentContent: ic
}, er = ({
  annotation: n,
  children: e,
  onActivate: t,
  onOpenChange: o,
  previewComments: r = []
}) => {
  const { t: s } = ve("annotator", { useSuspense: !1 }), [i, a] = Y(!1), l = yn(n.contentsObj?.text), u = yn(n.contentsObj?.selectedText), d = r.length > 0, h = !!(l || u || d), p = n.user?.name || n.title, f = n.comments?.length ?? 0, m = n.referenceNumber === void 0 ? n.title : `#${n.referenceNumber}`, g = () => {
    t && (a(!1), t(n.id));
  }, y = (b) => {
    a(b), o?.(b);
  };
  return /* @__PURE__ */ T(
    dn.Root,
    {
      open: i,
      onOpenChange: y,
      openDelay: 350,
      closeDelay: 150,
      children: [
        /* @__PURE__ */ c(dn.Trigger, { children: e }),
        /* @__PURE__ */ T(
          dn.Content,
          {
            align: "center",
            size: "2",
            className: Me.card,
            onClick: (b) => b.stopPropagation(),
            children: [
              /* @__PURE__ */ T("div", { className: Me.header, children: [
                /* @__PURE__ */ T("span", { className: Me.identity, children: [
                  t ? /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      className: Me.referenceLabel,
                      "aria-label": s("comment.reference.open", {
                        value: m
                      }),
                      onClick: g,
                      children: m
                    }
                  ) : /* @__PURE__ */ c("span", { className: Me.referenceLabelStatic, children: m }),
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
                r.slice(0, 3).map((b) => /* @__PURE__ */ T("div", { className: Me.deletedComment, children: [
                  /* @__PURE__ */ c("span", { className: Me.deletedCommentAuthor, children: b.user?.name || b.title }),
                  /* @__PURE__ */ c("p", { className: Me.deletedCommentContent, children: yn(b.content) || s("comment.reference.previewNoContent") })
                ] }, b.id)),
                r.length > 3 ? /* @__PURE__ */ c("div", { className: Me.deletedCommentsMore, children: s("deleteUndo.deletedCommentsMore", {
                  count: r.length - 3
                }) }) : null
              ] }) : null,
              h ? null : /* @__PURE__ */ c("p", { className: Me.empty, children: s("comment.reference.previewNoContent") }),
              f > 0 && !d ? /* @__PURE__ */ c("div", { className: Me.footer, children: s("comment.reference.replyCount", {
                count: f
              }) }) : null
            ]
          }
        )
      ]
    }
  );
}, sc = "_overlay_1ya7e_1", ac = "_snackbar_1ya7e_13", cc = "_content_1ya7e_18", lc = "_message_1ya7e_22", dc = "_reference_1ya7e_29", Mt = {
  overlay: sc,
  snackbar: ac,
  content: cc,
  message: lc,
  reference: dc
}, io = 24, uc = /#(\d+)/g;
function hc(n) {
  const e = n?.replace(/\s+/g, " ").trim() ?? "", t = Array.from(e);
  return t.length <= io ? e : `${t.slice(0, io).join("")}…`;
}
function pc(n) {
  return n.annotationReferenceNumber === void 0 ? "" : ` #${n.annotationReferenceNumber}`;
}
function so(n) {
  return `“${n}”`;
}
function fc(n, e, t) {
  const o = Array.from(new Set(n.map((i) => i.annotationReferenceNumber).filter((i) => i !== void 0))), r = t.startsWith("zh") ? "、" : ", ", s = o.slice(0, 3).map((i) => `#${i}`).join(r);
  return o.length > 3 ? e("annotator:deleteUndo.referencesMore", { references: s }) : s;
}
function gc(n, e, t) {
  if (n.totalCount === 1) {
    const r = n.items[0], s = pc(r), i = hc(r.content);
    if (r.kind === "annotation") {
      if (i)
        return e("annotator:deleteUndo.annotationDeletedDetailed", {
          reference: s,
          detail: so(i)
        });
      const a = De.find((d) => d.type === r.annotationType), l = a ? e(`annotator:tool.${a.name}`) : "", u = l && r.pageNumber ? e("annotator:deleteUndo.typeAndPage", { type: l, page: r.pageNumber }) : l || (r.pageNumber ? e("annotator:deleteUndo.page", { page: r.pageNumber }) : "");
      return u ? e("annotator:deleteUndo.annotationDeletedDetailed", { reference: s, detail: u }) : e("annotator:deleteUndo.annotationDeleted", { reference: s });
    }
    return i ? e("annotator:deleteUndo.commentDeletedDetailed", {
      reference: s,
      detail: so(i)
    }) : r.author ? e("annotator:deleteUndo.commentDeletedByAuthor", { reference: s, author: r.author }) : e("annotator:deleteUndo.commentDeleted", { reference: s });
  }
  const o = fc(n.items, e, t);
  return n.annotationCount === n.totalCount ? o ? e("annotator:deleteUndo.annotationsDeletedDetailed", { count: n.totalCount, references: o }) : e("annotator:deleteUndo.annotationsDeleted", { count: n.totalCount }) : n.commentCount === n.totalCount ? o ? e("annotator:deleteUndo.commentsDeletedDetailed", { count: n.totalCount, references: o }) : e("annotator:deleteUndo.commentsDeleted", { count: n.totalCount }) : o ? e("annotator:deleteUndo.itemsDeletedDetailed", { count: n.totalCount, references: o }) : e("annotator:deleteUndo.itemsDeleted", { count: n.totalCount });
}
function mc(n, e) {
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
  for (const s of n.matchAll(uc)) {
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
function vc() {
  const { painter: n } = ot(), { t: e, i18n: t } = ve(["common", "annotator"], { useSuspense: !1 }), o = j(null), r = j(!1), s = j(!1), i = j(/* @__PURE__ */ new Set()), a = X(
    (f) => n?.subscribeDeleteUndo(f) ?? (() => {
    }),
    [n]
  ), l = X(
    () => n?.getDeleteUndoSnapshot() ?? null,
    [n]
  ), u = hr(a, l, () => null);
  if (!u) return null;
  const d = gc(u, e, t.resolvedLanguage ?? t.language), h = mc(d, u.items), p = (f, m) => {
    if (m) {
      i.current.add(f), n?.pauseDeleteUndo();
      return;
    }
    i.current.delete(f), !r.current && !s.current && i.current.size === 0 && n?.resumeDeleteUndo();
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
      onBlurCapture: (f) => {
        o.current?.contains(f.relatedTarget) || (s.current = !1, !r.current && i.current.size === 0 && n?.resumeDeleteUndo());
      },
      children: /* @__PURE__ */ T(Q, { className: Mt.content, align: "center", gap: "2", children: [
        /* @__PURE__ */ c(dt.Text, { className: Mt.message, children: h.map((f, m) => {
          if (f.kind === "text")
            return /* @__PURE__ */ c(Pt.Fragment, { children: f.value }, `text-${m}`);
          const g = `${f.annotation.id}-${m}`;
          return /* @__PURE__ */ c(
            er,
            {
              annotation: f.annotation,
              previewComments: f.comments,
              onOpenChange: (y) => p(g, y),
              children: /* @__PURE__ */ c("button", { className: Mt.reference, type: "button", children: f.value })
            },
            g
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
const ao = "inklayer-annotator", co = "annotator-sidebar-toggle", yc = ({
  enableNativeAnnotations: n,
  annotations: e,
  annotationPermissions: t,
  defaultShowAnnotationAuthorLabels: o = !1,
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
    isSidebarCollapsed: p,
    activeSidebarPanel: f,
    openSidebar: m,
    viewerContainerRef: g
  } = Fe(), { user: y } = Po(), { refreshPainter: b, setPainter: S } = ot(), { defaultOptions: w, primaryColor: C } = It(), E = se((N) => N.clearAnnotations), I = j({
    annotations: e ?? [],
    enableNativeAnnotations: n,
    onLoad: r,
    onAnnotationAdd: s,
    onAnnotationDelete: i,
    onAnnotationSelected: a,
    onAnnotationChanged: l
  });
  I.current = {
    annotations: e ?? [],
    enableNativeAnnotations: n,
    onLoad: r,
    onAnnotationAdd: s,
    onAnnotationDelete: i,
    onAnnotationSelected: a,
    onAnnotationChanged: l
  };
  const H = j(null), B = j(null), W = j(null), D = j(y), k = j(t), L = j({ activeSidebarPanel: f, openSidebar: m }), $ = j(o);
  D.current = y, k.current = t, L.current = { activeSidebarPanel: f, openSidebar: m };
  const G = j(
    Ua(
      () => {
        B.current?.close(), H.current?.close();
        const N = document.querySelector(`#${jo}`);
        if (N?.parentNode)
          try {
            N.parentNode.removeChild(N);
          } catch {
          }
      },
      100,
      !0
    )
  ).current, O = X(() => {
    G();
  }, [G]);
  return ne(() => {
    if (E(), !u || !d || !h || !D.current) return;
    let N = !1, Z = !1, q = null;
    const A = new Na({
      primaryColor: C,
      defaultOptions: w,
      currentUser: D.current,
      annotationPermissions: k.current,
      defaultShowAnnotationAuthorLabels: $.current,
      PDFViewerApplication: d,
      onTextSelected: (P) => {
        H.current?.open(P);
      },
      onAnnotationAdd: (P) => {
        I.current.onAnnotationAdd(P);
      },
      onAnnotationDelete: (P) => {
        I.current.onAnnotationDelete(P);
      },
      onAnnotationSelected: (P, K, ce) => {
        const le = L.current;
        K && P && le.activeSidebarPanel !== co && le.openSidebar?.(co), K && P && B.current?.open(P, ce), I.current.onAnnotationSelected(P ?? null, K);
      },
      onAnnotationChanging: () => {
        B.current?.close();
      },
      onAnnotationChanged: (P, K) => {
        P && K && B.current?.open(P, K), P && I.current.onAnnotationChanged(P);
      }
    });
    W.current = A, S(A);
    const U = ({ source: P, cssTransform: K, pageNumber: ce }) => {
      A.initCanvas({
        pageView: P,
        cssTransform: K,
        pageNumber: ce
      });
    };
    h.on("pagerendered", U), h._on("updateviewarea", O), g.current && A.initWebSelection(g.current);
    const J = async () => {
      if (!(N || Z)) {
        Z = !0;
        try {
          const { annotations: P, enableNativeAnnotations: K } = I.current;
          await A.initAnnotationsOnce(P, K);
        } catch (P) {
          N || console.error("[Annotator] Failed to initialize annotations", P);
          return;
        }
        N || (q = setTimeout(() => {
          if (q = null, !N)
            for (let P = 0; P < d.pagesCount; P++) {
              const K = d.getPageView(P);
              if (K && K.div && K.canvas) {
                const ce = A.getKonvaCanvasStore();
                ce && ce.has(P + 1) && A.reRenderAnnotations(P + 1);
              }
            }
        }, 0), I.current.onLoad?.());
      }
    };
    return d.pdfDocument ? J() : h.on("documentloaded", J), () => {
      N = !0, q && (clearTimeout(q), q = null), h.off("pagerendered", U), h.off("updateviewarea", O), h.off("documentloaded", J), A.destroy(), W.current === A && (W.current = null), S(null);
    };
  }, [E, w, h, O, u, d, C, S]), Qe(() => {
    D.current && (B.current?.close(), W.current?.setPermissionContext(D.current, k.current), W.current && b());
  }, [t, b, y]), ne(() => {
    if (!h) return;
    const N = (q) => {
      const A = /* @__PURE__ */ new Map();
      q.forEach((U) => {
        A.set(U.pageNumber, (A.get(U.pageNumber) ?? 0) + 1);
      }), h.dispatch(Yt, {
        source: ao,
        markers: A
      });
    };
    N(se.getState().annotations);
    const Z = se.subscribe((q, A) => {
      q.annotations !== A.annotations && N(q.annotations);
    });
    return () => {
      Z(), h.dispatch(Yt, {
        source: ao,
        markers: /* @__PURE__ */ new Map()
      });
    };
  }, [h]), ne(() => {
    O();
  }, [O, p]), /* @__PURE__ */ T(ye, { children: [
    /* @__PURE__ */ c(Da, { ref: H }),
    /* @__PURE__ */ c(Fa, { ref: B }),
    /* @__PURE__ */ c(vc, {})
  ] });
}, bc = {
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
}, Sc = {
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
}, wc = ["common", "viewer", "annotator"];
Te.use(Pr).init({
  resources: {
    "zh-CN": bc,
    "en-US": Sc
  },
  lng: "zh-CN",
  fallbackLng: "en-US",
  ns: wc,
  defaultNS: "common",
  interpolation: { escapeValue: !1 }
});
const xt = tn(({
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
  buttonProps: f = {}
}, m) => {
  const [g, y] = Y(!1);
  ne(() => {
    if (!r || i === "none" || typeof window > "u") return;
    const w = () => y(!1);
    return window.addEventListener("inklayer:close-toolbar-tooltips", w), window.addEventListener("scroll", w, !0), () => {
      window.removeEventListener("inklayer:close-toolbar-tooltips", w), window.removeEventListener("scroll", w, !0);
    };
  }, [r, i]), ne(() => {
    e === void 0 || typeof window > "u" || window.dispatchEvent(new Event("inklayer:close-toolbar-tooltips"));
  }, [e]);
  const S = /* @__PURE__ */ T(
    tt,
    {
      ref: m,
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
      ...f,
      onPointerEnter: u,
      onPointerLeave: d,
      onFocus: h,
      onBlur: p,
      onPointerDown: () => {
        y(!1), typeof window < "u" && window.dispatchEvent(new Event("inklayer:close-toolbar-tooltips"));
      },
      children: [
        n,
        s
      ]
    }
  );
  return r && i !== "none" ? /* @__PURE__ */ c(Rt, { content: r, side: a, open: g, onOpenChange: y, children: S }) : S;
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
  const { t: n } = ve("viewer", { useSuspense: !1 }), { pdfViewer: e, eventBus: t } = Fe(), [o, r] = Y("auto");
  ne(() => {
    if (!t || !e) return;
    const p = () => {
      const f = e.currentScaleValue;
      r(f || "auto");
    };
    return t.on("scalechanging", p), t.on("pagesloaded", p), () => {
      t.off("scalechanging", p), t.off("pagesloaded", p);
    };
  }, [t, e]);
  const s = (p) => {
    if (["auto", "page-actual", "page-fit", "page-width"].includes(p))
      return null;
    const f = parseFloat(p);
    return isNaN(f) ? null : f;
  }, i = (p) => {
    r(p), e && (e.currentScaleValue = p);
  }, a = () => {
    let p = s(o);
    p === null && (p = e ? e.currentScale : 1);
    const f = Math.min(p + St.ZOOM_STEP, St.MAX_SCALE), m = Math.round(f * 100) / 100;
    i(m.toString());
  }, l = () => {
    let p = s(o);
    p === null && (p = e ? e.currentScale : 1);
    const f = Math.max(p - St.ZOOM_STEP, St.MIN_SCALE), m = Math.round(f * 100) / 100;
    i(m.toString());
  }, u = () => (s(o) ?? (e?.currentScale || 1)) >= St.MAX_SCALE, d = () => (s(o) ?? (e?.currentScale || 1)) <= St.MIN_SCALE, h = (() => {
    const p = St.ZOOM_OPTIONS.find((m) => m.value === o);
    if (p)
      return "labelKey" in p && p.labelKey ? n(p.labelKey) : "label" in p ? p.label : o;
    const f = parseFloat(o);
    return isNaN(f) ? n("viewer:zoom.auto") : `${Math.round(f * 100)}%`;
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
        icon: /* @__PURE__ */ c(Mr, {}),
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
        icon: /* @__PURE__ */ c(Dr, {}),
        onClick: a
      }
    )
  ] });
}, Cc = "_SignatureTool_mpyjt_1", xc = "_container_mpyjt_1", Tc = "_info_mpyjt_23", Ac = "_imagePreview_mpyjt_34", kc = "_toolbar_mpyjt_48", Ec = "_colorPalette_mpyjt_53", Rc = "_cell_mpyjt_58", Pc = "_active_mpyjt_75", Ic = "_toolbarDark_mpyjt_84", Nc = "_SignaturePop_mpyjt_94", Ze = {
  SignatureTool: Cc,
  container: xc,
  info: Tc,
  imagePreview: Ac,
  toolbar: kc,
  colorPalette: Ec,
  cell: Rc,
  active: Pc,
  toolbarDark: Ic,
  SignaturePop: Nc
}, Jt = /* @__PURE__ */ new Set();
function Mc(n) {
  if (!n.external || !n.url || Jt.has(n.value)) return;
  const e = document.createElement("style");
  e.innerHTML = `
    @font-face {
        font-family: '${n.value}';
        src: url('${n.url}') format('truetype');
        font-weight: normal;
        font-style: normal;
    }
    `, document.head.appendChild(e), Jt.add(n.value);
}
async function Dc(n) {
  if (!(!n.external || !n.url || Jt.has(n.value)))
    try {
      const e = new FontFace(n.value, `url(${n.url})`);
      await e.load(), document.fonts.add(e), Jt.add(n.value);
    } catch {
      Mc(n);
    }
}
const zt = 80, Lc = ({ annotation: n, disabled: e = !1, onAdd: t, default_signatures: o, presentation: r = "toolbar-icon", label: s, selected: i, onIntent: a }) => {
  const { defaultOptions: l } = It(), u = l.signature.colors, d = 420, h = 200, p = l.signature.type, f = l.signature.maxSize, m = l.signature.accept, g = 600, y = l.signature.defaultFont, { t: b } = ve(["common", "annotator"], { useSuspense: !1 }), S = j(null), w = j(null), C = j(u[0]), E = j(null), [I, H] = Y(!1), [B, W] = Y(C.current), [D, k] = Y(!0), [L, $] = Y([]), [G, O] = Y(null), [N, Z] = Y(""), [q, A] = Y(y[0]?.value || "Arial"), [U, J] = Y(null), [P, K] = Y(!1), { appearance: ce } = nn(), le = o ?? l.signature.defaultSignature, _ = f;
  ne(() => {
    C.current = B;
  }, [B]);
  const te = (v) => {
    t(v);
  }, de = async (v) => {
    const x = y.find((z) => z.value === v);
    x && x.external && await Dc(x), A(v);
  }, fe = j({ fontFamily: q, signatureTypeDefault: p, loadFont: de });
  fe.current = { fontFamily: q, signatureTypeDefault: p, loadFont: de };
  const xe = () => {
    if (!N.trim()) return null;
    const v = document.createElement("canvas");
    v.width = d / 1.1, v.height = h;
    const x = v.getContext("2d");
    if (!x) return null;
    const z = 20;
    x.clearRect(0, 0, v.width, v.height), x.font = `${zt}px "${q}", cursive, sans-serif`;
    const V = x.measureText(N).width, ue = V + z * 2 > v.width ? (v.width - z * 2) / V : 1;
    return x.font = `${zt * ue}px "${q}", cursive, sans-serif`, x.textAlign = "center", x.textBaseline = "middle", x.imageSmoothingEnabled = !0, x.shadowColor = "rgba(0, 0, 0, 0.1)", x.shadowBlur = 2, x.shadowOffsetX = 1, x.shadowOffsetY = 1, x.fillStyle = B, x.fillText(N, v.width / 2, v.height / 2), v.toDataURL("image/png");
  }, Je = () => {
    if (G === "Upload") {
      U && ($((v) => [...v, U]), te(U), H(!1));
      return;
    }
    if (G === "Enter") {
      const v = xe();
      v && ($((x) => [...x, v]), te(v), H(!1));
      return;
    }
    if (G === "Draw") {
      const v = w.current?.toDataURL();
      v && ($((x) => [...x, v]), te(v), H(!1));
      return;
    }
  }, Ve = () => {
    const v = w.current;
    v && (v.clear(), v.getLayers().forEach((x) => x.destroyChildren()), k(!0)), Z(""), J(null);
  }, He = () => {
    if (!S.current) return;
    const v = new M.Stage({
      container: S.current,
      width: d,
      height: h
    }), x = new M.Layer();
    v.add(x), w.current = v;
    let z = !1, V = null;
    const ue = () => {
      z = !0;
      const we = v.getPointerPosition();
      we && (V = new M.Line({
        stroke: C.current,
        strokeWidth: 3,
        globalCompositeOperation: "source-over",
        lineCap: "round",
        lineJoin: "round",
        points: [we.x, we.y]
      }), x.add(V));
    }, he = (we) => {
      if (!z || !V) return;
      we.evt.preventDefault();
      const Be = v.getPointerPosition();
      if (!Be) return;
      const ht = V.points().concat([Be.x, Be.y]);
      V.points(ht), k(!1);
    }, pe = () => {
      z = !1, V = null;
    };
    v.on("mousedown touchstart", ue), v.on("mouseup touchend", pe), v.on("mousemove touchmove", he);
  }, je = (v) => {
    W(v), (w.current?.getLayers()[0].getChildren((z) => z.getClassName() === "Line") || []).forEach((z) => z.stroke(v));
  }, $e = (v) => {
    const x = v.target, z = x.files;
    if (!z?.length) return;
    const V = z[0];
    if (V.size > _) {
      K(!0), setTimeout(() => K(!1), 3e3), x && (x.value = "");
      return;
    }
    const ue = new FileReader();
    ue.onload = async (he) => {
      const pe = he.target?.result, we = new Image();
      we.src = pe, we.onload = () => {
        const Be = g, ht = g;
        let { width: Ye, height: Oe } = we;
        Ye > Oe && Ye > Be ? (Oe = Math.round(Oe * Be / Ye), Ye = Be) : Oe > ht && (Ye = Math.round(Ye * ht / Oe), Oe = ht);
        const Ge = document.createElement("canvas"), vt = Ge.getContext("2d");
        if (Ge.width = Ye, Ge.height = Oe, vt) {
          vt.drawImage(we, 0, 0, Ye, Oe);
          const wt = Ge.toDataURL("image/png");
          x.value = "", J(wt), k(!1);
        }
      };
    }, ue.readAsDataURL(V);
  };
  return ne(() => {
    Z(""), J(null), (G === "Enter" || G === "Draw" || G === "Upload") && k(!0);
  }, [G]), ne(() => {
    k(N.trim().length === 0);
  }, [N]), ne(() => {
    if (I) {
      const v = fe.current;
      v.loadFont(v.fontFamily), Z(""), J(null), O(v.signatureTypeDefault);
    }
  }, [I]), ne(() => {
    I && G === "Draw" ? setTimeout(() => {
      He();
    }, 300) : (w.current?.destroy(), w.current = null);
  }, [G, I]), /* @__PURE__ */ T(ye, { children: [
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
      /* @__PURE__ */ c(Ae.Content, { size: "1", style: { width: 180 }, onCloseAutoFocus: (v) => v.preventDefault(), children: /* @__PURE__ */ T("div", { className: Ze.SignaturePop, children: [
        /* @__PURE__ */ T("ul", { className: Ze.container, children: [
          le.map((v, x) => /* @__PURE__ */ c(Ae.Close, { children: /* @__PURE__ */ c("li", { onClick: () => te(v), children: /* @__PURE__ */ c("img", { src: v }) }, x) }, x)),
          L.map((v, x) => /* @__PURE__ */ c(Ae.Close, { children: /* @__PURE__ */ c("li", { onClick: () => te(v), children: /* @__PURE__ */ c("img", { src: v }) }, x) }, x))
        ] }),
        /* @__PURE__ */ c(Ae.Close, { children: /* @__PURE__ */ T(be, { style: { width: "100%" }, variant: "soft", onClick: () => {
          H(!0);
        }, children: [
          /* @__PURE__ */ c(wo, {}),
          " ",
          b("annotator:common.createSignature")
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ c(ct.Root, { open: I, onOpenChange: H, children: /* @__PURE__ */ T(ct.Content, { style: { width: "550px" }, children: [
      /* @__PURE__ */ c(ct.Title, { children: b("annotator:common.createSignature") }),
      /* @__PURE__ */ c(Q, { as: "span", justify: "center", mb: "4", children: /* @__PURE__ */ T(gt.Root, { size: "3", defaultValue: p, onValueChange: (v) => O(v), radius: "full", children: [
        /* @__PURE__ */ c(gt.Item, { value: "Enter", children: b("enter") }),
        /* @__PURE__ */ c(gt.Item, { value: "Draw", children: b("draw") }),
        /* @__PURE__ */ c(gt.Item, { value: "Upload", children: b("annotator:editor.signature.upload") })
      ] }) }),
      /* @__PURE__ */ T("div", { className: Ze.SignatureTool, children: [
        /* @__PURE__ */ T("div", { className: Ze.container, style: { width: d }, children: [
          G === "Enter" && /* @__PURE__ */ c(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: N,
              onChange: (v) => Z(v.target.value),
              placeholder: b("annotator:editor.signature.area"),
              style: {
                height: h - 2,
                width: d / 1.1,
                color: B,
                fontFamily: `${q}`,
                fontSize: zt,
                lineHeight: `${zt}px`
              }
            }
          ),
          G === "Draw" && /* @__PURE__ */ T(ye, { children: [
            /* @__PURE__ */ c("div", { className: Ze.info, children: b("annotator:editor.signature.area") }),
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
          G === "Upload" && /* @__PURE__ */ c("div", { style: {
            height: h,
            width: d
          }, children: U ? /* @__PURE__ */ c("div", { className: Ze.imagePreview, style: {
            height: h,
            width: d
          }, children: /* @__PURE__ */ c("img", { src: U, alt: "preview" }) }) : /* @__PURE__ */ T("div", { style: {
            height: h,
            width: d
          }, children: [
            /* @__PURE__ */ c("input", { style: { display: "none" }, type: "file", ref: E, accept: m, onChange: $e }),
            /* @__PURE__ */ T(Q, { height: `${h}px`, direction: "column", gap: "3", justify: "center", align: "center", children: [
              /* @__PURE__ */ T(be, { size: "3", onClick: () => {
                E.current?.click();
              }, children: [
                /* @__PURE__ */ c(Co, {}),
                " ",
                b("annotator:editor.signature.choose")
              ] }),
              /* @__PURE__ */ c(ae, { color: "gray", size: "2", style: { textAlign: "center" }, children: b("annotator:editor.signature.uploadHint", { format: m, maxSize: Cn(f) }) }),
              P && /* @__PURE__ */ c(dt.Root, { color: "red", mt: "3", children: /* @__PURE__ */ c(dt.Text, { children: b("fileSizeLimit", { value: Cn(_) }) }) })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ c("div", { className: `${Ze.toolbar} ${ce === "dark" ? Ze.toolbarDark : ""}`, style: { width: d }, children: /* @__PURE__ */ T(Q, { justify: "between", align: "center", gap: "2", children: [
          /* @__PURE__ */ T("div", { className: Ze.colorPalette, children: [
            G !== "Upload" && /* @__PURE__ */ c(ye, { children: u.map((v) => /* @__PURE__ */ c("div", { onClick: () => je(v), className: `${Ze.cell} ${v === B ? Ze.active : ""}`, children: /* @__PURE__ */ c("span", { style: { backgroundColor: v } }) }, v)) }),
            G === "Enter" && /* @__PURE__ */ c(ye, { children: /* @__PURE__ */ T(Re.Root, { onValueChange: async (v) => {
              await de(v);
            }, defaultValue: q, size: "1", children: [
              /* @__PURE__ */ c(Re.Trigger, {}),
              /* @__PURE__ */ c(Re.Content, { children: y.map((v) => /* @__PURE__ */ c(Re.Item, { value: v.value, children: v.label }, v.value)) })
            ] }) })
          ] }),
          /* @__PURE__ */ c(be, { variant: "ghost", mr: "3", onClick: Ve, children: b("clear") })
        ] }) }),
        /* @__PURE__ */ T(Q, { gap: "3", mt: "4", justify: "end", children: [
          /* @__PURE__ */ c(ct.Close, { children: /* @__PURE__ */ c(be, { style: { width: 100 }, variant: "soft", color: "gray", children: b("cancel") }) }),
          /* @__PURE__ */ c(ct.Close, { children: /* @__PURE__ */ c(be, { disabled: D, style: { width: 100 }, onClick: Je, children: b("ok") }) })
        ] })
      ] })
    ] }) })
  ] });
}, _c = "_StampPop_1pr7b_1", Oc = "_container_1pr7b_4", Hc = "_StampTool_1pr7b_38", Gc = "_imagePreview_1pr7b_45", Uc = "_imagePreviewDark_1pr7b_54", zc = "_formItem_1pr7b_58", Ue = {
  StampPop: _c,
  container: Oc,
  StampTool: Hc,
  imagePreview: Gc,
  imagePreviewDark: Uc,
  formItem: zc
};
ko.extend(ri);
const lo = "StampGroup", Ft = 470, Dt = 120, Fc = [
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
], jc = ({ annotation: n, disabled: e = !1, default_stamps: t, onAdd: o, presentation: r = "toolbar-icon", label: s, selected: i, onIntent: a }) => {
  const { defaultOptions: l } = It(), u = l.stamp.maxSize, d = l.stamp.accept, h = 600, p = l.stamp.editor.defaultFont, f = l.stamp.editor.defaultTextColor, m = l.stamp.editor.defaultBorderStyle, g = l.stamp.editor.defaultBackgroundColor, y = l.stamp.editor.defaultBorderColor, b = l.colors, { t: S } = ve(["common", "annotator"]), w = j(null), C = j(null), E = j(null), { user: I } = Po(), [H, B] = Y([]), { appearance: W } = nn(), D = t ?? l.stamp.defaultStamp, [k, L] = Y(!1), [$, G] = Y(D.length === 0 ? "custom" : "default"), [O, N] = Y({
    stampText: S("annotator:editor.stamp.defaultText"),
    fontStyle: [],
    fontFamily: p[0].value,
    textColor: f,
    backgroundColor: g,
    borderColor: y,
    borderStyle: m,
    timestamp: ["username", "date"],
    customTimestampText: "",
    dateFormat: "YYYY-MM-DD"
  });
  Qe(() => {
    N((_) => ({
      ..._,
      stampText: S("annotator:editor.stamp.defaultText")
    }));
  }, [S]);
  const [Z, q] = Y(null), A = (_) => {
    o(_);
  }, U = () => {
    const _ = C.current?.getLayers()[0];
    if (!_) return;
    const te = _.getChildren((fe) => fe.name() === lo)[0];
    if (!te) return;
    const de = C.current?.toDataURL({
      x: te.x(),
      y: te.y(),
      width: te.width(),
      height: te.height()
    });
    de && (B((fe) => [...fe, de]), A(de), L(!1));
  }, J = (_) => {
    const te = _.target, de = te.files;
    if (!de?.length) return;
    const fe = de[0];
    if (fe.size > u) {
      alert(S("fileSizeLimit", { value: Cn(u) })), te && (te.value = "");
      return;
    }
    const xe = new FileReader();
    xe.onload = async (Je) => {
      const Ve = Je.target?.result, He = new Image();
      He.src = Ve, He.onload = () => {
        const je = h, $e = h;
        let { width: v, height: x } = He;
        v > x && v > je ? (x = Math.round(x * je / v), v = je) : x > $e && (v = Math.round(v * $e / x), x = $e);
        const z = document.createElement("canvas"), V = z.getContext("2d");
        if (z.width = v, z.height = x, V) {
          V.drawImage(He, 0, 0, v, x);
          const ue = z.toDataURL("image/png");
          te.value = "", B((he) => [...he, ue]);
        }
      };
    }, xe.readAsDataURL(fe);
  }, P = (_, te) => {
    const de = {
      ...O,
      [_]: te
    };
    N(de), q(de), K(de);
  }, K = (_) => {
    if (!w.current) return;
    const { stampText: te, fontStyle: de, textColor: fe, backgroundColor: xe, borderColor: Je, borderStyle: Ve, timestamp: He, dateFormat: je, fontFamily: $e } = _;
    C.current?.destroy();
    const v = new M.Stage({
      container: w.current,
      width: Ft,
      height: Dt
    }), x = new M.Layer(), z = [];
    de.includes("italic") && z.push("italic"), de.includes("bold") && z.push("bold");
    const V = z.join(" ") || "normal", ue = de.includes("underline"), he = de.includes("strikeout"), pe = ko(), we = I?.name, Be = je ? pe.format(je) : "", ht = _.customTimestampText?.trim(), Oe = [
      He.includes("username") ? we : null,
      He.includes("date") ? Be : null,
      ht || null
    ].filter(Boolean).join(" · ");
    let Ge = 30;
    const vt = 16, wt = 10, Gt = new M.Text({
      text: te,
      fontSize: Ge,
      fontStyle: V,
      fontFamily: $e
    }), rn = new M.Text({
      text: Oe,
      fontSize: vt,
      fontFamily: $e
    }), sn = Math.max(Gt.width(), rn.width()) + 60, Ce = Ge + wt + vt + 25, pt = Math.max(sn, 180), yt = Math.max(Ce, 60), rt = new M.Rect({
      name: lo,
      width: pt,
      height: yt,
      x: (Ft - pt) / 2,
      y: (Dt - yt) / 2,
      fill: xe,
      strokeWidth: Ve === "none" ? 0 : 5,
      stroke: Je,
      dash: Ve === "dashed" ? [5, 5] : void 0,
      cornerRadius: 10
    });
    x.add(rt), Oe || (Ge = Ge * 1.2);
    let it;
    Oe ? it = (Dt - yt) / 2 + 15 : it = (Dt - yt) / 2 + yt / 2 - Ge / 2;
    const an = new M.Text({
      text: te,
      x: 0,
      y: it,
      width: Ft,
      align: "center",
      fontSize: Ge,
      fontStyle: V,
      fontFamily: $e,
      fill: fe
    });
    if (x.add(an), ue) {
      const Nt = an.y() + Ge + 4, cn = new M.Line({
        points: [rt.x(), Nt, rt.x() + rt.width(), Nt],
        stroke: fe,
        strokeWidth: 2
      });
      x.add(cn);
    }
    if (he) {
      const Nt = an.y() + Ge / 2, cn = new M.Line({
        points: [rt.x(), Nt, rt.x() + rt.width(), Nt],
        stroke: fe,
        strokeWidth: 2
      });
      x.add(cn);
    }
    const ur = new M.Text({
      text: Oe,
      x: 0,
      y: it + Ge + wt,
      width: Ft,
      align: "center",
      fontSize: vt,
      fontFamily: $e,
      fill: fe
    });
    Oe && x.add(ur), v.add(x), C.current = v;
  }, ce = j(O);
  ce.current = Z ?? O;
  const le = j(K);
  return le.current = K, Qe(() => {
    if (k) {
      const te = requestAnimationFrame(() => {
        w.current && le.current(ce.current);
      });
      return () => cancelAnimationFrame(te);
    }
    const _ = C.current;
    _ && (_.destroy(), C.current = null);
  }, [k]), /* @__PURE__ */ T(ye, { children: [
    /* @__PURE__ */ T(Ae.Root, { children: [
      /* @__PURE__ */ c(Ae.Trigger, { children: /* @__PURE__ */ c(
        xt,
        {
          disabled: e,
          selected: i,
          tooltip: r === "menu-item" ? "none" : "auto",
          title: S(`annotator:tool.${n.name}`),
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
          onCloseAutoFocus: (_) => {
            _.preventDefault(), G(D.length === 0 ? "custom" : "default");
          },
          children: /* @__PURE__ */ T("div", { className: Ue.StampPop, children: [
            /* @__PURE__ */ c(Q, { align: "center", justify: "center", mb: "4", children: /* @__PURE__ */ c(
              gt.Root,
              {
                radius: "full",
                defaultValue: D.length === 0 ? "custom" : "default",
                onValueChange: (_) => G(_),
                children: D.length === 0 ? /* @__PURE__ */ T(ye, { children: [
                  /* @__PURE__ */ c(gt.Item, { value: "custom", children: S("custom") }),
                  /* @__PURE__ */ c(gt.Item, { value: "default", children: S("default") })
                ] }) : /* @__PURE__ */ T(ye, { children: [
                  /* @__PURE__ */ c(gt.Item, { value: "default", children: S("default") }),
                  /* @__PURE__ */ c(gt.Item, { value: "custom", children: S("custom") })
                ] })
              }
            ) }),
            $ === "default" && /* @__PURE__ */ T(ye, { children: [
              D.length === 0 && /* @__PURE__ */ c(Q, { align: "center", justify: "center", gap: "2", children: /* @__PURE__ */ T(dt.Root, { variant: "soft", color: "gray", size: "1", style: { width: "100%" }, children: [
                /* @__PURE__ */ c(dt.Icon, { children: /* @__PURE__ */ c(Lr, {}) }),
                /* @__PURE__ */ c(dt.Text, { children: S("annotator:editor.stamp.defaultStampNotSet") })
              ] }) }),
              /* @__PURE__ */ c("ul", { className: Ue.container, children: D.map((_, te) => /* @__PURE__ */ c(Ae.Close, { children: /* @__PURE__ */ c("li", { onClick: () => A(_), children: /* @__PURE__ */ c("img", { src: _ }) }, te) }, te)) })
            ] }),
            /* @__PURE__ */ c("div", { children: $ === "custom" && /* @__PURE__ */ T(ye, { children: [
              /* @__PURE__ */ c("ul", { className: Ue.container, children: H.map((_, te) => /* @__PURE__ */ c(Ae.Close, { children: /* @__PURE__ */ c("li", { onClick: () => A(_), children: /* @__PURE__ */ c("img", { src: _ }) }, te) }, te)) }),
              /* @__PURE__ */ c(Q, { gap: "4", p: "1", children: /* @__PURE__ */ c(Ae.Close, { children: /* @__PURE__ */ T(
                be,
                {
                  variant: "soft",
                  style: { width: "100%" },
                  onClick: () => {
                    L(!0);
                  },
                  children: [
                    /* @__PURE__ */ c(wo, {}),
                    " ",
                    S("annotator:common.createStamp")
                  ]
                }
              ) }) }),
              /* @__PURE__ */ c(nt, { my: "3", size: "4" }),
              /* @__PURE__ */ c("input", { style: { display: "none" }, type: "file", ref: E, accept: d, onChange: J }),
              /* @__PURE__ */ c(Q, { gap: "2", justify: "end", children: /* @__PURE__ */ T(
                be,
                {
                  variant: "ghost",
                  mr: "3",
                  onClick: () => {
                    E.current?.click();
                  },
                  children: [
                    /* @__PURE__ */ c(Co, {}),
                    S("annotator:editor.stamp.upload")
                  ]
                }
              ) })
            ] }) })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ c(ct.Root, { open: k, onOpenChange: L, children: /* @__PURE__ */ T(ct.Content, { style: { width: "550px" }, children: [
      /* @__PURE__ */ c(ct.Title, { children: S("annotator:common.createStamp") }),
      /* @__PURE__ */ T("div", { className: Ue.StampTool, children: [
        /* @__PURE__ */ T("div", { className: Ue.container, children: [
          /* @__PURE__ */ c(
            "div",
            {
              className: `${Ue.imagePreview} ${W === "dark" ? Ue.imagePreviewDark : ""}`,
              ref: w,
              style: {
                height: Dt
              }
            }
          ),
          /* @__PURE__ */ T(Bt, { align: "center", columns: "22", gap: "5", mt: "3", children: [
            /* @__PURE__ */ c(Q, { direction: "column", gridColumn: "span 22", children: /* @__PURE__ */ T(ae, { as: "label", size: "2", children: [
              S("annotator:editor.stamp.stampText"),
              /* @__PURE__ */ c(kt.Root, { value: O.stampText, onChange: (_) => P("stampText", _.target.value) })
            ] }) }),
            /* @__PURE__ */ T(Q, { direction: "column", gridColumn: "span 9", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: S("annotator:editor.stamp.textColor") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ c(
                Et,
                {
                  transparent: !0,
                  value: O.textColor,
                  onChange: (_) => P("textColor", _),
                  presets: b,
                  popover: !0
                }
              ) })
            ] }),
            /* @__PURE__ */ T(Q, { direction: "column", gridColumn: "span 8", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: S("annotator:editor.stamp.backgroundColor") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ c(
                Et,
                {
                  value: O.backgroundColor,
                  onChange: (_) => P("backgroundColor", _),
                  presets: b,
                  popover: !0,
                  transparent: !0
                }
              ) })
            ] }),
            /* @__PURE__ */ T(Q, { direction: "column", gridColumn: "span 5", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: S("annotator:editor.stamp.borderColor") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ c(
                Et,
                {
                  value: O.borderColor,
                  onChange: (_) => P("borderColor", _),
                  presets: b,
                  transparent: !0,
                  popover: !0
                }
              ) })
            ] }),
            /* @__PURE__ */ T(Q, { direction: "column", gridColumn: "span 9", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: S("annotator:editor.stamp.fontStyle") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ c(
                bt.Root,
                {
                  value: O.fontStyle,
                  onValueChange: (_) => P("fontStyle", _),
                  children: /* @__PURE__ */ T(Q, { direction: "row", gap: "2", children: [
                    /* @__PURE__ */ c(bt.Item, { value: "bold", children: /* @__PURE__ */ c(_r, {}) }),
                    /* @__PURE__ */ c(bt.Item, { value: "italic", children: /* @__PURE__ */ c(Or, {}) }),
                    /* @__PURE__ */ c(bt.Item, { value: "underline", children: /* @__PURE__ */ c(Hr, {}) }),
                    /* @__PURE__ */ c(bt.Item, { value: "strikeout", children: /* @__PURE__ */ c(Gr, {}) })
                  ] })
                }
              ) })
            ] }),
            /* @__PURE__ */ T(Q, { direction: "column", gridColumn: "span 8", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: S("annotator:editor.stamp.fontFamily") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ T(Re.Root, { value: O.fontFamily, onValueChange: (_) => P("fontFamily", _), children: [
                /* @__PURE__ */ c(Re.Trigger, {}),
                /* @__PURE__ */ c(Re.Content, { children: p.map((_) => /* @__PURE__ */ c(Re.Item, { value: _.value, children: _.label }, _.value)) })
              ] }) })
            ] }),
            /* @__PURE__ */ T(Q, { direction: "column", gridColumn: "span 5", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: S("annotator:editor.stamp.borderStyle") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ T(
                Re.Root,
                {
                  value: O.borderStyle,
                  onValueChange: (_) => P("borderStyle", _),
                  children: [
                    /* @__PURE__ */ c(Re.Trigger, {}),
                    /* @__PURE__ */ T(Re.Content, { children: [
                      /* @__PURE__ */ c(Re.Item, { value: "none", children: S("annotator:editor.stamp.none") }),
                      /* @__PURE__ */ c(Re.Item, { value: "solid", children: S("annotator:editor.stamp.solid") }),
                      /* @__PURE__ */ c(Re.Item, { value: "dashed", children: S("annotator:editor.stamp.dashed") })
                    ] })
                  ]
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ c(nt, { my: "3", size: "4" }),
          /* @__PURE__ */ T(Bt, { align: "center", columns: "2", gap: "3", children: [
            /* @__PURE__ */ T(Q, { direction: "column", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: S("annotator:editor.stamp.timestampText") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ c(
                bt.Root,
                {
                  value: O.timestamp,
                  onValueChange: (_) => P("timestamp", _),
                  children: /* @__PURE__ */ T(Q, { direction: "row", gap: "2", children: [
                    /* @__PURE__ */ c(bt.Item, { value: "username", children: S("annotator:editor.stamp.username") }),
                    /* @__PURE__ */ c(bt.Item, { value: "date", children: S("annotator:editor.stamp.date") })
                  ] })
                }
              ) })
            ] }),
            /* @__PURE__ */ T(Q, { direction: "column", children: [
              /* @__PURE__ */ c(ae, { size: "2", children: S("annotator:editor.stamp.dateFormat") }),
              /* @__PURE__ */ c("div", { className: Ue.formItem, children: /* @__PURE__ */ T(Re.Root, { value: O.dateFormat, onValueChange: (_) => P("dateFormat", _), children: [
                /* @__PURE__ */ c(Re.Trigger, {}),
                /* @__PURE__ */ c(Re.Content, { children: Fc?.map((_) => /* @__PURE__ */ T(Re.Group, { children: [
                  /* @__PURE__ */ c(Re.Label, { children: _.label }),
                  _.options.map((te) => /* @__PURE__ */ c(Re.Item, { value: te.value, children: te.label }, te.value))
                ] }, _.label)) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ c(Bt, { align: "center", columns: "1", gap: "3", mt: "3", children: /* @__PURE__ */ T(ae, { as: "label", size: "2", children: [
            S("annotator:editor.stamp.customTimestamp"),
            /* @__PURE__ */ c(
              kt.Root,
              {
                value: O.customTimestampText,
                onChange: (_) => P("customTimestampText", _.target.value)
              }
            )
          ] }) }),
          /* @__PURE__ */ T(Q, { gap: "3", mt: "4", justify: "end", children: [
            /* @__PURE__ */ c(ct.Close, { children: /* @__PURE__ */ c(be, { style: { width: 100 }, variant: "soft", color: "gray", children: S("cancel") }) }),
            /* @__PURE__ */ c(ct.Close, { children: /* @__PURE__ */ c(be, { style: { width: 100 }, onClick: U, children: S("ok") }) })
          ] })
        ] }),
        /* @__PURE__ */ c("div", { className: "StampTool-Toolbar" })
      ] })
    ] }) })
  ] });
}, tr = {
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
function Bc(n) {
  const e = De.find((t) => t.type === tr[n]);
  if (!e) throw new Error(`UNKNOWN_ANNOTATION_TOOL:${n}`);
  return e;
}
function On(n) {
  return n === void 0 ? null : Object.entries(tr).find(([, t]) => t === n)?.[0] ?? null;
}
function Hn(n) {
  return n !== "menu-item" ? {} : {
    variant: "ghost",
    size: "2",
    style: { width: "100%", justifyContent: "flex-start", gap: 8 }
  };
}
const Rn = ({
  tool: n,
  presentation: e = "toolbar-icon",
  label: t,
  colorOnHover: o = !1,
  default_signatures: r,
  default_stamps: s
}) => {
  const { t: i } = ve(["annotator"], { useSuspense: !1 }), { defaultOptions: a } = It(), { painter: l, requestWrite: u } = ot(), d = se((N) => N.currentAnnotationType), h = ke(() => Bc(n), [n]), p = l?.can("annotation.create") ?? !1, f = d?.type === h.type, m = t ?? i(`annotator:tool.${h.name}`), g = Hn(e), y = o && e === "toolbar-icon" && f && !!h.styleEditable?.color, [b, S] = Y(!1), w = j(null), C = j(null), E = j(null), I = j(!1), H = X(() => {
    w.current !== null && (window.clearTimeout(w.current), w.current = null);
  }, []), B = X(() => {
    H(), I.current = !0, y && S(!0);
  }, [H, y]), W = X(() => {
    H(), I.current = !1, S(!1);
  }, [H]), D = X((N) => N instanceof Node ? !!(C.current?.contains(N) || E.current?.contains(N)) : !1, []), k = X((N) => {
    if (D(N?.relatedTarget ?? null)) {
      I.current = !0, H();
      return;
    }
    I.current = !1, H(), w.current = window.setTimeout(() => {
      w.current = null, I.current || S(!1);
    }, 120);
  }, [H, D]);
  ne(() => (y || W(), H), [H, W, y]), ne(() => {
    if (!y || !b) return;
    const N = (Z) => {
      if (D(Z.target)) {
        I.current = !0, H();
        return;
      }
      I.current && k();
    };
    return document.addEventListener("pointermove", N, !0), () => document.removeEventListener("pointermove", N, !0);
  }, [H, y, b, D, k]);
  const L = X(async (N = null) => {
    if (!p && u && !await u({ kind: "tool", tool: n }))
      return;
    const Z = f ? null : h;
    l?.activate(Z, Z && [R.SIGNATURE, R.STAMP].includes(Z.type) ? N : null);
  }, [h, p, l, u, f, n]), $ = p || !!u, G = X(() => {
    p || !u || u({ kind: "tool", tool: n });
  }, [p, u, n]);
  if (n === "signature")
    return /* @__PURE__ */ c(
      Lc,
      {
        annotation: h,
        disabled: !$,
        selected: f,
        presentation: e,
        label: m,
        default_signatures: r,
        onAdd: (N) => L(N),
        onIntent: G
      }
    );
  if (n === "stamp")
    return /* @__PURE__ */ c(
      jc,
      {
        annotation: h,
        disabled: !$,
        selected: f,
        presentation: e,
        label: m,
        default_stamps: s,
        onAdd: (N) => L(N),
        onIntent: G
      }
    );
  const O = /* @__PURE__ */ c(
    xt,
    {
      disabled: n !== "select" && !$,
      selected: f,
      tooltip: e === "menu-item" || y ? "none" : "auto",
      title: String(m),
      label: e === "menu-item" ? m : void 0,
      icon: h.icon,
      buttonProps: g,
      ref: y ? C : void 0,
      onPointerEnter: y ? B : void 0,
      onPointerLeave: y ? k : void 0,
      onClick: () => L()
    }
  );
  return y ? /* @__PURE__ */ c(
    Et,
    {
      value: d?.style?.color || a.colors[0],
      onChange: (N) => {
        if (!d) return;
        const Z = {
          ...d,
          style: { ...d.style, color: N }
        };
        if (l?.can("annotation.create")) {
          l.activate(Z, null);
          return;
        }
        const q = u?.({ kind: "tool", tool: On(Z.type) ?? "select" });
        q && q.then((A) => {
          A && l?.activate(Z, null);
        });
      },
      presets: a.colors,
      popover: !0,
      open: f && b,
      onOpenChange: (N) => {
        f && (N ? (I.current = !0, S(!0)) : I.current || S(!1));
      },
      contentRef: E,
      onContentPointerEnter: B,
      onContentPointerLeave: k,
      onPointerDownOutside: W,
      trigger: O
    }
  ) : O;
}, nr = ({ presentation: n = "toolbar-icon" }) => {
  const { defaultOptions: e } = It(), { painter: t, requestWrite: o } = ot(), r = se((l) => l.currentAnnotationType), s = !r?.styleEditable?.color, i = Hn(n), a = (l) => {
    if (!r) return;
    const u = {
      ...r,
      style: { ...r.style, color: l }
    };
    if (t?.can("annotation.create")) {
      t.activate(u, null);
      return;
    }
    const d = o?.({ kind: "tool", tool: On(u.type) ?? "select" });
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
            fs,
            {
              style: { "--palette-preview-color": r?.style?.color }
            }
          )
        }
      )
    }
  );
}, or = ({ presentation: n = "toolbar-icon" }) => {
  const { t: e } = ve(["annotator"], { useSuspense: !1 }), { painter: t } = ot(), [o, r] = Y(!1), s = Hn(n);
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
      icon: /* @__PURE__ */ c(gs, {}),
      onClick: () => {
        if (!t) return;
        const i = !t.areAnnotationAuthorLabelsVisible();
        t.setAnnotationAuthorLabelsVisible(i), r(i);
      }
    }
  );
}, Wc = ({ defaultAnnotationName: n = "", stamps: e, signatures: t }) => {
  const o = n ? De.find((s) => s.name === n) ?? null : null, { painter: r } = ot();
  return Pt.useEffect(() => {
    if (o)
      return r?.activate(o, null), () => {
        r?.activate(null, null);
      };
  }, [o, r]), /* @__PURE__ */ T(Q, { gap: "3", align: "center", children: [
    /* @__PURE__ */ c(qt, {}),
    /* @__PURE__ */ c(nt, { orientation: "vertical" }),
    /* @__PURE__ */ c(Rn, { tool: "select" }),
    De.filter((s) => s.webSelectionDependencies === !1 && s.type !== R.SELECT).map((s) => /* @__PURE__ */ c(
      Rn,
      {
        tool: s.name,
        default_stamps: s.type === R.STAMP ? e : void 0,
        default_signatures: s.type === R.SIGNATURE ? t : void 0
      },
      s.name
    )),
    /* @__PURE__ */ c(nt, { orientation: "vertical" }),
    /* @__PURE__ */ c(nr, {}),
    /* @__PURE__ */ c(nt, { orientation: "vertical" }),
    /* @__PURE__ */ c(or, {})
  ] });
}, Vc = ({ defaultAnnotationName: n, stamps: e, signatures: t }) => /* @__PURE__ */ c(
  Wc,
  {
    defaultAnnotationName: n,
    stamps: e,
    signatures: t
  }
), $c = {
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
}, Yc = ({ children: n, requestWrite: e }) => {
  const [t, o] = Y(null), [r, s] = Y(0), i = X(() => s((l) => l + 1), []), a = ke(
    () => ({ painter: t, setPainter: o, refreshPainter: i, revision: r, requestWrite: e }),
    [t, i, e, r]
  );
  return /* @__PURE__ */ c(qo.Provider, { value: a, children: n });
}, Kc = "_filter_xc5y0_1", Xc = "_sidebar_xc5y0_19", qc = "_list_xc5y0_19", Jc = "_group_xc5y0_23", Zc = "_comment_xc5y0_26", Qc = "_title_xc5y0_39", el = "_annotationHeader_xc5y0_52", tl = "_annotationHeading_xc5y0_56", nl = "_annotationHeadingActive_xc5y0_60", ol = "_annotationMeta_xc5y0_63", rl = "_annotationAuthor_xc5y0_68", il = "_annotationDateTime_xc5y0_74", sl = "_toolButton_xc5y0_78", al = "_reply_xc5y0_81", cl = "_replyMeta_xc5y0_91", ll = "_selected_xc5y0_100", dl = "_annotationTypeIcon_xc5y0_111", ul = "_commentEditor_xc5y0_122", hl = "_replyEditor_xc5y0_127", ge = {
  filter: Kc,
  sidebar: Xc,
  list: qc,
  group: Jc,
  comment: Zc,
  title: Qc,
  annotationHeader: el,
  annotationHeading: tl,
  annotationHeadingActive: nl,
  annotationMeta: ol,
  annotationAuthor: rl,
  annotationDateTime: il,
  toolButton: sl,
  reply: al,
  replyMeta: cl,
  selected: ll,
  annotationTypeIcon: dl,
  commentEditor: ul,
  replyEditor: hl
}, pl = /^#([1-9]\d*)$/;
function fl(n) {
  if (!n || typeof n != "object") return !1;
  const e = n;
  if (e.type !== "annotation" || typeof e.annotationId != "string" || e.annotationId.length === 0 || typeof e.label != "string")
    return !1;
  const t = pl.exec(e.label);
  return !!(t && Number.isSafeInteger(Number(t[1])));
}
function gl(n, e) {
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
function Zt(n, e) {
  if (!e?.length) return;
  const t = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  e.forEach((i) => {
    if (!fl(i) || r.has(i.label)) return;
    const a = gl(n, i.label);
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
function Pn(n, e, t) {
  const o = Zt(n, e);
  if (!o) return { content: n };
  const r = new Map(
    t.map((h) => [h.id, h])
  ), s = /* @__PURE__ */ new Map(), i = o.map((h) => {
    const p = r.get(h.annotationId)?.referenceNumber;
    if (p === void 0) return h;
    const f = `#${p}`;
    return s.set(h.label, f), f === h.label ? h : { ...h, label: f };
  }), a = Array.from(s.entries()).filter(([h, p]) => h !== p);
  if (a.length === 0)
    return { content: n, references: o };
  const l = a.map(([h]) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).sort((h, p) => p.length - h.length), u = new RegExp(`(?:${l.join("|")})(?!\\d)`, "g"), d = n.replace(
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
const ml = 20, vl = /^[\p{L}\p{N}_-]*$/u, yl = /[\s([{'",.!?;:“‘，。！？、：；]/;
function bl(n, e) {
  const t = n.slice(0, e), o = t.lastIndexOf("#");
  if (o === -1) return null;
  const r = n[o - 1];
  if (r && !yl.test(r)) return null;
  const s = t.slice(o + 1);
  return vl.test(s) ? {
    start: o,
    end: e,
    query: s
  } : null;
}
function Sl(n, e, t) {
  const o = e.trim().toLocaleLowerCase();
  return n.filter((r) => r.id === t || r.referenceNumber === void 0 ? !1 : o ? [
    r.referenceNumber,
    `#${r.referenceNumber}`,
    r.title,
    r.pageNumber,
    r.subtype,
    r.contentsObj?.text
  ].filter((i) => i != null).join(" ").toLocaleLowerCase().includes(o) : !0).sort((r, s) => r.referenceNumber - s.referenceNumber).slice(0, ml);
}
const wl = new Map(
  De.map((n) => [n.type, n.icon])
), rr = ({
  type: n,
  label: e,
  className: t,
  decorative: o = !1,
  showTooltip: r = !0
}) => {
  const s = wl.get(n);
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
}, Cl = "_referenceInput_dfggt_1", xl = "_editor_dfggt_5", Tl = "_referenceMenu_dfggt_9", Al = "_referenceOption_dfggt_17", kl = "_referenceOptionHeader_dfggt_49", El = "_referenceTypeIcon_dfggt_53", Rl = "_referencePage_dfggt_71", Pl = "_referenceSummary_dfggt_77", Il = "_referenceMeta_dfggt_87", Nl = "_referenceAuthor_dfggt_97", Ml = "_referenceDate_dfggt_103", Dl = "_referenceEmpty_dfggt_107", Ll = "_submit_dfggt_112", We = {
  referenceInput: Cl,
  editor: xl,
  referenceMenu: Tl,
  referenceOption: Al,
  referenceOptionHeader: kl,
  referenceTypeIcon: El,
  referencePage: Rl,
  referenceSummary: Pl,
  referenceMeta: Il,
  referenceAuthor: Nl,
  referenceDate: Ml,
  referenceEmpty: Dl,
  submit: Ll
}, _l = /^[\s.,!?;:'"<>/\\，。！？；：、“”‘’《》（）()[\]{}]/, Ol = new Map(
  De.map((n) => [n.type, n.name])
);
function Hl(n) {
  const e = n.contentsObj;
  return (e?.text || e?.selectedText || "").replace(/\s+/g, " ").trim();
}
const bn = ({
  annotations: n,
  excludeAnnotationId: e,
  initialContent: t = "",
  initialReferences: o,
  className: r,
  placeholder: s,
  onSubmit: i,
  onCancel: a
}) => {
  const { t: l } = ve(["annotator", "common"], { useSuspense: !1 }), u = j(null);
  u.current === null && (u.current = Pn(
    t,
    o,
    n
  ));
  const [d, h] = Y(u.current.content), [p, f] = Y(
    () => u.current?.references ?? []
  ), [m, g] = Y(null), [y, b] = Y(0), S = j(null), w = j(null), C = j(null), E = j(null), I = j(!1), H = j(null), B = j([]), W = pr(), D = ke(
    () => Sl(
      n,
      m?.query ?? "",
      e
    ),
    [n, e, m?.query]
  ), k = m !== null, L = D.length > 0 ? Math.min(y, D.length - 1) : 0;
  Qe(() => {
    const A = requestAnimationFrame(() => {
      S.current?.focus();
    });
    return () => cancelAnimationFrame(A);
  }, []), Qe(() => {
    const A = E.current;
    A !== null && (E.current = null, S.current?.focus(), S.current?.setSelectionRange(A, A));
  }, [d]), Qe(() => () => {
    H.current !== null && cancelAnimationFrame(H.current);
  }, []), Qe(() => {
    k && B.current[L]?.scrollIntoView?.({
      block: "nearest"
    });
  }, [L, k]);
  const $ = (A, U) => {
    const J = bl(A, U);
    g(J), b(0);
  }, G = (A) => {
    const U = A.target.value;
    h(U), f(Zt(U, p) ?? []), I.current || $(U, A.target.selectionStart);
  }, O = (A) => {
    if (!m || A.referenceNumber === void 0) return;
    const U = `#${A.referenceNumber}`, J = d.slice(0, m.start), P = d.slice(m.end), K = P.length === 0 || !_l.test(P) ? " " : "", ce = `${J}${U}${K}${P}`, le = [
      ...p.filter((_) => _.label !== U),
      {
        type: "annotation",
        annotationId: A.id,
        label: U
      }
    ];
    E.current = J.length + U.length + K.length, h(ce), f(Zt(ce, le) ?? []), g(null), b(0);
  }, N = () => {
    i(Pn(
      d,
      p,
      n
    ));
  }, Z = (A) => {
    if (!(A.nativeEvent.isComposing || I.current || A.keyCode === 229)) {
      if (k) {
        if (A.key === "ArrowDown") {
          A.preventDefault(), D.length > 0 && b((L + 1) % D.length);
          return;
        }
        if (A.key === "ArrowUp") {
          A.preventDefault(), D.length > 0 && b((L - 1 + D.length) % D.length);
          return;
        }
        if (A.key === "Enter") {
          A.preventDefault();
          const U = D[L];
          U && O(U);
          return;
        }
        if (A.key === "Escape") {
          A.preventDefault(), g(null);
          return;
        }
      }
      if (A.key === "Escape") {
        A.preventDefault(), a();
        return;
      }
      A.key === "Enter" && !A.shiftKey && (A.preventDefault(), N());
    }
  }, q = (A) => {
    A.relatedTarget instanceof Node && (w.current?.contains(A.relatedTarget) || C.current?.contains(A.relatedTarget)) || (H.current !== null && cancelAnimationFrame(H.current), H.current = requestAnimationFrame(() => {
      H.current = null, !w.current?.contains(document.activeElement) && !C.current?.contains(document.activeElement) && a();
    }));
  };
  return /* @__PURE__ */ T(
    "div",
    {
      ref: w,
      "data-annotation-editor": !0,
      className: `${We.referenceInput} ${r ?? ""}`,
      onBlurCapture: q,
      onClick: (A) => A.stopPropagation(),
      children: [
        /* @__PURE__ */ c("div", { className: We.editor, children: /* @__PURE__ */ T(
          Ae.Root,
          {
            open: k,
            onOpenChange: (A) => {
              A || g(null);
            },
            children: [
              /* @__PURE__ */ c(Ae.Trigger, { children: /* @__PURE__ */ c(
                Er,
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
                  "aria-activedescendant": k && D.length > 0 ? `${W}-option-${L}` : void 0,
                  onChange: G,
                  onClick: (A) => $(A.currentTarget.value, A.currentTarget.selectionStart),
                  onKeyDown: Z,
                  onKeyUp: (A) => {
                    !I.current && !["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(A.key) && $(A.currentTarget.value, A.currentTarget.selectionStart);
                  },
                  onCompositionStart: () => {
                    I.current = !0;
                  },
                  onCompositionEnd: (A) => {
                    I.current = !1, $(A.currentTarget.value, A.currentTarget.selectionStart);
                  }
                }
              ) }),
              /* @__PURE__ */ c(
                Ae.Content,
                {
                  ref: C,
                  container: w.current,
                  id: W,
                  className: We.referenceMenu,
                  role: "listbox",
                  size: "1",
                  side: "bottom",
                  align: "start",
                  sideOffset: 4,
                  collisionPadding: 8,
                  onOpenAutoFocus: (A) => A.preventDefault(),
                  onCloseAutoFocus: (A) => {
                    A.preventDefault(), S.current?.focus();
                  },
                  children: D.length > 0 ? D.map((A, U) => {
                    const J = Hl(A), P = Ol.get(A.type), K = P ? l(`annotator:tool.${P}`) : A.subtype, ce = xn(A.date);
                    return /* @__PURE__ */ T(
                      "div",
                      {
                        id: `${W}-option-${U}`,
                        ref: (le) => {
                          B.current[U] = le;
                        },
                        role: "option",
                        "aria-selected": U === L,
                        className: We.referenceOption,
                        onMouseEnter: () => b(U),
                        onMouseDown: (le) => le.preventDefault(),
                        onClick: () => O(A),
                        children: [
                          /* @__PURE__ */ T(Q, { align: "center", gap: "2", className: We.referenceOptionHeader, children: [
                            /* @__PURE__ */ T(Rr, { size: "1", radius: "full", variant: "soft", children: [
                              "#",
                              A.referenceNumber
                            ] }),
                            /* @__PURE__ */ c(ae, { as: "span", size: "1", color: "gray", className: We.referencePage, children: l("annotator:comment.page", { value: A.pageNumber }) })
                          ] }),
                          /* @__PURE__ */ c(ae, { as: "span", size: "2", className: We.referenceSummary, children: J || l("annotator:comment.reference.noContent") }),
                          /* @__PURE__ */ T(ae, { as: "span", size: "1", color: "gray", className: We.referenceMeta, children: [
                            /* @__PURE__ */ c(
                              rr,
                              {
                                type: A.type,
                                label: K,
                                className: We.referenceTypeIcon,
                                decorative: !0,
                                showTooltip: !1
                              }
                            ),
                            /* @__PURE__ */ c("span", { className: We.referenceAuthor, children: A.title }),
                            ce && /* @__PURE__ */ T(ye, { children: [
                              /* @__PURE__ */ c("span", { "aria-hidden": "true", children: "·" }),
                              /* @__PURE__ */ c("span", { className: We.referenceDate, children: ce })
                            ] })
                          ] })
                        ]
                      },
                      A.id
                    );
                  }) : /* @__PURE__ */ c(ae, { as: "div", size: "2", color: "gray", className: We.referenceEmpty, children: l("annotator:comment.reference.empty") })
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
            onMouseDown: (A) => A.preventDefault(),
            onClick: N,
            children: l("common:confirm")
          }
        )
      ]
    }
  );
};
function Gl(n) {
  return n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Ul(n, e) {
  if (!n || !e?.length)
    return [{ kind: "text", value: n }];
  const t = new Map(
    e.map((a) => [a.label, a])
  ), o = Array.from(t.keys()).sort((a, l) => l.length - a.length), r = new RegExp(
    `(${o.map(Gl).join("|")})(?!\\d)`,
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
const zl = "_content_1x9x1_1", Fl = "_reference_1x9x1_6", jl = "_unavailable_1x9x1_29", Sn = {
  content: zl,
  reference: Fl,
  unavailable: jl
}, uo = ({
  annotations: n,
  content: e = "",
  references: t,
  onActivate: o
}) => {
  const { t: r } = ve("annotator", { useSuspense: !1 }), s = ke(
    () => new Map(n.map((l) => [l.id, l])),
    [n]
  ), i = ke(
    () => Pn(e, t, n),
    [n, e, t]
  ), a = ke(
    () => Ul(
      i.content,
      i.references
    ),
    [i]
  );
  return /* @__PURE__ */ c("span", { className: Sn.content, children: a.map((l, u) => {
    if (l.kind === "text")
      return /* @__PURE__ */ c(Pt.Fragment, { children: l.value }, `text-${u}`);
    const d = s.get(l.annotationId);
    return d ? /* @__PURE__ */ c(
      er,
      {
        annotation: d,
        onActivate: o,
        children: /* @__PURE__ */ c(
          "button",
          {
            className: Sn.reference,
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
        className: Sn.unavailable,
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
function Bl(n, e) {
  return {
    ...n || { text: "" },
    text: e.content,
    references: e.references
  };
}
function Wl({
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
function Vl(n, e, t, o, r) {
  return n.map((s) => s.id === e ? {
    ...s,
    content: t.content,
    references: t.references,
    date: o,
    title: r
  } : s);
}
const ho = new Map(
  De.map((n) => [n.type, n.name])
), jt = {
  [at.Accepted]: {
    labelKey: "annotator:comment.status.accepted",
    icon: /* @__PURE__ */ c($r, {})
  },
  [at.Rejected]: {
    labelKey: "annotator:comment.status.rejected",
    icon: /* @__PURE__ */ c(Vr, {})
  },
  [at.Cancelled]: {
    labelKey: "annotator:comment.status.cancelled",
    icon: /* @__PURE__ */ c(Wr, {})
  },
  [at.Completed]: {
    labelKey: "annotator:comment.status.completed",
    icon: /* @__PURE__ */ c(Br, {})
  },
  [at.Closed]: {
    labelKey: "annotator:comment.status.closed",
    icon: /* @__PURE__ */ c(jr, {})
  },
  [at.None]: {
    labelKey: "annotator:comment.status.none",
    icon: /* @__PURE__ */ c(Fr, {})
  }
}, $l = () => {
  const n = se((v) => v.annotations), e = Ht(Ln), { isSidebarCollapsed: t } = Fe(), { painter: o, requestWrite: r } = ot(), s = !!r, i = se((v) => v.selectedAnnotation), a = se((v) => v.selectionRevision), l = se((v) => v.setSelectedAnnotation), [u, d] = Y(null), [h, p] = Y([]), [f, m] = Y([]), [g, y] = Y(null), b = j(null), S = j(null), w = j(null), C = j(null), { t: E } = ve(["common", "annotator"], { useSuspense: !1 }), I = u?.annotationId ?? null;
  ne(() => {
    const v = i?.store?.id;
    if (!v || i.source !== et.CANVAS || t)
      return;
    const x = se.getState().getAnnotation(v);
    if (!x) return;
    const z = !!(o?.can("annotation.edit", x) || s), V = x.contentsObj?.text === "", ue = x.comments?.length === 0;
    d(
      z && V && ue ? { kind: "annotation-edit", annotationId: x.id } : o?.can("annotation.comment", x) || s ? { kind: "annotation-reply", annotationId: x.id } : null
    );
  }, [
    i?.source,
    i?.store?.id,
    t,
    o,
    s,
    a
  ]);
  const H = j({});
  Qe(() => {
    if (!u) return;
    const v = requestAnimationFrame(() => {
      H.current[u.annotationId]?.querySelector("[data-annotation-editor]")?.scrollIntoView?.({
        behavior: "auto",
        block: "nearest",
        inline: "nearest"
      });
    });
    return () => cancelAnimationFrame(v);
  }, [u]);
  const B = ke(() => {
    const v = /* @__PURE__ */ new Map();
    return n.forEach((x) => {
      v.set(x.title, (v.get(x.title) || 0) + 1);
    }), Array.from(v.entries());
  }, [n]), W = ke(() => {
    const v = /* @__PURE__ */ new Map();
    return n.forEach((x) => {
      const z = v.get(x.type);
      v.set(x.type, {
        count: (z?.count || 0) + 1,
        fallbackLabel: z?.fallbackLabel || x.subtype
      });
    }), Array.from(v.entries());
  }, [n]);
  ne(() => {
    const v = new Set(B.map(([z]) => z)), x = b.current;
    b.current = v, p((z) => {
      if (x === null) return Array.from(v);
      const V = z.filter((pe) => v.has(pe)), ue = Array.from(v).filter((pe) => !x.has(pe)), he = [...V, ...ue];
      return he.length === z.length && he.every((pe, we) => pe === z[we]) ? z : he;
    });
  }, [B]), ne(() => {
    const v = new Set(W.map(([z]) => z)), x = S.current;
    S.current = v, m((z) => {
      if (x === null) return Array.from(v);
      const V = z.filter((pe) => v.has(pe)), ue = Array.from(v).filter((pe) => !x.has(pe)), he = [...V, ...ue];
      return he.length === z.length && he.every((pe, we) => pe === z[we]) ? z : he;
    });
  }, [W]), ne(() => () => {
    C.current !== null && cancelAnimationFrame(C.current), w.current = null;
  }, []);
  const D = ke(() => h.length === 0 || f.length === 0 ? [] : Array.from(n.values()).filter((v) => h.includes(v.title) && f.includes(v.type)), [n, h, f]);
  ne(() => {
    if (!u) return;
    const v = i?.store?.id, x = D.some(
      (V) => V.id === u.annotationId
    ), z = !!(v && v !== u.annotationId && i?.source === et.CANVAS);
    x && !t && (v === u.annotationId || z) || d(null);
  }, [
    i?.source,
    i?.store?.id,
    u,
    D,
    t
  ]);
  const k = ke(
    () => Array.from(n.values()),
    [n]
  ), L = ke(() => D.reduce(
    (v, x) => (v[x.pageNumber] || (v[x.pageNumber] = []), v[x.pageNumber].push(x), v),
    {}
  ), [D]);
  ne(() => {
    if (!g) return;
    const v = window.requestAnimationFrame(() => {
      const x = H.current[g];
      x && (x.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      }), y(null));
    });
    return () => window.cancelAnimationFrame(v);
  }, [L, g]);
  const $ = (v) => {
    p((x) => x.includes(v) ? x.filter((z) => z !== v) : [...x, v]);
  }, G = (v) => {
    m((x) => x.includes(v) ? x.filter((z) => z !== v) : [...x, v]);
  }, O = /* @__PURE__ */ T("div", { className: ge.filter, children: [
    /* @__PURE__ */ c(ae, { as: "div", children: E("author") }),
    /* @__PURE__ */ c("ul", { children: B.map(([v, x]) => /* @__PURE__ */ c("li", { children: /* @__PURE__ */ c(ae, { as: "label", size: "2", children: /* @__PURE__ */ T(Q, { gap: "2", children: [
      /* @__PURE__ */ c($t, { checked: h.includes(v), onCheckedChange: () => $(v) }),
      v,
      " (",
      x,
      ")"
    ] }) }) }, v)) }),
    /* @__PURE__ */ c(ae, { as: "div", children: E("type") }),
    /* @__PURE__ */ c("ul", { children: W.map(([v, { count: x, fallbackLabel: z }]) => {
      const V = ho.get(v), ue = V ? E(`annotator:tool.${V}`) : z;
      return /* @__PURE__ */ c("li", { children: /* @__PURE__ */ c(ae, { as: "label", size: "2", children: /* @__PURE__ */ T(Q, { gap: "2", children: [
        /* @__PURE__ */ c($t, { checked: f.includes(v), onCheckedChange: () => G(v) }),
        ue,
        " (",
        x,
        ")"
      ] }) }) }, v);
    }) }),
    /* @__PURE__ */ T(Q, { gap: "3", mt: "2", justify: "between", children: [
      /* @__PURE__ */ c(
        be,
        {
          variant: "ghost",
          onClick: () => {
            p(B.map(([v]) => v)), m(W.map(([v]) => v));
          },
          children: E("selectAll")
        }
      ),
      /* @__PURE__ */ c(
        be,
        {
          variant: "ghost",
          onClick: () => {
            p([]), m([]);
          },
          children: E("clear")
        }
      )
    ] })
  ] }), N = (v) => [...v.comments || []].reverse().find((z) => z.status !== void 0 && z.status !== null)?.status ?? at.None, Z = (v) => {
    const x = N(v);
    return jt[x]?.icon ?? jt[at.None].icon;
  }, q = (v) => {
    I && I !== v.id && d(null), l(v, et.SIDEBAR), o?.highlight(v);
  }, A = (v) => {
    I && (v.preventDefault(), v.stopPropagation(), d(null));
  }, U = (v) => {
    _("annotation.comment", v).then((x) => {
      x && (q(x), d({
        kind: "annotation-reply",
        annotationId: x.id
      }));
    });
  }, J = (v) => {
    _("annotation.edit", v).then((x) => {
      x && (q(x), d({
        kind: "annotation-edit",
        annotationId: x.id
      }));
    });
  }, P = (v, x) => {
    _("comment.edit", v, x).then((z) => {
      const V = z?.comments?.find((ue) => ue.id === x.id);
      !z || !V || (q(z), d({
        kind: "reply-edit",
        annotationId: z.id,
        replyId: V.id
      }));
    });
  }, K = (v) => {
    w.current = v;
  }, ce = (v) => {
    v.preventDefault();
    const x = w.current;
    w.current = null, x && (C.current !== null && cancelAnimationFrame(C.current), C.current = requestAnimationFrame(() => {
      C.current = null, x();
    }));
  }, le = (v) => {
    const x = n.get(v);
    x && (p((z) => z.includes(x.title) ? z : [...z, x.title]), m((z) => z.includes(x.type) ? z : [...z, x.type]), y(x.id), l(x, et.SIDEBAR), o?.highlight(x));
  }, _ = async (v, x, z) => o?.can(v, x, z) ? x : !r || !await r({ kind: "mutation", action: v, annotationId: x.id }) ? null : se.getState().getAnnotation(x.id) ?? x, te = (v, x) => {
    const z = se.getState().getAnnotation(v.id);
    !z || !o || _("annotation.edit", z).then((V) => {
      V && (o.update(V.id, {
        contentsObj: Bl(V.contentsObj, x),
        date: Vt(Date.now())
      }, "annotation.edit"), d(null));
    });
  }, de = (v, x, z) => {
    const V = se.getState().getAnnotation(v.id);
    if (!V || !o) return;
    const ue = z === void 0 ? "annotation.comment" : "annotation.change-status";
    _(ue, V).then((he) => {
      if (!he) return;
      const pe = e?.user ?? void 0, we = Wl({
        id: Uo(),
        title: pe?.name ?? "Anonymous",
        date: Vt(Date.now()),
        draft: x,
        status: z,
        user: pe
      });
      o.update(he.id, {
        comments: [...he.comments || [], we]
      }, ue), d(null);
    });
  }, fe = (v, x, z) => {
    const V = se.getState().getAnnotation(v.id), ue = V?.comments?.find((he) => he.id === x.id);
    !V || !ue || !o || _("comment.edit", V, ue).then((he) => {
      const pe = he?.comments?.find((Be) => Be.id === ue.id);
      if (!he || !pe) return;
      const we = Vl(
        he.comments || [],
        pe.id,
        z,
        Vt(Date.now()),
        e?.user?.name || pe.title
      );
      o.update(he.id, {
        comments: we
      }, "comment.edit", pe), d(null);
    });
  }, xe = (v) => {
    o && _("annotation.delete", v).then((x) => {
      x && o.delete(x.id, !0);
    });
  }, Je = (v, x) => {
    o && _("comment.delete", v, x).then((z) => {
      !z || !o.deleteComment(z.id, x.id) || u?.kind === "reply-edit" && u.replyId === x.id && d(null);
    });
  }, Ve = (v) => {
    if (u?.kind === "annotation-edit" && u.annotationId === v.id && i?.store?.id === v.id)
      return /* @__PURE__ */ c(
        bn,
        {
          annotations: k,
          excludeAnnotationId: v.id,
          initialContent: v.contentsObj?.text,
          initialReferences: v.contentsObj?.references,
          className: ge.commentEditor,
          placeholder: E("annotator:comment.reference.commentPlaceholder"),
          onSubmit: (z) => te(v, z),
          onCancel: () => {
            d(null);
          }
        }
      );
    const x = v.contentsObj?.text;
    return x?.trim() ? /* @__PURE__ */ c(Q, { gap: "3", pl: "4", children: /* @__PURE__ */ c(ae, { as: "p", size: "2", children: /* @__PURE__ */ c(
      uo,
      {
        annotations: k,
        content: x,
        references: v.contentsObj?.references,
        onActivate: le
      }
    ) }) }) : null;
  }, He = (v) => u?.kind === "annotation-reply" && u.annotationId === v.id && i?.store?.id === v.id ? /* @__PURE__ */ c(
    bn,
    {
      annotations: k,
      excludeAnnotationId: v.id,
      className: ge.commentEditor,
      placeholder: E("annotator:comment.reference.replyPlaceholder"),
      onSubmit: (x) => de(v, x),
      onCancel: () => {
        d(null);
      }
    }
  ) : null, je = (v, x) => u?.kind === "reply-edit" && u.annotationId === v.id && u.replyId === x.id ? /* @__PURE__ */ c(
    bn,
    {
      annotations: k,
      excludeAnnotationId: v.id,
      initialContent: x.content,
      initialReferences: x.references,
      className: ge.replyEditor,
      placeholder: E("annotator:comment.reference.replyPlaceholder"),
      onSubmit: (z) => fe(v, x, z),
      onCancel: () => {
        d(null);
      }
    }
  ) : /* @__PURE__ */ c(Q, { gap: "3", children: /* @__PURE__ */ c(ae, { as: "p", size: "2", children: /* @__PURE__ */ c(
    uo,
    {
      annotations: k,
      content: x.content,
      references: x.references,
      onActivate: le
    }
  ) }) }), $e = Object.entries(L).map(([v, x]) => {
    const z = x.sort((V, ue) => V.konvaClientRect.y - ue.konvaClientRect.y);
    return /* @__PURE__ */ T("div", { className: ge.group, children: [
      /* @__PURE__ */ T(Q, { gap: "2", justify: "between", p: "1", children: [
        /* @__PURE__ */ c(ae, { size: "1", children: E("annotator:comment.page", { value: v }) }),
        /* @__PURE__ */ c(ae, { size: "1", children: E("annotator:comment.total", { value: x.length }) })
      ] }),
      z.map((V) => {
        const ue = V.id === i?.store?.id, he = !!(o?.can("annotation.comment", V) || s), pe = !!(o?.can("annotation.edit", V) || s), we = !!(o?.can("annotation.delete", V) || s), Be = !!(o?.can("annotation.change-status", V) || s), ht = N(V), Ye = Ko(V) ?? V.title, Oe = mt(V.referenceNumber), Ge = Oe ? `#${V.referenceNumber}` : Ye, vt = Oe && ue, wt = jn(V.date), Gt = ho.get(V.type), rn = Gt ? E(`annotator:tool.${Gt}`) : V.subtype, sn = {
          className: [
            ge.comment,
            ue ? ge.selected : ""
          ].filter(Boolean).join(" "),
          id: `annotation-${V.id}`
        };
        return /* @__PURE__ */ fr(
          "div",
          {
            ...sn,
            key: V.id,
            onClick: () => q(V),
            ref: (Ce) => H.current[V.id] = Ce
          },
          /* @__PURE__ */ T("div", { className: `${ge.title} ${ge.annotationHeader}`, children: [
            /* @__PURE__ */ T(
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
                  V.native && /* @__PURE__ */ c(Rt, { content: E("annotator:comment.nativeAnnotation"), children: /* @__PURE__ */ c("span", { children: /* @__PURE__ */ c(Ur, {}) }) })
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
                        "aria-label": E(jt[ht].labelKey),
                        onPointerDown: A,
                        style: {
                          boxShadow: "none"
                        },
                        children: Z(V)
                      }
                    ) }),
                    /* @__PURE__ */ c(
                      me.Content,
                      {
                        onCloseAutoFocus: ce,
                        children: Object.entries(jt).map(([Ce, pt]) => /* @__PURE__ */ T(
                          me.Item,
                          {
                            onSelect: () => {
                              de(
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
                        onPointerDown: A,
                        style: {
                          boxShadow: "none"
                        },
                        children: /* @__PURE__ */ c(zn, {})
                      }
                    ) }),
                    /* @__PURE__ */ T(
                      me.Content,
                      {
                        onCloseAutoFocus: ce,
                        children: [
                          he && /* @__PURE__ */ c(
                            me.Item,
                            {
                              onSelect: (Ce) => {
                                Ce.stopPropagation(), K(() => U(V));
                              },
                              children: E("reply")
                            }
                          ),
                          pe && /* @__PURE__ */ c(
                            me.Item,
                            {
                              onSelect: (Ce) => {
                                Ce.stopPropagation(), K(() => J(V));
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
              rr,
              {
                type: V.type,
                label: rn,
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
                children: Ye
              }
            ),
            wt && /* @__PURE__ */ T(ye, { children: [
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
          Ve(V),
          V.comments?.map((Ce) => {
            const pt = jn(Ce.date), yt = !!(o?.can("comment.edit", V, Ce) || s), rt = !!(o?.can("comment.delete", V, Ce) || s);
            return /* @__PURE__ */ T("div", { className: ge.reply, children: [
              /* @__PURE__ */ T("div", { className: `${ge.title} ${ge.annotationHeader}`, children: [
                /* @__PURE__ */ c(
                  ae,
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
                          onPointerDown: A,
                          style: {
                            boxShadow: "none"
                          },
                          children: /* @__PURE__ */ c(zn, {})
                        }
                      ) }),
                      /* @__PURE__ */ T(
                        me.Content,
                        {
                          onCloseAutoFocus: ce,
                          children: [
                            yt && /* @__PURE__ */ c(
                              me.Item,
                              {
                                onSelect: (it) => {
                                  it.stopPropagation(), K(() => P(V, Ce));
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
              pt && /* @__PURE__ */ c(Q, { align: "center", className: `${ge.annotationMeta} ${ge.replyMeta}`, children: /* @__PURE__ */ c(ae, { as: "span", size: "1", color: "gray", children: pt }) }),
              je(V, Ce)
            ] }, Ce.id);
          }),
          /* @__PURE__ */ T("div", { children: [
            He(V),
            he && !u && i?.store?.id === V.id && /* @__PURE__ */ c(be, { mt: "2", style: { width: "100%" }, onClick: () => U(V), children: E("reply") })
          ] })
        );
      })
    ] }, v);
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
          children: /* @__PURE__ */ c(zr, {})
        }
      ) }),
      /* @__PURE__ */ c(Ae.Content, { children: O })
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
    const o = e.node.lookup(F.of("Annots"));
    o ? o.push(t) : e.node.set(F.of("Annots"), e.doc.context.obj([t]));
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
class Yl extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, [s, i] = Pe(e.konvaClientRect, r), a = o.context, l = 32, u = [ee.of(s), ee.of(i), ee.of(s + l), ee.of(i + l)], d = a.obj({
      Type: F.of("Annot"),
      Subtype: F.of("Text"),
      Rect: u,
      NM: re.of(e.id),
      // 唯一标识
      Contents: ie(e.contentsObj?.text || ""),
      Name: F.of("Comment"),
      T: ie(this.getExportTitle(Se("normal.unknownUser"))),
      M: re.of(e.date || ""),
      C: Le(e.color || "#000000"),
      F: ee.of(4),
      P: t.ref,
      Open: !1
    }), h = a.register(d);
    this.addAnnotationToPage(t, h);
    for (const p of e.comments || []) {
      const f = a.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: u,
        Contents: ie(p.content),
        T: ie(p.title || Se("normal.unknownUser")),
        M: re.of(p.date || ""),
        C: Le(e.color || "#000000"),
        IRT: h,
        RT: F.of("R"),
        NM: re.of(p.id),
        // 唯一标识
        Open: !1
      }), m = a.register(f);
      this.addAnnotationToPage(t, m);
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
function Gn(n, e) {
  const t = n.x ?? 0, o = n.y ?? 0, r = n.width ?? 0, s = n.height ?? 0, i = [
    Ct({ x: t, y: o }, e),
    Ct({ x: t + r, y: o }, e),
    Ct({ x: t, y: o + s }, e),
    Ct({ x: t + r, y: o + s }, e)
  ], a = i.map((f) => f.x), l = i.map((f) => f.y), u = Math.min(...a), d = Math.max(...a), h = Math.min(...l), p = Math.max(...l);
  return { x: u, y: h, width: d - u, height: p - h };
}
function In(n, e) {
  const { viewport: t } = e;
  return t.convertToPdfPoint(n.x * t.scale, n.y * t.scale);
}
class Kl extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, i = Tt(e.konvaString), a = (i.children ?? []).filter((h) => h.className === "Rect"), l = [];
    for (const h of a) {
      const p = Gn(h.attrs ?? {}, i), [f, m, g, y] = Pe(p, r);
      l.push(
        f,
        y,
        // 左上
        g,
        y,
        // 右上
        f,
        m,
        // 左下
        g,
        m
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
      T: ie(this.getExportTitle(Se("normal.unknownUser"))),
      // 编号与作者
      // QuadPoints anchor the source text; Contents is only the user-authored note.
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      // 日期
      NM: re.of(e.id),
      // 唯一标识
      F: ee.of(4)
    }), d = s.register(u);
    this.addAnnotationToPage(t, d);
    for (const h of e.comments || []) {
      const p = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: [0, 0, 0, 0],
        Contents: ie(h.content),
        T: ie(h.title || Se("normal.unknownUser")),
        M: re.of(h.date || ""),
        C: Le(e.color || "#000000"),
        IRT: d,
        RT: F.of("R"),
        NM: re.of(h.id),
        // 唯一标识
        Open: !1
      }), f = s.register(p);
      this.addAnnotationToPage(t, f);
    }
  }
}
class Xl extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, i = Tt(e.konvaString), a = (i.children ?? []).filter((h) => h.className === "Rect"), l = [];
    for (const h of a) {
      const p = Gn(h.attrs ?? {}, i), [f, m, g, y] = Pe(p, r);
      l.push(
        f,
        y,
        // 左上
        g,
        y,
        // 右上
        f,
        m,
        // 左下
        g,
        m
        // 右下
      );
    }
    const u = s.obj({
      Type: F.of("Annot"),
      Subtype: F.of("Underline"),
      Rect: Pe(e.konvaClientRect, r),
      QuadPoints: l,
      C: Le(e.color || "#000000"),
      T: ie(this.getExportTitle(Se("normal.unknownUser"))),
      // QuadPoints anchor the source text; Contents is only the user-authored note.
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      F: ee.of(4)
    }), d = s.register(u);
    this.addAnnotationToPage(t, d);
    for (const h of e.comments || []) {
      const p = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: Pe(e.konvaClientRect, r),
        Contents: ie(h.content),
        T: ie(h.title || Se("normal.unknownUser")),
        M: re.of(h.date || ""),
        C: Le(e.color || "#000000"),
        IRT: d,
        RT: F.of("R"),
        NM: re.of(h.id),
        Open: !1
      }), f = s.register(p);
      this.addAnnotationToPage(t, f);
    }
  }
}
class ql extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, i = Tt(e.konvaString), a = (i.children ?? []).filter((h) => h.className === "Rect"), l = [];
    for (const h of a) {
      const p = Gn(h.attrs ?? {}, i), [f, m, g, y] = Pe(p, r);
      l.push(
        f,
        y,
        // 左上
        g,
        y,
        // 右上
        f,
        m,
        // 左下
        g,
        m
        // 右下
      );
    }
    const u = s.obj({
      Type: F.of("Annot"),
      Subtype: F.of("StrikeOut"),
      Rect: Pe(e.konvaClientRect, r),
      QuadPoints: l,
      C: Le(e.color || "#000000"),
      T: ie(this.getExportTitle(Se("normal.unknownUser"))),
      // QuadPoints anchor the source text; Contents is only the user-authored note.
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      F: ee.of(4)
    }), d = s.register(u);
    this.addAnnotationToPage(t, d);
    for (const h of e.comments || []) {
      const p = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: Pe(e.konvaClientRect, r),
        Contents: ie(h.content),
        T: ie(h.title || Se("normal.unknownUser")),
        M: re.of(h.date || ""),
        C: Le(e.color || "#000000"),
        IRT: d,
        RT: F.of("R"),
        NM: re.of(h.id),
        Open: !1
      }), f = s.register(p);
      this.addAnnotationToPage(t, f);
    }
  }
}
class Jl extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, i = Tt(e.konvaString), l = (i.children?.[0] ?? i).attrs ?? i.attrs ?? {}, u = l.strokeWidth ?? 2, d = l.dash ?? [], h = l.opacity ?? 1, p = {
      W: ee.of(u),
      S: F.of(d.length > 0 ? "D" : "S"),
      ...d.length > 0 ? { D: s.obj(d) } : {}
    }, f = s.obj({
      Type: F.of("Annot"),
      Subtype: F.of("Square"),
      Rect: Pe(e.konvaClientRect, r),
      C: Le(e.color || "#000000"),
      // 边框颜色
      T: ie(this.getExportTitle(Se("normal.unknownUser"))),
      // 编号与作者
      Contents: ie(e.contentsObj?.text || ""),
      // 说明文字
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      // 唯一标识
      F: ee.of(4),
      P: t.ref,
      BS: s.obj(p),
      CA: ee.of(h)
    }), m = s.register(f);
    this.addAnnotationToPage(t, m);
    for (const g of e.comments || []) {
      const y = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: Pe(e.konvaClientRect, r),
        Contents: ie(g.content),
        T: ie(g.title || Se("normal.unknownUser")),
        M: re.of(g.date || ""),
        C: Le(e.color || "#000000"),
        IRT: m,
        RT: F.of("R"),
        NM: re.of(g.id),
        Open: !1
      }), b = s.register(y);
      this.addAnnotationToPage(t, b);
    }
  }
}
class Zl extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, a = Tt(e.konvaString).children?.find((y) => y.className === "Ellipse");
    if (!a) throw new Error(`Annotation ${e.id} is missing its ellipse geometry.`);
    const l = a.attrs ?? {}, u = l.strokeWidth ?? 2, d = l.dash ?? [], h = l.opacity ?? 1, p = {
      W: ee.of(u),
      S: F.of(d.length > 0 ? "D" : "S"),
      ...d.length > 0 ? { D: s.obj(d) } : {}
    }, f = Pe(e.konvaClientRect, r), m = s.obj({
      Type: F.of("Annot"),
      Subtype: F.of("Circle"),
      Rect: f,
      C: Le(e.color || "#000000"),
      T: ie(this.getExportTitle(Se("normal.unknownUser"))),
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      F: ee.of(4),
      P: t.ref,
      BS: s.obj(p),
      CA: ee.of(h)
    }), g = s.register(m);
    this.addAnnotationToPage(t, g);
    for (const y of e.comments || []) {
      const b = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: f,
        Contents: ie(y.content),
        T: ie(y.title || Se("normal.unknownUser")),
        M: re.of(y.date || ""),
        C: Le(e.color || "#000000"),
        IRT: g,
        RT: F.of("R"),
        NM: re.of(y.id),
        Open: !1
      }), S = s.register(b);
      this.addAnnotationToPage(t, S);
    }
  }
}
class Ql extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, i = Tt(e.konvaString), a = (i.children ?? []).filter((W) => W.className === "Line"), { groupX: l, groupY: u, scaleX: d, scaleY: h } = this.extractGroupTransform(i), p = r.viewport, f = s.obj(
      a.map((W) => {
        const D = W.attrs?.points ?? [], k = [];
        for (let L = 0; L < D.length; L += 2) {
          const $ = l + D[L] * d, G = u + D[L + 1] * h, O = $ * p.scale, N = G * p.scale, [Z, q] = p.convertToPdfPoint(O, N);
          k.push(Z, q);
        }
        return s.obj(k);
      })
    ), m = a[0]?.attrs ?? {}, g = m.strokeWidth ?? 1, y = m.opacity ?? 1, b = m.stroke ?? e.color ?? "rgb(255, 0, 0)", [S, w, C] = Le(b), E = s.obj({
      W: ee.of(g),
      S: F.of("S")
      // Solid border style
    }), I = Pe(e.konvaClientRect, r), H = s.obj({
      Type: F.of("Annot"),
      Subtype: F.of("Ink"),
      Rect: I,
      InkList: f,
      C: s.obj([ee.of(S), ee.of(w), ee.of(C)]),
      T: ie(this.getExportTitle(Se("normal.unknownUser"))),
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      Border: s.obj([0, 0, 0]),
      BS: E,
      F: ee.of(4),
      P: t.ref,
      CA: ee.of(y)
      // Non-stroking opacity (used for drawing)
    }), B = s.register(H);
    this.addAnnotationToPage(t, B);
    for (const W of e.comments || []) {
      const D = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: I,
        Contents: ie(W.content),
        T: ie(W.title || Se("normal.unknownUser")),
        M: re.of(W.date || ""),
        C: s.obj([ee.of(S), ee.of(w), ee.of(C)]),
        IRT: B,
        RT: F.of("R"),
        NM: re.of(W.id),
        Open: !1
      }), k = s.register(D);
      this.addAnnotationToPage(t, k);
    }
  }
}
class ed extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, [s, , , i] = Pe(e.konvaClientRect, r), a = o.context, l = 20, u = t.getWidth(), d = t.getHeight(), h = Math.max(0, Math.min(s, u - l)), p = Math.max(l, Math.min(i, d)), f = [
      ee.of(h),
      ee.of(p - l),
      ee.of(h + l),
      ee.of(p)
    ], m = JSON.parse(e.konvaString), g = m.children?.find((E) => E.className === "Text"), y = Math.abs(m.attrs?.scaleY ?? 1), b = (g?.attrs?.fontSize ?? 14) * y, S = g?.attrs?.opacity ?? 1, w = a.obj({
      Type: F.of("Annot"),
      Subtype: F.of("Text"),
      InkLayerType: F.of("FreeText"),
      InkLayerFontSize: ee.of(b),
      InkLayerTextWidth: ee.of(e.konvaClientRect.width),
      Rect: f,
      NM: re.of(e.id),
      // 唯一标识
      Contents: ie(e.contentsObj?.text || ""),
      Name: F.of("Comment"),
      T: ie(this.getExportTitle(Se("normal.unknownUser"))),
      M: re.of(e.date || ""),
      C: Le(e.color || "#000000"),
      CA: ee.of(S),
      F: ee.of(4),
      P: t.ref,
      Open: !1
    }), C = a.register(w);
    this.addAnnotationToPage(t, C);
    for (const E of e.comments || []) {
      const I = a.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: f,
        Contents: ie(E.content),
        T: ie(E.title || Se("normal.unknownUser")),
        M: re.of(E.date || ""),
        C: Le(e.color || "#000000"),
        IRT: C,
        RT: F.of("R"),
        NM: re.of(E.id),
        // 唯一标识
        Open: !1
      }), H = a.register(I);
      this.addAnnotationToPage(t, H);
    }
  }
}
function td(n, e, t) {
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
function nd(n, e, t) {
  const o = n % 360;
  return o === 90 || o === 270 ? [0, 0, t, e] : [0, 0, e, t];
}
class od extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, [i, a, l, u] = Pe(e.konvaClientRect, r), d = l - i, h = u - a, p = [ee.of(i), ee.of(a), ee.of(l), ee.of(u)], f = r.pdfPageRotate || 0;
    let m;
    if (e.contentsObj?.image) {
      const S = e.contentsObj.image.replace(/^data:image\/png;base64,/, ""), w = await o.embedPng(S), C = nd(f, d, h), E = s.obj({
        Type: "XObject",
        Subtype: "Form",
        BBox: C,
        Resources: s.obj({
          XObject: {
            Im1: w.ref
          }
        })
      }), I = `q ${td(f, d, h)} ${d} 0 0 ${h} 0 0 cm /Im1 Do Q`, H = Jr.of(E, new TextEncoder().encode(I)), B = s.register(H);
      m = s.obj({
        N: B
      });
    }
    const g = {
      Type: F.of("Annot"),
      Subtype: F.of("Stamp"),
      Rect: p,
      NM: re.of(e.id),
      Contents: ie(e.contentsObj?.text || ""),
      T: ie(this.getExportTitle(Se("normal.unknownUser"))),
      M: re.of(e.date || ""),
      Open: !1,
      P: t.ref,
      F: ee.of(132),
      ...m ? { AP: m } : {}
    }, y = s.obj(g), b = s.register(y);
    this.addAnnotationToPage(t, b);
    for (const S of e.comments || []) {
      const w = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: p,
        Contents: ie(S.content),
        T: ie(S.title || Se("normal.unknownUser")),
        M: re.of(S.date || ""),
        IRT: b,
        RT: F.of("R"),
        NM: re.of(S.id),
        Open: !1
      }), C = s.register(w);
      this.addAnnotationToPage(t, C);
    }
  }
}
function rd(n, e, t, o, r = 10, s = 10) {
  const i = t - n, a = o - e, l = Math.hypot(i, a) || 1, u = i / l, d = a / l, h = -d, p = u, f = t - u * r + h * (s / 2), m = o - d * r + p * (s / 2), g = t - u * r - h * (s / 2), y = o - d * r - p * (s / 2);
  return [t, o, f, m, g, y, t, o];
}
class id extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, i = JSON.parse(e.konvaString), a = i.children.filter((w) => w.className === "Arrow");
    if (a.length === 0) throw new Error(`Arrow annotation ${e.id} has no arrow shape.`);
    const l = s.obj(
      a.map((w) => {
        const C = w.attrs.points;
        if (!C || C.length < 4)
          throw new Error(`Arrow annotation ${e.id} needs at least two points.`);
        const E = [];
        for (let B = 0; B < C.length; B += 2) {
          const W = Ct({ x: C[B], y: C[B + 1] }, i), [D, k] = In(W, r);
          E.push(D, k);
        }
        const I = C.length, H = rd(
          C[I - 4],
          C[I - 3],
          C[I - 2],
          C[I - 1],
          typeof w.attrs.pointerLength == "number" ? w.attrs.pointerLength : 10,
          typeof w.attrs.pointerWidth == "number" ? w.attrs.pointerWidth : 10
        );
        for (let B = 0; B < H.length; B += 2) {
          const W = Ct({ x: H[B], y: H[B + 1] }, i), [D, k] = In(W, r);
          E.push(D, k);
        }
        return s.obj(E);
      })
    ), u = a[0]?.attrs || {}, d = u.strokeWidth ?? 1, h = u.opacity ?? 1, p = u.stroke ?? e.color ?? "rgb(255, 0, 0)", [f, m, g] = Le(p), y = s.obj({
      W: ee.of(d),
      S: F.of("S")
      // Solid border style
    }), b = s.obj({
      Type: F.of("Annot"),
      // Ink is intentional: the sampled arrowhead renders consistently in PDF viewers.
      Subtype: F.of("Ink"),
      InkLayerType: F.of("Arrow"),
      Rect: Pe(e.konvaClientRect, r),
      InkList: l,
      C: s.obj([ee.of(f), ee.of(m), ee.of(g)]),
      T: ie(this.getExportTitle(Se("normal.unknownUser"))),
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      BS: y,
      F: ee.of(4),
      P: t.ref,
      CA: ee.of(h)
      // Constant opacity for the Ink stroke.
    }), S = s.register(b);
    this.addAnnotationToPage(t, S);
    for (const w of e.comments || []) {
      const C = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: Pe(e.konvaClientRect, r),
        Contents: ie(w.content),
        T: ie(w.title || Se("normal.unknownUser")),
        M: re.of(w.date || ""),
        C: s.obj([ee.of(f), ee.of(m), ee.of(g)]),
        IRT: S,
        RT: F.of("R"),
        NM: re.of(w.id),
        Open: !1
      }), E = s.register(C);
      this.addAnnotationToPage(t, E);
    }
  }
}
function sd(n, e, t, o = 12) {
  const r = [];
  for (let s = 1; s <= o; s++) {
    const i = s / o, a = (1 - i) * (1 - i) * n[0] + 2 * (1 - i) * i * e[0] + i * i * t[0], l = (1 - i) * (1 - i) * n[1] + 2 * (1 - i) * i * e[1] + i * i * t[1];
    r.push(a, l);
  }
  return r;
}
function ad(n, e, t, o, r = 16) {
  const s = [];
  for (let i = 1; i <= r; i++) {
    const a = i / r, l = Math.pow(1 - a, 3) * n[0] + 3 * Math.pow(1 - a, 2) * a * e[0] + 3 * (1 - a) * a * a * t[0] + a * a * a * o[0], u = Math.pow(1 - a, 3) * n[1] + 3 * Math.pow(1 - a, 2) * a * e[1] + 3 * (1 - a) * a * a * t[1] + a * a * a * o[1];
    s.push(l, u);
  }
  return s;
}
function cd(n) {
  const e = n.match(/[a-zA-Z][^a-zA-Z]*/g) || [], t = [];
  let o = [0, 0];
  for (const r of e) {
    const s = r[0], i = r.slice(1).trim().split(/[\s,]+/).map(parseFloat);
    if (s === "M" && (o = [i[0], i[1]], t.push(...o)), s === "L")
      for (let a = 0; a < i.length; a += 2)
        o = [i[a], i[a + 1]], t.push(...o);
    if (s === "Q") {
      const a = o, l = [i[0], i[1]], u = [i[2], i[3]];
      t.push(...sd(a, l, u)), o = u;
    }
    if (s === "C") {
      const a = o, l = [i[0], i[1]], u = [i[2], i[3]], d = [i[4], i[5]];
      t.push(...ad(a, l, u, d)), o = d;
    }
  }
  return t;
}
class ld extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, i = Tt(e.konvaString), a = (i.children ?? []).filter((W) => W.className === "Path"), { groupX: l, groupY: u, scaleX: d, scaleY: h } = this.extractGroupTransform(i), p = r.viewport, f = s.obj(
      a.map((W) => {
        const D = cd(W.attrs?.data ?? ""), k = [];
        for (let L = 0; L < D.length; L += 2) {
          const $ = l + D[L] * d, G = u + D[L + 1] * h, O = $ * p.scale, N = G * p.scale, [Z, q] = p.convertToPdfPoint(O, N);
          k.push(Z, q);
        }
        return s.obj(k);
      })
    ), m = a[0]?.attrs ?? {}, g = m.strokeWidth ?? 1, y = m.opacity ?? 1, b = m.stroke ?? e.color ?? "rgb(255, 0, 0)", [S, w, C] = Le(b), E = s.obj({
      W: ee.of(g),
      S: F.of("S")
      // Solid border style
    }), I = Pe(e.konvaClientRect, r), H = s.obj({
      Type: F.of("Annot"),
      Subtype: F.of("Ink"),
      Rect: I,
      InkList: f,
      C: s.obj([ee.of(S), ee.of(w), ee.of(C)]),
      T: ie(this.getExportTitle(Se("normal.unknownUser"))),
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      Border: s.obj([0, 0, 0]),
      BS: E,
      F: ee.of(4),
      P: t.ref,
      CA: ee.of(y)
      // Non-stroking opacity (used for drawing)
    }), B = s.register(H);
    this.addAnnotationToPage(t, B);
    for (const W of e.comments || []) {
      const D = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: I,
        Contents: ie(W.content),
        T: ie(W.title || Se("normal.unknownUser")),
        M: re.of(W.date || ""),
        C: s.obj([ee.of(S), ee.of(w), ee.of(C)]),
        IRT: B,
        RT: F.of("R"),
        NM: re.of(W.id),
        Open: !1
      }), k = s.register(D);
      this.addAnnotationToPage(t, k);
    }
  }
}
function dd(n) {
  return (n.match(/[a-zA-Z][^a-zA-Z]*/g) ?? []).map((t) => ({
    type: t[0].toUpperCase(),
    values: t.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(Number)
  }));
}
function ud(n, e, t, o) {
  const r = 1 - o;
  return {
    x: r * r * n.x + 2 * r * o * e.x + o * o * t.x,
    y: r * r * n.y + 2 * r * o * e.y + o * o * t.y
  };
}
function hd(n, e, t, o, r) {
  const s = 1 - r;
  return {
    x: s ** 3 * n.x + 3 * s ** 2 * r * e.x + 3 * s * r ** 2 * t.x + r ** 3 * o.x,
    y: s ** 3 * n.y + 3 * s ** 2 * r * e.y + 3 * s * r ** 2 * t.y + r ** 3 * o.y
  };
}
function pd(n) {
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
        e.push(ud(r, s, i, a / 12));
      t = i;
      return;
    }
    if (o.type === "C" && t && o.values.length >= 6) {
      const r = t, s = { x: o.values[0], y: o.values[1] }, i = { x: o.values[2], y: o.values[3] }, a = { x: o.values[4], y: o.values[5] };
      for (let l = 1; l <= 16; l++)
        e.push(hd(r, s, i, a, l / 16));
      t = a;
    }
  }), e;
}
class fd extends qe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: o, pageView: r } = this, s = o.context, i = JSON.parse(e.konvaString), a = i.children?.find((w) => w.className === "Path");
    if (!a?.attrs?.data) throw new Error(`Cloud annotation ${e.id} has no path data.`);
    const l = pd(dd(a.attrs.data));
    if (l.length < 2) throw new Error(`Cloud annotation ${e.id} needs at least two points.`);
    const u = l.flatMap((w) => {
      const C = Ct(w, i);
      return In(C, r);
    }), d = a.attrs.strokeWidth ?? 2, h = a.attrs.opacity ?? 1, p = a.attrs.stroke ?? e.color ?? "#000000", [f, m, g] = Le(p), y = Pe(e.konvaClientRect, r), b = s.obj({
      Type: F.of("Annot"),
      Subtype: F.of("Ink"),
      InkLayerType: F.of("Cloud"),
      Rect: y,
      InkList: s.obj([u]),
      C: s.obj([f, m, g]),
      T: ie(this.getExportTitle(Se("normal.unknownUser"))),
      Contents: ie(e.contentsObj?.text || ""),
      M: re.of(e.date || ""),
      NM: re.of(e.id),
      Border: s.obj([0, 0, 0]),
      BS: s.obj({ W: d, S: F.of("S") }),
      F: ee.of(4),
      P: t.ref,
      CA: ee.of(h)
    }), S = s.register(b);
    this.addAnnotationToPage(t, S);
    for (const w of e.comments || []) {
      const C = s.obj({
        Type: F.of("Annot"),
        Subtype: F.of("Text"),
        Rect: y,
        Contents: ie(w.content),
        T: ie(w.title || Se("normal.unknownUser")),
        M: re.of(w.date || ""),
        C: s.obj([f, m, g]),
        IRT: S,
        RT: F.of("R"),
        NM: re.of(w.id),
        Open: !1
      });
      this.addAnnotationToPage(t, s.register(C));
    }
  }
}
const gd = {
  [oe.TEXT]: Yl,
  [oe.HIGHLIGHT]: Kl,
  [oe.UNDERLINE]: Xl,
  [oe.STRIKEOUT]: ql,
  [oe.SQUARE]: Jl,
  [oe.CIRCLE]: Zl,
  [oe.INK]: Ql,
  [oe.POLYLINE]: ld,
  [oe.FREETEXT]: ed,
  [oe.STAMP]: od,
  [oe.LINE]: id
  // 你可以在这里扩展其他类型的解析器
}, md = /* @__PURE__ */ new Set([
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
function ir(n) {
  return n.type === R.CLOUD ? fd : gd[n.pdfjsType];
}
async function vd(n, e, t, o) {
  const r = ir(n);
  r ? await new r(t, e, n, o).parse() : console.warn("Unsupported annotation type:", n.pdfjsType);
}
function yd(n, e) {
  const t = new ArrayBuffer(n.byteLength);
  new Uint8Array(t).set(n);
  const o = new Blob([t], { type: "application/pdf" });
  Eo(o, `${e}.pdf`);
}
function bd(n, e) {
  const t = new Blob([n], { type: "application/octet-stream" });
  Eo(t, `${e}.xlsx`);
}
function Sd(n) {
  for (const e of n.getPages()) {
    const t = F.of("Annots"), o = e.node.lookupMaybe(t, To);
    if (!o) continue;
    const r = o.asArray().filter((s) => {
      const a = n.context.lookupMaybe(s, wn)?.get(F.of("Subtype"))?.toString();
      return !a || !md.has(a);
    });
    e.node.set(t, n.context.obj(r));
  }
}
async function wd(n, e) {
  const t = n.pdfDocument;
  if (!t) throw new Error("Cannot export annotations before the PDF document is ready.");
  const o = await t.getData(), r = await Dn.load(o), s = r.getPages(), i = e.map((a) => {
    if (!ir(a))
      throw new Error(`Unsupported annotation type: ${a.pdfjsType}`);
    const l = s[a.pageNumber - 1];
    if (!l) throw new Error(`Annotation ${a.id} references missing page ${a.pageNumber}.`);
    const u = n.getPageView(a.pageNumber - 1);
    if (!u?.viewport)
      throw new Error(`Page view ${a.pageNumber} is not ready for annotation export.`);
    return { annotation: a, page: l, pageView: u };
  });
  Sd(r);
  for (const { annotation: a, page: l, pageView: u } of i)
    await vd(a, l, r, u);
  return r.save();
}
async function sr(n, e, t) {
  const o = await wd(n, e), r = t || `annotated_${Fo()}`;
  yd(o, r);
}
function Cd(n) {
  const e = [], t = [...n].sort((i, a) => i.pageNumber !== a.pageNumber ? i.pageNumber - a.pageNumber : Bn(a.date) - Bn(i.date)), o = (i) => {
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
      date: xn(i.date, !0),
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
        date: xn(d.date, !0),
        status: ""
      });
    }), r++;
  }), e;
}
async function ar(n, e, t) {
  const o = Cd(e), r = await import("exceljs"), s = new r.Workbook(), i = s.addWorksheet("sheet1");
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
  const a = await s.xlsx.writeBuffer(), l = t || `annotated_${Fo()}`;
  bd(a, l);
}
async function xd(n, e, t) {
  if (t.has(e)) return t.get(e);
  const o = n.getPageView(e);
  if (!o?.pdfPage) return "";
  const s = (await o.pdfPage.getTextContent()).items.map((i) => "str" in i ? i.str : "").join("");
  return t.set(e, s), s;
}
function Td({ pdfViewer: n }) {
  const [e, t] = Y(""), [o, r] = Y([]), [s, i] = Y(!1), [a, l] = Y({
    caseSensitive: !1,
    entireWord: !1,
    matchDiacritics: !1
  }), u = j(/* @__PURE__ */ new Map()), d = j(a), h = j(0), p = j(null), f = X(() => {
    p.current?.(), p.current = null;
  }, []);
  ne(() => (u.current.clear(), () => {
    h.current += 1, f();
  }), [n, f]);
  const m = X(({ pageNumber: b, matchIndex: S }) => {
    if (!n || !e) return;
    const w = n.findController;
    if (!w || !n.pdfDocument) return;
    n.scrollPageIntoView({ pageNumber: b });
    const E = w;
    E._selected = { pageIdx: b - 1, matchIdx: S }, E._offset = { pageIdx: b - 1, matchIdx: S - 1, wrapped: !1 }, E._highlightMatches = !0, n.eventBus.dispatch("find", {
      type: "again",
      query: e,
      caseSensitive: a.caseSensitive,
      entireWord: a.entireWord,
      findPrevious: !1,
      matchDiacritics: a.matchDiacritics,
      highlightAll: !0
    });
  }, [n, e, a]), g = X(
    async (b, S) => {
      if (!n) return;
      const w = h.current + 1;
      h.current = w, f();
      const C = {
        ...d.current,
        ...S
      };
      d.current = C, i(!0), t(b), l(C);
      try {
        const E = await new Promise((I, H) => {
          const B = n.pagesCount;
          let W = 0;
          const D = 60, k = 200;
          let L = null, $ = !1, G = null;
          const O = () => {
            L && (clearTimeout(L), L = null), n.eventBus.off("updatefindcontrolstate", A);
          }, N = (U) => {
            $ || ($ = !0, O(), I(U));
          }, Z = (U) => {
            $ || ($ = !0, O(), H(U));
          }, q = async () => {
            if ($ || w !== h.current) {
              N(null);
              return;
            }
            try {
              const U = G?._pageMatches;
              if (Array.isArray(U) && U.length === B) {
                const J = [];
                for (let P = 0; P < U.length; P++) {
                  const K = U[P];
                  if (!K || K.length === 0) continue;
                  const ce = await xd(n, P, u.current);
                  if ($ || w !== h.current) {
                    N(null);
                    return;
                  }
                  const le = K.map((_, te) => {
                    const fe = Math.max(0, _ - 5), xe = Math.min(ce.length, _ + b.length + 30);
                    return {
                      matchIndex: te,
                      charIndex: _,
                      snippet: ce.slice(fe, xe)
                    };
                  });
                  J.push({
                    pageNumber: P + 1,
                    countTotal: K.length,
                    matches: le
                  });
                }
                N({
                  query: b,
                  countTotal: G?._matchesCountTotal ?? 0,
                  pageMatches: J
                });
              } else W < D ? (W += 1, L = setTimeout(() => {
                L = null, q();
              }, k)) : N({
                query: b,
                countTotal: 0,
                pageMatches: []
              });
            } catch (U) {
              Z(U);
            }
          }, A = ({ source: U, rawQuery: J }) => {
            const P = Array.isArray(J) ? J.join("") : J;
            P != null && P !== b || (G = U ?? null, L && (clearTimeout(L), L = null), q());
          };
          p.current = () => N(null), n.eventBus.on("updatefindcontrolstate", A), n.eventBus.dispatch("find", {
            type: "highlightallchange",
            query: b,
            caseSensitive: C.caseSensitive ?? !1,
            entireWord: C.entireWord ?? !1,
            findPrevious: !1,
            matchDiacritics: C.matchDiacritics ?? !1,
            highlightAll: !0
          });
        });
        E && w === h.current && r([E]);
      } catch (E) {
        console.error(E), w === h.current && r([{ query: b, countTotal: 0, pageMatches: [] }]);
      } finally {
        w === h.current && (p.current = null, i(!1));
      }
    },
    [n, f]
  ), y = X(() => {
    h.current += 1, f(), n?.eventBus.dispatch("find", { query: "" }), t(""), r([]), i(!1);
  }, [n, f]);
  return { query: e, setQuery: t, results: o, searching: s, search: g, clearSearch: y, jumpToMatch: m, searchOptions: a };
}
function Ad(n, e, t) {
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
const kd = ({ text: n, query: e, caseSensitive: t }) => /* @__PURE__ */ c(ye, { children: Ad(n, e, t).map(
  (o, r) => o.highlighted ? /* @__PURE__ */ c("mark", { style: { backgroundColor: "rgba(255, 255, 0, 0.2)", padding: "0 2px" }, children: o.text }, `${r}-${o.text}`) : o.text
) }), cr = ({ pdfViewer: n }) => {
  const { query: e, setQuery: t, results: o, searching: r, search: s, clearSearch: i, jumpToMatch: a } = Td({ pdfViewer: n }), { t: l } = ve("viewer", { useSuspense: !1 }), [u, d] = Y({
    caseSensitive: !1,
    entireWord: !1
  }), [h, p] = Y(null), f = j({}), m = j(o), g = j(e);
  g.current = e;
  const y = X(
    (k) => {
      k.trim() && n && (i(), p(null), s(k.trim(), {
        caseSensitive: u.caseSensitive,
        entireWord: u.entireWord
      }));
    },
    [n, s, i, u]
  ), b = X(
    (k) => {
      switch (k.key) {
        case "Escape":
          (o.length > 0 || e.trim() !== "") && i();
          break;
        case "Enter":
          e.trim() === "" && o.length > 0 && i(), e.trim() && (i(), y(e));
          break;
      }
    },
    [e, o, i, y]
  ), S = X(
    (k, L) => {
      p({ pageNumber: k, matchIndex: L }), a({
        pageNumber: k,
        matchIndex: L
      });
    },
    [a]
  ), w = X((k, L) => {
    d(($) => ({
      ...$,
      [k]: L
    }));
  }, []), C = X(() => {
    const k = [];
    return o.forEach((L) => {
      L.pageMatches.forEach(($) => {
        $.matches.forEach((G) => {
          k.push({
            pageNumber: $.pageNumber,
            matchIndex: G.matchIndex,
            query: L.query
          });
        });
      });
    }), k;
  }, [o]), E = X((k, L) => {
    const $ = f.current[`${k}-${L}`];
    $ && $.scrollIntoView({
      block: "center",
      inline: "center"
    });
  }, []), I = X(() => h ? C().findIndex((L) => L.pageNumber === h.pageNumber && L.matchIndex === h.matchIndex) : -1, [h, C]), H = X(() => {
    if (!o.length) return;
    const k = C();
    if (!k.length) return;
    let L = 0;
    h && (L = (I() + 1) % k.length);
    const $ = k[L];
    p({
      pageNumber: $.pageNumber,
      matchIndex: $.matchIndex
    }), a({
      pageNumber: $.pageNumber,
      matchIndex: $.matchIndex
    }), E($.pageNumber, $.matchIndex);
  }, [o, h, C, I, a, E]), B = X(() => {
    if (!o.length) return;
    const k = C();
    if (!k.length) return;
    let L = k.length - 1;
    h && (L = (I() - 1 + k.length) % k.length);
    const $ = k[L];
    p({
      pageNumber: $.pageNumber,
      matchIndex: $.matchIndex
    }), a({
      pageNumber: $.pageNumber,
      matchIndex: $.matchIndex
    }), E($.pageNumber, $.matchIndex);
  }, [o, h, C, I, a, E]);
  ne(() => {
    m.current = o;
  }, [o]), ne(() => {
    const k = g.current.trim();
    k && y(k);
  }, [u, y]), ne(() => () => {
    m.current.length > 0 && i(), p(null), t("");
  }, [i, t]);
  const W = () => !o.length || r ? null : o.map((k) => /* @__PURE__ */ T(lt, { children: [
    /* @__PURE__ */ T(
      Q,
      {
        pb: "2",
        justify: "between",
        align: "center",
        style: { position: "sticky", top: 89, backgroundColor: "var(--bg-color-tertiary)", zIndex: 1 },
        children: [
          /* @__PURE__ */ c(ae, { size: "2", children: l("viewer:search.resultTotal", {
            total: k.countTotal
          }) }),
          k.countTotal > 0 && /* @__PURE__ */ T("div", { children: [
            /* @__PURE__ */ c(tt, { onClick: B, variant: "soft", color: "gray", size: "1", mr: "1", children: /* @__PURE__ */ c(bo, {}) }),
            /* @__PURE__ */ c(tt, { onClick: H, variant: "soft", color: "gray", size: "1", mr: "1", children: /* @__PURE__ */ c(So, {}) })
          ] })
        ]
      }
    ),
    k.pageMatches.map((L) => /* @__PURE__ */ T(lt, { mt: "1", mb: "3", pl: "2", children: [
      /* @__PURE__ */ T(ae, { size: "2", children: [
        l("viewer:search.page", { value: L.pageNumber }),
        " (",
        L.countTotal,
        ")"
      ] }),
      L.matches.map(($) => {
        const G = h && h.pageNumber === L.pageNumber && h.matchIndex === $.matchIndex, O = `${L.pageNumber}-${$.matchIndex}`;
        return /* @__PURE__ */ c(lt, { mt: "2", pl: "0", children: /* @__PURE__ */ c(
          be,
          {
            ref: (N) => f.current[O] = N,
            variant: G ? "soft" : "outline",
            color: G ? void 0 : "gray",
            type: "button",
            onClick: () => S(L.pageNumber, $.matchIndex),
            style: {
              width: "100%",
              textAlign: "left",
              justifyContent: "flex-start"
            },
            children: /* @__PURE__ */ c(ae, { truncate: !0, children: /* @__PURE__ */ c(
              kd,
              {
                text: $.snippet,
                query: k.query,
                caseSensitive: u.caseSensitive
              }
            ) })
          }
        ) }, $.matchIndex);
      })
    ] }, L.pageNumber))
  ] }, k.query)), D = ke(() => r ? /* @__PURE__ */ T(Q, { mt: "2", align: "center", gap: "2", children: [
    /* @__PURE__ */ c(vo, {}),
    /* @__PURE__ */ c(ae, { size: "2", children: l("viewer:search.searching") })
  ] }) : null, [r, l]);
  return /* @__PURE__ */ T(lt, { p: "2", pt: "0", children: [
    /* @__PURE__ */ T(Q, { direction: "column", style: { position: "sticky", top: 0, backgroundColor: "var(--bg-color-tertiary)", zIndex: 1 }, children: [
      /* @__PURE__ */ T(
        kt.Root,
        {
          placeholder: l("viewer:search.placeholder"),
          value: e,
          onChange: (k) => t(k.currentTarget.value),
          onKeyDown: b,
          "aria-label": l("viewer:search.placeholder"),
          mt: "3",
          children: [
            /* @__PURE__ */ c(kt.Slot, { children: /* @__PURE__ */ c(Mn, {}) }),
            /* @__PURE__ */ c(kt.Slot, { children: e.trim() && /* @__PURE__ */ c(
              tt,
              {
                size: "1",
                variant: "ghost",
                onClick: () => {
                  t(""), o.length > 0 && (i(), p(null));
                },
                children: /* @__PURE__ */ c(Yr, {})
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ T(Q, { mt: "2", align: "center", gap: "2", children: [
        /* @__PURE__ */ c(ae, { as: "label", size: "2", children: /* @__PURE__ */ T(Q, { gap: "2", children: [
          /* @__PURE__ */ c(
            $t,
            {
              checked: u.caseSensitive,
              onCheckedChange: (k) => w("caseSensitive", !!k),
              "aria-label": l("viewer:search.caseSensitive")
            }
          ),
          l("viewer:search.caseSensitive")
        ] }) }),
        /* @__PURE__ */ c(ae, { as: "label", size: "2", children: /* @__PURE__ */ T(Q, { gap: "2", children: [
          /* @__PURE__ */ c(
            $t,
            {
              checked: u.entireWord,
              onCheckedChange: (k) => w("entireWord", !!k),
              "aria-label": l("viewer:search.entireWord")
            }
          ),
          l("viewer:search.entireWord")
        ] }) })
      ] }),
      /* @__PURE__ */ c(nt, { my: "2", size: "4" })
    ] }),
    D,
    W()
  ] });
}, lr = () => {
  const [n, e] = Y(() => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  return ne(() => {
    const t = window.matchMedia("(prefers-color-scheme: dark)"), o = (r) => {
      e(r.matches ? "dark" : "light");
    };
    return t.addEventListener ? t.addEventListener("change", o) : t.addListener(o), () => {
      t.removeEventListener ? t.removeEventListener("change", o) : t.removeListener(o);
    };
  }, []), n;
}, Ed = () => /* @__PURE__ */ T(Q, { align: "center", gap: "2", "data-inklayer-page-zoom-control": "true", children: [
  /* @__PURE__ */ c(Io, { persistent: !0 }),
  /* @__PURE__ */ c(nt, { orientation: "vertical" }),
  /* @__PURE__ */ c(qt, {})
] }), po = "search-sidebar", fo = "annotator-sidebar-toggle", Rd = ({
  Chrome: n,
  onSave: e,
  enableNativeAnnotations: t,
  searchAvailable: o
}) => {
  const { painter: r, requestWrite: s } = ot(), i = se((b) => b.currentAnnotationType), {
    activeSidebarPanel: a,
    closeSidebar: l,
    openSidebar: u,
    isNavigationSidebarOpen: d,
    toggleNavigationSidebar: h,
    pdfViewer: p
  } = Fe(), f = r?.can("annotation.create") ?? !1, m = !!s;
  ne(() => {
    f || m || i && i.type !== R.SELECT && r?.activate(null, null);
  }, [f, m, i, r]), ne(() => () => {
    r?.activate(null, null);
  }, [r]);
  const g = (b) => {
    a === b ? l() : u(b);
  }, y = {
    save: () => {
      r && e?.(Ot(r.getData()));
    },
    getAnnotations: () => Ot(r?.getData() ?? []),
    replaceAnnotations: async (b) => {
      r && await r.replaceAnnotations(Vo(b), t);
    },
    exportToExcel: (b) => {
      r && p && ar(p, r.getData(), b);
    },
    exportToPdf: (b) => {
      r && p && sr(p, r.getData(), b);
    }
  };
  return /* @__PURE__ */ c(
    n,
    {
      activeTool: On(i?.type),
      canCreate: f,
      canRequestWrite: m,
      ToolControl: Rn,
      ColorControl: nr,
      AuthorLabelsControl: or,
      PageZoomControl: Ed,
      history: r?.getHistory(),
      panels: {
        navigation: {
          open: d,
          toggle: h
        },
        search: {
          open: a === po,
          available: o,
          toggle: () => g(po)
        },
        annotations: {
          open: a === fo,
          toggle: () => g(fo)
        }
      },
      actions: y
    }
  );
}, Pd = "_positionedTextLayer_9ohqw_1", Id = "_positionedTextSpan_9ohqw_11", Nd = "_positionedTextContent_9ohqw_25", Md = "_positionedTextBlock_9ohqw_29", Qt = {
  positionedTextLayer: Pd,
  positionedTextSpan: Id,
  positionedTextContent: Nd,
  positionedTextBlock: Md
}, go = 1, Dd = ({ source: n }) => {
  const { pdfViewer: e, eventBus: t, viewerContainerRef: o, isReady: r } = Fe(), [s, i] = Y([]), [a, l] = Y(/* @__PURE__ */ new Map()), [, u] = Y(0), d = j(/* @__PURE__ */ new Set()), h = j(0), p = X(() => {
    if (!e || !o.current) return [];
    const g = Math.min(n.pageCount, e.pagesCount);
    if (g <= 0) return [];
    const y = o.current.getBoundingClientRect(), b = y.width > 0 && y.height > 0, S = /* @__PURE__ */ new Set();
    for (let C = 0; C < g; C += 1) {
      const I = e.getPageView(C)?.div?.getBoundingClientRect();
      !I || I.width <= 0 || I.height <= 0 || b && I.bottom >= y.top && I.top <= y.bottom && S.add(C + 1);
    }
    if (S.size === 0) {
      const C = Math.max(1, Math.min(g, e.currentPageNumber || 1));
      S.add(C);
    }
    const w = /* @__PURE__ */ new Set();
    return S.forEach((C) => {
      for (let E = -go; E <= go; E += 1) {
        const I = C + E;
        I >= 1 && I <= g && w.add(I);
      }
    }), [...w].sort((C, E) => C - E);
  }, [e, n.pageCount, o]), f = X(() => {
    i(p());
  }, [p]);
  ne(() => {
    if (h.current += 1, d.current.clear(), l(/* @__PURE__ */ new Map()), i([]), !e || !t || !r) return;
    f();
    const g = () => f(), y = () => {
      f(), u((C) => C + 1);
    }, b = [0, 50, 200, 500].map((C) => window.setTimeout(g, C)), S = o.current, w = typeof ResizeObserver > "u" || !S ? null : new ResizeObserver(g);
    return S && (w?.observe(S), S.addEventListener("scroll", g, { passive: !0 })), t.on("pagesloaded", g), t.on("pagerendered", y), t.on("updateviewarea", g), t.on("scalechanging", g), t.on("rotationchanging", g), () => {
      b.forEach((C) => window.clearTimeout(C)), w?.disconnect(), S?.removeEventListener("scroll", g), t.off("pagesloaded", g), t.off("pagerendered", y), t.off("updateviewarea", g), t.off("scalechanging", g), t.off("rotationchanging", g);
    };
  }, [t, r, e, f, n, o]), ne(() => {
    if (!e || !s.length) return;
    const g = h.current;
    let y = !1;
    return s.forEach((b) => {
      a.has(b) || d.current.has(b) || (d.current.add(b), n.getPage(b).then((S) => {
        d.current.delete(b), !(y || h.current !== g || !S) && l((w) => {
          const C = new Map(w);
          return C.set(b, S), C;
        });
      }).catch(() => {
        d.current.delete(b);
      }));
    }), () => {
      y = !0;
    };
  }, [a, e, n, s]);
  const m = e ? s.flatMap((g) => {
    const y = e.getPageView(g - 1), b = a.get(g);
    if (!y?.div || !b) return [];
    const S = y.viewport;
    return !S || ![S.width, S.height, b.dimensions.width, b.dimensions.height].every(Number.isFinite) || S.width <= 0 || S.height <= 0 || b.dimensions.width <= 0 || b.dimensions.height <= 0 ? [] : [{
      pageNumber: g,
      host: Ld(y.div, g),
      scaleX: S.width / b.dimensions.width,
      scaleY: S.height / b.dimensions.height
    }];
  }) : [];
  return /* @__PURE__ */ c(ye, { children: m.map((g) => {
    const y = a.get(g.pageNumber);
    return y ? ii(
      /* @__PURE__ */ T(ye, { children: [
        y.blocks?.map((b) => /* @__PURE__ */ c(
          _d,
          {
            block: b,
            scaleX: g.scaleX,
            scaleY: g.scaleY
          },
          b.id
        )),
        y.spans.map((b) => /* @__PURE__ */ c(
          Od,
          {
            span: b,
            scaleX: g.scaleX,
            scaleY: g.scaleY
          },
          b.id
        ))
      ] }),
      g.host,
      `positioned-text-${g.pageNumber}`
    ) : null;
  }) });
};
function Ld(n, e) {
  const t = n.querySelector(`:scope > [data-inklayer-positioned-text-page="${e}"]`);
  if (t) return t;
  const o = document.createElement("div");
  return o.className = Qt.positionedTextLayer, o.dataset.inklayerPositionedTextPage = String(e), n.append(o), o;
}
function _d({
  block: n,
  scaleX: e,
  scaleY: t
}) {
  const o = Gd(n.geometry, e, t);
  return o ? /* @__PURE__ */ c(
    "div",
    {
      className: Qt.positionedTextBlock,
      "data-inklayer-positioned-text-block": n.id,
      "data-inklayer-positioned-text-block-id": n.blockId,
      "data-inklayer-positioned-text-block-kind": n.kind,
      "aria-hidden": "true",
      style: o
    }
  ) : null;
}
function Od({
  span: n,
  scaleX: e,
  scaleY: t
}) {
  const { geometry: o } = n, r = Hd(o, e, t), s = j(null);
  return Qe(() => {
    const i = s.current, a = typeof r?.width == "number" ? r.width : 0, l = typeof r?.height == "number" ? r.height : 0;
    if (!i || a <= 0 || l <= 0) return;
    const u = () => {
      i.style.fontSize = `${l}px`, i.style.lineHeight = `${l}px`;
      const h = i.offsetWidth;
      if (!Number.isFinite(h) || h <= 0) return;
      const p = l * a / h;
      i.style.fontSize = `${p}px`, i.dataset.inklayerPositionedTextFontSize = String(p);
    };
    u();
    let d = !0;
    return document.fonts?.ready.then(() => {
      d && u();
    }), () => {
      d = !1;
    };
  }, [n.text, r?.height, r?.width]), !r || !n.text.trim() ? null : /* @__PURE__ */ c(
    "span",
    {
      className: Qt.positionedTextSpan,
      "data-inklayer-positioned-text-id": n.id,
      "data-inklayer-positioned-text-block-id": n.blockId,
      "data-inklayer-positioned-text-span-id": n.spanId,
      style: r,
      children: /* @__PURE__ */ c("span", { ref: s, className: Qt.positionedTextContent, children: n.text })
    }
  );
}
function Hd(n, e, t) {
  const o = dr(n, e, t);
  if (!o) return null;
  const r = typeof o.height == "number" ? o.height : 0;
  return {
    ...o,
    fontSize: Math.max(1, r),
    lineHeight: `${Math.max(1, r)}px`,
    zIndex: 1
  };
}
function Gd(n, e, t) {
  const o = dr(n, e, t);
  return o ? {
    ...o,
    boxSizing: "border-box",
    border: "1px solid rgba(37, 99, 235, 0.95)",
    backgroundColor: "rgba(37, 99, 235, 0.04)",
    pointerEvents: "none",
    zIndex: 0
  } : null;
}
function dr(n, e, t) {
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
const du = ({
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
  initialScale: f,
  enableNativeAnnotations: m = !1,
  initialAnnotations: g = [],
  defaultShowAnnotationsSidebar: y = !1,
  onSave: b,
  onLoad: S,
  onAnnotationAdded: w,
  onAnnotationDeleted: C,
  onAnnotationSelected: E,
  onAnnotationUpdated: I,
  layoutStyle: H,
  actions: B,
  chrome: W,
  searchAvailable: D = !0,
  positionedTextSource: k
}) => {
  const L = ke(
    () => Vo(g),
    [g]
  ), $ = ke(
    () => ({ textLayerMode: k ? 0 : 1, annotationMode: 0, externalLinkTarget: 0, enableRange: e, pdfjsOptions: a }),
    [e, a, k]
  ), { t: G } = ve(["annotator", "common"], { useSuspense: !1 }), O = ke(() => Qo($c, p || {}), [p]), [N, Z] = Y(() => no()), q = lr(), A = n === "auto" ? q : n;
  ne(() => {
    const J = setTimeout(() => {
      const P = no();
      Z(P);
    }, 0);
    return () => clearTimeout(J);
  }, []), ne(() => {
    Te.changeLanguage(i);
  }, [i]);
  const U = () => {
    const { painter: J } = ot(), { pdfViewer: P } = Fe(), K = () => {
      if (J) {
        const _ = J.getData();
        b?.(Ot(_));
      }
    }, ce = async (_) => {
      if (J && P) {
        const te = J.getData();
        await sr(P, te, _);
      }
    }, le = async (_) => {
      if (J && P) {
        const te = J.getData();
        await ar(P, te, _);
      }
    };
    return B ? typeof B == "function" ? /* @__PURE__ */ c(
      B,
      {
        save: K,
        getAnnotations: () => Ot(J?.getData() || []),
        exportToExcel: (te) => {
          le(te);
        },
        exportToPdf: (te) => {
          ce(te);
        }
      }
    ) : Pt.cloneElement(B, {
      save: K,
      getAnnotations: () => Ot(J?.getData() || []),
      exportToExcel: (_) => {
        le(_);
      },
      exportToPdf: (_) => {
        ce(_);
      }
    }) : /* @__PURE__ */ T(ye, { children: [
      /* @__PURE__ */ c(nt, { orientation: "vertical" }),
      /* @__PURE__ */ T(me.Root, { children: [
        /* @__PURE__ */ c(me.Trigger, { children: /* @__PURE__ */ T(be, { variant: "soft", children: [
          G("common:export"),
          /* @__PURE__ */ c(me.TriggerIcon, {})
        ] }) }),
        /* @__PURE__ */ T(me.Content, { children: [
          /* @__PURE__ */ T(me.Item, { onClick: () => ce(), children: [
            G("common:export"),
            " PDF"
          ] }),
          /* @__PURE__ */ T(me.Item, { onClick: () => le(), children: [
            G("common:export"),
            " Excel"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ T(be, { onClick: K, children: [
        /* @__PURE__ */ c(Kr, {}),
        G("common:save")
      ] })
    ] });
  };
  return /* @__PURE__ */ c(yo, { accentColor: t, appearance: A, children: /* @__PURE__ */ c(Yc, { requestWrite: d, children: /* @__PURE__ */ c(
    Zo.Provider,
    {
      value: {
        defaultOptions: O,
        primaryColor: N
      },
      children: /* @__PURE__ */ T(
        Lo,
        {
          title: o,
          url: s,
          data: r,
          initialScale: f,
          user: l,
          ...$,
          toolbar: W ? void 0 : /* @__PURE__ */ c(Vc, { defaultAnnotationName: "" }),
          hideHeader: !!W,
          hidePageIndicator: !!W,
          defaultActiveSidebarKey: y ? "annotator-sidebar-toggle" : null,
          sidebar: [
            {
              key: "search-sidebar",
              title: G("viewer:search.search"),
              icon: /* @__PURE__ */ c(Mn, { style: { width: 18, height: 18 } }),
              render: (J) => /* @__PURE__ */ c(cr, { pdfViewer: J.pdfViewer })
            },
            {
              title: G("annotator:sidebar.toggle"),
              key: "annotator-sidebar-toggle",
              icon: /* @__PURE__ */ c(Go, { style: { width: 18, height: 18 } }),
              render: () => /* @__PURE__ */ c($l, {})
            }
          ],
          actions: W ? void 0 : /* @__PURE__ */ c(U, {}),
          style: H,
          children: [
            k && /* @__PURE__ */ c(Dd, { source: k }),
            W ? /* @__PURE__ */ c(
              Rd,
              {
                Chrome: W,
                onSave: b,
                enableNativeAnnotations: m,
                searchAvailable: D
              }
            ) : null,
            /* @__PURE__ */ c(
              yc,
              {
                onLoad: () => {
                  S?.();
                },
                onAnnotationAdd: (J) => w?.(_t(J)),
                onAnnotationDelete: (J) => {
                  C?.(J);
                },
                onAnnotationSelected: (J, P) => E?.(J ? _t(J) : null, P),
                onAnnotationChanged: (J) => I?.(_t(J)),
                enableNativeAnnotations: m,
                annotations: L,
                annotationPermissions: u,
                defaultShowAnnotationAuthorLabels: h
              }
            )
          ]
        }
      )
    }
  ) }) });
}, Ud = ({
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
  }, [s, r, o]), /* @__PURE__ */ c(ye, {});
}, zd = () => {
  const { t: n } = ve("common", { useSuspense: !1 }), { pdfDocument: e } = Fe(), { printClean: t } = Mo(e);
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
      children: /* @__PURE__ */ c(Xr, { style: { width: 18, height: 18 } })
    }
  ) });
}, Fd = ({ actions: n }) => {
  const e = Fe();
  return n ? typeof n == "function" ? n(e) : n : /* @__PURE__ */ c(ye, { children: /* @__PURE__ */ c(Q, { gap: "3", align: "center", children: /* @__PURE__ */ c(zd, {}) }) });
}, jd = ({ toolbar: n }) => {
  const e = Fe();
  return n ? typeof n == "function" ? /* @__PURE__ */ T(Q, { gap: "3", align: "center", children: [
    /* @__PURE__ */ c(qt, {}),
    /* @__PURE__ */ c(nt, { orientation: "vertical" }),
    n(e)
  ] }) : n : /* @__PURE__ */ c(Q, { gap: "3", align: "center", children: /* @__PURE__ */ c(qt, {}) });
}, uu = ({
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
  showTextLayer: f = !0,
  showAnnotations: m = !1,
  defaultActiveSidebarKey: g,
  onDocumentLoaded: y,
  onEventBusReady: b
}) => {
  const { t: S } = ve(["viewer"], { useSuspense: !1 }), w = ke(
    () => ({
      textLayerMode: f ? 1 : 0,
      annotationMode: m ? 1 : 0,
      externalLinkTarget: 0,
      enableRange: e,
      pdfjsOptions: i
    }),
    [f, m, e, i]
  );
  ne(() => {
    Te.changeLanguage(s);
  }, [s]);
  const C = lr();
  return /* @__PURE__ */ c(yo, { accentColor: u, appearance: n === "auto" ? C : n, children: /* @__PURE__ */ c(
    Lo,
    {
      title: t,
      url: o,
      data: r,
      sidebar: [{
        key: "search-sidebar",
        title: S("viewer:search.search"),
        icon: /* @__PURE__ */ c(Mn, { style: { width: 18, height: 18 } }),
        render: (I) => /* @__PURE__ */ c(cr, { pdfViewer: I.pdfViewer })
      }, ...h || []],
      defaultActiveSidebarKey: g,
      toolbar: /* @__PURE__ */ c(jd, { toolbar: p }),
      initialScale: a,
      ...w,
      style: l,
      actions: /* @__PURE__ */ c(Fd, { actions: d }),
      children: /* @__PURE__ */ c(Ud, { onEventBusReady: b, onDocumentLoaded: y })
    }
  ) });
};
export {
  du as PdfAnnotator,
  uu as PdfViewer
};
