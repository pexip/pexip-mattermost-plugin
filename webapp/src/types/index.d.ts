import { Action } from "redux";
import { Component } from "react";

declare global {
  interface Window {
      registerPlugin(id: string, plugin: any): void
  }
}

export interface RHSPlugin {
  id: string;
  showRHSPlugin: Action<Record<string, unknown>>;
  hideRHSPlugin: Action<Record<string, unknown>>;
  toggleRHSPlugin: Action<Record<string, unknown>>;
}

export interface PluginRegistry {
  registerChannelHeaderButtonAction(icon: JSX.Element, action: Function, dropdownText: string, tooltip?: string): void;
  registerRightHandSidebarComponent(component: Component, title: string | JSX.Element): RHSPlugin;
}