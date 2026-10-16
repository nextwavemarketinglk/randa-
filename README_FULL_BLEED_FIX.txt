RandA Tours - responsive hero background fix (16 Oct 2026)

FIX: Slideshow layers were inside the .ref-container constrained to viewport width minus margins. This created the visible dark side strips / inset image seen on mobile. The slideshow layers have been moved into the full-width .ref-hero as direct children.

Preserved: 3-image automatic crossfade; black/gold colors; search panel tabs and controls; country/positive/negative review filters; review auto movement; tour package pages; all content.

Install: extract the ZIP and upload the CONTENTS of this folder to the same repository branch (replace matching files); then hard-refresh / clear hosting cache. Do not nest the folder in the hosting root.

NOTE: WhatsApp number/email/contact details still require accurate client-approved values in assets/js/config.js.
