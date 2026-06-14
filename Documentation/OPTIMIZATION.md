# Performance & CLS Optimization Documentation

This document logs all the performance and Cumulative Layout Shift (CLS) optimization steps taken to enhance the Synibe web application.

---

## 1. Landing Page Performance Optimization

### The Problem
During initial page load of `/`, the browser fetched and compiled all below-the-fold components statically. These components (`PhoneShowcase`, `StoryTelling`, `AudioAnimation`, `HowItWorks`, `FAQ`, and `Footer`) contained heavy animation libraries (GSAP, ScrollTrigger) and multiple HTML5 `<video>` tags—including four separate instances referencing a heavy 54MB background video (`/Videos/musicplayer.mp4`). This led to an initial First Contentful Paint (FCP) of **2.3s** and massive bandwidth consumption.

### The Solutions Implemented

#### A. Viewport-Based Lazy Loading Component
Created a reusable viewport observer component: [LazySection.tsx](file:///c:/Projects/synibe/app/Components/LazySection.tsx)
- Implements the browser `IntersectionObserver` API to monitor elements.
- Defers mounting children until the user scrolls within `200px` of the section.
- Holds layout dimensions using responsive tailwind min-height classes to eliminate layout shifts before, during, and after rendering.

#### B. Landing Page Code Splitting
Modified [page.tsx](file:///c:/Projects/synibe/app/page.tsx):
- Dynamic imports utilizing Next.js `dynamic()` with `{ ssr: false }` for below-the-fold segments:
  ```tsx
  const PhoneShowcase = dynamic(() => import("./Components/Landing/PhoneShowcase"), { ssr: false });
  ```
- Wrapped dynamic components with `<LazySection className="...">` using matching min-height class configurations.

#### C. Smart Step Video preloading
Modified [HowItWorks.tsx](file:///c:/Projects/synibe/app/Components/Landing/HowItWorks.tsx):
- Kept track of loaded steps using a React state array (`loadedSteps`).
- Configured dynamic video rendering:
  ```tsx
  src={isLoaded ? step.video : undefined}
  preload={isLoaded ? "auto" : "none"}
  ```
- Only the active step (Step 1) loads video files on initial scroll. Additional step videos are fetched on-demand when hovered or clicked, saving significant Cloudinary bandwidth.

#### D. Connection & SEO Cleanups
Modified [layout.tsx](file:///c:/Projects/synibe/app/layout.tsx):
- Removed unused `<link rel="preconnect" href="https://prod.spline.design" />` header links.
- Updated title and description meta tags for optimized search engine visibility (SEO).

---

## 2. Cumulative Layout Shift (CLS) Optimizations

### The Problem
- **Landing Page**: When dynamic chunks loaded, the container collapsed to `0px` before mounting the children, causing visual jumps.
- **Create Room Page (`/create-room/new`)**: The page suspends on `useSearchParams()`. The fallback was a screen-centered loading spinner. When hydrated, the entire spinner collapsed and swapped for the form grid, creating a high CLS score of `3.82`.
- **Access Hash Shift**: The access hash was generated client-side inside a `useEffect`. Initially, the container was empty (`""`) and then grew to `"SNB-481-B"`, shifting all fields below it.

### The Solutions Implemented

#### A. Dynamic Loading Fallbacks (Landing Page)
Configured matching skeleton loader heights inside all `dynamic()` calls:
```tsx
const PhoneShowcase = dynamic(() => import("./Components/Landing/PhoneShowcase"), {
  ssr: false,
  loading: () => <div className="min-h-[1400px] lg:min-h-screen w-full" />,
});
```
This preserves the exact layout height before, during, and after chunk loading, ensuring **0px of layout shift** during scroll.

#### B. Create Room Page Skeleton Fallback
Modified [page.tsx](file:///c:/Projects/synibe/app/create-room/new/page.tsx):
- Designed a custom `NewRoomSkeleton` replicating the page's exact double-column card and form grid structure.
- Swapped out the basic spinner fallback for `<NewRoomSkeleton />`. The inputs load directly into pre-allocated slots with no shift.

#### C. Access Hash Text Spacer
Updated the access hash container:
```tsx
<div className="flex items-center gap-3 h-10">
  <span className={`text-xl ... ${accessHash ? "text-white" : "text-white/20 animate-pulse"}`}>
    {accessHash || "SNB-000-A"}
  </span>
</div>
```
Displays a low-opacity gray placeholder (`SNB-000-A`) to reserve width and height before generator initialization.

#### D. Image Sizes Prop
Added the `sizes` attribute to the Host character `<Image>` inside `/create-room/new/page.tsx`:
```tsx
sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
```
Resolves responsive image performance layout warnings.

---

## 3. Results Summary

- **JS Bundle Size**: Reduced significantly by splitting dynamic landing page components out of the initial bundle.
- **Initial Request Volume**: Postponed loading of the 54MB hero video and 3/4 Cloudinary videos until they enter the viewport.
- **Layout Shift (CLS)**: Visual shifts on `/` and `/create-room/new` are reduced to ~0.
