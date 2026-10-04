import { Component, type ReactNode } from "react";
export default class ErrorBoundary extends Component<
  { children: ReactNode; hasDraft?: boolean },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <div className="page-error" role="alert">
          <h2>This view could not load</h2>
          <p>
            Check your connection and reload. Saved drafts remain in this
            browser.{" "}
            {this.props.hasDraft &&
              "Download any unsaved draft above before reloading."}
          </p>
          <button onClick={() => location.reload()}>Reload page</button>
          <a href="#/problems">Back to problems</a>
        </div>
      );
    return this.props.children;
  }
}
