import React, { useMemo } from "react";
import objectPath from "object-path";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { SearchDropdown } from "../extras/dropdowns/search/SearchDropdown";
import { UserNotificationsDropdown } from "../extras/dropdowns/UserNotificationsDropdown";
import { QuickActionsDropdown } from "../extras/dropdowns/QuickActionsDropdown";
import { LanguageSelectorDropdown } from "../extras/dropdowns/LanguageSelectorDropdown";
import { QuickUserToggler } from "../extras/QuiclUserToggler";

export function Topbar() {
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      viewSearchDisplay: objectPath.get(
        uiService.config,
        "extras.search.display"
      ),
      viewNotificationsDisplay: objectPath.get(
        uiService.config,
        "extras.notifications.display"
      ),
      viewQuickActionsDisplay: objectPath.get(
        uiService.config,
        "extras.quick-actions.display"
      ),
      viewCartDisplay: objectPath.get(uiService.config, "extras.cart.display"),
      viewQuickPanelDisplay: objectPath.get(
        uiService.config,
        "extras.quick-panel.display"
      ),
      viewLanguagesDisplay: objectPath.get(
        uiService.config,
        "extras.languages.display"
      ),
      viewUserDisplay: objectPath.get(uiService.config, "extras.user.display"),
    };
  }, [uiService]);

  return (
    <div className="topbar">
      {layoutProps.viewSearchDisplay && <SearchDropdown />}

      {layoutProps.viewNotificationsDisplay && <UserNotificationsDropdown />}

      {layoutProps.viewQuickActionsDisplay && <QuickActionsDropdown />}
      
      {layoutProps.viewLanguagesDisplay && <LanguageSelectorDropdown />}

      {layoutProps.viewUserDisplay && <QuickUserToggler />}
    </div>
  );
}
