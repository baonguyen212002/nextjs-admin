
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Supported locales - ensure this matches middleware.ts
const locales = ['en', 'vi'];

// Minimal messages defined directly in the file for diagnostics
const messagesData: Record<string, any> = {
  en: {
    AppHeader: {
      adminDashboardTitle: "Admin Dashboard (EN Config)",
      notificationsLabel: "Notifications (EN)",
      userMenuLabel: "User menu (EN)",
      myAccountDropdown: "My Account (EN)",
      profileDropdown: "Profile (EN)",
      settingsDropdown: "Settings (EN)",
      logoutDropdown: "Logout (EN)",
      liveClockLoading: "Loading time... (EN)"
    },
    AppSidebar: { // Add keys for AppSidebar as it uses useTranslations
      dashboard: "Dashboard (EN)",
      manageData: "Manage Data (EN)",
      uploadItems: "Upload Items (EN)",
      userManagement: "User Management (EN)",
      settings: "Settings (EN)",
      support: "Support (EN)",
      logout: "Logout (EN)",
      toggleSidebarTooltip: "Toggle Sidebar (EN)"
    },
    DashboardPage: { // Add keys for DashboardPage
        welcomeBannerTitle: "Welcome Back, Admin! (EN Config)",
        welcomeBannerMessage: "Here's a summary of recent activity. (EN)",
        recentActivitiesTitle: "Recent Activities (EN)",
        recentActivitiesDescription: "What's been happening in the system. (EN)",
        quickLinksTitle: "Quick Links (EN)",
        quickLinksDescription: "Commonly used actions and resources. (EN)",
        manageAllDataLink: "Manage All Data (EN)",
        uploadNewItemLink: "Upload New Item (EN)",
        userManagementLink: "User Management (EN)",
        viewReportsLink: "View Reports (EN)"
    },
    // Add other namespaces and keys as used by your components
    GeneralSettingsForm: {
        siteNameLabel: "Site Name (EN)",
        defaultLanguageLabel: "Default Language (EN)",
        timezoneLabel: "Timezone (EN)",
        saveSettingsButton: "Save Settings (EN)",
        savingSettingsButton: "Saving... (EN)",
        settingsSavedToastTitle: "Settings Saved! (EN)",
        settingsSavedToastDescription: "Your general settings have been updated. (EN)"
    },
    GeneralSettingsPage: {
        title: "General Settings (EN)",
        description: "Manage general application settings. (EN)"
    },
    AppearanceSettingsPage: {
        title: "Appearance Settings (EN)",
        description: "Customize the look and feel. (EN)"
    },
    UserManagementPage: {
        title: "User Management (EN)",
        description: "Manage all users in the system. (EN)"
    },
    SettingsPage: {
        title: "Application Settings (EN)",
        description: "Manage various settings. (EN)",
        generalSettingsLink: "General Settings (EN)",
        appearanceSettingsLink: "Appearance (EN)"
    },
     ManageDataPage: {
        title: "Manage Data (EN)",
        description: "View, create, edit, and delete data items. (EN)"
    }
  },
  vi: {
    AppHeader: {
      adminDashboardTitle: "Trang quản trị (VI Config)",
      notificationsLabel: "Thông báo (VI)",
      userMenuLabel: "Menu người dùng (VI)",
      myAccountDropdown: "Tài khoản của tôi (VI)",
      profileDropdown: "Hồ sơ (VI)",
      settingsDropdown: "Cài đặt (VI)",
      logoutDropdown: "Đăng xuất (VI)",
      liveClockLoading: "Đang tải giờ... (VI)"
    },
    AppSidebar: {
      dashboard: "Bảng điều khiển (VI)",
      manageData: "Quản lý dữ liệu (VI)",
      uploadItems: "Tải lên mục (VI)",
      userManagement: "Quản lý người dùng (VI)",
      settings: "Cài đặt (VI)",
      support: "Hỗ trợ (VI)",
      logout: "Đăng xuất (VI)",
      toggleSidebarTooltip: "Chuyển đổi thanh bên (VI)"
    },
    DashboardPage: {
        welcomeBannerTitle: "Chào mừng trở lại, Quản trị viên! (VI Config)",
        welcomeBannerMessage: "Đây là bản tóm tắt hoạt động gần đây. (VI)",
        recentActivitiesTitle: "Hoạt động gần đây (VI)",
        recentActivitiesDescription: "Những gì đã xảy ra trong hệ thống. (VI)",
        quickLinksTitle: "Liên kết nhanh (VI)",
        quickLinksDescription: "Các hành động và tài nguyên thường được sử dụng. (VI)",
        manageAllDataLink: "Quản lý tất cả dữ liệu (VI)",
        uploadNewItemLink: "Tải lên mục mới (VI)",
        userManagementLink: "Quản lý người dùng (VI)",
        viewReportsLink: "Xem báo cáo (VI)"
    },
    GeneralSettingsForm: {
        siteNameLabel: "Tên trang web (VI)",
        defaultLanguageLabel: "Ngôn ngữ mặc định (VI)",
        timezoneLabel: "Múi giờ (VI)",
        saveSettingsButton: "Lưu cài đặt (VI)",
        savingSettingsButton: "Đang lưu... (VI)",
        settingsSavedToastTitle: "Đã lưu cài đặt! (VI)",
        settingsSavedToastDescription: "Cài đặt chung của bạn đã được cập nhật. (VI)"
    },
    GeneralSettingsPage: {
        title: "Cài đặt chung (VI)",
        description: "Quản lý các cài đặt chung của ứng dụng. (VI)"
    },
    AppearanceSettingsPage: {
        title: "Cài đặt giao diện (VI)",
        description: "Tùy chỉnh giao diện và cảm nhận. (VI)"
    },
    UserManagementPage: {
        title: "Quản lý người dùng (VI)",
        description: "Quản lý tất cả người dùng trong hệ thống. (VI)"
    },
    SettingsPage: {
        title: "Cài đặt ứng dụng (VI)",
        description: "Quản lý các cài đặt khác nhau. (VI)",
        generalSettingsLink: "Cài đặt chung (VI)",
        appearanceSettingsLink: "Giao diện (VI)"
    },
    ManageDataPage: {
        title: "Quản lý dữ liệu (VI)",
        description: "Xem, tạo, chỉnh sửa và xóa các mục dữ liệu. (VI)"
    }
  }
};

export default getRequestConfig(async ({locale}) => {
  console.log(`[next-intl] i18n.ts: Request received for locale "${locale}".`);
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    console.warn(`[next-intl] i18n.ts: Invalid locale "${locale}" received. Calling notFound().`);
    notFound();
  }

  const localeMessages = messagesData[locale];

  if (!localeMessages) {
    // This should ideally not be reached if the above validation works.
    console.error(`[next-intl] i18n.ts: CRITICAL - No messages found for locale "${locale}" in messagesData. This should not happen. Calling notFound().`);
    notFound();
  }
  
  console.log(`[next-intl] i18n.ts: Successfully providing messages for locale "${locale}". Keys: ${Object.keys(localeMessages).join(', ')}`);
  return {
    messages: localeMessages
  };
});
