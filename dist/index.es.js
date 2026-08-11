import { jsxs as w, Fragment as Se, jsx as c } from "react/jsx-runtime";
import Dt, { useRef as B, useState as V, useCallback as J, useEffect as oe, createContext as Jt, useContext as Lt, memo as ao, useMemo as Ae, forwardRef as Zt, useImperativeHandle as kn, useLayoutEffect as it, useSyncExternalStore as nr, useId as or, createElement as rr } from "react";
import * as ir from "pdfjs-dist/legacy/build/pdf.mjs";
import { AnnotationMode as sr, AnnotationEditorType as ar, getDocument as sn, PDFDataRangeTransport as cr } from "pdfjs-dist/legacy/build/pdf.mjs";
import { EventBus as lr, PDFLinkService as dr, DownloadManager as ur, PDFFindController as hr, PDFViewer as pr } from "pdfjs-dist/legacy/web/pdf_viewer.mjs";
import "pdfjs-dist/legacy/web/pdf_viewer.css";
import { useThemeContext as Qt, Flex as K, Spinner as co, Box as st, Text as se, Progress as fr, Callout as at, Strong as gr, IconButton as Ze, TextField as Tt, Tabs as Ct, Tooltip as At, Button as me, Popover as Te, Card as mr, Grid as Ft, Separator as Qe, Slider as Ln, HoverCard as an, DropdownMenu as fe, Dialog as rt, SegmentedControl as ut, Select as Ee, CheckboxGroup as mt, TextArea as vr, Badge as yr, Checkbox as Bt, Theme as lo } from "@radix-ui/themes";
import { useTranslation as ge, initReactI18next as br } from "react-i18next";
import { AiOutlineWarning as Sr, AiOutlineLeft as uo, AiOutlineRight as ho, AiOutlineArrowLeft as wr, AiOutlineLine as Cr, AiOutlinePlus as Tr, AiOutlinePlusCircle as po, AiOutlineImport as fo, AiOutlineExclamationCircle as Ar, AiOutlineBold as xr, AiOutlineItalic as Er, AiOutlineUnderline as kr, AiOutlineStrikethrough as Rr, AiOutlineExclamation as Pr, AiOutlineEllipsis as _n, AiOutlineFilter as Nr, AiOutlineMinusSquare as Ir, AiOutlineStop as Mr, AiOutlineCheckCircle as Dr, AiOutlineMinusCircle as Lr, AiOutlineDislike as _r, AiOutlineLike as Or, AiOutlineSearch as Rn, AiFillCloseCircle as Hr, AiOutlineSave as Gr, AiOutlinePrinter as Ur } from "react-icons/ai";
import { PDFDocument as Pn, PDFName as O, PDFHexString as go, PDFArray as mo, PDFDict as vn, PDFString as ne, PDFRef as zr, PDFNumber as Z, PDFRawStream as Fr } from "pdf-lib";
import { GoSidebarExpand as jr, GoSidebarCollapse as Wr } from "react-icons/go";
import I from "konva";
import { nanoid as Br } from "nanoid";
import Ce, { t as ve } from "i18next";
import { computePosition as jt, flip as vo } from "@floating-ui/dom";
import { create as $r } from "zustand";
import Vr from "web-highlighter";
import { HexColorPicker as Yr } from "react-colorful";
import yo from "dayjs";
import Kr from "dayjs/plugin/customParseFormat.js";
import { saveAs as bo } from "file-saver";
const Xr = new URL("pdf.worker.min.mjs", import.meta.url).href;
ir.GlobalWorkerOptions.workerSrc = Xr;
function qr(o) {
  if (!(o instanceof Error)) return !1;
  const e = o.message.toLowerCase();
  return e.includes("range") || e.includes("content-length") || e.includes("unexpected server response") || e.includes("cors");
}
function Jr(o, e) {
  const {
    url: t,
    data: n,
    enableRange: r = "auto",
    onLoadSuccess: s,
    onLoadError: i,
    onLoadEnd: a,
    onViewerInit: l,
    eventBus: d,
    textLayerMode: h = 1,
    annotationMode: u = sr.DISABLE,
    externalLinkTarget: f = 2,
    pdfjsOptions: p
  } = e, g = B(s), m = B(i), v = B(a), C = B(l);
  g.current = s, m.current = i, v.current = a, C.current = l;
  const E = B(null), S = B(null), x = B(null), N = B(null), H = B(0), [z, F] = V(!0), [j, G] = V(0), [R, T] = V(null), [D, _] = V(null), [X, q] = V(null), ee = J(() => {
    if (N.current && (N.current(), N.current = null), !o.current) throw new Error("PDF container not ready");
    const W = d || new lr();
    x.current = W;
    const Q = new dr({ eventBus: W, externalLinkTarget: f }), L = new ur(), Y = new hr({ linkService: Q, eventBus: W }), le = new pr({
      container: o.current,
      eventBus: W,
      textLayerMode: h,
      annotationMode: u,
      annotationEditorMode: ar.DISABLE,
      linkService: Q,
      downloadManager: L,
      findController: Y
    });
    return Q.setViewer(le), E.current = le, S.current = Q, N.current = () => {
      E.current && (E.current.cleanup(), E.current = null), S.current && (S.current = null), !d && x.current && (x.current = null);
    }, C.current?.(le), { bus: W, linkService: Q, viewer: le };
  }, [o, d, h, u, f]), $ = J(async (W) => {
    const Q = await fetch(W, { method: "HEAD" }), L = Number(Q.headers.get("Content-Length"));
    if (isNaN(L)) throw new Error("Cannot get PDF length for range loading");
    class Y extends cr {
      async requestDataRange(de, be) {
        const we = await (await fetch(W, { headers: { Range: `bytes=${de}-${be - 1}` } })).arrayBuffer();
        this.onDataRange(de, new Uint8Array(we));
      }
    }
    return new Y(L, null);
  }, []), y = J(
    async (W) => {
      if (n)
        return sn({
          ...p,
          data: n,
          disableRange: !0,
          disableStream: !0
        });
      if (t && W) {
        const Q = await $(t);
        return sn({ ...p, range: Q });
      } else {
        if (t)
          return sn({ ...p, url: t, disableRange: !0, disableStream: !0 });
        throw new Error("Either url or data must be provided");
      }
    },
    [t, $, n, p]
  ), M = B(null), ce = J(async () => {
    const W = H.current + 1;
    H.current = W;
    const Q = () => H.current === W;
    if (!t && !n) {
      const de = new Error("Either url or data must be provided");
      Q() && (q(de), F(!1), m.current?.(de), v.current?.());
      return;
    }
    F(!0), G(0), q(null), T(null);
    let L = !1, Y = null, le = null;
    try {
      le = ee();
      const { linkService: de, viewer: be } = le;
      if (r === !0 || r === "auto" ? (L = !0, Y = await y(!0)) : Y = await y(!1), !Q()) {
        await Y.destroy();
        return;
      }
      M.current = Y, Y.onProgress = ({ loaded: ze, total: A }) => {
        Q() && A > 0 && G(Math.min(100, Math.round(ze / A * 100)));
      };
      const we = await Y.promise;
      if (!Q()) {
        await we.destroy();
        return;
      }
      T(we), de.setDocument(we), be.setDocument(we);
      const He = await we.getMetadata();
      if (!Q()) return;
      _(He), g.current?.(we);
    } catch (de) {
      if (!Q()) return;
      if (r === "auto" && L && qr(de)) {
        console.warn("[PDF] Range failed, fallback to full loading"), await Y?.destroy(), M.current === Y && (M.current = null);
        try {
          if (!le)
            throw new Error("PDF viewer was not initialized");
          const be = await y(!1);
          if (Y = be, !Q()) {
            await be.destroy();
            return;
          }
          M.current = be, be.onProgress = ({ loaded: A, total: b }) => {
            Q() && b > 0 && G(Math.min(100, Math.round(A / b * 100)));
          };
          const Pe = await be.promise;
          if (!Q()) {
            await Pe.destroy();
            return;
          }
          const { linkService: we, viewer: He } = le;
          T(Pe), we.setDocument(Pe), He.setDocument(Pe);
          const ze = await Pe.getMetadata();
          if (!Q()) return;
          _(ze), g.current?.(Pe);
          return;
        } catch (be) {
          if (!Q()) return;
          q(be), m.current?.(be);
          return;
        }
      }
      q(de), m.current?.(de);
    } finally {
      Q() && (F(!1), v.current?.());
    }
  }, [t, n, r, ee, y]);
  return oe(() => (ce(), () => {
    H.current += 1, N.current && (N.current(), N.current = null), M.current && (M.current.destroy(), M.current = null);
  }), [ce]), {
    /** 是否加载中 */
    loading: z,
    /** 加载进度 */
    progress: j,
    /** PDF 文档对象 */
    pdfDocument: R,
    /** PDFViewer 实例 */
    pdfViewer: E.current,
    /** EventBus 引用 */
    eventBus: x.current,
    /** PDF 元数据 */
    metadata: D,
    /** 加载错误 */
    loadError: X
  };
}
const So = Jt(null), je = () => {
  const o = Lt(So);
  if (!o)
    throw new Error("usePdfViewerContext must be used within a PdfViewerProvider");
  return o;
}, Nn = Jt(null), wo = () => {
  const o = Lt(Nn);
  if (!o)
    throw new Error("useUserContext must be used within a UserProvider");
  return o;
}, Zr = "_InkLayerViewer_1ief7_1", Qr = "_viewerHeader_1ief7_91", ei = "_viewerBody_1ief7_130", ti = "_navigationSidebarTriggerIcon_1ief7_136", ni = "_viewerWrapper_1ief7_142", oi = "_viewerContainer_1ief7_150", ri = "_pdfjsViewerContainer_1ief7_167", ii = "_viewerSidebar_1ief7_197", si = "_sidebarOverlay_1ief7_225", Ne = {
  InkLayerViewer: Zr,
  viewerHeader: Qr,
  "viewerHeader-title": "_viewerHeader-title_1ief7_102",
  "viewerHeader-title-left": "_viewerHeader-title-left_1ief7_109",
  "viewerHeader-title-name": "_viewerHeader-title-name_1ief7_115",
  "viewerHeader-title-actions": "_viewerHeader-title-actions_1ief7_124",
  viewerBody: ei,
  navigationSidebarTriggerIcon: ti,
  viewerWrapper: ni,
  viewerContainer: oi,
  "viewerContainer-header": "_viewerContainer-header_1ief7_156",
  pdfjsViewerContainer: ri,
  viewerSidebar: ii,
  "viewerSidebar--hidden": "_viewerSidebar--hidden_1ief7_209",
  "viewerSidebar-container": "_viewerSidebar-container_1ief7_215",
  sidebarOverlay: si
};
function ai(o, e) {
  const [t, n] = V(!1), r = B(null);
  return oe(() => (o ? r.current = setTimeout(() => {
    n(!0);
  }, e) : (r.current && (clearTimeout(r.current), r.current = null), n(!1)), () => {
    r.current && (clearTimeout(r.current), r.current = null);
  }), [o, e]), t;
}
function ci(o, e) {
  const [t, n] = V(!1), [r, s] = V(o), i = B(null), a = B(o);
  return oe(() => {
    o !== a.current && (a.current = o, s(o), t || n(!0), i.current && clearTimeout(i.current), i.current = setTimeout(() => {
      n(!1), i.current = null;
    }, e));
  }, [o, e, t]), {
    visible: t,
    value: r
  };
}
const li = ({ loading: o, progress: e, loadingDelay: t = 500, progressHideDelay: n = 1500 }) => {
  const r = ai(o, t), s = ci(e, n), { t: i } = ge(["common"]), { appearance: a } = Qt();
  return /* @__PURE__ */ w(Se, { children: [
    r && /* @__PURE__ */ w(
      K,
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
          /* @__PURE__ */ c(co, { size: "3" }),
          /* @__PURE__ */ c(st, { mt: "4", children: /* @__PURE__ */ w(se, { weight: "medium", style: { fontSize: "1.1em" }, children: [
            i("common:loading"),
            " ",
            e,
            "%"
          ] }) })
        ]
      }
    ),
    s.visible && /* @__PURE__ */ c(
      fr,
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
}, di = ({ error: o }) => {
  const { t: e } = ge(["common"]);
  return /* @__PURE__ */ c(
    K,
    {
      position: "absolute",
      inset: "0",
      style: { backgroundColor: "rgba(255, 255, 255, 0.9)", zIndex: 1e3 },
      align: "center",
      justify: "center",
      direction: "column",
      p: "4",
      children: /* @__PURE__ */ w(at.Root, { color: "red", size: "3", children: [
        /* @__PURE__ */ c(at.Icon, { children: /* @__PURE__ */ c(Sr, {}) }),
        /* @__PURE__ */ w(at.Text, { children: [
          /* @__PURE__ */ c(se, { children: /* @__PURE__ */ w(gr, { children: [
            e("common:error"),
            " ",
            o.name
          ] }) }),
          /* @__PURE__ */ c("br", {}),
          /* @__PURE__ */ c(se, { children: o.message })
        ] })
      ] })
    }
  );
}, ui = 3e3, Co = ({ persistent: o = !1 }) => {
  const { t: e } = ge(["viewer"], { useSuspense: !1 }), { pdfViewer: t, isReady: n } = je(), [r, s] = V(1), [i, a] = V(1), [l, d] = V("1"), [h, u] = V(!1), [f, p] = V(!1), [g, m] = V(!0), v = B(null), C = B({
    hovered: !1,
    inputFocused: !1
  }), E = J(() => {
    v.current && (window.clearTimeout(v.current), v.current = null);
  }, []), S = J(() => {
    E(), !(C.current.hovered || C.current.inputFocused) && (v.current = window.setTimeout(() => {
      v.current = null, m(!1);
    }, ui));
  }, [E]), x = J(() => {
    m(!0), o || S();
  }, [o, S]), N = J(() => {
    C.current.hovered = !0, E(), m(!0);
  }, [E]), H = J(() => {
    C.current.hovered = !1, S();
  }, [S]), z = J(() => {
    C.current.inputFocused = !0, E(), m(!0);
  }, [E]), F = J((y) => {
    y.currentTarget.select(), x();
  }, [x]), j = J((y) => {
    s(y), d(y.toString());
  }, []), G = J(
    (y) => !isNaN(y) && y >= 1 && y <= i,
    [i]
  ), R = J(
    (y) => {
      if (!(!t || !G(y))) {
        x(), u(!0);
        try {
          t.currentPageNumber = y, s(y), d(y.toString());
        } catch (M) {
          console.error("Error changing page:", M);
        } finally {
          u(!1);
        }
      }
    },
    [t, G, x]
  ), T = (y) => {
    x();
    const M = y.target.value;
    (M === "" || /^\d+$/.test(M)) && d(M);
  }, D = J(() => {
    x();
    const y = parseInt(l, 10);
    G(y) ? R(y) : d(r.toString());
  }, [l, r, R, G, x]), _ = J(() => {
    x(), r > 1 && R(r - 1);
  }, [r, R, x]), X = J(() => {
    x(), r < i && R(r + 1);
  }, [r, i, R, x]);
  oe(() => {
    if (!t) return;
    const y = ({ pageNumber: M }) => {
      j(M), u(!1), x();
    };
    if (n) {
      const M = t.currentPageNumber || 1, ce = t.pagesCount || 1;
      s(M), d(M.toString()), a(ce), p(!0), x();
    }
    return t.eventBus.on("pagechanging", y), () => {
      t.eventBus.off("pagechanging", y);
    };
  }, [t, n, j, x]), oe(() => {
    o && (E(), m(!0));
  }, [E, o]), oe(() => {
    if (!t?.container) return;
    const y = t.container, M = () => {
      x();
    };
    return y.addEventListener("scroll", M, { passive: !0 }), y.addEventListener("wheel", M, { passive: !0 }), () => {
      y.removeEventListener("scroll", M), y.removeEventListener("wheel", M);
    };
  }, [t, x]), oe(() => E, [E]);
  const q = (y) => {
    y.key === "Enter" ? D() : y.key === "Escape" && d(r.toString());
  }, ee = () => {
    C.current.inputFocused = !1, D(), S();
  }, $ = l === "" || G(parseInt(l, 10));
  return /* @__PURE__ */ c(
    st,
    {
      position: o ? "static" : "absolute",
      bottom: "20px",
      left: "50%",
      style: {
        transform: o ? void 0 : "translateX(-50%)",
        zIndex: 1e3,
        background: "rgba(60, 60, 60, 0.85)",
        color: "#fff",
        borderRadius: "4px",
        opacity: f && (o || g) ? 1 : 0,
        pointerEvents: f && (o || g) ? "auto" : "none",
        transition: "opacity 0.3s ease"
      },
      onMouseEnter: N,
      onMouseLeave: H,
      children: /* @__PURE__ */ w(K, { gap: "2", align: "center", pt: "1", pl: "1", pr: "2", pb: "1", children: [
        /* @__PURE__ */ c(
          Ze,
          {
            style: {
              color: r <= 1 || h ? "#aaa" : "#fff",
              transition: "background-color 0.2s ease",
              cursor: "pointer"
            },
            onMouseEnter: (y) => {
              y.currentTarget.style.backgroundColor = "rgba(50, 50, 50, 1)";
            },
            onMouseLeave: (y) => {
              y.currentTarget.style.backgroundColor = "transparent";
            },
            color: "gray",
            variant: "soft",
            onClick: _,
            size: "1",
            disabled: r <= 1 || h,
            "aria-label": e("viewer:navigation.previousPage"),
            children: /* @__PURE__ */ c(uo, {})
          }
        ),
        /* @__PURE__ */ w(K, { align: "center", gap: "1", pr: "2", children: [
          /* @__PURE__ */ c(
            Tt.Root,
            {
              size: "1",
              value: l,
              onChange: T,
              onFocus: z,
              onBlur: ee,
              onDoubleClick: F,
              onKeyDown: q,
              disabled: h,
              "aria-label": e("viewer:navigation.pageInput"),
              style: {
                width: 30,
                fontWeight: "bold",
                textAlign: "right",
                color: "#fff",
                paddingRight: 5,
                "--text-field-border-width": 0,
                backgroundColor: "transparent",
                border: "none",
                borderColor: $ ? void 0 : "red"
              }
            }
          ),
          /* @__PURE__ */ w(
            se,
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
          Ze,
          {
            onMouseEnter: (y) => {
              y.currentTarget.style.backgroundColor = "rgba(50, 50, 50, 1)";
            },
            onMouseLeave: (y) => {
              y.currentTarget.style.backgroundColor = "transparent";
            },
            color: "gray",
            variant: "ghost",
            disabled: r >= i || h,
            onClick: X,
            size: "1",
            "aria-label": e("viewer:navigation.nextPage"),
            style: {
              color: r >= i || h ? "#aaa" : "#fff",
              transition: "background-color 0.2s ease",
              cursor: "pointer"
            },
            children: /* @__PURE__ */ c(ho, {})
          }
        )
      ] })
    }
  );
};
function hi(o) {
  for (const e of o.getPages()) {
    const t = O.of("Annots");
    e.node.has(t) && e.node.set(t, o.context.obj([]));
  }
}
async function On(o, e = !1) {
  const t = await o.getData(), n = await Pn.load(t);
  return e && hi(n), n.save();
}
function To(o) {
  const e = new ArrayBuffer(o.byteLength);
  return new Uint8Array(e).set(o), e;
}
function pi(o, e) {
  const t = new Blob([To(o)], { type: "application/pdf" }), n = document.createElement("a");
  n.href = URL.createObjectURL(t), n.download = e, n.click(), URL.revokeObjectURL(n.href);
}
function fi(o) {
  const e = new Blob([To(o)], { type: "application/pdf" }), t = URL.createObjectURL(e), n = document.createElement("iframe");
  n.style.position = "fixed", n.style.width = "0", n.style.height = "0", n.style.border = "none", n.src = t, document.body.appendChild(n), n.onload = () => {
    n.contentWindow?.focus(), n.contentWindow?.print(), setTimeout(() => {
      document.body.removeChild(n), URL.revokeObjectURL(t);
    }, 1e3);
  };
}
function Ao(o) {
  const e = J(
    async (n) => {
      if (!o) return;
      const r = await On(o, !0), s = n || `file_${Date.now()}.pdf`;
      pi(r, s);
    },
    [o]
  ), t = J(async () => {
    if (!o) return;
    const n = await On(o, !0);
    fi(n);
  }, [o]);
  return {
    downloadClean: e,
    printClean: t
  };
}
const gi = (o, e, t) => {
  if (e === 1) return 1;
  const n = t.current;
  (n > 1 && e < 1 || n < 1 && e > 1) && (t.current = 1);
  const r = Math.floor(o * e * t.current * 100) / (100 * o);
  return t.current = e / r, r;
};
function mi({
  pdfViewer: o,
  containerRef: e,
  minScale: t = 0.1,
  maxScale: n = 10
}) {
  const r = B(1), s = B(1), i = B(!1), a = B(null), l = J((h, u, f) => {
    const p = e.current;
    if (!p || !o) return;
    const m = o.currentScale / h - 1;
    if (m === 0) return;
    const { left: v, top: C } = p.getBoundingClientRect();
    p.scrollLeft += (u - v) * m, p.scrollTop += (f - C) * m;
  }, [e, o]), d = J((h, u, f, p, g) => {
    const m = gi(h, u, g);
    if (m === 1) return;
    let v = Math.round(h * m * 100) / 100;
    v = Math.min(n, Math.max(t, v)), !(!o || !o.pdfDocument) && (o.currentScale = v, l(h, f, p));
  }, [l, n, t, o]);
  oe(() => {
    const h = e.current;
    if (!h || !o) return;
    const u = (g) => {
      if (!g.ctrlKey && !g.metaKey) return;
      g.preventDefault();
      const m = Math.exp(-g.deltaY / 100), v = o.currentScale;
      d(
        v,
        m,
        g.clientX,
        g.clientY,
        r
      );
    }, f = (g) => {
      (g.key === "Control" || g.key === "Meta") && (i.current = !0);
    }, p = (g) => {
      (g.key === "Control" || g.key === "Meta") && (i.current = !1);
    };
    return h.addEventListener("wheel", u, { passive: !1 }), window.addEventListener("keydown", f), window.addEventListener("keyup", p), () => {
      h.removeEventListener("wheel", u), window.removeEventListener("keydown", f), window.removeEventListener("keyup", p);
    };
  }, [o, e, d]), oe(() => {
    const h = e.current;
    if (!h || !o) return;
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
      let [v, C] = [g.touches[0], g.touches[1]];
      v.identifier > C.identifier && ([v, C] = [C, v]);
      const { pageX: E, pageY: S } = v, { pageX: x, pageY: N } = C, {
        touch0X: H,
        touch0Y: z,
        touch1X: F,
        touch1Y: j
      } = m;
      if (Math.abs(H - E) <= 1 && Math.abs(z - S) <= 1 && Math.abs(F - x) <= 1 && Math.abs(j - N) <= 1)
        return;
      if (m.touch0X = E, m.touch0Y = S, m.touch1X = x, m.touch1Y = N, H === E && z === S) {
        const X = F - E, q = j - S, ee = x - E, $ = N - S, y = X * $ - q * ee;
        if (Math.abs(y) > 0.02 * Math.hypot(X, q) * Math.hypot(ee, $))
          return;
      } else if (F === x && j === N) {
        const X = H - x, q = z - N, ee = E - x, $ = S - N, y = X * $ - q * ee;
        if (Math.abs(y) > 0.02 * Math.hypot(X, q) * Math.hypot(ee, $))
          return;
      } else {
        const X = E - H, q = x - F, ee = S - z, $ = N - j;
        if (X * q + ee * $ >= 0) return;
      }
      g.preventDefault();
      const G = Math.hypot(E - x, S - N) || 1, R = Math.hypot(H - F, z - j) || 1, T = o.currentScale, D = (v.clientX + C.clientX) / 2, _ = (v.clientY + C.clientY) / 2;
      d(
        T,
        G / R,
        D,
        _,
        s
      );
    }, p = (g) => {
      a.current && (g.preventDefault(), a.current = null, s.current = 1);
    };
    return h.addEventListener("touchstart", u, {
      passive: !1
    }), h.addEventListener("touchmove", f, {
      passive: !1
    }), h.addEventListener("touchend", p, {
      passive: !1
    }), h.addEventListener("touchcancel", p), () => {
      h.removeEventListener("touchstart", u), h.removeEventListener("touchmove", f), h.removeEventListener("touchend", p), h.removeEventListener("touchcancel", p);
    };
  }, [o, e, d]);
}
const vi = "_thumbnailList_vmgds_1", yi = "_thumbnail_vmgds_1", bi = "_thumbnailCanvasWrapper_vmgds_19", Si = "_thumbnailCanvas_vmgds_19", wi = "_thumbnailPlaceholder_vmgds_51", Ci = "_thumbnailError_vmgds_58", Ti = "_thumbnailPageNumber_vmgds_71", Ai = "_thumbnailMarker_vmgds_93", dt = {
  thumbnailList: vi,
  thumbnail: yi,
  thumbnailCanvasWrapper: bi,
  "thumbnail--selected": "_thumbnail--selected_vmgds_27",
  thumbnailCanvas: Si,
  thumbnailPlaceholder: wi,
  thumbnailError: Ci,
  thumbnailPageNumber: Ti,
  thumbnailMarker: Ai
}, xi = 132, Ei = "320px 0px", xo = ao(({
  pdfDocument: o,
  pageNumber: e,
  selected: t,
  markerCount: n,
  onSelect: r,
  onLayoutChange: s,
  registerElement: i
}) => {
  const { t: a } = ge(["viewer"], { useSuspense: !1 }), l = B(null), d = B(null), h = B(null), [u, f] = V(!1), [p, g] = V(!1), [m, v] = V(!1), C = n > 0 ? a("viewer:navigation.pageWithMarkers", {
    value: e,
    count: n
  }) : a("viewer:navigation.page", { value: e }), E = J((S) => {
    l.current = S, i(e, S);
  }, [e, i]);
  return oe(() => {
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
      { rootMargin: Ei }
    );
    return x.observe(S), () => x.disconnect();
  }, [u]), oe(() => {
    if (!u) return;
    let S = !1;
    return (async () => {
      let N = null;
      try {
        g(!1), v(!1);
        const H = await o.getPage(e);
        if (S) return;
        const z = d.current, F = z?.getContext("2d");
        if (!z || !F) return;
        const j = H.getViewport({ scale: 1 }), G = H.getViewport({ scale: xi / j.width }), R = Math.min(window.devicePixelRatio || 1, 2);
        z.width = Math.floor(G.width * R), z.height = Math.floor(G.height * R), z.style.width = `${Math.floor(G.width)}px`, z.style.height = `${Math.floor(G.height)}px`, s(), N = H.render({
          canvasContext: F,
          viewport: G,
          transform: R === 1 ? void 0 : [R, 0, 0, R, 0, 0]
        }), h.current = N, await N.promise, S || g(!0);
      } catch (H) {
        !S && H.name !== "RenderingCancelledException" && v(!0);
      } finally {
        h.current === N && (h.current = null);
      }
    })(), () => {
      S = !0, h.current?.cancel(), h.current = null;
    };
  }, [s, o, e, u]), /* @__PURE__ */ c(
    "button",
    {
      ref: E,
      type: "button",
      className: [
        dt.thumbnail,
        t ? dt["thumbnail--selected"] : ""
      ].join(" "),
      "aria-current": t ? "page" : void 0,
      "aria-label": C,
      onClick: () => r(e),
      children: /* @__PURE__ */ w("span", { className: dt.thumbnailCanvasWrapper, children: [
        /* @__PURE__ */ c("canvas", { ref: d, className: dt.thumbnailCanvas }),
        !p && !m && /* @__PURE__ */ c("span", { className: dt.thumbnailPlaceholder }),
        m && /* @__PURE__ */ c("span", { className: dt.thumbnailError, children: a("viewer:navigation.thumbnailError") }),
        n > 0 && /* @__PURE__ */ c("span", { className: dt.thumbnailMarker, "aria-hidden": "true", children: n > 99 ? "99+" : n }),
        /* @__PURE__ */ c("span", { className: dt.thumbnailPageNumber, children: e })
      ] })
    }
  );
});
xo.displayName = "PdfThumbnail";
const ki = ({ pageMarkerCounts: o }) => {
  const { pdfDocument: e, pdfViewer: t, eventBus: n } = je(), [r, s] = V(() => t?.currentPageNumber || 1), i = B(r), a = B(/* @__PURE__ */ new Map()), l = B(null), d = B(!0), h = J((m, v) => {
    v ? a.current.set(m, v) : a.current.delete(m);
  }, []), u = J(() => {
    l.current !== null && (window.cancelAnimationFrame(l.current), l.current = null);
  }, []), f = J(() => {
    d.current && (u(), l.current = window.requestAnimationFrame(() => {
      l.current = null, a.current.get(i.current)?.scrollIntoView({
        block: "nearest"
      });
    }));
  }, [u]), p = J(() => {
    d.current = !1, u();
  }, [u]), g = J((m) => {
    t && (d.current = !0, i.current = m, s(m), t.currentPageNumber = m);
  }, [t]);
  return oe(() => {
    if (!t || !n) return;
    const m = t.currentPageNumber || 1;
    d.current = !0, i.current = m, s(m);
    const v = ({ pageNumber: C }) => {
      d.current = !0, i.current = C, s(C);
    };
    return n.on("pagechanging", v), () => n.off("pagechanging", v);
  }, [n, t]), oe(() => {
    d.current = !0, i.current = r, f();
  }, [r, f, e]), oe(() => u, [u]), e ? /* @__PURE__ */ c(
    "div",
    {
      className: dt.thumbnailList,
      onPointerDown: p,
      onTouchStart: p,
      onWheel: p,
      children: Array.from({ length: e.numPages }, (m, v) => {
        const C = v + 1;
        return /* @__PURE__ */ c(
          xo,
          {
            pdfDocument: e,
            pageNumber: C,
            selected: C === r,
            markerCount: o.get(C) ?? 0,
            onSelect: g,
            onLayoutChange: f,
            registerElement: h
          },
          C
        );
      })
    }
  ) : null;
}, Ri = "_outline_fpevi_1", Pi = "_outlineTree_fpevi_5", Ni = "_outlineItem_fpevi_11", Ii = "_outlineRow_fpevi_16", Mi = "_outlineTitle_fpevi_26", Di = "_outlineToggle_fpevi_33", Li = "_outlineToggleSpacer_fpevi_60", _i = "_outlineChevron_fpevi_64", Oi = "_outlineState_fpevi_100", Ue = {
  outline: Ri,
  outlineTree: Pi,
  outlineItem: Ni,
  outlineRow: Ii,
  "outlineRow--selected": "_outlineRow--selected_fpevi_26",
  outlineTitle: Mi,
  outlineToggle: Di,
  outlineToggleSpacer: Li,
  outlineChevron: _i,
  "outlineChevron--expanded": "_outlineChevron--expanded_fpevi_73",
  outlineState: Oi
}, Hi = (o) => {
  if (!o || typeof o != "object") return !1;
  const e = o;
  return Number.isInteger(e.num) && Number.isInteger(e.gen);
}, In = ao(({
  depth: o,
  item: e,
  itemKey: t,
  selectedItemKey: n,
  onNavigate: r
}) => {
  const { t: s } = ge(["viewer"], { useSuspense: !1 }), i = e.items.length > 0, [a, l] = V(() => e.count === void 0 || e.count >= 0), d = e.title.trim() || s("viewer:navigation.untitledOutlineItem"), h = e.dest !== null, u = n === t, f = () => {
    h ? r(e, t) : i && l((p) => !p);
  };
  return /* @__PURE__ */ w(
    "li",
    {
      role: "treeitem",
      "aria-expanded": i ? a : void 0,
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
              i ? /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: Ue.outlineToggle,
                  "aria-label": s(a ? "viewer:navigation.collapseOutlineItem" : "viewer:navigation.expandOutlineItem", { title: d }),
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
                  children: d
                }
              ) : /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  className: Ue.outlineTitle,
                  disabled: !h && !i,
                  "aria-current": u ? "location" : void 0,
                  style: {
                    fontStyle: e.italic ? "italic" : void 0,
                    fontWeight: e.bold ? 600 : void 0
                  },
                  onClick: f,
                  children: d
                }
              )
            ]
          }
        ),
        i && a && /* @__PURE__ */ c("ul", { id: `${t}-children`, role: "group", className: Ue.outlineTree, children: e.items.map((p, g) => /* @__PURE__ */ c(
          In,
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
In.displayName = "OutlineItem";
const Gi = ({ onNavigate: o }) => {
  const { t: e } = ge(["viewer"], { useSuspense: !1 }), { pdfDocument: t, pdfViewer: n } = je(), r = B(0), [s, i] = V(null), [a, l] = V({
    document: null,
    status: "loading",
    items: []
  });
  oe(() => {
    if (!t) {
      l({ document: null, status: "loading", items: [] });
      return;
    }
    let h = !1;
    return r.current += 1, i(null), l({ document: t, status: "loading", items: [] }), t.getOutline().then(
      (u) => {
        h || l({
          document: t,
          status: "ready",
          items: u ?? []
        });
      },
      () => {
        h || l({
          document: t,
          status: "error",
          items: []
        });
      }
    ), () => {
      h = !0, r.current += 1;
    };
  }, [t]);
  const d = J(async (h, u) => {
    const f = r.current + 1;
    if (r.current = f, h.url) {
      o?.();
      return;
    }
    if (!(!t || !n || h.dest === null))
      try {
        const p = typeof h.dest == "string" ? await t.getDestination(h.dest) : h.dest;
        if (r.current !== f || n.pdfDocument !== t || !Array.isArray(p))
          return;
        const g = p[0];
        let m = null;
        if (Hi(g) ? (m = t.cachedPageNumber(g), m || (m = await t.getPageIndex(g) + 1)) : Number.isInteger(g) && (m = g + 1), r.current !== f || n.pdfDocument !== t || !m || m < 1 || m > t.numPages)
          return;
        n.scrollPageIntoView({
          pageNumber: m,
          destArray: p
        }), i(u), o?.();
      } catch {
      }
  }, [o, t, n]);
  return !t || a.document !== t || a.status === "loading" ? /* @__PURE__ */ c("div", { className: Ue.outlineState, children: e("viewer:navigation.outlineLoading") }) : a.status === "error" ? /* @__PURE__ */ c("div", { className: Ue.outlineState, children: e("viewer:navigation.outlineError") }) : a.items.length === 0 ? /* @__PURE__ */ c("div", { className: Ue.outlineState, children: e("viewer:navigation.outlineEmpty") }) : /* @__PURE__ */ c("nav", { className: Ue.outline, "aria-label": e("viewer:navigation.outline"), children: /* @__PURE__ */ c("ul", { role: "tree", className: Ue.outlineTree, children: a.items.map((h, u) => /* @__PURE__ */ c(
    In,
    {
      itemKey: `outline-${u}`,
      item: h,
      depth: 0,
      selectedItemKey: s,
      onNavigate: d
    },
    `outline-${u}`
  )) }) });
}, $t = "inklayer:navigation-page-markers-changed", Ui = "_navigationSidebar_13vi9_1", zi = "_navigationSidebarContainer_13vi9_19", Fi = "_navigationTabs_13vi9_29", ji = "_navigationTabsList_13vi9_36", Wi = "_navigationTabsTrigger_13vi9_47", Bi = "_navigationTabsContent_13vi9_56", $i = "_navigationSidebarOverlay_13vi9_63", nt = {
  navigationSidebar: Ui,
  "navigationSidebar--hidden": "_navigationSidebar--hidden_13vi9_14",
  navigationSidebarContainer: zi,
  navigationTabs: Fi,
  navigationTabsList: ji,
  navigationTabsTrigger: Wi,
  navigationTabsContent: Bi,
  navigationSidebarOverlay: $i
}, Vi = ({
  open: o,
  onClose: e,
  onTransitionEnd: t
}) => {
  const { t: n } = ge(["viewer"], { useSuspense: !1 }), { eventBus: r } = je(), [s, i] = V("thumbnails"), [a, l] = V(() => /* @__PURE__ */ new Map()), d = J((f) => {
    (f === "thumbnails" || f === "outline") && i(f);
  }, []);
  oe(() => {
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
    return r.on($t, f), () => {
      r.off($t, f);
    };
  }, [r]), oe(() => {
    if (!o) return;
    const f = (p) => {
      p.key === "Escape" && e();
    };
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, [e, o]);
  const h = Ae(() => {
    const f = /* @__PURE__ */ new Map();
    return a.forEach((p) => {
      p.forEach((g, m) => {
        f.set(m, (f.get(m) ?? 0) + g);
      });
    }), f;
  }, [a]), u = J(() => {
    window.matchMedia("(max-width: 840px)").matches && e();
  }, [e]);
  return /* @__PURE__ */ w(Se, { children: [
    /* @__PURE__ */ c(
      "aside",
      {
        id: "InkLayer-navigation-sidebar",
        className: [
          nt.navigationSidebar,
          o ? "" : nt["navigationSidebar--hidden"]
        ].join(" "),
        "aria-label": n("viewer:navigation.label"),
        "aria-hidden": !o,
        onTransitionEnd: t,
        children: /* @__PURE__ */ c("div", { className: nt.navigationSidebarContainer, hidden: !o, children: /* @__PURE__ */ w(
          Ct.Root,
          {
            value: s,
            onValueChange: d,
            className: nt.navigationTabs,
            children: [
              /* @__PURE__ */ w(Ct.List, { className: nt.navigationTabsList, children: [
                /* @__PURE__ */ c(
                  Ct.Trigger,
                  {
                    value: "thumbnails",
                    className: nt.navigationTabsTrigger,
                    children: /* @__PURE__ */ c("span", { children: n("viewer:navigation.thumbnails") })
                  }
                ),
                /* @__PURE__ */ c(
                  Ct.Trigger,
                  {
                    value: "outline",
                    className: nt.navigationTabsTrigger,
                    children: /* @__PURE__ */ c("span", { children: n("viewer:navigation.outline") })
                  }
                )
              ] }),
              /* @__PURE__ */ c(
                Ct.Content,
                {
                  value: "thumbnails",
                  className: nt.navigationTabsContent,
                  children: /* @__PURE__ */ c(ki, { pageMarkerCounts: h })
                }
              ),
              /* @__PURE__ */ c(
                Ct.Content,
                {
                  value: "outline",
                  className: nt.navigationTabsContent,
                  children: /* @__PURE__ */ c(Gi, { onNavigate: u })
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
        className: nt.navigationSidebarOverlay,
        onClick: e
      }
    )
  ] });
}, Yi = /* @__PURE__ */ new Set(["auto", "page-fit", "page-width"]), Eo = ({
  children: o,
  toolbar: e,
  sidebar: t,
  defaultActiveSidebarKey: n,
  title: r,
  actions: s,
  style: i = { width: "100vw", height: "100vh" },
  initialScale: a = "auto",
  user: l,
  hideHeader: d = !1,
  hidePageIndicator: h = !1,
  ...u
}) => {
  const { t: f } = ge(["viewer"], { useSuspense: !1 }), p = B(null), { loading: g, progress: m, pdfDocument: v, pdfViewer: C, eventBus: E, loadError: S } = Jr(p, u), [x, N] = V(!1), H = J(() => {
    N((W) => !W);
  }, []), [z, F] = V(() => n || null), j = z === null;
  oe(() => {
    if (!C || !E) return;
    const W = () => {
      C.currentScaleValue = a;
    };
    return E.on("pagesloaded", W), () => {
      E.off("pagesloaded", W);
    };
  }, [C, E, a]);
  const G = J(() => {
    F((W) => W ? null : t?.[0]?.key ?? null);
  }, [t]), R = J((W) => {
    F(W);
  }, []), T = J(() => {
    F(null);
  }, []), D = J(() => {
    if (!C) return;
    const W = C.currentScaleValue;
    Yi.has(W) && (C.currentScaleValue = W, C.update());
  }, [C]), _ = J(
    (W) => {
      W.target !== W.currentTarget || W.propertyName !== "width" || D();
    },
    [D]
  ), X = !!(C && E && p.current && !g), { printClean: q, downloadClean: ee } = Ao(v);
  mi({
    pdfViewer: C ?? null,
    containerRef: p,
    minScale: 0.1,
    maxScale: 10
  });
  const $ = Ae(
    () => ({
      pdfDocument: v,
      pdfViewer: C,
      eventBus: E,
      viewerContainerRef: p,
      isReady: X,
      activeSidebarPanel: z,
      isNavigationSidebarOpen: x,
      toggleNavigationSidebar: H,
      toggleSidebar: G,
      openSidebar: R,
      closeSidebar: T,
      isSidebarCollapsed: j,
      print: q,
      download: ee
    }),
    [
      v,
      C,
      E,
      X,
      G,
      j,
      R,
      T,
      z,
      x,
      H,
      q,
      ee
    ]
  ), y = Ae(
    () => ({
      user: l || null
    }),
    [l]
  );
  oe(() => {
    if (!C || !E)
      return;
    const W = () => {
      const Q = C.currentScaleValue;
      (Q === "auto" || Q === "page-fit" || Q === "page-width") && (C.currentScaleValue = Q), C.update();
    };
    return window.addEventListener("resize", W), W(), () => {
      window.removeEventListener("resize", W);
    };
  }, [C, E]);
  const M = t && /* @__PURE__ */ c(K, { gap: "2", children: t.map((W) => /* @__PURE__ */ c(At, { content: W.title, children: /* @__PURE__ */ c(
    me,
    {
      variant: z === W.key ? "soft" : "outline",
      size: "2",
      color: "gray",
      highContrast: !0,
      style: {
        boxShadow: "none"
      },
      onClick: () => F((Q) => Q === W.key ? null : W.key),
      children: W.icon
    }
  ) }, W.key)) }), ce = Ae(() => !t || !z ? null : t.find((W) => W.key === z) || null, [t, z]);
  return oe(() => {
    if (!t || !z) return;
    t.some((Q) => Q.key === z) || F(null);
  }, [t, z]), /* @__PURE__ */ c(Nn.Provider, { value: y, children: /* @__PURE__ */ c(So.Provider, { value: $, children: /* @__PURE__ */ w(K, { id: "InkLayer", className: Ne.InkLayerViewer, style: i, direction: "column", width: "100%", position: "relative", children: [
    /* @__PURE__ */ c(li, { progress: m, loading: g }),
    S && /* @__PURE__ */ c(di, { error: S }),
    !d && /* @__PURE__ */ c(K, { pl: "2", pr: "2", className: Ne.viewerHeader, children: /* @__PURE__ */ w("div", { className: Ne["viewerHeader-title"], children: [
      /* @__PURE__ */ w(K, { align: "center", gap: "2", className: Ne["viewerHeader-title-left"], children: [
        /* @__PURE__ */ c(At, { content: f("viewer:navigation.toggle"), children: /* @__PURE__ */ c(
          me,
          {
            variant: "outline",
            size: "2",
            color: "gray",
            highContrast: !0,
            style: { boxShadow: "none" },
            "aria-controls": "InkLayer-navigation-sidebar",
            "aria-expanded": x,
            "aria-label": f("viewer:navigation.toggle"),
            onClick: () => N((W) => !W),
            children: x ? /* @__PURE__ */ c(jr, { className: Ne.navigationSidebarTriggerIcon }) : /* @__PURE__ */ c(Wr, { className: Ne.navigationSidebarTriggerIcon })
          }
        ) }),
        /* @__PURE__ */ c("div", { className: Ne["viewerHeader-title-name"], children: r || "PDF Viewer" })
      ] }),
      /* @__PURE__ */ c("div", { className: Ne["viewerHeader-title-actions"], children: /* @__PURE__ */ w(K, { direction: "row", gap: "3", justify: "between", align: "center", children: [
        M,
        s
      ] }) })
    ] }) }),
    /* @__PURE__ */ w(K, { flexGrow: "1", minHeight: "0", className: Ne.viewerBody, children: [
      /* @__PURE__ */ c(
        Vi,
        {
          open: x,
          onClose: () => N(!1),
          onTransitionEnd: _
        }
      ),
      /* @__PURE__ */ w(K, { flexGrow: "1", minHeight: "0", className: Ne.viewerWrapper, children: [
        /* @__PURE__ */ w(K, { className: Ne.viewerContainer, direction: "column", flexGrow: "1", children: [
          e && /* @__PURE__ */ c(K, { align: "center", justify: "center", className: Ne["viewerContainer-header"], children: e }),
          /* @__PURE__ */ w(st, { position: "relative", flexGrow: "1", className: Ne["viewerContainer-content"], children: [
            !h && /* @__PURE__ */ c(Co, {}),
            /* @__PURE__ */ c("div", { ref: p, className: Ne.pdfjsViewerContainer, children: /* @__PURE__ */ c("div", { className: "pdfViewer" }) })
          ] })
        ] }),
        /* @__PURE__ */ c(
          st,
          {
            id: "InkLayer-viewer-sidebar",
            className: [
              Ne.viewerSidebar,
              ce ? "" : Ne["viewerSidebar--hidden"]
            ].join(" "),
            pl: "1",
            pr: "1",
            onTransitionEnd: _,
            children: ce && /* @__PURE__ */ c("div", { className: Ne["viewerSidebar-container"], children: ce.render($) })
          }
        ),
        ce && /* @__PURE__ */ c(
          "div",
          {
            className: Ne.sidebarOverlay,
            onClick: () => F(null)
          }
        )
      ] })
    ] }),
    o
  ] }) }) });
}, Re = ({ children: o, style: e, ...t }) => /* @__PURE__ */ c("svg", { ...t, style: { width: "1em", height: "1em", ...e }, children: o }), Ki = ({ style: o }) => /* @__PURE__ */ c(Re, { viewBox: "0 0 320 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M0 55.2V426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320H297.9c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z"
  }
) }), ko = ({ style: o }) => /* @__PURE__ */ c(Re, { fill: "currentColor", viewBox: "0 0 576 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M315 315l158.4-215L444.1 70.6 229 229 315 315zm-187 5l0 0V248.3c0-15.3 7.2-29.6 19.5-38.6L420.6 8.4C428 2.9 437 0 446.2 0c11.4 0 22.4 4.5 30.5 12.6l54.8 54.8c8.1 8.1 12.6 19 12.6 30.5c0 9.2-2.9 18.2-8.4 25.6L334.4 396.5c-9 12.3-23.4 19.5-38.6 19.5H224l-25.4 25.4c-12.5 12.5-32.8 12.5-45.3 0l-50.7-50.7c-12.5-12.5-12.5-32.8 0-45.3L128 320zM7 466.3l63-63 70.6 70.6-31 31c-4.5 4.5-10.6 7-17 7H24c-13.3 0-24-10.7-24-24v-4.7c0-6.4 2.5-12.5 7-17z"
  }
) }), Ro = ({ style: o }) => /* @__PURE__ */ c(Re, { fill: "currentColor", viewBox: "0 0 512 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M161.3 144c3.2-17.2 14-30.1 33.7-38.6c21.1-9 51.8-12.3 88.6-6.5c11.9 1.9 48.8 9.1 60.1 12c17.1 4.5 34.6-5.6 39.2-22.7s-5.6-34.6-22.7-39.2c-14.3-3.8-53.6-11.4-66.6-13.4c-44.7-7-88.3-4.2-123.7 10.9c-36.5 15.6-64.4 44.8-71.8 87.3c-.1 .6-.2 1.1-.2 1.7c-2.8 23.9 .5 45.6 10.1 64.6c4.5 9 10.2 16.9 16.7 23.9H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H270.1c-.1 0-.3-.1-.4-.1l-1.1-.3c-36-10.8-65.2-19.6-85.2-33.1c-9.3-6.3-15-12.6-18.2-19.1c-3.1-6.1-5.2-14.6-3.8-27.4zM348.9 337.2c2.7 6.5 4.4 15.8 1.9 30.1c-3 17.6-13.8 30.8-33.9 39.4c-21.1 9-51.7 12.3-88.5 6.5c-18-2.9-49.1-13.5-74.4-22.1c-5.6-1.9-11-3.7-15.9-5.4c-16.8-5.6-34.9 3.5-40.5 20.3s3.5 34.9 20.3 40.5c3.6 1.2 7.9 2.7 12.7 4.3l0 0 0 0c24.9 8.5 63.6 21.7 87.6 25.6l0 0 .2 0c44.7 7 88.3 4.2 123.7-10.9c36.5-15.6 64.4-44.8 71.8-87.3c3.6-21 2.7-40.4-3.1-58.1H335.1c7 5.6 11.4 11.2 13.9 17.2z"
  }
) }), Po = ({ style: o }) => /* @__PURE__ */ c(Re, { fill: "currentColor", viewBox: "0 0 448 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M16 64c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H128V224c0 53 43 96 96 96s96-43 96-96V96H304c-17.7 0-32-14.3-32-32s14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H384V224c0 88.4-71.6 160-160 160s-160-71.6-160-160V96H48C30.3 96 16 81.7 16 64zM0 448c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32z"
  }
) }), Xi = ({ style: o }) => /* @__PURE__ */ c(Re, { fill: "currentColor", viewBox: "0 0 384 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M32 32C14.3 32 0 46.3 0 64S14.3 96 32 96H160V448c0 17.7 14.3 32 32 32s32-14.3 32-32V96H352c17.7 0 32-14.3 32-32s-14.3-32-32-32H192 32z"
  }
) }), qi = ({ style: o }) => /* @__PURE__ */ c(Re, { fill: "currentColor", viewBox: "0 0 512 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M384 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H384zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"
  }
) }), Ji = ({ style: o }) => /* @__PURE__ */ c(Re, { fill: "currentColor", viewBox: "0 0 512 512", style: o, children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" }) }), Zi = ({ style: o }) => /* @__PURE__ */ c(Re, { fill: "currentColor", viewBox: "0 0 512 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
  }
) }), Qi = ({ style: o }) => /* @__PURE__ */ c(Re, { fill: "currentColor", viewBox: "0 0 576 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M315 315l158.4-215L444.1 70.6 229 229 315 315zm-187 5l0 0V248.3c0-15.3 7.2-29.6 19.5-38.6L420.6 8.4C428 2.9 437 0 446.2 0c11.4 0 22.4 4.5 30.5 12.6l54.8 54.8c8.1 8.1 12.6 19 12.6 30.5c0 9.2-2.9 18.2-8.4 25.6L334.4 396.5c-9 12.3-23.4 19.5-38.6 19.5H224l-25.4 25.4c-12.5 12.5-32.8 12.5-45.3 0l-50.7-50.7c-12.5-12.5-12.5-32.8 0-45.3L128 320zM7 466.3l63-63 70.6 70.6-31 31c-4.5 4.5-10.6 7-17 7H24c-13.3 0-24-10.7-24-24v-4.7c0-6.4 2.5-12.5 7-17z"
  }
) }), es = ({ style: o }) => /* @__PURE__ */ c(Re, { fill: "currentColor", viewBox: "0 0 640 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M192 128c0-17.7 14.3-32 32-32s32 14.3 32 32v7.8c0 27.7-2.4 55.3-7.1 82.5l-84.4 25.3c-40.6 12.2-68.4 49.6-68.4 92v71.9c0 40 32.5 72.5 72.5 72.5c26 0 50-13.9 62.9-36.5l13.9-24.3c26.8-47 46.5-97.7 58.4-150.5l94.4-28.3-12.5 37.5c-3.3 9.8-1.6 20.5 4.4 28.8s15.7 13.3 26 13.3H544c17.7 0 32-14.3 32-32s-14.3-32-32-32H460.4l18-53.9c3.8-11.3 .9-23.8-7.4-32.4s-20.7-11.8-32.2-8.4L316.4 198.1c2.4-20.7 3.6-41.4 3.6-62.3V128c0-53-43-96-96-96s-96 43-96 96v32c0 17.7 14.3 32 32 32s32-14.3 32-32V128zm-9.2 177l49-14.7c-10.4 33.8-24.5 66.4-42.1 97.2l-13.9 24.3c-1.5 2.6-4.3 4.3-7.4 4.3c-4.7 0-8.5-3.8-8.5-8.5V335.6c0-14.1 9.3-26.6 22.8-30.7zM24 368c-13.3 0-24 10.7-24 24s10.7 24 24 24H64.3c-.2-2.8-.3-5.6-.3-8.5V368H24zm592 48c13.3 0 24-10.7 24-24s-10.7-24-24-24H305.9c-6.7 16.3-14.2 32.3-22.3 48H616z"
  }
) }), ts = ({ style: o }) => /* @__PURE__ */ c(Re, { fill: "currentColor", viewBox: "0 0 512 512", style: o, children: /* @__PURE__ */ c(
  "path",
  {
    fill: "currentColor",
    d: "M312 201.8c0-17.4 9.2-33.2 19.9-47C344.5 138.5 352 118.1 352 96c0-53-43-96-96-96s-96 43-96 96c0 22.1 7.5 42.5 20.1 58.8c10.7 13.8 19.9 29.6 19.9 47c0 29.9-24.3 54.2-54.2 54.2H112C50.1 256 0 306.1 0 368c0 20.9 13.4 38.7 32 45.3V464c0 26.5 21.5 48 48 48H432c26.5 0 48-21.5 48-48V413.3c18.6-6.6 32-24.4 32-45.3c0-61.9-50.1-112-112-112H366.2c-29.9 0-54.2-24.3-54.2-54.2zM416 416v32H96V416H416z"
  }
) }), ns = ({ style: o }) => /* @__PURE__ */ w(Re, { viewBox: "0 0 1024 1024", style: o, children: [
  /* @__PURE__ */ c("path", { d: "M96 837.68888888h832v160H96z", fill: "var(--palette-preview-color, currentColor)" }),
  /* @__PURE__ */ c("path", { d: "M429.30646525 163.315053m54.92260742 54.92260743l164.76782227 164.76782227q54.92260742 54.92260742 0 109.84521486l-164.76782227 164.76782228q-54.92260742 54.92260742-109.84521486 0l-164.76782228-164.76782228q-54.92260742-54.92260742 0-109.84521486l164.76782228-164.76782227q54.92260742-54.92260742 109.84521486 0Z", fill: "var(--palette-preview-color, currentColor)" }),
  /* @__PURE__ */ c("path", { d: "M364.65047577 163.33699097L262.12304466 60.85098508 320.69831237 2.23429214l153.14905568 153.10763046c2.94119095 2.27838736 5.79953147 4.76390083 8.5335963 7.45654045l234.34249608 234.34249608a82.85044939 82.85044939 0 0 1 0 117.15053543l-234.34249608 234.34249607a82.85044939 82.85044939 0 0 1-117.19196065 0L130.88793283 514.29149456a82.85044939 82.85044939 0 0 1 0-117.15053543l233.76254294-233.80396816z m220.2579197 219.13943862l-0.57995316 0.53852791-161.0612736-161.0612736-226.72025474 226.67882952h454.51756532L584.90839547 382.47642959zM822.68918518 783.3069037a103.56306173 103.56306173 0 0 1-103.56306171-103.56306173c0-57.16681008 87.61435022-161.39267539 103.56306171-161.3926754 15.9487115 0 103.56306173 104.1844401 103.56306173 161.3926754a103.56306173 103.56306173 0 0 1-103.56306173 103.56306173z", fill: "currentColor" })
] }), os = ({ style: o }) => /* @__PURE__ */ w(
  Re,
  {
    viewBox: "0 0 1024 1024",
    style: o,
    children: [
      /* @__PURE__ */ c("path", { fill: "currentColor", stroke: "currentColor", strokeWidth: "16", strokeLinejoin: "round", d: "M542.04 141.43c-68.07-39.3-151.95-39.3-220.03 0-68.07 39.31-110.01 111.95-110 190.56C212.02 453.5 310.52 552 432.03 552s220.01-98.5 220.02-220.01c0.01-78.61-41.93-151.25-110.01-190.56zM432.03 472c-77.33 0-140.01-62.69-140.01-140.01s62.68-140.02 140.01-140.02c77.33 0 140.02 62.69 140.02 140.02S509.36 472 432.03 472zM325.06 612.02h186.98c22.09 0 40 17.91 40 40s-17.91 40-40 40H332.02c-58.73 0-79.21 0.4-94.81 5.2a120.03 120.03 0 0 0-80.01 80c-4.79 15.6-5.2 36.09-5.2 94.82 0 14.29-7.62 27.5-19.99 34.65a40.044 40.044 0 0 1-40.01 0 40.013 40.013 0 0 1-20-34.65v-6.97c0-49.08 0-82.61 8.6-111.09C99.99 690.04 150.03 640 213.98 620.62c28.48-8.65 62-8.65 111.08-8.6z" }),
      /* @__PURE__ */ c("path", { fill: "currentColor", stroke: "currentColor", strokeWidth: "24", strokeLinecap: "round", strokeLinejoin: "round", d: "M720.72 551.99c4.72 0 9.24 1.87 12.58 5.21 3.34 3.33 5.21 7.86 5.21 12.58v71.16h106.74v-71.16c0-6.36 3.39-12.23 8.9-15.41a17.78 17.78 0 0 1 17.79 0c5.5 3.18 8.89 9.05 8.89 15.41v71.16h53.37c6.36 0 12.23 3.39 15.41 8.89a17.78 17.78 0 0 1 0 17.79c-3.18 5.5-9.05 8.89-15.41 8.89h-53.37v106.74h53.37c6.36 0 12.23 3.39 15.41 8.9a17.78 17.78 0 0 1 0 17.79c-3.18 5.5-9.05 8.9-15.41 8.89h-53.37v71.16c0 6.36-3.39 12.23-8.89 15.41a17.78 17.78 0 0 1-17.79 0c-5.51-3.18-8.9-9.05-8.9-15.41v-71.16H738.51v71.16c0 6.36-3.39 12.23-8.9 15.41a17.78 17.78 0 0 1-17.79 0c-5.51-3.18-8.9-9.05-8.89-15.41v-71.16h-53.37c-6.36 0-12.23-3.39-15.41-8.89a17.78 17.78 0 0 1 0-17.79c3.18-5.51 9.05-8.9 15.41-8.9h53.37V676.53h-53.37c-9.82 0-17.79-7.96-17.79-17.79 0-9.82 7.96-17.79 17.79-17.79h53.37v-71.16c0-9.83 7.96-17.8 17.79-17.8z m17.79 124.54v106.74h106.74V676.53H738.51z m0 0" })
    ]
  }
), rs = ({ style: o }) => /* @__PURE__ */ c(Re, { viewBox: "0 0 1024 1024", style: o, children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M766.4 744.3c43.7 0 79.4-36.2 79.4-80.5 0-53.5-79.4-140.8-79.4-140.8S687 610.3 687 663.8c0 44.3 35.7 80.5 79.4 80.5zm-377.1-44.1c7.1 7.1 18.6 7.1 25.6 0l256.1-256c7.1-7.1 7.1-18.6 0-25.6l-256-256c-.6-.6-1.3-1.2-2-1.7l-78.2-78.2a9.11 9.11 0 00-12.8 0l-48 48a9.11 9.11 0 000 12.8l67.2 67.2-207.8 207.9c-7.1 7.1-7.1 18.6 0 25.6l255.9 256zm12.9-448.6l178.9 178.9H223.4l178.8-178.9zM904 816H120c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8z" }) }), is = ({ style: o }) => /* @__PURE__ */ w(Re, { viewBox: "0 0 1024 1024", style: o, children: [
  /* @__PURE__ */ c("path", { d: "M66.782609 772.541217h196.051478a58.835478 58.835478 0 0 1 58.768696 58.768696v117.359304l235.78713-165.442782c9.928348-6.989913 21.615304-10.685217 33.747478-10.685218H957.217391V89.043478H66.782609v683.475479zM313.61113 1022.886957a58.768696 58.768696 0 0 1-58.768695-58.768696v-124.794435H58.724174A58.813217 58.813217 0 0 1 0 780.55513V81.029565A58.835478 58.835478 0 0 1 58.768696 22.26087h906.462608A58.835478 58.835478 0 0 1 1024 81.029565v699.503305a58.835478 58.835478 0 0 1-58.768696 58.768695H593.697391L347.336348 1012.201739c-10.106435 7.101217-21.904696 10.685217-33.725218 10.685218z", fill: "currentColor" }),
  /* @__PURE__ */ c("path", { d: "M761.878261 326.032696h-499.756522a33.391304 33.391304 0 0 1 0-66.782609h499.756522a33.391304 33.391304 0 1 1 0 66.782609M761.878261 567.652174h-499.756522a33.391304 33.391304 0 0 1 0-66.782609h499.756522a33.391304 33.391304 0 1 1 0 66.782609", fill: "currentColor" })
] }), No = ({ style: o }) => /* @__PURE__ */ c(Re, { viewBox: "0 0 1024 1024", style: o, children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M464 512a48 48 0 1096 0 48 48 0 10-96 0zm200 0a48 48 0 1096 0 48 48 0 10-96 0zm-400 0a48 48 0 1096 0 48 48 0 10-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 00-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 00-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 00112 714v152a46 46 0 0046 46h152.1A449.4 449.4 0 00510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 00142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z" }) }), ss = ({ style: o }) => /* @__PURE__ */ c(Re, { style: o, viewBox: "0 0 1024 1024", children: /* @__PURE__ */ c("path", { d: "M820.35259846 337.71374951V646.0663464h134.06634641V109.8009592h-536.2653872v134.06634641h308.35259689L109.8009592 860.57250255l93.84644234 93.84644232 616.70519692-616.70519536z", fill: "currentColor" }) }), as = ({ style: o }) => /* @__PURE__ */ c(Re, { style: o, viewBox: "0 0 1365 1024", children: /* @__PURE__ */ c("path", { d: "M992 992H392v-2.71999969A319.75999969 319.75999969 0 0 1 193.92000031 393.99999969a400.00000031 400.00000031 0 0 1 790.11999938-41.47999969c2.68000031 0 5.28-0.52000031 8.00000062-0.52000031A319.99999969 319.99999969 0 0 1 992 992z m0-480h-7.99999969a247.99999969 247.99999969 0 0 1-77.28 0H831.99999969v-79.99999969a240 240 0 0 0-480 0v79.99999969a202.87999969 202.87999969 0 0 0-79.99999969 22.56L247.23999969 552.00000031a157.39999969 157.39999969 0 0 0-15.24 15.31999969 54.28000031 54.28000031 0 0 0-9.96 12.48A157.44 157.44 0 0 0 192.00000031 672.00000031a166.36000031 166.36000031 0 0 0 120 159.99999938h679.99999969a160.00000031 160.00000031 0 0 0 0-319.99999969z", fill: "currentColor" }) }), cs = ({ style: o }) => /* @__PURE__ */ c(Re, { style: o, viewBox: "0 0 1024 1024", children: /* @__PURE__ */ c("path", { fill: "currentColor", d: "M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z" }) });
var te = /* @__PURE__ */ ((o) => (o[o.NONE = 0] = "NONE", o[o.TEXT = 1] = "TEXT", o[o.LINK = 2] = "LINK", o[o.FREETEXT = 3] = "FREETEXT", o[o.LINE = 4] = "LINE", o[o.SQUARE = 5] = "SQUARE", o[o.CIRCLE = 6] = "CIRCLE", o[o.POLYGON = 7] = "POLYGON", o[o.POLYLINE = 8] = "POLYLINE", o[o.HIGHLIGHT = 9] = "HIGHLIGHT", o[o.UNDERLINE = 10] = "UNDERLINE", o[o.SQUIGGLY = 11] = "SQUIGGLY", o[o.STRIKEOUT = 12] = "STRIKEOUT", o[o.STAMP = 13] = "STAMP", o[o.CARET = 14] = "CARET", o[o.INK = 15] = "INK", o[o.POPUP = 16] = "POPUP", o[o.FILEATTACHMENT = 17] = "FILEATTACHMENT", o[o.SOUND = 18] = "SOUND", o[o.MOVIE = 19] = "MOVIE", o[o.WIDGET = 20] = "WIDGET", o[o.SCREEN = 21] = "SCREEN", o[o.PRINTERMARK = 22] = "PRINTERMARK", o[o.TRAPNET = 23] = "TRAPNET", o[o.WATERMARK = 24] = "WATERMARK", o[o.THREED = 25] = "THREED", o[o.REDACT = 26] = "REDACT", o[o.NOTE = 27] = "NOTE", o))(te || {}), k = /* @__PURE__ */ ((o) => (o[o.NONE = -1] = "NONE", o[o.SELECT = 0] = "SELECT", o[o.HIGHLIGHT = 1] = "HIGHLIGHT", o[o.STRIKEOUT = 2] = "STRIKEOUT", o[o.UNDERLINE = 3] = "UNDERLINE", o[o.FREETEXT = 4] = "FREETEXT", o[o.RECTANGLE = 5] = "RECTANGLE", o[o.CIRCLE = 6] = "CIRCLE", o[o.FREEHAND = 7] = "FREEHAND", o[o.FREE_HIGHLIGHT = 8] = "FREE_HIGHLIGHT", o[o.SIGNATURE = 9] = "SIGNATURE", o[o.STAMP = 10] = "STAMP", o[o.NOTE = 11] = "NOTE", o[o.ARROW = 12] = "ARROW", o[o.CLOUD = 13] = "CLOUD", o))(k || {}), ot = /* @__PURE__ */ ((o) => (o.Accepted = "Accepted", o.Rejected = "Rejected", o.Cancelled = "Cancelled", o.Completed = "Completed", o.None = "None", o.Closed = "Closed", o))(ot || {});
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
    icon: /* @__PURE__ */ c(Ki, {})
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
    icon: /* @__PURE__ */ c(ko, {}),
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
    icon: /* @__PURE__ */ c(Ro, {}),
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
    icon: /* @__PURE__ */ c(Po, {}),
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
    icon: /* @__PURE__ */ c(qi, {}),
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
    icon: /* @__PURE__ */ c(Ji, {}),
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
    icon: /* @__PURE__ */ c(is, {})
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
    icon: /* @__PURE__ */ c(ss, {}),
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
    icon: /* @__PURE__ */ c(as, {}),
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
    icon: /* @__PURE__ */ c(Zi, {}),
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
    icon: /* @__PURE__ */ c(Qi, {}),
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
    icon: /* @__PURE__ */ c(Xi, {}),
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
    icon: /* @__PURE__ */ c(es, {})
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
    icon: /* @__PURE__ */ c(ts, {})
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
function ls(o) {
  return document.body.contains(o);
}
function Io() {
  return Br();
}
function Mo(o, e) {
  document.documentElement.style.setProperty(o, e);
}
function cn(o) {
  document.documentElement.style.removeProperty(o);
}
function yn(o) {
  if (o < 1024) return `${o} B`;
  const e = ["KB", "MB", "GB", "TB"];
  let t = -1, n = o;
  do
    n /= 1024, t++;
  while (n >= 1024 && t < e.length - 1);
  return `${n.toFixed(2)} ${e[t]}`;
}
function Vt(o, e, t) {
  if (o <= t && e <= t)
    return { newWidth: o, newHeight: e };
  const n = t / o, r = t / e, s = Math.min(n, r), i = o * s, a = e * s;
  return { newWidth: i, newHeight: a };
}
function Ye(o, e = 0) {
  if (e < 0 || e * 3 + 2 >= o.length)
    throw new Error("Index out of bounds");
  const t = o[e * 3], n = o[e * 3 + 1], r = o[e * 3 + 2];
  return `rgb(${t}, ${n}, ${r})`;
}
function Wt(o) {
  const e = new Date(o), t = e.getFullYear(), n = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getDate()).padStart(2, "0"), s = String(e.getHours()).padStart(2, "0"), i = String(e.getMinutes()).padStart(2, "0"), a = String(e.getSeconds()).padStart(2, "0"), l = -e.getTimezoneOffset(), d = String(Math.floor(Math.abs(l) / 60)).padStart(2, "0"), h = String(Math.abs(l) % 60).padStart(2, "0"), u = l >= 0 ? "+" : "-";
  return `D:${t}${n}${r}${s}${i}${a}${u}${d}'${h}'`;
}
function bn(o, e = !1) {
  if (!o || typeof o != "string" || !o.startsWith("D:"))
    return "";
  const t = o.slice(2, 16);
  if (t.length !== 14)
    return "";
  const n = t.slice(0, 4), r = t.slice(4, 6), s = t.slice(6, 8), i = t.slice(8, 10), a = t.slice(10, 12);
  if (e)
    return Ce.t("common:dateFormat.full", { year: n, month: r, day: s, hour: i, minute: a });
  const l = /* @__PURE__ */ new Date(), d = l.getFullYear().toString(), h = (l.getMonth() + 1).toString().padStart(2, "0"), u = l.getDate().toString().padStart(2, "0");
  return n === d && r === h && s === u ? `${i}:${a}` : n === d ? Ce.t("common:dateFormat.dayMonth", { day: s, month: r }) : Ce.t("common:dateFormat.dayMonthYear", { day: s, month: r, year: n });
}
function Hn(o) {
  if (!o || typeof o != "string" || !o.startsWith("D:"))
    return "";
  const e = o.slice(2, 16);
  if (e.length !== 14)
    return "";
  const t = e.slice(0, 4), n = e.slice(4, 6), r = e.slice(6, 8), s = e.slice(8, 10), i = e.slice(10, 12), a = (/* @__PURE__ */ new Date()).getFullYear().toString(), l = t === a ? "common:dateFormat.compact" : "common:dateFormat.compactWithYear";
  return Ce.t(l, {
    year: t,
    month: n,
    day: r,
    hour: s,
    minute: i
  });
}
function Gn(o) {
  const e = o.slice(2, 16), t = parseInt(e.slice(0, 4), 10), n = parseInt(e.slice(4, 6), 10) - 1, r = parseInt(e.slice(6, 8), 10), s = parseInt(e.slice(8, 10), 10), i = parseInt(e.slice(10, 12), 10), a = parseInt(e.slice(12, 14), 10) || 0, l = o.slice(16).match(/([+-])(\d{2})'?(\d{2})?'/);
  let d = 0;
  if (l) {
    const u = l[1] === "+" ? 1 : -1, f = parseInt(l[2], 10) || 0, p = parseInt(l[3] || "0", 10) || 0;
    d = u * (f * 60 + p);
  }
  return new Date(Date.UTC(t, n, r, s, i, a)).getTime() - d * 60 * 1e3;
}
function ke(o, e) {
  const { viewport: t } = e, n = t.scale, r = o.x * n, s = o.y * n, i = o.width * n, a = o.height * n, [l, d] = t.convertToPdfPoint(r, s), [h, u] = t.convertToPdfPoint(r + i, s + a);
  return [Math.min(l, h), Math.min(d, u), Math.max(l, h), Math.max(d, u)];
}
function re(o) {
  const t = [...[254, 255]];
  for (let r = 0; r < o.length; r++) {
    const s = o.charCodeAt(r);
    t.push(s >> 8 & 255, s & 255);
  }
  const n = t.map((r) => r.toString(16).padStart(2, "0")).join("").toUpperCase();
  return go.of(n);
}
function Do(o = /* @__PURE__ */ new Date()) {
  const e = (l) => l.toString().padStart(2, "0"), t = o.getFullYear(), n = e(o.getMonth() + 1), r = e(o.getDate()), s = e(o.getHours()), i = e(o.getMinutes()), a = e(o.getSeconds());
  return `${t}${n}${r}_${s}${i}${a}`;
}
const ct = "InkLayer_Annotator", Sn = `${ct}_painter_wrapper`, ds = `${ct}_annotation_author_labels_layer`, us = `${ct}_annotation_author_label`, en = "annotationAuthorLabelBoundsChange", hs = `${ct}_annotation_hover_preview`, Un = `${ct}_is_painting`, ln = `${ct}_painting_type`, Le = `${ct}_shape_group`, ps = `${ct}_selector_hover`, Pt = `--${ct}-image-cursor`, Lo = `${ct}_free_text_editor`;
class xe {
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
    pdfViewerApplication: d,
    onChange: h
  }) {
    this.primaryColor = e, this.defaultOptions = t, this.currentUser = n, this.pdfViewerApplication = d, this.id = `${s}_${l}`, this.konvaStage = r, this.pageNumber = s, this.currentAnnotation = i, this.isPainting = !1, this.currentShapeGroup = null, this.onAdd = a, this.onChange = h || (() => {
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
        konvaClientRect: I.Node.create(i.toJSON()).getClientRect(),
        title: this.currentUser.name,
        type: a.type,
        pdfjsType: a.pdfjsAnnotationType,
        subtype: a.subtype,
        color: n,
        date: Wt(Date.now()),
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
    const e = Io(), t = new I.Group({
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
    const t = xe.Timer[e];
    t && window.clearTimeout(t);
  }
  /**
   * 静态方法，启动指定页面的定时器。
   * @param pageNumber 页面编号
   * @param callback 定时器回调函数，接受页面编号作为参数
   */
  static TimerStart(e, t) {
    xe.Timer[e] = window.setTimeout(() => {
      typeof t == "function" && t(e);
    }, 1e3);
  }
}
class fs extends xe {
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
    return Math.max(e, t) < xe.MinSize;
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
        i instanceof I.Ellipse && (t.color !== void 0 && i.stroke(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(n, s);
    }
  }
}
class gs extends xe {
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
    xe.TimerClear(this.pageNumber), this.line = null, this.isPainting = !0, this.currentShapeGroup || (this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup));
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
      this.line.destroy(), xe.TimerStart(this.pageNumber, () => {
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
    xe.TimerStart(this.pageNumber, () => {
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
    return this.line ? this.line.points().length < xe.MinSize : !0;
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
        i instanceof I.Line && (t.color !== void 0 && i.stroke(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(n, s);
    }
  }
}
class ms extends xe {
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
    const t = 2, n = e[0], r = e[1], s = e[e.length - 2], i = e[e.length - 1], a = s - n, l = i - r;
    if (a === 0 && l !== 0)
      return e.map((p, g) => g % 2 === 0 ? n : p);
    if (l === 0 && a !== 0)
      return e.map((p, g) => g % 2 === 0 ? p : r);
    if (a === 0 && l === 0)
      return e;
    const d = Math.atan2(l, a), h = Math.abs(d * (180 / Math.PI)), u = h <= t || h >= 180 - t || h >= 90 - t && h <= 90 + t && Math.abs(a) > Math.abs(l), f = h >= 90 - t && h <= 90 + t && Math.abs(l) > Math.abs(a) || h >= 180 - t || h <= t;
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
      r.getChildren().forEach((i) => {
        i instanceof I.Line && (t.color !== void 0 && i.stroke(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(n, s);
    }
  }
}
const vs = {
  placement: "bottom-start",
  middleware: [vo()]
}, wn = 200;
class ys {
  resolveFunction = null;
  container = null;
  inputElement = null;
  isActive = !1;
  isCleaningUp = !1;
  show(e, t, n, r) {
    return this.isActive && this.handleConfirm(), this.isActive = !0, this.isCleaningUp = !1, new Promise((s) => {
      this.resolveFunction = s, this.container = document.createElement("div"), this.container.id = Lo, Object.assign(this.container.style, {
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: "1000"
      }), document.body.appendChild(this.container), jt({
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
      }, this.container, vs).then(({ x: a, y: l }) => {
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
    s.placeholder = Ce.t("annotator:editor.text.startTyping"), Object.assign(s.style, {
      minHeight: "40px",
      width: `${wn}px`,
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
const bs = new ys();
async function Ss(o, e, t, n) {
  return bs.show(o, e, t, n);
}
class ws extends xe {
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
    const s = r.getBoundingClientRect(), i = s.left + t.x * n.x, a = s.top + t.y * n.y, l = await Ss(
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
    const l = new I.Text({
      text: i,
      fontSize: s,
      padding: 2
    }).width(), d = l > wn ? wn : l, h = new I.Text({
      x: n.x,
      y: n.y + 2,
      text: i,
      width: d,
      fontSize: s,
      fill: r,
      wrap: "word"
    });
    this.currentShapeGroup?.konvaGroup.add(h);
    const u = this.currentShapeGroup?.konvaGroup.id();
    u && this.setShapeGroupDone({
      id: u,
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
        i instanceof I.Text && (t.color !== void 0 && i.fill(t.color), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(n, s);
    }
  }
}
class zn extends xe {
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
    const t = 2, n = 1, r = [...e].sort((d, h) => d.y - h.y), s = [];
    let i = [r[0]], a = r[0].y;
    for (let d = 1; d < r.length; d++)
      Math.abs(r[d].y - a) < t ? i.push(r[d]) : (s.push(i), i = [r[d]], a = r[d].y);
    s.push(i);
    const l = [];
    for (const d of s) {
      d.sort((u, f) => u.x - f.x);
      let h = { ...d[0] };
      for (let u = 1; u < d.length; u++) {
        const f = d[u], p = h.x + h.width;
        if (f.x - p <= n) {
          const m = f.x + f.width;
          h.width = Math.max(p, m) - h.x, h.height = Math.max(h.height, f.height), h.y = Math.min(h.y, f.y);
        } else
          l.push({ ...h }), h = { ...f };
      }
      l.push({ ...h });
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
      r.getChildren().forEach((i) => {
        e.type === k.HIGHLIGHT && i instanceof I.Rect && (t.color !== void 0 && i.fill(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity)), e.type === k.UNDERLINE && i instanceof I.Rect && (t.color !== void 0 && i.fill(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity)), e.type === k.STRIKEOUT && i instanceof I.Rect && (t.color !== void 0 && i.stroke(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(n, s);
    }
  }
}
class Cs extends xe {
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
    return Math.max(e, t) < xe.MinSize;
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
        i instanceof I.Rect && (t.color !== void 0 && i.stroke(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(n, s);
    }
  }
}
class Fn extends xe {
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
      const { width: n, height: r } = t.getClientRect(), { newWidth: s, newHeight: i } = Vt(n, r, 96), a = { x: s / 2, y: i / 2 }, l = new I.Rect({
        x: 0,
        y: 0,
        width: s,
        height: i,
        stroke: this.primaryColor,
        strokeWidth: 2,
        cornerRadius: 2
      }), d = new I.Rect({
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
      const h = new I.Circle({
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
      e.add(d), e.add(l), e.add(t), e.add(h), e.add(u);
      const f = e.toDataURL();
      e.destroy(), Mo(
        Pt,
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
      const { width: r, height: s } = n.getClientRect(), { newWidth: i, newHeight: a } = Vt(r, s, 120), l = { x: i / 2, y: a / 2 };
      this.signatureImage = n, this.signatureImage.setAttrs({
        x: t.x - l.x,
        y: t.y - l.y,
        width: i,
        height: a,
        base64: this.signatureUrl
      }), this.currentShapeGroup?.konvaGroup.add(this.signatureImage), this.konvaStage.draw();
      const d = this.currentShapeGroup?.konvaGroup.id();
      d && (this.setShapeGroupDone({
        id: d,
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
    const n = I.Node.create(t), { konvaGroup: r, added: s } = this.registerSerializedGroup(e, n);
    if (!s) return;
    const i = this.getGroupNodesByClassName(r, "Image")[0];
    if (!i) return;
    const a = i.getAttr("base64");
    a && I.Image.fromURL(a, (l) => {
      l.setAttrs(i.getAttrs()), i.destroy(), r.add(l), r.getLayer()?.batchDraw(), r.fire(en);
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
class jn extends xe {
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
      const { width: n, height: r } = t.getClientRect(), { newWidth: s, newHeight: i } = Vt(n, r, 96), a = { x: s / 2, y: i / 2 }, l = new I.Rect({
        x: 0,
        y: 0,
        width: s,
        height: i,
        stroke: this.primaryColor,
        strokeWidth: 2,
        cornerRadius: 2
      }), d = new I.Rect({
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
      const h = new I.Circle({
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
      e.add(d), e.add(l), e.add(t), e.add(h), e.add(u);
      const f = e.toDataURL();
      e.destroy(), Mo(
        Pt,
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
      const { width: r, height: s } = n.getClientRect(), { newWidth: i, newHeight: a } = Vt(r, s, 120), l = { x: i / 2, y: a / 2 };
      this.stampImage = n, this.stampImage.setAttrs({
        x: t.x - l.x,
        y: t.y - l.y,
        width: i,
        height: a,
        base64: this.stampUrl
      }), this.currentShapeGroup?.konvaGroup.add(this.stampImage), this.konvaStage.draw();
      const d = this.currentShapeGroup?.konvaGroup.id();
      d && (this.setShapeGroupDone(
        {
          id: d,
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
    const n = I.Node.create(t), { konvaGroup: r, added: s } = this.registerSerializedGroup(e, n);
    if (!s) return;
    const i = this.getGroupNodesByClassName(r, "Image")[0];
    if (!i) return;
    const a = i.getAttr("base64"), l = this.getGroupNodesByClassName(r, "Text")[0];
    a && I.Image.fromURL(a, (d) => {
      d.setAttrs(i.getAttrs()), i.destroy(), r.add(d), l && l.moveToTop(), r.getLayer()?.batchDraw(), r.fire(en);
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
function _o({
  x: o,
  y: e,
  fill: t = "rgba(255, 221, 31, 1)",
  stroke: n = "#C0A042",
  strokeWidth: r = 0.8,
  cornerSize: s = 4
}) {
  const d = [], h = new I.Rect({
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
  d.push(h);
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
  d.push(u);
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
  d.push(f);
  const p = 4, g = 4, m = (20 - p * 2) / (g + 1);
  for (let v = 1; v <= g; v++) {
    const C = e + p + v * m, E = new I.Line({
      points: [
        o + 3,
        C,
        o + 18 - (v === 1 ? 7 : 4),
        C
      ],
      stroke: "rgba(0,0,0,0.45)",
      strokeWidth: 0.7,
      lineCap: "round"
    });
    d.push(E);
  }
  return d;
}
class Ts extends xe {
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
    const { x: r, y: s } = n;
    this.isPainting = !0, this.currentShapeGroup = this.createShapeGroup(), this.getBgLayer().add(this.currentShapeGroup.konvaGroup);
    const i = _o({ x: r, y: s, fill: t });
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
function Oo(o) {
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
class As {
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
    onHoverStart: d,
    onHoverEnd: h,
    onCancel: u,
    onChanged: f
  }) {
    this.primaryColor = e, this.konvaCanvasStore = t, this.getAnnotationStore = n, this.canTransform = r, this.onDelete = s, this.onSelected = i, this.onDeselected = a, this.onSelectionChanged = l, this.onHoverStart = d, this.onHoverEnd = h, this.onCancel = u, this.onChanged = f;
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
    const a = Me.find((f) => f.pdfjsAnnotationType === i.pdfjsType), l = this.canTransform(i), d = Oo(l), h = new I.Transformer({
      resizeEnabled: l && a?.resizable,
      rotateEnabled: !1,
      borderStrokeWidth: d.borderStrokeWidth,
      borderStroke: this.primaryColor,
      borderDash: d.borderDash,
      anchorFill: d.anchorFill,
      anchorStroke: this.primaryColor,
      opacity: d.opacity,
      anchorCornerRadius: 5,
      anchorStrokeWidth: d.anchorStrokeWidth,
      anchorSize: d.anchorSize,
      padding: 2,
      boundBoxFunc: (f, p) => (p.width = Math.max(30, p.width), p)
    });
    r.attrs.id && r.attrs.id === "note" && h.resizeEnabled(!1), e.draggable(!!(l && a?.draggable)), h.off("transformend"), h.off("transformstart"), l && h.on("transformend", () => {
      this.onChanged(e.id(), e.toJSON(), { ...i }, I.Node.create(e.toJSON()).getClientRect(), h.getClientRect());
    }), l && h.on("transformstart", () => {
      this.onCancel();
    }), l && h.on("dragstart", () => {
      this.onCancel();
    }), l && h.on("dragend", () => {
      this.onChanged(e.id(), e.toJSON(), { ...i }, I.Node.create(e.toJSON()).getClientRect(), h.getClientRect());
    });
    let u = null;
    l && h.on("dragmove", () => {
      u && cancelAnimationFrame(u), u = requestAnimationFrame(() => {
        u = null;
        const f = h.nodes().map((g) => g.getClientRect()), p = this.getTotalBox(f);
        h.nodes().forEach((g) => {
          const m = g.getAbsolutePosition(), v = p.x - m.x, C = p.y - m.y, E = p.width / 2, S = p.height / 2, x = { ...m };
          p.x + E < 0 && (x.x = -v - E), p.y + S < 0 && (x.y = -C - S), p.x + E > t.width() && (x.x = t.width() - E - v), p.y + S > t.height() && (x.y = t.height() - S - C), g.setAbsolutePosition(x);
        });
      });
    }), h.nodes([e]), this.getBackgroundLayer(t).add(h), this.transformerStore.set(s, h), this.onSelectionChanged(s), n && this.flashNodeWithTransformer(e, h, () => {
      this.onSelected(e.id(), !1, h.getClientRect());
    });
  }
  flashNodeWithTransformer(e, t, n) {
    let r = 0;
    const s = 1, i = 0.1, a = e.id();
    this.cleanupTween(a);
    const l = t.borderStrokeWidth(), d = () => {
      if (!e.getLayer()) {
        this.tweenStore.delete(a);
        return;
      }
      const u = new I.Tween({
        node: e,
        duration: i,
        opacity: 0,
        onFinish: () => {
          try {
            t.getLayer() && (t.borderStrokeWidth(l + 2), t.getLayer()?.batchDraw()), h();
          } catch {
            this.cleanupTween(a);
          }
        }
      }), f = this.tweenStore.get(a) || { fadeOut: null, fadeIn: null };
      f.fadeOut = u, this.tweenStore.set(a, f), u.play();
    }, h = () => {
      if (!e.getLayer()) {
        this.tweenStore.delete(a);
        return;
      }
      const u = new I.Tween({
        node: e,
        duration: i,
        opacity: 1,
        onFinish: () => {
          try {
            t.getLayer() && (t.borderStrokeWidth(l), t.getLayer()?.batchDraw()), r++, r < s ? setTimeout(d, 100) : (this.cleanupTween(a), n && n());
          } catch {
            this.cleanupTween(a);
          }
        }
      }), f = this.tweenStore.get(a) || { fadeOut: null, fadeIn: null };
      f.fadeIn = u, this.tweenStore.set(a, f), u.play();
    };
    d();
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
    document.body.classList.toggle(ps, e);
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
    !(n instanceof I.Group) || !r || (t?.off("transformend transformstart dragstart dragend dragmove"), t?.nodes([]), t?.destroy(), this.cleanupTween(e), this.transformerStore.delete(e), this._currentTransformerId = null, this.createTransformer(n, r, !1));
  }
  delete() {
    this.clearTransformers();
  }
}
var ht = /* @__PURE__ */ ((o) => (o.CANVAS = "canvas", o.SIDEBAR = "sidebar", o))(ht || {});
const ie = $r((o, e) => ({
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
    const r = (h) => {
      let u = !1;
      const f = new Map(h);
      return t.forEach((p, g) => {
        const m = f.get(g);
        !m || m.referenceNumber === p || (f.set(g, { ...m, referenceNumber: p }), u = !0);
      }), u ? f : h;
    }, s = r(n.annotations), i = r(n.originalAnnotations), a = n.selectedAnnotation?.store, l = a ? t.get(a.id) : void 0, d = a && l !== void 0 && a.referenceNumber !== l ? {
      store: { ...a, referenceNumber: l },
      source: n.selectedAnnotation?.source ?? null
    } : n.selectedAnnotation;
    return s === n.annotations && i === n.originalAnnotations && d === n.selectedAnnotation ? n : { annotations: s, originalAnnotations: i, selectedAnnotation: d };
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
class xs {
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
    this.destroy(), this.root = e, this.highlighterObj = new Vr({
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
    const r = n / t, [s, i, a, l] = e, d = s, h = r - l, u = a - s, f = l - i;
    return { x: d, y: h, width: u, height: f };
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
      r.annotationType === te.TEXT && r.inReplyTo === e.id && n.push({
        id: r.id,
        title: r.titleObj.str,
        date: r.modificationDate,
        content: r.contentsObj.str
      });
    }), n;
  }
}
class Es extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Ye(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, { x: s, y: i, width: a, height: l } = this.convertRect(
      e.rect,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), d = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), h = new I.Ellipse({
      radiusX: a / 2,
      radiusY: l / 2,
      x: s + a / 2,
      y: i + l / 2,
      strokeScaleEnabled: !1,
      strokeWidth: r,
      stroke: n,
      dash: e.borderStyle.style === 2 ? e.borderStyle.dashArray : []
    });
    d.add(h);
    const u = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: d.toJSON(),
      konvaClientRect: d.getClientRect(),
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
    return d.destroy(), u;
  }
}
class ks extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Ye(e.defaultAppearanceData.fontColor), r = e.defaultAppearanceData.fontSize, s = e.contentsObj.str, { x: i, y: a } = this.convertRect(
      e.rect,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), l = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), d = new I.Text({
      x: i,
      y: a + 2,
      text: s,
      fontSize: r,
      fill: n
    });
    return l.add(d), {
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
class dn extends Ke {
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
    return new I.Rect({
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
    return new I.Rect({
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
    return new I.Rect({
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
    const n = Ye(e.color || [0, 0, 0]), s = {
      [te.HIGHLIGHT]: k.HIGHLIGHT,
      [te.UNDERLINE]: k.UNDERLINE,
      [te.STRIKEOUT]: k.STRIKEOUT
    }[e.annotationType] || k.HIGHLIGHT, i = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), a = (d) => {
      const { x: h, y: u, width: f, height: p } = this.convertQuadPoints(d, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
      switch (e.annotationType) {
        case te.HIGHLIGHT:
          return this.createHighlightShape(h, u, f, p, n);
        case te.UNDERLINE:
          return this.createUnderlineShape(h, u, f, p, n);
        case te.STRIKEOUT:
          return this.createStrikeoutShape(h, u, f, p, n);
        default:
          return null;
      }
    };
    e.quadPoints?.forEach((d) => {
      const h = a(d);
      h && i.add(h);
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
class Rs extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Ye(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, { x: s, y: i, width: a, height: l } = this.convertRect(
      e.rect,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), d = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), h = new I.Rect({
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
    d.add(h);
    const u = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: d.toJSON(),
      konvaClientRect: d.getClientRect(),
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
    return d.destroy(), u;
  }
}
class Ps extends Ke {
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
    }), s = (a) => new I.Line({
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
      const l = a.map((h) => {
        const { x: u, y: f } = this.convertPoint(h, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
        return [u, f];
      }).flat(), d = s(l);
      r.add(d);
    });
    const i = {
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
    return r.destroy(), i;
  }
}
class Ns extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Ye(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, s = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), i = (p, g) => new I.Line({
      strokeScaleEnabled: !1,
      stroke: n,
      strokeWidth: r,
      hitStrokeWidth: 20,
      dash: e.borderStyle.style === 2 ? e.borderStyle.dashArray : [],
      globalCompositeOperation: "source-over",
      points: p
    }), { x: a, y: l, x1: d, y1: h } = this.convertCoordinates(
      e.lineCoordinates,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), u = i([a, l, d, h], e.lineEndings);
    s.add(u);
    const f = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: s.toJSON(),
      konvaClientRect: s.getClientRect(),
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
    return s.destroy(), f;
  }
}
class Is extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Ye(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, s = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), a = ((d) => {
      const h = [];
      return d?.forEach((u) => {
        const { x: f, y: p } = this.convertPoint(u, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
        h.push(f), h.push(p);
      }), new I.Line({
        strokeScaleEnabled: !1,
        stroke: n,
        strokeWidth: r,
        lineCap: "round",
        lineJoin: "round",
        hitStrokeWidth: 20,
        closed: !0,
        globalCompositeOperation: "source-over",
        points: h
      });
    })(e.vertices);
    s.add(a);
    const l = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: s.toJSON(),
      konvaClientRect: s.getClientRect(),
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
    return s.destroy(), l;
  }
}
class Ms extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Ye(e.color || [0, 0, 0]), r = e.borderStyle.width === 1 ? e.borderStyle.width + 1 : e.borderStyle.width, s = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), a = ((d) => {
      const h = [];
      return d?.forEach((u) => {
        const { x: f, y: p } = this.convertPoint(u, e.pageViewer.viewport.scale, e.pageViewer.viewport.height);
        h.push(f), h.push(p);
      }), new I.Line({
        strokeScaleEnabled: !1,
        stroke: n,
        strokeWidth: r,
        lineCap: "round",
        lineJoin: "round",
        hitStrokeWidth: 20,
        closed: !1,
        globalCompositeOperation: "source-over",
        points: h
      });
    })(e.vertices);
    s.add(a);
    const l = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: s.toJSON(),
      konvaClientRect: s.getClientRect(),
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
    return s.destroy(), l;
  }
}
class Ds extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    if (e.inReplyTo) return null;
    const n = Ye(e.color || [0, 0, 0]), { x: r, y: s } = this.convertRect(e.rect, e.pageViewer.viewport.scale, e.pageViewer.viewport.height), i = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), a = _o({ x: r, y: s, fill: n });
    i.add(...a);
    const l = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: i.toJSON(),
      konvaClientRect: i.getClientRect(),
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
    return i.destroy(), l;
  }
}
function Cn(o, e = 15) {
  if (o.length < 2) return "";
  const t = e * 1.3, n = o.reduce(
    (s, i) => ({ x: s.x + i.x, y: s.y + i.y }),
    { x: 0, y: 0 }
  );
  n.x /= o.length, n.y /= o.length;
  let r = "";
  for (let s = 0; s < o.length - 1; s++) {
    const i = o[s], a = o[s + 1], l = a.x - i.x, d = a.y - i.y, h = Math.hypot(l, d), u = Math.atan2(d, l), f = Math.cos(u + Math.PI / 2), p = Math.sin(u + Math.PI / 2), g = (i.x + a.x) / 2, m = (i.y + a.y) / 2, v = n.x - g, C = n.y - m, E = f * v + p * C > 0 ? -1 : 1, S = Math.max(2, Math.floor(h / t));
    for (let x = 0; x < S; x++) {
      const N = x / S, H = (x + 1) / S, z = i.x + l * N, F = i.y + d * N, j = i.x + l * H, G = i.y + d * H, R = (z + j) / 2 + f * e * E, T = (F + G) / 2 + p * e * E;
      s === 0 && x === 0 && (r += `M ${z} ${F} `), r += `Q ${R} ${T} ${j} ${G} `;
    }
  }
  return r;
}
class Ls extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Ye(e.color || [0, 0, 0]), s = ("inkLists" in e ? e.inkLists?.[0] ?? [] : e.vertices ?? []).map(
      (h) => this.convertPoint(
        h,
        e.pageViewer.viewport.scale,
        e.pageViewer.viewport.height
      )
    );
    if (s.length < 3) return null;
    const i = new I.Group({
      draggable: !1,
      name: Le,
      id: e.id
    }), a = "inkLists" in e ? s.map((h, u) => `${u === 0 ? "M" : "L"} ${h.x} ${h.y}`).join(" ") : Cn([...s, s[0]]), l = new I.Path({
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
    const d = {
      id: e.id,
      pageNumber: e.pageNumber,
      konvaString: i.toJSON(),
      konvaClientRect: i.getClientRect(),
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
    return i.destroy(), d;
  }
}
function Wn(o, e) {
  return Math.hypot(e.x - o.x, e.y - o.y);
}
class _s extends Ke {
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
    )), s = r[0], i = r[1], a = r[3], l = r[4], d = a && l ? { x: (a.x + l.x) / 2, y: (a.y + l.y) / 2 } : void 0, h = Ye(e.color || [0, 0, 0]), u = new I.Group({ draggable: !1, name: Le, id: e.id });
    u.add(new I.Arrow({
      points: [s.x, s.y, i.x, i.y],
      stroke: h,
      fill: h,
      strokeWidth: e.borderStyle.width || 1,
      opacity: this.inkLayerMetadata?.opacity ?? 1,
      pointerLength: d ? Wn(i, d) : 10,
      pointerWidth: a && l ? Wn(a, l) : 10,
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
      color: h,
      pdfjsType: te.LINE,
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
class Os extends Ke {
  constructor(e) {
    super(e);
  }
  decodePdfAnnotation(e, t) {
    const n = Ye(e.color || [0, 0, 0]), { x: r, y: s } = this.convertRect(
      e.rect,
      e.pageViewer.viewport.scale,
      e.pageViewer.viewport.height
    ), i = new I.Group({ draggable: !1, name: Le, id: e.id });
    i.add(new I.Text({
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
      type: k.FREETEXT,
      color: n,
      pdfjsType: te.FREETEXT,
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
const Hs = "pdfjs_internal_editor_";
class Gs {
  pdfViewerApplication;
  constructor(e) {
    this.pdfViewerApplication = e;
  }
  async getAnnotations() {
    const e = this.pdfViewerApplication.pdfDocument, t = this.pdfViewerApplication, n = e.numPages, r = Array.from(
      { length: n },
      (i, a) => e.getPage(a + 1).then((l) => {
        const d = t.getPageView(a);
        return l.getAnnotations().then(
          (h) => h.map((u) => ({
            ...u,
            pageNumber: a + 1,
            pageViewer: d
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
      const n = await Pn.load(await t.getData());
      n.getPages().forEach((r) => {
        r.node.lookupMaybe(O.of("Annots"), mo)?.asArray().forEach((i) => {
          const a = n.context.lookupMaybe(i, vn), l = a?.get(O.of("Subtype"))?.toString(), d = a?.lookupMaybe(O.of("BE"), vn), h = l === "/Polygon" && (d?.get(O.of("S"))?.toString() === "/C" || a?.get(O.of("IT"))?.toString() === "/PolygonCloud"), u = a?.get(O.of("InkLayerType"))?.toString().slice(1);
          if (!h && !(u === "Cloud" && l === "/Ink" || u === "FreeText" && l === "/Text" || u === "Arrow" && l === "/Ink")) return;
          const p = a?.get(O.of("NM")), g = p ? n.context.lookup(p) : void 0, m = g instanceof ne || g instanceof go ? g.decodeText() : i instanceof zr ? `${i.objectNumber}R` : void 0;
          if (!m) return;
          const v = h ? "Cloud" : u;
          if (v !== "Cloud" && v !== "FreeText" && v !== "Arrow") return;
          const C = a?.lookupMaybe(O.of("InkLayerFontSize"), Z)?.asNumber(), E = a?.lookupMaybe(O.of("InkLayerTextWidth"), Z)?.asNumber(), S = a?.lookupMaybe(O.of("CA"), Z)?.asNumber();
          e.set(m, { type: v, fontSize: C, textWidth: E, opacity: S });
        });
      });
    } catch (n) {
      console.warn("InkLayer could not inspect PDF annotation metadata.", n);
    }
    return e;
  }
  decodeAnnotation(e, t, n) {
    const r = {
      [te.CIRCLE]: Es,
      [te.FREETEXT]: ks,
      [te.HIGHLIGHT]: dn,
      [te.UNDERLINE]: dn,
      [te.STRIKEOUT]: dn,
      [te.SQUARE]: Rs,
      [te.INK]: Ps,
      [te.LINE]: Ns,
      [te.POLYGON]: Is,
      [te.POLYLINE]: Ms,
      [te.TEXT]: Ds
    }, s = n.get(e.id);
    let i = r[e.annotationType];
    return s?.type === "Cloud" && (e.annotationType === te.POLYGON || e.annotationType === te.INK) && (i = Ls), s?.type === "FreeText" && e.annotationType === te.TEXT && (i = Os), s?.type === "Arrow" && e.annotationType === te.INK && (i = _s), i ? new i({
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
    this.pdfViewerApplication?.pdfDocument?.annotationStorage?.setValue(`${Hs}${e.id}`, {
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
class Us extends xe {
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
    return Math.hypot(t, n) < xe.MinSize;
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
        if (i instanceof I.Arrow) {
          if (t.color !== void 0 && (i.stroke(t.color), i.fill(t.color)), t.strokeWidth !== void 0) {
            const a = t.strokeWidth;
            i.strokeWidth(a);
            const u = Math.max(6, Math.min(30, a * 5));
            i.pointerLength(u), i.pointerWidth(u);
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
class zs extends xe {
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
        const e = [...this.points, this.points[0]], t = Cn(e);
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
    const n = Cn(t);
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
      r.getChildren().forEach((i) => {
        i instanceof I.Path && (t.color !== void 0 && i.stroke(t.color), t.strokeWidth !== void 0 && i.strokeWidth(t.strokeWidth), t.opacity !== void 0 && i.opacity(t.opacity));
      });
      const s = {
        konvaString: r.toJSON()
      };
      t.color !== void 0 && (s.color = t.color), this.setChanged(n, s);
    }
  }
}
const Fs = {
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
}, js = {
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
}, Ws = {
  Highlight: "highlight",
  Underline: "underline",
  Squiggly: "squiggly",
  StrikeOut: "strikeout"
}, Bs = {
  highlight: "Highlight",
  underline: "Underline",
  squiggly: "Squiggly",
  strikeout: "StrikeOut"
}, $s = {
  Square: "rect",
  Circle: "ellipse",
  Polygon: "polygon",
  PolyLine: "polygon",
  Cloud: "cloud"
};
function Nt(o) {
  const e = Fs[o.type] || "note", t = Vs(o), n = {
    pageIndex: o.pageNumber - 1,
    // 转换为 0-based
    geometry: t,
    coordinateSystem: "pdf-user-space"
  }, r = Ys(o, e), s = {
    strokeColor: o.color || void 0,
    fillColor: o.color ? Ks(o.color, 0.3) : void 0,
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
        type: te[o.pdfjsType],
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
function Vs(o) {
  const e = js[o.type] || "rect", { x: t, y: n, width: r, height: s } = o.konvaClientRect;
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
function Ys(o, e) {
  const t = o.subtype;
  switch (e) {
    case "text-markup":
      return {
        kind: "text-markup",
        variant: Ws[t] || "highlight",
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
        shape: o.type === k.CLOUD ? "cloud" : $s[t] || "rect"
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
function Ks(o, e) {
  if (o.startsWith("rgba")) return o;
  if (o.startsWith("#")) {
    const t = o.slice(1), n = parseInt(t.slice(0, 2), 16), r = parseInt(t.slice(2, 4), 16), s = parseInt(t.slice(4, 6), 16);
    return `rgba(${n}, ${r}, ${s}, ${e})`;
  }
  return o;
}
function Xs(o) {
  const e = o.kind, t = o.extensions, n = t?.legacy, r = t?.konva, s = o.target.geometry, i = t?.pdfjs?.subtype || Qs(e, o.payload), a = Zs(t?.pdfjs?.type) ?? Js(e, o.payload), l = n?.annotationType ?? (e === "shape" && i === "PolyLine" ? k.CLOUD : qs(e, o.payload));
  return {
    id: o.id,
    referenceNumber: o.meta?.referenceNumber,
    pageNumber: o.target.pageIndex + 1,
    // 转换回 1-based
    konvaString: r?.serialized || "",
    konvaClientRect: r?.clientRect || oa(s),
    title: n?.title || ea(o.payload),
    type: l,
    color: o.appearance?.strokeColor || null,
    subtype: i,
    pdfjsType: a,
    date: o.meta?.createdAt || null,
    contentsObj: n?.contentsObj || ta(o.payload),
    comments: n?.comments || [],
    user: na(o.meta),
    native: o.meta?.isNative || !1
  };
}
function qs(o, e) {
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
function Js(o, e) {
  if (o === "shape" && e?.kind === "shape") {
    if (e.shape === "cloud") return te.POLYLINE;
    if (e.shape === "ellipse") return te.CIRCLE;
    if (e.shape === "polygon") return te.POLYGON;
  }
  return {
    "text-markup": te.HIGHLIGHT,
    note: te.TEXT,
    ink: te.INK,
    shape: te.SQUARE,
    line: te.LINE,
    stamp: te.STAMP,
    file: te.FILEATTACHMENT
  }[o] || te.NONE;
}
function Zs(o) {
  if (!o) return;
  const e = te[o];
  return typeof e == "number" ? e : void 0;
}
function Qs(o, e) {
  if (!e) return "None";
  switch (o) {
    case "text-markup":
      return e.kind !== "text-markup" ? "Highlight" : Bs[e.variant];
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
function ea(o) {
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
function ta(o) {
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
function na(o) {
  return o?.authorId ? typeof o.authorId == "string" ? { id: o.authorId, name: o.authorId } : {
    id: o.authorId.id,
    name: o.authorId.name || o.authorId.id
  } : { id: "unknown", name: "Unknown" };
}
function oa(o) {
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
function It(o) {
  return o.map((e) => Nt(e));
}
function ra(o) {
  return o.map((e) => Xs(e));
}
function Ho(o) {
  return !!(o?.id && o.id !== "null");
}
function Bn(o, e) {
  return Ho(o) && !!e?.id && o.id === e?.id;
}
class ia {
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
        annotation: t ? Nt(t) : void 0,
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
        return Ho(t);
      case "annotation.transform":
      case "annotation.edit":
      case "annotation.delete":
      case "annotation.change-status":
        return Bn(t, n?.user);
      case "comment.edit":
      case "comment.delete":
        return Bn(t, r?.user);
    }
  }
}
function pt(o) {
  return typeof o == "number" && Number.isSafeInteger(o) && o > 0;
}
function sa(o) {
  const e = /^D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(?:([Zz])|([+-])(\d{2})'?(\d{2})?'?)?$/.exec(o);
  if (!e) return null;
  const [, t, n, r, s, i, a, l, d, h, u] = e, f = Number(t), p = Number(n), g = Number(r), m = Number(s), v = Number(i), C = Number(a);
  if (p < 1 || p > 12 || g < 1 || g > 31 || m > 23 || v > 59 || C > 59 || Number(h || 0) > 23 || Number(u || 0) > 59)
    return null;
  const E = Date.UTC(
    f,
    p - 1,
    g,
    m,
    v,
    C
  );
  if (!Number.isFinite(E)) return null;
  const S = new Date(E);
  if (S.getUTCFullYear() !== f || S.getUTCMonth() !== p - 1 || S.getUTCDate() !== g)
    return null;
  if (l || !d) return E;
  const x = (Number(h) * 60 + Number(u || 0)) * 60 * 1e3;
  return E - (d === "+" ? x : -x);
}
function $n(o) {
  if (!o) return null;
  const e = sa(o);
  if (e !== null) return e;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/.test(o))
    return null;
  const t = Date.parse(o);
  return Number.isFinite(t) ? t : null;
}
function aa(o, e) {
  const t = $n(o.date), n = $n(e.date);
  return t !== null && n !== null && t !== n ? t - n : t !== null && n === null ? -1 : t === null && n !== null ? 1 : o.pageNumber !== e.pageNumber ? o.pageNumber - e.pageNumber : o.id < e.id ? -1 : o.id > e.id ? 1 : 0;
}
function Yt(o) {
  let e = 0;
  for (const t of o)
    pt(t.referenceNumber) && t.referenceNumber > e && (e = t.referenceNumber);
  return e;
}
function Tn(o) {
  if (o >= Number.MAX_SAFE_INTEGER)
    throw new RangeError("Annotation reference number limit reached.");
  return o + 1;
}
function Vn(o) {
  const e = [...o].sort(aa), t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), r = [];
  e.forEach((i) => {
    const a = i.referenceNumber;
    pt(a) && !t.has(a) ? (t.add(a), n.set(i.id, a)) : r.push(i);
  });
  let s = r.length > 0 ? Tn(Yt(e)) : 1;
  return r.forEach((i, a) => {
    n.set(i.id, s), a < r.length - 1 && (s = Tn(s));
  }), o.map((i) => {
    const a = n.get(i.id);
    return i.referenceNumber === a ? i : { ...i, referenceNumber: a };
  });
}
function ca(o, e, t = 1) {
  const n = Array.from(e), r = /* @__PURE__ */ new Set();
  for (const i of n)
    pt(i.referenceNumber) && r.add(i.referenceNumber);
  if (pt(o.referenceNumber) && !r.has(o.referenceNumber))
    return o;
  const s = Math.max(
    Tn(Yt(n)),
    t
  );
  if (!pt(s))
    throw new RangeError("Annotation reference number limit reached.");
  return { ...o, referenceNumber: s };
}
const Go = 4;
function Uo(o) {
  const e = o.user?.name?.trim();
  return e || o.title?.trim() || null;
}
function la(o) {
  const e = Uo(o), t = pt(o.referenceNumber);
  return t && e ? `#${o.referenceNumber} · ${e}` : t ? `#${o.referenceNumber}` : e;
}
function da({
  selectionRect: o,
  labelWidth: e,
  labelHeight: t,
  stageWidth: n,
  stageHeight: r,
  gap: s = Go
}) {
  const i = Math.max(0, n - e), a = Math.max(0, r - t), l = Math.max(0, Math.min(i, o.x + o.width - e)), d = o.y - t - s, h = o.y + o.height + s, u = d >= 0 ? d : Math.max(0, Math.min(a, h));
  return { x: l, y: u };
}
function ua(o, e, t) {
  return o.x < e.x + e.width + t && o.x + o.width + t > e.x && o.y < e.y + e.height + t && o.y + o.height + t > e.y;
}
function ha(o, e, t = Go) {
  const n = /* @__PURE__ */ new Map(), r = [];
  return [...o].sort(
    (i, a) => i.y - a.y || i.x - a.x || i.id.localeCompare(a.id)
  ).forEach((i) => {
    const a = Math.max(0, e - i.height), l = Math.max(1, i.height + t), d = Math.ceil(e / l) + 1;
    let h = { ...i, y: Math.max(0, Math.min(a, i.y)) };
    for (let u = 0; u <= d; u += 1) {
      const p = (u === 0 ? [0] : [u * l, -u * l]).map((g) => ({ ...i, y: i.y + g })).find((g) => g.y >= 0 && g.y <= a && r.every((m) => !ua(g, m, t)));
      if (p) {
        h = p;
        break;
      }
    }
    r.push(h), n.set(h.id, { x: h.x, y: h.y });
  }), n;
}
function pa() {
  return navigator.userAgentData?.platform || navigator.platform || navigator.userAgent;
}
function Yn(o, e) {
  return e ? o.key === "Meta" : o.key === "Alt";
}
class fa {
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
    this.primaryColor = e, this.allVisible = t, this.getAnnotationsByPage = n, this.getAnnotationGroup = r, this.canTransform = s, this.isMac = /mac/i.test(pa()), window.addEventListener("keydown", this.handleKeyDown), window.addEventListener("keyup", this.handleKeyUp), window.addEventListener("blur", this.clearShortcutReveal), document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }
  registerPage(e, t, n) {
    this.unregisterPage(e);
    const r = document.createElement("div");
    r.className = ds, r.setAttribute("aria-hidden", "true"), t.appendChild(r), this.pages.set(e, { stage: n, layer: r, labels: /* @__PURE__ */ new Map() }), this.refreshPage(e);
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
    const r = la(t), s = this.getAnnotationGroup(t, e.stage);
    if (!r || !s)
      return this.unbindGroup(t.id), e.labels.get(t.id)?.remove(), e.labels.delete(t.id), null;
    this.bindGroup(t.id, s);
    let i = e.labels.get(t.id);
    i || (i = document.createElement("div"), i.className = us, i.dataset.annotationId = t.id, e.layer.appendChild(i), e.labels.set(t.id, i)), i.textContent !== r && (i.textContent = r), i.style.backgroundColor = this.primaryColor, i.style.opacity = String(Oo(this.canTransform(t)).authorLabelOpacity);
    const a = this.shouldRevealAll() || t.id === this.selectedId || t.id === this.hoveredId;
    return i.style.display = a ? "block" : "none", a ? (n && this.positionLabel(e, i, s), { id: t.id, label: i, group: s }) : null;
  }
  getLabelPosition(e, t, n) {
    const r = n.getClientRect(), s = 2;
    return da({
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
    })), r = ha(n, e.stage.height());
    t.forEach(({ id: s, label: i }) => {
      const a = r.get(s);
      a && (i.style.transform = `translate3d(${a.x}px, ${a.y}px, 0)`);
    });
  }
  bindGroup(e, t) {
    const n = this.boundGroups.get(e);
    n !== t && (n?.off(".annotationAuthorLabels"), t.on(
      `dragmove.annotationAuthorLabels transform.annotationAuthorLabels ${en}.annotationAuthorLabels`,
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
    if (!Yn(e, this.isMac)) return;
    const t = this.shouldRevealAll();
    this.pressedRevealKeys.add(e.code || e.key), t !== this.shouldRevealAll() && this.refreshAll();
  };
  handleKeyUp = (e) => {
    if (!Yn(e, this.isMac)) return;
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
const Kn = Object.freeze({
  annotationId: null,
  source: null
});
class ga {
  entries = /* @__PURE__ */ new Map();
  listeners = /* @__PURE__ */ new Set();
  sequence = 0;
  snapshot = Kn;
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
    this.snapshot.annotationId === n && this.snapshot.source === e || (this.snapshot = n === null ? Kn : { annotationId: n, source: e }, this.listeners.forEach((r) => r(this.snapshot)));
  }
}
class ma {
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
    this.previewRect = new I.Rect({
      name: hs,
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
      `dragmove.annotationHoverPreview transform.annotationHoverPreview ${en}.annotationHoverPreview`,
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
class va {
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
    }, l = t.stage.getIntersection(s)?.findAncestor(`.${Le}`)?.id() || null;
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
const un = 8e3;
function zo(o) {
  return typeof structuredClone == "function" ? structuredClone(o) : JSON.parse(JSON.stringify(o));
}
function hn(o) {
  return zo(o);
}
function Xn(o) {
  return zo(o);
}
class ya {
  entries = [];
  snapshot = null;
  listeners = /* @__PURE__ */ new Set();
  timer = null;
  remainingMs = un;
  paused = !1;
  subscribe(e) {
    return this.listeners.add(e), () => this.listeners.delete(e);
  }
  getSnapshot() {
    return this.snapshot;
  }
  add(e) {
    this.entries.push(e), this.remainingMs = un, this.setSnapshot(Date.now() + this.remainingMs), this.clearTimer(), this.paused || this.scheduleExpiry();
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
    this.clearTimer(), this.entries = [], this.snapshot = null, this.remainingMs = un, this.paused = !1, e && this.emit();
  }
  clearTimer() {
    this.timer !== null && (clearTimeout(this.timer), this.timer = null);
  }
  emit() {
    this.listeners.forEach((e) => e());
  }
}
class ba {
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
  annotationHover = new ga();
  deleteUndoController;
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
    onAnnotationDelete: d,
    onAnnotationSelected: h,
    onAnnotationChanging: u,
    onAnnotationChanged: f
  }) {
    this.primaryColor = e, this.defaultOptions = t, this.currentUser = n, this.annotationPermissions = r, this.permissionController = new ia({
      getCurrentUser: () => this.currentUser,
      getPermissions: () => this.annotationPermissions
    }), this.deleteUndoController = new ya(), this.authorLabels = new fa({
      primaryColor: this.primaryColor,
      defaultVisible: s,
      getAnnotationsByPage: (p) => ie.getState().getByPage(p),
      getAnnotationGroup: (p, g) => g.findOne((m) => m.getType() === "Group" && m.id() === p.id),
      canTransform: (p) => this.permissionController.can("annotation.transform", p)
    }), this.hoverPreview = new ma({
      getAnnotation: (p) => ie.getState().getAnnotation(p),
      getStage: (p) => this.konvaCanvasStore.get(p)?.konvaStage,
      getAnnotationGroup: (p, g) => g.findOne((m) => m.getType() === "Group" && m.id() === p.id)
    }), this.unsubscribeAnnotationHover = this.annotationHover.subscribe((p) => {
      this.authorLabels.setHovered(p.annotationId), this.hoverPreview.setHovered(null);
    }), this.pdfViewerApplication = i, this.onTextSelected = a, this.onAnnotationAdd = l, this.onAnnotationDelete = d, this.onAnnotationSelected = h, this.onAnnotationChanging = u, this.onAnnotationChanged = f, this.selector = new As({
      primaryColor: this.primaryColor,
      // 初始化选择器实例
      konvaCanvasStore: this.konvaCanvasStore,
      getAnnotationStore: (p) => ie.getState().getAnnotation(p),
      canTransform: (p) => this.permissionController.can("annotation.transform", p),
      onSelected: (p, g, m) => {
        const v = ie.getState().getAnnotation(p);
        v && (ie.getState().setSelectedAnnotation(v, g ? ht.CANVAS : ht.SIDEBAR), this.onAnnotationSelected(v, g, m));
      },
      onDeselected: () => {
        ie.getState().clearSelectedAnnotation(), this.onAnnotationSelected(void 0, !1, { x: 0, y: 0, width: 0, height: 0 });
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
      onChanged: async (p, g, m, v, C) => {
        const S = this.findEditorForGroupId(p) ? this.updateStore(p, { konvaString: g, konvaClientRect: v }, !1, "annotation.transform") : void 0;
        S && this.onAnnotationChanged(S, C);
      },
      onCancel: () => {
        this.onAnnotationChanging();
      },
      onDelete: (p) => {
        this.delete(p, !0);
      }
    }), this.webSelection = new xs({
      // 初始化 WebSelection 实例
      onSelect: (p) => {
        this.onTextSelected(p);
      },
      onHighlight: (p) => {
        this.can("annotation.create") && Object.keys(p).forEach((g) => {
          const m = Number(g), v = p[g], C = this.konvaCanvasStore.get(m);
          if (C) {
            const { konvaStage: E, wrapper: S } = C;
            let x = this.findEditor(m, this.currentAnnotation.type);
            x || (x = new zn(
              {
                primaryColor: this.primaryColor,
                defaultOptions: this.defaultOptions,
                currentUser: this.currentUser,
                pdfViewerApplication: this.pdfViewerApplication,
                konvaStage: E,
                pageNumber: m,
                annotation: this.currentAnnotation,
                onAdd: (N) => {
                  this.saveToStore(N);
                },
                onChange: (N, H) => {
                  this.updateStore(N, H);
                }
              },
              this.currentAnnotation.type
            ), this.editorStore.set(x.id, x)), x.convertTextSelection(v, S);
          }
        });
      }
    }), this.passiveHover = new va({
      shouldSuppress: () => !!(this.currentAnnotation && !this.currentAnnotation.webSelectionDependencies) || this.webSelection.isRangeSelectionActive(),
      onHoverStart: (p) => {
        this.annotationHover.set("canvas-passive", p);
      },
      onHoverEnd: (p) => {
        this.annotationHover.clear("canvas-passive", p);
      }
    }), this.transform = new Gs(i), this.bindGlobalEvents();
  }
  setPermissionContext(e, t) {
    this.currentUser = e, this.annotationPermissions = t, this.editorStore.forEach((n) => n.setCurrentUser(e)), this.currentAnnotation?.type !== k.SELECT && !this.can("annotation.create") && (this.currentAnnotation = null, this.disablePainting(), this.setDefaultMode()), this.selector.refreshCurrentSelection(), this.authorLabels.refreshAll();
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
  setDefaultMode = () => {
    ie.getState().setCurrentAnnotationType(Me[0]);
  };
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
    e.code === "Escape" && (this.currentAnnotation?.type === k.SIGNATURE || this.currentAnnotation?.type === k.STAMP) && (cn(Pt), this.setDefaultMode());
  };
  /**
   * 创建绘图容器 (painterWrapper)
   * @param pageView - 当前 PDF 页面视图
   * @param pageNumber - 当前页码
   * @returns 绘图容器元素
   */
  createPainterWrapper(e, t) {
    const n = document.createElement("div");
    return n.id = `${Sn}_page_${t}`, n.classList.add(Sn), e.div.appendChild(n), n;
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
      ls(e.wrapper) || this.disposeCanvas(e.pageNumber);
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
    document.body.classList.toggle(`${Un}`, t), Object.values(k).filter((r) => typeof r == "number").map((r) => `${ln}_${r}`).forEach((r) => document.body.classList.remove(r)), cn(Pt), this.currentAnnotation && document.body.classList.add(`${ln}_${this.currentAnnotation?.type}`);
  }
  /**
   * 保存到存储
   */
  saveToStore(e, t = !1) {
    if (!t && !this.can("annotation.create")) return;
    const n = t ? e : ca(
      e,
      ie.getState().annotations.values(),
      this.nextAnnotationReferenceNumber
    );
    t || (this.nextAnnotationReferenceNumber = n.referenceNumber + 1);
    const r = Me.find((s) => s.pdfjsAnnotationType === n.pdfjsType);
    ie.getState().addAnnotation(n, t), this.authorLabels.refreshAnnotation(n.id), !t && (r && (r.isOnce ? this.selectAnnotation(n.id, !0) : ie.getState().setSelectedAnnotation(n, ht.CANVAS)), this.onAnnotationAdd(n, t, r));
  }
  /**
   * 更新存储
   */
  updateStore(e, t, n = !0, r = "annotation.edit", s) {
    const i = ie.getState().getAnnotation(e);
    if (!i || r && !this.can(r, i, s)) return;
    const a = ie.getState().updateAnnotation(e, t);
    return a && this.authorLabels.refreshAnnotation(e), a && n && this.onAnnotationChanged(a), a;
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
      if (r instanceof Fn) {
        r.activateWithSignature(e, n, this.tempDataTransfer);
        return;
      }
      if (r instanceof jn) {
        r.activateWithStamp(e, n, this.tempDataTransfer);
        return;
      }
      r.activate(e, n);
      return;
    }
    let s = null;
    switch (n.type) {
      case k.FREETEXT:
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
      case k.RECTANGLE:
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
      case k.ARROW:
        s = new Us({
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
      case k.CLOUD:
        s = new zs({
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
      case k.CIRCLE:
        s = new fs({
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
      case k.NOTE:
        s = new Ts({
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
      case k.FREEHAND:
        s = new gs({
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
      case k.FREE_HIGHLIGHT:
        s = new ms({
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
      case k.SIGNATURE:
        s = new Fn(
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
      case k.STAMP:
        s = new jn(
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
      case k.HIGHLIGHT:
      case k.UNDERLINE:
      case k.STRIKEOUT:
        s = new zn(
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
      case k.SELECT:
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
    ie.getState().getByPage(e).forEach((r) => {
      let s = this.findEditor(e, r.type);
      if (!s) {
        const i = Me.find((a) => a.type === r.type);
        this.enableEditor({ konvaStage: t.konvaStage, pageNumber: e, annotation: i }), s = this.findEditor(e, r.type);
      }
      s && s.addSerializedGroupToLayer(t.konvaStage, r.konvaString);
    }), this.authorLabels.refreshPage(e), this.hoverPreview.refresh();
  }
  /**
   * 删除批注
   * @param id - 批注 ID
   */
  deleteAnnotation(e, t = !1) {
    const n = ie.getState().getAnnotation(e);
    if (!n || !this.can("annotation.delete", n)) return !1;
    this.annotationHover.clearAnnotation(e), ie.getState().removeAnnotation(e), this.authorLabels.remove(e);
    const r = this.findEditor(n.pageNumber, n.type), s = this.konvaCanvasStore.get(n.pageNumber);
    return r && s && r.deleteGroup(e, s.konvaStage), t && this.onAnnotationDelete(e), !0;
  }
  createDeletedAnnotationEntry(e) {
    const t = Array.from(ie.getState().annotations.keys()), r = this.konvaCanvasStore.get(e.pageNumber)?.konvaStage?.findOne((s) => s.getType() === "Group" && s.name() === Le && s.id() === e.id);
    return {
      kind: "annotation",
      annotation: hn(e),
      storeIndex: Math.max(0, t.indexOf(e.id)),
      konvaIndex: r?.zIndex() ?? null
    };
  }
  restoreDeletedAnnotation(e) {
    const t = hn(e.annotation);
    if (!ie.getState().restoreAnnotation(t, e.storeIndex))
      return console.warn(`Annotation with id ${t.id} already exists; delete undo was skipped.`), !1;
    const r = this.konvaCanvasStore.get(t.pageNumber);
    if (r) {
      let i = this.findEditor(t.pageNumber, t.type);
      if (!i) {
        const l = Me.find((d) => d.type === t.type);
        l && (this.enableEditor({
          konvaStage: r.konvaStage,
          pageNumber: t.pageNumber,
          annotation: l
        }), i = this.findEditor(t.pageNumber, t.type));
      }
      i?.addSerializedGroupToLayer(r.konvaStage, t.konvaString);
      const a = r.konvaStage.findOne((l) => l.getType() === "Group" && l.name() === Le && l.id() === t.id);
      if (a && e.konvaIndex !== null) {
        const l = a.getParent()?.getChildren().length ?? 1;
        a.zIndex(Math.min(e.konvaIndex, l - 1));
      }
      r.konvaStage.batchDraw();
    }
    this.authorLabels.refreshAnnotation(t.id), this.hoverPreview.refresh();
    const s = Me.find((i) => i.pdfjsAnnotationType === t.pdfjsType);
    return this.onAnnotationAdd(t, !1, s), !0;
  }
  restoreDeletedComment(e) {
    const t = ie.getState().getAnnotation(e.annotationId);
    if (!t || t.comments.some((s) => s.id === e.comment.id)) return !1;
    const n = [...t.comments], r = Math.max(0, Math.min(e.commentIndex, n.length));
    return n.splice(r, 0, Xn(e.comment)), !!this.updateStore(t.id, { comments: n }, !0, null);
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
      this.currentAnnotation = null, this.disablePainting(), this.setDefaultMode();
      return;
    }
    if (this.currentAnnotation = e, this.passiveHover.clear(), this.disablePainting(), this.saveTempDataTransfer(t || ""), !!e) {
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
    this.can("annotation.create") && (this.currentAnnotation = t, this.webSelection.highlight(e));
  }
  /**
   * @description 选中对应 ID 批注
   * @param id
   */
  selectAnnotation(e, t) {
    this.setDefaultMode(), this.selector.select(e, t);
  }
  /**
   * @description 将annotation 存入 store, 包含外部 annotation 和 pdf 文件上的 annotation
   */
  async initAnnotationsOnce(e, t) {
    const n = Vn(e);
    if (this.nextAnnotationReferenceNumber = Math.min(
      Yt(n) + 1,
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
    const r = ie.getState(), s = Vn(
      Array.from(r.annotations.values())
    );
    r.setAnnotationReferenceNumbers(
      new Map(s.map((i) => [
        i.id,
        i.referenceNumber
      ]))
    ), this.nextAnnotationReferenceNumber = Math.min(
      Yt(s) + 1,
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
    const n = ie.getState().getAnnotation(e);
    if (!n || !this.can("annotation.delete", n)) return !1;
    const r = t ? this.createDeletedAnnotationEntry(n) : null, s = this.deleteAnnotation(e, t);
    return s && this.selector.delete(), s && r && this.deleteUndoController?.add(r), s;
  }
  deleteComment(e, t) {
    const n = ie.getState().getAnnotation(e), r = n?.comments.findIndex((d) => d.id === t) ?? -1;
    if (!n || r < 0) return !1;
    const s = n.comments[r];
    if (!this.can("comment.delete", n, s)) return !1;
    const i = {
      kind: "comment",
      annotationId: e,
      annotationReferenceNumber: n.referenceNumber,
      previewAnnotation: hn(n),
      comment: Xn(s),
      commentIndex: r
    }, a = n.comments.filter((d) => d.id !== t);
    return this.updateStore(e, { comments: a }, !0, "comment.delete", s) ? (this.deleteUndoController?.add(i), !0) : !1;
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
      const s = r.kind === "annotation" ? this.restoreDeletedAnnotation(r) : this.restoreDeletedComment(r);
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
      const d = s * r.viewport.scale, h = Math.max(0, i * r.viewport.scale - 200), [u, f] = r.viewport.convertToPdfPoint(d, h);
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
    return new Promise((d) => {
      this.resolveHighlightRequest = d;
      const h = (f) => {
        t === this.highlightRequestId && (this.highlightRetryTimer !== null && (window.clearTimeout(this.highlightRetryTimer), this.highlightRetryTimer = null), this.resolveHighlightRequest = null, d(f));
      }, u = (f) => {
        if (t !== this.highlightRequestId) return;
        if (this.findEditor(e.pageNumber, e.type)) {
          this.setDefaultMode(), this.selector.select(e.id), this.currentAnnotation && this.currentAnnotation.type === k.SELECT && this.selector.activate(e.pageNumber), h(!0);
          return;
        }
        if (f <= 0) {
          h(!1);
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
    return Array.from(ie.getState().annotations.values());
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
    this.cancelHighlightRequest(), this.deleteUndoController?.clear(), this.disablePainting(), this.webSelection.destroy(), this.passiveHover.destroy(), this.annotationHover.destroy(), this.unsubscribeAnnotationHover(), this.hoverPreview.destroy(), this.authorLabels.destroy(), window.removeEventListener("keyup", this.globalKeyUpHandler), this.konvaCanvasStore.forEach((t) => {
      t.konvaStage.destroy();
    }), this.konvaCanvasStore.clear(), this.editorStore.clear(), this.selector.delete(), this.clearTempDataTransfer(), this.currentAnnotation = null, document.body.classList.remove(`${Un}`), Object.values(k).filter((t) => typeof t == "number").map((t) => `${ln}_${t}`).forEach((t) => document.body.classList.remove(t)), cn(Pt);
  }
}
const Fo = Jt(void 0), et = () => {
  const o = Lt(Fo);
  if (o === void 0)
    throw new Error("usePainter must be used within a PainterProvider");
  return o;
}, Sa = {
  placement: "bottom",
  middleware: [vo()]
}, jo = Zt(function(e, t) {
  const {
    buttons: n,
    renderButtons: r,
    positionOptions: s = Sa,
    visible: i,
    onVisibleChange: a,
    children: l
  } = e, d = i !== void 0, [h, u] = V(!1), f = d ? i : h, p = J((G) => {
    d ? a?.(G) : u(G);
  }, [d, a]), [g, m] = V(null), v = B(null), C = B(null), E = B(null), S = J(() => {
    p(!1), C.current = null, E.current = null;
  }, [p]), x = J((G) => {
    if (C.current = G, E.current = null, !G) {
      S();
      return;
    }
    p(!0);
    const R = G.getBoundingClientRect();
    let T = R;
    if (R.top < 0 || R.left < 0) {
      const _ = window.getSelection();
      if (_ && _.rangeCount > 0) {
        const X = _.focusNode, q = _.anchorNode;
        if (X && q) {
          const ee = document.createRange(), $ = document.createRange();
          _.anchorOffset <= _.focusOffset ? (ee.setStart(_.anchorNode, _.anchorOffset), ee.setEnd(_.anchorNode, Math.min(_.anchorOffset + 1, _.anchorNode.textContent?.length || 0)), $.setStart(_.focusNode, Math.max(_.focusOffset - 1, 0)), $.setEnd(_.focusNode, _.focusOffset)) : (ee.setStart(_.focusNode, _.focusOffset), ee.setEnd(_.focusNode, Math.min(_.focusOffset + 1, _.focusNode.textContent?.length || 0)), $.setStart(_.anchorNode, Math.max(_.anchorOffset - 1, 0)), $.setEnd(_.anchorNode, _.anchorOffset));
          const y = ee.getBoundingClientRect(), M = $.getBoundingClientRect();
          T = {
            top: Math.max(0, Math.min(y.top, M.top)),
            left: Math.max(0, Math.min(y.left, M.left)),
            bottom: Math.max(y.bottom, M.bottom),
            right: Math.max(y.right, M.right),
            width: Math.abs(M.right - y.left),
            height: Math.max(y.height, M.height),
            x: Math.max(0, Math.min(y.x, M.x)),
            y: Math.max(0, Math.min(y.y, M.y)),
            toJSON: R.toJSON
          };
        }
      }
    }
    const D = {
      getBoundingClientRect: () => T
    };
    requestAnimationFrame(() => {
      v.current && jt(D, v.current, s).then(({ x: _, y: X }) => {
        v.current && Object.assign(v.current.style, {
          left: `${_}px`,
          top: `${X}px`
        });
      }).catch((_) => {
        console.warn("Failed to compute popover position:", _);
      });
    });
  }, [S, s, p]), N = Ae(() => (r ? r({ range: C.current, rect: E.current, close: S }) : n || []).map((R) => /* @__PURE__ */ w(
    me,
    {
      size: "2",
      variant: "ghost",
      color: "gray",
      highContrast: !0,
      style: {
        opacity: R.disabled ? 0.5 : 1,
        boxShadow: "none",
        margin: "0"
      },
      onMouseDown: () => {
        R.onClick(C.current, E.current);
      },
      disabled: R.disabled,
      children: [
        R.icon,
        R.title
      ]
    },
    R.key
  )), [n, S, r]), H = N.length > 0 || !!l;
  oe(() => {
    if (!H) {
      f && E.current && g === null && m(E.current);
      return;
    }
    f && v.current && g && (jt({
      getBoundingClientRect: () => g
    }, v.current, s).then(({ x: R, y: T }) => {
      v.current && Object.assign(v.current.style, {
        left: `${R}px`,
        top: `${T}px`
      });
    }).catch((R) => {
      console.warn("Failed to compute popover position:", R);
    }), m(null));
  }, [H, f, g, s]);
  const z = J((G) => {
    if (C.current = null, E.current = G, v.current || m(G), p(!0), v.current) {
      const R = {
        getBoundingClientRect: () => G
      };
      requestAnimationFrame(() => {
        v.current && jt(R, v.current, s).then(({ x: T, y: D }) => {
          v.current && Object.assign(v.current.style, {
            left: `${T}px`,
            top: `${D}px`
          });
        }).catch((T) => {
          console.warn("Failed to compute popover position:", T);
        });
      });
    }
  }, [s, p]);
  kn(t, () => ({
    open: x,
    openWithRect: z,
    close: S
  }), [x, z, S]);
  const { appearance: F } = Qt(), j = {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 999,
    display: f ? "block" : "none",
    width: "max-content",
    backgroundColor: F === "light" ? "#fff" : "#242430",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: 4,
    padding: "2px"
  };
  return H ? /* @__PURE__ */ c(
    "div",
    {
      ref: v,
      style: j,
      children: l || /* @__PURE__ */ c(K, { gap: "1", align: "center", children: N })
    }
  ) : null;
}), wa = Zt(function(e, t) {
  const { t: n } = ge(["annotator"], { useSuspense: !1 }), {
    popoverBarProps: r = {}
  } = e, s = Dt.useRef(null), { painter: i } = et();
  return kn(t, () => ({
    open: (a) => {
      s.current?.open(a);
    },
    close: () => {
      s.current?.close();
    }
  }), []), /* @__PURE__ */ c(
    jo,
    {
      ref: s,
      renderButtons: () => [
        {
          key: "highlight",
          icon: /* @__PURE__ */ c(ko, {}),
          onClick: (a) => {
            const l = Me.find((d) => d.name === "highlight");
            i?.highlightRange(a, l), s.current?.close();
          },
          title: n("annotator:tool.highlight")
        },
        {
          key: "underline",
          icon: /* @__PURE__ */ c(Po, {}),
          onClick: (a) => {
            const l = Me.find((d) => d.name === "underline");
            i?.highlightRange(a, l), s.current?.close();
          },
          title: n("annotator:tool.underline")
        },
        {
          key: "strikeout",
          icon: /* @__PURE__ */ c(Ro, {}),
          onClick: (a) => {
            const l = Me.find((d) => d.name === "strikeout");
            i?.highlightRange(a, l), s.current?.close();
          },
          title: n("annotator:tool.strikeout")
        }
      ],
      ...r
    }
  );
}), Wo = Jt(null), _t = () => {
  const o = Lt(Wo);
  if (!o)
    throw new Error("useOptionsContext must be used within a OptionsProvider");
  return o;
}, Ca = "_ColorPicker_18032_1", Ta = "_cell_18032_1", Aa = "_active_18032_21", pn = {
  ColorPicker: Ca,
  cell: Ta,
  active: Aa
};
function Bo(o, e) {
  if (!Ht(o) || !Ht(e))
    return e !== void 0 ? e : o;
  const t = { ...o }, n = e, r = o;
  return Object.keys(n).forEach((s) => {
    const i = n[s], a = r[s];
    if (Array.isArray(i)) {
      t[s] = i;
      return;
    }
    if (Ht(i) && Ht(a)) {
      t[s] = Bo(a, i);
      return;
    }
    i !== void 0 && (t[s] = i);
  }), t;
}
function Ht(o) {
  return o !== null && typeof o == "object" && Object.prototype.toString.call(o) === "[object Object]";
}
function xa(o) {
  const e = document.createElement("canvas");
  e.width = e.height = 1;
  const t = e.getContext("2d", { colorSpace: "srgb" });
  if (!t)
    return o;
  t.fillStyle = o, t.fillRect(0, 0, 1, 1);
  const n = t.getImageData(0, 0, 1, 1).data;
  return `rgb(${n[0]}, ${n[1]}, ${n[2]})`;
}
function qn() {
  const o = document.getElementById("InkLayer");
  if (o) {
    const t = getComputedStyle(o).getPropertyValue("--accent-9").trim();
    return xa(t);
  }
  return "#1677ff";
}
function Jn(o) {
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
function Ea(o, e) {
  try {
    return Jn(o) === Jn(e);
  } catch {
    return !1;
  }
}
function ka(o, e, t = !1) {
  let n = null;
  return function(...r) {
    const s = t && !n;
    n && clearTimeout(n), n = setTimeout(() => {
      n = null, t || o.apply(this, r);
    }, e), s && o.apply(this, r);
  };
}
const Mt = ({
  value: o = "#000000",
  onChange: e,
  presets: t = [],
  transparent: n = !1,
  popover: r = !1,
  custom: s = !0,
  trigger: i
}) => {
  const { t: a } = ge("common", { useSuspense: !1 }), [l, d] = V(o), h = (p) => {
    d(p), e?.(p);
  }, u = (p) => {
    h(p);
  }, f = () => /* @__PURE__ */ c(st, { maxWidth: "240px", className: pn.ColorPicker, children: /* @__PURE__ */ c(mr, { size: "2", variant: "ghost", children: /* @__PURE__ */ w(K, { direction: "column", gap: "3", children: [
    s && /* @__PURE__ */ c(Yr, { color: l, onChange: h }),
    /* @__PURE__ */ c(Ft, { columns: "5", gap: "2", children: t?.map((p) => /* @__PURE__ */ c(
      "div",
      {
        className: `${pn.cell} ${Ea(l, p) ? pn.active : ""}`,
        onMouseDown: () => u(p),
        children: /* @__PURE__ */ c("span", { style: { backgroundColor: p } })
      },
      p
    )) }),
    n && /* @__PURE__ */ c(Ze, { variant: "ghost", onClick: () => u("transparent"), children: a("transparent") })
  ] }) }) });
  return /* @__PURE__ */ c(Se, { children: r ? /* @__PURE__ */ w(Te.Root, { children: [
    /* @__PURE__ */ c(Te.Trigger, { children: i || /* @__PURE__ */ c(Ze, { variant: "outline", color: "gray", children: /* @__PURE__ */ w("svg", { viewBox: "0 0 1024 1024", style: { width: "1em", height: "1em", color: l }, children: [
      /* @__PURE__ */ c("path", { d: "M96 837.68888888h832v160H96z", fill: "currentColor" }),
      /* @__PURE__ */ c("path", { d: "M429.30646525 163.315053m54.92260742 54.92260743l164.76782227 164.76782227q54.92260742 54.92260742 0 109.84521486l-164.76782227 164.76782228q-54.92260742 54.92260742-109.84521486 0l-164.76782228-164.76782228q-54.92260742-54.92260742 0-109.84521486l164.76782228-164.76782227q54.92260742-54.92260742 109.84521486 0Z", fill: "#FFFFFF" }),
      /* @__PURE__ */ c("path", { d: "M364.65047577 163.33699097L262.12304466 60.85098508 320.69831237 2.23429214l153.14905568 153.10763046c2.94119095 2.27838736 5.79953147 4.76390083 8.5335963 7.45654045l234.34249608 234.34249608a82.85044939 82.85044939 0 0 1 0 117.15053543l-234.34249608 234.34249607a82.85044939 82.85044939 0 0 1-117.19196065 0L130.88793283 514.29149456a82.85044939 82.85044939 0 0 1 0-117.15053543l233.76254294-233.80396816z m220.2579197 219.13943862l-0.57995316 0.53852791-161.0612736-161.0612736-226.72025474 226.67882952h454.51756532L584.90839547 382.47642959zM822.68918518 783.3069037a103.56306173 103.56306173 0 0 1-103.56306171-103.56306173c0-57.16681008 87.61435022-161.39267539 103.56306171-161.3926754 15.9487115 0 103.56306173 104.1844401 103.56306173 161.3926754a103.56306173 103.56306173 0 0 1-103.56306173 103.56306173z", fill: "#000000d6" })
    ] }) }) }),
    /* @__PURE__ */ c(Te.Content, { children: /* @__PURE__ */ c(f, {}) })
  ] }) : /* @__PURE__ */ c(f, {}) });
};
function Ra(o) {
  return I.Node.create(o).children[0];
}
const Pa = Zt(function(e, t) {
  const { t: n } = ge(["common", "annotator"], { useSuspense: !1 }), { openSidebar: r, activeSidebarPanel: s, viewerContainerRef: i } = je(), { painter: a } = et(), { defaultOptions: l } = _t(), { popoverBarProps: d = {} } = e, h = B(null), [u, f] = V(null), [p, g] = V(2), [m, v] = V(1), [C, E] = V(!1), S = B(null), x = J((T, D) => {
    const _ = `${Sn}_page_${T.pageNumber}`, X = i?.current?.querySelector(
      `#${_} .konvajs-content`
    );
    if (X) {
      const q = X.getBoundingClientRect(), ee = D.x + q.left, $ = D.y + q.top, y = {
        x: ee,
        y: $,
        width: D.width,
        height: D.height,
        top: $,
        left: ee,
        right: ee + D.width,
        bottom: $ + D.height,
        toJSON: () => ({})
      };
      h.current?.openWithRect(y);
    }
  }, [i]);
  it(() => {
    const T = S.current;
    !u || !T || x(u, T);
  }, [x, u, C]), kn(t, () => ({
    open: (T, D) => {
      f(T), S.current = D;
      const _ = Ra(T.konvaString);
      g(_.strokeWidth()), v(_.opacity() * 100), x(T, D);
    },
    close: () => {
      h.current?.close(), f(null), E(!1), S.current = null;
    }
  }));
  const N = u && Me.find((T) => T.type === u.type)?.styleEditable, H = !!(u && a?.can("annotation.comment", u)), z = !!(u && a?.can("annotation.edit", u)), F = !!(u && a?.can("annotation.delete", u)), j = (T) => {
    !u || !a?.can("annotation.edit", u) || a?.updateAnnotationStyle(u, T);
  }, G = () => {
    !u || !a?.can("annotation.delete", u) || a?.delete(u.id, !0);
  }, R = (T) => {
    r("annotator-sidebar-toggle"), ie.getState().setSelectedAnnotation(T, ht.CANVAS);
  };
  return /* @__PURE__ */ c(
    jo,
    {
      ref: h,
      renderButtons: () => u ? [
        ...H && s !== "annotator-sidebar-toggle" ? [
          {
            key: "comment",
            icon: /* @__PURE__ */ c(No, {}),
            onClick: () => {
              R(u), h.current?.close();
            },
            title: n("comment")
          }
        ] : [],
        ...z && N ? [
          {
            key: "palette",
            icon: /* @__PURE__ */ c(rs, {}),
            onClick: () => {
              E(!C);
            },
            title: n("color")
          }
        ] : [],
        ...F ? [{
          key: "delete",
          icon: /* @__PURE__ */ c(cs, {}),
          onClick: () => {
            G(), h.current?.close();
          },
          title: n("delete")
        }] : []
      ] : [],
      ...d,
      children: C && u && z && N && /* @__PURE__ */ w("div", { style: { margin: 8 }, children: [
        /* @__PURE__ */ w(
          me,
          {
            size: "2",
            variant: "ghost",
            color: "gray",
            highContrast: !0,
            onMouseDown: (T) => {
              T.preventDefault(), E(!1);
            },
            children: [
              /* @__PURE__ */ c(wr, {}),
              n("back")
            ]
          }
        ),
        /* @__PURE__ */ c(Qe, { my: "2", size: "4" }),
        N?.color && /* @__PURE__ */ c(
          Mt,
          {
            value: u.color ?? void 0,
            onChange: (T) => {
              j({ color: T });
            },
            popover: !1,
            custom: !1,
            presets: l.colors
          }
        ),
        (N?.opacity || N?.strokeWidth) && /* @__PURE__ */ w(Se, { children: [
          /* @__PURE__ */ c(Qe, { my: "3", size: "4" }),
          /* @__PURE__ */ c(st, { style: { margin: 8 }, children: /* @__PURE__ */ w(K, { gap: "3", direction: "column", children: [
            N.strokeWidth && /* @__PURE__ */ w(Se, { children: [
              /* @__PURE__ */ w(se, { as: "div", size: "2", weight: "bold", children: [
                n("strokeWidth"),
                " (",
                p,
                ")"
              ] }),
              /* @__PURE__ */ c(
                Ln,
                {
                  variant: "soft",
                  size: "1",
                  min: 1,
                  max: 20,
                  defaultValue: [p || 1],
                  onValueChange: (T) => {
                    j({ strokeWidth: T[0] }), g(T[0]);
                  }
                }
              )
            ] }),
            N.opacity && /* @__PURE__ */ w(Se, { children: [
              /* @__PURE__ */ w(se, { as: "div", size: "2", weight: "bold", children: [
                n("opacity"),
                " (",
                m,
                "%)"
              ] }),
              /* @__PURE__ */ c(
                Ln,
                {
                  variant: "soft",
                  size: "1",
                  min: 1,
                  max: 100,
                  defaultValue: [m || 100],
                  onValueChange: (T) => {
                    j({ opacity: T[0] / 100 }), v(T[0]);
                  }
                }
              )
            ] })
          ] }) })
        ] })
      ] })
    }
  );
}), Zn = 500;
function fn(o) {
  const e = o?.replace(/\s+/g, " ").trim() ?? "";
  return e.length <= Zn ? e : `${e.slice(0, Zn).trimEnd()}…`;
}
const Na = "_card_ijigf_1", Ia = "_header_ijigf_7", Ma = "_identity_ijigf_15", Da = "_referenceLabel_ijigf_23", La = "_referenceLabelStatic_ijigf_44", _a = "_separator_ijigf_50", Oa = "_author_ijigf_54", Ha = "_page_ijigf_61", Ga = "_selectedText_ijigf_67", Ua = "_preview_ijigf_68", za = "_empty_ijigf_69", Fa = "_footer_ijigf_93", ja = "_deletedComments_ijigf_98", Wa = "_deletedCommentsTitle_ijigf_105", Ba = "_deletedCommentAuthor_ijigf_106", $a = "_deletedCommentsMore_ijigf_107", Va = "_deletedComment_ijigf_98", Ya = "_deletedCommentContent_ijigf_117", Ie = {
  card: Na,
  header: Ia,
  identity: Ma,
  referenceLabel: Da,
  referenceLabelStatic: La,
  separator: _a,
  author: Oa,
  page: Ha,
  selectedText: Ga,
  preview: Ua,
  empty: za,
  footer: Fa,
  deletedComments: ja,
  deletedCommentsTitle: Wa,
  deletedCommentAuthor: Ba,
  deletedCommentsMore: $a,
  deletedComment: Va,
  deletedCommentContent: Ya
}, $o = ({
  annotation: o,
  children: e,
  onActivate: t,
  onOpenChange: n,
  previewComments: r = []
}) => {
  const { t: s } = ge("annotator", { useSuspense: !1 }), [i, a] = V(!1), l = fn(o.contentsObj?.text), d = fn(o.contentsObj?.selectedText), h = r.length > 0, u = !!(l || d || h), f = o.user?.name || o.title, p = o.comments?.length ?? 0, g = o.referenceNumber === void 0 ? o.title : `#${o.referenceNumber}`, m = () => {
    t && (a(!1), t(o.id));
  }, v = (C) => {
    a(C), n?.(C);
  };
  return /* @__PURE__ */ w(
    an.Root,
    {
      open: i,
      onOpenChange: v,
      openDelay: 350,
      closeDelay: 150,
      children: [
        /* @__PURE__ */ c(an.Trigger, { children: e }),
        /* @__PURE__ */ w(
          an.Content,
          {
            align: "center",
            size: "2",
            className: Ie.card,
            onClick: (C) => C.stopPropagation(),
            children: [
              /* @__PURE__ */ w("div", { className: Ie.header, children: [
                /* @__PURE__ */ w("span", { className: Ie.identity, children: [
                  t ? /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      className: Ie.referenceLabel,
                      "aria-label": s("comment.reference.open", {
                        value: g
                      }),
                      onClick: m,
                      children: g
                    }
                  ) : /* @__PURE__ */ c("span", { className: Ie.referenceLabelStatic, children: g }),
                  /* @__PURE__ */ c("span", { className: Ie.separator, "aria-hidden": "true", children: "·" }),
                  /* @__PURE__ */ c("span", { className: Ie.author, children: f })
                ] }),
                /* @__PURE__ */ c("span", { className: Ie.page, children: s("comment.reference.previewPage", {
                  value: o.pageNumber
                }) })
              ] }),
              d ? /* @__PURE__ */ c("blockquote", { className: Ie.selectedText, children: d }) : null,
              !h && l ? /* @__PURE__ */ c("p", { className: Ie.preview, children: l }) : null,
              h ? /* @__PURE__ */ w("section", { className: Ie.deletedComments, children: [
                /* @__PURE__ */ c("div", { className: Ie.deletedCommentsTitle, children: s("deleteUndo.deletedCommentPreview") }),
                r.slice(0, 3).map((C) => /* @__PURE__ */ w("div", { className: Ie.deletedComment, children: [
                  /* @__PURE__ */ c("span", { className: Ie.deletedCommentAuthor, children: C.user?.name || C.title }),
                  /* @__PURE__ */ c("p", { className: Ie.deletedCommentContent, children: fn(C.content) || s("comment.reference.previewNoContent") })
                ] }, C.id)),
                r.length > 3 ? /* @__PURE__ */ c("div", { className: Ie.deletedCommentsMore, children: s("deleteUndo.deletedCommentsMore", {
                  count: r.length - 3
                }) }) : null
              ] }) : null,
              u ? null : /* @__PURE__ */ c("p", { className: Ie.empty, children: s("comment.reference.previewNoContent") }),
              p > 0 && !h ? /* @__PURE__ */ c("div", { className: Ie.footer, children: s("comment.reference.replyCount", {
                count: p
              }) }) : null
            ]
          }
        )
      ]
    }
  );
}, Ka = "_overlay_1ya7e_1", Xa = "_snackbar_1ya7e_13", qa = "_content_1ya7e_18", Ja = "_message_1ya7e_22", Za = "_reference_1ya7e_29", kt = {
  overlay: Ka,
  snackbar: Xa,
  content: qa,
  message: Ja,
  reference: Za
}, Qn = 24, Qa = /#(\d+)/g;
function ec(o) {
  const e = o?.replace(/\s+/g, " ").trim() ?? "", t = Array.from(e);
  return t.length <= Qn ? e : `${t.slice(0, Qn).join("")}…`;
}
function tc(o) {
  return o.annotationReferenceNumber === void 0 ? "" : ` #${o.annotationReferenceNumber}`;
}
function eo(o) {
  return `“${o}”`;
}
function nc(o, e, t) {
  const n = Array.from(new Set(o.map((i) => i.annotationReferenceNumber).filter((i) => i !== void 0))), r = t.startsWith("zh") ? "、" : ", ", s = n.slice(0, 3).map((i) => `#${i}`).join(r);
  return n.length > 3 ? e("annotator:deleteUndo.referencesMore", { references: s }) : s;
}
function oc(o, e, t) {
  if (o.totalCount === 1) {
    const r = o.items[0], s = tc(r), i = ec(r.content);
    if (r.kind === "annotation") {
      if (i)
        return e("annotator:deleteUndo.annotationDeletedDetailed", {
          reference: s,
          detail: eo(i)
        });
      const a = Me.find((h) => h.type === r.annotationType), l = a ? e(`annotator:tool.${a.name}`) : "", d = l && r.pageNumber ? e("annotator:deleteUndo.typeAndPage", { type: l, page: r.pageNumber }) : l || (r.pageNumber ? e("annotator:deleteUndo.page", { page: r.pageNumber }) : "");
      return d ? e("annotator:deleteUndo.annotationDeletedDetailed", { reference: s, detail: d }) : e("annotator:deleteUndo.annotationDeleted", { reference: s });
    }
    return i ? e("annotator:deleteUndo.commentDeletedDetailed", {
      reference: s,
      detail: eo(i)
    }) : r.author ? e("annotator:deleteUndo.commentDeletedByAuthor", { reference: s, author: r.author }) : e("annotator:deleteUndo.commentDeleted", { reference: s });
  }
  const n = nc(o.items, e, t);
  return o.annotationCount === o.totalCount ? n ? e("annotator:deleteUndo.annotationsDeletedDetailed", { count: o.totalCount, references: n }) : e("annotator:deleteUndo.annotationsDeleted", { count: o.totalCount }) : o.commentCount === o.totalCount ? n ? e("annotator:deleteUndo.commentsDeletedDetailed", { count: o.totalCount, references: n }) : e("annotator:deleteUndo.commentsDeleted", { count: o.totalCount }) : n ? e("annotator:deleteUndo.itemsDeletedDetailed", { count: o.totalCount, references: n }) : e("annotator:deleteUndo.itemsDeleted", { count: o.totalCount });
}
function rc(o, e) {
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
  for (const s of o.matchAll(Qa)) {
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
function ic() {
  const { painter: o } = et(), { t: e, i18n: t } = ge(["common", "annotator"], { useSuspense: !1 }), n = B(null), r = B(!1), s = B(!1), i = B(/* @__PURE__ */ new Set()), a = J(
    (p) => o?.subscribeDeleteUndo(p) ?? (() => {
    }),
    [o]
  ), l = J(
    () => o?.getDeleteUndoSnapshot() ?? null,
    [o]
  ), d = nr(a, l, () => null);
  if (!d) return null;
  const h = oc(d, e, t.resolvedLanguage ?? t.language), u = rc(h, d.items), f = (p, g) => {
    if (g) {
      i.current.add(p), o?.pauseDeleteUndo();
      return;
    }
    i.current.delete(p), !r.current && !s.current && i.current.size === 0 && o?.resumeDeleteUndo();
  };
  return /* @__PURE__ */ c("div", { className: kt.overlay, children: /* @__PURE__ */ c(
    at.Root,
    {
      ref: n,
      className: kt.snackbar,
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
      children: /* @__PURE__ */ w(K, { className: kt.content, align: "center", gap: "2", children: [
        /* @__PURE__ */ c(at.Text, { className: kt.message, children: u.map((p, g) => {
          if (p.kind === "text")
            return /* @__PURE__ */ c(Dt.Fragment, { children: p.value }, `text-${g}`);
          const m = `${p.annotation.id}-${g}`;
          return /* @__PURE__ */ c(
            $o,
            {
              annotation: p.annotation,
              previewComments: p.comments,
              onOpenChange: (v) => f(m, v),
              children: /* @__PURE__ */ c("button", { className: kt.reference, type: "button", children: p.value })
            },
            m
          );
        }) }),
        /* @__PURE__ */ c(
          me,
          {
            size: "1",
            onClick: () => o?.undoDelete(),
            children: e(d.totalCount === 1 ? "common:restore" : "common:restoreAll")
          }
        )
      ] })
    }
  ) });
}
const to = "inklayer-annotator", sc = ({
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
  const { isReady: d, pdfViewer: h, eventBus: u, isSidebarCollapsed: f } = je(), { user: p } = wo(), { refreshPainter: g, setPainter: m } = et(), { defaultOptions: v, primaryColor: C } = _t(), E = ie((T) => T.clearAnnotations), S = B({
    annotations: e ?? [],
    enableNativeAnnotations: o,
    onLoad: r,
    onAnnotationAdd: s,
    onAnnotationDelete: i,
    onAnnotationSelected: a,
    onAnnotationChanged: l
  });
  S.current = {
    annotations: e ?? [],
    enableNativeAnnotations: o,
    onLoad: r,
    onAnnotationAdd: s,
    onAnnotationDelete: i,
    onAnnotationSelected: a,
    onAnnotationChanged: l
  };
  const x = B(null), N = B(null), H = B(null), z = B(p), F = B(t), j = B(n);
  z.current = p, F.current = t;
  const G = B(
    ka(
      () => {
        N.current?.close(), x.current?.close();
        const T = document.querySelector(`#${Lo}`);
        if (T?.parentNode)
          try {
            T.parentNode.removeChild(T);
          } catch {
          }
      },
      100,
      !0
    )
  ).current, R = J(() => {
    G();
  }, [G]);
  return oe(() => {
    if (E(), !d || !h || !u || !z.current) return;
    let T = !1, D = !1, _ = null;
    const X = new ba({
      primaryColor: C,
      defaultOptions: v,
      currentUser: z.current,
      annotationPermissions: F.current,
      defaultShowAnnotationAuthorLabels: j.current,
      PDFViewerApplication: h,
      onTextSelected: ($) => {
        x.current?.open($);
      },
      onAnnotationAdd: ($) => {
        S.current.onAnnotationAdd($);
      },
      onAnnotationDelete: ($) => {
        S.current.onAnnotationDelete($);
      },
      onAnnotationSelected: ($, y, M) => {
        y && $ && N.current?.open($, M), S.current.onAnnotationSelected($ ?? null, y);
      },
      onAnnotationChanging: () => {
        N.current?.close();
      },
      onAnnotationChanged: ($, y) => {
        $ && y && N.current?.open($, y), $ && S.current.onAnnotationChanged($);
      }
    });
    H.current = X, m(X);
    const q = ({ source: $, cssTransform: y, pageNumber: M }) => {
      X.initCanvas({
        pageView: $,
        cssTransform: y,
        pageNumber: M
      });
    };
    u.on("pagerendered", q), u._on("updateviewarea", R), X.initWebSelection(h.viewer);
    const ee = async () => {
      if (!(T || D)) {
        D = !0;
        try {
          const { annotations: $, enableNativeAnnotations: y } = S.current;
          await X.initAnnotationsOnce($, y);
        } catch ($) {
          T || console.error("[Annotator] Failed to initialize annotations", $);
          return;
        }
        T || (_ = setTimeout(() => {
          if (_ = null, !T)
            for (let $ = 0; $ < h.pagesCount; $++) {
              const y = h.getPageView($);
              if (y && y.div && y.canvas) {
                const M = X.getKonvaCanvasStore();
                M && M.has($ + 1) && X.reRenderAnnotations($ + 1);
              }
            }
        }, 0), S.current.onLoad?.());
      }
    };
    return h.pdfDocument ? ee() : u.on("documentloaded", ee), () => {
      T = !0, _ && (clearTimeout(_), _ = null), u.off("pagerendered", q), u.off("updateviewarea", R), u.off("documentloaded", ee), X.destroy(), H.current === X && (H.current = null), m(null);
    };
  }, [E, v, u, R, d, h, C, m]), it(() => {
    z.current && (N.current?.close(), H.current?.setPermissionContext(z.current, F.current), H.current && g());
  }, [t, g, p]), oe(() => {
    if (!u) return;
    const T = (_) => {
      const X = /* @__PURE__ */ new Map();
      _.forEach((q) => {
        X.set(q.pageNumber, (X.get(q.pageNumber) ?? 0) + 1);
      }), u.dispatch($t, {
        source: to,
        markers: X
      });
    };
    T(ie.getState().annotations);
    const D = ie.subscribe((_, X) => {
      _.annotations !== X.annotations && T(_.annotations);
    });
    return () => {
      D(), u.dispatch($t, {
        source: to,
        markers: /* @__PURE__ */ new Map()
      });
    };
  }, [u]), oe(() => {
    R();
  }, [R, f]), /* @__PURE__ */ w(Se, { children: [
    /* @__PURE__ */ c(wa, { ref: x }),
    /* @__PURE__ */ c(Pa, { ref: N }),
    /* @__PURE__ */ c(ic, {})
  ] });
}, ac = {
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
}, cc = {
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
}, lc = ["common", "viewer", "annotator"];
Ce.use(br).init({
  resources: {
    "zh-CN": ac,
    "en-US": cc
  },
  lng: "zh-CN",
  fallbackLng: "en-US",
  ns: lc,
  defaultNS: "common",
  interpolation: { escapeValue: !1 }
});
const St = Zt(({
  icon: o,
  selected: e,
  onClick: t,
  disabled: n = !1,
  title: r,
  label: s,
  buttonProps: i = {}
}, a) => {
  const l = /* @__PURE__ */ w(
    Ze,
    {
      ref: a,
      color: e ? void 0 : "gray",
      variant: e ? "soft" : "outline",
      style: {
        opacity: n ? 0.5 : 1,
        boxShadow: "none"
      },
      onClick: t,
      disabled: n,
      title: r,
      "aria-label": r,
      ...i,
      children: [
        o,
        s
      ]
    }
  );
  return r ? /* @__PURE__ */ c(At, { content: r, children: l }) : l;
}), vt = {
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
}, Kt = () => {
  const { t: o } = ge("viewer", { useSuspense: !1 }), { pdfViewer: e, eventBus: t } = je(), [n, r] = V("auto");
  oe(() => {
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
    const p = Math.min(f + vt.ZOOM_STEP, vt.MAX_SCALE), g = Math.round(p * 100) / 100;
    i(g.toString());
  }, l = () => {
    let f = s(n);
    f === null && (f = e ? e.currentScale : 1);
    const p = Math.max(f - vt.ZOOM_STEP, vt.MIN_SCALE), g = Math.round(p * 100) / 100;
    i(g.toString());
  }, d = () => (s(n) ?? (e?.currentScale || 1)) >= vt.MAX_SCALE, h = () => (s(n) ?? (e?.currentScale || 1)) <= vt.MIN_SCALE, u = (() => {
    const f = vt.ZOOM_OPTIONS.find((g) => g.value === n);
    if (f)
      return "labelKey" in f && f.labelKey ? o(f.labelKey) : "label" in f ? f.label : n;
    const p = parseFloat(n);
    return isNaN(p) ? o("viewer:zoom.auto") : `${Math.round(p * 100)}%`;
  })();
  return /* @__PURE__ */ w(K, { gap: "2", align: "center", children: [
    /* @__PURE__ */ c(
      St,
      {
        buttonProps: {
          size: "1",
          disabled: h()
        },
        icon: /* @__PURE__ */ c(Cr, {}),
        onClick: l
      }
    ),
    /* @__PURE__ */ c(
      St,
      {
        buttonProps: {
          size: "1",
          disabled: d()
        },
        icon: /* @__PURE__ */ c(Tr, {}),
        onClick: a
      }
    ),
    /* @__PURE__ */ w(fe.Root, { children: [
      /* @__PURE__ */ c(fe.Trigger, { children: /* @__PURE__ */ w(me, { variant: "ghost", size: "2", color: "gray", style: { width: 80 }, children: [
        u,
        /* @__PURE__ */ c(fe.TriggerIcon, {})
      ] }) }),
      /* @__PURE__ */ c(fe.Content, { children: vt.ZOOM_OPTIONS.map((f) => /* @__PURE__ */ c(
        fe.Item,
        {
          onSelect: () => i(f.value),
          children: "labelKey" in f ? o(f.labelKey) : f.label
        },
        f.key
      )) })
    ] })
  ] });
}, dc = "_SignatureTool_mpyjt_1", uc = "_container_mpyjt_1", hc = "_info_mpyjt_23", pc = "_imagePreview_mpyjt_34", fc = "_toolbar_mpyjt_48", gc = "_colorPalette_mpyjt_53", mc = "_cell_mpyjt_58", vc = "_active_mpyjt_75", yc = "_toolbarDark_mpyjt_84", bc = "_SignaturePop_mpyjt_94", Je = {
  SignatureTool: dc,
  container: uc,
  info: hc,
  imagePreview: pc,
  toolbar: fc,
  colorPalette: gc,
  cell: mc,
  active: vc,
  toolbarDark: yc,
  SignaturePop: bc
}, Xt = /* @__PURE__ */ new Set();
function Sc(o) {
  if (!o.external || !o.url || Xt.has(o.value)) return;
  const e = document.createElement("style");
  e.innerHTML = `
    @font-face {
        font-family: '${o.value}';
        src: url('${o.url}') format('truetype');
        font-weight: normal;
        font-style: normal;
    }
    `, document.head.appendChild(e), Xt.add(o.value);
}
async function wc(o) {
  if (!(!o.external || !o.url || Xt.has(o.value)))
    try {
      const e = new FontFace(o.value, `url(${o.url})`);
      await e.load(), document.fonts.add(e), Xt.add(o.value);
    } catch {
      Sc(o);
    }
}
const Gt = 80, Cc = ({ annotation: o, disabled: e = !1, onAdd: t, default_signatures: n, presentation: r = "toolbar-icon", label: s }) => {
  const { defaultOptions: i } = _t(), a = i.signature.colors, l = 420, d = 200, h = i.signature.type, u = i.signature.maxSize, f = i.signature.accept, p = 600, g = i.signature.defaultFont, { t: m } = ge(["common", "annotator"], { useSuspense: !1 }), v = B(null), C = B(null), E = B(a[0]), S = B(null), [x, N] = V(!1), [H, z] = V(E.current), [F, j] = V(!0), [G, R] = V([]), [T, D] = V(null), [_, X] = V(""), [q, ee] = V(g[0]?.value || "Arial"), [$, y] = V(null), [M, ce] = V(!1), { appearance: W } = Qt(), Q = n ?? i.signature.defaultSignature, L = u;
  oe(() => {
    E.current = H;
  }, [H]);
  const Y = (b) => {
    t(b);
  }, le = async (b) => {
    const P = g.find((U) => U.value === b);
    P && P.external && await wc(P), ee(b);
  }, de = B({ fontFamily: q, signatureTypeDefault: h, loadFont: le });
  de.current = { fontFamily: q, signatureTypeDefault: h, loadFont: le };
  const be = () => {
    if (!_.trim()) return null;
    const b = document.createElement("canvas");
    b.width = l / 1.1, b.height = d;
    const P = b.getContext("2d");
    if (!P) return null;
    const U = 20;
    P.clearRect(0, 0, b.width, b.height), P.font = `${Gt}px "${q}", cursive, sans-serif`;
    const ae = P.measureText(_).width, ue = ae + U * 2 > b.width ? (b.width - U * 2) / ae : 1;
    return P.font = `${Gt * ue}px "${q}", cursive, sans-serif`, P.textAlign = "center", P.textBaseline = "middle", P.imageSmoothingEnabled = !0, P.shadowColor = "rgba(0, 0, 0, 0.1)", P.shadowBlur = 2, P.shadowOffsetX = 1, P.shadowOffsetY = 1, P.fillStyle = H, P.fillText(_, b.width / 2, b.height / 2), b.toDataURL("image/png");
  }, Pe = () => {
    if (T === "Upload") {
      $ && (R((b) => [...b, $]), Y($), N(!1));
      return;
    }
    if (T === "Enter") {
      const b = be();
      b && (R((P) => [...P, b]), Y(b), N(!1));
      return;
    }
    if (T === "Draw") {
      const b = C.current?.toDataURL();
      b && (R((P) => [...P, b]), Y(b), N(!1));
      return;
    }
  }, we = () => {
    const b = C.current;
    b && (b.clear(), b.getLayers().forEach((P) => P.destroyChildren()), j(!0)), X(""), y(null);
  }, He = () => {
    if (!v.current) return;
    const b = new I.Stage({
      container: v.current,
      width: l,
      height: d
    }), P = new I.Layer();
    b.add(P), C.current = b;
    let U = !1, ae = null;
    const ue = () => {
      U = !0;
      const Fe = b.getPointerPosition();
      Fe && (ae = new I.Line({
        stroke: E.current,
        strokeWidth: 3,
        globalCompositeOperation: "source-over",
        lineCap: "round",
        lineJoin: "round",
        points: [Fe.x, Fe.y]
      }), P.add(ae));
    }, he = (Fe) => {
      if (!U || !ae) return;
      Fe.evt.preventDefault();
      const qe = b.getPointerPosition();
      if (!qe) return;
      const tt = ae.points().concat([qe.x, qe.y]);
      ae.points(tt), j(!1);
    }, $e = () => {
      U = !1, ae = null;
    };
    b.on("mousedown touchstart", ue), b.on("mouseup touchend", $e), b.on("mousemove touchmove", he);
  }, ze = (b) => {
    z(b), (C.current?.getLayers()[0].getChildren((U) => U.getClassName() === "Line") || []).forEach((U) => U.stroke(b));
  }, A = (b) => {
    const P = b.target, U = P.files;
    if (!U?.length) return;
    const ae = U[0];
    if (ae.size > L) {
      ce(!0), setTimeout(() => ce(!1), 3e3), P && (P.value = "");
      return;
    }
    const ue = new FileReader();
    ue.onload = async (he) => {
      const $e = he.target?.result, Fe = new Image();
      Fe.src = $e, Fe.onload = () => {
        const qe = p, tt = p;
        let { width: Ve, height: _e } = Fe;
        Ve > _e && Ve > qe ? (_e = Math.round(_e * qe / Ve), Ve = qe) : _e > tt && (Ve = Math.round(Ve * tt / _e), _e = tt);
        const Oe = document.createElement("canvas"), lt = Oe.getContext("2d");
        if (Oe.width = Ve, Oe.height = _e, lt) {
          lt.drawImage(Fe, 0, 0, Ve, _e);
          const yt = Oe.toDataURL("image/png");
          P.value = "", y(yt), j(!1);
        }
      };
    }, ue.readAsDataURL(ae);
  };
  return oe(() => {
    X(""), y(null), (T === "Enter" || T === "Draw" || T === "Upload") && j(!0);
  }, [T]), oe(() => {
    j(_.trim().length === 0);
  }, [_]), oe(() => {
    if (x) {
      const b = de.current;
      b.loadFont(b.fontFamily), X(""), y(null), D(b.signatureTypeDefault);
    }
  }, [x]), oe(() => {
    x && T === "Draw" ? setTimeout(() => {
      He();
    }, 300) : (C.current?.destroy(), C.current = null);
  }, [T, x]), /* @__PURE__ */ w(Se, { children: [
    /* @__PURE__ */ w(Te.Root, { children: [
      /* @__PURE__ */ c(Te.Trigger, { children: /* @__PURE__ */ c(
        St,
        {
          disabled: e,
          title: m(`annotator:tool.${o.name}`),
          label: r === "menu-item" ? s : void 0,
          buttonProps: r === "menu-item" ? { variant: "ghost", size: "2", style: { width: "100%", justifyContent: "flex-start", gap: 8 } } : void 0,
          icon: o.icon
        }
      ) }),
      /* @__PURE__ */ c(Te.Content, { size: "1", style: { width: 180 }, onCloseAutoFocus: (b) => b.preventDefault(), children: /* @__PURE__ */ w("div", { className: Je.SignaturePop, children: [
        /* @__PURE__ */ w("ul", { className: Je.container, children: [
          Q.map((b, P) => /* @__PURE__ */ c(Te.Close, { children: /* @__PURE__ */ c("li", { onClick: () => Y(b), children: /* @__PURE__ */ c("img", { src: b }) }, P) }, P)),
          G.map((b, P) => /* @__PURE__ */ c(Te.Close, { children: /* @__PURE__ */ c("li", { onClick: () => Y(b), children: /* @__PURE__ */ c("img", { src: b }) }, P) }, P))
        ] }),
        /* @__PURE__ */ c(Te.Close, { children: /* @__PURE__ */ w(me, { style: { width: "100%" }, variant: "soft", onClick: () => {
          N(!0);
        }, children: [
          /* @__PURE__ */ c(po, {}),
          " ",
          m("annotator:common.createSignature")
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ c(rt.Root, { open: x, onOpenChange: N, children: /* @__PURE__ */ w(rt.Content, { style: { width: "550px" }, children: [
      /* @__PURE__ */ c(rt.Title, { children: m("annotator:common.createSignature") }),
      /* @__PURE__ */ c(K, { as: "span", justify: "center", mb: "4", children: /* @__PURE__ */ w(ut.Root, { size: "3", defaultValue: h, onValueChange: (b) => D(b), radius: "full", children: [
        /* @__PURE__ */ c(ut.Item, { value: "Enter", children: m("enter") }),
        /* @__PURE__ */ c(ut.Item, { value: "Draw", children: m("draw") }),
        /* @__PURE__ */ c(ut.Item, { value: "Upload", children: m("annotator:editor.signature.upload") })
      ] }) }),
      /* @__PURE__ */ w("div", { className: Je.SignatureTool, children: [
        /* @__PURE__ */ w("div", { className: Je.container, style: { width: l }, children: [
          T === "Enter" && /* @__PURE__ */ c(
            "input",
            {
              autoFocus: !0,
              type: "text",
              value: _,
              onChange: (b) => X(b.target.value),
              placeholder: m("annotator:editor.signature.area"),
              style: {
                height: d - 2,
                width: l / 1.1,
                color: H,
                fontFamily: `${q}`,
                fontSize: Gt,
                lineHeight: `${Gt}px`
              }
            }
          ),
          T === "Draw" && /* @__PURE__ */ w(Se, { children: [
            /* @__PURE__ */ c("div", { className: Je.info, children: m("annotator:editor.signature.area") }),
            /* @__PURE__ */ c(
              "div",
              {
                ref: v,
                style: {
                  height: d,
                  width: l
                }
              }
            )
          ] }),
          T === "Upload" && /* @__PURE__ */ c("div", { style: {
            height: d,
            width: l
          }, children: $ ? /* @__PURE__ */ c("div", { className: Je.imagePreview, style: {
            height: d,
            width: l
          }, children: /* @__PURE__ */ c("img", { src: $, alt: "preview" }) }) : /* @__PURE__ */ w("div", { style: {
            height: d,
            width: l
          }, children: [
            /* @__PURE__ */ c("input", { style: { display: "none" }, type: "file", ref: S, accept: f, onChange: A }),
            /* @__PURE__ */ w(K, { height: `${d}px`, direction: "column", gap: "3", justify: "center", align: "center", children: [
              /* @__PURE__ */ w(me, { size: "3", onClick: () => {
                S.current?.click();
              }, children: [
                /* @__PURE__ */ c(fo, {}),
                " ",
                m("annotator:editor.signature.choose")
              ] }),
              /* @__PURE__ */ c(se, { color: "gray", size: "2", style: { textAlign: "center" }, children: m("annotator:editor.signature.uploadHint", { format: f, maxSize: yn(u) }) }),
              M && /* @__PURE__ */ c(at.Root, { color: "red", mt: "3", children: /* @__PURE__ */ c(at.Text, { children: m("fileSizeLimit", { value: yn(L) }) }) })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ c("div", { className: `${Je.toolbar} ${W === "dark" ? Je.toolbarDark : ""}`, style: { width: l }, children: /* @__PURE__ */ w(K, { justify: "between", align: "center", gap: "2", children: [
          /* @__PURE__ */ w("div", { className: Je.colorPalette, children: [
            T !== "Upload" && /* @__PURE__ */ c(Se, { children: a.map((b) => /* @__PURE__ */ c("div", { onClick: () => ze(b), className: `${Je.cell} ${b === H ? Je.active : ""}`, children: /* @__PURE__ */ c("span", { style: { backgroundColor: b } }) }, b)) }),
            T === "Enter" && /* @__PURE__ */ c(Se, { children: /* @__PURE__ */ w(Ee.Root, { onValueChange: async (b) => {
              await le(b);
            }, defaultValue: q, size: "1", children: [
              /* @__PURE__ */ c(Ee.Trigger, {}),
              /* @__PURE__ */ c(Ee.Content, { children: g.map((b) => /* @__PURE__ */ c(Ee.Item, { value: b.value, children: b.label }, b.value)) })
            ] }) })
          ] }),
          /* @__PURE__ */ c(me, { variant: "ghost", mr: "3", onClick: we, children: m("clear") })
        ] }) }),
        /* @__PURE__ */ w(K, { gap: "3", mt: "4", justify: "end", children: [
          /* @__PURE__ */ c(rt.Close, { children: /* @__PURE__ */ c(me, { style: { width: 100 }, variant: "soft", color: "gray", children: m("cancel") }) }),
          /* @__PURE__ */ c(rt.Close, { children: /* @__PURE__ */ c(me, { disabled: F, style: { width: 100 }, onClick: Pe, children: m("ok") }) })
        ] })
      ] })
    ] }) })
  ] });
}, Tc = "_StampPop_1pr7b_1", Ac = "_container_1pr7b_4", xc = "_StampTool_1pr7b_38", Ec = "_imagePreview_1pr7b_45", kc = "_imagePreviewDark_1pr7b_54", Rc = "_formItem_1pr7b_58", Ge = {
  StampPop: Tc,
  container: Ac,
  StampTool: xc,
  imagePreview: Ec,
  imagePreviewDark: kc,
  formItem: Rc
};
yo.extend(Kr);
const no = "StampGroup", Ut = 470, Rt = 120, Pc = [
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
], Nc = ({ annotation: o, disabled: e = !1, default_stamps: t, onAdd: n, presentation: r = "toolbar-icon", label: s }) => {
  const { defaultOptions: i } = _t(), a = i.stamp.maxSize, l = i.stamp.accept, d = 600, h = i.stamp.editor.defaultFont, u = i.stamp.editor.defaultTextColor, f = i.stamp.editor.defaultBorderStyle, p = i.stamp.editor.defaultBackgroundColor, g = i.stamp.editor.defaultBorderColor, m = i.colors, { t: v } = ge(["common", "annotator"]), C = B(null), E = B(null), S = B(null), { user: x } = wo(), [N, H] = V([]), { appearance: z } = Qt(), F = t ?? i.stamp.defaultStamp, [j, G] = V(!1), [R, T] = V(F.length === 0 ? "custom" : "default"), [D, _] = V({
    stampText: v("annotator:editor.stamp.defaultText"),
    fontStyle: [],
    fontFamily: h[0].value,
    textColor: u,
    backgroundColor: p,
    borderColor: g,
    borderStyle: f,
    timestamp: ["username", "date"],
    customTimestampText: "",
    dateFormat: "YYYY-MM-DD"
  });
  it(() => {
    _((L) => ({
      ...L,
      stampText: v("annotator:editor.stamp.defaultText")
    }));
  }, [v]);
  const [X, q] = V(null), ee = (L) => {
    n(L);
  }, $ = () => {
    const L = E.current?.getLayers()[0];
    if (!L) return;
    const Y = L.getChildren((de) => de.name() === no)[0];
    if (!Y) return;
    const le = E.current?.toDataURL({
      x: Y.x(),
      y: Y.y(),
      width: Y.width(),
      height: Y.height()
    });
    le && (H((de) => [...de, le]), ee(le), G(!1));
  }, y = (L) => {
    const Y = L.target, le = Y.files;
    if (!le?.length) return;
    const de = le[0];
    if (de.size > a) {
      alert(v("fileSizeLimit", { value: yn(a) })), Y && (Y.value = "");
      return;
    }
    const be = new FileReader();
    be.onload = async (Pe) => {
      const we = Pe.target?.result, He = new Image();
      He.src = we, He.onload = () => {
        const ze = d, A = d;
        let { width: b, height: P } = He;
        b > P && b > ze ? (P = Math.round(P * ze / b), b = ze) : P > A && (b = Math.round(b * A / P), P = A);
        const U = document.createElement("canvas"), ae = U.getContext("2d");
        if (U.width = b, U.height = P, ae) {
          ae.drawImage(He, 0, 0, b, P);
          const ue = U.toDataURL("image/png");
          Y.value = "", H((he) => [...he, ue]);
        }
      };
    }, be.readAsDataURL(de);
  }, M = (L, Y) => {
    const le = {
      ...D,
      [L]: Y
    };
    _(le), q(le), ce(le);
  }, ce = (L) => {
    if (!C.current) return;
    const { stampText: Y, fontStyle: le, textColor: de, backgroundColor: be, borderColor: Pe, borderStyle: we, timestamp: He, dateFormat: ze, fontFamily: A } = L;
    E.current?.destroy();
    const b = new I.Stage({
      container: C.current,
      width: Ut,
      height: Rt
    }), P = new I.Layer(), U = [];
    le.includes("italic") && U.push("italic"), le.includes("bold") && U.push("bold");
    const ae = U.join(" ") || "normal", ue = le.includes("underline"), he = le.includes("strikeout"), $e = yo(), Fe = x?.name, qe = ze ? $e.format(ze) : "", tt = L.customTimestampText?.trim(), _e = [
      He.includes("username") ? Fe : null,
      He.includes("date") ? qe : null,
      tt || null
    ].filter(Boolean).join(" · ");
    let Oe = 30;
    const lt = 16, yt = 10, tn = new I.Text({
      text: Y,
      fontSize: Oe,
      fontStyle: ae,
      fontFamily: A
    }), nn = new I.Text({
      text: _e,
      fontSize: lt,
      fontFamily: A
    }), ye = Math.max(tn.width(), nn.width()) + 60, ft = Oe + yt + lt + 25, xt = Math.max(ye, 180), gt = Math.max(ft, 60), We = new I.Rect({
      name: no,
      width: xt,
      height: gt,
      x: (Ut - xt) / 2,
      y: (Rt - gt) / 2,
      fill: be,
      strokeWidth: we === "none" ? 0 : 5,
      stroke: Pe,
      dash: we === "dashed" ? [5, 5] : void 0,
      cornerRadius: 10
    });
    P.add(We), _e || (Oe = Oe * 1.2);
    let Ot;
    _e ? Ot = (Rt - gt) / 2 + 15 : Ot = (Rt - gt) / 2 + gt / 2 - Oe / 2;
    const on = new I.Text({
      text: Y,
      x: 0,
      y: Ot,
      width: Ut,
      align: "center",
      fontSize: Oe,
      fontStyle: ae,
      fontFamily: A,
      fill: de
    });
    if (P.add(on), ue) {
      const Et = on.y() + Oe + 4, rn = new I.Line({
        points: [We.x(), Et, We.x() + We.width(), Et],
        stroke: de,
        strokeWidth: 2
      });
      P.add(rn);
    }
    if (he) {
      const Et = on.y() + Oe / 2, rn = new I.Line({
        points: [We.x(), Et, We.x() + We.width(), Et],
        stroke: de,
        strokeWidth: 2
      });
      P.add(rn);
    }
    const tr = new I.Text({
      text: _e,
      x: 0,
      y: Ot + Oe + yt,
      width: Ut,
      align: "center",
      fontSize: lt,
      fontFamily: A,
      fill: de
    });
    _e && P.add(tr), b.add(P), E.current = b;
  }, W = B(D);
  W.current = X ?? D;
  const Q = B(ce);
  return Q.current = ce, it(() => {
    if (j) {
      const Y = requestAnimationFrame(() => {
        C.current && Q.current(W.current);
      });
      return () => cancelAnimationFrame(Y);
    }
    const L = E.current;
    L && (L.destroy(), E.current = null);
  }, [j]), /* @__PURE__ */ w(Se, { children: [
    /* @__PURE__ */ w(Te.Root, { children: [
      /* @__PURE__ */ c(Te.Trigger, { children: /* @__PURE__ */ c(
        St,
        {
          disabled: e,
          title: v(`annotator:tool.${o.name}`),
          label: r === "menu-item" ? s : void 0,
          buttonProps: r === "menu-item" ? { variant: "ghost", size: "2", style: { width: "100%", justifyContent: "flex-start", gap: 8 } } : void 0,
          icon: o.icon
        }
      ) }),
      /* @__PURE__ */ c(
        Te.Content,
        {
          size: "1",
          onCloseAutoFocus: (L) => {
            L.preventDefault(), T(F.length === 0 ? "custom" : "default");
          },
          children: /* @__PURE__ */ w("div", { className: Ge.StampPop, children: [
            /* @__PURE__ */ c(K, { align: "center", justify: "center", mb: "4", children: /* @__PURE__ */ c(
              ut.Root,
              {
                radius: "full",
                defaultValue: F.length === 0 ? "custom" : "default",
                onValueChange: (L) => T(L),
                children: F.length === 0 ? /* @__PURE__ */ w(Se, { children: [
                  /* @__PURE__ */ c(ut.Item, { value: "custom", children: v("custom") }),
                  /* @__PURE__ */ c(ut.Item, { value: "default", children: v("default") })
                ] }) : /* @__PURE__ */ w(Se, { children: [
                  /* @__PURE__ */ c(ut.Item, { value: "default", children: v("default") }),
                  /* @__PURE__ */ c(ut.Item, { value: "custom", children: v("custom") })
                ] })
              }
            ) }),
            R === "default" && /* @__PURE__ */ w(Se, { children: [
              F.length === 0 && /* @__PURE__ */ c(K, { align: "center", justify: "center", gap: "2", children: /* @__PURE__ */ w(at.Root, { variant: "soft", color: "gray", size: "1", style: { width: "100%" }, children: [
                /* @__PURE__ */ c(at.Icon, { children: /* @__PURE__ */ c(Ar, {}) }),
                /* @__PURE__ */ c(at.Text, { children: v("annotator:editor.stamp.defaultStampNotSet") })
              ] }) }),
              /* @__PURE__ */ c("ul", { className: Ge.container, children: F.map((L, Y) => /* @__PURE__ */ c(Te.Close, { children: /* @__PURE__ */ c("li", { onClick: () => ee(L), children: /* @__PURE__ */ c("img", { src: L }) }, Y) }, Y)) })
            ] }),
            /* @__PURE__ */ c("div", { children: R === "custom" && /* @__PURE__ */ w(Se, { children: [
              /* @__PURE__ */ c("ul", { className: Ge.container, children: N.map((L, Y) => /* @__PURE__ */ c(Te.Close, { children: /* @__PURE__ */ c("li", { onClick: () => ee(L), children: /* @__PURE__ */ c("img", { src: L }) }, Y) }, Y)) }),
              /* @__PURE__ */ c(K, { gap: "4", p: "1", children: /* @__PURE__ */ c(Te.Close, { children: /* @__PURE__ */ w(
                me,
                {
                  variant: "soft",
                  style: { width: "100%" },
                  onClick: () => {
                    G(!0);
                  },
                  children: [
                    /* @__PURE__ */ c(po, {}),
                    " ",
                    v("annotator:common.createStamp")
                  ]
                }
              ) }) }),
              /* @__PURE__ */ c(Qe, { my: "3", size: "4" }),
              /* @__PURE__ */ c("input", { style: { display: "none" }, type: "file", ref: S, accept: l, onChange: y }),
              /* @__PURE__ */ c(K, { gap: "2", justify: "end", children: /* @__PURE__ */ w(
                me,
                {
                  variant: "ghost",
                  mr: "3",
                  onClick: () => {
                    S.current?.click();
                  },
                  children: [
                    /* @__PURE__ */ c(fo, {}),
                    v("annotator:editor.stamp.upload")
                  ]
                }
              ) })
            ] }) })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ c(rt.Root, { open: j, onOpenChange: G, children: /* @__PURE__ */ w(rt.Content, { style: { width: "550px" }, children: [
      /* @__PURE__ */ c(rt.Title, { children: v("annotator:common.createStamp") }),
      /* @__PURE__ */ w("div", { className: Ge.StampTool, children: [
        /* @__PURE__ */ w("div", { className: Ge.container, children: [
          /* @__PURE__ */ c(
            "div",
            {
              className: `${Ge.imagePreview} ${z === "dark" ? Ge.imagePreviewDark : ""}`,
              ref: C,
              style: {
                height: Rt
              }
            }
          ),
          /* @__PURE__ */ w(Ft, { align: "center", columns: "22", gap: "5", mt: "3", children: [
            /* @__PURE__ */ c(K, { direction: "column", gridColumn: "span 22", children: /* @__PURE__ */ w(se, { as: "label", size: "2", children: [
              v("annotator:editor.stamp.stampText"),
              /* @__PURE__ */ c(Tt.Root, { value: D.stampText, onChange: (L) => M("stampText", L.target.value) })
            ] }) }),
            /* @__PURE__ */ w(K, { direction: "column", gridColumn: "span 9", children: [
              /* @__PURE__ */ c(se, { size: "2", children: v("annotator:editor.stamp.textColor") }),
              /* @__PURE__ */ c("div", { className: Ge.formItem, children: /* @__PURE__ */ c(
                Mt,
                {
                  transparent: !0,
                  value: D.textColor,
                  onChange: (L) => M("textColor", L),
                  presets: m,
                  popover: !0
                }
              ) })
            ] }),
            /* @__PURE__ */ w(K, { direction: "column", gridColumn: "span 8", children: [
              /* @__PURE__ */ c(se, { size: "2", children: v("annotator:editor.stamp.backgroundColor") }),
              /* @__PURE__ */ c("div", { className: Ge.formItem, children: /* @__PURE__ */ c(
                Mt,
                {
                  value: D.backgroundColor,
                  onChange: (L) => M("backgroundColor", L),
                  presets: m,
                  popover: !0,
                  transparent: !0
                }
              ) })
            ] }),
            /* @__PURE__ */ w(K, { direction: "column", gridColumn: "span 5", children: [
              /* @__PURE__ */ c(se, { size: "2", children: v("annotator:editor.stamp.borderColor") }),
              /* @__PURE__ */ c("div", { className: Ge.formItem, children: /* @__PURE__ */ c(
                Mt,
                {
                  value: D.borderColor,
                  onChange: (L) => M("borderColor", L),
                  presets: m,
                  transparent: !0,
                  popover: !0
                }
              ) })
            ] }),
            /* @__PURE__ */ w(K, { direction: "column", gridColumn: "span 9", children: [
              /* @__PURE__ */ c(se, { size: "2", children: v("annotator:editor.stamp.fontStyle") }),
              /* @__PURE__ */ c("div", { className: Ge.formItem, children: /* @__PURE__ */ c(
                mt.Root,
                {
                  value: D.fontStyle,
                  onValueChange: (L) => M("fontStyle", L),
                  children: /* @__PURE__ */ w(K, { direction: "row", gap: "2", children: [
                    /* @__PURE__ */ c(mt.Item, { value: "bold", children: /* @__PURE__ */ c(xr, {}) }),
                    /* @__PURE__ */ c(mt.Item, { value: "italic", children: /* @__PURE__ */ c(Er, {}) }),
                    /* @__PURE__ */ c(mt.Item, { value: "underline", children: /* @__PURE__ */ c(kr, {}) }),
                    /* @__PURE__ */ c(mt.Item, { value: "strikeout", children: /* @__PURE__ */ c(Rr, {}) })
                  ] })
                }
              ) })
            ] }),
            /* @__PURE__ */ w(K, { direction: "column", gridColumn: "span 8", children: [
              /* @__PURE__ */ c(se, { size: "2", children: v("annotator:editor.stamp.fontFamily") }),
              /* @__PURE__ */ c("div", { className: Ge.formItem, children: /* @__PURE__ */ w(Ee.Root, { value: D.fontFamily, onValueChange: (L) => M("fontFamily", L), children: [
                /* @__PURE__ */ c(Ee.Trigger, {}),
                /* @__PURE__ */ c(Ee.Content, { children: h.map((L) => /* @__PURE__ */ c(Ee.Item, { value: L.value, children: L.label }, L.value)) })
              ] }) })
            ] }),
            /* @__PURE__ */ w(K, { direction: "column", gridColumn: "span 5", children: [
              /* @__PURE__ */ c(se, { size: "2", children: v("annotator:editor.stamp.borderStyle") }),
              /* @__PURE__ */ c("div", { className: Ge.formItem, children: /* @__PURE__ */ w(
                Ee.Root,
                {
                  value: D.borderStyle,
                  onValueChange: (L) => M("borderStyle", L),
                  children: [
                    /* @__PURE__ */ c(Ee.Trigger, {}),
                    /* @__PURE__ */ w(Ee.Content, { children: [
                      /* @__PURE__ */ c(Ee.Item, { value: "none", children: v("annotator:editor.stamp.none") }),
                      /* @__PURE__ */ c(Ee.Item, { value: "solid", children: v("annotator:editor.stamp.solid") }),
                      /* @__PURE__ */ c(Ee.Item, { value: "dashed", children: v("annotator:editor.stamp.dashed") })
                    ] })
                  ]
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ c(Qe, { my: "3", size: "4" }),
          /* @__PURE__ */ w(Ft, { align: "center", columns: "2", gap: "3", children: [
            /* @__PURE__ */ w(K, { direction: "column", children: [
              /* @__PURE__ */ c(se, { size: "2", children: v("annotator:editor.stamp.timestampText") }),
              /* @__PURE__ */ c("div", { className: Ge.formItem, children: /* @__PURE__ */ c(
                mt.Root,
                {
                  value: D.timestamp,
                  onValueChange: (L) => M("timestamp", L),
                  children: /* @__PURE__ */ w(K, { direction: "row", gap: "2", children: [
                    /* @__PURE__ */ c(mt.Item, { value: "username", children: v("annotator:editor.stamp.username") }),
                    /* @__PURE__ */ c(mt.Item, { value: "date", children: v("annotator:editor.stamp.date") })
                  ] })
                }
              ) })
            ] }),
            /* @__PURE__ */ w(K, { direction: "column", children: [
              /* @__PURE__ */ c(se, { size: "2", children: v("annotator:editor.stamp.dateFormat") }),
              /* @__PURE__ */ c("div", { className: Ge.formItem, children: /* @__PURE__ */ w(Ee.Root, { value: D.dateFormat, onValueChange: (L) => M("dateFormat", L), children: [
                /* @__PURE__ */ c(Ee.Trigger, {}),
                /* @__PURE__ */ c(Ee.Content, { children: Pc?.map((L) => /* @__PURE__ */ w(Ee.Group, { children: [
                  /* @__PURE__ */ c(Ee.Label, { children: L.label }),
                  L.options.map((Y) => /* @__PURE__ */ c(Ee.Item, { value: Y.value, children: Y.label }, Y.value))
                ] }, L.label)) })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ c(Ft, { align: "center", columns: "1", gap: "3", mt: "3", children: /* @__PURE__ */ w(se, { as: "label", size: "2", children: [
            v("annotator:editor.stamp.customTimestamp"),
            /* @__PURE__ */ c(
              Tt.Root,
              {
                value: D.customTimestampText,
                onChange: (L) => M("customTimestampText", L.target.value)
              }
            )
          ] }) }),
          /* @__PURE__ */ w(K, { gap: "3", mt: "4", justify: "end", children: [
            /* @__PURE__ */ c(rt.Close, { children: /* @__PURE__ */ c(me, { style: { width: 100 }, variant: "soft", color: "gray", children: v("cancel") }) }),
            /* @__PURE__ */ c(rt.Close, { children: /* @__PURE__ */ c(me, { style: { width: 100 }, onClick: $, children: v("ok") }) })
          ] })
        ] }),
        /* @__PURE__ */ c("div", { className: "StampTool-Toolbar" })
      ] })
    ] }) })
  ] });
}, Vo = {
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
function Ic(o) {
  const e = Me.find((t) => t.type === Vo[o]);
  if (!e) throw new Error(`UNKNOWN_ANNOTATION_TOOL:${o}`);
  return e;
}
function Mc(o) {
  return o === void 0 ? null : Object.entries(Vo).find(([, t]) => t === o)?.[0] ?? null;
}
function Mn(o) {
  return o !== "menu-item" ? {} : {
    variant: "ghost",
    size: "2",
    style: { width: "100%", justifyContent: "flex-start", gap: 8 }
  };
}
const An = ({
  tool: o,
  presentation: e = "toolbar-icon",
  label: t,
  default_signatures: n,
  default_stamps: r
}) => {
  const { t: s } = ge(["annotator"], { useSuspense: !1 }), { painter: i } = et(), a = ie((m) => m.currentAnnotationType), l = ie((m) => m.setCurrentAnnotationType), d = Ae(() => Ic(o), [o]), h = i?.can("annotation.create") ?? !1, u = a?.type === d.type, f = t ?? s(`annotator:tool.${d.name}`), p = Mn(e), g = J((m = null) => {
    const v = u ? null : d;
    l(v), i?.activate(v, v && [k.SIGNATURE, k.STAMP].includes(v.type) ? m : null);
  }, [d, i, u, l]);
  return o === "signature" ? /* @__PURE__ */ c(
    Cc,
    {
      annotation: d,
      disabled: !h,
      presentation: e,
      label: f,
      default_signatures: n,
      onAdd: (m) => g(m)
    }
  ) : o === "stamp" ? /* @__PURE__ */ c(
    Nc,
    {
      annotation: d,
      disabled: !h,
      presentation: e,
      label: f,
      default_stamps: r,
      onAdd: (m) => g(m)
    }
  ) : /* @__PURE__ */ c(
    St,
    {
      disabled: o !== "select" && !h,
      selected: u,
      title: String(f),
      label: e === "menu-item" ? f : void 0,
      icon: d.icon,
      buttonProps: p,
      onClick: () => g()
    }
  );
}, Yo = ({ presentation: o = "toolbar-icon" }) => {
  const { defaultOptions: e } = _t(), { painter: t } = et(), n = ie((l) => l.currentAnnotationType), r = ie((l) => l.setCurrentAnnotationType), s = !n?.styleEditable?.color, i = Mn(o), a = (l) => {
    if (!n) return;
    const d = {
      ...n,
      style: { ...n.style, color: l }
    };
    r(d), t?.activate(d, null);
  };
  return /* @__PURE__ */ c(
    Mt,
    {
      value: n?.style?.color || e.colors[0],
      onChange: a,
      presets: e.colors,
      popover: !0,
      trigger: /* @__PURE__ */ c(
        St,
        {
          disabled: s || !t?.can("annotation.create"),
          title: "Color",
          label: o === "menu-item" ? "Color" : void 0,
          buttonProps: i,
          icon: /* @__PURE__ */ c(
            ns,
            {
              style: { "--palette-preview-color": n?.style?.color }
            }
          )
        }
      )
    }
  );
}, Ko = ({ presentation: o = "toolbar-icon" }) => {
  const { t: e } = ge(["annotator"], { useSuspense: !1 }), { painter: t } = et(), [n, r] = V(!1), s = Mn(o);
  return it(() => {
    r(t?.areAnnotationAuthorLabelsVisible() ?? !1);
  }, [t]), /* @__PURE__ */ c(
    St,
    {
      disabled: !t,
      selected: n,
      title: n ? e("annotator:authorLabels.hide") : e("annotator:authorLabels.show", { shortcut: "Alt" }),
      label: o === "menu-item" ? "作者标签" : void 0,
      buttonProps: s,
      icon: /* @__PURE__ */ c(os, {}),
      onClick: () => {
        if (!t) return;
        const i = !t.areAnnotationAuthorLabelsVisible();
        t.setAnnotationAuthorLabelsVisible(i), r(i);
      }
    }
  );
}, Dc = ({ defaultAnnotationName: o = "", stamps: e, signatures: t }) => {
  const n = o ? Me.find((i) => i.name === o) ?? null : null, { painter: r } = et(), s = ie((i) => i.setCurrentAnnotationType);
  return Dt.useEffect(() => {
    if (n)
      return s(n), r?.activate(n, null), () => {
        s(null), r?.activate(null, null);
      };
  }, [n, r, s]), /* @__PURE__ */ w(K, { gap: "3", align: "center", children: [
    /* @__PURE__ */ c(Kt, {}),
    /* @__PURE__ */ c(Qe, { orientation: "vertical" }),
    /* @__PURE__ */ c(An, { tool: "select" }),
    Me.filter((i) => i.webSelectionDependencies === !1 && i.type !== k.SELECT).map((i) => /* @__PURE__ */ c(
      An,
      {
        tool: i.name,
        default_stamps: i.type === k.STAMP ? e : void 0,
        default_signatures: i.type === k.SIGNATURE ? t : void 0
      },
      i.name
    )),
    /* @__PURE__ */ c(Qe, { orientation: "vertical" }),
    /* @__PURE__ */ c(Yo, {}),
    /* @__PURE__ */ c(Qe, { orientation: "vertical" }),
    /* @__PURE__ */ c(Ko, {})
  ] });
}, Lc = ({ defaultAnnotationName: o, stamps: e, signatures: t }) => /* @__PURE__ */ c(
  Dc,
  {
    defaultAnnotationName: o,
    stamps: e,
    signatures: t
  }
), _c = {
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
}, Oc = ({ children: o }) => {
  const [e, t] = V(null), [n, r] = V(0), s = J(() => r((a) => a + 1), []), i = Ae(
    () => ({ painter: e, setPainter: t, refreshPainter: s, revision: n }),
    [e, s, n]
  );
  return /* @__PURE__ */ c(Fo.Provider, { value: i, children: o });
}, Hc = "_filter_xc5y0_1", Gc = "_sidebar_xc5y0_19", Uc = "_list_xc5y0_19", zc = "_group_xc5y0_23", Fc = "_comment_xc5y0_26", jc = "_title_xc5y0_39", Wc = "_annotationHeader_xc5y0_52", Bc = "_annotationHeading_xc5y0_56", $c = "_annotationHeadingActive_xc5y0_60", Vc = "_annotationMeta_xc5y0_63", Yc = "_annotationAuthor_xc5y0_68", Kc = "_annotationDateTime_xc5y0_74", Xc = "_toolButton_xc5y0_78", qc = "_reply_xc5y0_81", Jc = "_replyMeta_xc5y0_91", Zc = "_selected_xc5y0_100", Qc = "_annotationTypeIcon_xc5y0_111", el = "_commentEditor_xc5y0_122", tl = "_replyEditor_xc5y0_127", pe = {
  filter: Hc,
  sidebar: Gc,
  list: Uc,
  group: zc,
  comment: Fc,
  title: jc,
  annotationHeader: Wc,
  annotationHeading: Bc,
  annotationHeadingActive: $c,
  annotationMeta: Vc,
  annotationAuthor: Yc,
  annotationDateTime: Kc,
  toolButton: Xc,
  reply: qc,
  replyMeta: Jc,
  selected: Zc,
  annotationTypeIcon: Qc,
  commentEditor: el,
  replyEditor: tl
}, nl = /^#([1-9]\d*)$/;
function ol(o) {
  if (!o || typeof o != "object") return !1;
  const e = o;
  if (e.type !== "annotation" || typeof e.annotationId != "string" || e.annotationId.length === 0 || typeof e.label != "string")
    return !1;
  const t = nl.exec(e.label);
  return !!(t && Number.isSafeInteger(Number(t[1])));
}
function rl(o, e) {
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
function qt(o, e) {
  if (!e?.length) return;
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  e.forEach((i) => {
    if (!ol(i) || r.has(i.label)) return;
    const a = rl(o, i.label);
    if (a === -1) return;
    const l = n.get(i.label);
    if (l && l !== i.annotationId) {
      r.add(i.label), n.delete(i.label), Array.from(t.entries()).forEach(([h, u]) => {
        u.reference.label === i.label && t.delete(h);
      });
      return;
    }
    n.set(i.label, i.annotationId);
    const d = `${i.annotationId}\0${i.label}`;
    t.has(d) || t.set(d, { reference: i, index: a });
  });
  const s = Array.from(t.values()).sort((i, a) => i.index - a.index).map(({ reference: i }) => ({ ...i }));
  return s.length > 0 ? s : void 0;
}
function xn(o, e, t) {
  const n = qt(o, e);
  if (!n) return { content: o };
  const r = new Map(
    t.map((u) => [u.id, u])
  ), s = /* @__PURE__ */ new Map(), i = n.map((u) => {
    const f = r.get(u.annotationId)?.referenceNumber;
    if (f === void 0) return u;
    const p = `#${f}`;
    return s.set(u.label, p), p === u.label ? u : { ...u, label: p };
  }), a = Array.from(s.entries()).filter(([u, f]) => u !== f);
  if (a.length === 0)
    return { content: o, references: n };
  const l = a.map(([u]) => u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).sort((u, f) => f.length - u.length), d = new RegExp(`(?:${l.join("|")})(?!\\d)`, "g"), h = o.replace(
    d,
    (u) => s.get(u) ?? u
  );
  return {
    content: h,
    references: qt(
      h,
      i
    )
  };
}
const il = 20, sl = /^[\p{L}\p{N}_-]*$/u, al = /[\s([{'",.!?;:“‘，。！？、：；]/;
function cl(o, e) {
  const t = o.slice(0, e), n = t.lastIndexOf("#");
  if (n === -1) return null;
  const r = o[n - 1];
  if (r && !al.test(r)) return null;
  const s = t.slice(n + 1);
  return sl.test(s) ? {
    start: n,
    end: e,
    query: s
  } : null;
}
function ll(o, e, t) {
  const n = e.trim().toLocaleLowerCase();
  return o.filter((r) => r.id === t || r.referenceNumber === void 0 ? !1 : n ? [
    r.referenceNumber,
    `#${r.referenceNumber}`,
    r.title,
    r.pageNumber,
    r.subtype,
    r.contentsObj?.text
  ].filter((i) => i != null).join(" ").toLocaleLowerCase().includes(n) : !0).sort((r, s) => r.referenceNumber - s.referenceNumber).slice(0, il);
}
const dl = new Map(
  Me.map((o) => [o.type, o.icon])
), Xo = ({
  type: o,
  label: e,
  className: t,
  decorative: n = !1,
  showTooltip: r = !0
}) => {
  const s = dl.get(o);
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
  return r ? /* @__PURE__ */ c(At, { content: e, children: i }) : i;
}, ul = "_referenceInput_dfggt_1", hl = "_editor_dfggt_5", pl = "_referenceMenu_dfggt_9", fl = "_referenceOption_dfggt_17", gl = "_referenceOptionHeader_dfggt_49", ml = "_referenceTypeIcon_dfggt_53", vl = "_referencePage_dfggt_71", yl = "_referenceSummary_dfggt_77", bl = "_referenceMeta_dfggt_87", Sl = "_referenceAuthor_dfggt_97", wl = "_referenceDate_dfggt_103", Cl = "_referenceEmpty_dfggt_107", Tl = "_submit_dfggt_112", Be = {
  referenceInput: ul,
  editor: hl,
  referenceMenu: pl,
  referenceOption: fl,
  referenceOptionHeader: gl,
  referenceTypeIcon: ml,
  referencePage: vl,
  referenceSummary: yl,
  referenceMeta: bl,
  referenceAuthor: Sl,
  referenceDate: wl,
  referenceEmpty: Cl,
  submit: Tl
}, Al = /^[\s.,!?;:'"<>/\\，。！？；：、“”‘’《》（）()[\]{}]/, xl = new Map(
  Me.map((o) => [o.type, o.name])
);
function El(o) {
  const e = o.contentsObj;
  return (e?.text || e?.selectedText || "").replace(/\s+/g, " ").trim();
}
const gn = ({
  annotations: o,
  excludeAnnotationId: e,
  initialContent: t = "",
  initialReferences: n,
  className: r,
  placeholder: s,
  onSubmit: i,
  onCancel: a
}) => {
  const { t: l } = ge(["annotator", "common"], { useSuspense: !1 }), d = B(null);
  d.current === null && (d.current = xn(
    t,
    n,
    o
  ));
  const [h, u] = V(d.current.content), [f, p] = V(
    () => d.current?.references ?? []
  ), [g, m] = V(null), [v, C] = V(0), E = B(null), S = B(null), x = B(null), N = B(null), H = B(!1), z = B(null), F = B([]), j = or(), G = Ae(
    () => ll(
      o,
      g?.query ?? "",
      e
    ),
    [o, e, g?.query]
  ), R = g !== null, T = G.length > 0 ? Math.min(v, G.length - 1) : 0;
  it(() => {
    const y = requestAnimationFrame(() => {
      E.current?.focus();
    });
    return () => cancelAnimationFrame(y);
  }, []), it(() => {
    const y = N.current;
    y !== null && (N.current = null, E.current?.focus(), E.current?.setSelectionRange(y, y));
  }, [h]), it(() => () => {
    z.current !== null && cancelAnimationFrame(z.current);
  }, []), it(() => {
    R && F.current[T]?.scrollIntoView?.({
      block: "nearest"
    });
  }, [T, R]);
  const D = (y, M) => {
    const ce = cl(y, M);
    m(ce), C(0);
  }, _ = (y) => {
    const M = y.target.value;
    u(M), p(qt(M, f) ?? []), H.current || D(M, y.target.selectionStart);
  }, X = (y) => {
    if (!g || y.referenceNumber === void 0) return;
    const M = `#${y.referenceNumber}`, ce = h.slice(0, g.start), W = h.slice(g.end), Q = W.length === 0 || !Al.test(W) ? " " : "", L = `${ce}${M}${Q}${W}`, Y = [
      ...f.filter((le) => le.label !== M),
      {
        type: "annotation",
        annotationId: y.id,
        label: M
      }
    ];
    N.current = ce.length + M.length + Q.length, u(L), p(qt(L, Y) ?? []), m(null), C(0);
  }, q = () => {
    i(xn(
      h,
      f,
      o
    ));
  }, ee = (y) => {
    if (!(y.nativeEvent.isComposing || H.current || y.keyCode === 229)) {
      if (R) {
        if (y.key === "ArrowDown") {
          y.preventDefault(), G.length > 0 && C((T + 1) % G.length);
          return;
        }
        if (y.key === "ArrowUp") {
          y.preventDefault(), G.length > 0 && C((T - 1 + G.length) % G.length);
          return;
        }
        if (y.key === "Enter") {
          y.preventDefault();
          const M = G[T];
          M && X(M);
          return;
        }
        if (y.key === "Escape") {
          y.preventDefault(), m(null);
          return;
        }
      }
      if (y.key === "Escape") {
        y.preventDefault(), a();
        return;
      }
      y.key === "Enter" && !y.shiftKey && (y.preventDefault(), q());
    }
  }, $ = (y) => {
    y.relatedTarget instanceof Node && (S.current?.contains(y.relatedTarget) || x.current?.contains(y.relatedTarget)) || (z.current !== null && cancelAnimationFrame(z.current), z.current = requestAnimationFrame(() => {
      z.current = null, !S.current?.contains(document.activeElement) && !x.current?.contains(document.activeElement) && a();
    }));
  };
  return /* @__PURE__ */ w(
    "div",
    {
      ref: S,
      "data-annotation-editor": !0,
      className: `${Be.referenceInput} ${r ?? ""}`,
      onBlurCapture: $,
      onClick: (y) => y.stopPropagation(),
      children: [
        /* @__PURE__ */ c("div", { className: Be.editor, children: /* @__PURE__ */ w(
          Te.Root,
          {
            open: R,
            onOpenChange: (y) => {
              y || m(null);
            },
            children: [
              /* @__PURE__ */ c(Te.Trigger, { children: /* @__PURE__ */ c(
                vr,
                {
                  ref: E,
                  value: h,
                  rows: 4,
                  size: "1",
                  placeholder: s,
                  role: "combobox",
                  "aria-label": l("annotator:comment.reference.inputLabel"),
                  "aria-autocomplete": "list",
                  "aria-haspopup": "listbox",
                  "aria-expanded": R,
                  "aria-controls": R ? j : void 0,
                  "aria-activedescendant": R && G.length > 0 ? `${j}-option-${T}` : void 0,
                  onChange: _,
                  onClick: (y) => D(y.currentTarget.value, y.currentTarget.selectionStart),
                  onKeyDown: ee,
                  onKeyUp: (y) => {
                    !H.current && !["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(y.key) && D(y.currentTarget.value, y.currentTarget.selectionStart);
                  },
                  onCompositionStart: () => {
                    H.current = !0;
                  },
                  onCompositionEnd: (y) => {
                    H.current = !1, D(y.currentTarget.value, y.currentTarget.selectionStart);
                  }
                }
              ) }),
              /* @__PURE__ */ c(
                Te.Content,
                {
                  ref: x,
                  container: S.current,
                  id: j,
                  className: Be.referenceMenu,
                  role: "listbox",
                  size: "1",
                  side: "bottom",
                  align: "start",
                  sideOffset: 4,
                  collisionPadding: 8,
                  onOpenAutoFocus: (y) => y.preventDefault(),
                  onCloseAutoFocus: (y) => {
                    y.preventDefault(), E.current?.focus();
                  },
                  children: G.length > 0 ? G.map((y, M) => {
                    const ce = El(y), W = xl.get(y.type), Q = W ? l(`annotator:tool.${W}`) : y.subtype, L = bn(y.date);
                    return /* @__PURE__ */ w(
                      "div",
                      {
                        id: `${j}-option-${M}`,
                        ref: (Y) => {
                          F.current[M] = Y;
                        },
                        role: "option",
                        "aria-selected": M === T,
                        className: Be.referenceOption,
                        onMouseEnter: () => C(M),
                        onMouseDown: (Y) => Y.preventDefault(),
                        onClick: () => X(y),
                        children: [
                          /* @__PURE__ */ w(K, { align: "center", gap: "2", className: Be.referenceOptionHeader, children: [
                            /* @__PURE__ */ w(yr, { size: "1", radius: "full", variant: "soft", children: [
                              "#",
                              y.referenceNumber
                            ] }),
                            /* @__PURE__ */ c(se, { as: "span", size: "1", color: "gray", className: Be.referencePage, children: l("annotator:comment.page", { value: y.pageNumber }) })
                          ] }),
                          /* @__PURE__ */ c(se, { as: "span", size: "2", className: Be.referenceSummary, children: ce || l("annotator:comment.reference.noContent") }),
                          /* @__PURE__ */ w(se, { as: "span", size: "1", color: "gray", className: Be.referenceMeta, children: [
                            /* @__PURE__ */ c(
                              Xo,
                              {
                                type: y.type,
                                label: Q,
                                className: Be.referenceTypeIcon,
                                decorative: !0,
                                showTooltip: !1
                              }
                            ),
                            /* @__PURE__ */ c("span", { className: Be.referenceAuthor, children: y.title }),
                            L && /* @__PURE__ */ w(Se, { children: [
                              /* @__PURE__ */ c("span", { "aria-hidden": "true", children: "·" }),
                              /* @__PURE__ */ c("span", { className: Be.referenceDate, children: L })
                            ] })
                          ] })
                        ]
                      },
                      y.id
                    );
                  }) : /* @__PURE__ */ c(se, { as: "div", size: "2", color: "gray", className: Be.referenceEmpty, children: l("annotator:comment.reference.empty") })
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ c(
          me,
          {
            type: "button",
            className: Be.submit,
            onMouseDown: (y) => y.preventDefault(),
            onClick: q,
            children: l("common:confirm")
          }
        )
      ]
    }
  );
};
function kl(o) {
  return o.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Rl(o, e) {
  if (!o || !e?.length)
    return [{ kind: "text", value: o }];
  const t = new Map(
    e.map((a) => [a.label, a])
  ), n = Array.from(t.keys()).sort((a, l) => l.length - a.length), r = new RegExp(
    `(${n.map(kl).join("|")})(?!\\d)`,
    "g"
  ), s = [];
  let i = 0;
  return o.replace(r, (a, l, d) => {
    d > i && s.push({
      kind: "text",
      value: o.slice(i, d)
    });
    const h = t.get(a);
    return h && s.push({
      kind: "reference",
      value: a,
      annotationId: h.annotationId
    }), i = d + a.length, a;
  }), i < o.length && s.push({
    kind: "text",
    value: o.slice(i)
  }), s.length > 0 ? s : [{ kind: "text", value: o }];
}
const Pl = "_content_1x9x1_1", Nl = "_reference_1x9x1_6", Il = "_unavailable_1x9x1_29", mn = {
  content: Pl,
  reference: Nl,
  unavailable: Il
}, oo = ({
  annotations: o,
  content: e = "",
  references: t,
  onActivate: n
}) => {
  const { t: r } = ge("annotator", { useSuspense: !1 }), s = Ae(
    () => new Map(o.map((l) => [l.id, l])),
    [o]
  ), i = Ae(
    () => xn(e, t, o),
    [o, e, t]
  ), a = Ae(
    () => Rl(
      i.content,
      i.references
    ),
    [i]
  );
  return /* @__PURE__ */ c("span", { className: mn.content, children: a.map((l, d) => {
    if (l.kind === "text")
      return /* @__PURE__ */ c(Dt.Fragment, { children: l.value }, `text-${d}`);
    const h = s.get(l.annotationId);
    return h ? /* @__PURE__ */ c(
      $o,
      {
        annotation: h,
        onActivate: n,
        children: /* @__PURE__ */ c(
          "button",
          {
            className: mn.reference,
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
      `reference-${l.annotationId}-${d}`
    ) : /* @__PURE__ */ c(
      "span",
      {
        className: mn.unavailable,
        "aria-label": r("comment.reference.unavailable", {
          value: l.value
        }),
        title: r("comment.reference.unavailable", {
          value: l.value
        }),
        children: l.value
      },
      `reference-${l.annotationId}-${d}`
    );
  }) });
};
function Ml(o, e) {
  return {
    ...o || { text: "" },
    text: e.content,
    references: e.references
  };
}
function Dl({
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
function Ll(o, e, t, n, r) {
  return o.map((s) => s.id === e ? {
    ...s,
    content: t.content,
    references: t.references,
    date: n,
    title: r
  } : s);
}
const ro = new Map(
  Me.map((o) => [o.type, o.name])
), zt = {
  [ot.Accepted]: {
    labelKey: "annotator:comment.status.accepted",
    icon: /* @__PURE__ */ c(Or, {})
  },
  [ot.Rejected]: {
    labelKey: "annotator:comment.status.rejected",
    icon: /* @__PURE__ */ c(_r, {})
  },
  [ot.Cancelled]: {
    labelKey: "annotator:comment.status.cancelled",
    icon: /* @__PURE__ */ c(Lr, {})
  },
  [ot.Completed]: {
    labelKey: "annotator:comment.status.completed",
    icon: /* @__PURE__ */ c(Dr, {})
  },
  [ot.Closed]: {
    labelKey: "annotator:comment.status.closed",
    icon: /* @__PURE__ */ c(Mr, {})
  },
  [ot.None]: {
    labelKey: "annotator:comment.status.none",
    icon: /* @__PURE__ */ c(Ir, {})
  }
}, _l = () => {
  const o = ie((A) => A.annotations), e = Lt(Nn), { isSidebarCollapsed: t } = je(), { painter: n } = et(), r = ie((A) => A.selectedAnnotation), s = ie((A) => A.selectionRevision), i = ie((A) => A.setSelectedAnnotation), [a, l] = V(null), [d, h] = V([]), [u, f] = V([]), [p, g] = V(null), m = B(null), v = B(null), C = B(null), E = B(null), { t: S } = ge(["common", "annotator"], { useSuspense: !1 }), x = a?.annotationId ?? null;
  oe(() => {
    const A = r?.store?.id;
    if (!A || r.source !== ht.CANVAS || t)
      return;
    const b = ie.getState().getAnnotation(A);
    if (!b) return;
    const P = !!n?.can("annotation.edit", b), U = b.contentsObj?.text === "", ae = b.comments?.length === 0;
    l(
      P && U && ae ? { kind: "annotation-edit", annotationId: b.id } : n?.can("annotation.comment", b) ? { kind: "annotation-reply", annotationId: b.id } : null
    );
  }, [
    r?.source,
    r?.store?.id,
    t,
    n,
    s
  ]);
  const N = B({});
  it(() => {
    if (!a) return;
    const A = requestAnimationFrame(() => {
      N.current[a.annotationId]?.querySelector("[data-annotation-editor]")?.scrollIntoView?.({
        behavior: "auto",
        block: "nearest",
        inline: "nearest"
      });
    });
    return () => cancelAnimationFrame(A);
  }, [a]);
  const H = Ae(() => {
    const A = /* @__PURE__ */ new Map();
    return o.forEach((b) => {
      A.set(b.title, (A.get(b.title) || 0) + 1);
    }), Array.from(A.entries());
  }, [o]), z = Ae(() => {
    const A = /* @__PURE__ */ new Map();
    return o.forEach((b) => {
      const P = A.get(b.type);
      A.set(b.type, {
        count: (P?.count || 0) + 1,
        fallbackLabel: P?.fallbackLabel || b.subtype
      });
    }), Array.from(A.entries());
  }, [o]);
  oe(() => {
    const A = new Set(H.map(([P]) => P)), b = m.current;
    m.current = A, h((P) => {
      if (b === null) return Array.from(A);
      const U = P.filter((he) => A.has(he)), ae = Array.from(A).filter((he) => !b.has(he)), ue = [...U, ...ae];
      return ue.length === P.length && ue.every((he, $e) => he === P[$e]) ? P : ue;
    });
  }, [H]), oe(() => {
    const A = new Set(z.map(([P]) => P)), b = v.current;
    v.current = A, f((P) => {
      if (b === null) return Array.from(A);
      const U = P.filter((he) => A.has(he)), ae = Array.from(A).filter((he) => !b.has(he)), ue = [...U, ...ae];
      return ue.length === P.length && ue.every((he, $e) => he === P[$e]) ? P : ue;
    });
  }, [z]), oe(() => () => {
    E.current !== null && cancelAnimationFrame(E.current), C.current = null;
  }, []);
  const F = Ae(() => d.length === 0 || u.length === 0 ? [] : Array.from(o.values()).filter((A) => d.includes(A.title) && u.includes(A.type)), [o, d, u]);
  oe(() => {
    if (!a) return;
    const A = r?.store?.id, b = F.some(
      (U) => U.id === a.annotationId
    ), P = !!(A && A !== a.annotationId && r?.source === ht.CANVAS);
    b && !t && (A === a.annotationId || P) || l(null);
  }, [
    r?.source,
    r?.store?.id,
    a,
    F,
    t
  ]);
  const j = Ae(
    () => Array.from(o.values()),
    [o]
  ), G = Ae(() => F.reduce(
    (A, b) => (A[b.pageNumber] || (A[b.pageNumber] = []), A[b.pageNumber].push(b), A),
    {}
  ), [F]);
  oe(() => {
    if (!p) return;
    const A = window.requestAnimationFrame(() => {
      const b = N.current[p];
      b && (b.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      }), g(null));
    });
    return () => window.cancelAnimationFrame(A);
  }, [G, p]);
  const R = (A) => {
    h((b) => b.includes(A) ? b.filter((P) => P !== A) : [...b, A]);
  }, T = (A) => {
    f((b) => b.includes(A) ? b.filter((P) => P !== A) : [...b, A]);
  }, D = /* @__PURE__ */ w("div", { className: pe.filter, children: [
    /* @__PURE__ */ c(se, { as: "div", children: S("author") }),
    /* @__PURE__ */ c("ul", { children: H.map(([A, b]) => /* @__PURE__ */ c("li", { children: /* @__PURE__ */ c(se, { as: "label", size: "2", children: /* @__PURE__ */ w(K, { gap: "2", children: [
      /* @__PURE__ */ c(Bt, { checked: d.includes(A), onCheckedChange: () => R(A) }),
      A,
      " (",
      b,
      ")"
    ] }) }) }, A)) }),
    /* @__PURE__ */ c(se, { as: "div", children: S("type") }),
    /* @__PURE__ */ c("ul", { children: z.map(([A, { count: b, fallbackLabel: P }]) => {
      const U = ro.get(A), ae = U ? S(`annotator:tool.${U}`) : P;
      return /* @__PURE__ */ c("li", { children: /* @__PURE__ */ c(se, { as: "label", size: "2", children: /* @__PURE__ */ w(K, { gap: "2", children: [
        /* @__PURE__ */ c(Bt, { checked: u.includes(A), onCheckedChange: () => T(A) }),
        ae,
        " (",
        b,
        ")"
      ] }) }) }, A);
    }) }),
    /* @__PURE__ */ w(K, { gap: "3", mt: "2", justify: "between", children: [
      /* @__PURE__ */ c(
        me,
        {
          variant: "ghost",
          onClick: () => {
            h(H.map(([A]) => A)), f(z.map(([A]) => A));
          },
          children: S("selectAll")
        }
      ),
      /* @__PURE__ */ c(
        me,
        {
          variant: "ghost",
          onClick: () => {
            h([]), f([]);
          },
          children: S("clear")
        }
      )
    ] })
  ] }), _ = (A) => [...A.comments || []].reverse().find((P) => P.status !== void 0 && P.status !== null)?.status ?? ot.None, X = (A) => {
    const b = _(A);
    return zt[b]?.icon ?? zt[ot.None].icon;
  }, q = (A) => {
    x && x !== A.id && l(null), i(A, ht.SIDEBAR), n?.highlight(A);
  }, ee = (A) => {
    x && (A.preventDefault(), A.stopPropagation(), l(null));
  }, $ = (A) => {
    q(A), l({
      kind: "annotation-reply",
      annotationId: A.id
    });
  }, y = (A) => {
    q(A), l({
      kind: "annotation-edit",
      annotationId: A.id
    });
  }, M = (A, b) => {
    q(A), l({
      kind: "reply-edit",
      annotationId: A.id,
      replyId: b.id
    });
  }, ce = (A) => {
    C.current = A;
  }, W = (A) => {
    A.preventDefault();
    const b = C.current;
    C.current = null, b && (E.current !== null && cancelAnimationFrame(E.current), E.current = requestAnimationFrame(() => {
      E.current = null, b();
    }));
  }, Q = (A) => {
    const b = o.get(A);
    b && (h((P) => P.includes(b.title) ? P : [...P, b.title]), f((P) => P.includes(b.type) ? P : [...P, b.type]), g(b.id), i(b, ht.SIDEBAR), n?.highlight(b));
  }, L = (A, b) => {
    const P = ie.getState().getAnnotation(A.id);
    !P || !n?.can("annotation.edit", P) || (n.update(P.id, {
      contentsObj: Ml(P.contentsObj, b),
      date: Wt(Date.now())
    }, "annotation.edit"), l(null));
  }, Y = (A, b, P) => {
    const U = ie.getState().getAnnotation(A.id);
    if (!U) return;
    const ae = P === void 0 ? "annotation.comment" : "annotation.change-status";
    if (!n?.can(ae, U)) return;
    const ue = e?.user ?? void 0, he = Dl({
      id: Io(),
      title: ue?.name ?? "Anonymous",
      date: Wt(Date.now()),
      draft: b,
      status: P,
      user: ue
    });
    n.update(U.id, {
      comments: [...U.comments || [], he]
    }, ae), l(null);
  }, le = (A, b, P) => {
    const U = ie.getState().getAnnotation(A.id), ae = U?.comments?.find((he) => he.id === b.id);
    if (!U || !ae || !n?.can("comment.edit", U, ae))
      return;
    const ue = Ll(
      U.comments || [],
      ae.id,
      P,
      Wt(Date.now()),
      e?.user?.name || ae.title
    );
    n.update(U.id, {
      comments: ue
    }, "comment.edit", ae), l(null);
  }, de = (A) => {
    n?.can("annotation.delete", A) && n?.delete(A.id, !0);
  }, be = (A, b) => {
    n?.deleteComment(A.id, b.id) && a?.kind === "reply-edit" && a.replyId === b.id && l(null);
  }, Pe = (A) => {
    if (a?.kind === "annotation-edit" && a.annotationId === A.id && r?.store?.id === A.id)
      return /* @__PURE__ */ c(
        gn,
        {
          annotations: j,
          excludeAnnotationId: A.id,
          initialContent: A.contentsObj?.text,
          initialReferences: A.contentsObj?.references,
          className: pe.commentEditor,
          placeholder: S("annotator:comment.reference.commentPlaceholder"),
          onSubmit: (P) => L(A, P),
          onCancel: () => {
            l(null);
          }
        }
      );
    const b = A.contentsObj?.text;
    return b?.trim() ? /* @__PURE__ */ c(K, { gap: "3", pl: "4", children: /* @__PURE__ */ c(se, { as: "p", size: "2", children: /* @__PURE__ */ c(
      oo,
      {
        annotations: j,
        content: b,
        references: A.contentsObj?.references,
        onActivate: Q
      }
    ) }) }) : null;
  }, we = (A) => a?.kind === "annotation-reply" && a.annotationId === A.id && r?.store?.id === A.id ? /* @__PURE__ */ c(
    gn,
    {
      annotations: j,
      excludeAnnotationId: A.id,
      className: pe.commentEditor,
      placeholder: S("annotator:comment.reference.replyPlaceholder"),
      onSubmit: (b) => Y(A, b),
      onCancel: () => {
        l(null);
      }
    }
  ) : null, He = (A, b) => a?.kind === "reply-edit" && a.annotationId === A.id && a.replyId === b.id ? /* @__PURE__ */ c(
    gn,
    {
      annotations: j,
      excludeAnnotationId: A.id,
      initialContent: b.content,
      initialReferences: b.references,
      className: pe.replyEditor,
      placeholder: S("annotator:comment.reference.replyPlaceholder"),
      onSubmit: (P) => le(A, b, P),
      onCancel: () => {
        l(null);
      }
    }
  ) : /* @__PURE__ */ c(K, { gap: "3", children: /* @__PURE__ */ c(se, { as: "p", size: "2", children: /* @__PURE__ */ c(
    oo,
    {
      annotations: j,
      content: b.content,
      references: b.references,
      onActivate: Q
    }
  ) }) }), ze = Object.entries(G).map(([A, b]) => {
    const P = b.sort((U, ae) => U.konvaClientRect.y - ae.konvaClientRect.y);
    return /* @__PURE__ */ w("div", { className: pe.group, children: [
      /* @__PURE__ */ w(K, { gap: "2", justify: "between", p: "1", children: [
        /* @__PURE__ */ c(se, { size: "1", children: S("annotator:comment.page", { value: A }) }),
        /* @__PURE__ */ c(se, { size: "1", children: S("annotator:comment.total", { value: b.length }) })
      ] }),
      P.map((U) => {
        const ae = U.id === r?.store?.id, ue = !!n?.can("annotation.comment", U), he = !!n?.can("annotation.edit", U), $e = !!n?.can("annotation.delete", U), Fe = !!n?.can("annotation.change-status", U), qe = _(U), tt = Uo(U) ?? U.title, Ve = pt(U.referenceNumber), _e = Ve ? `#${U.referenceNumber}` : tt, Oe = Ve && ae, lt = Hn(U.date), yt = ro.get(U.type), tn = yt ? S(`annotator:tool.${yt}`) : U.subtype, nn = {
          className: [
            pe.comment,
            ae ? pe.selected : ""
          ].filter(Boolean).join(" "),
          id: `annotation-${U.id}`
        };
        return /* @__PURE__ */ rr(
          "div",
          {
            ...nn,
            key: U.id,
            onClick: () => q(U),
            ref: (ye) => N.current[U.id] = ye
          },
          /* @__PURE__ */ w("div", { className: `${pe.title} ${pe.annotationHeader}`, children: [
            /* @__PURE__ */ w(
              se,
              {
                as: "div",
                size: "2",
                weight: "medium",
                highContrast: !0,
                className: [
                  pe.annotationHeading,
                  Oe ? pe.annotationHeadingActive : ""
                ].filter(Boolean).join(" "),
                children: [
                  _e,
                  U.native && /* @__PURE__ */ c(At, { content: S("annotator:comment.nativeAnnotation"), children: /* @__PURE__ */ c("span", { children: /* @__PURE__ */ c(Pr, {}) }) })
                ]
              }
            ),
            /* @__PURE__ */ w(
              K,
              {
                align: "center",
                gap: "1",
                ml: "auto",
                onClick: (ye) => ye.stopPropagation(),
                children: [
                  Fe && /* @__PURE__ */ w(fe.Root, { children: [
                    /* @__PURE__ */ c(fe.Trigger, { children: /* @__PURE__ */ c(
                      Ze,
                      {
                        variant: "ghost",
                        color: "gray",
                        size: "1",
                        className: pe.toolButton,
                        "aria-label": S(zt[qe].labelKey),
                        onPointerDown: ee,
                        style: {
                          boxShadow: "none"
                        },
                        children: X(U)
                      }
                    ) }),
                    /* @__PURE__ */ c(
                      fe.Content,
                      {
                        onCloseAutoFocus: W,
                        children: Object.entries(zt).map(([ye, ft]) => /* @__PURE__ */ w(
                          fe.Item,
                          {
                            onSelect: () => {
                              Y(
                                U,
                                {
                                  content: S("annotator:comment.statusText", { value: S(ft.labelKey) })
                                },
                                ye
                              );
                            },
                            children: [
                              ft.icon,
                              " ",
                              S(ft.labelKey)
                            ]
                          },
                          ye
                        ))
                      }
                    )
                  ] }),
                  (ue || he || $e) && /* @__PURE__ */ w(fe.Root, { children: [
                    /* @__PURE__ */ c(fe.Trigger, { children: /* @__PURE__ */ c(
                      Ze,
                      {
                        variant: "ghost",
                        color: "gray",
                        size: "1",
                        className: pe.toolButton,
                        "aria-label": S("more"),
                        onPointerDown: ee,
                        style: {
                          boxShadow: "none"
                        },
                        children: /* @__PURE__ */ c(_n, {})
                      }
                    ) }),
                    /* @__PURE__ */ w(
                      fe.Content,
                      {
                        onCloseAutoFocus: W,
                        children: [
                          ue && /* @__PURE__ */ c(
                            fe.Item,
                            {
                              onSelect: (ye) => {
                                ye.stopPropagation(), ce(() => $(U));
                              },
                              children: S("reply")
                            }
                          ),
                          he && /* @__PURE__ */ c(
                            fe.Item,
                            {
                              onSelect: (ye) => {
                                ye.stopPropagation(), ce(() => y(U));
                              },
                              children: S("edit")
                            }
                          ),
                          $e && /* @__PURE__ */ c(
                            fe.Item,
                            {
                              onSelect: (ye) => {
                                ye.stopPropagation(), de(U);
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
          /* @__PURE__ */ w(K, { align: "center", gap: "1", className: pe.annotationMeta, children: [
            /* @__PURE__ */ c(
              Xo,
              {
                type: U.type,
                label: tn,
                className: pe.annotationTypeIcon
              }
            ),
            /* @__PURE__ */ c(
              se,
              {
                as: "span",
                size: "1",
                color: "gray",
                className: pe.annotationAuthor,
                children: tt
              }
            ),
            lt && /* @__PURE__ */ w(Se, { children: [
              /* @__PURE__ */ c(se, { as: "span", size: "1", color: "gray", "aria-hidden": "true", children: "·" }),
              /* @__PURE__ */ c(
                se,
                {
                  as: "span",
                  size: "1",
                  color: "gray",
                  className: pe.annotationDateTime,
                  children: lt
                }
              )
            ] })
          ] }),
          Pe(U),
          U.comments?.map((ye) => {
            const ft = Hn(ye.date), xt = !!n?.can("comment.edit", U, ye), gt = !!n?.can("comment.delete", U, ye);
            return /* @__PURE__ */ w("div", { className: pe.reply, children: [
              /* @__PURE__ */ w("div", { className: `${pe.title} ${pe.annotationHeader}`, children: [
                /* @__PURE__ */ c(
                  se,
                  {
                    truncate: !0,
                    size: "1",
                    weight: "medium",
                    as: "div",
                    className: pe.annotationHeading,
                    children: ye.title
                  }
                ),
                (xt || gt) && /* @__PURE__ */ c(
                  K,
                  {
                    align: "center",
                    gap: "1",
                    ml: "auto",
                    onClick: (We) => We.stopPropagation(),
                    children: /* @__PURE__ */ w(fe.Root, { children: [
                      /* @__PURE__ */ c(fe.Trigger, { children: /* @__PURE__ */ c(
                        Ze,
                        {
                          variant: "ghost",
                          color: "gray",
                          highContrast: !0,
                          size: "1",
                          className: pe.toolButton,
                          "aria-label": S("more"),
                          onPointerDown: ee,
                          style: {
                            boxShadow: "none"
                          },
                          children: /* @__PURE__ */ c(_n, {})
                        }
                      ) }),
                      /* @__PURE__ */ w(
                        fe.Content,
                        {
                          onCloseAutoFocus: W,
                          children: [
                            xt && /* @__PURE__ */ c(
                              fe.Item,
                              {
                                onSelect: (We) => {
                                  We.stopPropagation(), ce(() => M(U, ye));
                                },
                                children: S("edit")
                              }
                            ),
                            gt && /* @__PURE__ */ c(
                              fe.Item,
                              {
                                onSelect: (We) => {
                                  We.stopPropagation(), be(U, ye);
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
              ft && /* @__PURE__ */ c(K, { align: "center", className: `${pe.annotationMeta} ${pe.replyMeta}`, children: /* @__PURE__ */ c(se, { as: "span", size: "1", color: "gray", children: ft }) }),
              He(U, ye)
            ] }, ye.id);
          }),
          /* @__PURE__ */ w("div", { children: [
            we(U),
            ue && !a && r?.store?.id === U.id && /* @__PURE__ */ c(me, { mt: "2", style: { width: "100%" }, onClick: () => $(U), children: S("reply") })
          ] })
        );
      })
    ] }, A);
  });
  return /* @__PURE__ */ w("div", { className: pe.sidebar, children: [
    /* @__PURE__ */ c(K, { align: "center", justify: "start", p: "1", children: /* @__PURE__ */ w(Te.Root, { children: [
      /* @__PURE__ */ c(Te.Trigger, { children: /* @__PURE__ */ c(
        me,
        {
          variant: "outline",
          size: "2",
          color: "gray",
          highContrast: !0,
          style: {
            boxShadow: "none",
            fontSize: "16px"
          },
          children: /* @__PURE__ */ c(Nr, {})
        }
      ) }),
      /* @__PURE__ */ c(Te.Content, { children: D })
    ] }) }),
    /* @__PURE__ */ c("div", { className: pe.list, children: ze })
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
    const n = e.node.lookup(O.of("Annots"));
    n ? n.push(t) : e.node.set(O.of("Annots"), e.doc.context.obj([t]));
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
class Ol extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, [s, i] = ke(e.konvaClientRect, r), a = n.context, l = 32, d = [Z.of(s), Z.of(i), Z.of(s + l), Z.of(i + l)], h = a.obj({
      Type: O.of("Annot"),
      Subtype: O.of("Text"),
      Rect: d,
      NM: ne.of(e.id),
      // 唯一标识
      Contents: re(e.contentsObj?.text || ""),
      Name: O.of("Comment"),
      T: re(this.getExportTitle(ve("normal.unknownUser"))),
      M: ne.of(e.date || ""),
      C: De(e.color || "#000000"),
      F: Z.of(4),
      P: t.ref,
      Open: !1
    }), u = a.register(h);
    this.addAnnotationToPage(t, u);
    for (const f of e.comments || []) {
      const p = a.obj({
        Type: O.of("Annot"),
        Subtype: O.of("Text"),
        Rect: d,
        Contents: re(f.content),
        T: re(f.title || ve("normal.unknownUser")),
        M: ne.of(f.date || ""),
        C: De(e.color || "#000000"),
        IRT: u,
        RT: O.of("R"),
        NM: ne.of(f.id),
        // 唯一标识
        Open: !1
      }), g = a.register(p);
      this.addAnnotationToPage(t, g);
    }
  }
}
function bt(o, e) {
  const t = e.attrs ?? {}, n = t.scaleX ?? 1, r = t.scaleY ?? 1, s = t.offsetX ?? 0, i = t.offsetY ?? 0, a = (o.x - s) * n, l = (o.y - i) * r, d = (t.rotation ?? 0) * Math.PI / 180, h = Math.cos(d), u = Math.sin(d);
  return {
    x: (t.x ?? 0) + a * h - l * u,
    y: (t.y ?? 0) + a * u + l * h
  };
}
function Dn(o, e) {
  const t = o.x ?? 0, n = o.y ?? 0, r = o.width ?? 0, s = o.height ?? 0, i = [
    bt({ x: t, y: n }, e),
    bt({ x: t + r, y: n }, e),
    bt({ x: t, y: n + s }, e),
    bt({ x: t + r, y: n + s }, e)
  ], a = i.map((p) => p.x), l = i.map((p) => p.y), d = Math.min(...a), h = Math.max(...a), u = Math.min(...l), f = Math.max(...l);
  return { x: d, y: u, width: h - d, height: f - u };
}
function En(o, e) {
  const { viewport: t } = e;
  return t.convertToPdfPoint(o.x * t.scale, o.y * t.scale);
}
class Hl extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, i = wt(e.konvaString), a = (i.children ?? []).filter((u) => u.className === "Rect"), l = [];
    for (const u of a) {
      const f = Dn(u.attrs ?? {}, i), [p, g, m, v] = ke(f, r);
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
    const d = s.obj({
      Type: O.of("Annot"),
      Subtype: O.of("Highlight"),
      Rect: ke(e.konvaClientRect, r),
      QuadPoints: l,
      C: De(e.color || "#000000"),
      // 批注颜色
      T: re(this.getExportTitle(ve("normal.unknownUser"))),
      // 编号与作者
      // QuadPoints anchor the source text; Contents is only the user-authored note.
      Contents: re(e.contentsObj?.text || ""),
      M: ne.of(e.date || ""),
      // 日期
      NM: ne.of(e.id),
      // 唯一标识
      F: Z.of(4)
    }), h = s.register(d);
    this.addAnnotationToPage(t, h);
    for (const u of e.comments || []) {
      const f = s.obj({
        Type: O.of("Annot"),
        Subtype: O.of("Text"),
        Rect: [0, 0, 0, 0],
        Contents: re(u.content),
        T: re(u.title || ve("normal.unknownUser")),
        M: ne.of(u.date || ""),
        C: De(e.color || "#000000"),
        IRT: h,
        RT: O.of("R"),
        NM: ne.of(u.id),
        // 唯一标识
        Open: !1
      }), p = s.register(f);
      this.addAnnotationToPage(t, p);
    }
  }
}
class Gl extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, i = wt(e.konvaString), a = (i.children ?? []).filter((u) => u.className === "Rect"), l = [];
    for (const u of a) {
      const f = Dn(u.attrs ?? {}, i), [p, g, m, v] = ke(f, r);
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
    const d = s.obj({
      Type: O.of("Annot"),
      Subtype: O.of("Underline"),
      Rect: ke(e.konvaClientRect, r),
      QuadPoints: l,
      C: De(e.color || "#000000"),
      T: re(this.getExportTitle(ve("normal.unknownUser"))),
      // QuadPoints anchor the source text; Contents is only the user-authored note.
      Contents: re(e.contentsObj?.text || ""),
      M: ne.of(e.date || ""),
      NM: ne.of(e.id),
      F: Z.of(4)
    }), h = s.register(d);
    this.addAnnotationToPage(t, h);
    for (const u of e.comments || []) {
      const f = s.obj({
        Type: O.of("Annot"),
        Subtype: O.of("Text"),
        Rect: ke(e.konvaClientRect, r),
        Contents: re(u.content),
        T: re(u.title || ve("normal.unknownUser")),
        M: ne.of(u.date || ""),
        C: De(e.color || "#000000"),
        IRT: h,
        RT: O.of("R"),
        NM: ne.of(u.id),
        Open: !1
      }), p = s.register(f);
      this.addAnnotationToPage(t, p);
    }
  }
}
class Ul extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, i = wt(e.konvaString), a = (i.children ?? []).filter((u) => u.className === "Rect"), l = [];
    for (const u of a) {
      const f = Dn(u.attrs ?? {}, i), [p, g, m, v] = ke(f, r);
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
    const d = s.obj({
      Type: O.of("Annot"),
      Subtype: O.of("StrikeOut"),
      Rect: ke(e.konvaClientRect, r),
      QuadPoints: l,
      C: De(e.color || "#000000"),
      T: re(this.getExportTitle(ve("normal.unknownUser"))),
      // QuadPoints anchor the source text; Contents is only the user-authored note.
      Contents: re(e.contentsObj?.text || ""),
      M: ne.of(e.date || ""),
      NM: ne.of(e.id),
      F: Z.of(4)
    }), h = s.register(d);
    this.addAnnotationToPage(t, h);
    for (const u of e.comments || []) {
      const f = s.obj({
        Type: O.of("Annot"),
        Subtype: O.of("Text"),
        Rect: ke(e.konvaClientRect, r),
        Contents: re(u.content),
        T: re(u.title || ve("normal.unknownUser")),
        M: ne.of(u.date || ""),
        C: De(e.color || "#000000"),
        IRT: h,
        RT: O.of("R"),
        NM: ne.of(u.id),
        Open: !1
      }), p = s.register(f);
      this.addAnnotationToPage(t, p);
    }
  }
}
class zl extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, i = wt(e.konvaString), l = (i.children?.[0] ?? i).attrs ?? i.attrs ?? {}, d = l.strokeWidth ?? 2, h = l.dash ?? [], u = l.opacity ?? 1, f = {
      W: Z.of(d),
      S: O.of(h.length > 0 ? "D" : "S"),
      ...h.length > 0 ? { D: s.obj(h) } : {}
    }, p = s.obj({
      Type: O.of("Annot"),
      Subtype: O.of("Square"),
      Rect: ke(e.konvaClientRect, r),
      C: De(e.color || "#000000"),
      // 边框颜色
      T: re(this.getExportTitle(ve("normal.unknownUser"))),
      // 编号与作者
      Contents: re(e.contentsObj?.text || ""),
      // 说明文字
      M: ne.of(e.date || ""),
      NM: ne.of(e.id),
      // 唯一标识
      F: Z.of(4),
      P: t.ref,
      BS: s.obj(f),
      CA: Z.of(u)
    }), g = s.register(p);
    this.addAnnotationToPage(t, g);
    for (const m of e.comments || []) {
      const v = s.obj({
        Type: O.of("Annot"),
        Subtype: O.of("Text"),
        Rect: ke(e.konvaClientRect, r),
        Contents: re(m.content),
        T: re(m.title || ve("normal.unknownUser")),
        M: ne.of(m.date || ""),
        C: De(e.color || "#000000"),
        IRT: g,
        RT: O.of("R"),
        NM: ne.of(m.id),
        Open: !1
      }), C = s.register(v);
      this.addAnnotationToPage(t, C);
    }
  }
}
class Fl extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, a = wt(e.konvaString).children?.find((v) => v.className === "Ellipse");
    if (!a) throw new Error(`Annotation ${e.id} is missing its ellipse geometry.`);
    const l = a.attrs ?? {}, d = l.strokeWidth ?? 2, h = l.dash ?? [], u = l.opacity ?? 1, f = {
      W: Z.of(d),
      S: O.of(h.length > 0 ? "D" : "S"),
      ...h.length > 0 ? { D: s.obj(h) } : {}
    }, p = ke(e.konvaClientRect, r), g = s.obj({
      Type: O.of("Annot"),
      Subtype: O.of("Circle"),
      Rect: p,
      C: De(e.color || "#000000"),
      T: re(this.getExportTitle(ve("normal.unknownUser"))),
      Contents: re(e.contentsObj?.text || ""),
      M: ne.of(e.date || ""),
      NM: ne.of(e.id),
      F: Z.of(4),
      P: t.ref,
      BS: s.obj(f),
      CA: Z.of(u)
    }), m = s.register(g);
    this.addAnnotationToPage(t, m);
    for (const v of e.comments || []) {
      const C = s.obj({
        Type: O.of("Annot"),
        Subtype: O.of("Text"),
        Rect: p,
        Contents: re(v.content),
        T: re(v.title || ve("normal.unknownUser")),
        M: ne.of(v.date || ""),
        C: De(e.color || "#000000"),
        IRT: m,
        RT: O.of("R"),
        NM: ne.of(v.id),
        Open: !1
      }), E = s.register(C);
      this.addAnnotationToPage(t, E);
    }
  }
}
class jl extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, i = wt(e.konvaString), a = (i.children ?? []).filter((j) => j.className === "Line"), { groupX: l, groupY: d, scaleX: h, scaleY: u } = this.extractGroupTransform(i), f = r.viewport, p = s.obj(
      a.map((j) => {
        const G = j.attrs?.points ?? [], R = [];
        for (let T = 0; T < G.length; T += 2) {
          const D = l + G[T] * h, _ = d + G[T + 1] * u, X = D * f.scale, q = _ * f.scale, [ee, $] = f.convertToPdfPoint(X, q);
          R.push(ee, $);
        }
        return s.obj(R);
      })
    ), g = a[0]?.attrs ?? {}, m = g.strokeWidth ?? 1, v = g.opacity ?? 1, C = g.stroke ?? e.color ?? "rgb(255, 0, 0)", [E, S, x] = De(C), N = s.obj({
      W: Z.of(m),
      S: O.of("S")
      // Solid border style
    }), H = ke(e.konvaClientRect, r), z = s.obj({
      Type: O.of("Annot"),
      Subtype: O.of("Ink"),
      Rect: H,
      InkList: p,
      C: s.obj([Z.of(E), Z.of(S), Z.of(x)]),
      T: re(this.getExportTitle(ve("normal.unknownUser"))),
      Contents: re(e.contentsObj?.text || ""),
      M: ne.of(e.date || ""),
      NM: ne.of(e.id),
      Border: s.obj([0, 0, 0]),
      BS: N,
      F: Z.of(4),
      P: t.ref,
      CA: Z.of(v)
      // Non-stroking opacity (used for drawing)
    }), F = s.register(z);
    this.addAnnotationToPage(t, F);
    for (const j of e.comments || []) {
      const G = s.obj({
        Type: O.of("Annot"),
        Subtype: O.of("Text"),
        Rect: H,
        Contents: re(j.content),
        T: re(j.title || ve("normal.unknownUser")),
        M: ne.of(j.date || ""),
        C: s.obj([Z.of(E), Z.of(S), Z.of(x)]),
        IRT: F,
        RT: O.of("R"),
        NM: ne.of(j.id),
        Open: !1
      }), R = s.register(G);
      this.addAnnotationToPage(t, R);
    }
  }
}
class Wl extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, [s, , , i] = ke(e.konvaClientRect, r), a = n.context, l = 20, d = t.getWidth(), h = t.getHeight(), u = Math.max(0, Math.min(s, d - l)), f = Math.max(l, Math.min(i, h)), p = [
      Z.of(u),
      Z.of(f - l),
      Z.of(u + l),
      Z.of(f)
    ], g = JSON.parse(e.konvaString), m = g.children?.find((N) => N.className === "Text"), v = Math.abs(g.attrs?.scaleY ?? 1), C = (m?.attrs?.fontSize ?? 14) * v, E = m?.attrs?.opacity ?? 1, S = a.obj({
      Type: O.of("Annot"),
      Subtype: O.of("Text"),
      InkLayerType: O.of("FreeText"),
      InkLayerFontSize: Z.of(C),
      InkLayerTextWidth: Z.of(e.konvaClientRect.width),
      Rect: p,
      NM: ne.of(e.id),
      // 唯一标识
      Contents: re(e.contentsObj?.text || ""),
      Name: O.of("Comment"),
      T: re(this.getExportTitle(ve("normal.unknownUser"))),
      M: ne.of(e.date || ""),
      C: De(e.color || "#000000"),
      CA: Z.of(E),
      F: Z.of(4),
      P: t.ref,
      Open: !1
    }), x = a.register(S);
    this.addAnnotationToPage(t, x);
    for (const N of e.comments || []) {
      const H = a.obj({
        Type: O.of("Annot"),
        Subtype: O.of("Text"),
        Rect: p,
        Contents: re(N.content),
        T: re(N.title || ve("normal.unknownUser")),
        M: ne.of(N.date || ""),
        C: De(e.color || "#000000"),
        IRT: x,
        RT: O.of("R"),
        NM: ne.of(N.id),
        // 唯一标识
        Open: !1
      }), z = a.register(H);
      this.addAnnotationToPage(t, z);
    }
  }
}
function Bl(o, e, t) {
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
function $l(o, e, t) {
  const n = o % 360;
  return n === 90 || n === 270 ? [0, 0, t, e] : [0, 0, e, t];
}
class Vl extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, [i, a, l, d] = ke(e.konvaClientRect, r), h = l - i, u = d - a, f = [Z.of(i), Z.of(a), Z.of(l), Z.of(d)], p = r.pdfPageRotate || 0;
    let g;
    if (e.contentsObj?.image) {
      const E = e.contentsObj.image.replace(/^data:image\/png;base64,/, ""), S = await n.embedPng(E), x = $l(p, h, u), N = s.obj({
        Type: "XObject",
        Subtype: "Form",
        BBox: x,
        Resources: s.obj({
          XObject: {
            Im1: S.ref
          }
        })
      }), H = `q ${Bl(p, h, u)} ${h} 0 0 ${u} 0 0 cm /Im1 Do Q`, z = Fr.of(N, new TextEncoder().encode(H)), F = s.register(z);
      g = s.obj({
        N: F
      });
    }
    const m = {
      Type: O.of("Annot"),
      Subtype: O.of("Stamp"),
      Rect: f,
      NM: ne.of(e.id),
      Contents: re(e.contentsObj?.text || ""),
      T: re(this.getExportTitle(ve("normal.unknownUser"))),
      M: ne.of(e.date || ""),
      Open: !1,
      P: t.ref,
      F: Z.of(132),
      ...g ? { AP: g } : {}
    }, v = s.obj(m), C = s.register(v);
    this.addAnnotationToPage(t, C);
    for (const E of e.comments || []) {
      const S = s.obj({
        Type: O.of("Annot"),
        Subtype: O.of("Text"),
        Rect: f,
        Contents: re(E.content),
        T: re(E.title || ve("normal.unknownUser")),
        M: ne.of(E.date || ""),
        IRT: C,
        RT: O.of("R"),
        NM: ne.of(E.id),
        Open: !1
      }), x = s.register(S);
      this.addAnnotationToPage(t, x);
    }
  }
}
function Yl(o, e, t, n, r = 10, s = 10) {
  const i = t - o, a = n - e, l = Math.hypot(i, a) || 1, d = i / l, h = a / l, u = -h, f = d, p = t - d * r + u * (s / 2), g = n - h * r + f * (s / 2), m = t - d * r - u * (s / 2), v = n - h * r - f * (s / 2);
  return [t, n, p, g, m, v, t, n];
}
class Kl extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, i = JSON.parse(e.konvaString), a = i.children.filter((S) => S.className === "Arrow");
    if (a.length === 0) throw new Error(`Arrow annotation ${e.id} has no arrow shape.`);
    const l = s.obj(
      a.map((S) => {
        const x = S.attrs.points;
        if (!x || x.length < 4)
          throw new Error(`Arrow annotation ${e.id} needs at least two points.`);
        const N = [];
        for (let F = 0; F < x.length; F += 2) {
          const j = bt({ x: x[F], y: x[F + 1] }, i), [G, R] = En(j, r);
          N.push(G, R);
        }
        const H = x.length, z = Yl(
          x[H - 4],
          x[H - 3],
          x[H - 2],
          x[H - 1],
          typeof S.attrs.pointerLength == "number" ? S.attrs.pointerLength : 10,
          typeof S.attrs.pointerWidth == "number" ? S.attrs.pointerWidth : 10
        );
        for (let F = 0; F < z.length; F += 2) {
          const j = bt({ x: z[F], y: z[F + 1] }, i), [G, R] = En(j, r);
          N.push(G, R);
        }
        return s.obj(N);
      })
    ), d = a[0]?.attrs || {}, h = d.strokeWidth ?? 1, u = d.opacity ?? 1, f = d.stroke ?? e.color ?? "rgb(255, 0, 0)", [p, g, m] = De(f), v = s.obj({
      W: Z.of(h),
      S: O.of("S")
      // Solid border style
    }), C = s.obj({
      Type: O.of("Annot"),
      // Ink is intentional: the sampled arrowhead renders consistently in PDF viewers.
      Subtype: O.of("Ink"),
      InkLayerType: O.of("Arrow"),
      Rect: ke(e.konvaClientRect, r),
      InkList: l,
      C: s.obj([Z.of(p), Z.of(g), Z.of(m)]),
      T: re(this.getExportTitle(ve("normal.unknownUser"))),
      Contents: re(e.contentsObj?.text || ""),
      M: ne.of(e.date || ""),
      NM: ne.of(e.id),
      BS: v,
      F: Z.of(4),
      P: t.ref,
      CA: Z.of(u)
      // Constant opacity for the Ink stroke.
    }), E = s.register(C);
    this.addAnnotationToPage(t, E);
    for (const S of e.comments || []) {
      const x = s.obj({
        Type: O.of("Annot"),
        Subtype: O.of("Text"),
        Rect: ke(e.konvaClientRect, r),
        Contents: re(S.content),
        T: re(S.title || ve("normal.unknownUser")),
        M: ne.of(S.date || ""),
        C: s.obj([Z.of(p), Z.of(g), Z.of(m)]),
        IRT: E,
        RT: O.of("R"),
        NM: ne.of(S.id),
        Open: !1
      }), N = s.register(x);
      this.addAnnotationToPage(t, N);
    }
  }
}
function Xl(o, e, t, n = 12) {
  const r = [];
  for (let s = 1; s <= n; s++) {
    const i = s / n, a = (1 - i) * (1 - i) * o[0] + 2 * (1 - i) * i * e[0] + i * i * t[0], l = (1 - i) * (1 - i) * o[1] + 2 * (1 - i) * i * e[1] + i * i * t[1];
    r.push(a, l);
  }
  return r;
}
function ql(o, e, t, n, r = 16) {
  const s = [];
  for (let i = 1; i <= r; i++) {
    const a = i / r, l = Math.pow(1 - a, 3) * o[0] + 3 * Math.pow(1 - a, 2) * a * e[0] + 3 * (1 - a) * a * a * t[0] + a * a * a * n[0], d = Math.pow(1 - a, 3) * o[1] + 3 * Math.pow(1 - a, 2) * a * e[1] + 3 * (1 - a) * a * a * t[1] + a * a * a * n[1];
    s.push(l, d);
  }
  return s;
}
function Jl(o) {
  const e = o.match(/[a-zA-Z][^a-zA-Z]*/g) || [], t = [];
  let n = [0, 0];
  for (const r of e) {
    const s = r[0], i = r.slice(1).trim().split(/[\s,]+/).map(parseFloat);
    if (s === "M" && (n = [i[0], i[1]], t.push(...n)), s === "L")
      for (let a = 0; a < i.length; a += 2)
        n = [i[a], i[a + 1]], t.push(...n);
    if (s === "Q") {
      const a = n, l = [i[0], i[1]], d = [i[2], i[3]];
      t.push(...Xl(a, l, d)), n = d;
    }
    if (s === "C") {
      const a = n, l = [i[0], i[1]], d = [i[2], i[3]], h = [i[4], i[5]];
      t.push(...ql(a, l, d, h)), n = h;
    }
  }
  return t;
}
class Zl extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, i = wt(e.konvaString), a = (i.children ?? []).filter((j) => j.className === "Path"), { groupX: l, groupY: d, scaleX: h, scaleY: u } = this.extractGroupTransform(i), f = r.viewport, p = s.obj(
      a.map((j) => {
        const G = Jl(j.attrs?.data ?? ""), R = [];
        for (let T = 0; T < G.length; T += 2) {
          const D = l + G[T] * h, _ = d + G[T + 1] * u, X = D * f.scale, q = _ * f.scale, [ee, $] = f.convertToPdfPoint(X, q);
          R.push(ee, $);
        }
        return s.obj(R);
      })
    ), g = a[0]?.attrs ?? {}, m = g.strokeWidth ?? 1, v = g.opacity ?? 1, C = g.stroke ?? e.color ?? "rgb(255, 0, 0)", [E, S, x] = De(C), N = s.obj({
      W: Z.of(m),
      S: O.of("S")
      // Solid border style
    }), H = ke(e.konvaClientRect, r), z = s.obj({
      Type: O.of("Annot"),
      Subtype: O.of("Ink"),
      Rect: H,
      InkList: p,
      C: s.obj([Z.of(E), Z.of(S), Z.of(x)]),
      T: re(this.getExportTitle(ve("normal.unknownUser"))),
      Contents: re(e.contentsObj?.text || ""),
      M: ne.of(e.date || ""),
      NM: ne.of(e.id),
      Border: s.obj([0, 0, 0]),
      BS: N,
      F: Z.of(4),
      P: t.ref,
      CA: Z.of(v)
      // Non-stroking opacity (used for drawing)
    }), F = s.register(z);
    this.addAnnotationToPage(t, F);
    for (const j of e.comments || []) {
      const G = s.obj({
        Type: O.of("Annot"),
        Subtype: O.of("Text"),
        Rect: H,
        Contents: re(j.content),
        T: re(j.title || ve("normal.unknownUser")),
        M: ne.of(j.date || ""),
        C: s.obj([Z.of(E), Z.of(S), Z.of(x)]),
        IRT: F,
        RT: O.of("R"),
        NM: ne.of(j.id),
        Open: !1
      }), R = s.register(G);
      this.addAnnotationToPage(t, R);
    }
  }
}
function Ql(o) {
  return (o.match(/[a-zA-Z][^a-zA-Z]*/g) ?? []).map((t) => ({
    type: t[0].toUpperCase(),
    values: t.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(Number)
  }));
}
function ed(o, e, t, n) {
  const r = 1 - n;
  return {
    x: r * r * o.x + 2 * r * n * e.x + n * n * t.x,
    y: r * r * o.y + 2 * r * n * e.y + n * n * t.y
  };
}
function td(o, e, t, n, r) {
  const s = 1 - r;
  return {
    x: s ** 3 * o.x + 3 * s ** 2 * r * e.x + 3 * s * r ** 2 * t.x + r ** 3 * n.x,
    y: s ** 3 * o.y + 3 * s ** 2 * r * e.y + 3 * s * r ** 2 * t.y + r ** 3 * n.y
  };
}
function nd(o) {
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
        e.push(ed(r, s, i, a / 12));
      t = i;
      return;
    }
    if (n.type === "C" && t && n.values.length >= 6) {
      const r = t, s = { x: n.values[0], y: n.values[1] }, i = { x: n.values[2], y: n.values[3] }, a = { x: n.values[4], y: n.values[5] };
      for (let l = 1; l <= 16; l++)
        e.push(td(r, s, i, a, l / 16));
      t = a;
    }
  }), e;
}
class od extends Xe {
  async parse() {
    const { annotation: e, page: t, pdfDoc: n, pageView: r } = this, s = n.context, i = JSON.parse(e.konvaString), a = i.children?.find((S) => S.className === "Path");
    if (!a?.attrs?.data) throw new Error(`Cloud annotation ${e.id} has no path data.`);
    const l = nd(Ql(a.attrs.data));
    if (l.length < 2) throw new Error(`Cloud annotation ${e.id} needs at least two points.`);
    const d = l.flatMap((S) => {
      const x = bt(S, i);
      return En(x, r);
    }), h = a.attrs.strokeWidth ?? 2, u = a.attrs.opacity ?? 1, f = a.attrs.stroke ?? e.color ?? "#000000", [p, g, m] = De(f), v = ke(e.konvaClientRect, r), C = s.obj({
      Type: O.of("Annot"),
      Subtype: O.of("Ink"),
      InkLayerType: O.of("Cloud"),
      Rect: v,
      InkList: s.obj([d]),
      C: s.obj([p, g, m]),
      T: re(this.getExportTitle(ve("normal.unknownUser"))),
      Contents: re(e.contentsObj?.text || ""),
      M: ne.of(e.date || ""),
      NM: ne.of(e.id),
      Border: s.obj([0, 0, 0]),
      BS: s.obj({ W: h, S: O.of("S") }),
      F: Z.of(4),
      P: t.ref,
      CA: Z.of(u)
    }), E = s.register(C);
    this.addAnnotationToPage(t, E);
    for (const S of e.comments || []) {
      const x = s.obj({
        Type: O.of("Annot"),
        Subtype: O.of("Text"),
        Rect: v,
        Contents: re(S.content),
        T: re(S.title || ve("normal.unknownUser")),
        M: ne.of(S.date || ""),
        C: s.obj([p, g, m]),
        IRT: E,
        RT: O.of("R"),
        NM: ne.of(S.id),
        Open: !1
      });
      this.addAnnotationToPage(t, s.register(x));
    }
  }
}
const rd = {
  [te.TEXT]: Ol,
  [te.HIGHLIGHT]: Hl,
  [te.UNDERLINE]: Gl,
  [te.STRIKEOUT]: Ul,
  [te.SQUARE]: zl,
  [te.CIRCLE]: Fl,
  [te.INK]: jl,
  [te.POLYLINE]: Zl,
  [te.FREETEXT]: Wl,
  [te.STAMP]: Vl,
  [te.LINE]: Kl
  // 你可以在这里扩展其他类型的解析器
}, id = /* @__PURE__ */ new Set([
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
function qo(o) {
  return o.type === k.CLOUD ? od : rd[o.pdfjsType];
}
async function sd(o, e, t, n) {
  const r = qo(o);
  r ? await new r(t, e, o, n).parse() : console.warn("Unsupported annotation type:", o.pdfjsType);
}
function ad(o, e) {
  const t = new ArrayBuffer(o.byteLength);
  new Uint8Array(t).set(o);
  const n = new Blob([t], { type: "application/pdf" });
  bo(n, `${e}.pdf`);
}
function cd(o, e) {
  const t = new Blob([o], { type: "application/octet-stream" });
  bo(t, `${e}.xlsx`);
}
function ld(o) {
  for (const e of o.getPages()) {
    const t = O.of("Annots"), n = e.node.lookupMaybe(t, mo);
    if (!n) continue;
    const r = n.asArray().filter((s) => {
      const a = o.context.lookupMaybe(s, vn)?.get(O.of("Subtype"))?.toString();
      return !a || !id.has(a);
    });
    e.node.set(t, o.context.obj(r));
  }
}
async function dd(o, e) {
  const t = o.pdfDocument;
  if (!t) throw new Error("Cannot export annotations before the PDF document is ready.");
  const n = await t.getData(), r = await Pn.load(n), s = r.getPages(), i = e.map((a) => {
    if (!qo(a))
      throw new Error(`Unsupported annotation type: ${a.pdfjsType}`);
    const l = s[a.pageNumber - 1];
    if (!l) throw new Error(`Annotation ${a.id} references missing page ${a.pageNumber}.`);
    const d = o.getPageView(a.pageNumber - 1);
    if (!d?.viewport)
      throw new Error(`Page view ${a.pageNumber} is not ready for annotation export.`);
    return { annotation: a, page: l, pageView: d };
  });
  ld(r);
  for (const { annotation: a, page: l, pageView: d } of i)
    await sd(a, l, r, d);
  return r.save();
}
async function Jo(o, e, t) {
  const n = await dd(o, e), r = t || `annotated_${Do()}`;
  ad(n, r);
}
function ud(o) {
  const e = [], t = [...o].sort((i, a) => i.pageNumber !== a.pageNumber ? i.pageNumber - a.pageNumber : Gn(a.date) - Gn(i.date)), n = (i) => {
    const l = [...i.comments || []].reverse().find((d) => d.status !== void 0 && d.status !== null)?.status ?? ot.None;
    return Ce.t(`annotator:comment.status.${l.toLowerCase()}`);
  };
  let r = 1, s = 0;
  return t.forEach((i) => {
    const a = Me.find((h) => h.type === i.type)?.name, l = Ce.t(`annotator:tool.${a}`), d = pt(i.referenceNumber) ? `#${i.referenceNumber}` : `#${r}`;
    e.push({
      index: d,
      id: i.id,
      page: i.pageNumber,
      annotationType: l,
      recordType: Ce.t("annotator:export.recordType.annotation"),
      author: i.title,
      content: i.contentsObj?.text || "",
      date: bn(i.date, !0),
      status: n(i)
    }), s = 0, i.comments.forEach((h) => {
      s++, e.push({
        index: `${d}.${s}`,
        id: h.id,
        page: "",
        annotationType: "--",
        recordType: Ce.t("annotator:export.recordType.reply"),
        author: h.title,
        content: h.content,
        date: bn(h.date, !0),
        status: ""
      });
    }), r++;
  }), e;
}
async function Zo(o, e, t) {
  const n = ud(e), r = await import("exceljs"), s = new r.Workbook(), i = s.addWorksheet("sheet1");
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
      header: Ce.t("annotator:export.fields.id"),
      width: 20,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    },
    {
      key: "page",
      header: Ce.t("annotator:export.fields.page"),
      width: 10,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    },
    {
      key: "annotationType",
      header: Ce.t("annotator:export.fields.annotationType"),
      width: 18,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    },
    {
      key: "recordType",
      header: Ce.t("annotator:export.fields.recordType"),
      width: 12,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    },
    {
      key: "author",
      header: Ce.t("annotator:export.fields.author"),
      width: 16,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    },
    {
      key: "content",
      header: Ce.t("annotator:export.fields.content"),
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
      header: Ce.t("annotator:export.fields.date"),
      width: 22,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    },
    {
      key: "status",
      header: Ce.t("annotator:export.fields.status"),
      width: 14,
      style: {
        alignment: {
          vertical: "middle"
        }
      }
    }
  ], n.forEach((d) => {
    const h = i.addRow(d), u = d.recordType === Ce.t("annotator:export.recordType.reply");
    h.font = {
      size: 12,
      color: { argb: u ? "389e0d" : "000000" }
    };
  }), i.getRow(1).eachCell((d) => {
    d.font = { bold: !0, size: 12 }, d.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D9E1F2" }
    };
  }), i.eachRow((d) => {
    d.eachCell((h) => {
      h.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } }
      };
    });
  });
  const a = await s.xlsx.writeBuffer(), l = t || `annotated_${Do()}`;
  cd(a, l);
}
async function hd(o, e, t) {
  if (t.has(e)) return t.get(e);
  const n = o.getPageView(e);
  if (!n?.pdfPage) return "";
  const s = (await n.pdfPage.getTextContent()).items.map((i) => "str" in i ? i.str : "").join("");
  return t.set(e, s), s;
}
function pd({ pdfViewer: o }) {
  const [e, t] = V(""), [n, r] = V([]), [s, i] = V(!1), [a, l] = V({
    caseSensitive: !1,
    entireWord: !1,
    matchDiacritics: !1
  }), d = B(/* @__PURE__ */ new Map()), h = B(a), u = B(0), f = B(null), p = J(() => {
    f.current?.(), f.current = null;
  }, []);
  oe(() => (d.current.clear(), () => {
    u.current += 1, p();
  }), [o, p]);
  const g = J(({ pageNumber: C, matchIndex: E }) => {
    if (!o || !e) return;
    const S = o.findController;
    if (!S || !o.pdfDocument) return;
    o.scrollPageIntoView({ pageNumber: C });
    const N = S;
    N._selected = { pageIdx: C - 1, matchIdx: E }, N._offset = { pageIdx: C - 1, matchIdx: E - 1, wrapped: !1 }, N._highlightMatches = !0, o.eventBus.dispatch("find", {
      type: "again",
      query: e,
      caseSensitive: a.caseSensitive,
      entireWord: a.entireWord,
      findPrevious: !1,
      matchDiacritics: a.matchDiacritics,
      highlightAll: !0
    });
  }, [o, e, a]), m = J(
    async (C, E) => {
      if (!o) return;
      const S = u.current + 1;
      u.current = S, p();
      const x = {
        ...h.current,
        ...E
      };
      h.current = x, i(!0), t(C), l(x);
      try {
        const N = await new Promise((H, z) => {
          const F = o.pagesCount;
          let j = 0;
          const G = 60, R = 200;
          let T = null, D = !1, _ = null;
          const X = () => {
            T && (clearTimeout(T), T = null), o.eventBus.off("updatefindcontrolstate", y);
          }, q = (M) => {
            D || (D = !0, X(), H(M));
          }, ee = (M) => {
            D || (D = !0, X(), z(M));
          }, $ = async () => {
            if (D || S !== u.current) {
              q(null);
              return;
            }
            try {
              const M = _?._pageMatches;
              if (Array.isArray(M) && M.length === F) {
                const ce = [];
                for (let W = 0; W < M.length; W++) {
                  const Q = M[W];
                  if (!Q || Q.length === 0) continue;
                  const L = await hd(o, W, d.current);
                  if (D || S !== u.current) {
                    q(null);
                    return;
                  }
                  const Y = Q.map((le, de) => {
                    const Pe = Math.max(0, le - 5), we = Math.min(L.length, le + C.length + 30);
                    return {
                      matchIndex: de,
                      charIndex: le,
                      snippet: L.slice(Pe, we)
                    };
                  });
                  ce.push({
                    pageNumber: W + 1,
                    countTotal: Q.length,
                    matches: Y
                  });
                }
                q({
                  query: C,
                  countTotal: _?._matchesCountTotal ?? 0,
                  pageMatches: ce
                });
              } else j < G ? (j += 1, T = setTimeout(() => {
                T = null, $();
              }, R)) : q({
                query: C,
                countTotal: 0,
                pageMatches: []
              });
            } catch (M) {
              ee(M);
            }
          }, y = ({ source: M, rawQuery: ce }) => {
            const W = Array.isArray(ce) ? ce.join("") : ce;
            W != null && W !== C || (_ = M ?? null, T && (clearTimeout(T), T = null), $());
          };
          f.current = () => q(null), o.eventBus.on("updatefindcontrolstate", y), o.eventBus.dispatch("find", {
            type: "highlightallchange",
            query: C,
            caseSensitive: x.caseSensitive ?? !1,
            entireWord: x.entireWord ?? !1,
            findPrevious: !1,
            matchDiacritics: x.matchDiacritics ?? !1,
            highlightAll: !0
          });
        });
        N && S === u.current && r([N]);
      } catch (N) {
        console.error(N), S === u.current && r([{ query: C, countTotal: 0, pageMatches: [] }]);
      } finally {
        S === u.current && (f.current = null, i(!1));
      }
    },
    [o, p]
  ), v = J(() => {
    u.current += 1, p(), o?.eventBus.dispatch("find", { query: "" }), t(""), r([]), i(!1);
  }, [o, p]);
  return { query: e, setQuery: t, results: n, searching: s, search: m, clearSearch: v, jumpToMatch: g, searchOptions: a };
}
function fd(o, e, t) {
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
const gd = ({ text: o, query: e, caseSensitive: t }) => /* @__PURE__ */ c(Se, { children: fd(o, e, t).map(
  (n, r) => n.highlighted ? /* @__PURE__ */ c("mark", { style: { backgroundColor: "rgba(255, 255, 0, 0.2)", padding: "0 2px" }, children: n.text }, `${r}-${n.text}`) : n.text
) }), Qo = ({ pdfViewer: o }) => {
  const { query: e, setQuery: t, results: n, searching: r, search: s, clearSearch: i, jumpToMatch: a } = pd({ pdfViewer: o }), { t: l } = ge("viewer", { useSuspense: !1 }), [d, h] = V({
    caseSensitive: !1,
    entireWord: !1
  }), [u, f] = V(null), p = B({}), g = B(n), m = B(e);
  m.current = e;
  const v = J(
    (R) => {
      R.trim() && o && (i(), f(null), s(R.trim(), {
        caseSensitive: d.caseSensitive,
        entireWord: d.entireWord
      }));
    },
    [o, s, i, d]
  ), C = J(
    (R) => {
      switch (R.key) {
        case "Escape":
          (n.length > 0 || e.trim() !== "") && i();
          break;
        case "Enter":
          e.trim() === "" && n.length > 0 && i(), e.trim() && (i(), v(e));
          break;
      }
    },
    [e, n, i, v]
  ), E = J(
    (R, T) => {
      f({ pageNumber: R, matchIndex: T }), a({
        pageNumber: R,
        matchIndex: T
      });
    },
    [a]
  ), S = J((R, T) => {
    h((D) => ({
      ...D,
      [R]: T
    }));
  }, []), x = J(() => {
    const R = [];
    return n.forEach((T) => {
      T.pageMatches.forEach((D) => {
        D.matches.forEach((_) => {
          R.push({
            pageNumber: D.pageNumber,
            matchIndex: _.matchIndex,
            query: T.query
          });
        });
      });
    }), R;
  }, [n]), N = J((R, T) => {
    const D = p.current[`${R}-${T}`];
    D && D.scrollIntoView({
      block: "center",
      inline: "center"
    });
  }, []), H = J(() => u ? x().findIndex((T) => T.pageNumber === u.pageNumber && T.matchIndex === u.matchIndex) : -1, [u, x]), z = J(() => {
    if (!n.length) return;
    const R = x();
    if (!R.length) return;
    let T = 0;
    u && (T = (H() + 1) % R.length);
    const D = R[T];
    f({
      pageNumber: D.pageNumber,
      matchIndex: D.matchIndex
    }), a({
      pageNumber: D.pageNumber,
      matchIndex: D.matchIndex
    }), N(D.pageNumber, D.matchIndex);
  }, [n, u, x, H, a, N]), F = J(() => {
    if (!n.length) return;
    const R = x();
    if (!R.length) return;
    let T = R.length - 1;
    u && (T = (H() - 1 + R.length) % R.length);
    const D = R[T];
    f({
      pageNumber: D.pageNumber,
      matchIndex: D.matchIndex
    }), a({
      pageNumber: D.pageNumber,
      matchIndex: D.matchIndex
    }), N(D.pageNumber, D.matchIndex);
  }, [n, u, x, H, a, N]);
  oe(() => {
    g.current = n;
  }, [n]), oe(() => {
    const R = m.current.trim();
    R && v(R);
  }, [d, v]), oe(() => () => {
    g.current.length > 0 && i(), f(null), t("");
  }, [i, t]);
  const j = () => !n.length || r ? null : n.map((R) => /* @__PURE__ */ w(st, { children: [
    /* @__PURE__ */ w(
      K,
      {
        pb: "2",
        justify: "between",
        align: "center",
        style: { position: "sticky", top: 89, backgroundColor: "var(--bg-color-tertiary)", zIndex: 1 },
        children: [
          /* @__PURE__ */ c(se, { size: "2", children: l("viewer:search.resultTotal", {
            total: R.countTotal
          }) }),
          R.countTotal > 0 && /* @__PURE__ */ w("div", { children: [
            /* @__PURE__ */ c(Ze, { onClick: F, variant: "soft", color: "gray", size: "1", mr: "1", children: /* @__PURE__ */ c(uo, {}) }),
            /* @__PURE__ */ c(Ze, { onClick: z, variant: "soft", color: "gray", size: "1", mr: "1", children: /* @__PURE__ */ c(ho, {}) })
          ] })
        ]
      }
    ),
    R.pageMatches.map((T) => /* @__PURE__ */ w(st, { mt: "1", mb: "3", pl: "2", children: [
      /* @__PURE__ */ w(se, { size: "2", children: [
        l("viewer:search.page", { value: T.pageNumber }),
        " (",
        T.countTotal,
        ")"
      ] }),
      T.matches.map((D) => {
        const _ = u && u.pageNumber === T.pageNumber && u.matchIndex === D.matchIndex, X = `${T.pageNumber}-${D.matchIndex}`;
        return /* @__PURE__ */ c(st, { mt: "2", pl: "0", children: /* @__PURE__ */ c(
          me,
          {
            ref: (q) => p.current[X] = q,
            variant: _ ? "soft" : "outline",
            color: _ ? void 0 : "gray",
            type: "button",
            onClick: () => E(T.pageNumber, D.matchIndex),
            style: {
              width: "100%",
              textAlign: "left",
              justifyContent: "flex-start"
            },
            children: /* @__PURE__ */ c(se, { truncate: !0, children: /* @__PURE__ */ c(
              gd,
              {
                text: D.snippet,
                query: R.query,
                caseSensitive: d.caseSensitive
              }
            ) })
          }
        ) }, D.matchIndex);
      })
    ] }, T.pageNumber))
  ] }, R.query)), G = Ae(() => r ? /* @__PURE__ */ w(K, { mt: "2", align: "center", gap: "2", children: [
    /* @__PURE__ */ c(co, {}),
    /* @__PURE__ */ c(se, { size: "2", children: l("viewer:search.searching") })
  ] }) : null, [r, l]);
  return /* @__PURE__ */ w(st, { p: "2", pt: "0", children: [
    /* @__PURE__ */ w(K, { direction: "column", style: { position: "sticky", top: 0, backgroundColor: "var(--bg-color-tertiary)", zIndex: 1 }, children: [
      /* @__PURE__ */ w(
        Tt.Root,
        {
          placeholder: l("viewer:search.placeholder"),
          value: e,
          onChange: (R) => t(R.currentTarget.value),
          onKeyDown: C,
          "aria-label": l("viewer:search.placeholder"),
          mt: "3",
          children: [
            /* @__PURE__ */ c(Tt.Slot, { children: /* @__PURE__ */ c(Rn, {}) }),
            /* @__PURE__ */ c(Tt.Slot, { children: e.trim() && /* @__PURE__ */ c(
              Ze,
              {
                size: "1",
                variant: "ghost",
                onClick: () => {
                  t(""), n.length > 0 && (i(), f(null));
                },
                children: /* @__PURE__ */ c(Hr, {})
              }
            ) })
          ]
        }
      ),
      /* @__PURE__ */ w(K, { mt: "2", align: "center", gap: "2", children: [
        /* @__PURE__ */ c(se, { as: "label", size: "2", children: /* @__PURE__ */ w(K, { gap: "2", children: [
          /* @__PURE__ */ c(
            Bt,
            {
              checked: d.caseSensitive,
              onCheckedChange: (R) => S("caseSensitive", !!R),
              "aria-label": l("viewer:search.caseSensitive")
            }
          ),
          l("viewer:search.caseSensitive")
        ] }) }),
        /* @__PURE__ */ c(se, { as: "label", size: "2", children: /* @__PURE__ */ w(K, { gap: "2", children: [
          /* @__PURE__ */ c(
            Bt,
            {
              checked: d.entireWord,
              onCheckedChange: (R) => S("entireWord", !!R),
              "aria-label": l("viewer:search.entireWord")
            }
          ),
          l("viewer:search.entireWord")
        ] }) })
      ] }),
      /* @__PURE__ */ c(Qe, { my: "2", size: "4" })
    ] }),
    G,
    j()
  ] });
}, er = () => {
  const [o, e] = V(() => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  return oe(() => {
    const t = window.matchMedia("(prefers-color-scheme: dark)"), n = (r) => {
      e(r.matches ? "dark" : "light");
    };
    return t.addEventListener ? t.addEventListener("change", n) : t.addListener(n), () => {
      t.removeEventListener ? t.removeEventListener("change", n) : t.removeListener(n);
    };
  }, []), o;
}, md = () => /* @__PURE__ */ w(K, { align: "center", gap: "2", "data-inklayer-page-zoom-control": "true", children: [
  /* @__PURE__ */ c(Co, { persistent: !0 }),
  /* @__PURE__ */ c(Qe, { orientation: "vertical" }),
  /* @__PURE__ */ c(Kt, {})
] }), io = "search-sidebar", so = "annotator-sidebar-toggle", vd = ({
  Chrome: o,
  onSave: e,
  searchAvailable: t
}) => {
  const { painter: n } = et(), r = ie((m) => m.currentAnnotationType), s = ie((m) => m.setCurrentAnnotationType), {
    activeSidebarPanel: i,
    closeSidebar: a,
    openSidebar: l,
    isNavigationSidebarOpen: d,
    toggleNavigationSidebar: h,
    pdfViewer: u
  } = je(), f = n?.can("annotation.create") ?? !1;
  oe(() => {
    f || r && r.type !== k.SELECT && (s(null), n?.activate(null, null));
  }, [f, r, n, s]), oe(() => () => {
    s(null), n?.activate(null, null);
  }, [n, s]);
  const p = (m) => {
    i === m ? a() : l(m);
  }, g = {
    save: () => {
      n && e?.(It(n.getData()));
    },
    getAnnotations: () => It(n?.getData() ?? []),
    exportToExcel: (m) => {
      n && u && Zo(u, n.getData(), m);
    },
    exportToPdf: (m) => {
      n && u && Jo(u, n.getData(), m);
    }
  };
  return /* @__PURE__ */ c(
    o,
    {
      activeTool: Mc(r?.type),
      canCreate: f,
      ToolControl: An,
      ColorControl: Yo,
      AuthorLabelsControl: Ko,
      PageZoomControl: md,
      panels: {
        navigation: {
          open: d,
          toggle: h
        },
        search: {
          open: i === io,
          available: t,
          toggle: () => p(io)
        },
        annotations: {
          open: i === so,
          toggle: () => p(so)
        }
      },
      actions: g
    }
  );
}, jd = ({
  appearance: o = "auto",
  enableRange: e = "auto",
  theme: t = "violet",
  title: n = "PDF ANNOTATOR",
  data: r,
  url: s,
  locale: i = "zh-CN",
  pdfjsOptions: a,
  user: l = { id: "null", name: "unknown" },
  annotationPermissions: d,
  defaultShowAnnotationAuthorLabels: h = !1,
  defaultOptions: u,
  initialScale: f,
  enableNativeAnnotations: p = !1,
  initialAnnotations: g = [],
  defaultShowAnnotationsSidebar: m = !1,
  onSave: v,
  onLoad: C,
  onAnnotationAdded: E,
  onAnnotationDeleted: S,
  onAnnotationSelected: x,
  onAnnotationUpdated: N,
  layoutStyle: H,
  actions: z,
  chrome: F,
  searchAvailable: j = !0
}) => {
  const G = Ae(
    () => ra(g),
    [g]
  ), R = Ae(
    () => ({ textLayerMode: 1, annotationMode: 0, externalLinkTarget: 0, enableRange: e, pdfjsOptions: a }),
    [e, a]
  ), { t: T } = ge(["annotator", "common"], { useSuspense: !1 }), D = Ae(() => Bo(_c, u || {}), [u]), [_, X] = V(() => qn()), q = er(), ee = o === "auto" ? q : o;
  oe(() => {
    const y = setTimeout(() => {
      const M = qn();
      X(M);
    }, 0);
    return () => clearTimeout(y);
  }, []), oe(() => {
    Ce.changeLanguage(i);
  }, [i]);
  const $ = () => {
    const { painter: y } = et(), { pdfViewer: M } = je(), ce = () => {
      if (y) {
        const L = y.getData();
        v?.(It(L));
      }
    }, W = async (L) => {
      if (y && M) {
        const Y = y.getData();
        await Jo(M, Y, L);
      }
    }, Q = async (L) => {
      if (y && M) {
        const Y = y.getData();
        await Zo(M, Y, L);
      }
    };
    return z ? typeof z == "function" ? /* @__PURE__ */ c(
      z,
      {
        save: ce,
        getAnnotations: () => It(y?.getData() || []),
        exportToExcel: (Y) => {
          Q(Y);
        },
        exportToPdf: (Y) => {
          W(Y);
        }
      }
    ) : Dt.cloneElement(z, {
      save: ce,
      getAnnotations: () => It(y?.getData() || []),
      exportToExcel: (L) => {
        Q(L);
      },
      exportToPdf: (L) => {
        W(L);
      }
    }) : /* @__PURE__ */ w(Se, { children: [
      /* @__PURE__ */ c(Qe, { orientation: "vertical" }),
      /* @__PURE__ */ w(fe.Root, { children: [
        /* @__PURE__ */ c(fe.Trigger, { children: /* @__PURE__ */ w(me, { variant: "soft", children: [
          T("common:export"),
          /* @__PURE__ */ c(fe.TriggerIcon, {})
        ] }) }),
        /* @__PURE__ */ w(fe.Content, { children: [
          /* @__PURE__ */ w(fe.Item, { onClick: () => W(), children: [
            T("common:export"),
            " PDF"
          ] }),
          /* @__PURE__ */ w(fe.Item, { onClick: () => Q(), children: [
            T("common:export"),
            " Excel"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ w(me, { onClick: ce, children: [
        /* @__PURE__ */ c(Gr, {}),
        T("common:save")
      ] })
    ] });
  };
  return /* @__PURE__ */ c(lo, { accentColor: t, appearance: ee, children: /* @__PURE__ */ c(Oc, { children: /* @__PURE__ */ c(
    Wo.Provider,
    {
      value: {
        defaultOptions: D,
        primaryColor: _
      },
      children: /* @__PURE__ */ w(
        Eo,
        {
          title: n,
          url: s,
          data: r,
          initialScale: f,
          user: l,
          ...R,
          toolbar: F ? void 0 : /* @__PURE__ */ c(Lc, { defaultAnnotationName: "" }),
          hideHeader: !!F,
          hidePageIndicator: !!F,
          defaultActiveSidebarKey: m ? "annotator-sidebar-toggle" : null,
          sidebar: [
            {
              key: "search-sidebar",
              title: T("viewer:search.search"),
              icon: /* @__PURE__ */ c(Rn, { style: { width: 18, height: 18 } }),
              render: (y) => /* @__PURE__ */ c(Qo, { pdfViewer: y.pdfViewer })
            },
            {
              title: T("annotator:sidebar.toggle"),
              key: "annotator-sidebar-toggle",
              icon: /* @__PURE__ */ c(No, { style: { width: 18, height: 18 } }),
              render: () => /* @__PURE__ */ c(_l, {})
            }
          ],
          actions: F ? void 0 : /* @__PURE__ */ c($, {}),
          style: H,
          children: [
            F ? /* @__PURE__ */ c(
              vd,
              {
                Chrome: F,
                onSave: v,
                searchAvailable: j
              }
            ) : null,
            /* @__PURE__ */ c(
              sc,
              {
                onLoad: () => {
                  C?.();
                },
                onAnnotationAdd: (y) => E?.(Nt(y)),
                onAnnotationDelete: (y) => {
                  S?.(y);
                },
                onAnnotationSelected: (y, M) => x?.(y ? Nt(y) : null, M),
                onAnnotationChanged: (y) => N?.(Nt(y)),
                enableNativeAnnotations: p,
                annotations: G,
                annotationPermissions: d,
                defaultShowAnnotationAuthorLabels: h
              }
            )
          ]
        }
      )
    }
  ) }) });
}, yd = ({
  onDocumentLoaded: o,
  onEventBusReady: e
}) => {
  const { isReady: t, pdfViewer: n, eventBus: r, isSidebarCollapsed: s } = je();
  return oe(() => {
    if (!t || !n || !r) return;
    e?.(r);
    const i = async () => {
      o?.(n);
    };
    return n.pdfDocument ? i() : r.on("documentloaded", i), () => {
      r.off("documentloaded", i);
    };
  }, [t, n, r, o, e]), oe(() => {
    r && n && r.dispatch("updateviewarea", { pdfViewer: n });
  }, [s, r, n]), /* @__PURE__ */ c(Se, {});
}, bd = () => {
  const { t: o } = ge("common", { useSuspense: !1 }), { pdfDocument: e } = je(), { printClean: t } = Ao(e);
  return /* @__PURE__ */ c(At, { content: o("common:print"), children: /* @__PURE__ */ c(
    me,
    {
      variant: "outline",
      size: "2",
      color: "gray",
      highContrast: !0,
      style: {
        boxShadow: "none"
      },
      onClick: () => t(),
      children: /* @__PURE__ */ c(Ur, { style: { width: 18, height: 18 } })
    }
  ) });
}, Sd = ({ actions: o }) => {
  const e = je();
  return o ? typeof o == "function" ? o(e) : o : /* @__PURE__ */ c(Se, { children: /* @__PURE__ */ c(K, { gap: "3", align: "center", children: /* @__PURE__ */ c(bd, {}) }) });
}, wd = ({ toolbar: o }) => {
  const e = je();
  return o ? typeof o == "function" ? /* @__PURE__ */ w(K, { gap: "3", align: "center", children: [
    /* @__PURE__ */ c(Kt, {}),
    /* @__PURE__ */ c(Qe, { orientation: "vertical" }),
    o(e)
  ] }) : o : /* @__PURE__ */ c(K, { gap: "3", align: "center", children: /* @__PURE__ */ c(Kt, {}) });
}, Wd = ({
  appearance: o = "auto",
  enableRange: e = "auto",
  title: t = "PDF VIEWER",
  url: n,
  data: r,
  locale: s = "zh-CN",
  pdfjsOptions: i,
  initialScale: a,
  layoutStyle: l,
  theme: d = "violet",
  actions: h,
  sidebar: u,
  toolbar: f,
  showTextLayer: p = !0,
  showAnnotations: g = !1,
  defaultActiveSidebarKey: m,
  onDocumentLoaded: v,
  onEventBusReady: C
}) => {
  const { t: E } = ge(["viewer"], { useSuspense: !1 }), S = Ae(
    () => ({
      textLayerMode: p ? 1 : 0,
      annotationMode: g ? 1 : 0,
      externalLinkTarget: 0,
      enableRange: e,
      pdfjsOptions: i
    }),
    [p, g, e, i]
  );
  oe(() => {
    Ce.changeLanguage(s);
  }, [s]);
  const x = er();
  return /* @__PURE__ */ c(lo, { accentColor: d, appearance: o === "auto" ? x : o, children: /* @__PURE__ */ c(
    Eo,
    {
      title: t,
      url: n,
      data: r,
      sidebar: [{
        key: "search-sidebar",
        title: E("viewer:search.search"),
        icon: /* @__PURE__ */ c(Rn, { style: { width: 18, height: 18 } }),
        render: (H) => /* @__PURE__ */ c(Qo, { pdfViewer: H.pdfViewer })
      }, ...u || []],
      defaultActiveSidebarKey: m,
      toolbar: /* @__PURE__ */ c(wd, { toolbar: f }),
      initialScale: a,
      ...S,
      style: l,
      actions: /* @__PURE__ */ c(Sd, { actions: h }),
      children: /* @__PURE__ */ c(yd, { onEventBusReady: C, onDocumentLoaded: v })
    }
  ) });
};
export {
  jd as PdfAnnotator,
  Wd as PdfViewer
};
