; Copyright 2014, runtime.js project authors. All rights reserved.
; Use of this source code is governed by a BSD-style license that can be
; found in the LICENSE file.

; MULTIBOOT
MULTIBOOT_HEADER_MAGIC = 0x1BADB002
MULTIBOOT_PAGE_ALIGN = 1 shl 0
MULTIBOOT_MEMORY_INFO = 1 shl 1
MULTIBOOT_VIDEO_INFO = 1 shl 2
MULTIBOOT_AOUT_KLUDGE = 1 shl 16
MULTIBOOT_HEADER_FLAGS = MULTIBOOT_PAGE_ALIGN or MULTIBOOT_MEMORY_INFO or MULTIBOOT_AOUT_KLUDGE
MULTIBOOT_LOADED_MAGIC = 0x2BADB002
MULTIBOOT_STRUCTURE_NEWLOC = 0x120000
MULTIBOOT_STRUCTURE_MEMORY_NEWLOC = 0x121000

MULTIBOOT_LOAD_DATACODE_LEN = 0
MULTIBOOT_LOAD_DATACODEBSS_LEN = 0

; SYSTEM VARS
SYSTEM_IDT_TABLE_ADDR_64 = 0x0000000000000000
SYSTEM_IDT_TABLE_ADDR_64_32len = 0x00000000 ; same but 32 bit
SYSTEM_IDT_COUNT = 256
SYSTEM_IDT_LEN_BYTES = 16

SYSTEM_GDT_TABLE_ADDR_64 = 0x0000000000001000
SYSTEM_GDT_TABLE_ADDR_64_32len = 0x00001000	; same but 32 bit

; STACK AT 22 MiB
SYSTEM_STACK_32BIT = 0x1600000
SYSTEM_STACK_64BIT = 0x1600000

;PAGING
PAGING_PML4_ADDR = 0x00002000
PAGING_PML4_OPTIONS = 0x8

PAGING_PDP_COUNT = 1
PAGING_PDP_ADDR = 0x00003000
PAGING_PDP_OPTIONS = 0x7

PAGING_PD_COUNT = 512
PAGING_PD_ADDR = 0x00020000
PAGING_PD_OPTIONS = 0x7

PAGING_PHYS_PAGE_OPTIONS = 0x0000008F

; 0x00002000      PML4#1 ---|
; 0x00003000      PDP#1  <--|
;   ...
; 0x00020000      PD#1
;   ...