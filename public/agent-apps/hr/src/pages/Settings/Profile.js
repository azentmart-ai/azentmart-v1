const _jsxFileName = "/mnt/data/work/base/main/hr-frontend/frontend/src/pages/Settings/Profile.jsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import React from "react";
import {
  User,
  Mail,
  Building2,
  ShieldCheck,
  CalendarDays,
  BriefcaseBusiness,
  MapPin,
  Phone,
  KeyRound,
  Activity,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.js";
export default function Profile() {
  const { user } = useAuth();

  const role = _optionalChain([user, 'optionalAccess', _ => _.role]) || "Employee";
  const department = _optionalChain([user, 'optionalAccess', _2 => _2.department]) || "Not assigned";

  return (
    React.createElement('div', { className: "profile-page", __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}

      /* =====================================================
          HEADER
      ===================================================== */

      , React.createElement('div', { className: "profile-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}}

        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 32}}
          , React.createElement('span', { className: "profile-kicker", __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}}, "ACCOUNT MANAGEMENT"

          )

          , React.createElement('h1', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 37}}, "My Profile" )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 39}}, "Manage your account information and review your People Operations access details."


          )
        )

      )


      /* =====================================================
          PROFILE HERO
      ===================================================== */

      , React.createElement('section', { className: "profile-hero", __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}

        , React.createElement('div', { className: "profile-avatar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}
          , _optionalChain([user, 'optionalAccess', _3 => _3.name, 'optionalAccess', _4 => _4.charAt, 'call', _5 => _5(0), 'optionalAccess', _6 => _6.toUpperCase, 'call', _7 => _7()]) || "U"
        )

        , React.createElement('div', { className: "profile-identity", __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}

          , React.createElement('div', { className: "profile-name-row", __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}

            , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}
              , _optionalChain([user, 'optionalAccess', _8 => _8.name]) || "Employee"
            )

            , React.createElement('span', { className: "profile-active", __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 67}} ), "Active"

            )

          )

          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}
            , _optionalChain([user, 'optionalAccess', _9 => _9.email]) || "No email available"
          )

          , React.createElement('div', { className: "profile-meta", __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}
              , React.createElement(BriefcaseBusiness, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}} )
              , role
            )

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}
              , React.createElement(Building2, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}} )
              , department
            )

            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}
              , React.createElement(MapPin, { size: 13, __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}} ), "People Operations"

            )

          )

        )

        , React.createElement('div', { className: "profile-security-status", __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}

          , React.createElement(ShieldCheck, { size: 18, __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}} )

          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}
            , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}, "Account protected" )
            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 104}}, "Standard security controls enabled"   )
          )

        )

      )


      /* =====================================================
          MAIN CONTENT
      ===================================================== */

      , React.createElement('div', { className: "profile-grid", __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}

        /* ACCOUNT INFORMATION */

        , React.createElement('section', { className: "profile-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}

          , React.createElement('div', { className: "profile-card-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}

            , React.createElement('div', { className: "profile-card-icon blue" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}
              , React.createElement(User, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}} )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 128}}
              , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}, "Account information" )

              , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}, "Basic information associated with your HR workspace account."


              )
            )

          )


          , React.createElement('div', { className: "profile-fields", __self: this, __source: {fileName: _jsxFileName, lineNumber: 140}}

            , React.createElement(ProfileField, {
              icon: React.createElement(User, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}} ),
              label: "Full name" ,
              value: _optionalChain([user, 'optionalAccess', _10 => _10.name]) || "Not available", __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}
            )

            , React.createElement(ProfileField, {
              icon: React.createElement(Mail, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 149}} ),
              label: "Email address" ,
              value: _optionalChain([user, 'optionalAccess', _11 => _11.email]) || "Not available", __self: this, __source: {fileName: _jsxFileName, lineNumber: 148}}
            )

            , React.createElement(ProfileField, {
              icon: React.createElement(Building2, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 155}} ),
              label: "Department",
              value: department, __self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}
            )

            , React.createElement(ProfileField, {
              icon: React.createElement(ShieldCheck, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}} ),
              label: "System role" ,
              value: role, __self: this, __source: {fileName: _jsxFileName, lineNumber: 160}}
            )

            , React.createElement(ProfileField, {
              icon: React.createElement(Phone, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 167}} ),
              label: "Phone number" ,
              value: "Not configured" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 166}}
            )

            , React.createElement(ProfileField, {
              icon: React.createElement(MapPin, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}} ),
              label: "Work location" ,
              value: "Not configured" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 172}}
            )

          )

        )


        /* ACCESS INFORMATION */

        , React.createElement('section', { className: "profile-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}}

          , React.createElement('div', { className: "profile-card-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}

            , React.createElement('div', { className: "profile-card-icon purple" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 189}}
              , React.createElement(KeyRound, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 190}} )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 193}}
              , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 194}}, "Access & permissions"  )

              , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}, "Current role-based access assigned to your account."


              )
            )

          )


          , React.createElement('div', { className: "access-list", __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}

            , React.createElement(AccessRow, {
              icon: React.createElement(ShieldCheck, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 208}} ),
              title: "Role access" ,
              value: role,
              status: "Active", __self: this, __source: {fileName: _jsxFileName, lineNumber: 207}}
            )

            , React.createElement(AccessRow, {
              icon: React.createElement(Building2, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 215}} ),
              title: "Department",
              value: department,
              status: "Assigned", __self: this, __source: {fileName: _jsxFileName, lineNumber: 214}}
            )

            , React.createElement(AccessRow, {
              icon: React.createElement(Activity, { size: 15, __self: this, __source: {fileName: _jsxFileName, lineNumber: 222}} ),
              title: "Account status" ,
              value: "Active",
              status: "Verified", __self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}
            )

          )

        )


        /* ACCOUNT ACTIVITY */

        , React.createElement('section', { className: "profile-card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 235}}

          , React.createElement('div', { className: "profile-card-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 237}}

            , React.createElement('div', { className: "profile-card-icon green" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 239}}
              , React.createElement(Activity, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 240}} )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 243}}
              , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}, "Account activity" )

              , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 246}}, "Important account and workspace information."

              )
            )

          )


          , React.createElement('div', { className: "activity-information", __self: this, __source: {fileName: _jsxFileName, lineNumber: 254}}

            , React.createElement('div', { className: "activity-info-row", __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}}

              , React.createElement(CalendarDays, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 258}} )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 260}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 261}}, "Account created" )
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 262}}, "Managed by HR Administration"   )
              )

            )


            , React.createElement('div', { className: "activity-info-row", __self: this, __source: {fileName: _jsxFileName, lineNumber: 268}}

              , React.createElement(CheckCircle2, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}} )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 273}}, "Account status" )
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 274}}, "Active and available"  )
              )

            )


            , React.createElement('div', { className: "activity-info-row", __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}

              , React.createElement(ShieldCheck, { size: 16, __self: this, __source: {fileName: _jsxFileName, lineNumber: 282}} )

              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}
                , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}, "Security")
                , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 286}}, "Role-based access enabled"  )
              )

            )

          )

        )


        /* SECURITY */

        , React.createElement('section', { className: "profile-card security-card" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}}

          , React.createElement('div', { className: "profile-card-header", __self: this, __source: {fileName: _jsxFileName, lineNumber: 300}}

            , React.createElement('div', { className: "profile-card-icon orange" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 302}}
              , React.createElement(KeyRound, { size: 17, __self: this, __source: {fileName: _jsxFileName, lineNumber: 303}} )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 306}}
              , React.createElement('h2', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}, "Security")

              , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}, "Keep your HR workspace account protected."

              )
            )

          )


          , React.createElement('div', { className: "security-box", __self: this, __source: {fileName: _jsxFileName, lineNumber: 317}}

            , React.createElement(ShieldCheck, { size: 20, __self: this, __source: {fileName: _jsxFileName, lineNumber: 319}} )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}

              , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 323}}, "Role-based security enabled"  )

              , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 325}}, "Your access to employee information, HR workflows and administration features is controlled by your assigned role."



              )

            )

          )

        )

      )


      /* FOOTER */

      , React.createElement('div', { className: "profile-footer", __self: this, __source: {fileName: _jsxFileName, lineNumber: 342}}

        , React.createElement(ShieldCheck, { size: 14, __self: this, __source: {fileName: _jsxFileName, lineNumber: 344}} )

        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 346}}, "Profile information is managed within the AzentMart People Operations workspace."


        )

      )

    )
  );
}


