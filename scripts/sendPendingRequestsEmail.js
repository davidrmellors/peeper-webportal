var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
// Firebase config
var firebaseConfig = {
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    apiKey: process.env.FIREBASE_API_KEY,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};
// Initialize Firebase
var app = initializeApp(firebaseConfig);
var database = getDatabase(app);
// Initialize SendGrid
var sendGridApiKey = process.env.SENDGRID_API_KEY;
if (!sendGridApiKey) {
    throw new Error('SENDGRID_API_KEY is not defined');
}
sgMail.setApiKey(sendGridApiKey);
function sendPendingRequestsEmail() {
    return __awaiter(this, void 0, void 0, function () {
        var orgRequestsRef, snapshot, allRequests, pendingRequests, adminsRef, adminSnapshot, admins, superAdmin, requestList, msg, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    orgRequestsRef = ref(database, 'orgRequests');
                    return [4 /*yield*/, get(orgRequestsRef)];
                case 1:
                    snapshot = _a.sent();
                    if (!snapshot.exists()) {
                        console.log('No requests found');
                        return [2 /*return*/];
                    }
                    allRequests = snapshot.val();
                    pendingRequests = Object.values(allRequests)
                        .filter(function (request) { return request.approvalStatus === 0; });
                    if (pendingRequests.length === 0) {
                        console.log('No pending requests found');
                        return [2 /*return*/];
                    }
                    adminsRef = ref(database, 'admins');
                    return [4 /*yield*/, get(adminsRef)];
                case 2:
                    adminSnapshot = _a.sent();
                    if (!adminSnapshot.exists()) {
                        console.log('No admins found');
                        return [2 /*return*/];
                    }
                    admins = Object.values(adminSnapshot.val());
                    superAdmin = admins.find(function (admin) { return admin.type === 'SuperAdmin'; });
                    if (!superAdmin) {
                        console.log('No superadmin found');
                        return [2 /*return*/];
                    }
                    requestList = pendingRequests
                        .map(function (request) { return "<li>Organisation: ".concat(request.name, ", Email: ").concat(request.email, "</li>"); })
                        .join('');
                    msg = {
                        to: superAdmin.email,
                        from: 'peeper.tracking@gmail.com',
                        subject: 'Pending Organisation Requests',
                        html: "\n                <h1>Pending Organisation Requests</h1>\n                <p>The following organisations have requested to join the platform:</p>\n                <ul>".concat(requestList, "</ul>\n                <p>Please review these requests at your dashboard.</p>\n            "),
                    };
                    return [4 /*yield*/, sgMail.send(msg)];
                case 3:
                    _a.sent();
                    console.log('Email sent successfully to superadmin');
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error sending email:', error_1);
                    throw error_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
void sendPendingRequestsEmail();
