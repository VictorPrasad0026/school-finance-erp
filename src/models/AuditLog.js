const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: String,
    module: String,
    entityId: mongoose.Schema.Types.ObjectId,
    entityType: String,
    changes: mongoose.Schema.Types.Mixed,
    oldValues: mongoose.Schema.Types.Mixed,
    newValues: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

auditLogSchema.index({ schoolId: 1, timestamp: -1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
