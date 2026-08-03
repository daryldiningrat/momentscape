"use client";

import { useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

const sectionTypes = [
  { type: "hero" as const, label: "Hero", icon: "🖼️" },
  { type: "story" as const, label: "Story", icon: "📖" },
  { type: "schedule" as const, label: "Schedule", icon: "📅" },
  { type: "gallery" as const, label: "Gallery", icon: "🖼️" },
  { type: "map" as const, label: "Map", icon: "🗺️" },
  { type: "rsvp" as const, label: "RSVP", icon: "✉️" },
  { type: "custom" as const, label: "Custom", icon: "✏️" },
];
type SectionType = (typeof sectionTypes)[number]["type"];

interface Section {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  order: number;
  visible: boolean;
}

function SortableSection({
  section,
  onUpdate,
  onRemove,
  onToggle,
}: {
  section: Section;
  onUpdate: (id: string, field: string, value: string | boolean) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: section.visible ? "#1a1a1a" : "#111",
  };

  return (
    <div ref={setNodeRef} style={{ ...style, padding: "0.75rem", borderRadius: 6, border: "1px solid #333", marginBottom: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div {...attributes} {...listeners} style={{ cursor: "grab", fontSize: "1.25rem", userSelect: "none" }}>
          ⠿
        </div>
        <select
          value={section.type}
          onChange={(e) => onUpdate(section.id, "type", e.target.value)}
          style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", border: "1px solid #444", borderRadius: 4, backgroundColor: "#222", color: "#fafafa", flex: 1 }}
        >
          {sectionTypes.map((st) => (
            <option key={st.type} value={st.type}>{st.icon} {st.label}</option>
          ))}
        </select>
        <input
          value={section.title}
          onChange={(e) => onUpdate(section.id, "title", e.target.value)}
          placeholder="Title"
          style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", border: "1px solid #444", borderRadius: 4, backgroundColor: "#222", color: "#fafafa", flex: 2 }}
        />
        <button
          onClick={() => onToggle(section.id)}
          title={section.visible ? "Hide" : "Show"}
          style={{ padding: "0.2rem 0.4rem", fontSize: "0.75rem", backgroundColor: section.visible ? "#059669" : "#444", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
        >
          {section.visible ? "👁" : "—"}
        </button>
        <button
          onClick={() => onRemove(section.id)}
          style={{ padding: "0.2rem 0.5rem", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: "0.875rem" }}
        >
          ×
        </button>
      </div>
      <textarea
        value={section.content}
        onChange={(e) => onUpdate(section.id, "content", e.target.value)}
        placeholder="Section content..."
        rows={2}
        style={{ marginTop: "0.5rem", width: "100%", padding: "0.5rem", fontSize: "0.75rem", border: "1px solid #444", borderRadius: 4, backgroundColor: "#222", color: "#fafafa", resize: "vertical" }}
      />
    </div>
  );
}

export default function SectionsEditor({
  sections,
  onChange,
}: {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function addSection(type: SectionType) {
    const newSection: Section = {
      id: "sec-" + Date.now(),
      type,
      title: "",
      content: "",
      order: sections.length,
      visible: true,
    };
    onChange([...sections, newSection]);
  }

  function updateSection(id: string, field: string, value: string | boolean) {
    onChange(sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  function removeSection(id: string) {
    onChange(sections.filter((s) => s.id !== id));
  }

  function toggleVisibility(id: string) {
    onChange(sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const reordered = [...sections];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    onChange(reordered.map((s, i) => ({ ...s, order: i })));
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
        {sectionTypes.map((st) => (
          <button
            key={st.type}
            onClick={() => addSection(st.type)}
            style={{
              padding: "0.4rem 0.75rem",
              fontSize: "0.75rem",
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              borderRadius: 6,
              color: "#fafafa",
              cursor: "pointer",
            }}
          >
            {st.icon} {st.label}
          </button>
        ))}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              onUpdate={updateSection}
              onRemove={removeSection}
              onToggle={toggleVisibility}
            />
          ))}
        </SortableContext>
      </DndContext>

      {sections.length === 0 && (
        <p style={{ color: "#666", fontSize: "0.875rem", textAlign: "center", padding: "1rem" }}>
          No sections yet. Click a section type above to add one.
        </p>
      )}
    </div>
  );
}
