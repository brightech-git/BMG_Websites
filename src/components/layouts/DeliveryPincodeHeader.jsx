import { useId, useRef, useState } from "react";
import { ArrowRight, ChevronDown, MapPin, X } from "lucide-react";
import { usePincode } from "../../context/pinocde/PincodeContext";
import { checkPincodeService } from "../../features/address/api/pincodeChecking";

export default function DeliveryPincodeHeader() {
  const { pincode, updatePincode } = usePincode();
  const id = useId();
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const pendingRef = useRef(null);
  const [draft, setDraft] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");

  function openDialog() {
    setDraft(pincode);
    setError("");
    dialogRef.current.showModal();
    inputRef.current.focus();
  }

  function closeDialog() {
    pendingRef.current = null;
    setIsChecking(false);
    dialogRef.current.close();
    triggerRef.current.focus();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (pendingRef.current) return;
    if (!/^\d{6}$/.test(draft)) {
      setError("Enter a 6-digit PIN code.");
      inputRef.current.focus();
      return;
    }

    const request = {};
    pendingRef.current = request;
    setError("");
    setIsChecking(true);

    try {
      const response = await checkPincodeService(draft);
      if (pendingRef.current !== request) return;
      if (response?.status !== true) {
        setError(response?.message || "Delivery is currently unavailable for this PIN code.");
        return;
      }

      await updatePincode(draft, {
        pincode: draft,
        serviceable: true,
        services: response.data || [],
        checkedAt: new Date().toISOString(),
      });
      if (pendingRef.current === request) closeDialog();
    } catch {
      if (pendingRef.current === request) setError("Couldn’t check delivery. Please try again.");
    } finally {
      if (pendingRef.current === request) {
        pendingRef.current = null;
        setIsChecking(false);
      }
    }
  }

  return (
    <>
      <button ref={triggerRef} type="button" className="flex min-h-11 items-center gap-2.5 rounded-xl border border-orange-200 bg-orange-50 px-3 py-1.5 text-left text-orange-700 hover:bg-orange-100 max-[991px]:w-full" aria-haspopup="dialog"
        aria-controls={id} onClick={openDialog}>
        <MapPin size={18} aria-hidden="true" />
        <span className="grid gap-0.5 whitespace-nowrap leading-tight max-[991px]:flex max-[991px]:flex-1 max-[991px]:flex-wrap max-[991px]:items-baseline max-[991px]:gap-1.5">
          <span className="text-xs">Deliver to</span>
          <strong className="text-sm text-stone-900">{pincode || "Set PIN code"}</strong>
        </span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>

      <dialog ref={dialogRef} id={id} className="fixed inset-0 m-auto h-fit w-[calc(100%-2rem)] max-w-[26rem] max-h-[calc(100dvh-2rem)] overflow-auto rounded-2xl border border-orange-200 bg-white p-0 text-stone-900 shadow-xl backdrop:bg-stone-950/40 max-[540px]:inset-x-0 max-[540px]:bottom-0 max-[540px]:top-auto max-[540px]:m-0 max-[540px]:w-full max-[540px]:max-w-none max-[540px]:max-h-[calc(100dvh-1rem)] max-[540px]:rounded-b-none" aria-labelledby={`${id}-title`}
        onCancel={(event) => { event.preventDefault(); closeDialog(); }}
        onClick={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
        <div className="p-2 sm:p-4 max-[540px]:pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="mb-2 gap-2 flex items-start justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-50 text-orange-700">
              <MapPin size={22} aria-hidden="true" />
            </span>
            <div>    
              <h2 className="mb-1.5 text-lg sm:text-xl font-bold !text-stone-900" id={`${id}-title`}>Delivery PIN code</h2>
              <p id={`${id}-help`} className="text-xs sm:text-sm !text-stone-600">Enter your 6-digit PIN code to check delivery availability.</p>
            </div>
          
           
            <button type="button" className="grid h-11 w-11 place-items-center rounded-xl text-stone-600 hover:bg-orange-50 hover:text-orange-700" onClick={closeDialog} aria-label="Close delivery settings">
              <X size={21} aria-hidden="true" />
            </button>
          </div>
         

          <form className="mt-4 grid gap-2.5" onSubmit={handleSubmit} noValidate>
            <label className="font-bold" htmlFor={`${id}-input`}>PIN code</label>
            <input className="h-12 w-full rounded-xl border border-orange-200 bg-white px-3 py-2 text-base" ref={inputRef} id={`${id}-input`} type="text" inputMode="numeric" autoComplete="postal-code"
              aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`}
              aria-invalid={Boolean(error)} placeholder="e.g. 625001" value={draft} readOnly={isChecking}
              onChange={(event) => {
                setDraft(event.target.value.replace(/\D/g, "").slice(0, 6));
                setError("");
              }} />
            {error && <p id={`${id}-error`} className="text-sm !text-red-700" role="alert">{error}</p>}
            <button type="submit" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-700 px-3 py-2 font-bold text-white enabled:hover:bg-orange-800 disabled:cursor-wait disabled:opacity-75" disabled={isChecking}>
              <span role="status">{isChecking ? "Checking delivery…" : "Check delivery"}</span>
              {!isChecking && <ArrowRight size={18} aria-hidden="true" />}
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
