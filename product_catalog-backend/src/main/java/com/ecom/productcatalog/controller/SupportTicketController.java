package com.ecom.productcatalog.controller;

import com.ecom.productcatalog.dto.ApiResponse;
import com.ecom.productcatalog.dto.SupportReplyRequest;
import com.ecom.productcatalog.dto.SupportTicketDTO;
import com.ecom.productcatalog.dto.SupportTicketRequest;
import com.ecom.productcatalog.service.SupportTicketService;
import com.ecom.productcatalog.dto.TicketStatusRequest;
import com.ecom.productcatalog.dto.TicketPriorityRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
@CrossOrigin(
        origins = {
                "https://techstore-catalog.vercel.app",
                "http://localhost:5173"
        }
)
public class SupportTicketController {

    private final SupportTicketService supportTicketService;

    public SupportTicketController(
            SupportTicketService supportTicketService
    ) {
        this.supportTicketService = supportTicketService;
    }

    // =========================================================
    // CUSTOMER - CREATE SUPPORT TICKET
    // POST /api/support/tickets
    // =========================================================

    @PostMapping("/tickets")
    public ResponseEntity<ApiResponse<?>> createTicket(
            @RequestBody SupportTicketRequest request
    ) {

        try {

            if (request == null) {

                return ResponseEntity.badRequest().body(
                        ApiResponse.error(
                                "Support ticket data is required"
                        )
                );
            }

            if (request.getEmail() == null ||
                    request.getEmail().trim().isEmpty()) {

                return ResponseEntity.badRequest().body(
                        ApiResponse.error(
                                "Email is required"
                        )
                );
            }

            if (request.getCategory() == null ||
                    request.getCategory().trim().isEmpty()) {

                return ResponseEntity.badRequest().body(
                        ApiResponse.error(
                                "Support category is required"
                        )
                );
            }

            if (request.getSubject() == null ||
                    request.getSubject().trim().isEmpty()) {

                return ResponseEntity.badRequest().body(
                        ApiResponse.error(
                                "Subject is required"
                        )
                );
            }

            if (request.getMessage() == null ||
                    request.getMessage().trim().isEmpty()) {

                return ResponseEntity.badRequest().body(
                        ApiResponse.error(
                                "Message is required"
                        )
                );
            }

            SupportTicketDTO savedTicket =
                    supportTicketService.createTicket(request);

            return ResponseEntity.ok(
                    ApiResponse.success(
                            "Support ticket created successfully",
                            savedTicket
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(
                    ApiResponse.error(
                            e.getMessage()
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(
                            "Error creating support ticket: "
                                    + e.getMessage()
                    )
            );
        }
    }

    // =========================================================
    // CUSTOMER / ADMIN - GET SINGLE TICKET
    // GET /api/support/tickets/{id}
    // =========================================================

    @GetMapping("/tickets/{id}")
    public ResponseEntity<ApiResponse<?>> getTicketById(
            @PathVariable Long id
    ) {

        try {

            SupportTicketDTO ticket =
                    supportTicketService.getTicketById(id);

            return ResponseEntity.ok(
                    ApiResponse.success(
                            "Support ticket fetched successfully",
                            ticket
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.status(404).body(
                    ApiResponse.error(
                            e.getMessage()
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(
                            "Error fetching support ticket: "
                                    + e.getMessage()
                    )
            );
        }
    }

    // =========================================================
    // CUSTOMER - GET TICKETS BY EMAIL
    // GET /api/support/tickets/customer?email=...
    // =========================================================

    @GetMapping("/tickets/customer")
    public ResponseEntity<ApiResponse<?>> getTicketsByEmail(
            @RequestParam String email
    ) {

        try {

            if (email == null ||
                    email.trim().isEmpty()) {

                return ResponseEntity.badRequest().body(
                        ApiResponse.error(
                                "Email is required"
                        )
                );
            }

            List<SupportTicketDTO> tickets =
                    supportTicketService.getTicketsByEmail(email);

            return ResponseEntity.ok(
                    ApiResponse.success(
                            "Customer tickets fetched successfully",
                            tickets
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(
                    ApiResponse.error(
                            e.getMessage()
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(
                            "Error fetching customer tickets: "
                                    + e.getMessage()
                    )
            );
        }
    }

    // =========================================================
    // ADMIN - GET ALL TICKETS
    // GET /api/support/admin/tickets
    // =========================================================

    @GetMapping("/admin/tickets")
    public ResponseEntity<ApiResponse<?>> getAllTickets() {

        try {

            List<SupportTicketDTO> tickets =
                    supportTicketService.getAllTickets();

            return ResponseEntity.ok(
                    ApiResponse.success(
                            "Support tickets fetched successfully",
                            tickets
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(
                            "Error fetching support tickets: "
                                    + e.getMessage()
                    )
            );
        }
    }

    // =========================================================
    // ADMIN - GET TICKETS BY STATUS
    // GET /api/support/admin/tickets/status/{status}
    // =========================================================

    @GetMapping("/admin/tickets/status/{status}")
    public ResponseEntity<ApiResponse<?>> getTicketsByStatus(
            @PathVariable String status
    ) {

        try {

            if (status == null ||
                    status.trim().isEmpty()) {

                return ResponseEntity.badRequest().body(
                        ApiResponse.error(
                                "Status is required"
                        )
                );
            }

            List<SupportTicketDTO> tickets =
                    supportTicketService.getTicketsByStatus(status);

            return ResponseEntity.ok(
                    ApiResponse.success(
                            "Support tickets fetched successfully",
                            tickets
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(
                    ApiResponse.error(
                            e.getMessage()
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(
                            "Error fetching support tickets: "
                                    + e.getMessage()
                    )
            );
        }
    }

    // =========================================================
    // ADMIN - UPDATE STATUS
    //
    // PUT /api/support/admin/tickets/{id}/status
    //
    // React sends:
    //
    // {
    //     "status": "IN_PROGRESS"
    // }
    // =========================================================

    @PutMapping("/admin/tickets/{id}/status")
    public ResponseEntity<ApiResponse<?>> updateStatus(
            @PathVariable Long id,
            @RequestBody TicketStatusRequest request
    ) {

        try {

            if (request == null ||
                    request.getStatus() == null ||
                    request.getStatus().trim().isEmpty()) {

                return ResponseEntity.badRequest().body(
                        ApiResponse.error(
                                "Status is required"
                        )
                );
            }

            SupportTicketDTO updated =
                    supportTicketService.updateStatus(
                            id,
                            request.getStatus()
                    );

            return ResponseEntity.ok(
                    ApiResponse.success(
                            "Ticket status updated successfully",
                            updated
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(
                    ApiResponse.error(
                            e.getMessage()
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(
                            "Error updating ticket status: "
                                    + e.getMessage()
                    )
            );
        }
    }

    // =========================================================
    // ADMIN - UPDATE PRIORITY
    //
    // PUT /api/support/admin/tickets/{id}/priority
    //
    // React sends:
    //
    // {
    //     "priority": "HIGH"
    // }
    // =========================================================

    @PutMapping("/admin/tickets/{id}/priority")
    public ResponseEntity<ApiResponse<?>> updatePriority(
            @PathVariable Long id,
            @RequestBody TicketPriorityRequest request
    ) {

        try {

            if (request == null ||
                    request.getPriority() == null ||
                    request.getPriority().trim().isEmpty()) {

                return ResponseEntity.badRequest().body(
                        ApiResponse.error(
                                "Priority is required"
                        )
                );
            }

            SupportTicketDTO updated =
                    supportTicketService.updatePriority(
                            id,
                            request.getPriority()
                    );

            return ResponseEntity.ok(
                    ApiResponse.success(
                            "Ticket priority updated successfully",
                            updated
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(
                    ApiResponse.error(
                            e.getMessage()
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(
                            "Error updating ticket priority: "
                                    + e.getMessage()
                    )
            );
        }
    }

    // =========================================================
    // ADMIN - REPLY TO CUSTOMER
    //
    // POST /api/support/admin/tickets/{id}/reply
    //
    // React sends:
    //
    // {
    //     "message": "We have resolved your issue."
    // }
    // =========================================================

    @PostMapping("/admin/tickets/{id}/reply")
    public ResponseEntity<ApiResponse<?>> replyToTicket(
            @PathVariable Long id,
            @RequestBody SupportReplyRequest request
    ) {

        try {

            if (request == null ||
                    request.getMessage() == null ||
                    request.getMessage().trim().isEmpty()) {

                return ResponseEntity.badRequest().body(
                        ApiResponse.error(
                                "Reply message is required"
                        )
                );
            }

            SupportTicketDTO updated =
                    supportTicketService.replyToTicket(
                            id,
                            request.getMessage()
                    );

            return ResponseEntity.ok(
                    ApiResponse.success(
                            "Reply sent successfully",
                            updated
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(
                    ApiResponse.error(
                            e.getMessage()
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(
                            "Error sending reply: "
                                    + e.getMessage()
                    )
            );
        }
    }

    // =========================================================
    // ADMIN - DELETE TICKET
    //
    // DELETE /api/support/admin/tickets/{id}
    // =========================================================

    @DeleteMapping("/admin/tickets/{id}")
    public ResponseEntity<ApiResponse<?>> deleteTicket(
            @PathVariable Long id
    ) {

        try {

            supportTicketService.deleteTicket(id);

            return ResponseEntity.ok(
                    ApiResponse.success(
                            "Support ticket deleted successfully",
                            null
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.status(404).body(
                    ApiResponse.error(
                            e.getMessage()
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(
                            "Error deleting support ticket: "
                                    + e.getMessage()
                    )
            );
        }
    }
}