/* ============================================================
   PROFILE FIELD
============================================================ */

function ProfileField({
  icon,
  label,
  value,
}) {
  return (
    React.createElement('div', { className: "profile-field", __self: this, __source: {fileName: _jsxFileName, lineNumber: 368}}

      , React.createElement('div', { className: "profile-field-label", __self: this, __source: {fileName: _jsxFileName, lineNumber: 370}}

        , React.createElement('span', { className: "field-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 372}}
          , icon
        )

        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 376}}, label)

      )

      , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 380}}, value)

    )
  );
}


/* ============================================================
   ACCESS ROW
============================================================ */

function AccessRow({
  icon,
  title,
  value,
  status,
}) {
  return (
    React.createElement('div', { className: "access-row", __self: this, __source: {fileName: _jsxFileName, lineNumber: 398}}

      , React.createElement('span', { className: "access-icon", __self: this, __source: {fileName: _jsxFileName, lineNumber: 400}}
        , icon
      )

      , React.createElement('div', { className: "access-main", __self: this, __source: {fileName: _jsxFileName, lineNumber: 404}}

        , React.createElement('strong', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 406}}, title)

        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 408}}, value)

      )

      , React.createElement('span', { className: "access-status", __self: this, __source: {fileName: _jsxFileName, lineNumber: 412}}
        , status
      )

    )
  );
}